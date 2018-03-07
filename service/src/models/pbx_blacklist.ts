import * as mongoose from 'mongoose';
/**
 * 定义接口
 */
export type PBXBlackListModel = mongoose.Document & {
    tenantId:string;
    phoneNumber:string;
    createBy:string;
    modifyBy:string;
    memo:string;
    lm:Date;
    ts:Date;
}

const pbxBlackListSchema = new mongoose.Schema({
    tenantId: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },// 电话号码
    createBy: {
      type: String,
      default: ()=>''
    },// 创建人
    modifyBy:{
      type: String,
      default: ()=>''
    },// 修改人
    memo: {
      type: String,
      default: () => ''
    },//添加成黑名
    lm:{
      type: Date,
      default: () => null
    },
    ts: {
      type: Date,
      default: () => {
        return new Date();
      }
    }
  })
export default pbxBlackListSchema;