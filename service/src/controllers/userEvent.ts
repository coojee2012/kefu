import { Injectable, Injector } from 'injection-js';
import * as mongoose from 'mongoose';
import { TenantModel } from '../models/tenants';
import { Request, Response, NextFunction } from 'express';
import { LoggerService } from '../service/LogService';
import { MongoService } from '../service/MongoService';
import * as jwt from 'jsonwebtoken';
import { RedisService } from '../service/RedisService';
import { PBXTrunkController } from './pbx_trunk';
import { PBXCDRController } from './pbx_cdr'
import { PBXExtensionController } from './pbx_extension';

import { RedisOptions, Redis } from 'ioredis';
import Redlock = require('redlock');
import { Lock } from 'redlock';

@Injectable()
export class UserEventController {
    constructor(private injector: Injector, private logger: LoggerService, private mongoDB: MongoService) {

    }
    async create(tenantId: string, eventType: string, userId: string, memo?: string) {
        try {
            const newExtension = new this.mongoDB.models.UserEvent({
                userId,
                eventType,
                tenantId,
                memo: memo ? memo : ''
            })

            // 保存用户账号
            const doc = await newExtension.save();
            return doc;

        }
        catch (ex) {
            return Promise.reject(ex);
        }
    }

}