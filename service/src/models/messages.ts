
/**
 * @description 文字聊天的消息内容
 */
import * as mongoose from 'mongoose';
const Schema = mongoose.Schema;
export type MessageModel = mongoose.Document & {
    rid: string;
    tenantId: string;
    msg: string;
    conentType: string;
    msgType: string;
    from:string;
    createdAt: Date;   // 创建时间
}
const messageSchema = new mongoose.Schema({
    rid: {
        type: String,    // 引用类型
        required: true
    },
    msg: {
        type: String,
        default: () => ''
    },
    conentType: {
        type: String,
        enum: ['text', 'picture', 'voice', 'file'],
    },
    msgType: {
        type: String,
        enum: ['livechat', 'system'],
    },
    from: {
        type: String,
        default: () => ''
    },
    tenantId: {
        type: String,
        required: true
    }
}, { timestamps: true });

export default messageSchema;