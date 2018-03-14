import { Injectable, Injector } from 'injection-js';
import * as mongoose from 'mongoose';
import { PBXIVRMenmuModel } from '../models/pbx_ivrMenmus';
import { Request, Response, NextFunction } from 'express';
import { LoggerService } from '../service/LogService';
import { MongoService } from '../service/MongoService';

@Injectable()
export class PBXIVRMenuController {
    constructor(private injector: Injector, private logger: LoggerService, private mongoDB: MongoService) {

    }
    async create(req: Request, res: Response, next: NextFunction) {
        try {

        }
        catch (ex) {
            return Promise.reject(ex);
        }
    }

    async getIVRByNumber(tenantId: string, number: string) {
        try {
            const doc = await this.mongoDB.models.PBXIvrMenmu.findOne({
                tenantId: tenantId,
                ivrNumber: number
            }, {}, {
                    lean: true,
                });
            return Promise.resolve(doc);
        }
        catch (ex) {
            return Promise.reject(ex);
        }
    }
}