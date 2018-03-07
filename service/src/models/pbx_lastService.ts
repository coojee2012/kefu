import * as mongoose from 'mongoose';
/**
 * 定义接口
 */
export type PBXLastServiceModel = mongoose.Document & {}

const pbxLastServiceSchema = new mongoose.Schema({
    tenantId: {
        type: String,
        required: true,
      },
      callerNumber: {
        type: String,
        required: true,
      },
      calleeNumber: {
        type: String,
        required: true,
      },
      validTime: {
        type: Number,
        default:() => 0,
      },
      extData: {
        type: Object,
        default: () => null,
      }, // 扩展参数，用于记录一些特殊业务需要的数据
      ts: {
        type: Date,
        default: () => new Date(),
      },
      lm: {
        type: Date,
        default: () => new Date(),
      },
})
export default pbxLastServiceSchema;