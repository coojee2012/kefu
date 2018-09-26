import { Injectable, Injector } from 'injection-js';
import * as mongoose from 'mongoose';
import { Request, Response, NextFunction } from 'express';
import { TenantModel } from '../models/tenants';
import { CustomerModel } from '../models/customers'
import { LoggerService } from '../service/LogService';
import { MongoService } from '../service/MongoService';
import { RedisService } from '../service/RedisService';
import { RedisOptions, Redis } from 'ioredis';


@Injectable()
export class CustomerController {
    private redisService: RedisService;
    constructor(private injector: Injector, private logger: LoggerService, private mongoDB: MongoService) {
        this.redisService = this.injector.get(RedisService);
    }

    async create(req: Request, res: Response, next: NextFunction) {

        try {
            const optUser = (req as any).user;
            // this.logger.debug('optUser:', optUser);
            req.checkBody({
                'name': {
                    notEmpty: true,
                    isLength: {
                        options: [{ min: 1, max: 32 }],
                        errorMessage: '客户姓名不是合法' // Error message for the validator, takes precedent over parameter message
                    },
                    errorMessage: '客户姓名不能为空'
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

            const tenantId = optUser.domain;
            if (!tenantId) {
                res.json({
                    'meta': {
                        'code': 422,
                        'message': '租户授权无效'
                    }
                });
                return;
            }
            const customer: CustomerModel = new this.mongoDB.models.Customer({
                tenantId,
                name: req.body.name,
                mobile: req.body.mobile,
                level: '0',
                address: req.body.address || '',
                telphone: req.body.telphone || '',
                email: req.body.email || '',
                title: req.body.email || '',
                companyName: req.body.companyName || '',
                department: req.body.department || '',
                memo: req.body.memo || '',
                createBy: mongoose.Types.ObjectId(optUser._id),
                owner: mongoose.Types.ObjectId(optUser._id),
            });
            const customerDoc = await customer.save();
            res.json({
                'meta': {
                    'code': 200,
                    'message': '客户创建成功'
                },
                data: customerDoc
            });
            return;
        } catch (err) {
            this.logger.error('创建客户失败', err);
            res.json({
                'meta': {
                    'code': 404,
                    'message': '没有找到指定用户'
                }
            });
        }
    }

    async updateRest(req: Request, res: Response, next: NextFunction) {

        try {
            const optUser = (req as any).user;
            this.logger.debug('optUser:', optUser.domain);

            req.checkBody({
                'name': {
                    notEmpty: true,
                    isLength: {
                        options: [{ min: 1, max: 32 }],
                        errorMessage: '客户姓名不是合法' // Error message for the validator, takes precedent over parameter message
                    },
                    errorMessage: '客户姓名不能为空'
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
            const { tenantId, id } = req.params

            this.logger.debug('ddd', userTenantId, tenantId, id);
            if (!userTenantId || userTenantId !== tenantId) {
                res.json({
                    'meta': {
                        'code': 422,
                        'message': '租户授权无效'
                    }
                });
                return;
            }
            const modifyResult = await this.mongoDB.models.Customer.update({
                tenantId,
                _id: id
            }, {
                    name: req.body.name,
                    mobile: req.body.mobile,
                    level: '0',
                    address: req.body.address || '',
                    telphone: req.body.telphone || '',
                    email: req.body.email || '',
                    title: req.body.email || '',
                    companyName: req.body.companyName || '',
                    department: req.body.department || '',
                    memo: req.body.memo || '',
                    modifyBy: mongoose.Types.ObjectId(optUser._id),
                });

            res.json({
                'meta': {
                    'code': 200,
                    'message': '客户修改成功'
                },
                data: modifyResult
            });
            return;
        } catch (err) {
            this.logger.error('创建修改失败', err);
            res.json({
                'meta': {
                    'code': 404,
                    'message': '没有找到指定用户'
                }
            });
        }
    }

    async getByIdRest(req: Request, res: Response, next: NextFunction) {
        try {
            const optUser = (req as any).user;
            this.logger.debug('optUser:', optUser.domain);

            req.checkBody({
                'id': {
                    notEmpty: true,
                    errorMessage: 'ID不能为空'
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

            const doc = await this.mongoDB.models.Customer.findOne({
                tenantId,
                _id: req.body.id
            });

            res.json({
                'meta': {
                    'code': 200,
                    'message': '获取客户成功'
                },
                data: doc
            });
            return;
        } catch (error) {

        }
    }

    async keySearch(req: Request, res: Response, next: NextFunction) {
        try {
            const optUser = (req as any).user;
            req.checkBody({
                'key': {
                    notEmpty: true,
                    errorMessage: '关键字不能为空'
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

            const key = new RegExp(req.body.key);
            const docs = await this.mongoDB.models.Customer.find({
                tenantId,
                $or: [
                    { name: key },
                    { mobile: key },
                    { telphone: key },
                    { companyName: key },
                ]
            }, {
                    _id: 1,
                    name: 1,
                    mobile: 1,
                    telphone: 1,
                    companyName: 1,
                    address: 1,
                    email: 1,
                    level: 1,
                    memo: 1,
                }, { sort: { createdAt: 1 } });

            res.json({
                'meta': {
                    'code': 200,
                    'message': '关键字查询客户成功'
                },
                data: docs
            });



        } catch (error) {
            this.logger.error('关键字搜索客户失败：', error);
            res.json({
                'meta': {
                    'code': 404,
                    'message': ''
                }
            });
        }
    }

}
