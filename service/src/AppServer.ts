
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
import { Injector, ReflectiveInjector,Injectable } from 'injection-js';
import { HeroService } from './service/HeroService';
import { LoggerService } from './service/LogService';
import { DeepStreamService } from './service/DeepStreamService';
import { default as passport } from './config/passport';
/**
 * 引入配置
 */
import { ConfigService } from './service/ConfigService';
import { MongoService  } from './service/MongoService';
/**
 * 全部路由
 */
// import { default as routes } from './routes/index';
import { RoutesService }  from './routes/RoutesService';
import { setInterval } from 'timers';
//import { Promise } from 'mongoose';

@Injectable()
export class AppServer {
    public app: express.Application;
    constructor(private injector: Injector, private logger: LoggerService,
        private routeService: RoutesService,private dsClient: DeepStreamService,private config: ConfigService,
        private mongoDB: MongoService
    ) {
      this.app = express();
      //this.logger = injector.get(LoggerService);
      //this.dsClient = injector.get(DeepStreamService);
      // this.routeService = new RoutesService(injector);
    }

    /**
    * 连接mongo数据库
    */
    async readyMongoDB() {
        const _this = this;
        try {
           await this.mongoDB.connectDB();
        }
        catch (ex) {
            return Promise.reject(ex);
        }
    }

    readyExpress() {
        const apiConfig = this.config.getConfig().api;
        /**
         * 设置静态资源路径，web ,app ,admin
         */
        this.app.use(express.static(path.join(__dirname, '../public')));
        // app.use('/web', express.static('public/web'));
        // app.use('/app', express.static('public/app'));
        // app.use('/admin', express.static('public/admin'));


        /**
         * 设置模板
         */
        this.app.set('views', path.join(__dirname, '../views')); // 放模板文件的目录
        this.app.engine('.html', require('ejs').__express);
        this.app.set('view engine', 'html');
        this.app.use(expressLayouts);
        // 初始化passport模块


        this.app.use(passport.initialize());

        /**
         * 设置解析数据中间件，默认json传输
         */
        this.app.use(bodyParser.urlencoded({ extended: false }));
        this.app.use(bodyParser.json());
        this.app.use(cookieParser());
        this.app.use(expressValidator({
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
        this.routeService.setRoute(this.app);

        /**
         * 成功日志
         */
        this.app.use(expressWinston.logger({
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
        this.app.use(expressWinston.errorLogger({
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
        this.app.use(function (req, res, next) {
            const err: any = new Error('Not Found');
            err.status = 404;
            next(err);
        });

        this.app.listen(apiConfig.port, () => this.logger.debug('Express server listening on port ' + apiConfig.port));
    }

    async run() {
        const _this = this;
        try {
            await this.readyMongoDB();
            this.readyExpress();
            // await new Promise((resole,reject) => {
            //     let count = 0;

            //     setInterval(()=>{
            //         count++;
            //         _this.logger.debug('FFFFFFF');
            //         _this.dsClient.eventPub('room/username',`shuju:${new Date()}`);
            //     },1000)

            // })
            return Promise.resolve();
        }
        catch (ex) {
            return Promise.reject(ex);
        }
    }

}
