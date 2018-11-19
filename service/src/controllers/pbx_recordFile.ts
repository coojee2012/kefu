import { Injectable, Injector } from 'injection-js';
import * as mongoose from 'mongoose';
import { PBXQueueModel } from '../models/pbx_queues';
import { Request, Response, NextFunction } from 'express';
import { LoggerService } from '../service/LogService';
import { MongoService } from '../service/MongoService';
@Injectable()
export class PBXRecordFileController {
    constructor(private injector: Injector, private logger: LoggerService, private mongoDB: MongoService) {

    }
    async create(data) {
        try {
            const newDoc = await this.mongoDB.models.PBXRecordFile.create(data);
            return newDoc;
        }
        catch (ex) {
            return Promise.reject(ex);
        }
    }
}