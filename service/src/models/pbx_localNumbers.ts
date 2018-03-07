import * as mongoose from 'mongoose';
/**
 * 定义接口
 */
export type PBXLocalNumberModel = mongoose.Document & {
    tenantId:string;
    number:string;
    localType:string;
    assign:string;
}

const pbxLocalNumberSchema = new mongoose.Schema({
    tenantId: {
        type: String,
        required: true,
      },
      number:{
        type:String,
        required:true
      },
      localType:   {
        type:String,
        required:true
      },
      assign:   {
        type: String,
      }
})
pbxLocalNumberSchema.index({tenantId:1,number:1},{ unique: true });
export default pbxLocalNumberSchema;