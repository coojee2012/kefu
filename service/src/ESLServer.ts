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
import { FreeSwitchChat } from './callflow/Chat';
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
        private fsChat: FreeSwitchChat,
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
            await this.readyRedisClients();
            this.eslServer = new FreeSwitchServer(DefaultInboundESLCONF);

            this.eventService = this.injector.get(EventService);
            this.eventService.initRedisSub();

            this.eventService.addARedisSub('stopFindAgent');
            this.eventService.addARedisSub('esl::callcontrol::queue::finded::member');

            this.queueWorker = this.injector.get(QueueWorkerService);
            await this.queueWorker.init();
            await this.queueWorker.readyCacheBullQueue(); // 从缓存中恢复在使用的队列


            const conn = await this.eslServer.createInboundServer();
            const calls: string[] = [];

            setInterval(() => {
                conn.api('sofia', ['status', 'profile', 'internal', 'reg'], (evt: Event) => {
                    const value: string = evt.body;
                    this.logger.debug('REG:', value);
                });
            }, 5000)

            conn.on('esl::event::MESSAGE::**', (evt) => {

                this.fsChat.inboundHandleMsg(conn, evt)
                    .then()
                    .catch(err => {

                    })


            })

            conn.on('esl::event::CHANNEL_PARK::**', (evt) => {
                const callId = evt.getHeader('Unique-ID');
                const isDialQueueMember = evt.getHeader('variable_dial_queuemember');
                if (isDialQueueMember === 'yes') {
                    this.logger.debug('拨打队列成员');
                }
                else if (calls.indexOf(callId) < 0) {
                    calls.push(callId);
                    this.inboundHandleCall(conn, evt)
                        .then()
                        .catch()
                }
                else {

                }
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
            this.logger.info('New Call In Comming......');
            const fsCallFlow = new FreeSwitchCallFlow(this.injector, conn, initEvent);
            this.handleAgentEvents(fsCallFlow);
            const result = await fsCallFlow.start();
            this.logger.info(`Inbound handle call result:`, result);
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
            this.logger.error('handle agent events error:', ex);
        }
    }
}