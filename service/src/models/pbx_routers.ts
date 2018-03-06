import * as mongoose from 'mongoose';
/**
 * 定义接口
 */
export type RouterModel = mongoose.Document & {
    _id:string;
    tenantId:string;
    priority:number;
    createMode:boolean;
    routerLine:string;
    routerName:string;
    optExtra?:string;
    lastWhenDone:boolean;
    callerGroup:string;
    callerId:string;
    callerLen:number;
    calledNum:string;
    calledLen:number;
    replaceCallerId:string;
    replaceCalledTrim:number;
    replaceCalledAppend:string;
    processMode:string;
    processedFined:{};
}

const routerSchema = new mongoose.Schema({
    tenantId: {
        type: String,
        required: true
    },
    priority: {
        type: Number
    },//执行顺序（优先级）
    createMode: {
        type: Boolean,
        default: false
    },//系统默认
    routerLine: {
        type: String,
        enum: {
            values: ['呼入', '呼出', '本地'],
            message: '值不被允许'
        },
        required: true,
    },//路由方式，呼出，呼入,本地
    routerName: {
        type: String,
    },//规则名称
    optExtra: {
        type: String,
    },//扩展属性
    lastWhenDone: {
        type: Boolean,
        default: false
    },//最终匹配规则
    callerGroup: {
        type: String,
    },//匹配主叫组（呼出对应分机分组，呼入对应中继分组）
    callerId: {
        type: String,
    },//匹配主叫以什么开头
    callerLen: {
        type: Number,
        default: function () {
            return 0;
        }
    },//匹配主叫长度
    calledNum: {
        type: String,
    },//匹配被叫以什么开头
    calledLen: {
        type: Number,
        default: function () {
            return 0;
        }
    },//匹配被叫长度
    replaceCallerId: {
        type: String,
    },//匹配后主叫替换
    replaceCalledTrim: {
        type: Number,
        default: function () {
            return 0;
        }
    },//匹配后删除被叫前几位
    replaceCalledAppend: {
        type: String,
    },//匹配后补充被叫前几位
    processMode: {
        type: String,
        enum: {
            values: ['diallocal','dialout','blacklist'],
            message: '值不被允许'
        },
        required: true
    },//处理方式 【黑名单，本地处理，拨打外线】
    processedFined: {}//处理详细参数定义
})

export default routerSchema;
