import 'reflect-metadata';
import { Injector, ReflectiveInjector,InjectionToken } from 'injection-js';
import { ConfigService } from './service/ConfigService';
import { LoggerService } from './service/LogService';
import { ESLEventNames } from './service/ESLEventNames';
import { DeepStreamService } from './service/DeepStreamService';
import { MongoService } from './service/MongoService';
import { RedisService } from './service/RedisService';
import { QueueWorkerService } from './callflow/QueueWorkerService';
import { EventService } from './service/EventService';
import { ESLServer } from './ESLServer';
const TITLE = new InjectionToken<string>('title');
const injector: Injector = ReflectiveInjector.resolveAndCreate([
    {
        provide: LoggerService, useFactory: () => {
            const logLevel: string = 'debug'; // 必须这样定义 ，不能直接向里面传入true
            return new LoggerService(logLevel,'ESLServer');
        },
        deps: [] //这里不能丢
    },
    { provide: TITLE,         useValue:   'Hero Of The ESL' },
    ESLEventNames,
    ConfigService,
    DeepStreamService,
    MongoService,
    RedisService,
    EventService,
    QueueWorkerService,
    ESLServer,
]);

const server: ESLServer = injector.get(ESLServer);
const logger: LoggerService = injector.get(LoggerService);
server.startInbound()
    .then(res => {
        logger.info('服务启动成功！')
    })
    .catch(err => {
        logger.error('启动服务器异常：', err);
    });