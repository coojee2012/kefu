import { Injector, ReflectiveInjector, Injectable } from 'injection-js';
import { Queue as BullQueue, Job, QueueOptions } from 'bull';
import { ConfigService } from '../service/ConfigService';
import { LoggerService } from '../service/LogService';
import { QueueWorkerService } from './QueueWorkerService';
import { EventService } from '../service/EventService';
import { FreeSwitchPBX, uuidPlayAndGetDigitsOptions } from './FreeSwitchPBX';
import { RuntimeData } from './RunTimeData';

import { PBXCallProcessController } from '../controllers/pbx_callProcess';
import { PBXQueueController } from '../controllers/pbx_queue';
import { PBXQueueStatisticController } from '../controllers/pbx_queueStatistic';
import { PBXAgentStatisticController } from '../controllers/pbx_agentStatistic';
import { PBXCDRController } from '../controllers/pbx_cdr';
import { PBXQueueModel } from '../models/pbx_queues';
import { PBXExtensionController } from '../controllers/pbx_extension';
import { TenantController } from '../controllers/tenant';

@Injectable()
export class Queue {

    private cgrReqType: string;
    private queueWorker: QueueWorkerService;
    private logger: LoggerService;
    private config: ConfigService;
    private eventService: EventService;
    private bullQueue: BullQueue;
    private fsPbx: FreeSwitchPBX;
    private runtimeData: RuntimeData;

    private pbxCallProcessController: PBXCallProcessController;
    private pbxQueueController: PBXQueueController;
    private pbxQueueStatisticController: PBXQueueStatisticController;
    private pbxAgentStatisticController: PBXAgentStatisticController;
    private pbxExtensionController:PBXExtensionController;
    private pbxTenantController:TenantController;
    private cdrControl: PBXCDRController;
    private originationUuid: string;
    private hangupBySystem: string;

    private setIntervalTimeout: NodeJS.Timer;
    private startTime: number;
    private queueJob: Job;

    private vipLevel: number;
    private maxLevel: number;
    private priority: number;
    private queue: PBXQueueModel;
    private findQueueMemberExec: boolean;
    private isCallerHangup: boolean;
    private agentEndState: string;

    constructor(private injector: Injector) {
        this.logger = this.injector.get(LoggerService);
        this.queueWorker = this.injector.get(QueueWorkerService);
        this.eventService = this.injector.get(EventService);

        this.fsPbx = this.injector.get(FreeSwitchPBX);

        this.pbxQueueController = this.injector.get(PBXQueueController);
        this.pbxCallProcessController = this.injector.get(PBXCallProcessController);
        this.pbxQueueStatisticController = this.injector.get(PBXQueueStatisticController);
        this.pbxTenantController = this.injector.get(this.pbxTenantController);
        this.pbxExtensionController = this.injector.get(PBXExtensionController);

        this.runtimeData = this.injector.get(RuntimeData);

        this.isCallerHangup = false;

    }
    /**
   * @description
   * 拨打队列
   * @param queueNumber
   * @returns {Promise.<*>}
   */
    async dialQueue(queueNumber: string): Promise<any> {
        try {
            this.logger.debug(`queueNumber:${queueNumber},sipRegInFS:${this.config.getConfig().sipRegInFS}`);
            const { tenantId, callId, caller, callee: called, routerLine } = this.runtimeData.getRunData();
            const tenantInfo = await this.runtimeData.getTenantInfo();
            this.agentEndState = 'idle';
            const bullQueueName = `esl_q_queue::${tenantId}::${queueNumber}`;
            this.bullQueue = await this.queueWorker.add(tenantId, queueNumber);
            this.addBullQueueMonitor();

            const result = {
                success: false,
                app: 'dial-queue',
                gotoIvrNumber: '', // 队列执行完毕后,去向IVR
                gotoIvrActId: 1,
                callerHangup: false,
                answered: false,
                hasDone: false,
                agentNumber: '',
            }


            //_this.R.logger.debug('DEBUG_CONFIG:', _this.R.config);
            const agentType = this.config.getConfig().sipRegInFS ? 'user' : 'kamailio';
            this.queue = await this.pbxQueueController.getQueue(tenantId, queueNumber);
            const enterQueueTime = await this.fsPbx.getChannelVar('queue_enter_time', callId);

            this.pbxCallProcessController.create({
                caller,
                called: queueNumber,
                tenantId,
                callId,
                processName: 'queue',
                passArgs: { number: queueNumber, queueName: this.queue.queueName },
            });

            // 用户没有设置reqType
            this.cgrReqType = await this.fsPbx.getChannelVar('cgr_reqtype', callId);
            if (this.queue && this.cgrReqType) {
                const { queueName, queue: queueConf } = this.queue;
                const { maxWaitTime, enterTipFile } = queueConf;

                this.logger.debug(`queue find in DB:${queueName}`);

                // _this.setQueueWaitingInfo(tenantId, queueNumber, queueName);
                // 设置队列排队的信息 更新到前端

                this.startTime = new Date().getTime();
                await this.pbxQueueStatisticController.create({
                    callId,
                    tenantId,
                    queueNumber,
                    onDutyAgents: this.queue.members,
                });

                if (!this.queue.members.length) {
                    this.logger.debug('=====ENTER A EMPTY QUEUE=====');
                    await this.enterEmptyQueue();
                    return Promise.resolve(result);
                }

                const findQueueMemberEvent = `esl::callcontrol::queue::finded::member::${tenantId}::${callId}`;
                const callerHangupEvent = `esl::event::CHANNEL_HANGUP::${callId}`;

                this.vipLevel = 0; //await service.httppbx.checkPhoneVIP(tenantId, caller);

                const maxLowLevel = 540; // 越高优先级越低
                this.priority = maxLowLevel - this.vipLevel * 30;

                // 进入队列提醒
                if (enterTipFile) {
                    this.logger.debug(`进入队列提醒:${enterTipFile}`);
                    const enterTipFile2 = await this.fillSoundFilePath(enterTipFile);
                    await this.fsPbx.uuidPlayback({
                        uuid: callId,
                        terminators: 'none',
                        file: enterTipFile2,
                    });
                }




                // 每隔1秒检查是否超时了
                this.setIntervalTimeout = setInterval(this.timoutCheck.bind(this), 1000);

                let findQueueMemberExec = false;


                // 未应答前主叫挂机,坐席接听电话后将取消这个监听

                this.fsPbx.addConnLisenter(callerHangupEvent, 'once', this.callerHangupHandle.bind(this))
                this.fsPbx.addConnLisenter(`esl::event::PLAYBACK_START::${callId}`, 'once', this.onPlaybackStart.bind(this));


                this.eventService.on(findQueueMemberEvent, this.onFindQueueMember.bind(this));

                this.logger.debug('=====PLAY QUEUE MUSIC START=====');
                await this.fsPbx.uuidPlayback({
                    uuid: callId,
                    terminators: 'none',
                    file: this.queue.queue.mohSound || 'local_stream://moh/8000'
                });
                this.logger.debug('=====PLAY QUEUE MUSIC STOP=====');
                // 下面的代码只有在answer之后才能执行，或者提前执行uuid_break后才会执行
                await new Promise((resolve) => {
                    this.logger.debug('等待桥接！');
                    if (result.callerHangup) {
                        resolve(result);
                    }
                    else {
                        this.eventService.once(`queue::after::bridge::${callId}`, () => {
                            this.fsPbx.removeConnLisenter(callerHangupEvent, this.callerHangupHandle.bind(this));
                            this.eventService.removeListener(findQueueMemberEvent, this.onFindQueueMember.bind(this));
                            resolve();
                        });
                    }
                });
                await this.fsPbx.wait(300);
                await new Promise((resolve, reject) => {
                    this.logger.debug('FIND_QUEUE_MEMBER_DONE:', result);
                    let doneOver = false;
                    const doneAfter = async () => {
                        try {
                            await _this.afterQueueEnd({
                                answered: result.answered,
                                agentNumber: result.agentNumber,
                                queueNumber,
                            });
                            return Promise.resolve();
                        } catch (ex) {
                            return Promise.reject(ex);
                        }
                    };

                    if (!result.answered) {
                        resolve();
                    }
                    else {
                        const { answered, agentNumber: whoAnswered } = result;
                        const onAgentHangup = async (evt) => {
                            try {
                                this.logger.debug(`FIND_QUEUE_MEMBER_DONE中监听到坐席${whoAnswered}挂机了!`);
                                await doneAfter();
                                if (!doneOver) {
                                    doneOver = true;
                                    const timestamp = new Date().getTime();


                                    _this.R.service.agentStatistics.hangupCall({
                                        callId: _this.R.callId,
                                        bLegId: _this.R.originationUuid,
                                        hangupCase: 'agent',
                                    });

                                    _this.R.service.callProcess.create({
                                        caller: _this.R.caller,
                                        called: String(whoAnswered),
                                        tenantId,
                                        callId,
                                        processName: 'hangup',
                                        passArgs: { number: String(whoAnswered), agentId: _this.R.agentId, hangupMsg: '结束通话' },
                                    });

                                    if (queueConf && queueConf.transferStatic) {
                                        _this.R.service.queueStatistics.transferStatic({
                                            callId: _this.R.callId,
                                            tenantId: _this.R.tenantId,
                                            queueNumber,
                                        });
                                    }
                                    _this.R.service.queueStatistics.hangupCall({
                                        callId: _this.R.callId,
                                        tenantId: _this.R.tenantId,
                                        queueNumber,
                                        hangupCase: 'agent',
                                    });
                                    _this.R.alegHangupBy = 'agent';
                                    const roommId = _this.R.originationUuid ? `${callId}_${_this.R.originationUuid}` : callId;
                                    _this.R.service.queue.hangupBy({ tenantId, callId: roommId, hangupBy: 'agent' });
                                }
                                resolve();
                            }
                            catch (ex) {
                                reject(ex);
                            }
                        };
                        const onCallerHangup = async (evt) => {
                            try {
                                _this.R.logger.debug(loggerPrefix, 'FIND_QUEUE_MEMBER_DONE中监听到主叫挂机了!');
                                if (!doneOver) {
                                    doneOver = true;
                                    _this.R.satisData.hangup = true;
                                    result.callerHangup = true;
                                    const timestamp = new Date().getTime();
                                    const fluentData = Object.assign({}, _this.callControlMessageOriginData, {
                                        type: 'hangUp-queue',
                                        bLegId: _this.R.originationUuid,
                                        timestamp,
                                        agentId: _this.R.agentId,
                                        agentNumber: String(whoAnswered),
                                        answerTime: _this.answerTime,
                                        queueName: queue.queueName,
                                        queueNumber,
                                        tryCall: _this.tryCallAgentTimes,
                                        ringingTime: _this.ringTime,
                                        by: 'visitor',
                                    });
                                    _this.R.logger.debug('callControlMessageOriginData VisitorHangupFirst ', fluentData);
                                    process.fluent['callControlMessageOrigin'].log(fluentData);

                                    service.agentStatistics.hangupCall({
                                        callId: _this.R.callId,
                                        bLegId: _this.R.originationUuid,
                                        hangupCase: 'user',
                                    });
                                    service.queueStatistics.hangupCall({
                                        callId: _this.R.callId,
                                        tenantId: _this.R.tenantId,
                                        queueNumber,
                                        hangupCase: 'user',
                                    });

                                    _this.R.alegHangupBy = 'visitor';

                                    _this.R.service.queue.hangupBy({ tenantId, callId: `${callId}_${_this.R.originationUuid}`, hangupBy: _this.R.alegHangupBy });
                                    // await doneAfter();
                                    // resolve();
                                }
                            } catch (ex) {
                                reject(ex);
                            }
                        };

                        const onDisconnect = async (evt) => {
                            try {
                                if (evt.getHeader('Controlled-Session-UUID') === callId) {
                                    if (!doneOver) {
                                        doneOver = true;
                                        // await doneAfter();
                                        resolve();
                                    }
                                }
                            } catch (ex) {
                                reject(ex);
                            }
                        };

                        _this.R.pbxApi.conn.once(`esl::event::CHANNEL_HANGUP::${_this.R.originationUuid}`, onAgentHangup);

                        _this.R.pbxApi.conn.once(`esl::event::CHANNEL_HANGUP::${callId}`, onCallerHangup);


                        // TODO 在坐席统计表中,发现挂机由system的原因可能是这里引起的,如果先监听到此事件,是否能从evt中获取到是谁引起的挂机,否者要考虑如何确定
                        _this.R.pbxApi.conn.once('esl::event::disconnect::notice', onDisconnect);

                        if (_this.R.tenantInfo && _this.R.tenantInfo.recordCall !== false) {
                            _this.R.recordFiles[_this.R.callId] = `${_this.R.callId}`;
                            _this.R.pbxApi.uuidRecord(_this.R.callId, 'start', _this.R.tenantId, _this.R.config.s3FileProxy, _this.R.recordFiles[_this.R.callId])
                                .then(res => {
                                    _this.R.service.record.create({
                                        tenantId: _this.R.tenantId,
                                        direction: _this.R.callType,
                                        callId: _this.R.callId,
                                        filename: `${_this.R.recordFiles[_this.R.callId]}`,
                                        agentId: `${_this.R.agentId}`,
                                        extension: whoAnswered,
                                    });
                                    _this.R.logger.debug(loggerPrefix.concat(['dialQueue']), '启动录音成功!');
                                })
                                .catch(err => {
                                    _this.R.logger.error(loggerPrefix.concat(['dialQueue']), '启动录音失败:', err);
                                });
                        }


                        if (queueConf && queueConf.transferStatic) {
                            _this.R.satisData.sType = 'queue';
                            _this.R.satisData.agentId = _this.R.agentId;
                            _this.R.satisData.answerTime = _this.answerTime;
                            _this.R.satisData.agentNumber = whoAnswered;
                            _this.R.satisData.agentLeg = _this.R.originationUuid;
                            _this.R.satisData.ringTime = _this.ringTime;
                            _this.R.satisData.queueName = queue.queueName;
                            _this.R.satisData.queueNumber = queueNumber;
                            // TODO 从配置文件中读取满意度IVR
                            _this.R.satisData.gotoIvrNumber = 166;
                            _this.R.satisData.gotoIvrActId = 1;
                            result.gotoIvrNumber = 166;
                            result.gotoIvrActId = 1;

                            _this.R.transferData.afterTransfer = 'satisfaction';
                        }

                        service.queueStatistics.answerCall({
                            callId: _this.R.callId,
                            tenantId: _this.R.tenantId,
                            queueNumber,
                            answerAgent: whoAnswered,
                            answerAgentId: _this.R.agentId,
                        });
                    }
                });
                return Promise.resolve(result);
            }
            else {
                return Promise.reject('Queue is not find in DB!');
            }
        }
        catch (ex) {
            this.logger.error('ESL DialQueue Error:', ex);
            return Promise.reject(ex);
        }
    }

    addBullQueueMonitor() {
        this.bullQueue.on('error', (error) => {
            // An error occured.
            this.logger.error('bullqueue error:', error);
        })
            // .on('active', function(job, jobPromise){
            //   // A job has started. You can use `jobPromise.cancel()`` to abort it.
            //   console.log('bullqueue active', job);
            //   jobPromise.cancel();
            // })
            // .on('stalled', function(job){
            //   // A job has been marked as stalled. This is useful for debugging job
            //   // workers that crash or pause the event loop.
            //   console.log('bullqueue stalled')
            // }) 
            .on('progress', function (job, progress) {
                // A job's progress was updated!
                console.log('bullqueue progress')
            })
            .on('completed', function (job, result) {
                // A job successfully completed with a `result`.
                console.log('bullqueue completed')
            })
            .on('failed', function (job, err) {
                // A job failed with reason `err`!
                console.log('bullqueue failed')
            })
        // .on('global:failed', function(job, err) {
        //   console.log(`global:failed Job :`,job,err);
        // })
        // .on('cleaned', function(jobs, type) {
        //   // Old jobs have been cleaned from the queue. `jobs` is an array of cleaned
        //   // jobs, and `type` is the type of jobs cleaned.
        //   console.log('bullqueue cleaned',type)
        // });
    }

    async timoutCheck() {
        try {
            let busyTipTime = this.startTime;
            let isDoneTimeoutTip = false;
            let isDoneBusyTip = false;
            const now = new Date().getTime();
            if (isDoneBusyTip || isDoneTimeoutTip) {
                this.logger.debug('有其他提示任务在处理中');
                busyTipTime = now;
                this.startTime = now;
                return;
            }
            const diffTime = now - this.startTime;
            const busyTipCheckTime = now - busyTipTime;
            this.logger.debug(`queue intervale diffTime=${diffTime},busyTipCheckTime=${busyTipCheckTime}`);
            const { queueName, queueNumber, queue: queueConf } = this.queue;
            const { maxWaitTime, enterTipFile } = queueConf;
            // 超时时处理
            if (diffTime > maxWaitTime * 1000 && !isDoneTimeoutTip && !isDoneBusyTip) {
                isDoneTimeoutTip = true;
                const res = await this.dialMemberTimeOut();
                // 客户选择继续等待
                if (res && res.wait) {
                    this.startTime = new Date().getTime();
                }
                // 客户挂机
                else {
                }
                isDoneTimeoutTip = false;
            }
            // 默认30秒提醒一次
            else if (busyTipCheckTime > 30 * 1000 && !isDoneBusyTip && !isDoneTimeoutTip) {
                isDoneBusyTip = true;
                this.logger.debug('坐席全部忙!');
                const {
                    abtFile,
                    abtKeyTimeOut = 15,
                    abtWaitTime = 30,
                    abtInputTimeoutFile,
                    abtInputTimeoutEndFile,
                    abtInputErrFile,
                    abtInputErrEndFile,
                    abtTimeoutRetry = 2,
                    abtInputErrRetry = -1,
                } = this.queue.queue;
                const res = await this.allBusyTip({
                    abtFile,
                    abtKeyTimeOut,
                    abtWaitTime,
                    abtInputTimeoutFile,
                    abtInputTimeoutEndFile,
                    abtInputErrFile,
                    abtInputErrEndFile,
                    abtTimeoutRetry,
                    abtInputErrRetry,
                })
                this.logger.debug(`队列全忙，用户是否选择继续等待:${res}`);
                if (res) {
                    busyTipTime = new Date().getTime();
                }
                isDoneBusyTip = false;
            }
            else {
                this.logger.debug('队列时间检查！');
            }
        }
        catch (ex) {
            this.logger.error('队列时间检查,发生异常:', ex);
            if (this.setIntervalTimeout) {
                clearInterval(this.setIntervalTimeout);
            }
        }
    }

    async onPlaybackStart(evt) {
        try {
            const { tenantId, callId, caller, callee: called, routerLine } = this.runtimeData.getRunData();
            this.logger.debug('Queue PLAYBACK_START Core-UUID:', evt.getHeader('Core-UUID'));
            const { queueName, queueNumber, queue: queueConf } = this.queue;
            const { maxWaitTime, enterTipFile } = queueConf;

            this.queueJob = await this.bullQueue.add({
                callId: callId,
                tenantId: tenantId,
                queue: this.queue,
            }, {
                    priority: this.priority < 1 ? 1 : this.priority,
                    // jobId: _this.R.callId,
                    timeout: (maxWaitTime + 1) * 1000 * 3,
                    // timeout: 30 * 1000,
                });

            this.logger.debug('On Playback Start Result Job:', this.queueJob ? this.queueJob.id : 'NULL');
            this.setQueueWaitingInfo(tenantId, queueNumber, queueName);
            // VIP用户强行取出当前正在active的普通用户，并插入VIP
            if (this.vipLevel && this.vipLevel > 0) {
                await this.insertVip();
            }
        } catch (ex) {
            this.logger.error('On Playback Start Error:', ex);
        }
    }

    async onFindQueueMember(agentInfo) {
        try {
            const { tenantId, callId, caller, callee: called, routerLine } = this.runtimeData.getRunData();
            const agentType = this.config.getConfig().sipRegInFS ? 'user' : 'kamailio';
            const { queueName, queueNumber, queue: queueConf } = this.queue;
            const { maxWaitTime, enterTipFile } = queueConf;
            const result = {
                agentNumber: '',
                success: false,
                answered: false,
                hasDone: false
            }
            this.findQueueMemberExec = true;
            if (this.setIntervalTimeout) {
                clearInterval(this.setIntervalTimeout);
            }
            this.logger.debug('findQueueMemberEvent return', agentInfo);
            result.agentNumber = agentInfo.accountCode;
            if (this.isCallerHangup) {
                this.logger.info('find one but Caller is Hangup');
            }
            else if (agentInfo && agentInfo.accountCode) {
                const startCallAgentTime = new Date();
                const dialResult = await this.dialQueueMember({
                    agentInfo,
                    queueInfo: this.queue,
                    agentType,
                });
                this.logger.debug('dialQueueMember result:', dialResult);
                // 不成功重新放回队列
                if (this.isCallerHangup) {
                    this.logger.info('When find Queue Member, Caller is Hangup');
                }
                else if (!dialResult.success) {
                    this.priority = this.priority - 1;
                    this.findQueueMemberExec = false;
                    this.queueJob = await this.bullQueue.add({
                        callId: callId,
                        tenantId: tenantId,
                        queue: this.queue,
                    }, {
                            priority: this.priority < 1 ? 1 : this.priority,
                            timeout: (maxWaitTime + 1) * 1000 * 3,
                            //timeout: 30 * 1000,
                        });
                    this.logger.debug('不成功重新放回队列:', this.queueJob ? this.queueJob.id : 'NULL');
                    this.setQueueWaitingInfo(tenantId, queueNumber, queueName);
                    // 每隔1秒检查是否超时了
                    this.setIntervalTimeout = setInterval(this.timoutCheck.bind(this), 1000);
                    if (this.vipLevel && this.vipLevel > 0) {
                        await this.insertVip();
                    }
                }
                else {
                    result.success = true;
                    result.answered = true;
                    result.hasDone = true;
                    this.setQueueWaitingInfo(tenantId, queueNumber, queueName);
                    if (agentInfo.phoneLogin === 'yes') {
                        const { channelName, useContext } = this.runtimeData.getChannelData();
                        const tenantInfo = this.runtimeData.getTenantInfo();
                        await this.cdrControl.create({
                            tenantId,
                            routerLine: routerLine,
                            srcChannel: channelName,
                            context: useContext,
                            caller: caller,
                            called: agentInfo.phoneLogin === 'yes' ? agentInfo.phoneNumber : agentInfo.accountCode,
                            callId: this.originationUuid,
                            recordCall: true,//tenantInfo.recordCall,
                            isTransfer: false,
                            agiType: 'queue-leg',
                            isClickOut: false,
                            starTime: startCallAgentTime,
                            agent: String(agentInfo.accountCode),
                            callFrom: '',
                            callTo: agentInfo.phoneLogin === 'yes' ? agentInfo.phoneNumber : agentInfo.accountCode,
                            answerTime: new Date(),
                            answerStatus: 'answered',
                            associateId: callId,
                        });
                    }
                }
            }
            // 
            else {
                this.logger.error('findQueueMemberEvent Error', agentInfo);
            }
        }
        catch (ex) {
            this.logger.error('onFindQueueMember:', ex);
        }
    }

    async callerHangupHandle(evt) {
        try {
            result.callerHangup = true;
            result.hasDone = true;
            // if (findQueueMemberExec) {
            //   _this.R.logger.debug(loggerPrefix, '已经找到坐席');
            //   return Promise.resolve();
            // }
            this.logger.debug(`主叫在队列中排队等候中先挂机!hangupBySystem=${this.hangupBySystem}`);
            // _this.R.EE3.off(findQueueMemberEvent, onFindQueueMember);

            if (setIntervalTimeout) {
                clearInterval(setIntervalTimeout);
            }

            if (queueJob) {
                queueJob.getState()
                    .then(state => {
                        this.logger.error('jobGetState', state);
                        if (state !== 'active' && state !== 'stalled') {
                            return queueJob.remove();
                        }
                        else {
                            await this.stopFindAgentJob(queueJob.id);
                        }
                    })
                    .then(res => {
                        this.logger.debug('jobRemoveResult', res);
                    })
                    .catch(err => {
                        this.logger.error('jobGetStateError', err);
                    });
            }

            this.fsPbx.wait(3000)
                .then(res => {
                    this.setQueueWaitingInfo(tenantId, queueNumber, queueName);
                })
                .catch(err => {
                    this.logger.error('after hangup setQueueWaitingInfo error:', err);
                });

            _this.R.service.queue.giveupInQueue({ tenantId, callNum: caller, callId, queueName });
            _this.R.alegHangupBy = _this.hangupBySystem ? 'system' : 'visitor';
            _this.R.service.queue.hangupBy({ tenantId, callId: `${callId}_${_this.R.originationUuid}`, hangupBy: _this.R.alegHangupBy });

            const fluentData = Object.assign({}, _this.callControlMessageOriginData, {
                type: 'hangUp-queue',
                queueNumber: queue.queueNumber,
                queueName: queue.queueName,
                timestamp: parseInt(new Date().getTime()),
                by: 'visitor',
            });
            _this.R.logger.debug('callControlMessageOriginData LeaveQueueByVisitor ', fluentData);
            process.fluent['callControlMessageOrigin'].log(fluentData);

            // await _this.bullQueue.empty();

            const tasks = [];

            tasks.push(

                _this.R.service.queueStatistics.hangupCall({
                    callId: _this.R.callId,
                    tenantId: _this.R.tenantId,
                    queueNumber,
                    hangupCase: 'ring',
                })

            )

            tasks.push(
                _this.R.service.agentStatistics.hangupCall({
                    callId: _this.R.callId,
                    bLegId: _this.R.originationUuid,
                    hangupCase: 'ring',
                })

            )


            tasks.push(

                _this.afterQueueEnd({
                    answered: false,
                    agentNumber: result.agentNumber,
                    queueNumber: queue.queueNumber,
                })

            )



            // 挂掉响铃中的坐席
            tasks.push(
                _this.R.pbxApi.uuidKill(_this.R.originationUuid, `Caller Is Hangup Yet!${_this.R.originationUuid}`)
            )
            await Promise.all(tasks);

            if (findQueueMemberExec) {
                EE3.emit(`queue::after::bridge::${callId}`);
            }
        }
        catch (ex) {
            _this.R.logger.error('Done Caller Hangup ERROR:', ex);
        }
    }

    async insertVip() {
        // try {
        //     this.logger.debug(`vipLevel:${vipLevel}`);

        //     const activeJobs = await this.bullQueue.getActive();
        //     this.logger.debug(`activeJobs:${activeJobs.length}`);
        //     const needToReAddJobs = [];
        //     for (let j = 0; j < activeJobs.length; j++) {
        //         const job = activeJobs[j];
        //         const oldJobOpts = job.opts;
        //         const oldJobId = job.id;
        //         if (oldJobOpts.priority > vipPriority && vipJob.id !== oldJobId) {
        //             needToReAddJobs.push(job);
        //         }
        //     }

        //     needToReAddJobs.sort((a, b) => {
        //         return a.opts.timestamp - b.opts.timestamp;
        //     });


        //     while (needToReAddJobs.length) {
        //         const oldJob = needToReAddJobs.shift();
        //         await service.queue.stopFindAgentJob(oldJob.id);
        //         // 不用等待是否结束，就插入进新的队列
        //         // TODO 处理等待那边是否真的结束了该jobId,然后决定是否重新加入队列
        //         const failEventName = `queue::job::fail::${tenantId}::${oldJob.data.callId}::${oldJob.id}`;
        //         logger.debug(loggerPrefix, `failEventName:${failEventName}`);
        //         await new Promise((resolve, reject) => {
        //             let timeOut = false;
        //             let isStoped = false;
        //             EE3.once(failEventName, () => {
        //                 logger.debug(loggerPrefix, `监听到job失败事件:timeOut = ${timeOut}`);
        //                 if (!timeOut) {
        //                     isStoped = true;
        //                     resolve();
        //                 }
        //             });
        //             setTimeout(() => {
        //                 logger.debug(loggerPrefix, `监听到job失败setTimeout函数:isStoped = ${isStoped}`);
        //                 timeOut = true;
        //                 if (!isStoped) {
        //                     reject('等待worker返回fail的结果超过20秒！');
        //                 }
        //             }, 20 * 1000);
        //         });
        //         logger.debug(loggerPrefix, `重新插入active JOB${oldJob.id}到队列排队`);
        //         const reNewJob = await _this.bullQueue.add(oldJob.data, {
        //             priority: oldJob.opts.priority - 1,
        //             // jobId: _this.R.callId,
        //             timeout: oldJob.opts.timeout,
        //             // timeout: 30 * 1000,
        //         });
        //         logger.info(loggerPrefix, `VIP插队后,原来的job:${oldJob.id}重新插入队列后变成:${reNewJob ? reNewJob.id : 'NULL'}`);
        //         if (needToReAddJobs.length) {
        //             await _this.wait(100);
        //         }
        //     }
        //     return Promise.resolve();
        // } catch (ex) {
        //     return Promise.reject(ex);
        // }
    }


    async dialQueueMember({agentInfo}) {
        const _this = this;
        const dialMemberResult = {
            success: false,
            reason: '',
        };
        let pubData = null;

        try {
            const { tenantId, callId, caller, callee: called, routerLine } = this.runtimeData.getRunData();
            const { phoneNumber, accountCode, phoneLogin, agentId } = agentInfo;
            const { queueName, queueNumber, queue: queueConf } = this.queue;
            const { maxWaitTime, enterTipFile,forceDND,callerId } = queueConf;
            await this.pbxExtensionController.setAgentLastCallId(tenantId, accountCode, callId);

            let dialStr = `sofia/external/${accountCode}@${tenantId}`;

            let loginType = 'web';
            if (phoneLogin === 'yes') {
                if (phoneNumber && phoneNumber.length > 4) {
                
                    const { dnd, gateway } = await this.pbxTenantController.getDialGateWay({
                        tenantId,
                        callId,
                        dnd: callerId,
                        forceDND,
                    });
                    this.gateway = gateway;
                    this.DND = dnd;

                    if (this.gateway && this.gateway !== '') {
                        dialStr = `sofia/external/${phoneNumber}@${this.gateway}`;
                    } else {
                        dialStr = `sofia/external/${phoneNumber}@${tenantId}`;
                    }
                    this.agentEndState = 'waiting';
                    loginType = 'phone';
                    this.cgrCategory = 'call_out';
                }
                // 用思科的分机号当做是手机签入
                else {
                    // 通过phoneNumber的第一位去匹配路由规则,有一定的局限性
                    // try {
                    //     const callerId = await _this.R.dbi.router.getCiscoCaller(tenantId, phoneNumber);
                    //     const gateway = await _this.R.dbi.trunk.getGatewayByDND(callerId);
                    //     if (callerId && gateway && gateway !== '') {
                    //         dialStr = `sofia/external/${phoneNumber}@${gateway}`;
                    //     } else {
                    //         dialStr = `sofia/external/${phoneNumber}@${tenantId}`;
                    //     }
                    //     _this.endState = AGENTSTATE.waiting;
                    //     loginType = 'phone';
                    //     _this.cgrCategory = 'call_internal';
                    // } catch (ex) {
                    //     logger.error('思科分机发生错误:', ex);
                    // }
                }
            }
            if (agentType == 'user') {
                dialStr = `user/${accountCode}`;
            }

            this.originationUuid = await this.fsPbx.createUuid();
            _this.R.agentLeg[`${accountCode}`] = _this.R.originationUuid;
            _this.R.agentId = agentId;


            _this.tryCallAgentTimes = _this.tryCallAgentTimes + 1;
            pubData = {
                tenantId,
                agentId,
                agent: accountCode,
                state: '',
                fromQueue: 'yes',
                fsName: _this.R.fsName,
                fsCoreId: _this.R.fsCoreId,
                callType: _this.R.callType,
                transferCall: _this.R.transferCall,
                isClickOut: _this.R.clickOut === 'yes' ? true : false,
                roomId: _this.R.callId + '_' + _this.R.originationUuid,
                sipCallId: _this.R.pbxApi.getChannelData().sipCallId,
                options: {
                    callId: _this.R.callId + '_' + _this.R.originationUuid,
                    callee: accountCode,
                    caller: _this.R.caller,
                    DND: _this.R.DND,
                    direction: _this.R.direction,
                },
            };

            if (!_this.R.agentId || _this.R.agentId == '') {
                // dialMemberResult.reason = 'ErrorAgentId';
                // return dialMemberResult;
                // throw new Error('ErrorAgentId');
                _this.R.agentId = '';
            }

            _this.cdrUpdateCalled(accountCode, loginType, 'dialQueueMember');
            _this.R.service.cdr.update({ tenantId, callId }, { agent: accountCode });

            _this.R.service.agentStatistics.create({
                callId: _this.R.callId,
                bLegId: _this.R.originationUuid,
                tenantId: _this.R.tenantId,
                queueNumber: queueInfo.queueNumber,
                agentNumber: accountCode,
                agentId: _this.R.agentId,
            });


            await _this.R.service.extension.setAgentState(Object.assign({}, pubData, {
                state: AGENTSTATE.ringing,
                agentId: _this.R.agentId,
            }));
            _this.R.service.callProcess.create({
                caller: _this.R.caller,
                called: accountCode,
                tenantId,
                callId,
                processName: 'ringing',
                passArgs: { number: accountCode, agentId },
            });
            await _this.R.service.agents.newCall({
                tenantId,
                queueNumber: queueInfo.queueNumber,
                agentNumber: accountCode,
            });
            // _this.logger.debug(loggerPrefix, 'newcallRes:', newcallRes);
            // 设置呼叫参数
            const originateArgs = [];
            originateArgs.push('ignore_early_media=true');
            originateArgs.push(`originate_timeout=${queueInfo.queue.ringTimeOut}`);


            originateArgs.push(`origination_uuid=${_this.R.originationUuid}`);
            originateArgs.push('inherit_codec=false');
            originateArgs.push('originate_call=yes');
            originateArgs.push(`originate_tenant=${_this.R.tenantId}`);
            if (loginType === 'phone') {
                originateArgs.push(`origination_caller_id_name=${_this.DND}`);
                originateArgs.push(`origination_caller_id_number=${_this.DND}`);
            } else {
                originateArgs.push(`origination_caller_id_name=${_this.R.caller}`);
                originateArgs.push(`origination_caller_id_number=${_this.R.caller}`);
            }
            // 计费相关参数
            originateArgs.push(`cgr_reqtype=${_this.R.cgrReqType}`);
            originateArgs.push(`cgr_tenant=${_this.R.tenantId}`);
            originateArgs.push(`cgr_subject=${_this.R.pbxApi.getChannelData().sipFromUser}`);
            originateArgs.push('cgr_account=default');
            originateArgs.push(`cgr_category=${_this.cgrCategory}`);
            originateArgs.push('cgr_account=default');
            // originateArgs.push(`direction=inbound`);
            // originateArgs.push(`click_dialout=yes`);
            originateArgs.push('cgr_ignorepark=true');
            originateArgs.push('cgr_takethis=true');
            originateArgs.push('process_cdr=true');
            originateArgs.push(`cgr_destination=${accountCode}`);

            // originateArgs.push('sip_redirect_context=redirected2');

            const argStrs = originateArgs.join(',');
            // 呼叫坐席
            // _this.R.agentId

            _this.ringTime = new Date().getTime();
            const timestamp = new Date().getTime();
            const fluentData = Object.assign({}, _this.callControlMessageOriginData, {
                type: 'ringing-queue',
                bLegId: _this.R.originationUuid,
                timestamp,
                agentId: _this.R.agentId,
                agentNumber: String(accountCode),
                tryCall: _this.tryCallAgentTimes,
                ringingTime: _this.ringTime,
            });
            _this.R.logger.debug('callControlMessageOriginData RingingQueue ', fluentData);
            process.fluent['callControlMessageOrigin'].log(fluentData);

            let start = new Date();
            await _this.R.pbxApi.set({
                'sip_h_X-CID': _this.R.ChannelData.get('variable_sip_call_id'),
            });
            await _this.R.pbxApi.filter('Unique-ID', _this.R.originationUuid);
            _this.R.allLegIds.push(_this.R.originationUuid);
            const oriResult = await _this.R.pbxApi.originateQMember(dialStr, _this.R.originationUuid, argStrs);
            // 坐席应答
            if (oriResult.success) {
                _this.answerTime = new Date().getTime();
                _this.R.service.callProcess.create({
                    caller: _this.R.caller,
                    called: accountCode,
                    tenantId,
                    callId,
                    processName: 'answer',
                    passArgs: { number: accountCode, agentId },
                });
                EE3.emit(`queue::busytip::findagent::${callId}`);
                await _this.R.pbxApi.uuidBreak(_this.R.callId);
                await _this.R.service.extension.setAgentState(Object.assign({}, pubData, { state: AGENTSTATE.inthecall }));




                // await _this.R.pbxApi.uuidDebugMedia(newId);
                // await _this.R.pbxApi.uuidDebugMedia(_this.R.callId);
                await _this.wait(200);
                await _this.R.pbxApi.set({
                    // "hangup_after_bridge": false, //无效很奇怪
                    'park_after_bridge': true,
                });
                const dialResult = await _this.R.pbxApi.uuidBridge(callId, _this.R.originationUuid);
                _this.R.logger.debug(loggerPrefix, 'dialResult:', dialResult);

                // bridge来电成功
                if (dialResult.success) {
                    const timestamp = parseInt(new Date().getTime());
                    _this.R.roomId = `${callId}_${_this.R.originationUuid}`;
                    _this.R.service.agentStatistics.answerCall({ callId: _this.R.callId, bLegId: _this.R.originationUuid });
                    _this.R.service.agents.answerCall({
                        tenantId,
                        queueNumber: queueInfo.queueNumber,
                        agentNumber: accountCode,
                    });
                    // 在cdr中更新呼叫应答
                    _this.db.cdrAnswer('agent', _this.R.originationUuid);
                    _this.R.service.cdr.setAgentId({
                        callId: _this.R.callId,
                        tenantId: _this.R.tenantId,
                        accountCode: _this.R.agentId,
                    });
                    dialMemberResult.success = true;


                    const fluentData = Object.assign({}, _this.callControlMessageOriginData, {
                        type: 'connected-queue',
                        bLegId: _this.R.originationUuid,
                        timestamp,
                        agentId: _this.R.agentId,
                        agentNumber: String(accountCode),
                        tryCall: _this.tryCallAgentTimes,
                        ringingTime: _this.ringTime,
                        answerTime: _this.answerTime,
                    });
                    _this.R.logger.debug('callControlMessageOriginData DialAgentSuccess', fluentData);
                    process.fluent['callControlMessageOrigin'].log(fluentData);

                    // 想客户播放工号
                    if (queueInfo.queue.jobNumberTipFile) {
                        const tipContent = queueInfo.queue.jobNumberTipFile.replace('{accountCode}', accountCode);
                        // await _this.ttsClient.playback(callId, tipContent, _this.R.pbxApi, 'both');
                        await Promise.all([
                            _this.ttsClient.broadcast(callId, tipContent, _this.R.pbxApi, 'aleg'),
                            _this.ttsClient.broadcast(_this.R.originationUuid, tipContent, _this.R.pbxApi, 'aleg'),
                        ]);
                    }
                }
                // bridge失败
                else {
                    _this.R.service.queue.hangupBy({ tenantId, callId: `${callId}_${_this.R.originationUuid}`, hangupBy: 'visitor' });
                    _this.R.alegHangupBy = 'visitor';
                    _this.R.service.agentStatistics.hangupCall({
                        callId: _this.R.callId,
                        bLegId: _this.R.originationUuid,
                        hangupCase: 'visitor',
                    });
                    _this.R.service.extension.setAgentState(Object.assign({}, pubData, {
                        state: _this.endState,
                        hangup: true,
                    }));
                    dialMemberResult.reason = dialResult.reason;
                }
                EE3.emit(`queue::after::bridge::${callId}`);

                return dialMemberResult;
            }
            // 呼叫坐席失败
            else {
                const failType = oriResult.failType;
                const timestamp = parseInt(new Date().getTime());
                const fluentData = Object.assign({}, _this.callControlMessageOriginData, {
                    type: 'hangUp-queue',
                    bLegId: _this.R.originationUuid,
                    timestamp,
                    agentId: _this.R.agentId,
                    agentNumber: String(accountCode),
                    queueNumber: queueInfo.queueNumber,
                    queueName: queueInfo.queueName,
                    tryCall: _this.tryCallAgentTimes,
                    ringingTime: _this.ringTime,
                    by: 'agent',
                });
                _this.R.logger.debug(`callControlMessageOriginData DialAgentFail ${failType}`, fluentData);
                process.fluent['callControlMessageOrigin'].log(fluentData);
                let hangupMsg = '超时未接听';

                switch (failType) {
                    // 用户忙线中
                    case 'USER_BUSY':
                        hangupMsg = '用户忙线';
                        break;
                    // 正常的挂断，比如系统发起的hangup等
                    case 'NORMAL_CLEARING':

                        break;
                    // 用户拒接
                    case 'CALL_REJECTED':
                        hangupMsg = '用户拒接';
                        break;
                    default:
                        break;
                }
                // _this.R.service.queue.hangupBy({ tenantId, callId: `${callId}_${_this.R.originationUuid}`, hangupBy: 'system' });
                await _this.R.service.extension.setAgentState(Object.assign({}, pubData, {
                    state: _this.endState,
                    hangup: true,
                }));
                await _this.R.service.agents.noAnsweredCall({
                    tenantId,
                    queueNumber: queueInfo.queueNumber,
                    agentNumber: accountCode,
                });
                // TODO 将来在这里编写根据呼叫坐席失败的原因，需要处理的业务数据等
                _this.R.service.agentStatistics.hangupCall({
                    callId: _this.R.callId,
                    bLegId: _this.R.originationUuid,
                    hangupCase: 'agent',
                });


                _this.R.service.callProcess.create({
                    caller: _this.R.caller,
                    called: accountCode,
                    tenantId,
                    callId,
                    processName: 'hangup',
                    passArgs: { number: accountCode, agentId, hangupMsg },
                });
                dialMemberResult.reason = failType;
                return dialMemberResult;
            }
        } catch (ex) {
            _this.R.logger.error('dialMemberResult', ex, _this.endState);
            _this.R.service.extension.setAgentState(Object.assign({}, pubData, { state: _this.endState, hangup: true }));
            dialMemberResult.reason = ex.toString();
            return dialMemberResult;
            // DESTINATION_OUT_OF_ORDER
            // CALL_REJECTED
        }
    }

    async stopFindAgentJob(jobId: number) {
        try {
            const { tenantId, callId, caller, callee: called, routerLine } = this.runtimeData.getRunData();
            const data = {
                tenantId,
                callId,
                jobId
            }
            await this.eventService.pubAReidsEvent('stopFindAgent', JSON.stringify(data));
        }
        catch (ex) {
            return Promise.reject(ex);
        }
    }

    async enterEmptyQueue() {
        try {
            const { tenantId, callId, caller, callee: called, routerLine } = this.runtimeData.getRunData();
            this.logger.debug('Dial Queue When No Agent Login!');
            await this.fsPbx.uuidPlayback({
                uuid: callId,
                terminators: 'none',
                file: 'ivr/8000/ivr-thank_you_for_calling.wav',
            });
            await this.fsPbx.wait(500);
            await this.fsPbx.uuidKill(callId, 'NORMAL_CLEARING');
            return Promise.resolve();
        } catch (ex) {
            return Promise.reject(ex);
        }
    }

    async allBusyTip(options) {
        try {
            const { tenantId, callId, caller, callee: called, routerLine } = this.runtimeData.getRunData();
            let {
                abtFile,
                abtKeyTimeOut,
                abtWaitTime,
                abtInputTimeoutFile,
                abtInputTimeoutEndFile,
                abtInputErrFile,
                abtInputErrEndFile,
                abtTimeoutRetry = 2,
                abtInputErrRetry = -1,
            } = options;
            abtFile = abtFile ? await this.fillSoundFilePath(abtFile) : 'demo/queuetimeout.wav';
            abtInputTimeoutFile = abtInputTimeoutFile ? await this.fillSoundFilePath(abtInputTimeoutFile) : 'demo/timeoutandhangup.wav';
            abtInputTimeoutEndFile = abtInputTimeoutEndFile ? await this.fillSoundFilePath(abtInputTimeoutEndFile) : 'ivr/8000/ivr-call_rejected.wav';
            abtInputErrFile = abtInputErrFile ? await this.fillSoundFilePath(abtInputErrFile) : 'demo/inputerror.wav';
            abtInputErrEndFile = abtInputErrEndFile ? await this.fillSoundFilePath(abtInputErrEndFile) : 'ivr/8000/ivr-call_rejected.wav';
            const readArgs = {
                min: 1,
                max: 1,
                uuid: callId,
                file: abtFile,
                variableName: 'all_busy_tip_input_key',
                timeout: abtKeyTimeOut * 1000,
                terminators: 'none',
            };
            let reReadDigits = true;
            let continueWait = false;
            let agentAnswered = false;
            //   EE3.once(`queue::busytip::findagent::${callId}`,() => {
            //     agentAnswered = true;
            //     _this.R.logger.debug('在全忙提示的时候找到坐席且坐席已经接听！');

            //   })
            while (reReadDigits && !agentAnswered) {
                reReadDigits = false;
                // 提示是否继续等待音
                const inputKey = await this.fsPbx.uuidRead(readArgs);

                if (inputKey === '1') {
                    this.logger.debug('abt-用户选择继续等待!');
                    continueWait = true;// 坐席全忙,继续等待!
                }
                else if (inputKey === 'timeout') {
                    // 输出超时音
                    this.logger.debug('abt-用户输入超时,播放提示');
                    if (abtTimeoutRetry === 0) {
                        reReadDigits = false;
                        continue;
                    }
                    await this.fsPbx.uuidPlayback({
                        terminators: 'none',
                        file: abtInputTimeoutFile,
                        uuid: callId
                    });
                    // await _this.dialQueueTimeout(queue);
                    // await _this.R.pbxApi.uuidBreak(_this.R.callId);
                    await this.fsPbx.wait(500);
                    reReadDigits = true;
                    if (abtTimeoutRetry > 0) {
                        abtTimeoutRetry--;
                    }
                }
                else {
                    // 输入错误音
                    this.logger.debug('abt-用户输入错误音');

                    if (abtInputErrRetry === 0) {
                        reReadDigits = false;
                        continue;
                    }

                    await this.fsPbx.uuidPlayback({
                        terminators: 'none',
                        file: abtInputErrFile,
                        uuid: callId
                    });
                    // readArgs.soundFile = 'demo/inputerror.wav';
                    reReadDigits = true;
                    if (abtInputErrRetry > 0) {
                        abtInputErrRetry--;
                    }
                }

            }
            if (agentAnswered) {
                return continueWait;
            }
            else if (!continueWait && (abtTimeoutRetry === 0 || abtInputErrRetry === 0)) {
                this.logger.debug('abt-用户输入错误音');
                await this.fsPbx.uuidPlayback({
                    uuid: callId,
                    terminators: 'none',
                    file: abtTimeoutRetry === 0 ? abtInputTimeoutEndFile : abtInputErrEndFile,
                });
                //this.R.alegHangupBy = 'system';
                //this.hangupBySystem = true;
                await this.fsPbx.uuidKill(callId);
            }
            return continueWait;
        } catch (ex) {
            this.logger.error('allBusyTip-处理是否继续等待音错误:', ex);
        }
    }

    setQueueWaitingInfo(tenantId: string, queueNumber: string, queueName: string) {

    }

    async dialMemberTimeOut() {
        try {
            const { tenantId, callId, caller, callee: called, routerLine } = this.runtimeData.getRunData();
            this.logger.error('超时没有空闲坐席应答');
            const readArgs = {
                uuid: callId,
                min: 1,
                max: 1,
                file: this.queue.queue.queueTimeoutFile || 'demo/queuetimeout.wav',
                variableName: 'satisfaction_input_key',
                timeout: 15 * 1000,
                terminators: 'none',
            };
            let reReadDigits = true;
            const result = {
                wait: false,
                error: ''
            };
            let agentAnswered = false;
            // EE3.once(`queue::busytip::findagent::${callId}`, () => {
            //     agentAnswered = true;
            //     _this.R.logger.debug('在超时提示的时候找到坐席且坐席已经接听！');
            // })
            while (reReadDigits && !agentAnswered) {
                reReadDigits = false;
                // 提示是否继续等待音
                this.logger.error('是否继续等待音');
                const inputKey = await this.fsPbx.uuidRead(readArgs);
                if (inputKey === '1') {
                    this.logger.error('再排队一次');
                    result.wait = true;// 再排队一次
                }
                else if (inputKey === 'timeout') {
                    // 输出超时音
                    this.logger.error('输出超时音');
                    await this.fsPbx.uuidPlayback({
                        uuid: callId,
                        terminators: 'none',
                        file: 'demo/timeoutandhangup.wav',
                    });
                    await this.fsPbx.wait(500);
                    // _this.R.alegHangupBy = 'system';
                    // _this.hangupBySystem = true;
                    await this.fsPbx.uuidKill(callId, 'Dial Queue Timeout!');
                    result.error = 'Dial Queue Timeout!';
                }
                else {
                    // 输入错误音
                    this.logger.error('输入错误音');
                    readArgs.file = 'demo/inputerror.wav';
                    reReadDigits = true;
                }
            }
            return Promise.resolve(result);
        } catch (ex) {
            this.logger.error('dialMemberTimeOut:', ex);
            return Promise.reject(ex);
        }
    }
    async fillSoundFilePath(file) {
        try {
            // const _this = this;
            // const {dbi, tenantId} = _this.R;
            // let resFile = '';
            // let filePrefix = _this.R.config.s3FileProxy ? 'http_cache://' + _this.R.config.s3FileProxy : '/usr/local/freeswitch/files/';
            // if (ObjectID.isValid(file)) {
            //   const soundFileObj = await dbi.sound.get(tenantId, file);
            //   if (soundFileObj) {
            //     resFile = filePrefix + soundFileObj.url;
            //   } else {
            //     resFile = file;
            //   }
            // }
            // else if (/^http/.test(file)) {
            //   resFile = 'http_cache://' + file;
            // }
            // else {
            //   resFile = file;
            // }
            // _this.R.logger.debug('fillSoundFilePath:', resFile);
            // return resFile;
            return file;
        }
        catch (ex) {
            return Promise.reject(ex);
        }

    }
}