import { Injectable, Injector } from 'injection-js';
import * as mongoose from 'mongoose';
import { PBXAgentStatisticsModel } from '../models/pbx_agentStatistics';
import { Request, Response, NextFunction } from 'express';
import { LoggerService } from '../service/LogService';
import { MongoService } from '../service/MongoService';

@Injectable()
export class PBXAgentStatisticController {
    constructor(private injector: Injector, private logger: LoggerService, private mongoDB: MongoService) {

    }
    async create(data) {
        try {

        }
        catch (ex) {
            return Promise.reject(ex);
        }
    }

    async setSatisfaction(callId:string, bLegId:string, satisfaction:number){
        try {
            const { nModified } = await this.mongoDB.models.PBXAgentStatistic.update({
                callId: callId,
                bLegId: bLegId
            }, {
                    satisfaction: satisfaction
                }, {
                    multi: false, safe: true
                });
            return nModified;
        }
        catch (ex) {
            return Promise.reject(ex);
        }
    }
}