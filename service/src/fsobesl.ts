import 'reflect-metadata';
import { Injector, ReflectiveInjector } from 'injection-js';
import { ConfigService } from './service/ConfigService';
import { LoggerService } from './service/LogService';
import { DeepStreamService } from './service/DeepStreamService';
import { MongoService } from './service/MongoService';
import { ESLServer } from './ESLServer';
const injector: Injector = ReflectiveInjector.resolveAndCreate([
    {
        provide: LoggerService, useFactory: () => {
            const logLevel: string = 'debug'; // 必须这样定义 ，不能直接向里面传入true
            return new LoggerService(logLevel);
        },
        deps: [] //这里不能丢
    },
    ConfigService,
    DeepStreamService,
    MongoService,
    ESLServer,
]);

const server: ESLServer = injector.get(ESLServer);
const logger: LoggerService = injector.get(LoggerService);
server.startOutbound()
    .then(res => {
        logger.info('服务启动成功！')
    })
    .catch(err => {
        logger.error('启动服务器异常：', err);
    });