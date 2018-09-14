import { Injector, ReflectiveInjector, Injectable } from 'injection-js';
import { ConfigService } from '../service/ConfigService';
import { LoggerService } from '../service/LogService';
import { ESLEventNames } from '../service/ESLEventNames';
import { Connection } from '../lib/NodeESL/Connection';
import { Event } from '../lib/NodeESL/Event';
import { EventEmitter2 } from 'eventemitter2';
import generateUuid = require('node-uuid');

import { PBXRouterController } from '../controllers/pbx_router';
import { PBXCallProcessController } from '../controllers/pbx_callProcess';
import { PBXLocalNumberController } from '../controllers/pbx_localNumber';
import { PBXCDRController } from '../controllers/pbx_cdr';
import { PBXIVRMenuController } from '../controllers/pbx_ivrMenu';
import { PBXIVRActionsController } from '../controllers/pbx_ivrAction';
import { PBXIVRInputController } from '../controllers/pbx_ivrInput';
import { PBXQueueStatisticController } from '../controllers/pbx_queueStatistic';
import { PBXAgentStatisticController } from '../controllers/pbx_agentStatistic';
import { PBXBlackListController } from '../controllers/pbx_blacklist';
import { PBXQueueController } from '../controllers/pbx_queue';
import { PBXExtensionController } from '../controllers/pbx_extension';
import { PBXAgentController } from '../controllers/pbx_agent';
import { PBXRecordFileController } from '../controllers/pbx_recordFile';
import { PBXTrunkController } from '../controllers/pbx_trunk';

import { TenantController } from '../controllers/tenant';

import { RoomController } from '../controllers/room';
import { PBXMessageController } from '../controllers/pbx_messages'
import { UserEventController } from '../controllers/userEvent';
@Injectable()
export class FreeSwitchChat extends EventEmitter2 {
    private logger: LoggerService;
    private liveChatVisitorList: string[];
    private liveChatServeList: LiveChatServe[];
    private childInjector: Injector;
    private extensionCtr: PBXExtensionController;
    private roomCtr: RoomController;
    private msgCtr: PBXMessageController;
    constructor(private injector: Injector) {
        super({ wildcard: true, delimiter: '::', maxListeners: 10000 });
        this.logger = this.injector.get(LoggerService);
        this.liveChatVisitorList = [];
        this.liveChatServeList = [];
        this.createChildInjector();

        this.extensionCtr = this.childInjector.get(PBXExtensionController);
        this.roomCtr = this.childInjector.get(RoomController);
        this.msgCtr = this.childInjector.get(PBXMessageController);
    }

    createChildInjector(): void {

        this.childInjector = ReflectiveInjector.resolveAndCreate([
            // 数据库相关服务注入
            PBXRouterController,
            PBXCallProcessController,
            PBXLocalNumberController,
            PBXCDRController,
            PBXIVRMenuController,
            PBXIVRInputController,
            PBXIVRActionsController,
            PBXQueueStatisticController,
            PBXAgentStatisticController,
            PBXBlackListController,
            PBXQueueController,
            PBXExtensionController,
            PBXAgentController,
            PBXRecordFileController,
            PBXTrunkController,
            TenantController,
            RoomController,
            PBXMessageController,
            UserEventController,
        ], this.injector);
    }

    async inboundHandleMsg(conn: Connection, evt: Event) {
        try {
            this.logger.info('New Message In Comming......');
            const from_user = evt.getHeader('from_user');
            const to_user = evt.getHeader('to_user');
            const from_host = evt.getHeader('from_host');
            const to_host = evt.getHeader('to_host');
            const msg = evt.getBody();

            console.log(`${from_user} TO ${to_user}:${msg}`, evt);

            if (to_user === 'livecat') {
                this.logger.debug('livecat');
                await this.liveChatMsg(conn, evt);
            }
            else if (to_user === 'system') {

            }
            else if (to_user === 'relivechat') {
                let remsg = msg.replace(/(^\s+)|(\s+$)/g, '');
                if (!remsg) {
                    remsg = '无语(^_^)';
                }
                const roomId = evt.getHeader('sip_h_X-Session-Id');
                const visitor = evt.getHeader('sip_h_X-Livechat-Visitor');
                this.logger.debug(`relivechat:${roomId},${visitor}`);
                await this.msgCtr.createLiveChatMessage({
                    tenantId: from_host,
                    rid: roomId,
                    from: 'agent',
                    msg,
                    conentType: 'text'
                })
                conn.message({
                    sessionId: roomId,
                    msgType: 'livechat',
                    to: visitor + '@' + to_host,
                    from: from_user + '@' + from_host,
                    subject: 'livechat',
                    profile: 'internal',//'external'
                    body: remsg
                }, (e) => { console.log(e.headers) })
            }
            else {
                conn.message({
                    from: to_user + '@' + to_host,
                    to: from_user + '@' + from_host,
                    subject: 'aaa',
                    profile: 'internal',//'external'
                    body: 'dsdsdReply'
                }, (e) => { console.log(e.headers) })
            }


        } catch (ex) {
            this.logger.error('inboud handle call error:', ex);
            return Promise.reject(ex);
        }
    }

    async liveChatMsg(conn: Connection, evt: Event) {
        try {
            this.logger.info('LiveChat Message In Comming......');
            const from_user = evt.getHeader('from_user');
            const to_user = evt.getHeader('to_user');
            const from_host = evt.getHeader('from_host');
            const to_host = evt.getHeader('to_host');
            const msg = evt.getBody();
            const roomId = evt.getHeader('sip_h_X-Session-Id');
            const visitorId = evt.getHeader('sip_h_X-Visitor-Id');
            console.log(`${from_user}@${from_host} TO ${to_user}@${to_host} : ${msg} roomid:${roomId}`, visitorId);

            const chatIndex = this.liveChatVisitorList.indexOf(roomId); // TODO 从redis中获取
            // 已经有过回话
            if (chatIndex > -1 && !this.liveChatServeList[chatIndex].isEnd) {
                const server = this.liveChatServeList[chatIndex];
                this.logger.debug(`访客正在和坐席${server.agentNumber}聊天`)
                await Promise.all([
                    this.msgCtr.createLiveChatMessage({
                        tenantId: from_host,
                        rid: roomId,
                        msg,
                        from: 'visitor',
                        conentType: 'text'
                    }),
                    this.roomCtr.incMsgCount(roomId)
                ])
                conn.message({
                    sessionId: roomId,
                    msgType: 'livechat',
                    from: from_user + '@' + from_host,
                    to: server.agentNumber + '@' + from_host,
                    subject: 'chat',
                    profile: 'internal',//'external'
                    body: msg
                }, (e) => { console.log(e.headers) })

            }
            // 新的会话
            else {
                const sessionId = generateUuid.v4();
                this.logger.debug(`新访客:${sessionId}`)
                // TODO 需要先用机器人吗
                // 随机从exntension表 找到活跃的分机联系
                const serverAgent = await this.extensionCtr.findMsgAgent(to_host);
                if (serverAgent) {
                    await Promise.all([
                        this.roomCtr.createLiveChatRoom({
                            tenantId: from_host,
                            rid: sessionId,
                            agentId: serverAgent.agentId._id,
                            roomName: '访客',
                            visitorId: visitorId
                        }),
                        this.msgCtr.createLiveChatMessage({
                            tenantId: from_host,
                            rid: sessionId,
                            from: 'visitor',
                            msg,
                            conentType: 'text'
                        })
                    ])

                    this.liveChatVisitorList.push(sessionId);
                    this.liveChatServeList.push({
                        agentId: serverAgent.agentId._id,
                        ts: new Date().getTime(),
                        agentNumber: serverAgent.accountCode,
                        isEnd: false,
                        sessionId: sessionId
                    })
                    // 是否启用欢迎语
                    // 向访客发送欢迎语
                    conn.message({
                        sessionId: sessionId,
                        msgType: 'livechat',
                        from: serverAgent.accountCode + '@' + from_host,
                        to: from_user + '@' + from_host,
                        subject: 'welcome',
                        profile: 'internal',//'external'
                        body: '您好，请问有什么可以帮助您？'
                    }, (e) => { console.log(e.headers) })

                    // 向选定的坐席发送访客的内容
                    conn.message({
                        sessionId: sessionId,
                        msgType: 'livechat',
                        from: from_user + '@' + from_host,
                        to: serverAgent.accountCode + '@' + from_host,
                        subject: 'chat',
                        profile: 'internal',//'external'
                        body: msg
                    }, (e) => { console.log(e.headers) })

                }
                else {
                    // 没有在线的需要机器人吗
                    this.logger.debug('没有在线的坐席')
                    conn.message({
                        from: 'livechat_replay' + '@' + from_host,
                        to: from_user + '@' + from_host,
                        subject: 'welcome',
                        profile: 'internal',//'external'
                        body: '当前无在线坐席'
                    }, (e) => { console.log(e.headers) })
                }





            }



        } catch (ex) {
            this.logger.error('inboud handle call error:', ex);
            return Promise.reject(ex);
        }
    }



}

type LiveChatServe = {
    agentId: string;
    agentNumber: string;
    sessionId: string;
    isEnd: boolean;
    ts: number;
    endTime?: number;
    lastSendTime?: number;
}