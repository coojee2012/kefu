/**
 * Freeswitch ESL 应用
 */
import { Connection } from './lib/NodeESL/Connection';
import { FreeSwitchServer } from './lib/NodeESL/Server';
import { Event } from './lib/NodeESL/Event';
import { Injector, ReflectiveInjector, Injectable } from 'injection-js';
import { EventEmitter2 } from 'eventemitter2';
/**
 * 引入配置服务、日志服务以及芒果数据库服务
 */
import { ConfigService } from './service/ConfigService';
import { LoggerService } from './service/LogService';
import { MongoService } from './service/MongoService';
import { FreeSwitchCallFlow } from './callflow'; 
const DefaultESLCONF = {
    host: '0.0.0.0',
    port: 8085
}
@Injectable()
export class ESLServer extends EventEmitter2 {
    eslServer: FreeSwitchServer;
    constructor(private injector: Injector, private logger: LoggerService,
        private config: ConfigService,
        private mongoDB: MongoService) {
        super();
        this.eslServer = new FreeSwitchServer(DefaultESLCONF);
    }
   
    async startOutbound() {
        try {
            const res = await this.eslServer.createOutboundServer();
            this.logger.info('[startOutbound]',res);
            /**
             * ESL连接打开
             */
            this.eslServer.on('connection::open', this.onEslConnOpen.bind(this));
            /**
             * ESL连接就绪
             */
            this.eslServer.on('connection::ready', this.onEslConnReady.bind(this));
            /**
             * ESL连接断开
             */
            this.eslServer.on('connection::close', this.onEslConnClose.bind(this));
        }
        catch (ex) {
            this.logger.error('Start Outbound Server Error:', ex);
        }
    }


    async onEslConnOpen(conn:Connection, id: string) {
        try {

            this.logger.debug(`onEslConnOpen->${id}:`,conn.getInfo());
        } catch (ex) {
            this.logger.error('onEslConnOpen Error:', ex);
        }
    }

    async onEslConnReady(conn:Connection, id: string) {
        try {
            const connEvent:Event = conn.getInfo();
            this.logger.debug(`onEslConnReady->${id}:`,connEvent.getHeader('Unique-ID'));
            if(conn.isInBound())
            {

            }else {
                await this.handleOutbound(conn,id);
            }
            
        } catch (ex) {
            this.logger.error('onEslConnReady Error:', ex);
        }
    }

    async onEslConnClose(conn:Connection, id: string) {
        try {
            this.logger.debug(`onEslConnClose->${id}:`,conn.getInfo());
            this.emit(`esl:conn::close::${id}`);
        } catch (ex) {
            this.logger.error('onEslConnClose Error:', ex);
        }
    }

    async handleOutbound(conn:Connection,id: string) {
        try{
        const fsCallFlow = new FreeSwitchCallFlow(this.injector,conn);
        this.once(`esl:conn::close::${id}`,() =>{
            this.logger.info(`esl conn ${id} has closed yet!`);
        })
        const result = await fsCallFlow.start();
        this.logger.info(`${id} handle result:`,result);
        }catch(ex){
            this.logger.error('handleOutbound Error:', ex);
        }
    }
}