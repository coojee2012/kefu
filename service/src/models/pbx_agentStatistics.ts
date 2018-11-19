import * as mongoose from 'mongoose';
/**
 * 定义接口
 */
export type PBXAgentStatisticsModel = mongoose.Document & {
  tenantId:string;
  bLegId:string;
  queueNumber:string;
  callId:string;
  agentNumber:string;
  agentId:string;
  ringStart:Date;
  answerTime?:Date;
  hangupTime?:Date;
  satisfaction:number;
  hangupCase:string;
  idleTime:number;
}

const pbxAgentStatisticSchema = new mongoose.Schema({
    callId: {
        type: String,
        required: true,
      },
      bLegId: {
        type: String,
        required: true,
      },//当时坐席的线路id
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
      agentId: {
        type: String,
        required: true,
      },
      ringStart: {
        type: Date,
        default: () => new Date()
      },
      answerTime: {
        type: Date,
        default: null
      },
      hangupTime: {
        type: Date,
        default: null
      },
      satisfaction: {
        type: Number,
        default: 0
      },//电话满意度0,1,2,3
      hangupCase: {
        type: String,
        enum: {
          values: 'user,agent,ring,system'.split(','),
          message: ''
        },
        default: 'system'
      },//用户挂断,坐席挂断,振铃放弃(用户进入队列,未被坐席接听而挂断,包括超时由系统自动挂断)
      idleTime: {
        type: Number,
        default: -1
      }//关于该通话,坐席话后处理时间
})
export default pbxAgentStatisticSchema;