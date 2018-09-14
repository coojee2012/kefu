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

    async bindCustormerRest(req: Request, res: Response, next: NextFunction) {
        try {
            const optUser = (req as any).user;
            req.checkBody({
                rid: {
                    notEmpty: true,
                    errorMessage: '房间ID不能为空'
                },
                customerId: {
                    notEmpty: true,
                    errorMessage: '客户ID不能为空'
                },
            });
            const result = await req.getValidationResult();
            if (!result.isEmpty()) {
                res.json({
                    'meta': {
                        'code': 422,
                        'message': result.array()[0].msg
                    }
                });
                return;
            }
            const userTenantId = optUser.domain;
            const { tenantId } = req.params
            if (!userTenantId || userTenantId !== tenantId) {
                res.json({
                    'meta': {
                        'code': 422,
                        'message': '租户授权无效'
                    }
                });
                return;
            }


            const upresult = await this.bindCustormer(tenantId, req.body.rid, req.body.customerId);




            res.json({
                'meta': {
                    'code': 200,
                    'message': '房间绑定客户成功'
                },
                data: upresult
            });



        } catch (error) {
            this.logger.error('房间绑定客户失败：', error);
            res.json({
                'meta': {
                    'code': 404,
                    'message': ''
                }
            });
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

    async bindCustormer(tenantId, rid, customerId) {
        try {

            const upres = await this.mongoDB.models.Rooms.update({
                tenantId,
                rid
            }, {
                    $set: {
                        customer: customerId
                    }
                })
            return upres;
        }
        catch (ex) {
            return Promise.reject(ex);
        }
    }

}
