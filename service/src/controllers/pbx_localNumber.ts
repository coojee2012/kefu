import { Injectable, Injector } from 'injection-js';
import * as mongoose from 'mongoose';
import { PBXCallProcessModel } from '../models/pbx_callProcess';
import { Request, Response, NextFunction } from 'express';
import { LoggerService } from '../service/LogService';
import { MongoService } from '../service/MongoService';
@Injectable()
export class PBXLocalNumberController {
    constructor(private injector: Injector, private logger: LoggerService, private mongoDB: MongoService) {

    }
    async create(data) {
        try {
            return await this.mongoDB.models.PBXLocalNumber.create(data);
        } catch (ex) {
            return Promise.reject(ex);
        }
    }
    async getLocalByNumber(tenantId: string, localNumber: string) {
        try {
            const localNumberDoc = await this.mongoDB.models.PBXLocalNumber.findOne({
                tenantId: tenantId,
                number: localNumber
            }, {}, {
                    lean: true,
                });
            return Promise.resolve(localNumberDoc);

        } catch (ex) {
            return Promise.reject(ex);
        }
    }
}