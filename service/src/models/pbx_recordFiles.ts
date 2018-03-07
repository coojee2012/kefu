
import * as mongoose from 'mongoose';
/**
 * 定义接口
 */
export type PBXRecordFileModel = mongoose.Document & {}

const pbxRecordFileSchema = new mongoose.Schema({
    tenantId: {
        type: String,
        required: true
      },
      callId: {
        type: String,
        required: true
      },
      filename: {
        type: String,
      }, //文件名
      extName: {
        type: String,
        default: '.wav'
      }, //扩展名
      fileSize: {
        type: Number,
        default: function () {
          return 0;
        }
      },//文件大小
      direction: {
        type: String,
        required: true
      }, //主叫方向
      label: {
        type: String,
        default: ''
      },//录音类型，queue,exten,ivr,voicemail等
      extension: {
        type: String,
        default: ''
      },//关联分机号
      agentId: {
        type: String,
        default: ''
      },//关联坐席Id
      folder: {
        type: String,
        required: true
      }, //目录
      callNumber: {
        type: String,
      }, //已删除
      deleted: {
        type: Boolean,
        default: false
      }, //关联号码（主叫或被叫号码）
      ts: {
        type: Date,
        default: () => new Date()
      }//创建时间
})
export default pbxRecordFileSchema;