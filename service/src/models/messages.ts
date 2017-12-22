
/**
 * @description 文字聊天的消息内容
 */
import * as mongoose from 'mongoose';
const Schema = mongoose.Schema;
export type MessageModel = mongoose.Document & {
    rid:String;
    tenantId:String;
    userId:String;
    msg:String;
    createdAt: Date;   // 创建时间
    token:String;
}
const messageSchema = new mongoose.Schema({ 
    rid : {
        type: String,
        unique: true,
        required: true
    }, 
    msg : {
        type: String,
        default: () => ''
    }, 
    userId : {
        type: Schema.Types.ObjectId,    // 引用类型
        ref: 'User'                     // 关联用户表
    }, 
    token : {
        type: String
    },  
    tenantId : {
        type: String,
        required: true
    }
},{ timestamps: true });

export default messageSchema;