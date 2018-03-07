import * as mongoose from 'mongoose';
/**
 * 定义接口
 */
export type PBXIVRMenmuModel = mongoose.Document & {}

const pbxIVRMenmuSchema = new mongoose.Schema({
    tenantId: {
        type: String,
        required: true
      },
      ivrNumber: {
        type: String,
        required: true
      },
      ivrName: {
        type: String,
        required: true
      },
      //ivr是否可以
      canTransfer: {
        type: Boolean,
        default: ()=>false
      },
      description: {
        type: String,
        default: ()=>''
      } ,
      ts: {
        type: Date,
        default: () => new Date()
      } ,
      lm: {
        type: Date,
        default: null
      } ,
      readOnly: {
        type: Boolean,
        default: false
      }
})
pbxIVRMenmuSchema.index({tenantId: 1, ivrNumber: 1}, {unique: true});
export default pbxIVRMenmuSchema;