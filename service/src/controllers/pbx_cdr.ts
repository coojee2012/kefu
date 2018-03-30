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
    async updateCalled(tenantId: string, callId: string, called: string) {
        try {
            const result = await this.mongoDB.models.PBXCDR.update({
                tenantId,
                callId
            }, {
                    $set: {
                        called,
                    }
                }, {
                    multi: false,
                    safe: true
                });
            return result;

        } catch (ex) {
            return Promise.reject(ex);
        }
    }

    async lastApp(callId: string, tenantId: string, lastApp: string) {
        const _this = this;
        try {
            const result = await this.mongoDB.models.PBXCDR.update({
                tenantId,
                callId
            }, {
                    $set: {
                        lastApp,
                    }
                }, {
                    multi: false,
                    safe: true
                });
            return result;
        } catch (ex) {
            return Promise.reject(ex);
        }
    }

    async create(data) {
        try {
            const newDoc = await this.mongoDB.models.PBXCDR.create(data);
            return newDoc;
        } catch (ex) {
            return Promise.reject(ex);
        }
    }
    async setAgentId({ callId, tenantId, accountCode, whenAnswer = false, answerUuid }: { callId: string, tenantId: string, accountCode: string, whenAnswer?: boolean, answerUuid?: string }) {
        const _this = this;
        try {
            let updateData = {
                accountCode
            }
            if (whenAnswer) {
                updateData = Object.assign({}, updateData, {
                    answerStatus: 'answered',
                    answerTime: new Date()
                })
            }
            const result = await this.mongoDB.models.PBXCDR.updateOne({
                callId,
                tenantId,
            }, { $set: updateData });
            return result;
        } catch (ex) {
            return Promise.reject(ex);
        }
    }

    async endChannel({ callId, tenantId, hangupCase,hangupBy='' }) {
        try {
            const result = await this.mongoDB.models.PBXCDR.updateOne({
                callId,
                tenantId,
            }, {
                    alive: 'no',
                    hangupCase: hangupCase,
                    hangupBy,
                    endTime: new Date()
                });
            return result;
        } catch (ex) {
            return Promise.reject(ex);
        }
    }

    async cdrBLegHangup(id: string, hangupCase: string) {
        const _this = this;
        try {
            const query = {
                _id: id,
            }
            const data =
                {
                    alive: 'no',
                    hangupCase: hangupCase,
                    
                    endTime: new Date()
                }
            const result = await this.mongoDB.models.PBXCDR.updateOne(query, { $set: data });
            return result;
        } catch (ex) {
            return Promise.reject(ex);
        }
    }

    async bLegAnswered(_id: string, bLegId: string) {
        try {
            const query = {
                _id,
            }
            const data = {
                callId: bLegId,
                answerStatus: 'answered',
                answerTime: new Date()
            }
            const result = await this.mongoDB.models.PBXCDR.updateOne(query, { $set: data });
            return result;
        } catch (ex) {
            return Promise.reject(ex);
        }
    }

    async answered(tenantId: string, callId: string, associateId: string) {
        const _this = this;
        try {
            const query = {
                callId,
                tenantId,
            }
            const data = {
                $set: {
                    answerStatus: 'answered',
                    associateId: associateId,
                    answerTime: new Date()
                }
            };
            //   if (associateId && associateId !== '') {
            //     upObj.$push = {associateId};
            //   }
            const result = await this.mongoDB.models.PBXCDR.updateOne(query, data);
            return result;
        } catch (ex) {
            return Promise.reject(ex);
        }
    }
}