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


import { RedisOptions, Redis } from 'ioredis';
import Redlock = require('redlock');
import { Lock } from 'redlock';

@Injectable()
export class RoomController {
    private redlock: Redlock;
    private redisService: RedisService;
    constructor(private injector: Injector, private logger: LoggerService, private mongoDB: MongoService) {
        this.redisService = this.injector.get(RedisService);
    }

    async createLiveChatRoom(data) {
        try {

            const { tenantId, rid, roomName, agentId, vistorId } = data;
            if (!tenantId) {
                return Promise.reject('pramas error!');
            }
            else {
                const newRoom = new this.mongoDB.models.Rooms({
                    tenantId,
                    rid,
                    owner: agentId,
                    display: roomName,
                    msgs: 1,
                    receivers: [mongoose.Types.ObjectId(vistorId)],
                    usernames: [agentId]

                });
                const room = await newRoom.save();
                return room;
            }
        }
        catch (ex) {
            return Promise.reject(ex);
        }
    }


    async incMsgCount(rid) {
        try {

            const upres = await this.mongoDB.models.Rooms.update({ rid }, {
                $inc: {
                    $inc: 1
                }
            })
            return upres;
        }
        catch (ex) {
            return Promise.reject(ex);
        }
    }

}
