import { Injectable, Injector } from 'injection-js';
import * as mongoose from 'mongoose';
import { TenantModel } from '../models/tenants';
import { Request, Response, NextFunction } from 'express';
import { LoggerService } from '../service/LogService';
import { MongoService } from '../service/MongoService';
@Injectable()
export class TenantController {
    constructor(private injector: Injector, private logger: LoggerService, private mongoDB: MongoService) {

    }
    async create(data) {
        try {

        }
        catch (ex) {
            return Promise.reject(ex);
        }
    }

    async createREST(req: Request, res: Response, next: NextFunction) {
        try {

        }
        catch (ex) {
            return Promise.reject(ex);
        }
    }

    async getTenanByDomain(domain:string){
        try {
            const doc: TenantModel = await this.mongoDB.models.Tenants.findOne({
                tenantId:domain
            } ,{}, {
                lean: true,
            });
            return doc;
        }
        catch (ex) {
            return Promise.reject(ex);
        }
    }

}