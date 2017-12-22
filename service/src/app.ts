import 'reflect-metadata';
import { Injector, ReflectiveInjector } from 'injection-js';
import { ConfigService } from './service/ConfigService';
import { HeroService } from './service/HeroService';
import { LoggerService } from './service/LogService';
import { DeepStreamService } from './service/DeepStreamService';
<<<<<<< HEAD
import { RoutesService }  from './routes/RoutesService';
=======
import { MongoService } from './service/MongoService';
import { RoutesService } from './routes/RoutesService';
>>>>>>> 822401ac539b4922aa7886f524c7210dbd49bf2d
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
<<<<<<< HEAD
=======
    MongoService,
>>>>>>> 822401ac539b4922aa7886f524c7210dbd49bf2d
    HeroService,
    RoutesService,
    AppServer
]);

// console.log(injector.get(LoggerService) instanceof LoggerService);

<<<<<<< HEAD
 const server: AppServer = injector.get(AppServer);

 server.run();
// .then(res=>{
// console.log('服务启动成功！')
// })
// .catch(err=>{
// console.log('启动服务器异常：',err);
// });
=======
const server: AppServer = injector.get(AppServer);
const logger: LoggerService = injector.get(LoggerService);
server.run()
    .then(res => {
        logger.info('服务启动成功！')
    })
    .catch(err => {
        logger.error('启动服务器异常：', err);
    });
>>>>>>> 822401ac539b4922aa7886f524c7210dbd49bf2d
