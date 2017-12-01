import { Injectable , Injector } from 'injection-js';
import * as deepstream from 'deepstream.io-client-js';
// import  { deepstreamQuarantine  } from 'deepstream.io-client-js';
import { LoggerService } from './LogService';
@Injectable()
export class DeepStreamService {
    public client: any; 
    constructor( private logger: LoggerService ) {
        this.client =  deepstream('ws://192.168.2.209:6020').login();
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