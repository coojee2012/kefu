import { HuoBiSDK } from './hbsdk';

export class AutoTrade {
    private hbSDK: HuoBiSDK;
    private marginAadausdtID: number;
    private marginEosusdtID: number;

    constructor(privateKey) {
        this.hbSDK = new HuoBiSDK(privateKey);
    }


    observeDepth() {
        setTimeout(() => {
            this.hbSDK.get_depth('eos', 'usdt')
                .then(()=>{

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

            

            while(2>1){
               // await this.hbSDK.get_depth('eos', 'usdt');
                
                await this.hbSDK.get_detail_merged('eos','usdt');
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