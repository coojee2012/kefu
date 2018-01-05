import 'reflect-metadata';
import { Injector, ReflectiveInjector } from 'injection-js';
import { ConfigService } from './service/ConfigService';
import { LoggerService } from './service/LogService';
import { DeepStreamService } from './service/DeepStreamService';
import { MongoService } from './service/MongoService';

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
]);