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
import { default as userSchema, UserModel } from '../models/user';
import { default as tenantSchema, TenantModel } from '../models/tenants';
import { default as roomSchema, RoomModel } from '../models/rooms';
import { default as messageSchema, MessageModel } from '../models/messages';
import { default as pbxRouterSchema, PBXRouterModel } from '../models/pbx_routers';
import { default as pbxCallProcessSchema, PBXCallProcessModel } from '../models/pbx_callProcess';
import { default as pbxCDRSchema, PBXCDRModel } from '../models/pbx_cdr';
import { default as pbxAgentSchema, PBXAgentModel } from '../models/pbx_agents';
import { default as pbxAgentStatisticSchema, PBXAgentStatisticsModel } from '../models/pbx_agentStatistics';
import { default as pbxBlackListSchema, PBXBlackListModel } from '../models/pbx_blacklist';
import { default as pbxConferenceSchema, PBXConferenceModel } from '../models/pbx_conferences';
import { default as pbxExtensionSchema, PBXExtensionModel } from '../models/pbx_extensions';
import { default as pbxFSHostSchema, PBXFSHostModel } from '../models/pbx_fsHosts';
import { default as pbxIvrActionSchema, PBXIVRActionsModel } from '../models/pbx_ivrActions';
import { default as pbxIvrInputSchema, PBXIVRInputModel } from '../models/pbx_ivrInputs';
import { default as pbxIvrMenmuSchema, PBXIVRMenmuModel } from '../models/pbx_ivrMenmus';
import { default as pbxLastServiceSchema, PBXLastServiceModel } from '../models/pbx_lastService';
import { default as pbxLocalNumberSchema, PBXLocalNumberModel } from '../models/pbx_localNumbers';
import { default as pbxQueueMemberSchema, PBXQueueMemberModel } from '../models/pbx_queueMembers';
import { default as pbxQueueSchema, PBXQueueModel } from '../models/pbx_queues';
import { default as pbxQueueStatisticSchema, PBXQueueStatisticsModel } from '../models/pbx_queueStatistics';
import { default as pbxRecordFileSchema, PBXRecordFileModel } from '../models/pbx_recordFiles';
import { default as pbxSoundSchema, PBXSoundModel } from '../models/pbx_sounds';
import { default as pbxTrunkSchema, PBXTrunkModel } from '../models/pbx_trunks';


import { default as customerSchema, CustomerModel } from '../models/customers';
import { default as orderTypeSchema, OrderTypeModel } from '../models/order_types';
import { default as orderStateSchema, OrderStateModel } from '../models/order_states';
import { default as orderPriortySchema, OrderPriortyModel } from '../models/order_priorities';
import { default as orderFlowSchema, OrderFlowModel } from '../models/order_flows';
import { default as orderSchema, OrderModel } from '../models/orders';
import { default as groupSchema, GroupModel } from '../models/groups';
import { default as userEventSchema, UserEventModel } from '../models/userEvent';
interface IModels {
    Articles?: mongoose.Model<mongoose.Document>;
    Books?: mongoose.Model<mongoose.Document>;
    Comments?: mongoose.Model<mongoose.Document>;
    Corpus?: mongoose.Model<mongoose.Document>;
    Templates?: mongoose.Model<mongoose.Document>;
    Users?: mongoose.Model<UserModel>;
    Groups?: mongoose.Model<GroupModel>
    Tenants?: mongoose.Model<TenantModel>;
    Rooms?: mongoose.Model<RoomModel>;
    Messages?: mongoose.Model<MessageModel>;

    //--------华丽的分隔符--PBX香瓜model定义--------

    PBXRouters?: mongoose.Model<PBXRouterModel>;
    PBXCallProcess?: mongoose.Model<PBXCallProcessModel>;
    PBXCDR?: mongoose.Model<PBXCDRModel>;
    PBXAgent?: mongoose.Model<PBXAgentModel>;
    PBXAgentStatistic?: mongoose.Model<PBXAgentStatisticsModel>;
    PBXBlackList?: mongoose.Model<PBXBlackListModel>;
    PBXConference?: mongoose.Model<PBXCallProcessModel>;
    PBXExtension?: mongoose.Model<PBXExtensionModel>;
    PBXFSHost?: mongoose.Model<PBXFSHostModel>;
    PBXIvrAction?: mongoose.Model<PBXIVRActionsModel>;
    PBXIvrMenmu?: mongoose.Model<PBXIVRMenmuModel>;
    PBXIvrInput?: mongoose.Model<PBXIVRInputModel>;
    PBXLastService?: mongoose.Model<PBXLastServiceModel>;
    PBXLocalNumber?: mongoose.Model<PBXLocalNumberModel>;
    PBXQueueMember?: mongoose.Model<PBXQueueMemberModel>;
    PBXQueue?: mongoose.Model<PBXQueueModel>;
    PBXQueueStatistic?: mongoose.Model<PBXQueueStatisticsModel>;
    PBXRecordFile?: mongoose.Model<PBXRecordFileModel>;
    PBXSound?: mongoose.Model<PBXSoundModel>;
    PBXTrunk?: mongoose.Model<PBXTrunkModel>;

    // ----客户相关
    Customer?: mongoose.Model<CustomerModel>;

    // ---- 工单相关
    OrderType?: mongoose.Model<OrderTypeModel>;
    OrderFlow?: mongoose.Model<OrderFlowModel>;
    OrderState?: mongoose.Model<OrderStateModel>;
    OrderPriorty?: mongoose.Model<OrderPriortyModel>;
    Order?: mongoose.Model<OrderModel>;
    UserEvent?: mongoose.Model<UserEventModel>;
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
            this.models.Groups = this.conn.model('Groups', groupSchema);
            //TODO 测试情况下用pbx_tenants
            this.models.Tenants = this.conn.model('pbx_Tenants', tenantSchema);
            this.models.Messages = this.conn.model('pbx_Messages', messageSchema);
            // PBX相关表
            this.models.PBXRouters = this.conn.model('PBX_Routers', pbxRouterSchema);
            this.models.PBXCallProcess = this.conn.model('PBX_CallProcess', pbxCallProcessSchema);
            this.models.PBXAgent = this.conn.model('PBX_Agents', pbxAgentSchema);
            this.models.PBXAgentStatistic = this.conn.model('pbx_AgentStatistics', pbxAgentStatisticSchema);
            this.models.PBXBlackList = this.conn.model('PBX_Blacklist', pbxBlackListSchema);
            this.models.PBXCDR = this.conn.model('PBX_cdrs', pbxCDRSchema);
            this.models.PBXConference = this.conn.model('pbx_conferences', pbxConferenceSchema);
            this.models.PBXExtension = this.conn.model('PBX_extensions', pbxExtensionSchema);

            this.models.PBXFSHost = this.conn.model('PBX_fshosts', pbxFSHostSchema);
            this.models.PBXIvrAction = this.conn.model('PBX_ivractions', pbxIvrActionSchema);
            this.models.PBXIvrInput = this.conn.model('PBX_ivrinputs', pbxIvrInputSchema);
            this.models.PBXIvrMenmu = this.conn.model('PBX_ivrmenus', pbxIvrMenmuSchema);
            this.models.PBXLastService = this.conn.model('PBX_lastservices', pbxLastServiceSchema);
            this.models.PBXLocalNumber = this.conn.model('PBX_localnumbers', pbxLocalNumberSchema);
            this.models.PBXQueue = this.conn.model('PBX_queues', pbxQueueSchema);
            this.models.PBXQueueMember = this.conn.model('PBX_queuemembers', pbxQueueMemberSchema);
            this.models.PBXQueueStatistic = this.conn.model('PBX_queuestatustics', pbxQueueStatisticSchema);
            this.models.PBXRecordFile = this.conn.model('PBX_recordfiles', pbxRecordFileSchema);
            this.models.PBXSound = this.conn.model('PBX_sounds', pbxSoundSchema);
            this.models.PBXTrunk = this.conn.model('PBX_trunks', pbxTrunkSchema);

            // order工单相关
            this.models.OrderType = this.conn.model('OrderTypes', orderTypeSchema);
            this.models.OrderFlow = this.conn.model('OrderFlows', orderFlowSchema);
            this.models.OrderPriorty = this.conn.model('OrderPriorties', orderPriortySchema);
            this.models.OrderState = this.conn.model('OrderStates', orderStateSchema);
            this.models.Order = this.conn.model('Orders', orderSchema);
            this.models.Customer = this.conn.model('Customers',customerSchema);
            this.models.UserEvent = this.conn.model('UserEvent', userEventSchema);
        }
        catch (ex) {
            return Promise.reject(ex);
        }
    }
}