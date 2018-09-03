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
            req.checkBody({
                'name': {
                    notEmpty: true,
                    isLength: {
                        options: [{ min: 4, max: 32 }],
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
                createBy: mongoose.Types.ObjectId(''),
                owner: mongoose.Types.ObjectId(''),
            });
            const customerDoc = await customer.save();
            return customerDoc;
        } catch (err) {
            console.log('创建客户失败', err);
            res.json({
                'meta': {
                    'code': 404,
                    'message': '没有找到指定用户'
                }
            });
        }
    }

}
