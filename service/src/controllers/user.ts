/**
 * 用户模板
 * Created by jiayi on 2017/6/20.
 */
import { Injectable, Injector } from 'injection-js';
import * as jwt from 'jsonwebtoken';
import { UserModel } from '../models/user';
import { LocalStrategyInfo } from 'passport-local';
import { Request, Response, NextFunction } from 'express';
import * as mongoose from 'mongoose';
import { ArticleController } from './article';
import { LoggerService } from '../service/LogService';
import { MongoService } from '../service/MongoService';
import redisClient from '../config/redis';

/**
 * 定义类接口
 */
export interface UserInterface {
    login(req: Request, res: Response, next: NextFunction);

    logout(req: Request, res: Response, next: NextFunction);

    register(req: Request, res: Response, next: NextFunction);

    add(req: Request, res: Response, next: NextFunction);

    home(req: Request, res: Response, next: NextFunction);

    checkNickname(req: Request, res: Response, next: NextFunction);

    byId(req: Request, res: Response, next: NextFunction, id: string)
}

/**
 * 模板控制器
 */
@Injectable()
export class UserController implements UserInterface {
    private articleController: ArticleController;
    constructor(private injector: Injector, private logger: LoggerService, private mongoDB: MongoService) {
        this.articleController = injector.get(ArticleController);
    }

    /**
     * POST /login
     * 用户登陆
     */
    async login(req: Request, res: Response, next: NextFunction) {
        this.logger.debug('测试日志打印');
        req.checkBody({
            'username': {
                notEmpty: true,
                isLength: {
                    options: [{ min: 4, max: 32 }],
                    errorMessage: '用户不是合法1' // Error message for the validator, takes precedent over parameter message
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
        try {
            const [username, domain] = req.body.username.split('@');
            if (!domain) {
                res.json({
                    'meta': {
                        'code': 422,
                        'message': '用户名格式不正确'
                    }
                });
                return;
            }
            const user: any = await this.mongoDB.models.Users.findOne({ username, domain , status: '1' });
            if (!user) {
                res.json({
                    'meta': {
                        'code': 422,
                        'message': '用户不存在或用户已注销！'
                    }
                });
            }
            user.comparePassword(req.body.password, (err, isMatch: boolean) => {
                if (err) {
                    return next(err);
                }
                if (isMatch) {
                    const token = jwt.sign({ username: user.username }, `kefu2018@abcf`, {
                        expiresIn: '1 days'  // token到期时间设置 1000, '2 days', '10h', '7d'
                    });
                    user.token = token;
                    user.save(function (error) {
                        if (error) {
                            return next(error);
                        }
                        res.json({
                            'meta': {
                                'code': 200,
                                'message': '登陆成功'
                            },
                            'data': {
                                token,
                                'user': {
                                    'nickname': user.basic.nickname,
                                    'avatar': user.basic.avatar,
                                    'phone': user.phone,
                                    'domain': user.domain,
                                    'state': user.state,
                                    'slug': user.slug
                                }
                            }
                        });
                    });
                } else {
                    res.json({
                        'meta': {
                            'code': 422,
                            'message': '登陆失败,密码错误!'
                        }
                    });
                }
            });
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

    /**
     * POST /logout
     * 检查注册昵称
     */
    async checkNickname(req: Request, res: Response, next: NextFunction) {
        req.checkBody({
            'nickname': {
                notEmpty: true,
                isLength: {
                    options: [{ min: 2, max: 10 }],
                    errorMessage: '昵称长度不是2-10位' // Error message for the validator, takes precedent over parameter message
                },
                errorMessage: '昵称不能为空'
            }
        });
        req.getValidationResult().then(function (result: any) {
            if (!result.isEmpty()) {
                let message = '未知错误';
                if (result.mapped().nickname) {
                    message = result.mapped().nickname.msg;
                }
                res.json({
                    'meta': {
                        'code': 422,
                        'message': message
                    }
                });
                return;
            }
            this.mongoDB.models.Users.findOne({
                'basic.nickname': req.body.nickname
            }).exec((err: any, user: UserModel) => {
                if (err) {
                    return next(err);
                }
                if (!user) {
                    res.json({
                        'meta': {
                            'code': 200,
                            'message': '可以注册'
                        }
                    });
                } else {
                    res.json({
                        'meta': {
                            'code': 422,
                            'message': '已经被注册'
                        }
                    });
                }
            });
        });
    }

    /**
     * POST /logout
     * 检查手机号
     */
    async checkUsername(req: Request, res: Response, next: NextFunction) {
        req.checkBody({
            'username': {
                notEmpty: true,
                isLength: {
                    options: [{ min: 11, max: 11 }],
                    errorMessage: '用户不是合法11位手机号' // Error message for the validator, takes precedent over parameter message
                },
                errorMessage: '用户名不能为空'
            }
        });
        req.getValidationResult().then(function (result: any) {
            if (!result.isEmpty()) {
                let message = '未知错误';
                if (result.mapped().username) {
                    message = result.mapped().username.msg;
                }
                res.json({
                    'meta': {
                        'code': 422,
                        'message': message
                    }
                });
                return;
            }
            this.mongoDB.models.Users.findOne({
                'username': req.body.username
            }).exec((err, user: UserModel) => {
                if (err) {
                    return next(err);
                }
                if (!user) {
                    res.json({
                        'meta': {
                            'code': 200,
                            'message': '可以注册'
                        }
                    });
                } else {
                    res.json({
                        'meta': {
                            'code': 422,
                            'message': '已经被注册'
                        }
                    });
                }
            });
        });
    }

    /**
     * POST /register
     * 用户注册
     */
    async register(req: Request, res: Response, next: NextFunction) {
        try {
            req.checkBody({
                'nickname': {
                    notEmpty: true,
                    isLength: {
                        options: [{ min: 2, max: 12 }],
                        errorMessage: '称呼长度不是2-12位' // Error message for the validator, takes precedent over parameter message
                    },
                    errorMessage: '称呼不能为空'
                },
                'domain': {
                    notEmpty: true,
                    isLength: {
                        options: [{ min: 4, max: 12 }],
                        errorMessage: '企业域长度不是4-12位' // Error message for the validator, takes precedent over parameter message
                    },
                    errorMessage: '企业域不能为空'
                },
                'username': {
                    notEmpty: true,
                    isLength: {
                        options: [{ min: 11, max: 11 }],
                        errorMessage: '用户不是合法11位手机号' // Error message for the validator, takes precedent over parameter message
                    },
                    errorMessage: '用户名应该是11位手机号'
                },
                'password': {
                    notEmpty: true, // won't validate if field is empty
                    isLength: {
                        options: [{ min: 6, max: 18 }],
                        errorMessage: '密码长度不是6-18位' // Error message for the validator, takes precedent over parameter message
                    },
                    errorMessage: '密码不能为空' // Error message for the parameter
                }
            });
            const result = await req.getValidationResult();
            this.logger.debug('getValidationResult:', result.isEmpty());

            if (!result.isEmpty()) {
                res.json({
                    'meta': {
                        'code': 422,
                        'message': '称呼、企业域、用户名和密码不正确'
                    }
                });
                return;
            }

            const user: any = await this.mongoDB.models.Users.findOne({
                'domain': req.body.domain,
                // $or: [
                //     {
                //         username: req.body.username
                //     },
                //     {
                //         'basic.nickname': req.body.nickname
                //     },

                // ]
            });
            if (user) {
                res.json({
                    'meta': {
                        'code': 422,
                        'message': '企业域已经被注册'
                    }
                });
                return;
            }
            const token = jwt.sign({ username: req.body.username.username }, `kefu2018@abcf`, {
                expiresIn: '1 days'  // token到期时间设置 1000, '2 days', '10h', '7d'
            });
            const newUser = new this.mongoDB.models.Users({
                basic: {
                    nickname: req.body.nickname
                },
                domain: req.body.domain,
                username: req.body.username,
                password: req.body.password,
                role: 'master',
                status: 1,
                pgone: req.body.username,
                token: token
            });
            // 保存用户账号
            newUser.save((err, users: UserModel) => {
                if (err) {
                    return next(err);
                }
                res.json({
                    'meta': {
                        'code': 200,
                        'message': '成功创建新用户!'
                    },
                    'data': {
                        token,
                        'user': {
                            'nickname': users.basic.nickname,
                            'avatar': users.basic.avatar,
                            'phone': user.phone,
                            'domain': user.domain,
                            'state': user.state,
                            '_id': users._id
                        }
                    }
                });
            });
        }
        catch (ex) {
            console.log(ex, req);
            return next(ex);
        }

    }


    /**
     * GET /logout
     * 退出
     */
    async logout(req: Request, res: Response, next: NextFunction) {
        try {
            if ((req as any).isAuthenticated()) {
                // console.log('req', (req as any).user)
                this.mongoDB.models.Users.update({ _id: (req as any).user._id }, { token: undefined })
                    .exec((err: any, user: UserModel) => {
                        if (err) {
                            return next(err);
                        }
                        if (!user) {
                            res.json({
                                'meta': {
                                    'code': 422,
                                    'message': '用户不存在'
                                }
                            });
                            return;
                        }
                        (req as any).logout();
                        res.json({
                            'meta': {
                                'code': 200,
                                'message': '退出成功'
                            }
                        });
                    });
            } else {
                res.json({
                    'meta': {
                        'code': 423,
                        'message': '无权限'
                    }
                });
                return;
            }
        } catch (ex) {
            return next(ex);
        }

    }

    /**
    * GET /checkIn
    * 退出
    */
    async checkIn(req: Request, res: Response, next: NextFunction) {
        if ((req as any).isAuthenticated()) {
            this.mongoDB.models.Users.update({ _id: (req as any).user._id }, { state: 'waiting' })
                .exec((err: any, user: UserModel) => {
                    if (err) {
                        return next(err);
                    }
                    if (!user) {
                        res.json({
                            'meta': {
                                'code': 422,
                                'message': '用户不存在'
                            }
                        });
                        return;
                    }
                    (req as any).logout();
                    res.json({
                        'meta': {
                            'code': 200,
                            'message': '签入成功'
                        }
                    });
                });
        }
    }

    /**
     * GET /user/list
     * 获取租户用户列表
     * req.params req.query req.headers req.body
     */

    async list(req: Request, res: Response, next: NextFunction) {
        try {
            const { tenantId } = req.params
            this.logger.debug(`获取租户${tenantId}的用户列表!`, req.body);
            req.checkBody({
                'page': {
                    notEmpty: true,
                    errorMessage: '指定页数不能为空'
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



            let query = {
                domain: tenantId,
                status: { $ne: '0' }
            }
            if (req.body.query) {
                const reg = new RegExp(req.body.query);
                query = Object.assign({}, query, {
                    $or: [
                        { username: { $regex: reg } },
                        { phone: { $regex: reg } },
                        { 'basic.nickname': { $regex: reg } },
                    ]
                })
            }
            const sort = {
                'basic.nickname': 1,
                'username': 1
            }
            if (req.body.order) {
                sort['basic.nickname'] = req.body.order.nickname ? req.body.order.nickname : 1;
                sort['username'] = req.body.order.username ? req.body.order.username : 1;
            }

            const total = await this.mongoDB.models.Users.count(query);

            const users: any = await this.mongoDB.models.Users.find(
                query,
                {
                    password: 0,
                    auths: 0,
                    tokens: 0,
                    token: 0
                },
                {
                    limit: req.body.pageSize,
                    skip: (+req.body.page - 1) * req.body.pageSize,
                    sort: sort
                }
            );

            res.json({
                'meta': {
                    'code': 200,
                    'message': '获取用户列表成功'
                },
                'data': {
                    total,
                    users
                }
            });
        } catch (ex) {
            this.logger.error('测试日志打印user list error', ex);
            res.json({
                'meta': {
                    'code': 433,
                    'message': ex
                }
            });
        }
    }

    async add(req: Request, res: Response, next: NextFunction) {
        try {
            req.checkBody({
                'nickname': {
                    notEmpty: true,
                    isLength: {
                        options: [{ min: 2, max: 12 }],
                        errorMessage: '称呼长度不是2-12位' // Error message for the validator, takes precedent over parameter message
                    },
                    errorMessage: '称呼不能为空'
                },
                // 'domain': {
                //     notEmpty: true,
                //     isLength: {
                //         options: [{ min: 4, max: 12 }],
                //         errorMessage: '企业域长度不是4-12位' // Error message for the validator, takes precedent over parameter message
                //     },
                //     errorMessage: '企业域不能为空'
                // },
                'username': {
                    notEmpty: true,
                    matches: {
                        options: /^[a-zA-Z0-9_-]{4,16}$/,
                        errorMessage: '用户名不是合法' // Error message for the validator, takes precedent over parameter message
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

            const { tenantId } = req.params
            const token = jwt.sign({ username: req.body.username.username }, `kefu2018@${tenantId}`, {
                expiresIn: '1 days'  // token到期时间设置 1000, '2 days', '10h', '7d'
            });
            const newUser = new this.mongoDB.models.Users({
                basic: {
                    nickname: req.body.nickname
                },
                domain: tenantId,
                username: req.body.username,
                password: req.body.password,
                role: req.body.role,
                extension: req.body.extension,
                memo: req.body.memo,
                status: 1,
                phone: req.body.phone,
                token: token
            });
            // 保存用户账号
            newUser.save((err, user: UserModel) => {
                if (err) {
                    return next(err);
                }
                res.json({
                    'meta': {
                        'code': 200,
                        'message': '成功创建新用户!'
                    },
                    'data': {
                        token,
                        'user': {
                            'nickname': user.basic.nickname,
                            'avatar': user.basic.avatar,
                            'phone': user.phone,
                            'domain': user.domain,
                            'state': user.state,
                            '_id': user._id
                        }
                    }
                });
            });
        }
        catch (ex) {
            console.log(ex, req);
            return next(ex);
        }
    }

    async del(req: Request, res: Response, next: NextFunction) {
        try {
            const opUser = (req as any).user;
            if ((req as any).isAuthenticated() && opUser.role === 'master') {
                req.checkBody({
                    'id': {
                        notEmpty: true,
                        errorMessage: '用户ID不能为空'
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

                const { tenantId } = req.params
                if(opUser.domain !== tenantId){
                    res.json({
                        'meta': {
                            'code': 424,
                            'message': '操作不被允许'
                        }
                    });
                    return;
                }

                // 保存用户账号
                await this.mongoDB.models.Users.update({ domain: tenantId, _id: req.body.id }, { $set: { status: '0' } });
                res.json({
                    'meta': {
                        'code': 200,
                        'message': '成功删除用户!'
                    },
                    'data': {
                    }
                });
            }
            else {
                res.json({
                    'meta': {
                        'code': 423,
                        'message': '无操作权限'
                    }
                });
                return;
            }
        }
        catch (ex) {
            console.log(ex, req);
            return next(ex);
        }
    }

    async reset(req: Request, res: Response, next: NextFunction) {
        try {
            req.checkBody({
                'id': {
                    notEmpty: true,
                    errorMessage: '用户ID不能为空'
                },
                'password': {
                    notEmpty: true, // won't validate if field is empty
                    isLength: {
                        options: [{ min: 6, max: 18 }],
                        errorMessage: '密码长度不是6-18位' // Error message for the validator, takes precedent over parameter message
                    },
                    errorMessage: '密码不能为空' // Error message for the parameter
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

            const { tenantId } = req.params

            // 保存用户账号
            await this.mongoDB.models.Users.update({ domain: tenantId, _id: req.body.id }, { $set: { password: req.body.password } });
            res.json({
                'meta': {
                    'code': 200,
                    'message': '密码重置成功!'
                },
                'data': {
                }
            });
        }
        catch (ex) {
            console.log(ex, req);
            return next(ex);
        }
    }

    /**
     * GET /user/:id
     * 获取一个
     */
    async home(req: Request, res: Response, next: NextFunction) {
        const userinfo = (req as any).userinfo;
        const article_count = await this.articleController.count({ author: userinfo._id });
        res.json({
            'meta': {
                'code': 200,
                'message': '查询成功'
            },
            'data': {
                'nickname': userinfo.basic.nickname,
                'avatar': userinfo.basic.avatar,
                'slug': userinfo._id,
                'author': userinfo.author,
                'intro': userinfo.profile.intro,
                'gender': userinfo.profile.gender,
                article_count,
                'total_wordage': 100,   // 总字数
                'followers_count': 200,    // 粉丝数
                'total_likes_count': 100,  // 收获喜欢
                'following_count': 50  // 关注数
            }
        });
    }

    /**
     * 获取查询id
     * @param {e.Request} req
     * @param {Response} res
     * @param {e.NextFunction} next
     * @param {e.String} id
     * @returns {Promise<void>}
     */
    async byId(req: Request, res: Response, next: NextFunction, id: string) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.json({
                'meta': {
                    'code': 400,
                    'message': '用户id不对'
                }
            });
        }
        try {
            const userinfo = await this.mongoDB.models.Users.findOne({ _id: id, status: 1 });
            if (!userinfo) {
                return res.json({
                    'meta': {
                        'code': 404,
                        'message': '有找到指定用户'
                    }
                });
            }
            (req as any).userinfo = userinfo;
            next();
        } catch (err) {
            return next(err);
        }
    }

}

/**
 * 导出模块
 */
//export default new UserController();
