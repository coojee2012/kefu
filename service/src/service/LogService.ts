import { Injectable } from 'injection-js';

@Injectable()
export class LoggerService {
    constructor(private a: boolean) {
      console.log('addd',a);
    }
    log(message: string) {

      console.log(`LoggerService: ${message},${this.a}`);

    }
}
