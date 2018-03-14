import { Injector, ReflectiveInjector, Injectable } from 'injection-js';
import { ConfigService } from '../service/ConfigService';
import { LoggerService } from '../service/LogService';
import { Connection } from '../lib/NodeESL/Connection';
import { Event } from '../lib/NodeESL/Event';
interface IChannelData  {
FSName?:string;
CoreUuid?:string;
DestinationNumber?:string
CallDirection?:string;
originateCallee?:string;
callerId?:string;
callerName?:string;
calleeId?:string;
calleeName?:string;
sipCallId?:string;
channelName?:string;
useContext?:string;
}

interface IRunData {
    callId:string;
    ivrMaxDeep:number;
    ivrCurrentDeep:number;
    tenantId?:string;
    caller?:string;
    callee?:string;
    isOriginateCall?:boolean;
    routerLine?:string;
    answered?:boolean;
}
@Injectable()
export class RuntimeData {
    private logger: LoggerService;
    private channelData:IChannelData;
    private runData:IRunData;
    constructor(private conn: Connection, private injector: Injector) {
        this.logger = this.injector.get(LoggerService);
        this.logger.debug('Init Runtime Data!');
        this.channelData = {};
        this.runData = {
            callId:'',
            ivrMaxDeep:100,
            ivrCurrentDeep:0
        };
        this.initData();
        this.logger.debug('Runtime Data:',this.channelData);
    }
    initData(){
        const connEvent: Event = this.conn.getInfo();
        this.channelData.FSName = connEvent.getHeader('FreeSWITCH-Switchname');
        this.channelData.CoreUuid = connEvent.getHeader('Core-UUID');
        this.channelData.CallDirection = connEvent.getHeader('Call-Direction');     
        this.channelData.callerId = connEvent.getHeader('Caller-Caller-ID-Number'),
        this.channelData.callerName = connEvent.getHeader('Caller-Caller-ID-Name'),
        this.channelData.calleeId = connEvent.getHeader('Caller-Callee-ID-Number'),
        this.channelData.calleeName = connEvent.getHeader('Caller-Callee-ID-Name'),
        this.channelData.DestinationNumber = connEvent.getHeader('Channel-Destination-Number');
        this.channelData.sipCallId = connEvent.getHeader('variable_sip_call_id');
        this.channelData.channelName = connEvent.getHeader('Caller-Channel-Name');
        this.channelData.useContext = connEvent.getHeader('Caller-Context');
        //originateCall: chanData.get('variable_originate_call'),
        //originateTenant: chanData.get('variable_originate_tenant'),
        this.channelData.originateCallee =  connEvent.getHeader('variable_originate_callee'),
        this.runData.tenantId = connEvent.getHeader('variable_sip_to_host');
        this.runData.callId = connEvent.getHeader('Unique-ID');
        this.runData.routerLine = '呼入';
        this.runData.caller = this.setCaller();
        this.runData.callee = this.setCalled();
    }

    getChannelData(){
        return this.channelData;
    }

    getRunData(){
        return this.runData;
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

    setAnswered(){
        this.runData.answered = true;
        return;
    }

    increaseIvrCurrentDeep(number:number = 1){
        this.runData.ivrCurrentDeep = this.runData.ivrCurrentDeep + number;
    }

}