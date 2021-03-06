import 'reflect-metadata';
import { ReflectiveInjector, Injectable, Injector } from 'injection-js';

class Http {}

@Injectable()
class Service {
  constructor(private http: Http) {}
}

@Injectable()
class Service2 {
  constructor(private injector: Injector) {}

  getService(): void {
    console.log(this.injector.get(Service) instanceof Service);
  }

  createChildInjector(): void {
    const childInjector = ReflectiveInjector.resolveAndCreate([
      Service
    ], this.injector);
  }
}

const injector = ReflectiveInjector.resolveAndCreate([
  Service2,
  Service,
  Http
]);

console.log(injector.get(Service) instanceof Service);
