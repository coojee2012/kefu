import { HuoBiSDK } from './hbsdk';
import { LoggerService } from './LogService';
import { WSClient } from './wsClient';
import fs = require('fs');
import macd = require('macd');
export type Order = {
    orderId: number;
    buyPrice: number;
    buyCoins: number;
    hightPrice: number;
    sellPrice: number;
    sellCoins: number;
    buyTime: number;
    sellTime: number;
    buyId: number;
    sellId: number;
    state: string; // buying,buyed,selling,selled,canncel
}
export class AutoTrade {
    private hbSDK: HuoBiSDK;
    private marginAadausdtID: number;
    private marginEosusdtID: number;
    private openPrice: number;  // 开盘价格
    private closePrice: number; // 最新价格
    private nowPrice: number;
    private sell0Price: number;
    private sell0Mount: number;
    private buy0Price: number;
    private buy0Mount: number;
    private lastPrice: number;
    private LLDPE: number; //震荡趋势
    private MMQS: number; // 多头卖出1次 用于控制多头只买进一次

    private sellMounts: number[];
    private buyMounts: number[];
    private startTime: number;
    private lastAnalyzeTime: number;

    private tradeBuying: boolean; // 一个分析周期的结果为 买手多
    private tradeSelling: boolean; // 一个分析周期的结果为 卖手多
    private order: Order;
    private useCapital: number; // 使用本金USDT，启动时从参数传入，系统会检查使用金不会超过账户所有资金的50%
    private totalCoins: number; // 总获利


    private buyTradeMounts: number[];
    private sellTradeMounts: number[];
    private tradeIds: number[];
    private lastTradeTotal: number;
    private tradeQS: number; // 实际成交量趋势
    private tradeFXQS: number; // 实际成交量方向趋势

    private lastTBTime: number; // 上次提币时间

    private lastPrices: number[];// 保留20个最近的成交价

    private ws: WSClient;
    private logger: LoggerService;

    private accountTradeUSDT: number; // 交易账户可用USDT
    private accountTradeCoins: number; // 交易账户可用币

    private priceDiffAvg10: number;
    private priceDiffAvg20: number;
    private priceDiffAvg60: number;
    private readyData: boolean;
    private buyPriceWeight: number; // 自动买入权重，初始为0.01$ 或 根据开盘价百分比计算，当发生一次卖单哦，权重在3分钟之内上升到0.3或3倍初始
    private sellPriceWeight: number;
    private lastSellTime: number;
    private lastOrderHPrice: number;
    private isSellAllConins: boolean;
    private allConinUsdt: number;
    private BCPrice: number;

    private canBuying: boolean;
    private canSelling: boolean;
    private kline1min: number[];
    private lastKLineId: number;
    private lastSellPrice: number;
    private MACDData:any;

    constructor(privateKey, max) {
        this.hbSDK = new HuoBiSDK(privateKey);
        this.logger = new LoggerService();

        this.LLDPE = 0;
        this.MMQS = 0;
        this.lastPrice = -1;
        this.tradeQS = 0;
        this.tradeFXQS = 0;
        this.lastTradeTotal = 0;
        this.lastPrices = [];
        this.buyMounts = [];
        this.sellMounts = [];

        this.buyTradeMounts = [];
        this.sellTradeMounts = [];
        this.tradeIds = [];

        this.startTime = new Date().getTime();
        this.lastAnalyzeTime = this.startTime;

        this.tradeBuying = false;
        this.tradeSelling = false;
        this.order = null;
        this.useCapital = max || 1.3;
        this.totalCoins = 0;
        this.accountTradeCoins = 0;
        this.accountTradeUSDT = 0;
        this.priceDiffAvg10 = 0;
        this.priceDiffAvg20 = 0;
        this.priceDiffAvg60 = 0;
        this.readyData = false;
        this.buyPriceWeight = 0;
        this.lastSellTime = 0;
        this.lastOrderHPrice = 0;
        this.isSellAllConins = false;
        this.allConinUsdt = 0;
        this.BCPrice = 11.3;
        this.canBuying = false;
        this.canSelling = false;
        this.kline1min = [];
        this.lastKLineId = -1;
        this.lastSellPrice = 0;
        this.MACDData = null;

    }




    observeDepth(depthData) {
        try {
            // this.logger.debug('depthData:', depthData);
            let bids10Count = 0;
            let asks10Count = 0;
            let bids20Count = 0;
            let asks20Count = 0;

            for (let i = 0, j = 10; i < 10; i++ , j++) {
                bids10Count += depthData.bids[i][1];
                asks10Count += depthData.asks[i][1];

                bids20Count += depthData.bids[i][1];
                asks20Count += depthData.asks[i][1];

                bids20Count += depthData.bids[j][1];
                asks20Count += depthData.asks[j][1];
            }

            this.buyMounts.pop();
            this.buyMounts.unshift(Math.ceil(bids10Count / 10));
            this.sellMounts.pop();
            this.sellMounts.unshift(Math.ceil(asks10Count / 10));
        } catch (ex) {
            this.logger.error('observeDepth error:', ex);
        }


    }


    observeTrade(data) {
        try {
            if (data) {
                // this.logger.debug('tradeData:', data);
                const tradeId = data.id;
                const tradeData = data.data
                if (this.tradeIds.indexOf(tradeId) < 0) {
                    this.tradeIds.pop();
                    this.tradeIds.unshift(tradeId);

                    for (let j = 0; j < tradeData.length; j++) {
                        if (tradeData[j].direction === 'sell') {
                            this.sellTradeMounts.pop();
                            this.sellTradeMounts.unshift(tradeData[j].amount);
                        } else if (tradeData[j].direction === 'buy') {
                            this.buyTradeMounts.pop();
                            this.buyTradeMounts.unshift(tradeData[j].amount);
                        }
                    }
                    //console.log(this.buyTradeMounts, this.sellTradeMounts);
                }
            }

        } catch (ex) {
            this.logger.error('observeTrade error:', ex);
        }

    }

    observePrice(data) {
        try {
            // this.logger.debug('observePrice',data);
            const { amount, open, close, high } = data;
            // this.openPrice = open;
            this.closePrice = close;
            if (this.lastPrices.length && this.lastPrices.length > 1800) {
                this.lastPrices.pop();
            }
            // if (close === this.lastPrices[0]) {
            //     return;
            // }



            //this.logger.debug('Math.abs(this.lastPrices[0] - close)', Math.abs(this.lastPrices[0] - close))
            if (!this.lastPrices[0] || Math.abs(this.lastPrices[0] - close) > 0) {
                //this.aT(close);
            }
            this.lastPrices.unshift(close);

            if (this.lastPrices.length < 61) {
                this.logger.debug('this.lastPrices.length:',this.lastPrices.length,close);
                return;
            }





            const zj5s = this.lastPrices.slice(0, 5);
            const avg5s = Math.floor(this.sumArray(zj5s) / 5 * 10000) / 10000;

            const zj10s = this.lastPrices.slice(0, 10);
            const avg10s = Math.floor(this.sumArray(zj10s) / 10 * 10000) / 10000;

            const zj20s = this.lastPrices.slice(0, 20);
            const avg20s = Math.floor(this.sumArray(zj20s) / 20 * 10000) / 10000;

            const zj60s = this.lastPrices.slice(0, 60);
            const avg60s = Math.floor(this.sumArray(zj60s) / 60 * 10000) / 10000;

            const zj5min = this.kline1min.slice(-5);
            const avg5min = Math.floor(this.sumArray(zj5min) / 5 * 10000) / 10000;

            const zj10min = this.kline1min.slice(-10);
            const avg10min = Math.floor(this.sumArray(zj10min) / 10 * 10000) / 10000;

            const zj30min = this.kline1min.slice(-30);
            const avg30min = Math.floor(this.sumArray(zj30min) / 30 * 10000) / 10000;

            const zj60min = this.kline1min.slice(-60);
            const avg60min = Math.floor(this.sumArray(zj60min) / 60 * 10000) / 10000;

            this.priceDiffAvg10 = +(avg5s - avg10s).toFixed(4);
            this.priceDiffAvg20 = +(avg5s - avg20s).toFixed(4);
            this.priceDiffAvg60 = +(avg5s - avg60s).toFixed(4);

            const bias5 = Math.floor((avg5s - avg5min) / avg5min * 10000) / 10000;
            const bias10 = Math.floor((avg5s - avg10min) / avg10min * 10000) / 10000;
            const bias30 = Math.floor((avg5s - avg30min) / avg30min * 10000) / 10000;
            const bias60 = Math.floor((avg5s - avg60min) / avg60min * 10000) / 10000;

            this.logger.debug(`${avg5s},${avg10s},${avg20s}    ${avg5min},${avg10min},${avg30min},${avg60min} ${bias5},${bias10},${bias30},${bias60}`);

            // this.logger.debug(`${avg5s.toFixed(4)} ${avg10s.toFixed(4)} ${avg20s.toFixed(4)} ${avg60s.toFixed(4)}  |  ${this.priceDiffAvg10} ${this.priceDiffAvg20} ${this.priceDiffAvg60}`);
            // if (this.priceDiffAvg60 > this.buyPriceWeight && this.closePrice > this.BCPrice && !this.canBuying) {
            //     this.logger.info(`Market  chance come on:${this.priceDiffAvg10} ${this.priceDiffAvg20} ${this.priceDiffAvg60}`);
            //     //this.canBuying = true;
            // }
            this.logger.debug(`has order?${!!this.order},${this.canSelling},${this.canBuying}`);
            if (!this.canSelling) {
                // 位于60分钟均线一下直接卖
                if (avg5min < avg10min && avg10min < avg30min) {
                   // this.logger.info('You Mast Sell Sell Sell! 0 ');
                    this.canSelling = !!this.order && true;
                }
                // 高于60分钟均线 只要不亏就卖
                else if (avg5s < avg5min && avg5min < avg10min && avg5min > avg30min && avg30min > avg60min) {
                   // this.logger.info(`You Should Think About Sell Sell Sell!   ${avg5min - avg30min} ${avg5min - avg60min} `);
                    if (!!this.order) {
                        const suiPrice = this.order.buyPrice * 0.006;
                       // if (close - this.order.buyPrice > suiPrice) {
                            this.canSelling = !!this.order && true;
                      // }
                    }
                }
            }

            if (!this.canBuying) {
                if (Math.abs(bias60) < 0.002 &&  avg5min > avg10min && avg10min > avg30min) {
                        this.logger.info('You Mast Buy Buy Buy!');
                        this.canBuying = !this.MMQS &&  !this.order && true;
                }
            }

            if(this.MMQS === 1 && avg5min < avg60min){
                this.MMQS = 0;
            }

        }
        catch (ex) {
            this.logger.error('observePrice error:', ex);
        }
    }

    aT(close) {
        try {

            if (this.sellMounts.length) {
                for (let i = 0; i < this.sellMounts.length; i++) {

                    if (close > this.sellMounts[i]) {
                        this.sellTradeMounts.unshift(this.sellMounts[i]);
                        this.sellMounts.splice(i, 1);
                    }

                }

            }

            if (this.buyMounts.length) {
                for (let i = 0; i < this.buyMounts.length; i++) {
                    if (close < this.buyMounts[i]) {
                        this.buyTradeMounts.unshift(this.buyMounts[i]);
                        this.buyMounts.splice(i, 1);
                    }
                }
            }

            const buy0price = Math.floor((close - (close * 0.003)) * 10000) / 10000;
            const buy1price = Math.floor((close - (close * 0.004)) * 10000) / 10000;
            const sell0price = Math.floor((close + (close * 0.003)) * 10000) / 10000;
            const sell1price = Math.floor((close + (close * 0.004)) * 10000) / 10000;
            if (this.buyMounts.length < 20) {
                this.buyMounts.unshift(buy0price);
            }
            if (this.buyMounts.length < 20) {
                this.buyMounts.unshift(buy1price);
            }

            if (this.sellMounts.length < 20) {
                this.sellMounts.unshift(sell0price);
            }
            if (this.sellMounts.length < 20) {
                this.sellMounts.unshift(sell1price);
            }

            this.logger.debug('sellMounts:', this.sellMounts.length, 'sell usdts:', this.sumArray(this.sellMounts))
            this.logger.debug('sellTradeMounts:', this.sellTradeMounts.length, 'sell trade usdt:', this.sumArray(this.sellTradeMounts))

            this.logger.debug('buyMounts:', this.buyMounts.length, 'buy usdts:', this.sumArray(this.buyMounts))
            this.logger.debug('buyTradeMounts:', this.buyTradeMounts.length, 'buy trade usdt:', this.sumArray(this.buyTradeMounts))


        } catch (ex) {
            this.logger.debug('at error:', ex);

        }
    }

    observekline(data) {
        try {
            if (data) {
                // this.logger.debug('observekline:', data);
                const { amount, count, open, close, high, low, vol, id } = data;
                if (this.lastKLineId === id) {
                    // this.logger.debug('Kline Id Same');
                    this.kline1min[0] = close;
                } else {
                    this.lastKLineId = id;
                    //this.kline1min.pop();
                    //this.kline1min.unshift(close);
                    this.kline1min.shift();
                    this.kline1min.push(close);
                    this.MACDData =  macd(this.kline1min);
                    this.logger.debug('MACD:', this.MACDData.MACD.slice(144), this.MACDData.MACD.length);
                    this.logger.debug('signal:', this.MACDData.signal.slice(144), this.MACDData.signal.length);
                    this.logger.debug('histogram:', this.MACDData.histogram.slice(144), this.MACDData.histogram.length);

                    const diff = this.MACDData.MACD.slice(144);
                    const dema = this.MACDData.signal.slice(144);
                    const MAcd = this.MACDData.histogram.slice(144);

                    if(diff[2] < dema [2] && diff[4] > dema[4]){
                      this.logger.info('UP MACD');
                    }else if(diff[2] > dema [2] && diff[4] < dema[4]){
                      this.logger.info('Down MACD');
                    }

                }

            }

        } catch (ex) {
            this.logger.error('observekline error:', ex);
        }
    }

    sortNumber(a, b) {
        return a - b
    }

    async run() {
        try {



            const accountInfo: any[] = await this.hbSDK.get_account();
            // this.logger.debug('accountInfo:', accountInfo);
            for (let i = 0; i < accountInfo.length; i++) {
                const account = accountInfo[i];
                if (account.type === 'margin' && account.subtype === 'adausdt') {
                    this.marginAadausdtID = account.id;
                }
                if (account.type === 'margin' && account.subtype === 'eosusdt') {
                    this.marginEosusdtID = account.id;
                }
            }
            const blance = await this.hbSDK.get_balance(this.marginEosusdtID);
            if (blance && blance.list.length) {
                for (let i = 0; i < blance.list.length; i++) {
                    const item = blance.list[i];
                    if (item.currency === 'usdt' && item.type === 'trade') {
                        this.accountTradeUSDT = Math.floor(+item.balance * 10000) / 10000;
                    }
                    else if (item.currency === 'eos' && item.type === 'trade') {
                        this.accountTradeCoins = Math.floor(+item.balance * 10000) / 10000;
                    }
                }
            }
            this.logger.info(`blance:USDT-${this.accountTradeUSDT},Coins-${this.accountTradeCoins}`);

            if (this.accountTradeUSDT < this.useCapital) {
                this.logger.warn(`账户可用余额不足:${this.useCapital}!!`);
                return;
            }

            const kline60Min = await this.hbSDK.get_kline('eos', 'usdt', '1min', 150);

            if (kline60Min.length) {
                for (let i = 0; i < kline60Min.length; i++) {
                    const { high, low, close } = kline60Min[i];
                    this.kline1min.unshift(close);
                }
                this.openPrice = kline60Min[0].open;
            }
            else {
                this.logger.warn(`Can't Get Today's KLine!!`);
                return;
            }




            // 载入之前程序买入的最后一个订单
            await this.checkHasLastBuyOrder();

            this.ws = new WSClient();
            await new Promise((resolve, reject) => {
                this.ws.init(() => {
                    resolve();
                });
            })

            this.ws.on('depth', this.observeDepth.bind(this));
            this.ws.on('trade', this.observeTrade.bind(this));
            this.ws.on('detail', this.observePrice.bind(this))
            this.ws.on('kline', this.observekline.bind(this));


            while (2 > 1) {
                try {
                    let now = new Date().getTime();
                    if (now - this.startTime < 60 * 1000) {
                        this.logger.debug(`Init Data....Please Wait....${60 - Math.ceil((now - this.startTime) / 1000)} (^_^)`);
                        await this.wait(5 * 1000);
                        continue;
                    }

                    this.readyData = true;

                    if (this.lastSellTime === 0 || now - this.lastSellTime > 60 * 60 * 1000) {
                        this.buyPriceWeight = +(this.openPrice * 0.002).toFixed(3);
                    }

                    this.LLDPE = 0;
                    // let buy5 = this.sumArray(this.buyMounts.slice(0, 5));
                    // let sell5 = this.sumArray(this.sellMounts.slice(0, 5));
                    // let buyTrade5 = Math.ceil(this.sumArray(this.buyTradeMounts.slice(0, 5)));
                    // let sellTrade5 = Math.ceil(this.sumArray(this.sellTradeMounts.slice(0, 5)));
                    // this.logger.debug(`open:${this.openPrice},close:${this.closePrice},tape:[${buy5} - ${sell5}],trans:[${buyTrade5} - ${sellTrade5}],weight:${this.buyPriceWeight},money:${this.totalCoins * this.closePrice + this.useCapital}$`);

                    this.logger.debug(`open:${this.openPrice},close:${this.closePrice},money:${this.totalCoins * this.closePrice + this.useCapital}`);
                    if (this.canBuying) {
                        this.canBuying = false;
                        await this.buyCoins();
                    }
                    if (this.canSelling) {
                        this.canSelling = false;
                        await this.sellCoins();
                    }
                    await this.wait(3000);
                } catch (ex) {
                    this.logger.error('run trade error:', ex);
                }
            }

        }
        catch (ex) {
            this.logger.error('run app error:', ex)
        }
    }


    async writeLastBuyId(orderId) {
        try {
            await new Promise((resolve, reject) => {
                fs.writeFile('order.id', orderId, (err) => {
                    if (err) { reject(err); }
                    else {
                        resolve();
                    }
                })
            })
        } catch (ex) {
            this.logger.error('write last buy id error:', ex);
        }
    }

    async checkHasLastBuyOrder() {
        try {
            const orderId: number = await new Promise<number>((resolve, reject) => {
                fs.readFile('order.id', (err, data) => {
                    if (err) { reject(err); }
                    else {
                        resolve(+data);
                    }
                })
            });

            if (orderId && orderId !== -1) {
                const orderInfo = await this.hbSDK.get_order(orderId);
                if (orderInfo && orderInfo.state === 'filled' && orderInfo.type === 'buy-market') {
                    const buyPrice = (+ orderInfo['field-cash-amount']) / (+orderInfo['field-amount']);
                    this.order = {
                        orderId: new Date().getTime(),
                        buyId: orderId,
                        sellId: -1,
                        sellCoins: -1,
                        sellPrice: -1,
                        state: 'buyed',
                        buyPrice: 0,
                        hightPrice: 0,
                        buyCoins: 0,
                        buyTime: -1,
                        sellTime: -1,
                    }
                    this.order.buyPrice = Math.floor(buyPrice * 10000) / 10000;
                    this.order.hightPrice = this.order.buyPrice;
                    this.order.buyCoins = Math.floor(((+orderInfo['field-amount']) - (+orderInfo['field-fees'])) * 10000) / 10000;

                    this.useCapital = 0;
                    this.totalCoins = this.order.buyCoins;
                    this.logger.debug('last order', this.order);
                }
            }
        } catch (ex) {
            this.logger.error('write last buy id error:', ex);
        }
    }



    async buyCoins() {
        try {
            const now = new Date();
            if (!this.order) {
                const orderId = await this.hbSDK.buy_market(this.marginEosusdtID, 'eosusdt', this.useCapital);
                if (!orderId) {
                    this.logger.error('buy coins error:', orderId);
                    this.order = null;
                    return;
                }

                const orderInfo = await this.orderFillCheck(orderId);

                this.logger.info('buy oderInfo:', orderInfo);
                const buyPrice = (+ orderInfo['field-cash-amount']) / (+orderInfo['field-amount']);

                this.order = {
                    orderId: new Date().getTime(),
                    buyId: orderId,
                    sellId: -1,
                    sellCoins: -1,
                    sellPrice: -1,
                    state: 'buyed',
                    buyPrice: 0,
                    hightPrice: 0,
                    buyCoins: 0,
                    buyTime: -1,
                    sellTime: -1,
                }

                this.order.buyPrice = Math.floor(buyPrice * 10000) / 10000;
                this.order.hightPrice = this.order.buyPrice;
                this.order.buyCoins = Math.floor(((+orderInfo['field-amount']) - (+orderInfo['field-fees'])) * 10000) / 10000;
                this.useCapital = 0;
                this.totalCoins = this.order.buyCoins;
                this.logger.info(`Order:${this.order.buyPrice} - ${this.order.buyCoins}`);
                await this.writeLastBuyId(orderId);
            } else {
                this.logger.debug(`BUY BUY  BUY Price：${this.order.buyPrice}`);
            }

        } catch (ex) {
            this.logger.error('buyCoins error:', ex);
            if (this.order && this.order.buyId === 1) {
                this.order = null;
            }

        }
    }

    async orderFillCheck(orderId) {
        try {
            if (!orderId) {
                this.logger.error('orderFillCheck error:', orderId);
                return;
            }
            const orderInfo = await this.hbSDK.get_order(orderId);
            if (orderInfo && orderInfo.state === 'filled') {
                return orderInfo;
            } else {
                return await this.orderFillCheck(orderId);
            }
        } catch (ex) {
            this.logger.error('orderFillCheck error:', ex);
        }
    }

    async sellCoins() {
        try {
            const now = new Date();
            if (this.order && this.order.state === 'buyed') {
                const orderId = await this.hbSDK.sell_market(this.marginEosusdtID, 'eosusdt', this.totalCoins);
                if (!orderId) {
                    this.logger.error('sell coins error:', orderId);
                    return;
                }
                this.order.sellId = orderId;
                const orderInfo = await this.orderFillCheck(orderId);
                this.logger.info('sell oderInfo:', orderInfo);
                this.order.state = 'selled';
                const sellPrice = (+ orderInfo['field-cash-amount']) / (+orderInfo['field-amount']);
                this.lastSellPrice = sellPrice;
                this.order.sellPrice = Math.floor(sellPrice * 10000) / 10000;
                this.order.sellCoins = +(+orderInfo['field-amount']).toFixed(4);
                this.useCapital = Math.floor(((+orderInfo['field-cash-amount']) - (+orderInfo['field-fees'])) * 10000) / 10000;
                this.totalCoins = 0;
                this.lastSellTime = new Date().getTime();
                this.buyPriceWeight = +(this.openPrice * 0.004).toFixed(3);
                this.MMQS = 1;
                this.logger.info(`Sell Order:${this.order.sellPrice - this.order.buyPrice}$`);
                this.order = null;
                await this.writeLastBuyId('-1');
            } else {
                this.logger.info(`SELL SELL SELL,BUT NO ORDERS(^_^）`);
            }
        } catch (ex) {
            this.logger.error('sellCoins error:', ex);
        }
    }

    async checkSelling() {
        try {
            const now = new Date();
            const zrPrice = this.openPrice * 0.01; //止损价格 测试阶段为0.001 正式为0.01
            if (this.order && this.order.state === 'buyed') {
                const suiPrice = this.order.buyPrice * 0.004;
                if (this.closePrice - this.order.buyPrice > 1.2 * suiPrice) {
                    this.logger.warn(`保收卖出订单:${this.order.orderId},${this.order.buyPrice},${this.order.hightPrice},${this.order.buyCoins}`);
                    await this.sellCoins();
                }
                else if (this.order.buyPrice - this.closePrice > 5 * suiPrice) {
                    this.logger.warn(`止损卖出订单:${this.order.orderId},${this.order.buyPrice},${this.order.hightPrice},${this.order.buyCoins}`);
                    await this.sellCoins();
                }
                else if (this.closePrice > this.order.hightPrice) {
                    this.order.hightPrice = this.closePrice;
                    this.lastOrderHPrice = this.order.hightPrice;
                }
            }

            if ((this.lastOrderHPrice - this.closePrice) > 4 * zrPrice && this.accountTradeCoins > 0) {
                this.logger.warn(`止损卖出所有币:${this.accountTradeCoins}`);
                //await this.sellAllCoins();
            }

            else if (this.closePrice < this.BCPrice && this.accountTradeCoins > 0) {
                this.logger.warn(`要爆仓卖出所有币:${this.accountTradeCoins}`);
                //await this.sellAllCoins();
            }
            else if (this.lastOrderHPrice === 0) {
                this.lastOrderHPrice = this.closePrice;
            }

        } catch (ex) {
            this.logger.error('Check Selling Error:', ex);
        }
    }



    async sellAllCoins() {
        try {
            const toSellCoins = Math.floor(this.accountTradeCoins * 10000) / 10000;
            const orderId = await this.hbSDK.sell_market(this.marginEosusdtID, 'eosusdt', toSellCoins);
            if (!orderId) {
                this.logger.error('sell all coins error:', orderId);
                return;
            }
            const orderInfo = await this.orderFillCheck(orderId);
            this.logger.info('sell all oderInfo:', orderInfo);

            this.isSellAllConins = true;
            const sellPrice = (+ orderInfo['field-cash-amount']) / (+orderInfo['field-amount']);
            const sellCoins = +(+orderInfo['field-amount']).toFixed(4);
            this.allConinUsdt = Math.floor(((+orderInfo['field-cash-amount']) - (+orderInfo['field-fees'])) * 10000) / 10000;

            this.lastSellTime = new Date().getTime();
            this.buyPriceWeight = +(this.openPrice * 0.006).toFixed(3);
        } catch (ex) {
            this.logger.error('卖出时发生错误：', ex);
        }
    }

    async buyAllCoins() {
        try {
            const orderId = await this.hbSDK.buy_market(this.marginEosusdtID, 'eosusdt', this.allConinUsdt);
            if (!orderId) {
                this.logger.error('buy all coins error:', orderId);
                return;
            }
            const orderInfo = await this.orderFillCheck(orderId);
            const buyPrice = (+ orderInfo['field-cash-amount']) / (+orderInfo['field-amount']);
            this.accountTradeCoins = Math.floor(((+orderInfo['field-amount']) - (+orderInfo['field-fees'])) * 10000) / 10000;
            this.allConinUsdt = 0;
            this.isSellAllConins = false;
            this.logger.info(`买入长期持有的coin：${buyPrice} - ${this.accountTradeCoins}`)
        } catch (ex) {
            this.logger.error('买入时发生错误：', ex);
        }
    }

    sumArray(arr: number[]): number {
        let cnt = 0;
        for (let i = 0; i < arr.length; i++) {
            cnt += arr[i];
        }
        return cnt;
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
