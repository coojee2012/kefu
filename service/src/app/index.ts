// export * from './apps.module';

import { Injectable, Injector } from 'injection-js';
// import { HeroService } from '../service/HeroService';
import { LoggerService } from '../service/LogService';
@Injectable()
export class App {
  private logger: LoggerService;
    constructor(private injector: Injector) {
    this.logger = this.injector.get(LoggerService);
    }
    run() {
        this.logger.log('ddddd');
        this.logger.log('ttttt');
    }
}
