import { Injector, ReflectiveInjector, Injectable } from 'injection-js';
import { ConfigService } from '../service/ConfigService';
import { LoggerService } from '../service/LogService';
import { FreeSwitchPBX, uuidPlayAndGetDigitsOptions } from './FreeSwitchPBX';
import { Connection } from '../lib/NodeESL/Connection';
import { Event } from '../lib/NodeESL/Event';


import { TenantModel } from '../models/tenants';
import { TenantController } from '../controllers/tenant';
interface IChannelData {
    FSName?: string;
    CoreUuid?: string;
    DestinationNumber?: string
    CallDirection?: string;
    originateCallee?: string;
    callerId?: string;
    callerName?: string;
    calleeId?: string;
    calleeName?: string;
    sipCallId?: string;
    channelName?: string;
    useContext?: string;
    callType?: string;
}

interface IRunData {
    callId: string;
    ivrMaxDeep: number;
    ivrCurrentDeep: number;
    tenantId?: string;
    caller?: string;
    callee?: string;
    isOriginateCall?: boolean;
    routerLine?: string;
    answered?: boolean;
    hangupBy?: string;
}
interface ISatisData {
    hangup?: any;
    agentId?: string;
    sType?: string;
    agentNumber?: string;
    queueNumber?: string;
    queueName?: string;
    hangupCase?: string;
    answerTime?: number;
    ringTime?: number;
    agentLeg?: string;
}
@Injectable()
export class RuntimeData {
    private logger: LoggerService;
    private channelData: IChannelData;
    private runData: IRunData;
    private statisData: ISatisData;
    private tenantInfo: TenantModel;
    private tenantController: TenantController;
    private blegIds: string[];
    private blegUsers: string[]; // 可以使agentId,extension,外线号码
    private fsPbx: FreeSwitchPBX;

    constructor(private injector: Injector) {
        this.logger = this.injector.get(LoggerService);
        this.tenantController = this.injector.get(TenantController);
        this.fsPbx = this.injector.get(FreeSwitchPBX);
        this.logger.debug('Init Runtime Data!');
        this.channelData = {};
        this.runData = {
            callId: '',
            ivrMaxDeep: 100,
            ivrCurrentDeep: 0
        };
        this.initData();
        this.logger.debug('Runtime Data:', this.channelData);

        this.blegIds = [];
        this.blegUsers = [];
    }
    initData() {
        const connEvent: Event = this.fsPbx.getConnInfo();
        this.channelData.FSName = connEvent.getHeader('FreeSWITCH-Switchname');
        this.channelData.CoreUuid = connEvent.getHeader('Core-UUID');
        this.channelData.CallDirection = connEvent.getHeader('Call-Direction');
        this.channelData.callerId = connEvent.getHeader('Caller-Caller-ID-Number');
        this.channelData.callerName = connEvent.getHeader('Caller-Caller-ID-Name');
        this.channelData.calleeId = connEvent.getHeader('Caller-Callee-ID-Number');
        this.channelData.calleeName = connEvent.getHeader('Caller-Callee-ID-Name');
        this.channelData.DestinationNumber = connEvent.getHeader('Channel-Destination-Number');
        this.channelData.sipCallId = connEvent.getHeader('variable_sip_call_id');
        this.channelData.channelName = connEvent.getHeader('Caller-Channel-Name');
        this.channelData.useContext = connEvent.getHeader('Caller-Context');
        this.channelData.callType = connEvent.getHeader('variable_call_direction')
        //originateCall: chanData.get('variable_originate_call'),
        //originateTenant: chanData.get('variable_originate_tenant'),
        this.channelData.originateCallee = connEvent.getHeader('variable_originate_callee');

        this.runData.tenantId = connEvent.getHeader('variable_sip_to_host');
        this.runData.callId = connEvent.getHeader('Unique-ID');
        this.runData.routerLine = this.getRouterLine(this.channelData.callType);
        this.runData.caller = this.setCaller();
        this.runData.callee = this.setCalled();




    }
    getRouterLine(callType) {
        const routerLine = {
            calllocal: '本地',
            callin: '呼入',
            callout: '呼出'
        }
        return routerLine[callType];
    }

    getChannelData() {
        return this.channelData;
    }

    getRunData() {
        return this.runData;
    }

    async setTenantInfo() {
        try {
            this.tenantInfo = await this.tenantController.getTenantByDomain(this.runData.tenantId);
            if (!this.tenantInfo) {
                throw new Error(`Can't find tenant: ${this.runData.tenantId}!!!`);
            }
        } catch (ex) {
            return Promise.reject(ex);
        }
    }

    getTenantInfo() {
        return this.tenantInfo;
    }


    setCaller() {
        let caller = this.channelData.callerId;
        // let clickAgent = this.pbxApi.getChannelData().clickAgent;
        // if (this.clickOut && clickAgent) {
        //   caller = clickAgent
        // }
        return caller;
    }

    setCalled() {
        let called = this.runData.isOriginateCall ? this.channelData.originateCallee : this.channelData.DestinationNumber;
        // if (called == 100) {
        //   called = this.pbxApi.getChannelData().sipToUser;
        // }
        return called;
    }

    setAnswered() {
        this.runData.answered = true;
        return;
    }

    addBleg(uuid: string, user: string) {
        this.blegIds.push(uuid);
        this.blegUsers.push(user);
    }

    increaseIvrCurrentDeep(number: number = 1) {
        this.runData.ivrCurrentDeep = this.runData.ivrCurrentDeep + number;
    }
    setStatisData(data: ISatisData) {
        this.statisData = Object.assign({}, this.statisData, data);
    }

    setHangupBy(hangupBy: string) {
        this.runData.hangupBy = hangupBy;
    }

    getStatisData() {
        return this.statisData;
    }

}