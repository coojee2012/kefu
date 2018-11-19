import * as mongoose from 'mongoose';
const Schema = mongoose.Schema;

export type OrderPriortyModel = mongoose.Document & {
    tenantId: string;
    title: string; // 类型名称
    enabled: boolean; // 是否启用
    priorty: number;// 优先级，值越大优先级越高
    createdAt: Date;   // 创建时间
    updatedAt: Date;   // 更新时间

}

const orderPriortySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    tenantId: {
        type: String,
        required: true
    },
    priorty: {
        type: Number,
        required: true,
        default: () => 1
    },
    enabled: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });
orderPriortySchema.index({ tenantId: 1, title: 1 }, { unique: true });
export default orderPriortySchema;