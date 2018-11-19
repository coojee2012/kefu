import { Injectable, Injector } from 'injection-js';
import * as mongoose from 'mongoose';
import { PBXQueueModel } from '../models/pbx_queues';
import { Request, Response, NextFunction } from 'express';
import { LoggerService } from '../service/LogService';
import { MongoService } from '../service/MongoService';
@Injectable()
export class PBXQueueController {
    constructor(private injector: Injector, private logger: LoggerService, private mongoDB: MongoService) {

    }
    async create(data) {
        try {

        }
        catch (ex) {
            return Promise.reject(ex);
        }
    }
    async getQueue(tenantId: string, queueNumber: string):Promise<PBXQueueModel> {
        try {
            const doc = await this.mongoDB.models.PBXQueue.findOne({
                tenantId: tenantId,
                queueNumber: queueNumber
            }, {}, {
                    lean: true,
                });
            return doc;
        }
        catch (ex) {
            return Promise.reject(ex);
        }
    }
}