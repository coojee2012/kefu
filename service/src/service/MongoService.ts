import { Injectable, Injector } from 'injection-js';
//import * as mongoose from 'mongoose';
import mongoose = require('mongoose');
// import  { deepstreamQuarantine  } from 'deepstream.io-client-js';
import { LoggerService } from './LogService';
import { ConfigService } from './ConfigService';

import articleSchema from '../models/article';
import booksSchema from '../models/books';
import commentsSchema from '../models/comments';
import corpusSchema from '../models/corpus';
import templateSchema from '../models/template';
import userSchema from '../models/user';
import tenantSchema from '../models/tenants';
import { default as roomSchema,RoomModel } from '../models/rooms';
import messageSchema from '../models/messages';
import {default as routerSchema , RouterModel} from '../models/pbx_routers';
import {default as callProcessSchema , CallProcessModel} from '../models/pbx_callProcess';
import { resolve } from 'q';
import { reject } from 'bluebird';

interface IModels {
    Articles?: mongoose.Model<mongoose.Document>;
    Books?: mongoose.Model<mongoose.Document>;
    Comments?: mongoose.Model<mongoose.Document>;
    Corpus?: mongoose.Model<mongoose.Document>;
    Templates?: mongoose.Model<mongoose.Document>;
    Users?: mongoose.Model<mongoose.Document>;
    Tenants?: mongoose.Model<mongoose.Document>;
    Rooms?: mongoose.Model<mongoose.Document>;
    Messages?: mongoose.Model<mongoose.Document>;
    PBXRouters?: mongoose.Model<RouterModel>;
    PBXCallProcess?:mongoose.Model<CallProcessModel>;
}
@Injectable()
export class MongoService {
    public models: IModels;
    private conn: mongoose.Connection;
    constructor(private logger: LoggerService, private config: ConfigService) {
        this.models = {};
        //this.connectDB();
    }

    onConnectionError(err) {
        this.logger.error('MongoError', err)
    }

    async connectDB() {
        try {
            const mongoConfig = this.config.getConfig().mongo;
            mongoose.Promise = Promise;
            this.logger.debug('数据库[MongoDB]连接信息：', mongoConfig.uris, mongoConfig.opts);
            // await new Promise((resolve,reject)=>{
            //     this.conn = mongoose.createConnection(mongoConfig.uris, mongoConfig.opts)
            //     this.conn.on('error',(err)=>{
            //         reject(err);
            //     });
            //     this.conn.once('connected', () => {
            //         this.logger.info('数据库[MongoDB]启动了');
            //         resolve();
            //     });
            // })


           

            // await 写法不用去监听事件
            this.conn = await mongoose.createConnection(mongoConfig.uris, mongoConfig.opts);
            this.conn.on('error', (err) => {
                this.onConnectionError.bind(this);
            });
            this.logger.info('数据库[MongoDB]启动了');

            // 另一种连法 this.conn = await mongoose.connect(mongoConfig.uris, mongoConfig.opts);        
            this.models.Articles = this.conn.model('Articles', articleSchema);
            this.models.Books = this.conn.model('Books', booksSchema);
            this.models.Comments = this.conn.model('Comments', commentsSchema);
            this.models.Corpus = this.conn.model('Corpus', corpusSchema);
            this.models.Templates = this.conn.model('Templates', templateSchema);
            this.models.Users = this.conn.model('Users', userSchema);
            this.models.Rooms = this.conn.model('Rooms', roomSchema);
            this.models.Tenants = this.conn.model('Tenants', tenantSchema);
            this.models.Messages = this.conn.model('Messages', messageSchema);
            this.models.PBXRouters = this.conn.model('PBX_Routers', roomSchema);
            this.models.PBXCallProcess = this.conn.model('PBX_CallProcess', callProcessSchema);
        }
        catch (ex) {
            return Promise.reject(ex);
        }
    }
}