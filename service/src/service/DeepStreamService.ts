import { Injectable , Injector } from 'injection-js';
import * as deepstream from 'deepstream.io-client-js';
// import  { deepstreamQuarantine  } from 'deepstream.io-client-js';
import { LoggerService } from './LogService';
import { ConfigService } from './ConfigService';
@Injectable()
export class DeepStreamService {
    public client: any; 
    constructor( private logger: LoggerService,private config:ConfigService ) {
        this.initClient();
    }
    initClient(){
        const dsConfig = this.config.getConfig().deepstream;
        const dsUri: string = `ws://${dsConfig.host}:${dsConfig.port}`;
        this.logger.debug('dsURI:',dsUri);
        this.client =  deepstream(dsUri).login();
        this.client.on('error',this.onClientError.bind(this));
        this.client.on('connectionStateChanged',this.onConnectionStateChanged.bind(this));
    }
    onClientError(error, event, topic ){
        this.logger.debug(error, event, topic );
    }
    onConnectionStateChanged(state){
        this.logger.debug('DSClientStateChanged', state);
    }
}