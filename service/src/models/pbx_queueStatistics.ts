
import * as mongoose from 'mongoose';
/**
 * 定义接口
 */
export type PBXQueueStatisticsModel = mongoose.Document & {}

const pbxQueueStatisticsSchema = new mongoose.Schema({
    callId: {
        type: String,
        unique: true,
        required: true,
      },//呼叫编号
      tenantId: {
        type: String,
        required: true,
      },
      queueNumber: {
        type: String,
        required: true,
      },
      onDutyAgents: [{
        type: String
      }],
      answerAgent: {
        type: String,
        default: '',
      },//最终服务坐席分机号
      answerAgentId: {
        type: String,
        default: '',
      },//最终服务坐席ID
      incomeTime: {
        type: Date,
        default: () => new Date()
      },//进入队列时间
      ringTimes: {
        type: Number,
        default: 0
      },//总计呼叫过多少个坐席
      ringDuration: {
        type: Number,
        default: 0
      },//总计振铃时长
      answerTime: {
        type: Date,
        default: null
      },//被应答的时间
      transferStatic: {
        type: Date,
        default: null
      },//转满意度的时间
      hangupTime: {
        type: Date,
        default: null
      },//挂机时间
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
export default pbxQueueStatisticsSchema;