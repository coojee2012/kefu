/**
 * @description 在线聊天、电话房间
 */
import * as mongoose from 'mongoose';
const Schema = mongoose.Schema;

export type RoomModel = mongoose.Document & {
    rid:String;
    tenantId:String;
    userId:String;
    name:String;
    createdAt: Date;   // 创建时间
    updatedAt: Date;   // 更新时间
    msgs:String;
    open:Boolean; // 房价是否开启
    receivers:any[]; // 房间参与
    owner:String;// 
    endTime:Date;
    duration:Number;
    closeBy:String;
}

const roomSchema = new mongoose.Schema({
    rid : {
        type: String,
        unique: true,
        required: true
    }, 
    name: {
        type: String,
        required: true
    }, // 用于显示房间，如果类型为phone,显示为电话号码
    msgs:{
        type: Number,
        default: 0
    },
    usernames : {
        type: Array,
        required: true
    },
    roomType:  {
        type: String,
        enum: ['phone', 'webchat', 'wechat','groupchat'],
    }, 
    open: {  //是否存录音
        type: Boolean,
        default: true
    },
    status :  {
        type: Number,
        default: 0
    }, 
    owner: {
        type: Schema.Types.ObjectId,    // 引用类型
        ref: 'User'                     // 关联用户表
    }, // 房价归属
    receivers:[
        {
            type: Schema.Types.ObjectId,    // 引用类型
            ref: 'User'                     // 关联用户表
        }
    ], // 针对聊天类型的房间参与者
    tenantId:{
        type: String,
        required: true
    }, 
    closeBy : {
        type: String,
        enum: ['owner', 'visitor'],
    }, 
    endTime : {
        type: Date,
    },
    duration :  {
        type: Number,
        default: 0.00
    }, 
},{ timestamps: true });

export default roomSchema;