import { Injector, ReflectiveInjector, Injectable } from 'injection-js';
import { ConfigService } from '../service/ConfigService';
import { LoggerService } from '../service/LogService';
import { Connection } from '../lib/NodeESL/Connection';
import { Event } from '../lib/NodeESL/Event';
@Injectable()
export class FreeSwitchPBX {
    private logger: LoggerService;
    constructor(private conn: Connection, private injector: Injector) {
        this.logger = this.injector.get(LoggerService);
        this.logger.debug('init freeswitch PBX!');
    }
    /**
     * @description
     * 监听指定的FS事件，FS事件默认返回json字符串
     * event plain ALL
     * event plain CHANNEL_CREATE CHANNEL_DESTROY CUSTOM conference::maintenance sofia::register sofia::expire
     * event xml ALL
     * event json CHANNEL_ANSWER
     * 先执行
     * event plain DTMF
     * 再执行
     * event plain CHANNEL_ANSWER
     * 最终会监听 DTMF 和 CHANNEL_ANSWER 两个事件
     * @param events 
     */
    async subscribe(events: string[]) {
        try {
            const result = await new Promise((resolve, reject) => {
                this.conn.subscribe(events, (evt: Event) => {
                    this.logger.debug('subscribe:', evt.getHeader('Reply-Text'));
                    resolve();
                });
            });
        }
        catch (ex) {
            this.logger.error('subscribe', ex);
        }
    }
    async linger() {
        try {
            const result = await new Promise((resolve, reject) => {
                this.conn.sendRecv('linger', (evt: Event) => {
                    this.logger.debug('linger:', evt.getHeader('Reply-Text'));
                    resolve();
                });
            })
            return result;
        }
        catch (ex) {
            this.logger.error('linger', ex);
        }

    }

    /**
     * @description
     * 指定要侦听的事件类型。注意：这里的过滤不是排除出去而是加入
     * 以下示例将订阅所有事件，然后创建两个过滤器，一个用于侦听HEARTBEATS，另一个用于侦听CHANNEL_EXECUTE事件。
     * events json all
     * filter Event-Name CHANNEL_EXECUTE
     * filter Event-Name HEARTBEAT
     * 现在只会收到HEARTBEAT和CHANNEL_EXECUTE事件。您可以过滤事件中任何的header。要筛选特定channel，您需要使用uuid：
     * filter Unique-ID d29a070f-40ff-43d8-8b9d-d369b2389dfe
     * 要过滤多个唯一ID，您可以为每个UUID添加另一个事件过滤器。
     * filter plain all
     * filter plain CUSTOM conference::maintenance
     * filter Unique-ID $participantB
     * filter Unique-ID $participantA
     * filter Unique-ID $participantC
     * 这会给你参加任何会议的参与者A，B和C的事件。要接收会议中所有用户的事件，您可以使用如下所示的内容：
     * filter Conference-Unique-ID $ConfUUID
     * @param header 
     * @param value 
     */
    async filter(header, value) {
        try {
            const result = await new Promise((resolve, reject) => {
                this.conn.filter(header, value, (evt: Event) => {
                    this.logger.debug('filter:', evt.getHeader('Reply-Text'));
                    resolve();
                });
            })
            return result;
        } catch (ex) {
            this.logger.error('filter', ex);
        }
    }

    /**
     * @description
     * 指定您要撤消过滤器的事件。当某些过滤器错误地应用或者没有使用过滤器时，可以使用过滤器删除。
     * 使用方式：
     * filter delete <EventHeader> <ValueToFilter>
     * 比如：
     * filter delete Event-Name HEARTBEAT
     * 现在，你将不再收到HEARTBEAT事件。您可以删除以这种方式应用的任何过滤器。
     * filter delete Unique-ID d29a070f-40ff-43d8-8b9d-d369b2389dfe
     * 这是删除为给定的唯一标识符应用的过滤器。在此之后，您将不会收到任何此唯一ID的事件。
     * filter delete Unique-ID
     * 这会删除基于unique-id应用的所有过滤器。
     */
    async filterDelete(){

    }
}