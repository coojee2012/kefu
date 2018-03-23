import { Injectable, Injector } from 'injection-js';
import * as mongoose from 'mongoose';
import { PBXAgentModel } from '../models/pbx_agents';
import { Request, Response, NextFunction } from 'express';
import { LoggerService } from '../service/LogService';
import { MongoService } from '../service/MongoService';

export class PBXAgentController {
    constructor(private injector: Injector, private logger: LoggerService, private mongoDB: MongoService) {

    }
    async create(req: Request, res: Response, next: NextFunction) {
        try {

        }
        catch (ex) {
            return Promise.reject(ex);
        }
    }

    async getRoundRobinAgents(tenantId: string, queueNumber: string) {
        try {
            const query = {
                tenantId,
                queueNumber,
            }
            const fields = null;
            const options = {
                lean: true,
                sort: {
                    lastBridgeStart: -1,
                    position: -1
                }
            }
            const docs = await this.mongoDB.models.PBXAgent.find(query, fields, options);
            return docs;
        }
        catch (ex) {
            return Promise.reject(ex);
        }
    }

    async setAgentLastCallId() {
        try {

        }
        catch (ex) {
            return Promise.reject(ex);
        }
    }
    async newCall(data) {
        try {
            const { agentNumber, tenantId, queueNumber } = data;
            const newData = Object.assign({}, data, { lastBridgeStart: new Date().getTime() });
            const hasRow = await this.checkRow({ agentNumber, tenantId, queueNumber });
            if (hasRow) {
                await this.mongoDB.models.PBXAgent.update({ tenantId, queueNumber, agentNumber }, { $set: newData }, { upsert: false, multi: true });
            } else {
                const entity = new this.mongoDB.models.PBXAgent(newData);
                await entity.validate();
                const doc = await entity.save();
            }
        } catch (ex) {
            return Promise.reject(ex);
        }
    }

    async checkRow({ agentNumber, tenantId, queueNumber }): Promise<boolean> {
        try {
            const agent = await this.mongoDB.models.PBXAgent.findOne({ tenantId, queueNumber, agentNumber });
            return agent ? true : false;
        } catch (ex) {
            return Promise.reject(ex);
        }
    }

    async answerCall({ tenantId, queueNumber, agentNumber }) {
        try {
            const result = await this.mongoDB.models.PBXAgent.updateOne({
                tenantId,
                queueNumber,
                agentNumber,
            },
                {
                    $set: {
                        lastOfferedCall: new Date().getTime()
                    },
                    $inc: {
                        answeredCalls: 1
                    }
                });
            return result;
        } catch (ex) {
            return Promise.reject(ex);
        }
    }

}