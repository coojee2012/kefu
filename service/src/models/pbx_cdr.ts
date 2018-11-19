import * as mongoose from 'mongoose';
/**
 * 定义接口
 */
export type PBXCDRModel = mongoose.Document & {
    tenantId:string;
    callId:string;
    caller:string;
    called:string;
    hangupBy?:string;
    alive?:string;
}

const pbxCDRSchema = new mongoose.Schema({
    tenantId: {
        type: String,
        required: true,
      },
      callId: {
        type: String,
        required: true,
      },
      caller: {
        type: String,
        required: true,
      },
      called: {
        type: String,
        required: true,
      },
      // 与该通道发生联系的一些通道ID
      associateId: [{
        type: String,
      }],
      // 关联的坐席账号
      accountCode: {
        type: String,
        default: () => '',
      },
      srcChannel: {
        type: String,
        default: () => '',
      },
      desChannel: {
        type: String,
        default: () => '',
      },
      // 呼叫来自号码(针对呼入为主叫,呼出为DND)
      callFrom: {
        type: String,
        default: () => '',
      },
      // 呼叫去向号码(针对呼入为DND,呼出为被叫)
      callTo: {
        type: String,
        default: () => '',
      },
      // 相关的坐席号码
      agent: {
        type: String,
        default: () => '',
      },
      threaDID: {
        type: String,
        default: () => '',
      },
      context: {
        type: String,
        default: () => '',
      },
      sipCallId: {
        type: String,
        default: () => '',
      },
      agiType: {
        type: String,
        default: () => '',
      }, // 记录呼叫类型,普通
      isClickOut: {
        type: Boolean,
        default: () => false,
      }, // 是否是双向外呼
      isTransfer: {
        type: Boolean,
        default: () => false,
      }, // 是否是转接呼叫
      transferTimes: {
        type: Number,
        default: () => 0,
      }, // 是否发生过转接
      hasConference: {
        type: Boolean,
        default: () => false,
      }, // 是否发生会议
      recordCall: {
        type: Boolean,
        default: () => true,
      }, // 是否录音
      alive: {
        type: String,
        default: () => 'yes',
      },
      loginType: {
        type: String,
        default: () => 'web',
      },
      starTime: {
        type: Date,
        default: () => new Date(),
      },
      lastServiceId: {
        type: String,
        default: () => '',
      },
      lastAppTime: {
        type: Date,
        default: () => null,
      }, // 上次应用模块发生的时间
      endTime: {
        type: Date,
        default: () => null,
      }, // 线路挂断时间
      hangupCase: {
        type: String,
        default: () => '',
      },
      hangupBy: {
        type: String,
        default: () => '',
      },
      routerLine: {
        type: String,
        required: true,
        default: '',
      },
      extData: {
        type: Array,
        default: () => [],
      }, // 扩展参数，用于记录一些特殊业务需要的数据
      lastApp: {
        type: String,
        default: () => '',
      },
      answerStatus: {
        type: String,
        enum: {
          values: 'answered,noAnswered'.split(','),
          message: '',
        },
        default: () => 'noAnswered',
      },
      answerTime: {
        type: Date,
        default: () => null,
      },
});
pbxCDRSchema.index({ tenantId: 1, callId: 1 }, { unique: true });
export default pbxCDRSchema;