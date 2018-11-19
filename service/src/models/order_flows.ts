import * as mongoose from 'mongoose';
const Schema = mongoose.Schema;

export type OrderFlowModel = mongoose.Document & {
    tenantId: string;
    orderId: any; // 工单ID
    assigner: any; // 指派人
    acceptGroup:any; // 受理组
    receiver: any; // 相关受理人员
    comments: string; // 相关受理备注
    createdAt: Date;   // 创建时间
    updatedAt: Date;   // 更新时间
  
}

const orderFlowSchema = new mongoose.Schema({
    orderId: {
        type: Schema.Types.ObjectId,    // 引用类型
        ref: 'Orders'                     // 关联用户表
    },
    tenantId: {
        type: String,
        required: true
    },
    assigner: {
        type: Schema.Types.ObjectId,    // 引用类型
        ref: 'Users'                     // 关联用户表
    },
    receiver: {
        type: Schema.Types.ObjectId,    // 引用类型
        ref: 'Users'                     // 关联用户表
    },
    acceptGroup: {
        type: Schema.Types.ObjectId,    // 引用类型
        ref: 'Users'                     // 关联用户表
    },
    comments: {
        type: String,
        default: ''
    },
}, { timestamps: true });

export default orderFlowSchema;