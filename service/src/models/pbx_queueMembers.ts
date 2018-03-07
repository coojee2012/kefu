import * as mongoose from 'mongoose';
/**
 * 定义接口
 */
export type PBXQueueMemberModel = mongoose.Document & {
    tenantId:string;
    queueNumber:string;
    fsName:string;
    sessionUuid:string;
    servingAgent:string;
    callId:string;
    cidName:string;
    cidNumber:string;
    callInAt:number;
    joinAt:number;
    reJoinAt:number;
    bridgeAt:number;
    abandonAt:number;
    state:string;
}

const pbxQueueMemberSchema = new mongoose.Schema({
    tenantId: {
        type: String,
        required: true,
      },
      queueNumber: {
        type: String,
        required: true,
      },
      fsName: {
        type: String,
        default: ''
      },
      sessionUuid: {
        type: String,
        default: ''
      },
      servingAgent: {
        type: String,
        default: ''
      },
      callId: {
        type: String,
        default: ''
      },
      cidNumber: {
        type: String,
        default: ''
      },
      cidName: {
        type: String,
        default: ''
      },
      callInAt: {
        type: Number,
        default: 0
      },
      joinAt: {
        type: Number,
        default: 0
      },
      reJoinAt: {
        type: Number,
        default: 0
      },
      bridgeAt: {
        type: Number,
        default: 0
      },
      abandonAt: {
        type: Number,
        default: 0
      },
      state: {
        type: String,
        default: ''
      }
})
export default pbxQueueMemberSchema;