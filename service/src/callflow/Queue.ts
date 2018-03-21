import { Injector, ReflectiveInjector, Injectable } from 'injection-js';
import { Queue as BullQueue, Job, QueueOptions } from 'bull';
import { ConfigService } from '../service/ConfigService';
import { LoggerService } from '../service/LogService';
import { QueueWorkerService } from './QueueWorkerService';
import { FreeSwitchPBX, uuidPlayAndGetDigitsOptions } from './FreeSwitchPBX';
import { RuntimeData } from './RunTimeData';

import { PBXCallProcessController } from '../controllers/pbx_callProcess';
import { PBXQueueController } from '../controllers/pbx_queue';
import { PBXQueueStatisticController } from '../controllers/pbx_queueStatistic';
import { PBXAgentStatisticController } from '../controllers/pbx_agentStatistic';
import { PBXCDRController } from '../controllers/pbx_cdr';

@Injectable()
export class Queue {

    private cgrReqType: string;
    private queueWorker: QueueWorkerService;
    private logger: LoggerService;
    private config: ConfigService;
    private bullQueue: BullQueue;
    private fsPbx: FreeSwitchPBX;
    private runtimeData: RuntimeData;

    private pbxCallProcessController: PBXCallProcessController;
    private pbxQueueController: PBXQueueController;
    private pbxQueueStatisticController: PBXQueueStatisticController;
    private pbxAgentStatisticController: PBXAgentStatisticController;
    private cdrControl: PBXCDRController;
    private originationUuid:string;

    constructor(private injector: Injector) {
        this.logger = this.injector.get(LoggerService);
        this.queueWorker = this.injector.get(QueueWorkerService);
        this.fsPbx = this.injector.get(FreeSwitchPBX);

        this.pbxQueueController = this.injector.get(PBXQueueController);
        this.pbxCallProcessController = this.injector.get(PBXCallProcessController);
        this.pbxQueueStatisticController = this.injector.get(PBXQueueStatisticController);
        this.runtimeData = this.injector.get(RuntimeData);

    }
    /**
   * @description
   * 拨打队列
   * @param queueNumber
   * @returns {Promise.<*>}
   */
    async dialQueue(queueNumber: string): Promise<any> {
        this.logger.debug(`queueNumber:${queueNumber},sipRegInFS:${this.config.getConfig().sipRegInFS}`);

        try {
            const { tenantId, callId, caller, callee: called, routerLine } = this.runtimeData.getRunData();
            const bullQueueName = `esl_q_queue::${tenantId}::${queueNumber}`;
            this.bullQueue = await this.queueWorker.add(tenantId, queueNumber);

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
            const queue = await this.pbxQueueController.getQueue(tenantId, queueNumber);
            const enterQueueTime = await this.fsPbx.getChannelVar('queue_enter_time', callId);

            this.pbxCallProcessController.create({
                caller,
                called: queueNumber,
                tenantId,
                callId,
                processName: 'queue',
                passArgs: { number: queueNumber, queueName: queue.queueName },
            });



            // 用户没有设置reqType
            this.cgrReqType = await this.fsPbx.getChannelVar('cgr_reqtype', callId);
            if (queue && this.cgrReqType) {
                const { queueName, queue: queueConf } = queue;
                const { maxWaitTime, enterTipFile } = queueConf;

                this.logger.debug(`queue find in DB:${queueName}`);

                // _this.setQueueWaitingInfo(tenantId, queueNumber, queueName);
                // 设置队列排队的信息 更新到前端

                let startTime = new Date().getTime();
                await this.pbxQueueStatisticController.create({
                    callId,
                    tenantId,
                    queueNumber,
                    onDutyAgents: queue.members,
                });

                if (!queue.members.length) {
                    this.logger.debug('=====ENTER A EMPTY QUEUE=====');
                    await this.enterEmptyQueue(queue);
                    return Promise.resolve(result);
                }

                const findQueueMemberEvent = `${EVENTNAME.callControl.PUB.findQueueMember}::${tenantId}::${callId}`;
                const callerHangupEvent = `esl::event::CHANNEL_HANGUP::${callId}`;

                let queueJob: Job;
                let busyTipTime = startTime;
                let setIntervalTimeout;
                let isDoneTimeoutTip = false;
                let isDoneBusyTip = false;
                const timeoutFn = async () => {
                    try {
                        const now = new Date().getTime();
                        if (isDoneBusyTip || isDoneTimeoutTip) {
                            this.logger.debug('有其他提示任务在处理中');
                            busyTipTime = now;
                            startTime = now;
                            return;
                        }
                        const diffTime = now - startTime;
                        const busyTipCheckTime = now - busyTipTime;
                        this.logger.debug(`queue intervale diffTime=${diffTime},busyTipCheckTime=${busyTipCheckTime}`);
                        // 超时时处理
                        if (diffTime > maxWaitTime * 1000 && !isDoneTimeoutTip && !isDoneBusyTip) {
                            isDoneTimeoutTip = true;
                            const res = await this.dialMemberTimeOut({ queue });
                            // 客户选择继续等待
                            if (res && res.wait) {
                                startTime = new Date().getTime();
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
                            } = queue.queue;
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
                        if (setIntervalTimeout) {
                            clearInterval(setIntervalTimeout);
                        }
                    }
                }






                const vipLevel = 0 //await service.httppbx.checkPhoneVIP(tenantId, caller);

                const maxLowLevel = 540; // 越高优先级越低
                let priority = maxLowLevel - vipLevel * 30;

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



                const startTimer = () => {
                    setIntervalTimeout = setInterval(() => {
                        timeoutFn()
                            .then(res => {
                                this.logger.debug(`startTimer res :${res}`);
                            })
                            .catch(err => {
                                this.logger.error(`startTimer error :${err}`);
                            })
                    }, 1000);
                }

                startTimer();

                let findQueueMemberExec = false;

                const afterVipInsert = async (vipJob, vipPriority) => {
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
                };

                const onPlaybackStart = async (evt) => {
                    try {
                        this.logger.debug('Queue PLAYBACK_START Core-UUID:', evt.getHeader('Core-UUID'));
                        queueJob = await this.bullQueue.add({
                            callId: callId,
                            tenantId: tenantId,
                            queue,
                        }, {
                                priority: priority < 1 ? 1 : priority,
                                // jobId: _this.R.callId,
                                timeout: (maxWaitTime + 1) * 1000 * 3,
                                // timeout: 30 * 1000,
                            });

                        this.logger.debug('On Playback Start Result Job:', queueJob ? queueJob.id : 'NULL');
                        this.setQueueWaitingInfo(tenantId, queueNumber, queueName);
                        // VIP用户强行取出当前正在active的普通用户，并插入
                        if (vipLevel && vipLevel > 0) {
                            afterVipInsert(queueJob, queueJob.opts.priority)
                                .then(() => {
                                    this.logger.debug('VIP进入队列后对在等待中的普通坐席JOB重新插入完毕!');
                                })
                                .catch(err => {
                                    this.logger.error(err);
                                });
                        }

                    } catch (ex) {
                        this.logger.error('On Playback Start Error:', ex);
                    }
                };

                const onFindQueueMember = async (agentInfo) => {
                    try {
                        findQueueMemberExec = true;
                        if (setIntervalTimeout) {
                            clearInterval(setIntervalTimeout);
                        }
                        this.logger.debug('findQueueMemberEvent return', agentInfo);
                        result.agentNumber = agentInfo.accountCode;
                        if (result.callerHangup) {
                            this.logger.info('find one but Caller is Hangup');
                        }
                        else if (agentInfo && agentInfo.accountCode) {
                            const startCallAgentTime = new Date();
                            const dialResult = await this.dialQueueMember({
                                agentInfo,
                                queueInfo: queue,
                                agentType,
                            });
                            this.logger.debug('dialQueueMember result:', dialResult);
                            // 不成功重新放回队列
                            if (result.callerHangup) {
                                this.logger.info('When find Queue Member, Caller is Hangup');
                            }
                            else if (!dialResult.success) {
                                priority = priority - 1;
                                findQueueMemberExec = false;
                                queueJob = await this.bullQueue.add({
                                    callId: callId,
                                    tenantId: tenantId,
                                    queue,
                                }, {
                                        priority: priority < 1 ? 1 : priority,
                                        timeout: (maxWaitTime + 1) * 1000 * 3,
                                        //timeout: 30 * 1000,
                                    });
                                this.logger.debug('不成功重新放回队列:', queueJob ? queueJob.id : 'NULL');
                                this.setQueueWaitingInfo(tenantId, queueNumber, queueName);
                                startTimer();
                                if (vipLevel && vipLevel > 0) {
                                    afterVipInsert(queueJob, queueJob.opts.priority)
                                        .then(() => {
                                            this.logger.debug( 'VIP进入队列后对在等待中的普通坐席JOB重新插入完毕!');
                                        })
                                        .catch(err => {
                                            this.logger.error(err);
                                        });
                                }
                            }
                            else {
                                result.success = true;
                                result.answered = true;
                                result.hasDone = true;
                                this.setQueueWaitingInfo(tenantId, queueNumber, queueName);
                                if (agentInfo.phoneLogin === 'yes') {
                                    const { channelName,useContext } = this.runtimeData.getChannelData();
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
                };


                // 未应答前主叫挂机,坐席接听电话后将取消这个监听
                const callerHangupHandle = async (evt) => {
                    try {
                        result.callerHangup = true;
                        result.hasDone = true;
                        // if (findQueueMemberExec) {
                        //   _this.R.logger.debug(loggerPrefix, '已经找到坐席');
                        //   return Promise.resolve();
                        // }
                        _this.R.logger.debug(loggerPrefix, `主叫在队列中排队等候中先挂机!hangupBySystem=${_this.hangupBySystem}`);
                        // _this.R.EE3.off(findQueueMemberEvent, onFindQueueMember);

                        if (setIntervalTimeout) {
                            clearInterval(setIntervalTimeout);
                        }

                        if (queueJob) {
                            queueJob.getState()
                                .then(state => {
                                    _this.R.logger.error('jobGetState', state);
                                    if (state !== 'active' && state !== 'stalled') {
                                        return queueJob.remove();
                                    }
                                    else {
                                        return service.queue.stopFindAgentJob(queueJob.id);
                                    }
                                })
                                .then(res => {
                                    _this.R.logger.debug('jobRemoveResult', res);
                                })
                                .catch(err => {
                                    _this.R.logger.error('jobGetStateError', err);
                                });
                        }

                        _this.wait(3000)
                            .then(res => {
                                _this.setQueueWaitingInfo(tenantId, queueNumber, queueName);
                            })
                            .catch(err => {
                                _this.R.logger.error('after hangup setQueueWaitingInfo error:', err);
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
                };
                this.fsPbx.addConnLisenter(callerHangupEvent, 'once',callerHangupHandle)
                this.fsPbx.addConnLisenter(`esl::event::PLAYBACK_START::${callId}`,'once', onPlaybackStart)


                _this.R.EE3.on(findQueueMemberEvent, onFindQueueMember);


                this.logger.debug('=====PLAY QUEUE MUSIC START=====');
                await pbxApi.qMusic(queue.queue.mohSound || 'local_stream://moh/8000');
                this.logger.debug('=====PLAY QUEUE MUSIC STOP=====');
                // 下面的代码只有在answer之后才能执行，或者提前执行uuid_break后才会执行
                await new Promise((resolve) => {
                    this.logger.debug( '等待桥接！');
                    if (result.callerHangup) {
                        resolve(result);
                    }
                    else {
                        _this.R.EE3.once(`queue::after::bridge::${callId}`, () => {
                            pbxApi.conn.off(callerHangupEvent, callerHangupHandle);
                            _this.R.EE3.removeListener(findQueueMemberEvent, onFindQueueMember);
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


    async dialQueueMember(optiosn:any){

    }

    async enterEmptyQueue(queue) {
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

    async dialMemberTimeOut({ queue }) {
        try {
            const { tenantId, callId, caller, callee: called, routerLine } = this.runtimeData.getRunData();
            this.logger.error('超时没有空闲坐席应答');
            const readArgs = {
                uuid: callId,
                min: 1,
                max: 1,
                file: queue.queue.queueTimeoutFile || 'demo/queuetimeout.wav',
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