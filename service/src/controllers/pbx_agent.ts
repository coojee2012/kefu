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

    async setAgentLastCallId(){
        try {

        }
        catch (ex) {
            return Promise.reject(ex);
        }
    }

}