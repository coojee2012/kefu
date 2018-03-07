import * as mongoose from 'mongoose';
/**
 * 定义接口
 */
export type PBXConferenceModel = mongoose.Document & {}

const pbxConferenceSchema = new mongoose.Schema({
    tenantId: {
        type: String,
        required: true,
      },
      number:{
        type: String,
      },
      pinCode: {
        type: String,
      },//进入会议室的密码
      playWhenEvent: {
        type: Number,
        default: 0
      },//播放音乐当离开时
      mohWhenOnlyOne: {
        type: Number,
        default: 0
      },//只有一个人是播放等待音乐
      ts: {
        type: Date,
        default: ()=>new Date()
      }
})
pbxConferenceSchema.index({tenantId:1,number:1},{ unique: true });
export default pbxConferenceSchema;