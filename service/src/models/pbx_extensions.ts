import * as mongoose from 'mongoose';
/**
 * 定义接口
 */
export type PBXExtensionModel = mongoose.Document & {}

const pbxExtensionSchema = new mongoose.Schema({
    tenantId: {
        type: String,
        required: true,
      },
      accountCode: {
        type: Number,
        required: true,
      },	//账号,分机号
      password: {
        type: String,
        required: true,
      },//注册密码
      agentId: {  //agent 账号
        type: String,
        default: ()=>''
      },
      deviceProto: {
        type: String,
        default: ()=>''
      },//设备协议
      deviceNumber: {
        type: String,
        default:()=>''
      },// 设备号
      status: {
        type: String,
        default: ()=>'Logout'
      },// 签入签出
      loginType: {
        type: String,
        enum: {
          values: 'embedPhone,softPhone,physicalPhone'.split(','),
          message: ''
        },
        default:()=>'embedPhone'
      },// 签入状态 embedPhone电话条,softPhone软电话like:sipLite,physicalPhone:Avaya IP话机 OR Cisco IP话机
      /**
       * waiting: 'waiting',
       * busy: 'busy',
       * rest: 'rest',
       * idle: 'idle',
       * toringing: 'toringing',
       * ringing: 'ringing',
       * dialout: 'dialout',
       * callagent:'callagent', - 双向外呼时,正在呼叫坐席的分机或手机
       * inthecall: 'inthecall',
       * toconsult:'toconsult', - 发起咨询
       * consulting:'consulting', - 咨询中
       * holding:'holding', - 保持中
       * beingconsulted:'beingconsulted', - 坐席分机正在被咨询中
       * inivrtransfer:'inivrtransfer' , - 当前坐席将来电转入IVR中,正在等待
       * inappointtransfer:'inappointtransfer' ,- 当前坐席正在与指定转接方通话
       */
      state: {
        type: String,
        default: ()=>'busy'
      },//坐席状态
      deviceString: {
        type: String,
        default: ()=>''
      },//设备字符串
      firstChecked: {
        type: Boolean,
        default: ()=>false
      },//是否检查过
      transferNumber: {
        type: String,
        default: ()=>''
      },//随行号码,一般是手机
      phoneNumber: {
        type: String,
        default: ()=>''
      },// 坐席手机
      lastCallId: {
        type: String,
        default: ()=>''
      },// 最后一次参与的callID
      logicType:{
        type: String,
        default: ()=>''
      },// 处于的业务逻辑
      logicOptions:{
      },// 处于的业务逻辑的参数
      phoneLogin: {
        type: String,
        default: ()=>'no'
      },
      dndInfo: {
        type: String,
        default: function () {
          return 'off';
        }
      },//示忙状态 off/on
      failed: {
        type: String,
        default: function () {
          return 'deailway=hangup&number=';
        }
      },//deailway-呼叫失败处理方式:hangup,ivr,voicemail,fllowme,transfer
      ts: {
        type: Date,
        default: () => new Date()
      },
      stateLastModified: {
        type: Date
      },
      statusLastModified: {
        type: Date
      },
      lm: {
        type: Date,
        default: () => new Date()
      }
    

})
pbxExtensionSchema.index({tenantId: 1, accountCode: 1}, {unique: true});
export default pbxExtensionSchema;