import { Injectable, Injector } from 'injection-js';
import * as mongoose from 'mongoose';
import { PBXExtensionModel } from '../models/pbx_extensions';
import { Request, Response, NextFunction } from 'express';
import { LoggerService } from '../service/LogService';
import { MongoService } from '../service/MongoService';

@Injectable()
export class PBXExtensionController {
    constructor(private injector: Injector, private logger: LoggerService, private mongoDB: MongoService) {

    }
    async create(req: Request, res: Response, next: NextFunction) {
        try {

        }
        catch (ex) {
            return Promise.reject(ex);
        }
    }

    /**
     * 
     * @param tenantId 
     * @description 
     * 队列拨打时 检查坐席是否可被拨打
     * @param accountCode 
     */
    async checkAgentCanDail(tenantId: string, accountCode: string): Promise<PBXExtensionModel> {
        try {
            const query = {
                tenantId,
                accountCode,
                state: 'waiting',
                status: 'Login'
            }
            const fields = null;
            const options = {
                lean: true
            }
            const doc = await this.mongoDB.models.PBXExtension.findOne(query, fields, options);
            return doc;
        }
        catch (ex) {
            return Promise.reject(ex);
        }
    }

    async setAgentLastCallId(tenantId: string, accountCode: string, callId: string) {
        const _this = this;
        try {
            const query = {
                tenantId,
                accountCode
            }
            const setData = {
                lastCallId: callId,
                logicType: '',
                logicOptions: null
            }
            const res = await this.mongoDB.models.PBXExtension.update(query, { $set: setData });
            return Promise.resolve(res);
        }
        catch (ex) {
            return Promise.reject(ex);
        }
    }

    /**
     * @description
     * 根据分机号更改分机状态
     * @param tenantId 
     * @param accountCode 
     * @param state 
     */
    async setAgentState(tenantId: string, accountCode: string, state: string) {
        try {
            const query = {
                tenantId,
                accountCode
            }
            const setData = {
                state: state,
                stateLastModified: new Date()
            }
            const res = await this.mongoDB.models.PBXExtension.update(query, { $set: setData }, { multi: false });
            return Promise.resolve(res);
        }
        catch (ex) {
            return Promise.reject(ex);
        }
    }

    async getExtenByNumber(tenantId,accountCode){
        try {
            const query = {
                tenantId,
                accountCode,
            }
            const fields = null;
            const options = {
                lean: true
            }
            const doc = await this.mongoDB.models.PBXExtension.findOne(query, fields, options);
            return doc;
        }
        catch (ex) {
            return Promise.reject(ex);
        }
    }

}