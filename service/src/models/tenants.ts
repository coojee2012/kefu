/**
 * @description 租户表
 */
import * as mongoose from 'mongoose';
/**
 * 定义接口
 */
export type TenantModel = mongoose.Document & { 
    _id: String;
    tenantId: String;
    companyName: string;  // 租户公司名称
    companyAddr: string;  // 租户公司名称
    createdAt: Date;   // 创建时间
    updatedAt: Date;   // 更新时间
    location: String; // 区域
    balance: Number; // 账户余额
    consume: Number;  // 消费总额
    dids: string[];  // 呼叫中心电话号码
    telephones:string[]; // 公司联系电话
    webchatOpts: {        // 个人资料

    };
    callCenterOpts: {   // 基本设置
        status: String;   // 昵称
        billingType: String;    // 头像
        rating: String;    // 阅读语言
        recordCall: Boolean;   // 简信接收设置
        satisfactionMode: String;    // 提醒邮件通知
    };

};

const tenantSchema = new mongoose.Schema({
    tenantId: {
        type: String,
        unique: true,
        required: true
    },
    companyName: {
        type: String,
        required: true,
        default: ''
    },
    companyAddr: {
        type: String,
        required: true,
        default: ''
    },
    dids:{
        type: Array,
        required: true
    },
    balance: {
        type: Number,
        default: 0.00
    }, //当前余额
    consume: {
        type: Number,
        default: 0.00
    }, //总消费额
    webchatOpts: {

    },//web聊天配置
    callCenterOpts: {
        status: {
            type: String,
            default: () => 'pending'
        },//电话状态,[开通,待开通,待审核等]   opened opening pending
        billingType: {
            type: String,
            default: '*prepaid'
        },//*prepaid,*postpaid
        rating: {
            type: Object,
            default: {
                call_in: 'RP_DF',
                call_out: 'RP_DF',
                call_internal: 'RP_FREE'
            }
        },
        recordCall: {  //是否存录音
            type: Boolean,
            default: true
        },
        afterCallState: {  //分机通话结束后置于什么状态
            type: String,
            enum: {
                values: 'waiting,busy,idle'.split(','),
                message: ''
            },
            default: () => 'idle'
        },
        satisfactionMode: {
            type: String,
            enum: {
                values: 'auto,manual,off'.split(','),
                message: ''
            },
            default: () => 'auto'
        },
    },//呼叫中心配置
    location: {
        type: String,
        default: 'zh'
    },//国家或地区[zh,tw,hk等]
    isDeleted: {  //软删除
        type: Boolean,
        default: false
    }
}, { timestamps: true })