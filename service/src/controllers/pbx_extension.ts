import { Injectable, Injector } from 'injection-js';
import * as mongoose from 'mongoose';
import * as xml from 'xmlbuilder';
import * as crypto from 'crypto';
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

    async addmuti(req: Request, res: Response, next: NextFunction) {
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

    async directory(req: Request, res: Response, next: NextFunction) {
        try {
            //  `a1-hash` param instead. Its value should be an md5sum containing `user:domain:password`.
            console.log('directory:', req.body);
            res.set('Content-Type', 'text/xml');
            const { hostname, domain, sip_auth_method, user, sip_auth_realm, sip_auth_username, sip_contact_host, action, purpose, profile } = req.body;

            const cacheMs = 5 * 60 * 1000;
            res.set('Content-Type', 'text/xml');

            if (purpose === 'gateways') {
                const tenants = ['163.com', '263.com']; //TODO 从租户列表获取开通了的租户 

                const document = xml.create('document', { encoding: 'utf-8' })
                    .att('type', 'freeswitch/xml')
                    .ele('section', { 'name': 'directory' });

                tenants.forEach(item => {
                    document.ele('domain', { 'name': `${item}` })
                        .ele('params')
                        .ele('param', { 'name': 'dial-string', 'value': '{sip_invite_domain=${domain_name},presence_id=${dialed_user}@${dialed_domain}}${sofia_contact(${dialed_user}@${dialed_domain})}' }).up()
                        .up() // params
                        .ele('variables')
                        .ele('variable', { 'name': 'record_stereo', value: 'true' }).up()
                        .up() // variables
                        .ele('user', { id: '1000' }).up()// user
                        .ele('user', { id: '1001' }).up()// user
                        .ele('user', { id: '1002' }).up()// user
                        .ele('user', { id: '1020' }).up()// user
                        .up(); // domain
                })
                const xmlStr = document.end({ pretty: true })
                res.send(xmlStr)
            }
            else if (action === 'sip_auth' || action === 'message-count' ) {

                const tenantId = action === 'sip_auth' ? domain : domain[0];
                const extenInfo = await this.getExtenByNumber(tenantId, user);
                if (!extenInfo) {
                    const document = xml.create('document', { encoding: 'utf-8' })
                        .att('type', 'freeswitch/xml')
                        .ele('section', { 'name': 'directory' })
                        .ele('domain', { 'name': `${tenantId}` })
                        .ele('params')
                        .ele('param').up()
                        .up() // params
                        .ele('groups')
                        .ele('group', { 'name': 'default' })
                        .ele('users')
                        .up() // groups
                    const xmlStr = document.end({ pretty: true })
                    res.send(xmlStr);
                    this.logger.debug('not fond user');
                    return;
                }
               
                const xmlStr = this.fsWriteAuthorizationResponse(user, tenantId, extenInfo.password);
                res.send(xmlStr)
            }
            else if (action === 'user_call') {
                const xmlStr = this.fsWriteDialByUserResponse(domain, user, '');
                res.send(xmlStr)
            }
            else if (action === 'reverse-auth-lookup') {
                const document = xml.create('document', { encoding: 'utf-8' })
                    .att('type', 'freeswitch/xml')
                    .ele('section', { 'name': 'directory' })
                    .ele('domain', { 'name': `${domain}` })
                    .ele('user', { 'id': `1000` })
                    .ele('params')
                    .ele('param', { 'nam': 'reverse-auth-user', 'value': `${user}` }).up()
                    .ele('param', { 'nam': 'reverse-auth-pass', 'value': `password` }).up()
                const xmlStr = document.end({ pretty: true })
                res.send(xmlStr)
            } else {
                const xmlStr = this.fsWriteNotFoundResponse();
                res.send(xmlStr)
            }
        } catch (ex) {
            this.logger.error('fs directory error:', ex);
            const xmlStr = this.fsWriteNotFoundResponse();
            res.send(xmlStr)
        }

    }

    fsWriteNotFoundResponse(): string {
        const document = xml.create('document', { encoding: 'utf-8' })
            .att('type', 'freeswitch/xml')
            .ele('section', { 'name': 'result' })
            .ele('result', { 'status': `not found` })
        const xmlStr = document.end({ pretty: true })
        return xmlStr;
    }

    fsWriteAuthorizationResponse(user, domain, password) {
        const md5 = crypto.createHash('md5');
        const result = md5.update(`${user}:${domain}:${password}`).digest('hex');
        const document = xml.create('document', { encoding: 'utf-8' })
            .att('type', 'freeswitch/xml')
            .ele('section', { 'name': 'directory' })
            .ele('domain', { 'name': `${domain}` })
            .ele('params')
            .ele('param', { 'name': 'dial-string', 'value': '{sip_invite_domain=${domain_name},presence_id=${dialed_user}@${dialed_domain}}${sofia_contact(${dialed_user}@${dialed_domain})}' }).up()

            .up() // params
            .ele('variables')
            .ele('variable', { name: 'accountcode', value: `${user}` }).up()
            .ele('variable', { name: 'user_context', value: `default` }).up()
            .ele('variable', { name: 'outbound_caller_id_name', value: `${user}` }).up()
            .ele('variable', { name: 'outbound_caller_id_number', value: `${user}` }).up()
            .ele('variable', { name: 'limit_max', value: '1' }).up()
            .ele('variable', { name: 'toll_allow', value: '' }).up()
            .up() // <variables>
            .ele('groups')
            .ele('group', { 'name': 'default' })
            .ele('users')
            .ele('user', { 'id': `${user}` })
            .ele('params')
            //.ele('param', { 'name': 'password', 'value': `${extenInfo.password}` }).up()
            .ele('param', { 'name': 'a1-hash', 'value': `${result}` }).up()
            .up()
            .up() // groups
        const xmlStr = document.end({ pretty: true });
        return xmlStr;
    }

    fsWriteDialByUserResponse(domain, user, callGroup): string {
        const document = xml.create('document', { encoding: 'utf-8' })
            .att('type', 'freeswitch/xml')
            .ele('section', { 'name': 'directory', description: 'Dynamic User Directory' })
            .ele('domain', { 'name': `${domain}` })
            .ele('params')
            .ele('param', { 'name': 'dial-string', 'value': '{sip_invite_domain=${domain_name},presence_id=${dialed_user}@${dialed_domain}}${sofia_contact(${dialed_user}@${dialed_domain})}' }).up()
            .up() // params
            .ele('variables')
            .ele('variable', { 'name': 'record_stereo', value: 'true' }).up()
            .up() // variables
            .ele('groups')
            .ele('group', { 'name': 'default' })
            .ele('users')
            .ele('user', { id: `${user}` }).up()// user
            .up() // groups
        const xmlStr = document.end({ pretty: true })
        this.logger.debug(xmlStr);
        return xmlStr;
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