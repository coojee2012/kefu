import { HuoBiSDK } from './hbsdk';

export class AutoTrade {
    private hbSDK: HuoBiSDK;
    private marginAadausdtID: number;
    private marginEosusdtID: number;
    private openPrice:number;  // 开盘价格
    private closePrice:number; // 最新价格
    private nowPrice:number;
    private sell0Price:number;
    private sell0Mount:number;
    private buy0Price:number;
    private buy0Mount:number;
    private lastPrice:number;
    private  LLDPE:number; //震荡趋势

    constructor(privateKey) {
        this.hbSDK = new HuoBiSDK(privateKey);
        this.LLDPE = 0;
        this.lastPrice = -1;
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
                const depthData = await this.hbSDK.get_depth('eos', 'usdt');
                // await this.hbSDK.get_trade('eos', 'usdt');
                this.buy0Price = depthData.bids[0];
                this.buy0Mount = depthData.bids[1];
                this.sell0Price = depthData.asks[0];
                this.sell0Mount = depthData.asks[1];
                
                const mergeDetailData = await this.hbSDK.get_detail_merged('eos', 'usdt');
                this.openPrice = mergeDetailData.open;
                this.closePrice = mergeDetailData.close;

                console.log(`开盘价:${this.openPrice},最新价:${this.closePrice},买1价:${this.buy0Price},卖1价:${this.sell0Price},买1量:${this.buy0Mount},卖1量:${this.sell0Mount}`)
                if(this.lastPrice === -1){
                    this.lastPrice = this.closePrice;
                }
                else
                {
                    const cyPrice = this.closePrice - this.lastPrice ;
                    if(cyPrice > 0.05 ){
                        this.LLDPE += 1;
                    }else if(cyPrice < -0.05){
                        this.LLDPE -= 1; 
                    }
                    this.lastPrice = this.closePrice;
                }

                console.log(`当前LLDPE:${this.LLDPE}`);

                await this.wait(1000);
            }

        }
        catch (ex) {
            console.log('aa', ex)
        }
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