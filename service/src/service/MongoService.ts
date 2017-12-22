import { Injectable , Injector } from 'injection-js';
import * as mongoose from 'mongoose';
// import  { deepstreamQuarantine  } from 'deepstream.io-client-js';
import { LoggerService } from './LogService';
import { ConfigService } from './ConfigService';

import  articleSchema   from '../models/article';
import booksSchema from '../models/books';
import commentsSchema from '../models/comments';
import corpusSchema from '../models/corpus';
import templateSchema from '../models/template';
import userSchema from '../models/user';
import tenantSchema from '../models/tenants';
import roomSchema from '../models/rooms';
import messageSchema from '../models/messages';

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
}
@Injectable()
export class MongoService {
    public models:IModels;
    private conn:mongoose.Connection;
    constructor(private logger:LoggerService,private config:ConfigService){
        this.models = {};
        // this.connectDB();
    }

    onConnectionError (err) {
        this.logger.error('MongoError',err)
    }

    async connectDB(){
        try{
            const mongoConfig = this.config.getConfig().mongo;
            mongoose.Promise = Promise;
            this.conn = await mongoose.createConnection(mongoConfig.uris, mongoConfig.opts);
            this.conn.on('error',this.onConnectionError.bind(this));
            this.conn.once('connected', () => {
                this.logger.info('数据库[MongoDB]启动了');
            });
            this.models.Articles = this.conn.model('Articles', articleSchema);
            this.models.Books = this.conn.model('Books', booksSchema);
            this.models.Comments = this.conn.model('Comments', commentsSchema);
            this.models.Corpus = this.conn.model('Corpus', corpusSchema);
            this.models.Templates = this.conn.model('Templates', templateSchema);
            this.models.Users = this.conn.model('Users', userSchema);
            this.models.Rooms = this.conn.model('Rooms', roomSchema);
            this.models.Tenants = this.conn.model('Tenants', tenantSchema);
            this.models.Messages = this.conn.model('Messages', messageSchema);
        }
        catch(ex){
            this.logger.error(ex);
        }       
    }
}