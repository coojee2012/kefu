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
export class TenantController {
    private redlock: Redlock;
    private redLockClient: Redis;
    private redisService: RedisService;
    private pbxTrunkController: PBXTrunkController;
    private pbxCdrController: PBXCDRController;
    constructor(private injector: Injector, private logger: LoggerService, private mongoDB: MongoService) {
        this.redisService = this.injector.get(RedisService);
        this.redLockClient = this.redisService.getClientByName('RedLock');
        this.pbxTrunkController = this.injector.get(PBXTrunkController);
        this.pbxCdrController = this.injector.get(PBXCDRController);
    }
    async create(data) {
        try {
            const { tenantId } = data;
            if (!tenantId) {
                return Promise.reject('pramas error!');
            }
            else {
                const token = jwt.sign({ tenantId }, `kefu2018@abcf`, {
                    expiresIn: '15 days'  // token到期时间设置 1000, '2 days', '10h', '7d'
                });
                const newUser = new this.mongoDB.models.Tenants({
                    tenantId,
                    apikey: token,
                });
                const tenant = await newUser.save();
                return tenant;
            }

        }
        catch (ex) {
            return Promise.reject(ex);
        }
    }

    async createREST(req: Request, res: Response, next: NextFunction) {
        try {

        }
        catch (ex) {
            return Promise.reject(ex);
        }
    }

    async getTenantByDomain(domain: string) {
        try {
            const doc: TenantModel = await this.mongoDB.models.Tenants.findOne({
                tenantId: domain
            }, {}, {
                    lean: true,
                });
            return doc;
        }
        catch (ex) {
            return Promise.reject(ex);
        }
    }

    /**
  * @description
  * 通过DND获取一个可用的Gateway,如果传入的dnd为空,那么从租户的所有DND中选择一条可用的Gateway
  * @param tenantId String - 租户ID
  * @param callId String - 呼叫编号
  * @param dnd String - 指定的dnd号码
  * @param forceDND Boolean - 强制使用指定dnd的网关,默认false
  */
    async getDialGateWay({ tenantId, callId, dnd = '', forceDND = false }): Promise<{ dnd: string, gateway: string }> {
        try {
            const tenant = await this.getTenantByDomain(tenantId);
            const dnds = tenant.callCenterOpts.dnds;
            if (Array.isArray(dnds) && dnds.length) {
                let findAppointDnd = false;
                let findIndex = -1;
                for (let i = 0; i < dnds.length; i++) {
                    if (typeof dnds[i] === 'object') {
                        if (dnd && dnds[i].number === dnd) {
                            findAppointDnd = true;
                            findIndex = i;
                        }
                        if (findAppointDnd && forceDND) break;
                    }
                }
                if (!findAppointDnd && forceDND) {
                    return Promise.reject(`指定使用DND号:${dnd},但是租户没有配置改DND号码!`);
                }
                else if (findAppointDnd && forceDND) {
                    let resDnd = dnds[findIndex].number;
                    let concurrentCall = dnds[findIndex].concurrentCallOut || 0;
                    let gateway = await this.checkDndConcureent(resDnd, concurrentCall, tenantId, callId);
                    return { dnd: resDnd, gateway };
                }
                else {
                    let gateway = '';
                    let randomDnd = '';

                    while (dnds.length && !gateway) {
                        const randomIndex = this.getRandomInt(0, dnds.length - 1);
                        randomDnd = dnds[randomIndex].number;
                        let concurrentCall = dnds[randomIndex].concurrentCallOut || 0;
                        gateway = await this.checkDndConcureent(randomDnd, concurrentCall, tenantId, callId);
                        if (!gateway) {
                            dnds.splice(randomIndex, 1)
                        }
                    }
                    return { dnd: randomDnd, gateway };
                }
            } else {
                return Promise.reject('租户没有设置任何DND号码!');
            }
        }
        catch (ex) {
            this.logger.error('Get tenant DND and gateway error:', ex);
            return Promise.reject(ex);
        }

    }

    // 返回一个介于min和max之间的随机数
    getRandomArbitrary(min, max) {
        return Math.random() * (max - min) + min;
    }

    // 返回一个介于min和max之间的整型随机数
    // Using Math.round() will give you a non-uniform distribution!
    getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    // 返回一个大于等于0，小于1的伪随机数
    getRandom() {
        return Math.random();
    }

    async checkDndConcureent(dnd, concurrentCall, tenantId, callId) {
        try {
            // 从redis缓存中获取某个dnd对应的trunk信息
            const dndTrunkKey = `CallControl::DND::TRUNK::CACHE::${dnd}`;
            let dndTrunkInfo = await this.redLockClient.hgetall(dndTrunkKey);
            // 如果不存在从mongoDB中获取并写入到redis缓存
            if (!dndTrunkInfo) {
                dndTrunkInfo = await this.pbxTrunkController.getTrunkInfoByDND(dnd);// 如果无法获取到,会reject
                await this.redLockClient.multi([
                    ['hmset', dndTrunkKey, 'name', dndTrunkInfo.name, 'concurrentCall', dndTrunkInfo.concurrentCall || 0, 'transport', dndTrunkInfo.transport, 'gateway', dndTrunkInfo.gateway, 'protocol', dndTrunkInfo.protocol
                    ],
                    ['expire', dndTrunkKey, 8 * 60 * 60]
                ]);
            }
            const step = concurrentCall > 999 ? 100 :
                concurrentCall > 99 ? 50 :
                    concurrentCall > 60 ? 2 : 1
            const retry = concurrentCall > 999 ? 20 :
                concurrentCall > 499 ? 15 :
                    concurrentCall > 60 ? 10 : 1;
            const { lock, resource } = await this.getResource({ dnd, max: concurrentCall, index: 0, retry, step });
            if (lock) {
                const callResourceKey = `CallControl::DND::Resource::${callId}`;
                await this.redLockClient.set(callResourceKey, resource);
                this.freeResource(lock, tenantId, callId);
                return `${dndTrunkInfo.gateway};transport=${dndTrunkInfo.transport}`;
            } else {
                return '';
            }
        } catch (ex) {
            return Promise.reject(ex);
        }
    }


    async getResource({ dnd, max, step, index, retry }) {

        try {
            const resource = `CallControl::DND::${dnd}::${index}`;
            const lock = await this.redlock.lock(resource, 60 * 1000);
            return { lock, resource };
        } catch (ex) {
            const nextIndex = step === 1 ? index + 1 : index + this.getRandomInt(step, max);
            if (max < 1 || max > nextIndex) {
                return this.getResource({ dnd, max, step, index: nextIndex, retry: retry });
            }
            else if (nextIndex >= max && retry > 0) {
                return this.getResource({ dnd, max, step, index: nextIndex - max, retry: retry - 1 });
            }
            else {
                this.logger.error(`${dnd}未获取到资源!`);
                return { lock: null, resource: '' };
            }
        }
    }

    freeResource(lock, tenantId, callId) {
        setTimeout(() => {
            this.pbxCdrController.getByCallid(tenantId, callId)
                .then(doc => {
                    if (doc && doc.alive === 'yes') {
                        lock.extend(60 * 1000, (err, exLock) => {
                            if (err) {
                                this.logger.error('extend资源发生错误:', err);
                            } else {
                                this.logger.debug('继续锁定线路资源!');
                                this.freeResource(exLock, tenantId, callId)
                            }
                        })
                    } else {
                        this.logger.debug('CDR查询到通话已结束,解锁路资源!');
                        lock.unlock((err) => {
                            if (err) {
                                this.logger.error('1:unlock资源发生错误:', err);
                            }
                        });
                    }
                })
                .catch(err => {
                    this.logger.error('获取cdr数据发生异常:', err);
                    lock.unlock((e) => {
                        this.logger.error('2:unlock资源发生错误:', e);
                    });
                })
        }, 30 * 1000)
    }

}