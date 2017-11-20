import 'reflect-metadata';
import { Injector, ReflectiveInjector, InjectionToken } from 'injection-js';
import { HeroService } from './service/HeroService';
import { LoggerService } from './service/LogService';

import { App } from './app/index';

const Location = new InjectionToken('location');
const Hash = new InjectionToken('hash');
const injector: Injector = ReflectiveInjector.resolveAndCreate([
  // LoggerService,
  { provide: Location, useValue: 'http://angular.io/#someLocation' },
  {
    provide: Hash,
    useFactory: (location: string) => location.split('#')[1],
    deps: [Location]
  },
  {
    provide: LoggerService,
    useFactory: () => {
      const a: boolean = true;
      return new LoggerService(a);
    },
    deps: []
  },
  HeroService,
  App
]);
console.log(injector.get(LoggerService) instanceof LoggerService);
console.log(injector.get(Hash));
const app: App = injector.get(App);

app.run();
