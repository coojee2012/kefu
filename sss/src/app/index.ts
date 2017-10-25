// export * from './apps.module';

import { Injectable } from 'injection-js';
import { HeroService } from '../service/HeroService';
import { LoggerService } from '../service/LogService';
@Injectable()
export class App {
    constructor(private logger: LoggerService) {

    }
    run() {
        this.logger.log('ddddd');
        this.logger.log('ttttt');
    }
}