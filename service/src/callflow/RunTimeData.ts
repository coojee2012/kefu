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
tenantId?:string;
routerLine?:string;
}
@Injectable()
export class RuntimeData {
    private logger: LoggerService;
    private channelData:IChannelData;
    constructor(private conn: Connection, private injector: Injector) {
        this.logger = this.injector.get(LoggerService);
        this.logger.debug('Init Runtime Data!');
        this.channelData = {};
        this.initData();
        this.logger.debug('Runtime Data:',this.channelData);
    }
    initData(){
        const connEvent: Event = this.conn.getInfo();
        this.channelData.FSName = connEvent.getHeader('FreeSWITCH-Switchname');
        this.channelData.CoreUuid = connEvent.getHeader('Core-UUID');
        this.channelData.CallDirection = connEvent.getHeader('Call-Direction');

        this.channelData.tenantId = connEvent.getHeader('variable_sip_to_host');
        this.channelData.routerLine = '呼入';
    }

    getChannelData(){
        return this.channelData;
    }
}