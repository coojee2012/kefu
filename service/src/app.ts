import 'reflect-metadata';
import { Injector, ReflectiveInjector } from 'injection-js';
import { HeroService } from './service/HeroService';
import { LoggerService } from './service/LogService';

// import { AppServer } from './server';
import { App } from './app/index';
const injector: Injector = ReflectiveInjector.resolveAndCreate([
    HeroService,
    {
        provide: LoggerService, useFactory: () => {
            return new LoggerService(true);
        }
    },
    App
]);

const server: App = injector.get(App);

server.run()
// .then(res=>{
// console.log('服务启动成功！')
// })
// .catch(err=>{
// console.log('启动服务器异常：',err);
// });