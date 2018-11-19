import { Injectable, Injector } from 'injection-js';
import * as mongoose from 'mongoose';
import { PBXTrunkModel } from '../models/pbx_trunks';
import { Request, Response, NextFunction } from 'express';
import { LoggerService } from '../service/LogService';
import { MongoService } from '../service/MongoService';


@Injectable()
export class PBXTrunkController {
    constructor(private injector: Injector, private logger: LoggerService, private mongoDB: MongoService) {

    }
    async create(data) {
        try {
            const newDoc = await this.mongoDB.models.PBXTrunk.create(data);
            return newDoc;
        }
        catch (ex) {
            return Promise.reject(ex);
        }
    }

    async getTrunkInfoByDND(dnd: string): Promise<PBXTrunkModel> {
        try {
            const query = {
                dnds: { $all: [dnd] }
            }
            const result = await this.mongoDB.models.PBXTrunk.findOne(query);
            return result;
        } catch (ex) {
            return Promise.reject(ex);
        }
    }

}