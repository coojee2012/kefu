import { Injectable } from 'injection-js';

@Injectable()
export class LoggerService {
    constructor(private enable: boolean) {
    }
    log(message: string) {
        if (this.enable) {
            console.log(`LoggerService: ${message}`);
        }
    }
}
