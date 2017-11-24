import 'reflect-metadata';
import { Injector, ReflectiveInjector } from 'injection-js';
import { HeroService } from './service/HeroService';
import { LoggerService } from './service/LogService';

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
    HeroService
]);

console.log(injector.get(LoggerService) instanceof LoggerService);

 const server: AppServer = new AppServer(injector);

 server.run()
// .then(res=>{
// console.log('服务启动成功！')
// })
// .catch(err=>{
// console.log('启动服务器异常：',err);
// });
