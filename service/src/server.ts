
/**
 * @description 服务的类
 */

/**
 * 引入依赖模块
 */
import * as express from 'express';
// import * as glob from 'glob';
import * as mongoose from 'mongoose';
import * as bodyParser from 'body-parser';
// import * as logger from 'logger';
// import * as favicon from 'favicon';
// import * as methodOverride from 'method-override';
import * as cookieParser from 'cookie-parser';
import expressValidator = require('express-validator');
import * as winston from 'winston';
import * as expressWinston from 'express-winston';
import expressLayouts = require('express-ejs-layouts');
import path = require('path');
import { Injector, ReflectiveInjector } from 'injection-js';
import { HeroService } from './service/HeroService';
import { LoggerService } from './service/LogService';
import { default as passport } from './config/passport';
/**
 * 引入配置
 */
import config = require('./config/config');
/**
 * 全部路由
 */
// import { default as routes } from './routes/index';
 import { RoutesService }  from './routes/RoutesService';

export class AppServer {
    private logger: LoggerService;
    private routeService: RoutesService;
    constructor(private injector: Injector) {
      this.logger = injector.get(LoggerService);
      this.routeService = new RoutesService(injector);
   //console.log('dddd',this.injector);
    }

    /**
    * 连接mongo数据库
    */
    async readyMongoDB() {
        try {
            mongoose.Promise = global.Promise;
            mongoose.connect(config.mongoUris, config.mongoOpts);
            //
            // const db = mongoose.createConnection(config.mongoUris, config.mongoOpts);
            const db = mongoose.connection;
            db.on('error', function () {
                throw new Error('unable to connect to database at ' + config.dbs);
            });
            db.once('open', function () {
                console.log('数据库启动了');
                return Promise.resolve();
            });
        }
        catch (ex) {
            return Promise.reject(ex);
        }
    }

    readyExpress() {
        /**
         * 引入express配置
         */
        const app = express();
        /**
         * 设置静态资源路径，web ,app ,admin
         */
        app.use(express.static(path.join(__dirname, '../public')));
        // app.use('/web', express.static('public/web'));
        // app.use('/app', express.static('public/app'));
        // app.use('/admin', express.static('public/admin'));


        /**
         * 设置模板
         */
        app.set('views', path.join(__dirname, '../views')); // 放模板文件的目录
        app.engine('.html', require('ejs').__express);
        app.set('view engine', 'html');
        app.use(expressLayouts);
        // 初始化passport模块


        app.use(passport.initialize());

        /**
         * 设置解析数据中间件，默认json传输
         */
        app.use(bodyParser.urlencoded({ extended: false }));
        app.use(bodyParser.json());
        app.use(cookieParser());
        app.use(expressValidator({
            errorFormatter: function (param, msg, value) {
                const namespace = param.split('.');
                let formParam = namespace.shift();

                while (namespace.length) {
                    formParam += '[' + namespace.shift() + ']';
                }
                return {
                    param: formParam,
                    msg: msg,
                    value: value
                };
            },
            customValidators: {
                isArray: function (value) {
                    return Array.isArray(value);
                },
                gte: function (param, num) {
                    return param >= num;
                }
            }
        }));
        /**
         * 路由挂载到app上
         */
        //routes(app);
        this.routeService.setRoute(app);

        /**
         * 成功日志
         */
        app.use(expressWinston.logger({
            transports: [
                new (winston.transports.Console)({
                    json: true,
                    colorize: true
                }),
                new winston.transports.File({
                    filename: 'logs/success.log'
                })
            ]
        }));

        /**
         * 错误日志
         */
        app.use(expressWinston.errorLogger({
            transports: [
                new winston.transports.Console({
                    json: true,
                    colorize: true
                }),
                new winston.transports.File({
                    filename: 'logs/error.log'
                })
            ]
        }));


        // catch 404 and forward to error handler
        app.use(function (req, res, next) {
            const err: any = new Error('Not Found');
            err.status = 404;
            next(err);
        });

        app.listen(config.port, () => console.log('Express server listening on port ' + config.port));
    }

    async run() {
        try {
            await this.readyMongoDB();
            this.readyExpress();
            return Promise.resolve();
        }
        catch (ex) {
            return Promise.reject(ex);
        }
    }

}
