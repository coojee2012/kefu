import { Injectable, Injector } from 'injection-js';
import * as mongoose from 'mongoose';
import { PBXQueueStatisticsModel } from '../models/pbx_queueStatistics';
import { Request, Response, NextFunction } from 'express';
import { LoggerService } from '../service/LogService';
import { MongoService } from '../service/MongoService';
@Injectable()
export class PBXQueueStatisticController {
    constructor(private injector: Injector, private logger: LoggerService, private mongoDB: MongoService) {

    }
    async create(data) {
        try {

        }
        catch (ex) {
            return Promise.reject(ex);
        }
    }

    /**
     * @description 更新满意度的值
     * @param tenantId 
     * @param callId 
     * @param queueNumber 
     * @param value 
     */
    async updateSatisValue(tenantId, callId, queueNumber: string, value: number): Promise<number> {
        try {
            const { nModified } = await this.mongoDB.models.PBXQueueStatistic.update({
                tenantId: tenantId,
                callId: callId,
                satisfaction: 0
            }, {
                    queueNumber: queueNumber,
                    satisfaction: value
                }, {
                    multi: false, safe: true
                });
            return nModified;
        }
        catch (ex) {
            return Promise.reject(ex);
        }
    }

    async findOne(query): Promise<PBXQueueStatisticsModel> {
        try {
            const doc: PBXQueueStatisticsModel = await this.mongoDB.models.PBXQueueStatistic.findOne(query, {}, {
                lean: true,
            });
            return doc;
        }
        catch (ex) {
            return Promise.reject(ex);
        }
    }

    async hangupCall(callId: string, tenantId: string, queueNumber: string, hangupCase: string): Promise<number> {
        try {
            const { nModified } = await this.mongoDB.models.PBXQueueStatistic.update({
                tenantId: tenantId,
                callId: callId,
                queueNumber: queueNumber,
            }, {
                    hangupCase,
                    hangupTime: new Date()
                }, {
                    multi: false, safe: true
                });
            return nModified;
        }
        catch (ex) {
            return Promise.reject(ex);
        }
    }

    async transferStatic({ callId, tenantId, queueNumber }) {
        try {
            const { nModified } = await this.mongoDB.models.PBXQueueStatistic.updateOne({
                callId,
                tenantId,
                queueNumber,
            }, {
                    $set: {
                        transferStatic: new Date()
                    }
                });
            return nModified;
        } catch (ex) {
            return Promise.reject(ex);
        }
    }

    async answerCall({ callId, tenantId, queueNumber, answerAgent, answerAgentId }) {
        try {
            const { nModified } = await this.mongoDB.models.PBXQueueStatistic.updateOne({
                callId,
                tenantId,
                queueNumber,
            }, {
                    $set: {
                        answerAgent,
                        answerAgentId,
                        answerTime: new Date()
                    }
                })
            return nModified;
        } catch (ex) {
            return Promise.reject(ex);
        }
    }

}