import * as mongoose from 'mongoose';
const Schema = mongoose.Schema;

export type OrderTypeModel = mongoose.Document & {
    tenantId: string;
    title: string; // 类型名称
    enabled: boolean; // 是否启用
    createdAt: Date;   // 创建时间
    updatedAt: Date;   // 更新时间
  
}

const orderTypeSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    tenantId: {
        type: String,
        required: true
    },
    enabled: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });
orderTypeSchema.index({ tenantId: 1, title: 1 }, { unique: true });
export default orderTypeSchema;