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
    private MMQS:number; //买手卖手强弱趋势 ，当买手多时+1 当卖手多时 -1

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
    private lastTradeTotal:number;
    private tradeQS:number; // 实际成交量趋势
    private tradeFXQS:number; // 实际成交量方向趋势

    constructor(privateKey) {
        this.hbSDK = new HuoBiSDK(privateKey);
        this.LLDPE = 0;
        this.MMQS = 0;
        this.lastPrice = -1;
        this.tradeQS = 0;
        this.tradeFXQS = 0;
        this.lastTradeTotal = 0;
        this.buyMounts = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        this.sellMounts = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

        this.buyTradeMounts = [];
        this.sellTradeMounts = [];
        this.tradeIds = [];

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
                .then(() => {

                })
                .catch(err => {

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



            while (2 > 1) {
                try {
                    const depthData = await this.hbSDK.get_depth('eos', 'usdt');
                    // await this.hbSDK.get_trade('eos', 'usdt');
                    this.buy0Price = depthData.bids[0][0];
                    this.buy0Mount = depthData.bids[0][1];
                    this.buyMounts.pop();
                    this.buyMounts.push(depthData.bids[0][1]);

                    this.sell0Price = depthData.asks[0][0];
                    this.sell0Mount = depthData.asks[0][1];


                    this.sellMounts.pop();
                    this.sellMounts.push(depthData.asks[0][1]);


                    let bids10Count = 0;
                    let asks10Count = 0;
                    let bids20Count = 0;
                    let asks20Count = 0;
                  
                    for(let i=0,j=10;i<10;i++,j++){
                        bids10Count += depthData.bids[i][1]
                        asks10Count += depthData.asks[i][1]

                        bids20Count += depthData.bids[i][1]
                        asks20Count += depthData.asks[i][1]

                        bids20Count += depthData.bids[j][1]
                        asks20Count += depthData.asks[j][1]
                    }


                    

                    console.log(`当前买入卖出量,前10【${bids10Count.toFixed(0)}:${asks10Count.toFixed(0)}】, 前20【${bids20Count.toFixed(0)}:${asks20Count.toFixed(0)}】`)
                    const bid10Bask10 = (bids10Count / asks10Count).toFixed(3);
                    const bid20Bask20 = (bids20Count / asks20Count).toFixed(3);
                    if( +bid10Bask10 > 1 ){
                        this.MMQS += bids10Count / asks10Count
                    }else{
                        this.MMQS -= asks10Count / bids10Count
                    }

                    console.log(`当前盘口买卖比为:[ ${bid10Bask10} ] 和 [ ${ bid20Bask20 }],趋势：${this.MMQS.toFixed(0)}`)

                    const mergeDetailData = await this.hbSDK.get_detail_merged('eos', 'usdt');
                    this.openPrice = mergeDetailData.open;
                    this.closePrice = mergeDetailData.close;


                    const {tradeData,tradeId} = await this.hbSDK.get_trade('eos', 'usdt');
                    if(this.tradeIds.indexOf(tradeId) < 0 ){
                        this.tradeIds.push(tradeId);
                        for(let j=0;j<tradeData.length;j++){
                            if(tradeData[j].direction === 'sell'){
                                this.sellTradeMounts.push(tradeData[j].amount);
                            }else if(tradeData[j].direction === 'buy'){
                                this.buyTradeMounts.push(tradeData[j].amount);
                            }
                        }
                    }

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
                        if (nowTime - this.lastAnalyzeTime > 15 * 1000) {
                            const buySums = this.sumArray(this.buyMounts);
                            const sellSums = this.sumArray(this.sellMounts);

                            const tradeSellSums = this.sumArray(this.sellTradeMounts);
                            const tradeBuySums = this.sumArray(this.buyTradeMounts);
                            const totalTrade = tradeSellSums + tradeBuySums;
                            if(this.lastTradeTotal > 0  && totalTrade >0){
                                const z = totalTrade / this.lastTradeTotal;
                                const y = this.lastTradeTotal /totalTrade;
                                if( z > 1 ){
                                    this.tradeQS += z
                                }
                                else if(y > 1 ){
                                    this.tradeQS -= y
                                }
                            }
                            if(tradeSellSums > 0 && tradeBuySums >0 ){
                                const z = tradeBuySums / tradeSellSums;
                                const y = tradeSellSums / tradeBuySums;
                                
                                if(z > 1){
                                    this.tradeFXQS += z;
                                }else if(y>1){
                                    this.tradeFXQS -=y;
                                }
                            }
                            this.lastTradeTotal = totalTrade;

                            console.log(`15s成交买单量:${tradeBuySums.toFixed(1)}，卖单量:${tradeSellSums.toFixed(1)},总量趋势:${this.tradeQS.toFixed(1)},方向趋势:${this.tradeFXQS.toFixed(1)}`);
                            this.sellTradeMounts = [];
                            this.buyTradeMounts = [];
                            this.tradeIds = [];
                            //console.log(`当前买手:${buySums}，当前卖手:${sellSums}`);


                            // if (buySums - sellSums > 0 && !this.tradeBuying) {
                            //     this.tradeBuying = true;
                            //     this.tradeSelling = false;
                            //     console.log(now, '这是一个买入点');
                            //     await this.buyCoins();
                            // } else if (buySums - sellSums < 0 && !this.tradeSelling) {
                            //     this.tradeSelling = true;
                            //     this.tradeBuying = false;
                            //     console.log(now, '这是一个卖出点')
                            //     await this.sellCoins();
                               
                            // }

                            this.lastAnalyzeTime = nowTime;
                        }
                    }

                    console.log(`当前LLDPE:${ this.LLDPE.toFixed(4) }`);

                    // await this.checkBuying();
                    // await this.checkSelling();
                    const lastTime = 1525679665;
                    const { tbTime, tbValue} = await this.hbSDK.check_outEth();
                    if(tbTime > lastTime && tbValue > 10000 ){
                        console.log('提币了')
                    }else{
                        // console.log({tbTime, tbValue});
                    }

                    await this.wait(1000);
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