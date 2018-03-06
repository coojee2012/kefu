import { Injectable, Injector } from 'injection-js';
import * as mongoose from 'mongoose';
import { CallProcessModel } from '../models/pbx_callProcess';
import { Request, Response, NextFunction } from 'express';
import { LoggerService } from '../service/LogService';
import { MongoService } from '../service/MongoService';
@Injectable()
export class CallProcessController {
constructor(private injector: Injector, private logger: LoggerService, private mongoDB: MongoService){}
create(data) {
    return this.mongoDB.models.PBXCallProcess.create(data);
  }
}