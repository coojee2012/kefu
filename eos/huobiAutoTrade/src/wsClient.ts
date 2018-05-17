
import moment = require('moment');
import WebSocket = require('ws');
import pako = require('pako');
import { LoggerService } from './LogService'
import SocksProxyAgent = require('socks-proxy-agent');
import { EventEmitter2 } from 'eventemitter2';

export class WSClient extends EventEmitter2 {
    private WS_URL: string;
    private logger: LoggerService;
    private ws: WebSocket;
    private symbols: string[];
    constructor() {
        super();
        this.logger = new LoggerService();
        this.WS_URL = 'wss://api.huobi.pro/ws';
        this.symbols = ['eosusdt'];
    }

    handle(data) {
        // console.log('received', data.ch, 'data.ts', data.ts, 'crawler.ts', moment().format('x'));
        let symbol = data.ch.split('.')[1];
        let channel = data.ch.split('.')[2];
        switch (channel) {
            case 'depth':
                this.emit('depth', data.tick);
                break;
            case 'trade':
                this.emit('trade', data.tick);
                break;
            case 'detail':
                this.emit('detail', data.tick);
                break;
            case 'kline':
                this.logger.debug('kline', data.tick);
                this.emit('kline', data.tick);
                break;
        }
    }

    init() {
        try{
            this.ws = new WebSocket(this.WS_URL, { agent: new SocksProxyAgent("socks://127.0.0.1:1080") });
            this.ws.on('open', () => {
                this.logger.info('open ws......');
                // 订阅深度
                // 谨慎选择合并的深度，ws每次推送全量的深度数据，若未能及时处理容易引起消息堆积并且引发行情延时
                for (let symbol of this.symbols) {
                    this.ws.send(JSON.stringify({
                        "sub": `market.${symbol}.depth.step0`,
                        "id": `${symbol}`
                    }));
                }
    
                // 订阅K线
                // for (let symbol of symbols) {
                //     this.ws.send(JSON.stringify({
                //         "sub": `market.${symbol}.kline.1min`,
                //         "id": `${symbol}`
                //     }));
                // }
    
                // 订阅trade
                // market.$symbol.trade.detail 
                for (let symbol of this.symbols) {
                    this.ws.send(JSON.stringify({
                        "sub": `market.${symbol}.trade.detail`,
                        "id": `${symbol}`
                    }));
                }
    
    
                // 订阅detail
                for (let symbol of this.symbols) {
                    this.ws.send(JSON.stringify({
                        "sub": `market.${symbol}.detail`,
                        "id": `${symbol}`
                    }));
                }
    
            });
            this.ws.on('message', (data) => {
                let text = pako.inflate(data, {
                    to: 'string'
                });
                let msg = JSON.parse(text);
                if (msg.ping) {
                    this.ws.send(JSON.stringify({
                        pong: msg.ping
                    }));
                } else if (msg.tick) {
                    this.handle(msg);
                } else {
                    this.logger.debug(text);
                }
            });
            this.ws.on('close', () => {
                this.logger.info('ws close......');
                this.init();
            });
            this.ws.on('error', err => {
                this.logger.error('ws error', err);
                this.init();
            });
        }catch(ex){
            this.logger.error('init error', ex);
            this.init();
        }
       
    }
}