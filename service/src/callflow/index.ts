import { Injector, ReflectiveInjector, Injectable } from 'injection-js';
import { ConfigService } from '../service/ConfigService';
import { LoggerService } from '../service/LogService';
import { Connection } from '../lib/NodeESL/Connection';
import { Event } from '../lib/NodeESL/Event';

import { FreeSwitchPBX } from './FreeSwitchPBX';
@Injectable()
export class FreeSwitchCallFlow {
    private logger:LoggerService;
    private fsPbx:FreeSwitchPBX;
    private childInjector: Injector;
    constructor(private injector: Injector,conn:Connection) {
        this.logger = this.injector.get(LoggerService);
        this.createChildInjector(conn);
        this.fsPbx =  this.childInjector.get(FreeSwitchPBX);
    }
    createChildInjector(conn:Connection): void {
        this.childInjector = ReflectiveInjector.resolveAndCreate([
            {
                provide: FreeSwitchPBX, useFactory: () => {                  
                    return new FreeSwitchPBX(conn,this.injector);
                },
                deps: [] //这里不能丢
            },
        ], this.injector);
      }
    /**
     * @description 启动电话逻辑处理流程
     */
    async start() {
        try {
            this.logger.debug('Begin Call Flow!')
            await this.billing();
            await this.route();
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

     /**
     * @description 开始路由处理
     */
    async route() {
        try {
            await this.fsPbx.linger();
            this.logger.debug('====================');
            const subRes = await this.fsPbx.subscribe(['ALL']);
            this.logger.debug('route',subRes);
        } catch (ex) {

        }
    }

    
}