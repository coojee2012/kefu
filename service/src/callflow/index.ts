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
@Injectable()
export class FreeSwitchCallFlow extends EventEmitter2 {
    private logger: LoggerService;
    private fsPbx: FreeSwitchPBX;
    private childInjector: Injector;
    private isEnd: Boolean;
    private callId: String;
    private runtimeData: RuntimeData;
    private eslEventNames: ESLEventNames;
    private routerControl:PBXRouterController;
    private callProcessControl:PBXCallProcessController;
    constructor(private injector: Injector, private conn: Connection) {
        super({ wildcard: true, delimiter: '::', maxListeners: 10000 });
        this.logger = this.injector.get(LoggerService);
        this.eslEventNames = this.injector.get(ESLEventNames);
        this.createChildInjector(this.conn);
        this.routerControl = this.childInjector.get(PBXRouterController);
        this.callProcessControl = this.childInjector.get(PBXCallProcessController);
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
    async getRoute(){
        try{
            const { tenantId,routerLine,caller,callee,callId } = this.runtimeData.getRunData();
            const result = await this.routerControl.getRouterByTenantId(tenantId, routerLine,caller,callee,callId);
            return Promise.resolve(result);
        }catch(ex){
            return Promise.reject(ex);
        }
    }
    /**
    * @description 开始路由处理
    */
    async route() {
        try {
            this.logger.debug(`route->callId:`, this.callId);
            let {processmode, processdefined:any, routerLine}  = await this.getRoute();
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