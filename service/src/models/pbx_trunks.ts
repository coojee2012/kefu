import * as mongoose from 'mongoose';
/**
 * 定义接口
 */
export type PBXTrunkModel = mongoose.Document & {}

const pbxTrunkSchema = new mongoose.Schema({
    name: {
        required: true,
        unique: true,
        type: String,
    },// 中继的名称
    protocol: {
        type: String,
    },//协议 SIP,IAX2,等
    gateway: {
        type: String,
        default: function () {
            return '';
        }
    },//SIP协议对应注册字符串或gateway:5060 或其他端口
    transport: {
        type: String,
        default: () => 'udp'
    },
    device: {
        type: String,
        default: () => ''
    },//针对硬件中继设置
    dnds: [{
        type: String,
    }],//该中继拥有的号码
    concurrentCall: {
        type: Number,
        default: () => 0
    },// 中继的并发数,0表示不限制,-1表示禁用
    memo: {
        type: String,
        default: function () {
            return '';
        }
    },
    ts: {
        type: String,
        default: () => new Date()
    },
    args: {
        type: String,
        default: function () {
            return '';
        }
    }//关于中继的一些其他参数
})
export default pbxTrunkSchema;