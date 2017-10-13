import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoggerService } from './logger.service';
export const LoggerFactory = () => {
  return new LoggerService(true);
 };

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [
    {
      provide: LoggerService, useFactory: LoggerFactory
    }
  ],
  declarations: []
})
export class LoggerModule { }
