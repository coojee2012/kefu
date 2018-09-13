import * as mongoose from 'mongoose';

/**
 * 定义接口
 */
export type UserEventModel = mongoose.Document & {
    _id: string;
    tenantId: string;
    userId: any;
    eventType: string;
    memo: string;
};
const userEventSchema = new mongoose.Schema({
    tenantId: {    // 登陆账号
        type: String,
        require: true // 不可为空约束
    },
    userId: {  //agent 账号
        type: mongoose.Schema.Types.ObjectId, // 引用类型
        ref: 'Users'                     // 关联用户表
    },
    eventType: {    // 登陆账号
        type: String,
        enum: {
            values: 'login,logout,checkin,checkout,busy,idle,waiting,rest'.split(','),
            message: ''
        },
        require: true // 不可为空约束
    },
    memo: {    // 登陆账号
        type: String,
        // unique: true, // 不可重复约束
        default: () => '' // 不可为空约束
    },
}, { timestamps: true });

export default userEventSchema;