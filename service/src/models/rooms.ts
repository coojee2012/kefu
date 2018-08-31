/**
 * @description 在线聊天、电话房间
 */
import * as mongoose from 'mongoose';
const Schema = mongoose.Schema;

export type RoomModel = mongoose.Document & {
    rid: string;
    tenantId: string;
    display: string;
    createdAt: Date;   // 创建时间
    updatedAt: Date;   // 更新时间
    msgs: number;
    open: boolean; // 房价是否开启
    receivers: any[]; // 房间参与
    owner: string;// 
    endTime: Date;
    roomType: string;
    duration: number;
    closeBy: String;
}

const roomSchema = new mongoose.Schema({
    rid: {
        type: String,
        unique: true,
        required: true
    },
    display: {
        type: String,
        required: true
    }, // 用于显示房间，如果类型为phone,显示为电话号码 livechat显示成访客 或 坐席重新制定访客的姓名
    msgs: {
        type: Number,
        default: 0
    },
    usernames: [
        {
            type: Schema.Types.ObjectId,    // 引用类型
            ref: 'Users'                     // 关联用户表
        }
    ], // 房间相关的坐席人员
    roomType: {
        type: String,
        enum: ['phone', 'livechat', 'wechat', 'groupchat'],
    },
    open: {  // 
        type: Boolean,
        default: true
    },
    status: {
        type: Number,
        default: 1   // 1 开放  2 结束 0  坐席已经在关闭 将不再显示在列表
    },
    owner: {
        type: Schema.Types.ObjectId,    // 引用类型
        ref: 'Users'                     // 关联用户表
    }, // 房价归属
    receivers: [
        {
            type: Schema.Types.ObjectId,    // 引用类型
            ref: 'Users'                     // 关联用户表
        }
    ], // 针对聊天类型的房间参与者
    tenantId: {
        type: String,
        required: true
    },
    closeBy: {
        type: String,
        enum: ['owner', 'visitor'],
    },
    endTime: {
        type: Date,
    },
    duration: {
        type: Number,
        default: 0.00
    },
}, { timestamps: true });

export default roomSchema;