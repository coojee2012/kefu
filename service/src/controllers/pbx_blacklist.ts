import { Injectable, Injector } from 'injection-js';
import * as mongoose from 'mongoose';
import { PBXBlackListModel } from '../models/pbx_blacklist';
import { Request, Response, NextFunction } from 'express';
import { LoggerService } from '../service/LogService';
import { MongoService } from '../service/MongoService';
@Injectable()
export class PBXBlackListController {
    constructor(private injector: Injector, private logger: LoggerService, private mongoDB: MongoService) {

    }
    async create(data) {
        try {

        }
        catch (ex) {
            return Promise.reject(ex);
        }
    }

    async isBlackNumber(tenantId:string,phoneNumber:string):Promise<boolean>{
        try {
            const doc: PBXBlackListModel = await this.mongoDB.models.PBXBlackList.findOne({
                tenantId:tenantId,
                phoneNumber:phoneNumber
            } ,{}, {
                lean: true,
            });
            return doc ? true:false;
        }
        catch (ex) {
            return Promise.reject(ex);
        }
    }
}