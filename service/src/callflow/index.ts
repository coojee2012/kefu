import { Injector, ReflectiveInjector, Injectable } from 'injection-js';
import { ConfigService } from '../service/ConfigService';
import { LoggerService } from '../service/LogService';
import { ESLEventNames } from '../service/ESLEventNames';
import { Connection } from '../lib/NodeESL/Connection';
import { Event } from '../lib/NodeESL/Event';
import { EventEmitter2 } from 'eventemitter2';

import { FreeSwitchPBX } from './FreeSwitchPBX';
import { RuntimeData } from './RunTimeData';

import { PBXRouterController } from '../controllers/pbx_router';
import { PBXCallProcessController } from '../controllers/pbx_callProcess';
import { PBXLocalNumberController } from '../controllers/pbx_localNumber';
import { PBXCDRController } from '../controllers/pbx_cdr';
@Injectable()
export class FreeSwitchCallFlow extends EventEmitter2 {
    private logger: LoggerService;
    private fsPbx: FreeSwitchPBX;
    private childInjector: Injector;
    private isEnd: Boolean;
    private callId: String;
    private runtimeData: RuntimeData;
    private eslEventNames: ESLEventNames;
    private routerControl: PBXRouterController;
    private callProcessControl: PBXCallProcessController;
    private cdrControl: PBXCDRController;

    constructor(private injector: Injector, private conn: Connection) {
        super({ wildcard: true, delimiter: '::', maxListeners: 10000 });
        this.logger = this.injector.get(LoggerService);
        this.eslEventNames = this.injector.get(ESLEventNames);
        this.createChildInjector(this.conn);
        this.routerControl = this.childInjector.get(PBXRouterController);
        this.callProcessControl = this.childInjector.get(PBXCallProcessController);
        this.cdrControl = this.childInjector.get(PBXCDRController);
        this.fsPbx = this.childInjector.get(FreeSwitchPBX);
        this.runtimeData = this.childInjector.get(RuntimeData);
        this.isEnd = false;
        const connEvent: Event = this.conn.getInfo();
        this.callId = connEvent.getHeader('Unique-ID');
    }
    createChildInjector(conn: Connection): void {
        this.childInjector = ReflectiveInjector.resolveAndCreate([

            {
                provide: FreeSwitchPBX, useFactory: () => {
                    return new FreeSwitchPBX(conn, this.injector);
                },
                deps: [] //这里不能丢
            },
            {
                provide: RuntimeData, useFactory: () => {
                    return new RuntimeData(conn, this.injector);
                },
                deps: [] //这里不能丢
            },
            // 数据库相关服务注入
            PBXRouterController,
            PBXCallProcessController,
            PBXLocalNumberController,
            PBXCDRController,
        ], this.injector);
    }
    /**
     * @description 启动电话逻辑处理流程
     */
    async start() {
        try {
            this.logger.debug('Begin Call Flow!')
            this.conn.on('esl::event::disconnect::notice', (event: Event) => {
                const disposition = event.getHeader('Content-Disposition');
                if (disposition === 'linger') {
                    const lingerTime = event.getHeader('Linger-Time');
                    this.logger.warn(`ESL Conn will disconnect after:${lingerTime}s`);
                } else {
                    this.logger.debug(`ESL Conn is disconnecting!!!`);
                }
            })
            await this.fsPbx.linger(30);
            const subRes = await this.fsPbx.subscribe(['ALL']);
            await this.fsPbx.filter('Unique-ID', this.callId);

            await this.billing();
            this.listenAgentEvent();
            await this.route();
            this.logger.debug('CallFlowEND:');
        } catch (ex) {
            this.logger.error('In Call Flow Sart:', ex);
        }
    }

    async end() {
        try {
            this.isEnd = true;
        } catch (ex) {

        }
    }

    /**
     * @description 开始计费
     */
    async billing() {
        try {
            const { tenantId, callId, caller, callee,routerLine } = this.runtimeData.getRunData();
            const {  sipCallId,channelName,useContext } = this.runtimeData.getChannelData();
            await this.cdrControl.create({
                tenantId: tenantId,
                routerLine:routerLine,
                srcChannel: channelName,
                context: useContext,
                caller: caller,
                called: callee,
                callId: callId,
                agiType: 'a-leg',
                isClickOut: false,
                recordCall: true,
                sipCallId,
                isTransfer:false,
                associateId: []
            })

        } catch (ex) {

        }
    }

    // 监听坐席电话条发起的事件：如挂机，保持等事件
    listenAgentEvent() {
        try {
            const agentEvents = this.eslEventNames.ESLUserEvents;
            this.on(`${agentEvents.hangup}::${this.callId}`, this.onAgentHangup.bind(this))
        }
        catch (ex) {

        }
    }

    async onAgentHangup() {
        try {

        } catch (ex) {

        }
    }

    /** 
     * @description 通过主叫和被叫号码从数据库中获取匹配的路由规则
     * 
     * */
    async getRoute() {
        try {
            const { tenantId, routerLine, callId } = this.runtimeData.getRunData();
            let { caller: caller, callee: called } = this.runtimeData.getRunData();
            const result = {
                processmode: '',
                processdefined: null,
                routerLine: '',
                match: false,
                matchFailError: ''
            }
            const routeDocs = await this.routerControl.getRouterByTenantId(tenantId, routerLine);
            for (let i: number = 0; i < routeDocs.length; i++) {
                let doc = routeDocs[i];
                this.logger.debug("循环去匹配找到的路由规则：", doc.routerName);
                if (!result.match) {
                    if (doc.callerGroup === 'all') {
                        this.logger.debug("开始进行呼叫路由判断,主叫:", caller, ",被叫:", called);
                        result.match = true;
                        let reCaller = new RegExp("^" + doc.callerId);
                        let reCalled = new RegExp("^" + doc.calledNum);

                        // _this.db.cdrSetRouterLine(doc.routerLine, 'Router');

                        if (doc.routerLine === '呼入') {
                            //匹配主叫以什么号码开头
                            if (doc.callerId && !reCaller.test(caller)) {
                                result.match = false;
                            }
                            //匹配主叫号码长度
                            if (doc.callerLen > 0 && caller.length !== doc.callerLen) {
                                result.match = false;
                            }
                            //匹配被叫开头
                            if (doc.calledNum && !reCalled.test(called)) {
                                result.match = false;
                            }
                            //匹配被叫长度
                            if (doc.calledLen > 0 && called.length !== doc.calledLen) {
                                result.match = false;
                            }
                        }
                        else if (doc.routerLine === '呼出') {
                            //匹配被叫以什么号码开头
                            if (doc.calledNum && !reCalled.test(called)) {
                                result.match = false;
                            }
                            //匹配被叫长度
                            if (doc.calledLen > 0 && called.length !== doc.calledLen) {
                                result.match = false;
                            }
                            // _this.R.agentId = await _this.R.service.extension.getAgentId(_this.R.tenantId, _this.R.caller);
                            // _this.db.cdrSetAgentId(_this.R.agentId, 'Router');
                        }
                        else if (doc.routerLine === '本地') {
                            //匹配被叫以什么号码开头
                            if (doc.calledNum && !reCalled.test(called)) {
                                result.match = false;
                            }
                            //匹配被叫长度
                            if (doc.calledLen > 0 && called.length !== doc.calledLen) {
                                result.match = false;
                            }
                            // _this.R.agentId = await _this.R.service.extension.getAgentId(_this.R.tenantId, _this.R.caller);
                            // _this.db.cdrSetAgentId(_this.R.agentId, 'Router');
                        }
                        else {
                            //其他情况
                            result.match = false;
                            result.matchFailError = `未知的routerLine${doc.routerLine}`;
                        }
                        result.routerLine = doc.routerLine;
                        //匹配成功后，对主叫和被叫进行替换
                        if (result.match) {
                            //主叫替换
                            this.logger.debug("路由匹配成功，开始进行替换操作!");
                            if (doc.replaceCallerId !== '') {
                                caller = doc.replaceCallerId;
                            }
                            //删除被叫前几位
                            if (doc.replaceCalledTrim > 0) {
                                called = called.substr(doc.replaceCalledTrim);
                            }
                            //补充被叫前几位
                            if (doc.replaceCalledAppend !== '') {
                                called = doc.replaceCalledAppend + called;
                            }
                            result.processmode = doc.processMode;
                            if (result.processmode === 'dialout') {
                                result.processdefined = doc.processedFined;
                            }
                            else if (result.processmode === 'dialpbxlocal') {
                                result.processdefined = doc.processedFined;
                            }
                            else if (result.processmode === 'dialoutNewRock') {
                                result.processdefined = doc.processedFined;
                            }
                            else {
                                result.processmode = 'diallocal';
                                if (routerLine === '本地') {
                                    result.processdefined = called;
                                }
                                else if (routerLine === '呼入') {
                                    result.processdefined = doc.processedFined || '200';
                                } else {
                                    result.processdefined = doc.processedFined
                                }
                            }
                            //callProcessData.passArgs.routerName = doc.routerName;
                            //callProcessData.passArgs.match = true;
                            //callProcessData.passArgs.processmode = result.processmode;
                            //callProcessData.passArgs.processedFined = result.processedFined;
                            break;
                        }
                    }
                }
            }
            if (!result.match) {
                this.logger.debug("路由匹配失败，进行默认设置处理!");
                if (called === '100') {
                    result.processmode = 'diallocal';
                    result.processdefined = '200';
                }
                else {
                    result.matchFailError = '未找到适合的路由!';
                }
            }
            const callProcessData = {
                tenantId: tenantId,
                callId: callId,
                caller: caller,
                called: called,
                processName: 'route',
                passArgs: { match: false, routerName: '', processmode: '', processedFined: '' },
            }
            await this.callProcessControl.create(callProcessData);
            this.logger.debug('Route Result:', result);
            return Promise.resolve(result);
        } catch (ex) {
            return Promise.reject(ex);
        }
    }
    /**
    * @description 开始路由处理
    */
    async route() {
        try {
            this.logger.debug(`route->callId:`, this.callId);
            let { processmode, processdefined: any, routerLine } = await this.getRoute();
            switch (processmode) {
                case 'diallocal':
                    // result = await _this.flowBase.dialLocal(processdefined);
                    //_this.R.logger.debug(loggerPrefix.concat(['route']), 'diallocal result:', result);
                    break;
                case 'dialout':
                    // result = await _this.flowBase.dialOut(_this.R.called, processdefined);
                    //_this.R.logger.debug(loggerPrefix.concat(['route']), 'dialout result:', result);
                    //await _this.wait(3000);
                    break;
                case 'dialpbxlocal':
                    // result = await _this.flowBase.dialPbxLocal(_this.R.called, processdefined);
                    //_this.R.logger.debug(loggerPrefix.concat(['route']), 'dialpbxlocal result:', result);
                    break;
                case 'dialoutNewRock':
                    //result = await _this.flowBase.dialoutNewRock(_this.R.called, processdefined);
                    // _this.R.logger.debug(loggerPrefix.concat(['route']), 'dialoutNewRock result:', result);
                    break;
                case 'blacklist':
                    // result = await _this.flowBase.blackList();
                    break;
                default:
                    // result = await _this.defaultRoute();
                    break;
            }
        } catch (ex) {
            return Promise.reject(ex);
        }
    }

    getCallId() {
        return this.callId;
    }


}