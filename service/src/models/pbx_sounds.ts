import * as mongoose from 'mongoose';
/**
 * 定义接口
 */
export type PBXSoundModel = mongoose.Document & {}

const pbxSoundSchema = new mongoose.Schema({
    tenantId: {
        type: String,
        required: true
      },
      filename: {
        type: String,
        required: true
      },//文件名 abc1
      extName: {
        type: String,
        required: true
      },//扩展名 wav
      folder: {
        type: String,
        default: ()=>''
      },//文件夹
      description: {
        type: String,
        default: ()=>''
      },//描述
      label: {
        type: String,
        default: ()=>''
      },//标签
      url: {
        type: String,
        required: true
      },//s3 url
      associate: {
        type: String,
        default: ()=>''
      },//关联
      readOnly: {
        type: Boolean,
        default: false
      },//系统只读
      ts: {
        type: Date,
        default: ()=>new Date()
      },
})
export default pbxSoundSchema;