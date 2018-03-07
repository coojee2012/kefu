import * as mongoose from 'mongoose';
/**
 * 定义接口
 */
export type PBXIVRInputModel = mongoose.Document & {
    tenantId:string;
    ivrNumber:string;
    actionId:string;
    general:number;
    generalType:string;
    generalArgs:any;
    inputNumber:string;
    gotoIvrActId:string;
    gotoIvrNumber:string;
    ts?:Date;
    lm?:Date;
}

const pbxIVRInputSchema = new mongoose.Schema({
    tenantId: {
        type: String,
        required: true
      },
      ivrNumber: {
        type:String,
        required: true
      },
      actionId: {
        type:String,
        required: true
      },
      general: {
        type: Number,
        default: 0
      },//0,普通按键；1，默认响应
      generalType: {
        type: String,
      },//错误响应：包括无效按键或等待按键超时标识或重试次数设置【timeout,invalidKey,retry】
      generalArgs: { },//错误响应参数
      inputNumber: {
        type: String
      },
      gotoIvrNumber: {
        type:String,
      },
      gotoIvrActId: {
        type: Number,
        default: 1
      },
      ts: {
        type: Date,
        default: () => new Date()
      },
      lm: {
        type: Date,
        default: null
      }
})
export default pbxIVRInputSchema;