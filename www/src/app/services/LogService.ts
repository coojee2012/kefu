import { Injectable } from '@angular/core';
class LoggerMake {
  constructor() {}
  log(message: string, ...meta: any[]) {}
  debug(message: string, ...meta: any[]) {}
  info(message: string, ...meta: any[]) {}
  warn(message: string, ...meta: any[]) {}
  error(message: string, ...meta: any[]) {}
}
@Injectable()
export class LoggerService {
    private logger: any;
    constructor() {
      this.logger = console ? console : new LoggerMake();
    }
    log(message: string, ...meta: any[]) {
      this.logger.log(new Date(), message, ...meta);
    }
    debug(message: string, ...meta: any[]) {
      this.logger.log(new Date(), message, ...meta);
    }
    info(message: string, ...meta: any[]) {
      this.logger.log(new Date(), message, ...meta);
    }
    warn(message: string, ...meta: any[]) {
      this.logger.log(new Date(), message, ...meta);
    }
    error(message: string, ...meta: any[]) {
      this.logger.log(new Date(), message, ...meta);
    }
}
