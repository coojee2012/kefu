import 'reflect-metadata';
import { Injector, ReflectiveInjector } from 'injection-js';
import { HeroService } from './service/HeroService';
import { LoggerService } from './service/LogService';

import { App } from './app/index';

const injector: Injector = ReflectiveInjector.resolveAndCreate([
  LoggerService,
  // {
  //   provide: LoggerService, useFactory: () => {
  //     return new LoggerService(true);
  //   }
  // },
   HeroService,
  App
]);
console.log(injector.get(LoggerService) instanceof LoggerService);
 const app: App = injector.get(App);

 app.run();
