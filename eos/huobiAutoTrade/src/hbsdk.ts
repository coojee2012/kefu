
import CryptoJS = require('crypto-js');
import moment = require('moment');
import HmacSHA256 = require('crypto-js/hmac-sha256')
import { HttpClient } from './httpClient';

import config from './config';

const URL_HUOBI_PRO = 'api.huobipro.com';
const BASE_URL = 'https://api.huobipro.com';
// const URL_HUOBI_PRO = 'api.huobi.pro'; //备用地址

const DEFAULT_HEADERS = {
    "Content-Type": "application/json",
    "User-Agent": "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.71 Safari/537.36",
    "AuthData": ''
}


export class HuoBiSDK {
    private http: HttpClient;
    private privateKey: string;
    constructor(privateKey) {
        this.privateKey = privateKey;
        this.http = new HttpClient('socks5://127.0.0.1:1080');
    }

    get_auth() {
        var sign = config.huobi.trade_password + 'hello, moto';
        var md5 = CryptoJS.MD5(sign).toString().toLowerCase();
        let ret = encodeURIComponent(JSON.stringify({
            assetPwd: md5
        }));
        return ret;
    }

    sign_sha(method, baseurl, path, data) {
        var pars = [];
        for (let item in data) {
            pars.push(item + "=" + encodeURIComponent(data[item]));
        }
        var p = pars.sort().join("&");
        var meta = [method, baseurl, path, p].join('\n');
        // console.log(meta);
        var hash = HmacSHA256(meta, this.privateKey);
        var Signature = encodeURIComponent(CryptoJS.enc.Base64.stringify(hash));
        // console.log(`Signature: ${Signature}`);
        p += `&Signature=${Signature}`;
        // console.log(p);
        return p;
    }

    get_body() {
        return {
            AccessKeyId: config.huobi.access_key,
            SignatureMethod: "HmacSHA256",
            SignatureVersion: 2,
            Timestamp: moment.utc().format('YYYY-MM-DDTHH:mm:ss'),
        };
    }


    async call_api(method: string, path: string, payload, body) {
        try {
            const account_id = config.huobi.account_id_pro;
            const url = `https://${URL_HUOBI_PRO}${path}?${payload}`;
            console.log(url);
            const headers = DEFAULT_HEADERS;
            headers.AuthData = this.get_auth();
            if (method == 'GET') {
                const data: string = await this.http.sget(url, {
                    timeout: 1000,
                    headers: headers
                })
                let json = JSON.parse(data);
                if (json.status == 'ok') {
                    //console.log(json.data);
                    return Promise.resolve(json.data);
                } else {
                    console.log('调用错误', json);
                    return Promise.reject(json);
                }
            }
            else if (method == 'POST') {
                const data = await http.post(url, body, {
                    timeout: 1000,
                    headers: headers
                })
                let json = JSON.parse(data);
                if (json.status == 'ok') {
                    console.log(json.data);
                    return Promise.resolve(json.data);
                } else {
                    console.log('调用错误', json);
                    return Promise.reject(json);
                }
            }
        } catch (ex) {
            console.error('call_api error:', ex);
        }
    }


    async get_account() {
        try {
            const path = `/v1/account/accounts`;
            const body = this.get_body();
            const payload = this.sign_sha('GET', URL_HUOBI_PRO, path, body);
            const result = await this.call_api('GET', path, payload, body);
            return result;
        } catch (ex) {
            console.error('get_account error:', ex);
        }

    }


    async get_balance(account_id: number) {
        try {
            //const account_id = config.huobi.account_id_pro;
            const path = `/v1/account/accounts/${account_id}/balance`;
            const body = this.get_body();
            const payload = this.sign_sha('GET', URL_HUOBI_PRO, path, body);
            return await this.call_api('GET', path, payload, body);
        } catch (ex) {
            console.error('get_account error:', ex);
        }
    }

    async get_open_orders(symbol) {
        try {
            const path = `/v1/order/orders`;
            const body = Object.assign({}, this.get_body(), { symbol, states: 'submitted,partial-filled' });
            const payload = this.sign_sha('GET', URL_HUOBI_PRO, path, body);
            return await this.call_api('GET', path, payload, body);

        } catch (ex) {
            console.error('get_account error:', ex);
        }

    }
    async get_order(order_id) {
        try {
            const path = `/v1/order/orders/${order_id}`;
            const body = Object.assign({}, this.get_body(), {});
            const payload = this.sign_sha('GET', URL_HUOBI_PRO, path, body);
            return await this.call_api('GET', path, payload, body);
        } catch (ex) {
            console.error('get_account error:', ex);
        }

    }
    async buy_limit(symbol, amount, price) {
        try {
            const path = '/v1/order/orders/place';
            const extData = {
                "account-id": config.huobi.account_id_pro,
                type: "buy-limit",
                amount: amount,
                symbol: symbol,
                price: price
            }
            const body = Object.assign({}, this.get_body(), extData);
            const payload = this.sign_sha('POST', URL_HUOBI_PRO, path, body);
            return await this.call_api('POST', path, payload, body);

        } catch (ex) {
            console.error('get_account error:', ex);
        }

    }

    async sell_limit(symbol, amount, price) {
        try {
            const path = '/v1/order/orders/place';
            const extData = {
                "account-id": config.huobi.account_id_pro,
                type: "sell-limit",
                amount, symbol, price
            }
            const body = Object.assign({}, this.get_body(), extData);
            const payload = this.sign_sha('POST', URL_HUOBI_PRO, path, body);
            return await this.call_api('POST', path, payload, body);

        } catch (ex) {
            console.error('get_account error:', ex);
        }

    }

    async  withdrawal(address, coin, amount, payment_id) {
        try {
            const path = `/v1/dw/withdraw/api/create`;
            const extData = { address, amount, currency: coin }

            if (coin.toLowerCase() == 'xrp') {
                if (payment_id) {
                    extData['addr-tag'] = payment_id;
                } else {
                    console.log('huobi withdrawal', coin, 'no payment id provided, cancel withdrawal');
                    return Promise.resolve(null);
                }
            }
            const body = Object.assign({}, this.get_body(), extData);
            const payload = this.sign_sha('POST', URL_HUOBI_PRO, path, body);
            return await this.call_api('POST', path, payload, body);

        } catch (ex) {
            console.error('get_account error:', ex);
        }

    }


    async get_depth(coin, currency) {
        try {
            let url = `${BASE_URL}/market/depth?symbol=${coin}${currency}&type=step0`;
            const data: string = await this.http.sget(url, {
                timeout: 1000,
                gzip: true
            })
            let json = JSON.parse(data);
            let t = json.ts;
            let ch = json.ch;
            let asks = json.tick.asks[0];
            let bids = json.tick.bids[0];
            console.log(asks,bids,ch);
        } catch (ex) {
            console.error('get_account error:', ex);
        }
    }

    async get_trade(coin,currency){
        try {
            let url = `${BASE_URL}/market/trade?symbol=${coin}${currency}`;
            console.log(url);
            const data: string = await this.http.sget(url, {
                timeout: 1000,
                //gzip: true
            })
            // let json = JSON.parse(data);
            // console.log(json.data);
        } catch (ex) {
            console.error('get_account error:', ex);
        }
    }

    async get_detail_merged(coin,currency){
        try {
            let url = `${BASE_URL}/market/detail/merged?symbol=${coin}${currency}`;
            console.log(url);
            const data: string = await this.http.get(url, {
                timeout: 1000,
                gzip: true
            })
             let json = JSON.parse(data);
             console.log(json.data);
        } catch (ex) {
            console.error('get_detail_merged error:', ex);
        }
    }

   

}