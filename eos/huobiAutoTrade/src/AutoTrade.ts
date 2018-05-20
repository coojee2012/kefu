import { HuoBiSDK } from './hbsdk';
import { LoggerService } from './LogService';
import { WSClient } from './wsClient';
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
    private MMQS: number; //买手卖手强弱趋势 ，当买手多时+1 当卖手多时 -1

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
    private readyData: boolean;
    private buyPriceWeight: number; // 自动买入权重，初始为0.01$ 或 根据开盘价百分比计算，当发生一次卖单哦，权重在3分钟之内上升到0.3或3倍初始
    private sellPriceWeight: number;
    private lastSellTime: number;
    private lastOrderHPrice: number;
    private isSellAllConins: boolean;
    private allConinUsdt: number;
    private BCPrice: number;

    private canBuying:boolean;

    constructor(privateKey, max) {
        this.hbSDK = new HuoBiSDK(privateKey);
        this.logger = new LoggerService();

        this.LLDPE = 0;
        this.MMQS = 0;
        this.lastPrice = -1;
        this.tradeQS = 0;
        this.tradeFXQS = 0;
        this.lastTradeTotal = 0;
        this.lastPrices = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        this.buyMounts = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        this.sellMounts = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

        this.buyTradeMounts = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        this.sellTradeMounts = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        this.tradeIds = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

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
        this.readyData = false;
        this.buyPriceWeight = 0;
        this.lastSellTime = 0;
        this.lastOrderHPrice = 0;
        this.isSellAllConins = false;
        this.allConinUsdt = 0;
        this.BCPrice = 11.3;
        this.canBuying = false;

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
            this.openPrice = open;
            this.closePrice = close;

            if (close !== this.lastPrices[0]) {
                const zj10s = this.lastPrices.slice(1, 11);
                const avg10s = this.sumArray(zj10s) / 10;

                const zj20s = this.lastPrices.slice(1);
                const avg20s = this.sumArray(zj20s) / 20;
                this.priceDiffAvg10 = +(close - avg10s).toFixed(4);
                this.priceDiffAvg20 = +(close - avg20s).toFixed(4);
                this.logger.debug(`open:${open},close:${close},均10:[${avg10s.toFixed(4)} | ${this.priceDiffAvg10}],均20:[ ${avg20s.toFixed(4)} | ${this.priceDiffAvg20}]`);
                this.lastPrices.pop();
                this.lastPrices.unshift(close);
                if (this.readyData && this.priceDiffAvg10 > this.buyPriceWeight && this.closePrice > this.BCPrice && !this.canBuying) {
                   this.canBuying = true;
                  //   this.buyCoins()
                  //       .then(res => {
                  //       })
                  //       .catch(err => {
                  //           this.logger.error('buyCoins error',err)
                  //       })

                  //   if (this.isSellAllConins && this.allConinUsdt > 0) {
                  //       this.buyAllCoins()
                  //           .then(res => {
                  //           })
                  //           .catch(err => {
                  //               this.logger.error('buyAllCoins error')
                  //           })
                  //   }
                }
                else if (this.readyData && this.priceDiffAvg10 < -this.buyPriceWeight) {
                    // this.checkSelling()
                    //     .then(res => {
                    //     })
                    //     .catch(err => {
                    //         this.logger.error('sellCoins error')
                    //     })
                }
            }
        }
        catch (ex) {
            this.logger.error('observePrice error:', ex);
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
                        this.accountTradeUSDT = item.balance;
                    }
                    else if (item.currency === 'eos' && item.type === 'trade') {
                        this.accountTradeCoins =  Math.floor(+item.balance * 10000)/10000;
                    }
                }
            }
            this.logger.debug(`blance:USDT-${this.accountTradeUSDT},Coins-${this.accountTradeCoins}`);

            if (this.accountTradeUSDT < this.useCapital) {
                this.logger.warn(`账户可用余额不足:${this.useCapital}!!`);
                return;
            }

            this.ws = new WSClient();
            this.ws.init();
            this.ws.on('depth', this.observeDepth.bind(this));
            this.ws.on('trade', this.observeTrade.bind(this));
            this.ws.on('detail', this.observePrice.bind(this))


            while (2 > 1) {
                try {
                    let now = new Date().getTime();
                    if (now - this.startTime < 60 * 1000) {
                        this.logger.debug(`业务数据准备中....请稍后....${60 - Math.ceil((now - this.startTime) / 1000)} (^_^)`);
                        await this.wait(5 * 1000);
                        continue;
                    }

                    this.readyData = true;
                    if (this.lastSellTime === 0 || now - this.lastSellTime > 15 * 60 * 1000) {
                        this.buyPriceWeight = +(this.openPrice * 0.0015).toFixed(3);
                    }

                    this.LLDPE = 0;
                    let buy5 = this.sumArray(this.buyMounts.slice(0, 5));
                    let sell5 = this.sumArray(this.sellMounts.slice(0, 5));
                    let buyTrade5 = Math.ceil(this.sumArray(this.buyTradeMounts.slice(0, 5)));
                    let sellTrade5 = Math.ceil(this.sumArray(this.sellTradeMounts.slice(0, 5)));
                    this.logger.debug(`盘口:[${buy5} - ${sell5}],成交量:[${buyTrade5} - ${sellTrade5}],买入权重:${this.buyPriceWeight}$,财富:${this.totalCoins * this.closePrice + this.useCapital}$`);

                    if(this.canBuying){
                      this.buyCoins()
                        .then(res => {
                          this.canBuying = false;
                        })
                        .catch(err => {
                            this.logger.error('buyCoins error',err)
                            this.canBuying = false;
                        })

                    if (this.isSellAllConins && this.allConinUsdt > 0) {
                        this.buyAllCoins()
                            .then(res => {
                              this.canBuying = false;
                            })
                            .catch(err => {
                              this.canBuying = false;
                                this.logger.error('buyAllCoins error')
                            })
                    }
                    }
                    await this.checkSelling();
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

    async buyCoins() {
        try {
            const now = new Date();
            if (!this.order) {
                this.order = {
                    orderId: new Date().getTime(),
                    buyId: -1,
                    sellId: -1,
                    sellCoins: -1,
                    sellPrice: -1,
                    state: 'buying',
                    buyPrice: 0,
                    hightPrice: 0,
                    buyCoins: 0,
                    buyTime: -1,
                    sellTime: -1,
                }
                const orderId = await this.hbSDK.buy_market(this.marginEosusdtID, 'eosusdt', this.useCapital);
                if(!orderId){
                  this.logger.error('buy coins error:',orderId);
                  this.order = null;
                  return;
                }
                this.order.buyId = orderId;
                const orderInfo = await this.orderFillCheck(orderId);

                this.logger.info('buy oderInfo:', orderInfo);
                const buyPrice = (+ orderInfo['field-cash-amount']) / (+orderInfo['field-amount']);

                this.order.buyPrice = Math.floor(buyPrice * 10000) / 10000;

                this.order.hightPrice = this.order.buyPrice;

                this.order.buyCoins = Math.floor(((+orderInfo['field-amount']) - (+orderInfo['field-fees'])) * 10000) / 10000;

                this.order.state = 'buyed';




                this.useCapital = 0;
                this.totalCoins = this.order.buyCoins;
                this.logger.info(`购买${this.priceDiffAvg10}订单:${this.order.buyPrice} - ${this.order.buyCoins}`);
            } else {
                this.logger.info(`行情${this.priceDiffAvg10}BUY BUY  BUY,买入价：${this.order.buyPrice}`);
            }

        } catch (ex) {
            this.logger.error('买入时发生错误：', ex);
            if(this.order && this.order.buyId === 1 ){
              this.order = null;
            }

        }
    }

    async orderFillCheck(orderId) {
        try {
          if(!orderId){
            this.logger.error('orderFillCheck error:',orderId);
            return;
          }
            const orderInfo = await this.hbSDK.get_order(orderId);
            if (orderInfo && orderInfo.state === 'filled') {
                return orderInfo;
            } else {
                return await this.orderFillCheck(orderId);
            }
        } catch (ex) {
            this.logger.error('检查买入时发生错误：', ex);
        }
    }

    async sellCoins() {
        try {
            const now = new Date();
            if (this.order && this.order.state === 'buyed') {
                const orderId = await this.hbSDK.sell_market(this.marginEosusdtID, 'eosusdt', this.totalCoins);
                if(!orderId){
                  this.logger.error('sell coins error:',orderId);
                  return;
                }
                this.order.sellId = orderId;
                const orderInfo = await this.orderFillCheck(orderId);
                this.logger.info('sell oderInfo:', orderInfo);
                this.order.state = 'selled';
                const sellPrice = (+ orderInfo['field-cash-amount']) / (+orderInfo['field-amount']);
                this.order.sellPrice = Math.floor(sellPrice * 10000) / 10000;
                this.order.sellCoins = +(+orderInfo['field-amount']).toFixed(4);
                this.useCapital = Math.floor(((+orderInfo['field-cash-amount']) - (+orderInfo['field-fees'])) * 10000) / 10000;
                this.totalCoins = 0;
                this.lastSellTime = new Date().getTime();
                this.buyPriceWeight = +(this.openPrice * 0.005).toFixed(3);
                this.logger.info(`卖出${this.priceDiffAvg10}订单,获利:${this.order.sellPrice - this.order.buyPrice}$`);
                this.order = null;
            } else {
                this.logger.info(`行情${this.priceDiffAvg10}SELL SELL SELL,BUT NO ORDERS(^_^）`);
            }
        } catch (ex) {
            this.logger.error('卖出时发生错误：', ex);
        }
    }

    async checkSelling() {
        try {
            const now = new Date();
            const zrPrice = this.openPrice * 0.015; //止损价格 测试阶段为0.001 正式为0.01
            if (this.order && this.order.state === 'buyed') {
                if (this.order.hightPrice - this.closePrice > zrPrice) {
                    this.logger.warn(`止损卖出订单:${this.order.orderId},${this.order.buyPrice},${this.order.hightPrice},${this.order.buyCoins}`, );
                    await this.sellCoins();
                }
                else if (this.closePrice > this.order.hightPrice) {
                    this.order.hightPrice = this.closePrice;
                    this.lastOrderHPrice = this.order.hightPrice;
                }
            }

            if ((this.lastOrderHPrice - this.closePrice) > 2 * zrPrice && this.accountTradeCoins > 0) {
                this.logger.warn(`止损卖出所有币:${this.accountTradeCoins}`);
                await this.sellAllCoins();
            }

            else if (this.closePrice < this.BCPrice && this.accountTradeCoins > 0) {
                this.logger.warn(`要爆仓卖出所有币:${this.accountTradeCoins}`);
                await this.sellAllCoins();
            }

        } catch (ex) {
            this.logger.error('检查买入时发生错误：', ex);
        }
    }



    async sellAllCoins() {
        try {

            const orderId = await this.hbSDK.sell_market(this.marginEosusdtID, 'eosusdt', Math.floor((this.accountTradeCoins/2)*1000/10000));
            if(!orderId){
              this.logger.error('sell all coins error:',orderId);
              return;
            }
            this.order.sellId = orderId;
            const orderInfo = await this.orderFillCheck(orderId);
            this.logger.info('sell all oderInfo:', orderInfo);

            this.isSellAllConins = true;
            const sellPrice = (+ orderInfo['field-cash-amount']) / (+orderInfo['field-amount']);
            const sellCoins = +(+orderInfo['field-amount']).toFixed(4);
            this.allConinUsdt = Math.floor(((+orderInfo['field-cash-amount']) - (+orderInfo['field-fees'])) * 10000) / 10000;

            this.lastSellTime = new Date().getTime();
            this.buyPriceWeight = +(this.openPrice * 0.008).toFixed(3);
            orderId
        } catch (ex) {
            this.logger.error('卖出时发生错误：', ex);
        }
    }

    async buyAllCoins() {
        try {
            const orderId = await this.hbSDK.buy_market(this.marginEosusdtID, 'eosusdt', this.allConinUsdt);
            if(!orderId){
              this.logger.error('buy all coins error:',orderId);
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
