
import { Injector, ReflectiveInjector, Injectable } from 'injection-js';
import { ConfigService } from '../service/ConfigService';
import { LoggerService } from '../service/LogService';
import { DeepStreamService } from '../service/DeepStreamService';


export class MsgBus {
    private dsService: DeepStreamService;
    private logger: LoggerService;
    constructor(private injector: Injector) {
        this.logger = this.injector.get(LoggerService);
        this.dsService = this.injector.get(DeepStreamService);

    }
    /**
 * @description
 * 通知坐席一些消息
 * @param data - {
 * tenantId:String
 * agentNumber:String
 * logicType:String - In [hold,consult,conference,transfer...]
 * code:Number
 * message:String
 * }
 * @return {*}
 */
    async sendMsgToAgent(data: { tenantId: string, agentNumber: string, logicType: string, code?: number, message: string }) {
        try {
            const { tenantId, agentNumber } = data;
            const defaultData = {
                tenantId: '',
                agentNumber: '',
                logicType: '',
                code: 1000,
                message: ''
            }
            const msgData = JSON.stringify(Object.assign({ eventType: 'agentMessages' }, defaultData, data));
            this.logger.debug('sendMsgToAgent', msgData);
            if (!tenantId || !agentNumber) {
                return Promise.reject(`sendMsgToAgent prams error:${tenantId},${agentNumber}`);
            }
            else {
                const eventName = `kefu::client::${tenantId}::${agentNumber}`;
                await this.dsService.eventPub(eventName, msgData);
                return Promise.resolve();
            }

        } catch (ex) {
            return Promise.reject(ex);
        }
    }

    async sendStateToAgent(tenantId: string, agentNumber: string, state: string) {
        try {
            if (!tenantId || !agentNumber) {
                return Promise.reject(`sendMsgToAgent prams error:${tenantId},${agentNumber}`);
            }
            else {
                const msgData = JSON.stringify(Object.assign({ eventType: 'agentStateChange' }, { state: state }));
                const eventName = `kefu::client::${tenantId}::${agentNumber}`;
                await this.dsService.eventPub(eventName, msgData);
                return Promise.resolve();
            }

        } catch (ex) {
            return Promise.reject(ex);
        }

    }
}