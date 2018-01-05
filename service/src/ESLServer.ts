/**
 * Freeswitch ESL 应用
 */

import { FreeSwitchServer } from './lib/NodeESL/Server';
import { Injector, ReflectiveInjector,Injectable } from 'injection-js';
import { EventEmitter2 } from 'eventemitter2';
/**
 * 引入配置服务、日志服务以及芒果数据库服务
 */
import { ConfigService } from './service/ConfigService';
import { LoggerService } from './service/LogService';
import { MongoService  } from './service/MongoService';
const DefaultESLCONF = {
    host: '0.0.0.0',
    port: 8085
}
@Injectable()
export class ESLServer extends EventEmitter2 {
    eslServer:FreeSwitchServer;
    constructor(private injector: Injector, private logger: LoggerService,
        private config: ConfigService,
        private mongoDB: MongoService){
        super();
        this.eslServer = new FreeSwitchServer(DefaultESLCONF);
    }
    async startOutbound(){
        try {
        const res = await this.eslServer.createOutboundServer();

        }
        catch(ex){
            this.logger.error('Start Outbound Server Error:',ex);
        }
    }
}