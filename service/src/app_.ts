import 'reflect-metadata';
import { Injector, ReflectiveInjector } from 'injection-js';
import { HeroService } from './service/HeroService';
import { LoggerService } from './service/LogService';

import { App } from './app/index';

const injector: Injector = ReflectiveInjector.resolveAndCreate([
  {
    provide: LoggerService, useFactory: () => {
      return new LoggerService(true);
    }
  },
  HeroService,

  App
]);

const app: App = injector.get(App);

app.run();
