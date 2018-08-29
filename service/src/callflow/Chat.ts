import { Injector, ReflectiveInjector, Injectable } from 'injection-js';
import { ConfigService } from '../service/ConfigService';
import { LoggerService } from '../service/LogService';
import { ESLEventNames } from '../service/ESLEventNames';
import { Connection } from '../lib/NodeESL/Connection';
import { Event } from '../lib/NodeESL/Event';
import { EventEmitter2 } from 'eventemitter2';


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



@Injectable()
export class FreeSwitchChat extends EventEmitter2 {
    private logger: LoggerService;
    private liveChatVisitorList: string[];
    private liveChatServeList: LiveChatServe[];
    private childInjector: Injector;
    private extensionCtr: PBXExtensionController;
    constructor(private injector: Injector) {
        super({ wildcard: true, delimiter: '::', maxListeners: 10000 });
        this.logger = this.injector.get(LoggerService);
        this.liveChatVisitorList = [];
        this.liveChatServeList = [];
        this.createChildInjector();

        this.extensionCtr = this.childInjector.get(PBXExtensionController);
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

            console.log(`${from_user} TO ${to_user}:${msg}`,evt);

            if (to_user === 'livecat') {
                this.logger.debug('livecat');
                await this.liveChatMsg(conn, evt);
            }
            else if (to_user === 'system') {

            }
            else if(to_user==='relivechat'){
                const d = msg.split('::');
                const visitor = d.shift();
                let remsg = d.join('').replace(/(^\s+)|(\s+$)/g, '');
                if(!remsg) {
                    remsg = '无语(^_^)';
                }
                
                conn.message({
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

            console.log(`${from_user}@${from_host} TO ${to_user}@${to_host} : ${msg}`);

            const chatIndex = this.liveChatVisitorList.indexOf(from_user);
            // 已经有过回话
            if (chatIndex > -1 && !this.liveChatServeList[chatIndex].isEnd) {


                const server = this.liveChatServeList[chatIndex];
                this.logger.debug(`访客正在和坐席${server.agentNumber}聊天`)
                conn.message({
                    from: from_user + '@' + from_host,
                    to: server.agentNumber + '@' + from_host,
                    subject: 'chat',
                    profile: 'internal',//'external'
                    body: msg
                }, (e) => { console.log(e.headers) })

            }
            // 新的会话
            else {

                this.logger.debug(`新访客`)
                // 随机从exntension表 找到活跃的分机联系
                const serverAgent = await this.extensionCtr.findMsgAgent(to_host);
                // 需要机器人吗
                if (serverAgent) {
                    this.liveChatVisitorList.push(from_user);
                    this.liveChatServeList.push({
                        agentId: serverAgent.agentId,
                        ts: new Date().getTime(),
                        agentNumber: serverAgent.accountCode,
                        isEnd: false,
                        sessionId: ''
                    })
                    // 是否启用欢迎语
                    // 向访客发送欢迎语
                    conn.message({
                        from: serverAgent.accountCode + '@' + from_host,
                        to: from_user + '@' + from_host,
                        subject: 'welcome',
                        profile: 'internal',//'external'
                        body: '欢迎使用某某某系统'
                    }, (e) => { console.log(e.headers) })

                    // 向选定的坐席发送访客的内容
                    conn.message({
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