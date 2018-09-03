import * as mongoose from 'mongoose';
const Schema = mongoose.Schema;

export type OrderModel = mongoose.Document & {
    tenantId: string;
    subject: string; // 工单主题
    orderType: any; // 工单类型
    priority: any; // 优先级
    state: any; // 处理状态 
    customer:any;
    content: string; // 工单内容
    flows: any[]; // 相关受理备注
    createBy: any; //创建坐席
    closed: boolean; //  是否已经关闭
    closeBy?: any;
    closeMemo?: string;
    createdAt: Date;   // 创建时间
    updatedAt: Date;   // 更新时间

}

const orderSchema = new mongoose.Schema({
    subject: {
        type: String,
        required: true
    },
    tenantId: {
        type: String,
        required: true
    },
    customer: {
        type: Schema.Types.ObjectId,    // 引用类型
        ref: 'Customers',                     // 关联客户表
        required: true
    },
    orderType: {
        type: Schema.Types.ObjectId,    // 引用类型
        ref: 'OrderTypes'                     // 关联用户表
    },
    priority: {
        type: Schema.Types.ObjectId,    // 引用类型
        ref: 'OrderPriorities'                     // 关联用户表
    },
    state: {
        type: Schema.Types.ObjectId,    // 引用类型
        ref: 'OderStates'                     // 关联用户表
    },
    flows: [{
        type: Schema.Types.ObjectId,    // 引用类型
        ref: 'OrderFlows',                     // 关联用户表
    }], // 相关受理备注
    content: {
        type: String,
        default: ''
    },
    closed: {
        type: Boolean,
        default: false
    },
    createBy:
    {
        type: Schema.Types.ObjectId,    // 引用类型
        ref: 'Users'                     // 关联用户表
    },
    closeBy:
    {
        type: Schema.Types.ObjectId,    // 引用类型
        ref: 'Users'                     // 关联用户表
    },
    closeMemo: { // 工单关闭的原因
        type: String,
        default: ''
    },
}, { timestamps: true });

export default orderSchema;