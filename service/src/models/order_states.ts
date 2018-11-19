import * as mongoose from 'mongoose';
const Schema = mongoose.Schema;

export type OrderStateModel = mongoose.Document & {
    tenantId: string;
    title: string; // 类型名称
    enabled: boolean; // 是否启用
    sequence:number; // 处理状态的顺序，从小大排序 
    createdAt: Date;   // 创建时间
    updatedAt: Date;   // 更新时间
  
}

const orderStateSchema = new mongoose.Schema({
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
    },
    sequence: {
        type: Number,
        default: 1
    }
}, { timestamps: true });
orderStateSchema.index({ tenantId: 1, title: 1 }, { unique: true });
export default orderStateSchema;