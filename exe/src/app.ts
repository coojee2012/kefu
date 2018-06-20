// import { AutoTrade } from './AutoTrade';
// const privateKey = process.argv[2];
// const max$ = process.argv[3];
// const run = async () => {
//     try {
//         const autoTrade = new AutoTrade(privateKey, max$);
//         await autoTrade.run();

//     } catch (ex) {
//         console.error('run error:', ex);
//     }
// }
// run()
//     .then(
//         () => {
//             console.log('END!')
//         }
//     )
//     .catch(err => {
//         console.error('run error:', ex);
//     })


import { FCSDK } from './fcsdk';

const fcsdk = new FCSDK('e5deb5ff3415438eb02e82e943fdcb44');
var data = {
    "type": "limit",
    "side": "buy",
    "amount": "100.0",
    "price": "100.0",
    "symbol": "btcusdt"
  }
var ts  = 1523069544359;

fcsdk.sign_sha('post','https://api.fcoin.com/v2','/orders',data);