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
    private orders: Order[];
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
        this.orders = [];
        this.useCapital = max || 200;
        this.totalCoins = 0;
        this.accountTradeCoins = 0;
        this.accountTradeUSDT = 0;
        this.priceDiffAvg10 = 0;
        this.priceDiffAvg20 = 0;
        this.readyData = false;
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
                this.logger.debug(`close:${close},均10:[${avg10s.toFixed(4)} | ${this.priceDiffAvg10}],均20:[ ${avg20s.toFixed(4)} | ${this.priceDiffAvg20}]`);
                this.lastPrices.pop();
                this.lastPrices.unshift(close);
                if (this.readyData && this.priceDiffAvg10 > 0.01) {
                    this.buyCoins()
                        .then(res => {
                        })
                        .catch(err => {
                            this.logger.error('buyCoins error')
                        })
                }
                else if (this.readyData && this.priceDiffAvg10 < -0.01) {
                    this.checkSelling()
                        .then(res => {
                        })
                        .catch(err => {
                            this.logger.error('sellCoins error')
                        })
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
            this.logger.debug('accountInfo:', accountInfo);
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
                        this.accountTradeCoins = item.balance;
                    }
                }
            }
            this.logger.debug(`blance:USDT-${this.accountTradeUSDT},Coins-${this.accountTradeCoins}`);

            if (this.accountTradeUSDT < this.useCapital) {
                this.logger.warn(`账户可用余额不足:${this.useCapital}!!`);
                // const orderId = await this.hbSDK.sell_limit(this.marginEosusdtID,'eosusdt',0.1,28.001);
                // this.logger.debug('order',orderId)
                // const orderDetail = await this.hbSDK.get_order(orderId);
                // this.logger.debug('order detail:',orderDetail)
                //  return;
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

                    this.LLDPE = 0;

                    let buy5 = 0;
                    let buy20 = 0;
                    let sell5 = 0, sell20 = 0;

                    for (let i = 0; i < 5; i++) {
                        buy5 += this.buyMounts[i];
                        sell5 += this.sellMounts[i];
                    }

                    for (let i = 0; i < 20; i++) {
                        buy20 += this.buyMounts[i];
                        sell20 += this.sellMounts[i];
                    }

                    buy5 = Math.ceil(buy5 / 5);
                    buy20 = Math.ceil(buy20 / 20);

                    sell5 = Math.ceil(sell5 / 5);
                    sell20 = Math.ceil(sell20 / 20);

                    // console.log(this.buyMounts.join(','));
                    // console.log(this.sellMounts.join(','));


                    let newBuy, newSell = 0; // 买卖手趋势
                    let buyBig = 0, sellBig = 0; // 买单是卖单的倍数
                    if (buy5 > buy20) {
                        newBuy = +((buy5 / buy20).toFixed(2));
                        // this.LLDPE += newBuy * 5;
                    }

                    if (buy5 > sell5) {
                        buyBig = +((buy5 / sell5).toFixed(2));
                        this.LLDPE += buyBig * Math.ceil(buy5 / 100);
                    }

                    if (sell5 > sell20) {
                        newSell = +((sell5 / sell20).toFixed(2));
                        // this.LLDPE -= newSell * 5;
                    }

                    if (sell5 > buy5) {
                        sellBig = +((sell5 / buy5).toFixed(2));
                        this.LLDPE -= sellBig * Math.ceil(sell5 / 100);
                    }




                    let price5 = 0, price20 = 0;
                    for (let i = 0; i < 5; i++) {
                        price5 += this.lastPrices[i];
                    }
                    for (let i = 0; i < 20; i++) {
                        price20 += this.lastPrices[i];
                    }
                    price5 = +(price5 / 5).toFixed(3);
                    price20 = +(price20 / 20).toFixed(3);
                    //console.log(this.lastPrices.join(','))
                    const priceCha = Math.ceil((((this.closePrice - price5) / this.openPrice) * 10000));
                    this.LLDPE += priceCha;





                    let buyTrade5 = 0;
                    let buyTrade20 = 0;
                    let sellTrade5 = 0, sellTrade20 = 0;

                    for (let i = 0; i < 5; i++) {
                        buyTrade5 += this.buyTradeMounts[i];
                        sellTrade5 += this.sellTradeMounts[i];
                    }

                    for (let i = 0; i < 20; i++) {

                        buyTrade20 += this.buyTradeMounts[i];
                        sellTrade20 += this.sellTradeMounts[i];
                    }



                    buyTrade5 = Math.ceil(buyTrade5 / 5);
                    buyTrade20 = Math.ceil(buyTrade20 / 20);

                    sellTrade5 = Math.ceil(sellTrade5 / 5);
                    sellTrade20 = Math.ceil(sellTrade20 / 20);


                    let newBuyTrade, newSellTrade = 0; // 成交方向趋势
                    let buyBigTrade = 0, sellBigTrade = 0; // 成交方向趋势
                    if (buyTrade5 > buyTrade20) {
                        newBuyTrade = +((buyTrade5 / buyTrade20).toFixed(2));
                        // this.LLDPE += newBuyTrade * 10;
                    }
                    if (buyTrade5 > sellTrade5) {
                        buyBigTrade = +((buyTrade5 / sellTrade5).toFixed(2));
                        // this.LLDPE += buyBigTrade * Math.ceil(buyTrade5 / 100);;
                    }

                    if (sellTrade5 > sellTrade20) {
                        newSellTrade = +((sellTrade5 / sellTrade20).toFixed(2));
                        // this.LLDPE -= newSellTrade * 10;
                    }

                    if (sellTrade5 > buyTrade5) {
                        sellBigTrade = +((sellTrade5 / buyTrade5).toFixed(2));
                        // this.LLDPE -= sellBigTrade * Math.ceil(sellTrade5 / 100);
                    }

                    this.LLDPE = Math.ceil(this.LLDPE);

                    this.logger.debug(`最新:${this.closePrice},趋势:${this.LLDPE},买卖盘:[${buy5} - ${sell5}],买卖成:[${buyTrade5} - ${sellTrade5}],涨幅:${priceCha},财富:${this.totalCoins * this.closePrice + this.useCapital}$`);

                    await this.checkSelling();
                    // const lastTime = 1525679665;
                    // const { tbTime, tbValue } = await this.hbSDK.check_outEth();
                    // if (this.lastTBTime < 0) {
                    //     this.lastTBTime = tbTime;
                    // }
                    // else if (tbTime > this.lastTBTime && tbValue > 10000) {
                    //     console.log('提币了');
                    //     this.lastTBTime = tbTime;
                    // } else {
                    //     // console.log({tbTime, tbValue});
                    // }
                    await this.wait(5000);
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
            const order0: Order = this.orders[0];
            const now = new Date();
            const buyPrice = this.closePrice; // 关注买入价格什么更合适
            if (!order0 || order0.state === 'selled') {
                const newOrder: Order = {
                    orderId: now.getTime(),
                    sellCoins: -1,
                    sellPrice: -1,
                    state: 'buyed',
                    buyPrice: buyPrice,
                    hightPrice: buyPrice,
                    buyCoins: this.useCapital / buyPrice,
                    buyTime: -1,
                    sellTime: -1,
                }
                this.useCapital = 0;
                this.totalCoins = newOrder.buyCoins;
                this.orders.unshift(newOrder);
                this.logger.info(`购买订单:${this.closePrice} - ${newOrder.buyCoins},LLDPE:${this.LLDPE}`);
            } else {
                this.logger.info(`还有订单未卖出,LLDPE:${this.LLDPE},买入价：${order0.buyPrice}`);
            }

        } catch (ex) {
            this.logger.error('买入时发生错误：', ex);
        }
    }

    async checkBuying() {
        try {
            const order0: Order = this.orders[0];
            const now = new Date();
            if (order0 && order0.state === 'buying' && this.closePrice <= order0.buyPrice) {
                this.orders[0].state = 'buyed';
                this.orders[0].buyTime = now.getTime();
                console.log('订单买入成功！');
            }

        } catch (ex) {
            console.error('检查买入时发生错误：', ex);
        }
    }

    async sellCoins() {
        try {
            const order0: Order = this.orders[0];
            const now = new Date();
            if (!order0) {
                this.logger.info(`还没有订单,LLDPE:${this.LLDPE}`);
            } else if (order0.state === 'buyed') {
                this.orders[0].state = 'selled';
                this.orders[0].sellPrice = this.closePrice;
                this.orders[0].sellCoins = this.orders[0].buyCoins;
                this.useCapital = this.closePrice * this.orders[0].buyCoins;
                this.totalCoins = 0;
                this.logger.info(`卖出订单:${this.orders[0].buyPrice} - ${this.closePrice} ,LLDPE:${this.LLDPE}`);
            } else {
                this.logger.info(`订单已经卖出!LLDPE:${this.LLDPE}`);
            }
        } catch (ex) {
            this.logger.error('卖出时发生错误：', ex);
        }
    }

    async checkSelling() {
        try {
            const order0: Order = this.orders[0];
            const now = new Date();
            const zrPrice = this.openPrice * 0.01; //止损价格
            if (order0 && order0.state === 'buyed') {
                if (order0.hightPrice - this.closePrice > zrPrice) {
                    this.logger.warn('止损卖出订单:', this.orders[0]);
                    await this.sellCoins();
                }
                else if (this.closePrice > order0.hightPrice) {
                    this.orders[0].hightPrice = this.closePrice;
                }
            }
        } catch (ex) {
            this.logger.error('检查买入时发生错误：', ex);
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