import { Injector, ReflectiveInjector, Injectable } from 'injection-js';
import { ConfigService } from '../service/ConfigService';
import { LoggerService } from '../service/LogService';
import { ESLEventNames } from '../service/ESLEventNames';
import { Connection } from '../lib/NodeESL/Connection';
import { Event } from '../lib/NodeESL/Event';
import { EventEmitter2 } from 'eventemitter2';

import { FreeSwitchPBX } from './FreeSwitchPBX';
import { RuntimeData } from './RunTimeData';
@Injectable()
export class FreeSwitchCallFlow extends EventEmitter2 {
    private logger: LoggerService;
    private fsPbx: FreeSwitchPBX;
    private childInjector: Injector;
    private isEnd: Boolean;
    private callId: String;
    private runtimeData: RuntimeData;
    private eslEventNames: ESLEventNames;
    constructor(private injector: Injector, private conn: Connection) {
        super({ wildcard: true, delimiter: '::', maxListeners: 10000 });
        this.logger = this.injector.get(LoggerService);
        this.eslEventNames = this.injector.get(ESLEventNames);
        this.createChildInjector(this.conn);
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
            }
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
    * @description 开始路由处理
    */
    async route() {
        try {
            this.logger.debug(`route->callId:`, this.callId);

        } catch (ex) {

        }
    }

    getCallId() {
        return this.callId;
    }


}