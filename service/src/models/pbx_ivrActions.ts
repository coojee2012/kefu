import * as mongoose from 'mongoose';
/**
 * 定义接口
 */
export type PBXIVRActionsModel = mongoose.Document & {}

const pbxIVRMenmuSchema = new mongoose.Schema({
    tenantId: {
        type: String,
        required: true
      },
      ivrNumber: {
        type: Number,
        required:true
      },
      describe: {
        type: String,
        default: ()=>''
      },
      ordinal: {
        type: Number,
        default: 1
      },
      actionType: {
        type: Number,
        default: 1
      },
      args: {},
      ts: {
        type: Date,
        default: () => new Date()
      },
      lm: {
        type: Date,
        default: null
      }
})
pbxIVRMenmuSchema.index({tenantId:1,ivrNumber:1,ordinal:1},{ unique: true });
export default pbxIVRMenmuSchema;