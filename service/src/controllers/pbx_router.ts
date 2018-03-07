import { Injectable, Injector } from 'injection-js';
import * as mongoose from 'mongoose';
import { PBXRouterModel } from '../models/pbx_routers';
import { Request, Response, NextFunction } from 'express';
import { LoggerService } from '../service/LogService';
import { MongoService } from '../service/MongoService';
import { PBXCallProcessController } from './pbx_callProcess'
@Injectable()
export class PBXRouterController {
    private callProcessControl:PBXCallProcessController;
    constructor(private injector: Injector, private logger: LoggerService, private mongoDB: MongoService) {
        this.callProcessControl = this.injector.get(PBXCallProcessController);
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

    async getRouterByTenantId(tenantId: string, routerLine: string, caller: string, called: string,callId:string) {
        try {
            const result = {
                processmode: '',
                processdefined: null,
                routerLine: '',
                match: false,
                matchFailError: ''
            }
            const routeDocs = await this.mongoDB.models.PBXRouters.find({
                tenantId: tenantId,
                routerLine: routerLine
            }, {}, {
                    lean: true,
                    sort: {
                        priority: 1
                    }
                });

            for (let i: number = 0; i < routeDocs.length; i++) {
                let doc = routeDocs[i];
                this.logger.debug("循环去匹配找到的路由规则：", doc.routerName);
                if (!result.match) {
                    if (doc.callerGroup === 'all') {
                        this.logger.debug("开始进行呼叫路由判断,主叫:", caller, ",被叫:", called);
                        result.match = true;
                        let reCaller = new RegExp("^" + doc.callerId);
                        let reCalled = new RegExp("^" + doc.calledNum);

                        // _this.db.cdrSetRouterLine(doc.routerLine, 'Router');

                        if (doc.routerLine === '呼入') {
                            //匹配主叫以什么号码开头
                            if (doc.callerId && !reCaller.test(caller)) {
                                result.match = false;
                            }
                            //匹配主叫号码长度
                            if (doc.callerLen > 0 && caller.length !== doc.callerLen) {
                                result.match = false;
                            }
                            //匹配被叫开头
                            if (doc.calledNum && !reCalled.test(called)) {
                                result.match = false;
                            }
                            //匹配被叫长度
                            if (doc.calledLen > 0 && called.length !== doc.calledLen) {
                                result.match = false;
                            }
                        }
                        else if (doc.routerLine === '呼出') {
                            //匹配被叫以什么号码开头
                            if (doc.calledNum && !reCalled.test(called)) {
                                result.match = false;
                            }
                            //匹配被叫长度
                            if (doc.calledLen > 0 && called.length !== doc.calledLen) {
                                result.match = false;
                            }
                            // _this.R.agentId = await _this.R.service.extension.getAgentId(_this.R.tenantId, _this.R.caller);
                            // _this.db.cdrSetAgentId(_this.R.agentId, 'Router');
                        }
                        else if (doc.routerLine === '本地') {
                            //匹配被叫以什么号码开头
                            if (doc.calledNum && !reCalled.test(called)) {
                                result.match = false;
                            }
                            //匹配被叫长度
                            if (doc.calledLen > 0 && called.length !== doc.calledLen) {
                                result.match = false;
                            }
                            // _this.R.agentId = await _this.R.service.extension.getAgentId(_this.R.tenantId, _this.R.caller);
                            // _this.db.cdrSetAgentId(_this.R.agentId, 'Router');
                        }
                        else {
                            //其他情况
                            result.match = false;
                            result.matchFailError = `未知的routerLine${doc.routerLine}`;
                        }
                        result.routerLine = doc.routerLine;
                        //匹配成功后，对主叫和被叫进行替换
                        if (result.match) {
                            //主叫替换
                            this.logger.debug("路由匹配成功，开始进行替换操作!");
                            if (doc.replaceCallerId !== '') {
                                caller = doc.replaceCallerId;
                            }
                            //删除被叫前几位
                            if (doc.replaceCalledTrim > 0) {
                                called = called.substr(doc.replaceCalledTrim);
                            }
                            //补充被叫前几位
                            if (doc.replaceCalledAppend !== '') {
                                called = doc.replaceCalledAppend + called;
                            }
                            result.processmode = doc.processMode;
                            if (result.processmode === 'dialout') {
                                result.processdefined = doc.processedFined;
                            }
                            else if (result.processmode === 'dialpbxlocal') {
                                result.processdefined = doc.processedFined;
                            }
                            else if (result.processmode === 'dialoutNewRock') {
                                result.processdefined = doc.processedFined;
                            }
                            else {
                                result.processmode = 'diallocal';
                                if (routerLine === '本地') {
                                    result.processdefined = called;
                                }
                                else if (routerLine === '呼入') {
                                    result.processdefined = doc.processedFined || '200';
                                } else {
                                    result.processdefined = doc.processedFined
                                }
                            }
                            //callProcessData.passArgs.routerName = doc.routerName;
                            //callProcessData.passArgs.match = true;
                            //callProcessData.passArgs.processmode = result.processmode;
                            //callProcessData.passArgs.processedFined = result.processedFined;
                            break;
                        }
                    }
                }
            }

            if (!result.match) {
                this.logger.debug("路由匹配失败，进行默认设置处理!");        
                if (called === '100') {
                  result.processmode = 'diallocal';
                  result.processdefined = '200';
                }
                else {
                  result.matchFailError = '未找到适合的路由!';
                }
              }
              const callProcessData = {
                tenantId:tenantId,
                callId: callId,
                caller: caller,
                called: called,
                processName: 'route',
                passArgs: {match: false, routerName: '', processmode: '', processedFined: ''},
              }
              this.callProcessControl.create(callProcessData);
            this.logger.debug('Route Result:', result);
            return Promise.resolve(result);
        } catch (ex) {
            this.logger.error('getRouterByTenantId error:', ex);
            return Promise.reject(ex);
        }
    }
}