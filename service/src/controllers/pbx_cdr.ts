import { Injectable, Injector } from 'injection-js';
import * as mongoose from 'mongoose';
import { PBXCallProcessModel } from '../models/pbx_callProcess';
import { Request, Response, NextFunction } from 'express';
import { LoggerService } from '../service/LogService';
import { MongoService } from '../service/MongoService';
import { REFUSED } from 'dns';
@Injectable()
export class PBXCDRController {
    constructor(private injector: Injector, private logger: LoggerService, private mongoDB: MongoService) {

    }
    async updateCalled(tenantId:string,callId:string,called:string) {
        try{
            const result = await this.mongoDB.models.PBXCDR.update({
                tenantId,
                callId
            },{
                $set:{
                    called,
                }
            },{
                multi: false, 
                safe: true
            });
            return result;

        }catch(ex){
            return Promise.reject(ex);
        }
    }

    async create(data){
        try{
            const newDoc = await this.mongoDB.models.PBXCDR.create(data);
            return newDoc;
        }catch(ex){
            return Promise.reject(ex); 
        }
    }
}