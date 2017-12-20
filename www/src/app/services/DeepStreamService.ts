import { Injectable, Injector } from '@angular/core';
import * as deepstream from 'deepstream.io-client-js';
// import  { deepstreamQuarantine  } from 'deepstream.io-client-js';
import { LoggerService } from './LogService';
import { environment } from './../../environments/environment';

@Injectable()
export class DeepStreamService {
    public client: any;
    constructor(private logger: LoggerService) {
        this.initClient();
    }
    initClient() {
        this.logger.debug('dsURI:', environment.dsUri);
        this.client = deepstream(environment.dsUri);
        this.client.on('error', this.onClientError.bind(this));
        this.client.on('connectionStateChanged', this.onConnectionStateChanged.bind(this));
    }
    onClientError(error, event, topic) {
        this.logger.debug('DSClientError:', error, event, topic);
    }
    onConnectionStateChanged(state) {
        this.logger.debug('DSClientStateChanged:', state);
    }
    login(credentials?, loginHandler?) {
        // {username: 'chris', password:'password'}
        this.client.login(credentials, loginHandler);
    }
    getRecord(name) {
        return this.client.record.getRecord(name);
    }
    getList(name) {
        return this.client.record.getList(name);
    }
    eventSub(topic, cb) {
        this.client.event.subscribe(topic, cb);
    }
}
