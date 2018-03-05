import { Injectable, Injector } from 'injection-js';
import * as mongoose from 'mongoose';
import { RouterModel } from '../models/router';
import { Request, Response, NextFunction } from 'express';
import { LoggerService } from '../service/LogService';
import { MongoService } from '../service/MongoService';
@Injectable()
export class RouterController {
    constructor(private injector: Injector, private logger: LoggerService, private mongoDB: MongoService) {

    }
    async create(req: Request, res: Response, next: NextFunction) {
        this.logger.debug('创建一条呼叫路由规则');
        req.checkBody({
            'username': {
                notEmpty: true,
                isLength: {
                    options: [{ min: 11, max: 11 }],
                    errorMessage: '用户不是合法11位手机号' // Error message for the validator, takes precedent over parameter message
                },
                errorMessage: '用户名不能为空'
            },
            'password': {
                notEmpty: true, // won't validate if field is empty
                isLength: {
                    options: [{ min: 6, max: 18 }],
                    errorMessage: '密码长度不是6-18位' // Error message for the validator, takes precedent over parameter message
                },
                errorMessage: '密码不能为空' // Error message for the parameter
            },
        });
        const errors = req.validationErrors();
        if (errors) {
            res.json({
                'meta': {
                    'code': 422,
                    'message': '用户名和密码不正确'
                }
            });
            return;
        }
        try {
            const user: any = await this.mongoDB.models.Users.findOne({ username: req.body.username });
            if (!user) {
                res.json({
                    'meta': {
                        'code': 422,
                        'message': '用户不存在'
                    }
                });
            }
          
        } catch (err) {
            console.log('登陆信息失败', err);
            res.json({
                'meta': {
                    'code': 404,
                    'message': '没有找到指定用户'
                }
            });
        }
    }

    async getRouterByTenantId(tenantId: string, routerLine: string) {
        try {
            const result = {
                processmode: '',
                processdefined: null,
                routerLine: '',
                match: false,
                matchFailError: ''
            }
            const routeDocs = await this.mongoDB.models.Routers.find({
                tenantId: tenantId,
                routerLine: routerLine
            }, {}, {
                    lean: true,
                    sort: {
                        priority: 1
                    }
                });
            this.logger.debug('getRouterByTenantId docs:',routeDocs);
        } catch (ex) {
            this.logger.error('getRouterByTenantId error:', ex);
        }
    }
}