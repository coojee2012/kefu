import * as mongoose from 'mongoose';
const Schema = mongoose.Schema;

export type CustomerModel = mongoose.Document & {
    name: string; // 姓名
    tenantId: string;
    sex: string;// 性别
    title?: string; //称呼头衔
    mobile?: string; //手机
    telphone?: string;
    email?: string;
    address?: string;
    level: string; // 客户等级 普通还是VIP
    companyName?: any;
    department?: string; // 部门
    memo?: string;//备注
    createdAt: Date;   // 创建时间
    updatedAt: Date;   // 更新时间
    owner: string;// 所属坐席
    createBy: any; //创建人
    modifyBy: any; //创建人
}

const customerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    tenantId: {
        type: String,
        required: true
    },
    title: {
        type: String,
        default: ''
    },
    mobile: {
        type: String,
        default: ''
    },
    telphone: {
        type: String,
        default: ''
    },
    companyName: {
        type: String,
        default: ''
    },
    address: {
        type: String,
        default: ''
    },
    email: {
        type: String,
        default: ''
    },
    department: {
        type: String,
        default: ''
    },
    createBy:
    {
        type: Schema.Types.ObjectId,    // 引用类型
        ref: 'Users'                     // 关联用户表
    },
    modifyBy: {
        type: Schema.Types.ObjectId,    // 引用类型
        ref: 'Users',                     // 关联用户表
        default: () => null
    },
    sex: {
        type: String,
        enum: ['1', '2', '0'], // 1 男性 2 女性 0 保密
        default: () => '0'
    },
    level: {
        type: String,
        enum: ['0', '1', '2', '3', '4', '5'], // 0普通
        default: () => '0'
    },
    owner: {
        type: Schema.Types.ObjectId,    // 引用类型
        ref: 'Users'                     // 关联用户表
    }, // 房价归属
}, { timestamps: true });

export default customerSchema;