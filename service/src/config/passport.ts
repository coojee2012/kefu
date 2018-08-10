/**
 * Created by jiayi on 2017/6/20.
 */
import * as passport from 'passport';
import * as jwt from 'jsonwebtoken';
import * as passportBearer from 'passport-http-bearer';
import { Injectable, Injector } from 'injection-js';
import { MongoService } from '../service/MongoService';
const Strategy = passportBearer.Strategy;


@Injectable()
export class Passport {
    constructor(private mongoServer: MongoService) {
        this.init();
    }


    strategy(token, done) {
        const self = this;
        jwt.verify(token, 'kefu2018@abcf', (err, decoded) => {
            if (!decoded) {
                return done(null, false);
            }
            self.mongoServer.models.Users.findOne({
                username: decoded.username,
                token: token
            }).exec((error, user: any) => {
                if (error) {
                    return done(error);
                }
                if (!user) {
                    return done(null, false, { message: '账号和密码不存在' });
                }
                return done(null, user);
            });
        });
    }
    init() {
        passport.use('user', new Strategy(this.strategy.bind(this)));

        /**
         * 注册后台管理 管理员权限
         */
        /*import {Admin} from './models/Admin';
        passport.use('admin', new Strategy(function(token, done) {
            Admin.findOne({
                token: token
                }, function(err, user) {
                    if (err) {
                        return done(err);
                    }
                    if (!user) {
                        return done(null, false);
                    }
                    return done(null, user);
                });
            }
        ));*/
    }
    getPassport() {
        return passport;
    }
}

