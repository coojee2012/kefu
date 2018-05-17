
import * as winston from 'winston';
import { Logger, LoggerInstance } from 'winston'
export class LoggerService {
  private logger: LoggerInstance;
  constructor(private level?: string, private label?: string) {
    this.logger = new Logger({
      transports: [
        new (winston.transports.Console)({
          level: this.level || 'debug',
          label: this.label || 'normal',
          prettyPrint: true,
          timestamp: true,
          json: false,
          colorize: true
        }),
        new (winston.transports.File)({
          name: 'info-file',
          filename: 'file-info.log',
          options:{flag:'a'},
          level: 'info'
        }),
        new (winston.transports.File)({
          name: 'error-file',
          filename: 'file-error.log',
          options:{flag:'a'},
          level: 'error'
        })
      ]
    })
  }
  log(message: string, ...meta: any[]) {

  }
  debug(message: string, ...meta: any[]) {
    this.logger.debug(message, ...meta);
  }
  info(message: string, ...meta: any[]) {
    this.logger.info(message, ...meta);
  }
  warn(message: string, ...meta: any[]) {
    this.logger.warn(message, ...meta);
  }
  error(message: string, ...meta: any[]) {
    this.logger.error(message, ...meta);
  }
}
