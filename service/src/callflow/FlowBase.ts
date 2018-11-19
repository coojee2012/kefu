import { Injector, ReflectiveInjector, Injectable } from 'injection-js';
import { ConfigService } from '../service/ConfigService';
import { LoggerService } from '../service/LogService';
import { Connection } from '../lib/NodeESL/Connection';
import { Event } from '../lib/NodeESL/Event';

import { FreeSwitchPBX } from './FreeSwitchPBX';
import { RuntimeData } from './RunTimeData';
import { IVR } from './IVR';
import { CCQueue } from './Queue';


import { PBXLocalNumberController } from '../controllers/pbx_localNumber';
import { PBXCDRController } from '../controllers/pbx_cdr';
import { PBXCallProcessController } from '../controllers/pbx_callProcess';
import { PBXIVRMenuController } from '../controllers/pbx_ivrMenu';
import { PBXRecordFileController } from '../controllers/pbx_recordFile';
import { PBXExtensionController } from '../controllers/pbx_extension';
import { TenantController } from '../controllers/tenant';
import Transfer from './Transfer';

type DialLocalResult = {
    localType: string;
}

interface IDialExtensionResult {

}

@Injectable()
export class FlowBase {
    private logger: LoggerService;
    private pbxLocalNumberController: PBXLocalNumberController;
    private pbxCdrController: PBXCDRController;
    private pbxCallProcessController: PBXCallProcessController;
    private pbxExtensionController: PBXExtensionController;
    private pbxIvrMenuController: PBXIVRMenuController;
    private pbxRecordFileController: PBXRecordFileController;

    private tenantController: TenantController;

    private runtimeData: RuntimeData;
    private fsPbx: FreeSwitchPBX;
    private ivr: IVR;
    private ccQueue: CCQueue;

    constructor(private injector: Injector) {
        this.logger = this.injector.get(LoggerService);
        this.pbxLocalNumberController = this.injector.get(PBXLocalNumberController);
        this.pbxCdrController = this.injector.get(PBXCDRController);
        this.pbxCallProcessController = this.injector.get(PBXCallProcessController);
        this.pbxIvrMenuController = this.injector.get(PBXIVRMenuController);
        this.pbxRecordFileController = this.injector.get(PBXRecordFileController);
        this.pbxExtensionController = this.injector.get(PBXExtensionController);
        this.tenantController = this.injector.get(TenantController);

        this.runtimeData = this.injector.get(RuntimeData);
        this.fsPbx = this.injector.get(FreeSwitchPBX);

        this.ivr = this.injector.get(IVR);
        this.ccQueue = this.injector.get(CCQueue);
    }
    /**
     * @description 拨打本地号码，包括分机，队列，IVR等
     */
    async diallocal(number: string) {
        try {
            this.logger.debug(`Dial A Local Number:${number}`);
            const { tenantId, callId, caller } = this.runtimeData.getRunData();
            if (/@/.test(number)) {
                return Promise.reject(`Can't Dial Other Tenand!Called Is:${number}.`);
            } else {
                const { localType, assign } = await this.pbxLocalNumberController.getLocalByNumber(tenantId, number);
                const result: DialLocalResult = {
                    localType,
                };

                await this.pbxCdrController.updateCalled(tenantId, callId, number);
                this.logger.debug(`Local Number Type:${localType}`);
                switch (localType) {
                    case 'ivr':
                        {
                            await this.dialIVR(number);
                            break;
                        }
                    case 'extension':
                        {
                            await this.pbxCallProcessController.create({
                                caller,
                                called: number,
                                tenantId,
                                callId,
                                processName: localType,
                                passArgs: { number }
                            })
                            await this.dialExtension(number);
                            break;
                        }
                    case 'queue':
                        {
                            await this.dialQueue(number);
                            break;
                        }
                    case 'voicemail':
                    case 'conference':
                    case 'fax':
                    default:
                        break;
                }
            }
        } catch (ex) {
            return Promise.reject(ex);
        }
    }

    /** 
     * @description 拨打出局电话
     * */
    async dialout(number: string, args: any = {}) {
        try {

            this.logger.debug(`Dial A Outer Number:${number}`);
            const { tenantId, callId, caller, transferCall, answered } = this.runtimeData.getRunData();
            const { FSName, useContext, clickOut } = this.runtimeData.getChannelData();

            await this.pbxCdrController.updateCalled(tenantId, callId, number);
            const tenantInfo = await this.runtimeData.getTenantInfo();

            const setData = {
                call_timeout: 30, // 呼叫超时
                bridge_answer_timeout: 30,
                // exec_after_bridge_app: 'start_dtmf',
                // "effective_caller_id_name": '', // 主叫名称
                // "effective_caller_id_number": '', // 主叫号码
                // "ringback":'', // 回铃音
            };
            if (args.timeout) {
                setData.call_timeout = args.timeout;
                setData.bridge_answer_timeout = args.timeout;
            }
            if (args.callerName) {
                setData['effective_caller_id_name'] = args.callerName;
            }
            // TODO 是否需要验证该callerId的合法性?
            // setData['effective_caller_id_number'] = tenantInfo && tenantInfo.options && tenantInfo.options.useExtenForCaller ? caller : DND;
            this.pbxCallProcessController.create({
                caller,
                called: number,
                tenantId,
                callId,
                processName: 'dialout',
                passArgs: {},
                // passArgs: { dnd: DND, caller, number, gateway: _this.R.gateway, agentId },
            })

            if (args.ringback) {
                setData['ringback'] = args.ringback || '${us-ring}';
            }

            const { dnd, gateway } = await this.tenantController.getDialGateWay({
                tenantId,
                callId,

            })
            const pubData = {
                tenantId: tenantId,
                agentId: agentId,
                agent: caller,
                state: '',
                fsName: _this.R.fsName,
                fsCoreId: _this.R.fsCoreId,
                callType: callType,
                transferCall: _this.R.transferCall,
                isClickOut: _this.R.clickOut === 'yes' ? true : false,
                roomId: callId,
                sipCallId: _this.R.pbxApi.getChannelData().sipCallId,
                options: {
                    callId: callId,
                    callee: called,
                    caller: caller,
                    DND: _this.R.DND,
                    direction: _this.R.direction
                }
            }

            await this.pbxCdrController.lastApp(callId, tenantId, 'dialOut');
            // _this.R.agentLeg[`${caller}`] = _this.R.callId;
            let cgr_category = 'call_internal';
            if (clickOut === 'yes' || transferCall || args.isLastService) {
                cgr_category = 'call_out';
            }
            const bLegCgrVars = this.setBLegCgr();
            if (/@/.test(number)) {
                return Promise.reject(`Can't Dial Other Tenand!Called Is:${number}.`);
            } else {
                if (gateway && gateway !== '') {
                    await this.fsPbx.uuidSetMutilVar(callId, setData);
                    let dialStr = `${bLegCgrVars}sofia/external/${number}@${gateway}`;
                    this.logger.debug('dialout dialStr:', dialStr);
                    // if (this.config..gg) {
                    //     // TODO 如果不用代理,正常情况应该是通过gateway,以下是开发测试
                    //     dialStr = `${bLegCgrVars}user/${number}`;
                    // }

                    const onCallerHangup = async (evt) => {
                        try {
                            await this.pbxCdrController.lastApp(callId, tenantId, `Dialout Caller Hangup:${evt.getBody()}`);
                            await this.pbxExtensionController.setAgentState(tenantId, caller, 'idle');

                        } catch (ex) {
                            this.logger.error(`Dialout Caller Hangup Error:`, ex);
                        }
                    }

                    this.fsPbx.addConnLisenter(`esl::event::CHANNEL_HANGUP::${callId}`, 'once', onCallerHangup);

                    let ringTime: number;
                    const onOriginate = async ({ bLegId, evt }) => {
                        try {
                            ringTime = new Date().getTime();
                            await this.pbxCallProcessController.create({
                                caller,
                                called: number,
                                tenantId,
                                callId,
                                processName: 'ringing',
                                passArgs: { number: number, agentId: '' }
                            })
                        } catch (ex) {
                            this.logger.error(`Dialout Caller On Originate Error:`, ex);
                        }

                    }

                    let answerTime = 0;
                    let doneDTMFEvent = false;



                    const onAnswer = async ({ bLegId, evt }) => {
                        try {
                            await this.fsPbx.uuidSetvar({
                                uuid: bLegId,
                                varname: 'hangup_after_bridge',
                                varvalue: 'false'
                            })
                            // // 华西证券业务插入
                            // this.logger.debug(`HHHHHXXXX:isLastService-${args.isLastService},isClickOut-${clickOut}`);
                            // if (tenantInfo && tenantInfo.options && tenantInfo.options.hx && (args.isLastService || clickOut === 'yes')) {
                            //     _this.R.EE3.once('esl::callout::done::dtmf::presskey', () => {
                            //         doneDTMFEvent = true;
                            //     })
                            //     _this.HxOnDtmf(callId, bLegId, caller, number)
                            //         .then(res => { })
                            //         .catch(err => { })
                            // }

                            if (!answered) {
                                this.runtimeData.setAnswered();

                            }
                            await this.pbxCallProcessController.create({
                                caller,
                                called: number,
                                tenantId,
                                callId,
                                processName: 'answer',
                                passArgs: { number: number, agentId: '' }
                            })
                            answerTime = new Date().getTime();


                            this.pbxExtensionController.setAgentState(tenantId, caller, 'inthecall')
                        } catch (ex) {
                            this.logger.error(`Dialout Caller On Answer Error:`, ex);
                        }

                    }

                    const onHangup = async ({ bLegId, evt, hangupBy }) => {

                        try {
                            const hangUpCase = evt.getHeader('Hangup-Cause');
                            let hangupType = !transferCall ? 'hangUp-callOut' : 'hangUp-transfer';
                            let by = hangupBy == 'callee' ? 'visitor' : 'agent';

                            let hangupMsg = '';
                            switch (hangUpCase) {
                                case 'ORIGINATOR_CANCEL':
                                    hangupMsg = '取消呼叫';
                                    by = 'agent';
                                    break;
                                case 'NO_USER_RESPONSE':
                                    hangupMsg = '用户无应答';
                                    by = 'visitor';
                                    break;
                                case 'NO_ANSWER':
                                    hangupMsg = '用户未应答';
                                    by = 'visitor';
                                    break;
                                case 'CALL_REJECTED':
                                    hangupMsg = '用户拒接';
                                    by = 'visitor';
                                    break;
                                case 'INCOMPATIBLE_DESTINATION':
                                    hangupMsg = '用户无应答';
                                    by = 'visitor';
                                    break;
                                case 'UNALLOCATED_NUMBER':
                                    hangupMsg = '用户无应答';
                                    by = 'visitor';
                                    break;
                                case 'USER_BUSY':
                                    hangupMsg = '用户忙线';
                                    by = 'visitor';
                                    break;
                                default:
                                    break;
                            }
                            await this.pbxCallProcessController.create({
                                caller,
                                called: number,
                                tenantId,
                                callId,
                                processName: 'hangup',
                                passArgs: { number: number, agentId: '', hangupMsg: '结束通话' }
                            })
                        } catch (ex) {
                            this.logger.error(`Dialout Caller On Hangup Error:`, ex);
                        }

                    }




                    //const bridgeResult = await _this.bridgeAcallB(caller, number, onOriginate, onAnswer, onHangup)

                    const bridgeResult = await this.bridgeACall(dialStr, number, onAnswer, onHangup, onOriginate);

                    await this.fsPbx.wait(500);
                    // 处理如果需要处理DTMF响应
                    if (doneDTMFEvent) {
                        // await new Promise((resolve, reject) => {
                        //     EE3.once('esl::callout::done::dtmf::end', () => {
                        //         logger.debug('esl::callout::done::dtmf::end');
                        //         resolve();
                        //     })
                        // })
                    }
                    // 处理如果有失败流程需要处理
                    else if ((!bridgeResult.success || bridgeResult.cause !== 'NORMAL_CLEARING') && args.failDone) {
                        // await this.dialFailDone(args);
                    }
                    this.logger.debug('结束外呼');
                    return bridgeResult;
                } else {
                    await this.pbxExtensionController.setAgentState(tenantId, caller, 'idle');
                    return { success: false, cause: `DON'T HAVE A GATEWAY` };
                }
            }
        } catch (ex) {
            const { tenantId, callId, caller, transferCall, answered } = this.runtimeData.getRunData();
            await this.pbxExtensionController.setAgentState(tenantId, caller, 'idle');
            return Promise.reject(ex);
        }
    }

    setBLegCgr(timeout = 30) {
        // absolute_codec_string='G729,OPUS,G722,PCMU,PCMA',
        // bridge_filter_dtmf=true,
        const args = [];
        // args.push('bridge_pre_execute_bleg_app=start_dtmf'); // brige前,bleg执行的APP
        // args.push('bridge_pre_execute_bleg_data=');
        // args.push('exec_after_bridge_app=start_dtmf');
        args.push('hangup_after_bridge=false');
        args.push(`bridge_answer_timeout=${timeout}`);
        const str = `{${args.join(',')}}`;
        return str;
    }

    /**
     * @description 拨打分机
     */
    async dialExtension(number: string, args?: any): Promise<{ answered: boolean, error: string }> {
        try {
            const { tenantId, callId, caller, answered, routerLine } = this.runtimeData.getRunData();
            let result = {
                answered: false,
                error: ''
            };
            this.pbxCdrController.lastApp(callId, tenantId, 'extension');
            const setData = {
                "call_timeout": 60, // 呼叫超时
                // "effective_caller_id_name": '', // 主叫名称
                //"effective_caller_id_number": '', // 主叫号码
                //"ringback":'', // 回铃音
            };
            args = args || {
                timeout: 30 * 1000
            }
            //setData.call_timeout = 50 * 1000;
            setData['ringback'] = '${us-ring}';

            await this.fsPbx.uuidSetMutilVar(callId, setData);
            let cgr_category = '';
            let cdrUid = '';
            //if (_this.R.clickOut === 'yes') {
            cgr_category = 'call_internal';
            // }

            const blegArgs = [];
            // blegArgs.push('bridge_pre_execute_bleg_app=start_dtmf'); // brige前,bleg执行的APP
            // blegArgs.push('bridge_pre_execute_bleg_data=');
            // blegArgs.push('exec_after_bridge_app=start_dtmf');
            blegArgs.push('hangup_after_bridge=false');
            blegArgs.push(`bridge_answer_timeout=30`);


            const bLegCgrVars = `{${blegArgs.join(',')}}`;
            // let dialStr = `${bLegCgrVars}sofia/external/${number}@${tenantId}`;
            let dialStr = `{sip_invite_domain='192.168.2.230'}user/${number}@${tenantId}`;


            await this.pbxExtensionController.setAgentLastCallId(tenantId, number, callId);

            const onAnswer = async () => {
                if (!answered) {
                    this.runtimeData.setAnswered();
                }
                await this.pbxCallProcessController.create({
                    caller,
                    called: number,
                    tenantId,
                    callId,
                    processName: 'answer',
                    passArgs: { number: number, agentId: agentId }
                })
                await this.pbxExtensionController.setAgentState(tenantId, caller, 'inthecall');
                await this.pbxExtensionController.setAgentState(tenantId, number, 'inthecall');
            }

            const onHangup = async ({ evt, bLegId, hangupBy }) => {
                const transferInfo = {
                    transferDisposition: evt.getHeader('variable_transfer_disposition'),
                    transferTo: evt.getHeader('variable_transfer_to'),
                    transferDestination: evt.getHeader('variable_transfer_destination'),
                    transferFallbackExtension: evt.getHeader('variable_transfer_fallback_extension'),
                    endpointDisposition: evt.getHeader('variable_endpoint_disposition'),
                }
                // 被叫分机盲转
                if (transferInfo && transferInfo.endpointDisposition === 'BLIND_TRANSFER') {

                }
                //此处处理被叫分机挂机后的业务,默认是挂断通话
                else {
                    this.logger.debug(`处理被叫分机挂机后的业务,默认是挂断通话!hangupBy:${hangupBy}`);
                    if (hangupBy === 'callee') {
                        this.runtimeData.setHangupBy(hangupBy)
                    }
                }
                await this.pbxCallProcessController.create({
                    caller,
                    called: number,
                    tenantId,
                    callId,
                    processName: 'hangup',
                    passArgs: { number: number, agentId: agentId, desc: 'calledExtension' }
                })
            }



            // const originationUuid = await this.fsPbx.createUuid();
            // this.runtimeData.addBleg(originationUuid, number);
            // await this.fsPbx.filter('Unique-ID', originationUuid);

            // this.fsPbx.addConnLisenter(`esl::event::CHANNEL_ANSWER::${originationUuid}`, 'once', onAnswer);
            // this.fsPbx.addConnLisenter(`esl::event::CHANNEL_HANGUP::${originationUuid}`, 'once', onHangup);
            // this.fsPbx.addConnLisenter(`esl::event::CHANNEL_HANGUP::${callId}`, 'once', onAnswer);

            const extensionInfo = await this.pbxExtensionController.getExtenByNumber(tenantId, number);
            const { state: agentState, agentId, status: agentStatus } = extensionInfo;
            // 本地呼叫时,改变坐席状态为dialout
            if (routerLine === '本地') {
                await this.pbxExtensionController.setAgentState(tenantId, caller, 'dialout');
            }
            const canCallState = ['waiting', 'busy', 'idle', 'rest'];

            if (canCallState.indexOf(agentState) > -1) {
                await this.pbxExtensionController.setAgentState(tenantId, number, 'ringing');
            }
            else {
                // TODO 系统提示所拨打的用户忙,稍后再拨打
                const errMsg = `被叫分机:${number}状态${agentState}无法呼叫,呼叫失败!`
                this.logger.info(errMsg);
                await this.pbxExtensionController.setAgentState(tenantId, caller, 'idle');

                // await _this.R.pbxApi.hangup('USER_BUSY');
                // return Promise.resolve(result);
            }
            // const oriResult = await this.fsPbx.originate(dialStr, '&park()', blegArgs.join(','), originationUuid);

            this.fsPbx.message({
                sessionId: callId,
                msgType: 'call',
                from: 'system' + '@' + tenantId,
                to: number + '@' + tenantId,
                subject: 'chat',
                profile: 'internal',//'external'
                body: 'new'
            })

            const bridgeResult = await this.bridgeACall(dialStr, number, onAnswer, onHangup);



            this.logger.debug('结束本地呼叫分机!更改主叫,被叫分机状态!');




            result.answered = bridgeResult.success;
            result.error = bridgeResult.cause;
            await this.pbxExtensionController.setAgentState(tenantId, caller, 'idle');
            await this.pbxExtensionController.setAgentState(tenantId, number, 'idle');

            // await _this.R.pbxApi.disconnect('拨打本地分机结束,关闭ESL Socket!');
            // }
            if (!bridgeResult.success && args.failDone) {
                switch (args.failDone.type) {
                    case 'ivr':
                        {
                            await this.ivr.ivrAction({
                                ivrNumber: args.failDone.gotoIvr,
                                ordinal: args.failDone.gotoIvrActId || 1,
                                uuid: callId
                            });
                            break;
                        }
                    default:
                        {

                        }
                }
            }


            return result;
        } catch (ex) {
            return Promise.reject(ex);
        }
    }



    /**
     * @description
     * 外呼或者呼叫内部分机时,发起bridge B-leg
     * @param tag
     * @param dialStr
     * @param calledNumber
     * @param rLine
     * @param onAnswer
     * @param onHangup
     * @param onOriginate
     * @return {*}
     */
    async bridgeACall(dialStr, calledNumber, onAnswer?, onHangup?, onOriginate?) {
        try {
            const { callId, tenantId, caller, routerLine } = this.runtimeData.getRunData();
            const { channelName, useContext, sipCallId, CallDirection, callType } = this.runtimeData.getChannelData();
            let cdrUid = '';
            let hasListenOutGoing = false;
            let BLegId = '';

            const onOutGoing = async (evt) => {
                const aLegId = evt.getHeader('Other-Leg-Unique-ID');
                const bLegId = BLegId = evt.getHeader('Unique-ID');
                this.logger.debug('Dial A Call CHANNEL_OUTGOING', aLegId, bLegId);

                if (aLegId === callId && !hasListenOutGoing) {
                    this.fsPbx.removeConnLisenter(`esl::event::CHANNEL_OUTGOING::**`, onOutGoing);
                    if (onOriginate && typeof onOriginate === 'function') {
                        onOriginate({ bLegId, evt });
                    }
                    let answered = false;
                    let doneHangup = false;
                    this.runtimeData.addBleg(bLegId, calledNumber);

                    await this.fsPbx.filter('Unique-ID', bLegId);


                    const cdrCreateR = await this.pbxCdrController.create({
                        tenantId: tenantId,
                        routerLine: routerLine,
                        srcChannel: channelName,
                        context: useContext,
                        caller: caller,
                        called: calledNumber,
                        callFrom: caller,
                        callTo: calledNumber,
                        callId: `unknown-${callId}-${new Date().getTime()}`,
                        recordCall: true,
                        isTransfer: false,
                        agiType: 'b-leg',
                        isClickOut: false,
                        associateId: callId
                    });
                    cdrUid = cdrCreateR._id;



                    const onCallerHangup = async (evt) => {
                        try {
                            if (!answered) {
                                this.logger.debug('bridgeACall被叫未接听,主叫先挂机!');
                                if (!doneHangup && onHangup && typeof onHangup === 'function') {
                                    doneHangup = true;
                                    await onHangup({ bLegId, evt, hangupBy: 'caller' });
                                }
                            } else {
                                this.logger.debug('bridgeACall被叫已接听,主叫先挂机!');
                            }
                        } catch (ex) {
                            this.logger.error('Bridge a call on handle caller hangup error:', ex);
                        }
                    }


                    const onBlegAnswer = async (evt) => {
                        try {
                            this.logger.debug(`bridgeACall被叫应答了:${bLegId}`);
                            answered = true;
                            //  if (!_this.R.transferCall) {
                            // if (_this.R.tenantInfo && _this.R.tenantInfo.recordCall !== false) {
                            const recordFileName = `${callId}.${bLegId}`;
                            this.fsPbx.uuidRecord(callId, 'start', tenantId, '', recordFileName)
                                .then(res => {
                                    this.logger.debug('Bridge a call record success!');
                                    return this.pbxRecordFileController.create({
                                        tenantId: tenantId,
                                        direction: callType,
                                        callId: callId,
                                        filename: recordFileName,
                                        folder: res.folder,
                                        agentId: '' //`${agentId}`
                                    });
                                })
                                .catch(err => {
                                    this.logger.error('Bridge a call record error:', err);
                                });
                            //  }
                            await this.pbxCdrController.answered(tenantId, callId, bLegId);
                            //   }
                            await this.pbxCdrController.bLegAnswered(cdrUid, bLegId);
                            if (onAnswer && typeof onAnswer === 'function') {
                                await onAnswer({ bLegId, evt });
                            }
                        } catch (ex) {
                            this.logger.error('Bridge a call on handle bleg answer error:', ex);
                        }

                    }


                    const onBelgHangup = async (evt) => {
                        try {
                            const hangupCause = evt.getHeader('Hangup-Cause');
                            await this.pbxCdrController.cdrBLegHangup(cdrUid, hangupCause);
                            this.logger.debug(`bridgeACall bleg[${bLegId}] hangup！`, bLegId);
                            if (!doneHangup && answered && onHangup && typeof onHangup === 'function') {
                                doneHangup = true;
                                await onHangup({ bLegId, evt, hangupBy: 'callee' });
                            }
                        } catch (ex) {
                            this.logger.error('Bridge a call on handle bleg hangup error:', ex);
                        }
                    }

                    this.fsPbx.addConnLisenter(`esl::event::CHANNEL_HANGUP::${callId}`, 'once', onCallerHangup);



                    this.fsPbx.addConnLisenter(`esl::event::CHANNEL_ANSWER::${bLegId}`, 'once', onBlegAnswer);
                    hasListenOutGoing = true;
                    // _this.R.pbxApi.filterDelete('Event-Name', 'CHANNEL_OUTGOING');

                    this.fsPbx.addConnLisenter(`esl::event::CHANNEL_HANGUP::${bLegId}`, 'once', onBelgHangup)
                }
            }


            this.fsPbx.addConnLisenter(`esl::event::CHANNEL_OUTGOING::**`, 'on', onOutGoing);


            await this.fsPbx.uuidSetMutilVar(callId, {
                'hangup_after_bridge': 'false',
                'sip_h_X': sipCallId
            })
            // await _this.R.pbxApi.filter('Event-Name', 'CHANNEL_OUTGOING');
            const bridgeResult = await this.fsPbx.bridge(callId, dialStr);
            // bridge结束后才会执行下面的语句
            this.logger.debug(`PBX Bridge Result:`, bridgeResult);
            if (!bridgeResult.success) {
                await this.pbxCdrController.cdrBLegHangup(cdrUid, bridgeResult.cause);
            }

            // if (_this.R.lastLogic === 'hold' || _this.R.lastLogic === 'consult' || _this.R.lastLogic === 'ivr-transfer') {
            //     _this.R.logger.debug(_this.loggerPrefix, 'In Bridge A Call When Last Logic Is :', _this.R.lastLogic);
            //     await _this.onCallerHangup();
            // }
            return Object.assign({}, bridgeResult, { bLegId: BLegId });
        } catch (ex) {
            this.logger.error(ex);
            return Promise.resolve({ success: false, cause: 'Bridge异常!' });
        }
    }

    async dialIVR(number: string) {
        try {
            const { answered, tenantId, callId, caller } = this.runtimeData.getRunData();

            if (!answered) {
                this.logger.debug(`dialIVR1:`, answered, tenantId, callId, caller);
                await new Promise((resolve, reject) => {
                    this.fsPbx.addConnLisenter(`esl::event::CHANNEL_ANSWER::${callId}`, 'once', (evt) => {
                        resolve();
                    });
                    this.fsPbx.uuidTransfer(callId, 'ivr')
                        .then(transferRes => {

                        })
                        .catch(err => {
                            reject(err);
                        })
                })


                this.logger.debug(`dialIVR2:`, answered, tenantId, callId, caller);
                this.runtimeData.setAnswered();
                // await this.fsPbx.startDTMF();
            }
            const ivrInfo = await this.pbxIvrMenuController.getIVRByNumber(tenantId, number);
            await this.pbxCallProcessController.create({
                caller,
                called: number,
                tenantId,
                callId,
                processName: 'ivr',
                passArgs: { number, ivrName: ivrInfo ? ivrInfo.ivrName : `${number}` }
            })
            const result = await this.ivr.ivrAction({
                ivrNumber: number,
                ordinal: 1,
                uuid: callId
            })
            // 下一步需要拨打一个本地号码
            if (result.nextType === 'diallocal') {
                this.logger.debug('拨打IVR的结果是要继续拨打local')
                await this.diallocal(result.nextArgs);
            }
            // 正常结束IVR
            else {
                this.logger.debug('拨打IVR结束:', result);
            }
        } catch (ex) {
            console.log(ex);
            return Promise.reject(ex);
        }
    }

    async dialQueue(number: string) {
        try {
            const { answered, tenantId, callId, caller } = this.runtimeData.getRunData();
            const result = await this.ccQueue.dialQueue(number);
            this.logger.debug(`Dial Queue ${number} Result:`, result);

            if (result.gotoIvrNumber) {
                await this.ivr.ivrAction({
                    ivrNumber: result.gotoIvrNumber,
                    ordinal: result.gotoIvrActId,
                    uuid: callId
                })
            }

        } catch (ex) {
            return Promise.reject(ex);
        }
    }


}