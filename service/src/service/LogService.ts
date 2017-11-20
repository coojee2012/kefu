import { Injectable } from 'injection-js';

@Injectable()
export class LoggerService {
    constructor() {
    }
    log(message: string) {

            console.log(`LoggerService: ${message}`);

    }
}
