import { HuoBiSDK } from './hbsdk';

export type Order = {
    orderId: number;
    buyPrice: number;
    buyCoins: number;
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
    private totalProfit: number; // 总获利


    private buyTradeMounts: number[];
    private sellTradeMounts: number[];
    private tradeIds: number[];
    private lastTradeTotal: number;
    private tradeQS: number; // 实际成交量趋势
    private tradeFXQS: number; // 实际成交量方向趋势

    private lastTBTime: number; // 上次提币时间

    private lastPrices: number[];// 保留20个最近的成交价

    constructor(privateKey) {
        this.hbSDK = new HuoBiSDK(privateKey);
        this.LLDPE = 0;
        this.MMQS = 0;
        this.lastPrice = -1;
        this.tradeQS = 0;
        this.tradeFXQS = 0;
        this.lastTradeTotal = 0;
        this.lastPrices = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
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
        this.useCapital = 200;
        this.totalProfit = 0;
    }


    observeDepth() {
        setTimeout(() => {
            this.hbSDK.get_depth('eos', 'usdt')
                .then((depthData) => {
                    let bids10Count = 0;
                    let asks10Count = 0;
                    let bids20Count = 0;
                    let asks20Count = 0;

                    for (let i = 0, j = 10; i < 10; i++ , j++) {
                        bids10Count += depthData.bids[i][1]
                        asks10Count += depthData.asks[i][1]

                        bids20Count += depthData.bids[i][1]
                        asks20Count += depthData.asks[i][1]

                        bids20Count += depthData.bids[j][1]
                        asks20Count += depthData.asks[j][1]
                    }

                    this.buyMounts.pop();
                    this.buyMounts.unshift(Math.ceil(bids10Count / 10));
                    this.sellMounts.pop();
                    this.sellMounts.unshift(Math.ceil(asks10Count / 10));
                    return this.observeDepth();
                })
                .catch(err => {
                    return this.observeDepth();
                })
        }, 1000)
    }


    observeTrade() {
        setTimeout(() => {
            this.hbSDK.get_trade('eos', 'usdt')
                .then(({tradeData, tradeId }) => {

                   
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
                    return this.observeTrade();
                })
                .catch(err => {
                    return this.observeTrade();
                })
        }, 1000)
    }

    observePrice() {
        setTimeout(() => {
            this.hbSDK.get_detail_merged('eos', 'usdt')
                .then(({ amount, open, close, high }) => {
                    this.openPrice = open;
                    this.closePrice =close;
                    this.lastPrices.pop();
                    this.lastPrices.unshift(close)
                    return this.observePrice();
                })
                .catch(err => {
                    return this.observePrice();
                })
        }, 1000)
    }

    async run() {
        try {

            // const accountInfo: any[] = await this.hbSDK.get_account();
            // console.log('accountInfo:', accountInfo);
            // for (let i = 0; i < accountInfo.length; i++) {
            //     const account = accountInfo[i];
            //     if (account.type === 'margin' && account.subtype === 'adausdt') {
            //         this.marginAadausdtID = account.id;
            //     }
            //     if (account.type === 'margin' && account.subtype === 'eosusdt') {
            //         this.marginEosusdtID = account.id;
            //     }
            // }
            // const blance = await this.hbSDK.get_balance(this.marginAadausdtID);
            // console.log('blance:', blance);

            this.observeDepth();
            this.observeTrade();
            this.observePrice();
          
            while (2 > 1) {
                try {
                    let now = new Date().getTime();
                    if(now - this.startTime < 60 * 1000){
                        console.log(`业务数据准备中....请稍后....${60 - Math.ceil((now - this.startTime)/1000) } (^_^)`);
                        await this.wait(5 * 1000);
                        continue;
                    }
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

                    
                    let newBuy,newSell =0; // 买卖手趋势
                    let buyBig = 0,sellBig = 0 ; // 买单是卖单的倍数
                    if(buy5 > buy20){
                        newBuy = +((buy5/buy20).toFixed(2));
                    }
                    if(buy5 > sell5){
                        buyBig = +((buy5/sell5).toFixed(2));
                    }

                    if(sell5 >sell20 ){
                        newSell= +((sell5/sell20).toFixed(2));
                    }

                    if(sell5 > buy5){
                        sellBig = +((sell5/buy5).toFixed(2));
                    }

                    if((newBuy + buyBig) > (newSell + sellBig)){
                        console.log(`当前盘口:${buy5},${buy20},${sell5},${sell20}！`);
                        console.log(`买方主导的多头，建议买:${newBuy + buyBig}`)
                    }
                    else  if((newSell + sellBig) > (newBuy + buyBig) ){
                        console.log(`当前盘口:${buy5},${buy20},${sell5},${sell20}！`);
                        console.log(`卖方主导的空军，建议卖:${newSell + sellBig}`)
                    }


                    let price5=0,price20=0;
                    for (let i = 0; i < 5; i++) {
                        price5 += this.lastPrices[i];
                    }
                    for (let i = 0; i < 20; i++) {
                        price20 += this.lastPrices[i];
                    }
                    price5 = +(price5 / 5).toFixed(3);
                    price20 = +(price20 / 20).toFixed(3);
                    //console.log(this.lastPrices.join(','))
                    console.log(`价格趋势:${price5},${price20}！`);




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

                    // console.log('333333:',this.buyTradeMounts.join(','));
                    // console.log('2222222',this.sellTradeMounts.join(','));

                    console.log(`当前买卖单:${buyTrade5},${buyTrade20},${sellTrade5},${sellTrade20}！`);

                    console.log(`开盘价:${this.openPrice},最新价:${this.closePrice},买1价:${this.buy0Price},卖1价:${this.sell0Price},买1量:${this.buy0Mount},卖1量:${this.sell0Mount}`)
                    if (this.lastPrice === -1) {
                        this.lastPrice = this.closePrice;
                    }
                    else {
                        const cyPrice = this.closePrice - this.lastPrice;
                        // if (cyPrice > 0.01) {
                        //     this.LLDPE += 1;
                        // } else if (cyPrice < -0.01) {
                        //     this.LLDPE -= 1;
                        // }
                        this.LLDPE += cyPrice;
                        this.lastPrice = this.closePrice;

                        const now = new Date();
                        const nowTime = now.getTime();
                        // if (nowTime - this.lastAnalyzeTime > 15 * 1000) {
                        //     const buySums = this.sumArray(this.buyMounts);
                        //     const sellSums = this.sumArray(this.sellMounts);

                        //     const tradeSellSums = this.sumArray(this.sellTradeMounts);
                        //     const tradeBuySums = this.sumArray(this.buyTradeMounts);
                        //     const totalTrade = tradeSellSums + tradeBuySums;
                        //     if (this.lastTradeTotal > 0 && totalTrade > 0) {
                        //         const z = totalTrade / this.lastTradeTotal;
                        //         const y = this.lastTradeTotal / totalTrade;
                        //         if (z > 1) {
                        //             this.tradeQS += z
                        //         }
                        //         else if (y > 1) {
                        //             this.tradeQS -= y
                        //         }
                        //     }
                        //     if (tradeSellSums > 0 && tradeBuySums > 0) {
                        //         const z = tradeBuySums / tradeSellSums;
                        //         const y = tradeSellSums / tradeBuySums;

                        //         if (z > 1) {
                        //             this.tradeFXQS += z;
                        //         } else if (y > 1) {
                        //             this.tradeFXQS -= y;
                        //         }
                        //     }
                        //     this.lastTradeTotal = totalTrade;

                        //     console.log(`15s成交买单量:${tradeBuySums.toFixed(1)}，卖单量:${tradeSellSums.toFixed(1)},总量趋势:${this.tradeQS.toFixed(1)},方向趋势:${this.tradeFXQS.toFixed(1)}`);
                        //     this.sellTradeMounts = [];
                        //     this.buyTradeMounts = [];
                        //     this.tradeIds = [];
                        //     //console.log(`当前买手:${buySums}，当前卖手:${sellSums}`);


                        //     // if (buySums - sellSums > 0 && !this.tradeBuying) {
                        //     //     this.tradeBuying = true;
                        //     //     this.tradeSelling = false;
                        //     //     console.log(now, '这是一个买入点');
                        //     //     await this.buyCoins();
                        //     // } else if (buySums - sellSums < 0 && !this.tradeSelling) {
                        //     //     this.tradeSelling = true;
                        //     //     this.tradeBuying = false;
                        //     //     console.log(now, '这是一个卖出点')
                        //     //     await this.sellCoins();

                        //     // }

                        //     this.lastAnalyzeTime = nowTime;
                        // }
                    }

                   // console.log(`当前LLDPE:${this.LLDPE.toFixed(4)}`);

                    // await this.checkBuying();
                    // await this.checkSelling();
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
                    console.error('dddddd', ex);
                }
            }

        }
        catch (ex) {
            console.log('run app error:', ex)
        }
    }

    async buyCoins() {
        try {
            const order0: Order = this.orders[0];
            const now = new Date();
            const buyPrice = this.sell0Price; // 关注买入价格什么更合适
            if (!order0 || order0.state === 'selled') {
                const newOrder: Order = {
                    orderId: now.getTime(),
                    sellCoins: -1,
                    sellPrice: -1,
                    state: 'buying',
                    buyPrice: buyPrice,
                    buyCoins: this.useCapital / buyPrice,
                    buyTime: -1,
                    sellTime: -1,
                }
                this.orders.push(newOrder);
            } else {
                console.log('还有订单未卖出');
            }

        } catch (ex) {
            console.error('买入时发生错误：', ex);
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
            const expectPrice = this.openPrice * 0.008 + order0.buyPrice;
            const sell0Price = this.sell0Price; // 关注买入价格什么更合适
            if (!order0) {
                console.log('还没有订单');
            } else if (order0.state === 'buyed') {
                if (this.closePrice - expectPrice > 0) {
                    this.orders[0].state = 'selling';
                    this.orders[0].sellPrice = sell0Price;
                    this.orders[0].sellCoins = this.orders[0].buyCoins;
                } else {
                    console.log(`买入价:${this.orders[0].buyPrice},期望卖出价:${expectPrice}`);
                }
            } else {
                console.log('无可卖订单');
            }
        } catch (ex) {

        }
    }

    async checkSelling() {
        try {
            const order0: Order = this.orders[0];
            const now = new Date();
            if (order0 && order0.state === 'selling' && this.closePrice >= order0.sellPrice) {
                this.orders[0].state = 'selled';
                this.orders[0].sellTime = now.getTime();
                const li = (this.orders[0].sellPrice - this.orders[0].buyPrice) * this.orders[0].buyPrice;
                this.totalProfit += li;
                console.log(`订单卖出成功！本次获利：${li},合计:${this.totalProfit}`);
            }
        } catch (ex) {
            console.error('检查买入时发生错误：', ex);
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