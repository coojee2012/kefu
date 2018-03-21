import * as mongoose from 'mongoose';
/**
 * 定义接口
 */
export type PBXQueueModel = mongoose.Document & {
  tenantId: string;
  queueNumber: string;
  queueName: string;
  description?: string;
  announceFile?: string;
  playRing?: string;
  sayMember?: boolean;
  failedDone?: string;
  members?: string[];
  announceFrequency?: number;
  queue: PBXQueueOptions;
  agent: PBXQueueAgentOptions;
  hasNew: boolean;
  ts?: Date;
  lm?: Date;


}

export type PBXQueueOptions = {
  strategy: string;
  mohSound: string;
  recordTemplate: string;
  timeBaseScore: string;
  tierRulesApply: boolean;
  tierRuleWaitSecond: number;
  tierRuleWaitMultiplyLevel: boolean;
  tierRuleNoAgentNoWait: boolean;
  discardAbandonedAfter: number;
  abandonedResumeAllowed: boolean;
  maxWaitTime: number;
  maxWaitTimeWithNoAgent: number;
  maxWaitTimeWithNoAgentTimeReached: number;
  ringProgressivelyDelay: number;
  transferStatic: boolean;
  queueTimeoutFile: string;
  satisfactionFile: string;
  jobNumberTipFile: string;
  enterTipFile: string;
  ringTimeOut: number;
  verySatisfactionPlay: string;
  callerId: string;

  //坐席全忙相关
  abtFile?: string;
  abtKeyTimeOut?: number;
  abtWaitTime?: number;
  abtInputTimeoutFile?: string;
  abtInputTimeoutEndFile?: string;
  abtInputErrFile?: string;
  abtInputErrEndFile?: string;
  abtTimeoutRetry?: number;
  abtInputErrRetry?: number;
}

export type PBXQueueAgentOptions = {
  type: string;
  contact: '';
  status: string;
  maxNoAnswer: number;
  wrapUpTime: number;
  rejectDelayTime: number;
  busyDelayTime: number;
  noAnswerDelayTime: number;
  reserveAgents: boolean;
  truncateAgentsOnLoad: boolean;
  truncateTiersOnLoad: boolean;
  maxRingTime: number;
}

const pbxQueueSchema = new mongoose.Schema({
  tenantId: {
    type: String,
    required: true
  },
  queueNumber: {
    type: String,
    required: true
  },
  queueName: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: () => ''
  },
  announceFile: {
    type: String,
    default: function () {
      return '';
    }
  },//将在电话接通的时候播放xxxx,
  playRing: {
    type: Boolean,
    default: false
  },//等待用户听到振铃声，0听背景音乐
  sayMember: {
    type: Boolean,
    default: false
  },//是否启用播放坐席工号
  failedDone: {
    type: String,
    default: ''
  },//队列呼叫失败的本地处理号码
  members: [String],//队列成员，如:[8001,8002,8003]
  /**                  ;ringall :ring 所有可用channels 直到应答为止
   ;roundrobin :轮流ring 每个可用interface,1calls :1-<2-<3,2calls:2-<3-<1;3calls:3-<1-<2
   ;leastrecent :ring 进来最少在队列中最少被呼叫的interface,有可能一直响某台分机
   ;fewestcalls :ring one 最少completed calls
   ;random  :随机ring
   ;rrmemory :在内存中把最后一个ring pass 放到最左边,即不会一直ring某个分机
   ;linear    :根据配置文件中的顺序ring（v1.6）
   ;wrandom   :(V1.6)
   **/
  announceFrequency: {
    type: Number,
    default: function () {
      return 0;
    }
  },//每隔多少秒将向队列等待者播放提示录音

  agent: {
    type: {
      type: String,
      default: () => 'callback'
    }, // 'callback' will try to reach the agent via the contact fields value. 'uuid-standby' will try to bridge the call directly using the agent uuid.
    contact: {
      type: String,
      default: () => ''
    }, //A simple dial string can be put in here, like: user/1000@default. If using verto: ${verto_contact(1000@default)}
    status: {
      type: String,
      default: () => 'Available'
    },
    maxNoAnswer: {
      type: Number,
      default: 10
    },//坐席未应答数超过该值，将自动置为On Break
    wrapUpTime: {
      type: Number,
      default: 15
    },//每次应答后，强制坐席空闲多少时间
    rejectDelayTime: {
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
    reserveAgents: {
      type: Boolean,
      default: false
    },
    truncateAgentsOnLoad: {
      type: Boolean,
      default: false
    },
    truncateTiersOnLoad: {
      type: Boolean,
      default: false
    },
    maxRingTime: {
      type: Number,
      default: 30
    }

  },
  queue: {
    strategy: {
      type: String,
      default: () => 'round-robin'
    },
    mohSound: {
      type: String,
      default: () => 'local_stream://moh'
    },
    recordTemplate: {
      type: String,
      default: () => '$${base_dir}/recordings/'
    },
    timeBaseScore: {
      type: String,
      default: () => 'queue'
    },
    tierRulesApply: {
      type: Boolean,
      default: true
    },
    tierRuleWaitSecond: {
      type: Number,
      default: 0
    },
    tierRuleWaitMultiplyLevel: {
      type: Boolean,
      default: false
    },
    tierRuleNoAgentNoWait: {
      type: Boolean,
      default: false
    },
    discardAbandonedAfter: {
      type: Number,
      default: 0
    },
    abandonedResumeAllowed: {
      type: Boolean,
      default: false
    },
    maxWaitTime: {
      type: Number,
      default: 120
    },
    maxWaitTimeWithNoAgent: {
      type: Number,
      default: 0
    },
    maxWaitTimeWithNoAgentTimeReached: {
      type: Number,
      default: 5
    },
    ringProgressivelyDelay: {
      type: Number,
      default: 10
    },
    transferStatic: {
      type: Boolean,
      default: true
    },
    queueTimeoutFile: {
      type: String,
      default: 'demo/queuetimeout.wav'
    },
    satisfactionFile: {
      type: String,
      default: 'demo/satisfaction.wav'
    },
    jobNumberTipFile: {
      type: String,
      default: () => ''
    }, // 播放工号
    enterTipFile: {
      type: String,
      default: () => ''
    }, // 进入队列提醒
    ringTimeOut: {
      type: Number,
      default: () => 30
    },
    verySatisfactionPlay: {
      type: String,
      default: 'demo/satisfaction-thks.wav' //如果为空就不播放
    },
    // 当坐席转接到手机时 外呼显示的中继的号码,这个将影响中继的线路选择
    callerId: {
      type: String,
      default: () => ''
    }

  },
  ts: {
    type: Date,
    default: () => new Date()
  },
  lm: {
    type: Date,
    default: () => new Date()
  },
  hasNew: {
    type: Boolean,
    default: () => true
  }
})
pbxQueueSchema.index({ tenantId: 1, queueNumber: 1 }, { unique: true });
export default pbxQueueSchema;