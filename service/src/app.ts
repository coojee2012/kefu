import 'reflect-metadata';
import { Injector, ReflectiveInjector } from 'injection-js';
import { ConfigService } from './service/ConfigService';
import { HeroService } from './service/HeroService';
import { LoggerService } from './service/LogService';
import { DeepStreamService } from './service/DeepStreamService';
import { RoutesService }  from './routes/RoutesService';
import { AppServer } from './server';
// import { RoutesService }  from './routes/RoutesService';
// import { App } from './app/index';
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
    HeroService,
    RoutesService,
    AppServer
]);

console.log(injector.get(LoggerService) instanceof LoggerService);

 const server: AppServer = injector.get(AppServer);

 server.run();
// .then(res=>{
// console.log('服务启动成功！')
// })
// .catch(err=>{
// console.log('启动服务器异常：',err);
// });
