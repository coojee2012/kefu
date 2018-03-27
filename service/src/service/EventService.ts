/**
 * @description
 * 设计这样一个时间服务，主要是用于程序各功能模块之间能互相通信
 */

import { Injectable, Injector } from 'injection-js';
import { LoggerService } from './LogService';
import { ConfigService } from './ConfigService';
import { RedisService } from './RedisService';
import { EventEmitter2 } from 'eventemitter2';

import { Redis } from 'ioredis';

@Injectable()
export class EventService extends EventEmitter2 {
    private redisService: RedisService;
    private redisPubClient: Redis;
    private redisSubClient: Redis;
    private msg_count: number;

    constructor(private injector: Injector, private logger: LoggerService) {
        super({ wildcard: true, delimiter: '::', maxListeners: 10000 });
        this.redisService = this.injector.get(RedisService);
        this.redisPubClient = this.redisService.getClientByName('PUB');
        this.logger.debug('Init Runtime Data!');

    }

    initRedisSub() {
        try {
            this.redisSubClient = this.redisService.getClientByName('SUB');
            this.msg_count = 0;
            this.redisSubClient.on("subscribe", (channel, count) => {
                this.logger.info(`subscribe ${channel} success,total subscribe ${count} channels`);
            });

            this.redisSubClient.on('unsubscribe', (channel, count) => {
                this.logger.info(`unsubscribe ${channel} success,total subscribe ${count} channels`);
            })

            this.redisSubClient.on("message", (channel, message) => {
                this.logger.info(`sub channel:[${channel}],total: ${this.msg_count},message:`, message);
                this.msg_count += 1;
                try {
                    let msgObj = JSON.parse(message);
                    const toEmitEventName = `${channel}::${msgObj.tenantId}::${msgObj.callId}`;
                    this.logger.debug(`emit:${toEmitEventName}`, msgObj);
                    this.emit(toEmitEventName, msgObj);
                    msgObj = null;
                } catch (ex) {
                    this.logger.error('Done RedisSub Error:', ex);
                }
            });
        } catch (ex) {
            this.logger.error(' initRedisSub Error:', ex);
        }

    }

    async addARedisSub(eventName) {
        try {
            const count = await this.redisSubClient.subscribe(eventName);
            this.logger.debug(`Has Add ${count} Redis Sub!`);
        }
        catch (ex) {
            return Promise.reject(ex);
        }

    }
    async pubAReidsEvent(eventName: string, data: string) {
        try {
            await this.redisPubClient.publish(eventName, data);
        }
        catch (ex) {
            return Promise.reject(ex);
        }

    }
}