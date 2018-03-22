import { Injectable, Injector, ReflectiveInjector } from 'injection-js';
import BullQueue = require('bull');
import { Queue, Job, QueueOptions } from 'bull';
// import  { deepstreamQuarantine  } from 'deepstream.io-client-js';
import { LoggerService } from '../service/LogService';
import { ConfigService } from '../service/ConfigService';
import { RedisService } from '../service/RedisService';
import { EventService } from '../service/EventService';

import { TenantController } from '../controllers/tenant';
import { PBXExtensionController } from '../controllers/pbx_extension';
import { PBXAgentController } from '../controllers/pbx_agent';

import { RedisOptions, Redis } from 'ioredis';
import Redlock = require('redlock');
import { Lock } from 'redlock';


@Injectable()
/**
 * @description 用bull实现队列排队，以每一个组合的每一个队列为一个排队队列，包括插队等功能
 */
export class QueueWorkerService {
    private queueTopics: string[];
    private queues: Queue[]; // 此处算法可以改进
    private childInjector: Injector;
    private queueOptions: QueueOptions;
    private redlock: Redlock;
    private redLockClient: Redis;
    private bullQueueClient: Redis;
    private redisService: RedisService;
    private eventService: EventService;

    private pbxAgentController: PBXAgentController;
    private pbxExtensionController: PBXExtensionController;

    constructor(private injector: Injector, private logger: LoggerService, private config: ConfigService) {
        this.createChildInjector();
        this.pbxAgentController = this.childInjector.get(PBXAgentController);
        this.pbxExtensionController = this.childInjector.get(PBXExtensionController);

    }


    async init() {
        try {
            this.redisService = this.injector.get(RedisService);
            this.queueOptions = {
                redis: {
                    host: this.config.getConfig().redis.host,
                    port: this.config.getConfig().redis.port,
                    password: this.config.getConfig().redis.password ? this.config.getConfig().redis.password : null,
                    db: 10,
                },
                prefix: 'esl_bull'

            }
            this.redLockClient = this.redisService.getClientByName('RedLock');
            this.bullQueueClient = this.redisService.getClientByName('BullQueue');

            this.redlock = new Redlock(
                // you should have one client for each redis node
                // in your cluster
                [this.redLockClient],
                {
                    // the expected clock drift; for more details
                    driftFactor: 0.01, // time in ms
                    // the max number of times Redlock will attempt to lock a resource before erroring
                    retryCount: 10,
                    // the time in ms between attempts
                    retryDelay: 200, // time in ms
                    // the max time in ms randomly added to retries
                    // to improve performance under high contention
                    // see https://www.awsarchitectureblog.com/2015/03/backoff.html
                    retryJitter: 200 // time in ms
                });
            this.redlock.on('clientError', function (err) {
                this.logger.error('A redis error has occurred:', err);
            })
            this.queueTopics = [];
            this.queues = []
        } catch (ex) {

        }
    }
    /**
     * 
     * @param topic 以租户及队列名称组合的唯一的队列名，如果已经存在，返回
     */
    add(tenantId: string, queueNumber: string): Queue {
        const qNameTopic = `esl_q_queue::${tenantId}::${queueNumber}`;
        if (this.queueTopics.indexOf(qNameTopic) < 0) {
            const queue = new BullQueue(qNameTopic, this.queueOptions);
            this.queueTopics.push(qNameTopic)
            this.queues.push(queue);
            this.setCacheBullKey(qNameTopic);
            queue
                .on('error', function (error) {
                    // An error occured.
                    console.log('bullqueue', error)
                })
                .on('active', function (job, jobPromise) {
                    // A job has started. You can use `jobPromise.cancel()`` to abort it.
                    console.log('bullqueue active', job.id, new Date())
                })

                .on('stalled', function (job) {
                    // A job has been marked as stalled. This is useful for debugging job
                    // workers that crash or pause the event loop.
                    console.log('bullqueue stalled', job.id, new Date())
                })
                .on('progress', function (job, progress) {
                    // A job's progress was updated!
                    console.log('bullqueue progress', job.id, new Date())
                })
                .on('global:progress', function (jobId, progress) {
                    console.log(`Job ${jobId} is ${progress * 100}% ready!`);
                })
                .on('completed', function (job, result) {
                    // A job successfully completed with a `result`.
                    console.log('bullqueue completed', job.id, new Date())
                })

                .on('failed', function (job, err) {
                    // A job failed with reason `err`!
                    console.log('bullqueue failed', job.id, new Date())
                    // seneca.act({ role: 'pubsub', path: 'queue_job_fail', data: JSON.stringify({ id:job.id, data:job.data }) }, (err, rsp) => {
                    //                console.log('bullqueue failed pubsub',err,rsp)
                    //     })
                })

                .on('paused', function () {
                    // The queue has been paused.
                    console.log('bullqueue paused')
                })

                .on('resumed', function (job) {
                    // The queue has been resumed.
                    console.log('bullqueue resumed')
                })

                .on('cleaned', function (jobs, type) {
                    // Old jobs have been cleaned from the queue. `jobs` is an array of cleaned
                    // jobs, and `type` is the type of jobs cleaned.
                    console.log('bullqueue cleaned', type)
                });

            const queueIndex = this.queueTopics.length - 1;
            queue.process((job) => {
                const MaxDoneTime = 3 * 60 * 1000; // 最多执行30分钟   
                return this.doneInComeCall(job, queueIndex, MaxDoneTime);
            });
            return queue;
        } else {
            return this.getQueueByName(qNameTopic);
        }
    }

    getQueueByName(name: string): Queue {
        try {
            const index = this.queueTopics.indexOf(name);
            if (index > -1) {
                return this.queues[index];
            } else {
                return null;
            }

        }
        catch (ex) {

        }
    }

    async readyCacheBullQueue() {
        try {
            const keys: string[] = await this.bullQueueClient.keys('bullQueueCache*');
            this.logger.debug('readyCacheBullQueue', keys);
            for (let i = 0; i < keys.length; i++) {
                const key = keys[i] || 'bullQueueCache';
                const works = key.split('::');
                if (works.length === 4) {
                    this.add(works[2], works[3]);
                }
            }
            return Promise.resolve();
        }
        catch (ex) {
            this.logger.debug('readyCacheBullQueue error ', ex);
            return Promise.reject(ex);
        }
    }

    setCacheBullKey(name) {
        this.bullQueueClient.set(`bullQueueCache::${name}`, 1)
            .then()
            .catch(err => {
                this.logger.error('bullQueue set cache key error:', name);
            })
    }

    /**
     * @description
     * shuffle算法，类似摸牌
     * arr为原数组，cards为乱序结果数组
     * random取一个index，取arr中这个元素，放入cards，同时移除arr中这个元素。
     * @param originalArray 原始数组
     * @return {Array}
     */
    shuffle(originalArray: string[]) {
        const mixedArray = [];
        const copyArray = originalArray.slice(0); // 防止改变原来的参数,数组是引用传递
        while (copyArray.length > 0) {
            //generate a random index of the original array
            const randomIndex = Math.random() * copyArray.length;
            //push the random element into the mixed one, at the same time, delete the original element
            mixedArray.push(copyArray[randomIndex]);
            copyArray.splice(randomIndex, 1);
        }
        return mixedArray;
    }

    async randomStrategy({ members, tenantId }) {
        try {
            const lockedMembers = await this.getLockedMembers({ tenantId });
            const unlockedMember = members.filter(x => {
                return lockedMembers.indexOf(String(x)) === -1
            });
            const membersRandom = this.shuffle(unlockedMember);
            const member = this.cycleFind({ members: membersRandom, tenantId });
            return Promise.resolve(member);
        } catch (ex) {
            this.logger.error('randomStrategy error:', ex);
            return Promise.reject(ex);
        }
    }
    /**
    * @description
    * 按队列中坐席的顺序从上到下一次查找可用的坐席
    * 为什么要按members坐席的顺序来,因为实际应用中,这个顺序通常可以用来代表坐席的等级,一般技能卓越
    * 的优秀坐席应该放在前面,以为客户提供最好的服务!
    *
    */
    async topDownStrategy({ members, tenantId }) {
        try {
            const lockedMembers = await this.getLockedMembers({ tenantId });
            const unlockedMember = members.filter(x => {
                return lockedMembers.indexOf(String(x)) === -1
            });
            const member = this.cycleFind({ members: unlockedMember, tenantId });
            return Promise.resolve(member);
        }
        catch (ex) {
            this.logger.error('topDownStrategy error:', ex);
            return Promise.reject(ex);
        }
    }

    async cycleFind({ members, tenantId }) {
        try {
            let finded = null;
            for (let i = 0; i < members.length; i++) {
                //redis锁定成员
                //检查是否可用
                const member = members[i];
                finded = await this.pbxExtensionController.checkAgentCanDail(tenantId, member);
                if (finded) break;
            }
            return Promise.resolve(finded);
        }
        catch (ex) {
            this.logger.error('cycleFind error:', ex);
            return Promise.reject(ex);
        }
    }

    async roundRobinStrategy({ members, tenantId, queueNumber }) {
        try {
            const finds = await this.pbxAgentController.getRoundRobinAgents(tenantId, queueNumber);
            let newArray = [];
            if (finds && finds.length) {
                const agent = finds[0];

                if (agent && agent.agentNumber) {
                    const index = members.indexOf(Number(agent.agentNumber));
                    if (index > -1) {
                        const firstArray = members.slice(index + 1);
                        const lastArray = members.slice(0, index + 1);
                        newArray = firstArray.concat(lastArray);
                    }
                    else {
                        this.logger.info('AgentNumber Is Not Found In Queue Members!');
                        newArray = members.slice(0);
                    }
                }
                else {
                    this.logger.info('Agent Is Not Found In pbx_agents!');
                    newArray = members.slice(0);
                }

            } else {
                newArray = members.slice(0);

            }
            const lockedMembers = await this.getLockedMembers({ tenantId });
            const unlockedMember = newArray.filter(x => {
                return lockedMembers.indexOf(String(x)) === -1
            });
            // this.logger.info('=====roundRobinStrategy newArray=====', members, newArray, unlockedMember);
            const member = this.cycleFind({ members: unlockedMember, tenantId });
            return Promise.resolve(member);
        } catch (ex) {
            this.logger.error(ex);
            return Promise.reject(ex);
        }
    }
    async getLockedMembers({ tenantId }) {
        try {
            const regKey = `esl::queue::member::locked::${tenantId}::*`;
            const keys = await this.redLockClient.keys(regKey);
            const members = [];
            keys.forEach(key => {
                const items = key.split('::');
                members.push(items[items.length - 1])
            })
            return Promise.resolve(members);
        }
        catch (ex) {
            return Promise.reject(ex);
        }
    }

    async lockMember({ tenantId, member }) {
        try {
            const key = `esl::queue::member::locked::${tenantId}::${member}`;
            //await redisQC.setnx(key, member);
            // await redisQC.expire(key, 60);
            const ttl = 3 * 1000;
            const lock = await this.redlock.lock(key, ttl);
            return Promise.resolve(lock);
        }
        catch (ex) {
            return Promise.reject(ex);
        }
    }

    async doneInComeCall(args: Job, queueIndex, timeout: number) {
        try {
            try {

                const argData = args.data;
                const { queue, tenantId, callId } = argData;
                this.logger.info(`doneInComeCall ${tenantId}[${callId}]`);
                const { members, queueNumber } = queue;
                const eventName = `stopFindAgent::${tenantId}::${callId}`;
                this.logger.debug('doneInComeCall', eventName);
                let eslSendStop = false;
                let maxTimeOut = false;
                this.eventService.once(eventName, (data) => {
                    //if(data.jobId === args.id){
                    this.logger.info(`ESL Send Stop Job!${data.jobId} - ${args.id}`);
                    eslSendStop = true;
                    //}                  
                })
                const startTime = new Date().getTime();
                let isMyTurn = false;

                while (!eslSendStop && !isMyTurn) {
                    const activeJobs = await this.queues[queueIndex].getActive();
                    this.logger.info(`activeJobs:${activeJobs.length}`);
                    isMyTurn = true;
                    for (let k = 0; k < activeJobs.length; k++) {
                        const actJob = activeJobs[k];
                        const actJobOpts = actJob.opts;
                        const actJobId = actJob.id;
                        const { priority, timestamp } = actJobOpts;
                        console.log(`myJob:[${args.id},${args.opts.priority},${args.opts.timestamp}],compareJob:[${actJobId},${priority},${timestamp}]`);
                        if (priority < args.opts.priority) {
                            this.logger.info('=============存在优先级比我高的=============');
                            isMyTurn = false;
                            await this.wait(1 * 1000);
                            break;
                        }
                        else if (priority === args.opts.priority && timestamp < args.opts.timestamp) {
                            this.logger.info('=============和我优先级别一样，但是比我进的早！===========');
                            isMyTurn = false;
                            await this.wait(1 * 1000);
                            break;
                        }
                        else {
                            await this.wait(1 * 1000);
                        }
                    }
                }

                while (!eslSendStop && !maxTimeOut) {
                    this.logger.info('==================该我寻找坐席拉！===================');
                    const now = new Date().getTime();
                    if (now - startTime > timeout) {
                        this.logger.info(`doneInComeCall Timeout ${timeout}`);
                        maxTimeOut = true;
                        break;
                    }
                    let data = null;
                    switch (queue.queue.strategy) {
                        case 'round-robin':
                            {
                                data = await this.roundRobinStrategy({
                                    members,
                                    queueNumber,
                                    tenantId
                                })
                                break;
                            }
                        case 'top-down':
                            {
                                data = await this.topDownStrategy({
                                    members,
                                    tenantId
                                })
                                break;
                            }
                        default:
                            {
                                data = await this.randomStrategy({
                                    members,
                                    tenantId
                                })
                                break;
                            }
                    }

                    if (data && data.accountCode) {
                        await this.lockMember({ tenantId, member: data.accountCode });
                        this.logger.info(`${tenantId}找到坐席${data.accountCode}`);
                        const pubData = {
                            tenantId,
                            callId,
                            accountCode: data ? data.accountCode : '',
                            agentId: data ? data.agentId : '',
                            phoneLogin: data ? data.phoneLogin : '',
                            phoneNumber: data ? data.phoneNumber : '',
                            loginType: data ? data.loginType : ''
                        }
                        await this.eventService.pubAReidsEvent('esl::callcontrol::queue::finded::member',JSON.stringify(pubData));                   
                        break;
                    }
                    else {
                        await this.wait(3 * 1000);
                    }
                }
                if (eslSendStop) {
                    return Promise.reject({ success: false, eslSendStop, maxTimeOut });
                } else {
                    return Promise.resolve({ success: true });
                }



            }
            catch (ex) {
                this.logger.error('doneInComeCall error:', ex);
                return Promise.reject(ex);
            }
        } catch (ex) {

        }

    }

    createChildInjector(): void {
        this.childInjector = ReflectiveInjector.resolveAndCreate([
            TenantController,
            PBXExtensionController,
            PBXAgentController
        ])
    }

    async wait(millisecond) {
        try {
            if (millisecond <= 0) {
                millisecond = 3 * 1000;
            }
            await new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve();
                }, millisecond)
            })
        }
        catch (ex) {
            return Promise.reject(ex);
        }
    }
}