import { Injectable } from '@angular/core';

@Injectable()
export class LoggerService {
  private levels: string[];
  private logLevel: number;
  constructor(private enable: boolean, level?: string) {
    this.levels = ['debug', 'info', 'warn', 'error'];
    this.logLevel = this.levels.indexOf(level || 'debug');
  }
  log(message: string) {
    if (this.enable) {
      console.log(`${ new Date() }: ${message}`);
    }
  }
  debug(message: string) {
    if (this.logLevel > -1) {
      this.log(message);
    }
  }

  info(message: string) {
    if (this.logLevel > 0) {
      this.log(message);
    }
  }

  warn(message: string) {
    if (this.logLevel > 1) {
      this.log(message);
    }
  }

  error(message: string) {
    if (this.logLevel > 2) {
      this.log(message);
    }
  }
}
