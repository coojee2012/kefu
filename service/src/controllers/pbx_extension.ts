import { Injectable, Injector } from 'injection-js';
import * as mongoose from 'mongoose';
import { PBXExtensionModel } from '../models/pbx_extensions';
import { Request, Response, NextFunction } from 'express';
import { LoggerService } from '../service/LogService';
import { MongoService } from '../service/MongoService';

@Injectable()
export class PBXExtensionController {
    constructor(private injector: Injector, private logger: LoggerService, private mongoDB: MongoService) {

    }
    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const { tenantId } = req.params
            req.checkBody({
                'accountCode': {
                    notEmpty: true,
                    matches: {
                        options: /^[1-9]\d{3}$/,
                        errorMessage: '分机号应该为1-9开头的四位数字' // Error message for the validator, takes precedent over parameter message
                    },
                    errorMessage: '分机号不能为空'
                },
                'password': {
                    notEmpty: true,
                    matches: {
                        options: /^[a-zA-Z0-9_-]{6,6}$/,
                        errorMessage: '密码应该由6位【a-zA-Z0-9_-】字符组成' // Error message for the validator, takes precedent over parameter message
                    },
                    errorMessage: '密码不能为空'
                }
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

            const newExtension = new this.mongoDB.models.PBXExtension({
                accountCode: req.body.accountCode,
                password: req.body.password,
                tenantId,
            })

            // 保存用户账号
            newExtension.save((err, exten: PBXExtensionModel) => {
                if (err) {
                    return next(err);
                }
                res.json({
                    'meta': {
                        'code': 200,
                        'message': '成功创建新用户!'
                    },
                    'data': exten
                });
            });

        }
        catch (ex) {
            return next(ex);
        }
    }

    async addmuti(req: Request, res: Response, next: NextFunction){
        try {
            const { tenantId } = req.params
            req.checkBody({
                'accountCode': {
                    notEmpty: true,
                    matches: {
                        options: /^[1-9]\d{3}\-[1-9]\d{3}$/,
                        errorMessage: '分机号应该为1-9开头的四位数字' // Error message for the validator, takes precedent over parameter message
                    },
                    errorMessage: '分机号不能为空'
                },
                'password': {
                    notEmpty: true,
                    matches: {
                        options: /^[a-zA-Z0-9_-]{6,6}$/,
                        errorMessage: '密码应该由6位【a-zA-Z0-9_-】字符组成' // Error message for the validator, takes precedent over parameter message
                    },
                    errorMessage: '密码不能为空'
                }
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


            res.json({
                'meta': {
                    'code': 422,
                    'message': '添加多个分机功能尚在开发中......'
                }
            });
            return;


            const newExtension = new this.mongoDB.models.PBXExtension({
                accountCode: req.body.accountCode,
                password: req.body.password,
                tenantId,
            })

            // 保存用户账号
            newExtension.save((err, exten: PBXExtensionModel) => {
                if (err) {
                    return next(err);
                }
                res.json({
                    'meta': {
                        'code': 200,
                        'message': '成功创建新用户!'
                    },
                    'data': exten
                });
            });

        }
        catch (ex) {
            return next(ex);
        }
    }

    /**
     * 
     * @param tenantId 
     * @description 
     * 队列拨打时 检查坐席是否可被拨打
     * @param accountCode 
     */
    async checkAgentCanDail(tenantId: string, accountCode: string): Promise<PBXExtensionModel> {
        try {
            const query = {
                tenantId,
                accountCode,
                state: 'waiting',
                status: 'Login'
            }
            const fields = null;
            const options = {
                lean: true
            }
            const doc = await this.mongoDB.models.PBXExtension.findOne(query, fields, options);
            return doc;
        }
        catch (ex) {
            return Promise.reject(ex);
        }
    }

    async setAgentLastCallId(tenantId: string, accountCode: string, callId: string) {
        const _this = this;
        try {
            const query = {
                tenantId,
                accountCode
            }
            const setData = {
                lastCallId: callId,
                logicType: '',
                logicOptions: null
            }
            const res = await this.mongoDB.models.PBXExtension.update(query, { $set: setData });
            return Promise.resolve(res);
        }
        catch (ex) {
            return Promise.reject(ex);
        }
    }

    /**
     * @description
     * 根据分机号更改分机状态
     * @param tenantId 
     * @param accountCode 
     * @param state 
     */
    async setAgentState(tenantId: string, accountCode: string, state: string) {
        try {
            const query = {
                tenantId,
                accountCode
            }
            const setData = {
                state: state,
                stateLastModified: new Date()
            }
            const res = await this.mongoDB.models.PBXExtension.update(query, { $set: setData }, { multi: false });
            return Promise.resolve(res);
        }
        catch (ex) {
            return Promise.reject(ex);
        }
    }

    async getExtenByNumber(tenantId, accountCode) {
        try {
            const query = {
                tenantId,
                accountCode,
            }
            const fields = null;
            const options = {
                lean: true
            }
            const doc = await this.mongoDB.models.PBXExtension.findOne(query, fields, options);
            return doc;
        }
        catch (ex) {
            return Promise.reject(ex);
        }
    }

    async delExtension(req: Request, res: Response, next: NextFunction) {
        try {
            const { tenantId } = req.params
            req.checkBody({
                'id': {
                    notEmpty: true,
                    errorMessage: '参数id不能为空'
                }
            });
            const query = {
                tenantId,
                _id: req.body.id
            }
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


            const doc = await this.mongoDB.models.PBXExtension.remove(query);
            res.json({
                'meta': {
                    'code': 200,
                    'message': '删除列表成功'
                },
                data: null
            });
        }
        catch (ex) {
            this.logger.error('extension  del  error', ex);
            return next(ex);
        }
    }

    async getList(req: Request, res: Response, next: NextFunction) {
        try {
            const { tenantId } = req.params
            this.logger.debug(`获取租户${tenantId}的分机列表!`, req.body);
            req.checkBody({

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
            let query = {
                tenantId,
            }

            const fields = null;
            const sort = {
                'accountCode': 1,
            }
            if (req.body.order) {
                sort['accountCode'] = req.body.order.accountCode ? req.body.order.accountCode : 1;
            }
            const options = {
                lean: true,
                sort,
            }
            const docs = await this.mongoDB.models.PBXExtension.find(query, fields, options);
            res.json({
                'meta': {
                    'code': 200,
                    'message': '获取用户列表成功'
                },
                'data': docs
            });
        }
        catch (ex) {
            this.logger.error('extension  list  error', ex);
            return next(ex);
        }
    }

}