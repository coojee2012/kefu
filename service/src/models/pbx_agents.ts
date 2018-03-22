import * as mongoose from 'mongoose';
/**
 * 定义接口
 */
export type PBXAgentModel = mongoose.Document & {
  tenantId:string;
  queueNumber:string;
  agentNumber:string;
  callId:string;
  position:number;
  lastBridgeEnd:number;
  lastBridgeStart:number;
  warpUpTime:number;
  lastOfferedCall:number;
  answeredCalls:number;
  noAnsweredCalls:number;
  busyDelayTime:number;
  noAnswerDelayTime:number;
  maxNoAnswer:number;
  rejectDelayTime:number;
  talkTime:number;

}

const pbxAgentSchema = new mongoose.Schema({
    tenantId: {
        type: String,
        required: true,
      },
      queueNumber: {
        type: String,
        required: true,
      },
      agentNumber: {
        type: String,
        required: true,
      },
      callId: {
        type: String,
        default: ''
      },
      position: {
        type: Number,
        default: 0
      },
      lastBridgeStart: {
        type: Number,
        default: 0
      },
      lastBridgeEnd: {
        type: Number,
        default: 0
      },
      warpUpTime: {
        type: Number,
        default: 0
      },
      lastOfferedCall: {
        type: Number,
        default: 0
      },
      answeredCalls: {
        type: Number,
        default: 0
      },
      noAnsweredCalls: {
        type: Number,
        default: 0
      },
      busyDelayTime: {
        type: Number,
        default: 0
      },
      noAnswerDelayTime: {
        type: Number,
        default: 0
      },
      maxNoAnswer: {
        type: Number,
        default: 0
      },
      rejectDelayTime: {
        type: Number,
        default: 0
      },
      talkTime: {
        type: Number,
        default: 0
      }
})
pbxAgentSchema.index({tenantId: 1, queueNumber: 1, agentNumber: 1}, {unique: true});
export default pbxAgentSchema;