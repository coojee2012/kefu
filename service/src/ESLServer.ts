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
import { RedisService } from './service/RedisService';
import { EventService } from './service/EventService';
import { QueueWorkerService } from './callflow/QueueWorkerService';
import { FreeSwitchCallFlow } from './callflow';
import { ESLEventNames } from './service/ESLEventNames';
import { resolve, reject } from 'bluebird';
import { Key } from 'selenium-webdriver';
const DefaultESLCONF = {
    host: '0.0.0.0',
    port: 8085
}

const DefaultInboundESLCONF = {
    host: '192.168.2.230',
    port: 8021
}
@Injectable()
export class ESLServer extends EventEmitter2 {
    eslServer: FreeSwitchServer;
    private queueWorker: QueueWorkerService;
    private eventService: EventService;
    constructor(private injector: Injector, private logger: LoggerService,
        private eslEventNames: ESLEventNames,
        private config: ConfigService,
        private redisService: RedisService,
        private mongoDB: MongoService) {
        super();


    }

    /**
   * 连接mongo数据库
   */
    async readyMongoDB() {
        try {
            await this.mongoDB.connectDB();
        }
        catch (ex) {
            return Promise.reject(ex);
        }
    }

    async readyRedisClients() {
        try {
            this.redisService.setNamePrefix('ESL');
            await this.redisService.addClient(10, 'BullQueue');
            await this.redisService.addClient(11, 'RedLock');
            await this.redisService.addClient(12, 'PUB');
            await this.redisService.addClient(12, 'SUB');
        }
        catch (ex) {
            return Promise.reject(ex);
        }
    }



    async startOutbound() {
        try {
            await this.readyMongoDB();
            await this.readyRedisClients();

            this.eslServer = new FreeSwitchServer(DefaultESLCONF);

            this.eventService = this.injector.get(EventService);
            this.eventService.initRedisSub();

            this.eventService.addARedisSub('stopFindAgent');
            this.eventService.addARedisSub('esl::callcontrol::queue::finded::member');

            this.queueWorker = this.injector.get(QueueWorkerService);
            await this.queueWorker.init();
            await this.queueWorker.readyCacheBullQueue(); // 从缓存中恢复在使用的队列
            const res = await this.eslServer.createOutboundServer();
            this.logger.info('[startOutbound]', res);
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
            return Promise.reject(ex);
        }
    }


    async startInbound() {
        try {
            await this.readyMongoDB();
            //await this.readyRedisClients();
            this.eslServer = new FreeSwitchServer(DefaultInboundESLCONF);
            const conn = await this.eslServer.createInboundServer();
            conn.on('esl::event::MESSAGE::**', (evt) => {
                const from_user = evt.getHeader('from_user');
                const to_user = evt.getHeader('to_user');
                const from_host = evt.getHeader('from_host');
                const to_host = evt.getHeader('to_host');
                const msg = evt.getBody();
                conn.message({
                    from: to_user+'@'+to_host,
                    to: from_user+'@'+from_host,
                    subject:'aaa',
                    profile:'internal',//'external'
                    body: 'dsdsdReply'
                },(e)=>{console.log(e.headers)})
                console.log(`${from_user} TO ${to_user}:${msg}`);
            })

            conn.on('esl::event::CHANNEL_PARK::**', (evt) => {
                const callId = evt.getHeader('Unique-ID');
                this.logger.debug('inboud handle call', callId);
                this.inboundHandleCall(conn, evt)
                    .then()
                    .catch()
            })
        }
        catch (ex) {
            return Promise.reject(ex);
        }
    }


    async onEslConnOpen(conn: Connection, id: string) {
        try {

            this.logger.debug(`onEslConnOpen->${id}:`, conn.getInfo());
        } catch (ex) {
            this.logger.error('onEslConnOpen Error:', ex);
        }
    }

    async onEslConnReady(conn: Connection, id: string) {
        try {
            const connEvent: Event = conn.getInfo();
            this.logger.debug(`onEslConnReady->${id}:`, connEvent.getHeader('Unique-ID'));
            if (conn.isInBound()) {

            } else {
                await this.handleOutbound(conn, id);
            }

        } catch (ex) {
            this.logger.error('onEslConnReady Error:', ex);
        }
    }

    async onEslConnClose(conn: Connection, id: string) {
        try {
            const connEvent: Event = conn.getInfo();
            this.logger.debug(`onEslConnClose->${id}:`, connEvent.getHeader('Unique-ID'));
            this.emit(`esl:conn::close::${id}`, connEvent.getHeader('Unique-ID'));
        } catch (ex) {
            this.logger.error('onEslConnClose Error:', ex);
        }
    }

    async handleOutbound(conn: Connection, id: string) {
        try {
            const fsCallFlow = new FreeSwitchCallFlow(this.injector, conn);
            this.once(`esl:conn::close::${id}`, (callId) => {
                this.logger.info(`esl conn ${id} has closed yet!callId is ${callId}!`);
                fsCallFlow.end()
                    .then(() => {

                    })
                    .catch(err => {

                    })
            })
            this.handleAgentEvents(fsCallFlow);
            const result = await fsCallFlow.start();
            this.logger.info(`${id} handle result:`, result);
        } catch (ex) {
            this.logger.error('handleOutbound Error:', ex);
            return Promise.reject(ex);
        }
    }

    async inboundHandleCall(conn: Connection, initEvent: Event) {
        try {
            const fsCallFlow = new FreeSwitchCallFlow(this.injector, conn, initEvent);
            this.handleAgentEvents(fsCallFlow);
            const result = await fsCallFlow.start();
            this.logger.info(`inbound handle call result:`, result);
        } catch (ex) {
            this.logger.error('inboud handle call error:', ex);
            return Promise.reject(ex);
        }
    }

    handleAgentEvents(fsCallFlow: FreeSwitchCallFlow) {
        try {
            const agentEvents = this.eslEventNames.ESLUserEvents;
            Object.keys(agentEvents)
                .forEach(key => {
                    this.on(agentEvents[key], (...args) => {
                        fsCallFlow.emit(`${agentEvents[key]}::${fsCallFlow.getCallId()}`, args);
                    })
                })
        } catch (ex) {

        }
    }
}