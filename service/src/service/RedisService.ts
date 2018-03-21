import { Injectable } from 'injection-js';
import { LoggerService } from './LogService';
import { ConfigService } from './ConfigService';
import IORedis = require('ioredis');
import { Redis, RedisOptions } from 'ioredis'
@Injectable()
export class RedisService {
    private clientsNames: string[];
    private clients: Redis[];
    private redisOptions: RedisOptions;
    private namePrefix: string;
    constructor(private logger: LoggerService, private config: ConfigService) {
        this.clientsNames = [];
        this.clients = [];
        this.namePrefix = '';
        this.redisOptions = {
            host: this.config.getConfig().reids.host,
            port: this.config.getConfig().reids.port,
            password: this.config.getConfig().reids.password ? this.config.getConfig().reids.password : null,
        }
    }

    async addClient(db: number = 0, name: string = 'esl-default') {
        try {
            const clientName = `${this.namePrefix}-${name}`;
            if (this.clientsNames.includes(clientName)) {
                this.logger.warn(`Redis Client [${clientName}] Is Aready Exists!`);
                return;
            }
            const opts: RedisOptions = Object.assign({}, this.redisOptions, { db })
            const client: Redis = new IORedis(opts);
            this.clientsNames.push(clientName);
            this.clients.push(client);
            this.listenClientEvents(this.clientsNames.length - 1);
        } catch (ex) {
            return Promise.reject(ex);
        }
    }

    getClientByName(name: string): Redis {
        const clientName = `${this.namePrefix}-${name}`;
        const index = this.clientsNames.indexOf(clientName);
        if (index > -1) {
            return this.clients[index];
        } else {
            return null;
        }
    }

    listenClientEvents(index: number) {
        try {
            if (index < 0 || index >= this.clientsNames.length || index >= this.clients.length) {
                throw new Error(` reids client ${index} is not exists!`);
            }
            const clientName = this.clientsNames[index];
            this.clients[index].once('connect', () => {
                this.logger.debug(`Redis Client [${clientName}] Connected.`);
            })
            this.clients[index].on('ready', () => {
                this.logger.debug(`Redis Client [${clientName}] Is Ready.`);
            })
            this.clients[index].on('error', (err) => {
                this.logger.debug(`Redis Client [${clientName}] Error:`, err);
            })
            this.clients[index].on('close', () => {
                this.logger.debug(`Redis Client [${clientName}] Is Closed.`);
            })
            this.clients[index].on('reconnecting', () => {
                this.logger.debug(`Redis Client [${clientName}] Is Reconnecting.....`);
            })
            this.clients[index].on('end', () => {
                this.logger.debug(`Redis Client [${clientName}] Is Ended.`);
                this.clientsNames.splice(index, 1);
                this.clients.splice(index, 1);
            })

        } catch (ex) {
            this.logger.error('listenClientEvents Error:', ex)
        }
    }
    setNamePrefix(prefix: string) {
        this.namePrefix = prefix;
    }


}