import * as mongoose from 'mongoose';
const Schema = mongoose.Schema;

export type GroupModel = mongoose.Document & {
    tenantId: string;
    groupName: string; // 类型名称
    users:any;
    enabled: boolean; // 是否启用
    createdAt: Date;   // 创建时间
    updatedAt: Date;   // 更新时间
  
}

const groupSchema = new mongoose.Schema({
    groupName: {
        type: String,
        required: true
    },
    tenantId: {
        type: String,
        required: true
    },
    users: [{
        type: Schema.Types.ObjectId,    // 引用类型
        ref: 'Users'                     // 关联用户表
    }], // 相关受理备注
    enabled: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });
groupSchema.index({ tenantId: 1, groupName: 1 }, { unique: true });
export default groupSchema;