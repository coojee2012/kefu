import { Injectable, Injector } from 'injection-js';
import * as mongoose from 'mongoose';
import { PBXIVRMenmuModel } from '../models/pbx_ivrMenmus';
import { PBXIVRActionsModel } from '../models/pbx_ivrActions';
import { Request, Response, NextFunction } from 'express';
import { LoggerService } from '../service/LogService';
import { MongoService } from '../service/MongoService';

@Injectable()
export class PBXIVRActionsController { 
    constructor(private injector: Injector, private logger: LoggerService, private mongoDB: MongoService) {

    }
    async create(req: Request, res: Response, next: NextFunction) {
        try {

        }
        catch (ex) {
            return Promise.reject(ex);
        }
    }

    async getIvrAction(tenantId:string, ivrNumber:string, ordinal:number){
        try {
            const doc = await this.mongoDB.models.PBXIvrAction.findOne({
                tenantId: tenantId,
                ivrNumber: ivrNumber,
                ordinal:ordinal
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