/**
 * Created by jiayi on 2017/6/20.
 */
import * as passport from 'passport';
import * as jwt from 'jsonwebtoken';
import * as passportBearer from 'passport-http-bearer';
import * as passportHttp from 'passport-http';
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
            if (err) {
                console.log('error', token, err);
                return done(err);
            }
            else if (!decoded) {
                console.log('decoded is undefind', token, err);
                return done(null, false);
            } else {
                console.log('jwt decoded strategy:', decoded);
                self.mongoServer.models.Users.findOne({
                    username: decoded.username,
                    token: token
                }).exec((error, user: any) => {
                    if (error) {
                        console.log('jwt decoded strategy exec error:', error);
                        return done(error);
                    }
                    else if (!user) {
                        console.log('jwt decoded strategy exec dont  find user :', token);
                        return done(null, false);
                    }
                    else { return done(null, user); }
                });
            }

        });
    }

    strategyApiKey(apikey, done) {
        const self = this;
        jwt.verify(apikey, 'kefu2018@abcf', (err, decoded) => {
            if (err) {
                console.log('strategyApiKey error', err);
                return done(err);
            }
            else if (!decoded) {
                return done(null, false);
            }
            else {
                console.log('jwt decoded strategyApiKey:', decoded);
                self.mongoServer.models.Tenants.findOne({
                    tenantId: decoded.tenantId,
                    apikey: apikey
                }).exec((error, tenant: any) => {
                    if (error) {
                        return done(error);
                    }
                    else if (!tenant) {
                        return done(null, false);
                    }
                    else {
                        return done(null, tenant);
                    }

                });
            }
        });
    }

    init() {
        passport.use('user', new Strategy(this.strategy.bind(this)));
        passport.use('apikey', new Strategy(this.strategyApiKey.bind(this)));
        passport.use(new passportHttp.BasicStrategy(
            (username, password, done) => {
                if (username === 'freeswitch' && password == 'kf2018@liny') {
                    return done(null, true);
                } else {
                    return done(null, false);
                }
            }
        ));
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

