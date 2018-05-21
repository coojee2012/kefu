
import CryptoJS = require('crypto-js');
import moment = require('moment');
import HmacSHA256 = require('crypto-js/hmac-sha256')
import { HttpClient } from './httpClient';
import { LoggerService } from './LogService';
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
    private logger: LoggerService;
    constructor(privateKey) {
        this.privateKey = privateKey;
        this.http = new HttpClient('socks5://127.0.0.1:1080');
        this.logger = new LoggerService();
    }

    get_auth() {
        var sign = config.huobi.trade_password + 'hello, moto';
        var md5 = CryptoJS.MD5(sign).toString().toLowerCase();
        let ret = encodeURIComponent(JSON.stringify({
            assetPwd: md5
        }));
        return ret;
    }

    async check_outEth() {
        try {
            let url = `http://eos.icocha.com/eostransfer/0`;
            const data: string = await this.http.get(url, {
                timeout: 1000,
                gzip: true
            })
            let json = JSON.parse(data);

            if (typeof json === 'object') {

                if (json.TxOut && json.TxOut[0] && json.TxOut[0].Datetime) {
                    return Promise.resolve({ tbTime: json.TxOut[0].Datetime, tbValue: json.TxOut[0].TotalValue });
                } else {
                    return Promise.resolve({ tbTime: -1, tbValue: 0 });
                }

            } else {
                return Promise.resolve({ tbTime: -1, tbValue: 0 });
            }
        } catch (ex) {
            this.logger.error('check_outEth error:', ex);
        }
    }

    sign_sha(method, baseurl, path, data) {
        var pars = [];
        for (let item in data) {
            pars.push(item + "=" + encodeURIComponent(data[item]));
        }
        var p = pars.sort().join("&");
        var meta = [method, baseurl, path, p].join('\n');
        // this.logger.debug(meta);
        var hash = HmacSHA256(meta, this.privateKey);
        var Signature = encodeURIComponent(CryptoJS.enc.Base64.stringify(hash));
        //this.logger.debug(`Signature: ${Signature}`);
        p += `&Signature=${Signature}`;
        // this.logger.debug(p);
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
            this.logger.debug(url);
            const headers = DEFAULT_HEADERS;
            headers.AuthData = this.get_auth();
            if (method == 'GET') {
                const data: string = await this.http.sget(url, {
                    timeout: 1000,
                    headers: headers
                })
                let json = JSON.parse(data);
                if (json.status == 'ok') {
                    //this.logger.debug(json.data);
                    return Promise.resolve(json.data);
                } else {
                    this.logger.warn('调用错误', json);
                    return Promise.reject(json);
                }
            }
            else if (method == 'POST') {
                const data = await this.http.spost(url, body, {
                    timeout: 1000,
                    headers: headers
                })
                let json = JSON.parse(data);
                if (json.status == 'ok') {
                    this.logger.debug(json.data);
                    return Promise.resolve(json.data);
                } else {
                    this.logger.warn('调用错误', json);
                    return Promise.reject(json);
                }
            }
        } catch (ex) {
            this.logger.error('call_api error:', ex);
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
            this.logger.error('get_account error:', ex);
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
            this.logger.error('get_account error:', ex);
        }
    }

    async get_open_orders(symbol) {
        try {
            const path = `/v1/order/orders`;
            const body = Object.assign({}, this.get_body(), { symbol, states: 'submitted,partial-filled' });
            const payload = this.sign_sha('GET', URL_HUOBI_PRO, path, body);
            return await this.call_api('GET', path, payload, body);

        } catch (ex) {
            this.logger.error('get_account error:', ex);
        }

    }
    //获取某个订单详情
    /**
     * 
     * @param order_id 
     * @returns 
     * 返回结果：
     * account-id	true	long	账户 ID	
     * amount	true	string	订单数量	
     * canceled-at	false	long	订单撤销时间	
     * created-at	true	long	订单创建时间	
     * field-amount	true	string	已成交数量	
     * field-cash-amount	true	string	已成交总金额	
     * field-fees	true	string	已成交手续费（买入为币，卖出为钱）	
     * finished-at	false	long	最后成交时间	
     * id	true	long	订单ID	
     * price	true	string	订单价格	
     * source	true	string	订单来源	api
     * state	true	string	订单状态	pre-submitted 准备提交, submitting , submitted 已提交, partial-filled 部分成交, partial-canceled 部分成交撤销, filled 完全成交, canceled 已撤销
     * symbol	true	string	交易对	btcusdt, bchbtc, rcneth ...
     * type	true	string	订单类型	buy-market：市价买, sell-market：市价卖, buy-limit：限价买, sell-limit：限价卖, buy-ioc：IOC买单, sell-ioc：IOC卖单
     */
    async get_order(order_id) {
        try {
            const path = `/v1/order/orders/${order_id}`;
            const body = Object.assign({}, this.get_body(), {});
            const payload = this.sign_sha('GET', URL_HUOBI_PRO, path, body);
            return await this.call_api('GET', path, payload, body);
        } catch (ex) {
            this.logger.error('get_account error:', ex);
        }

    }

    // 获取某个订单的成交明细
    /**
     * 
     * @param order_id 
     * @returns
     * created-at	true	long	成交时间	
     * filled-amount	true	string	成交数量	
     * filled-fees	true	string	成交手续费	
     * id	true	long	订单成交记录ID	
     * match-id	true	long	撮合ID	
     * order-id	true	long	订单 ID	
     * price	true	string	成交价格	
     * source	true	string	订单来源	api
     * symbol	true	string	交易对	btcusdt, bchbtc, rcneth ...
     * type	true	string	订单类型	buy-market：市价买, sell-market：市价卖, buy-limit：限价买, sell-limit：限价卖, buy-ioc：IOC买单, sell-ioc：IOC卖单
     */
    async matchresults(order_id){
        try {
            const path = `/v1/order/orders/${order_id}/matchresults`;
            const body = Object.assign({}, this.get_body(), {});
            const payload = this.sign_sha('GET', URL_HUOBI_PRO, path, body);
            return await this.call_api('GET', path, payload, body);
        } catch (ex) {
            this.logger.error('get_account error:', ex);
        }
    }
    async buy_limit(symbol, amount, price) {
        try {
            const path = '/v1/order/orders/place';
            const extData = {
                "account-id": config.huobi.account_id_pro,
                type: "buy-limit",
                amount: amount,
                source: 'margin-api',
                symbol: symbol,
                price: price
            }
            const body = Object.assign({}, this.get_body(), extData);
            const payload = this.sign_sha('POST', URL_HUOBI_PRO, path, body);
            return await this.call_api('POST', path, payload, body);

        } catch (ex) {
            this.logger.error('get_account error:', ex);
        }

    }


    async buy_market(accountId, symbol, amount) {
        try {
            const path = '/v1/order/orders/place';
            const extData = {
                "account-id": accountId,
                type: "buy-market",
                amount: amount,
                source: 'margin-api',
                symbol: symbol,
            }
            const body = Object.assign({}, this.get_body(), extData);
            const payload = this.sign_sha('POST', URL_HUOBI_PRO, path, body);
            return await this.call_api('POST', path, payload, body);

        } catch (ex) {
            this.logger.error('get_account error:', ex);
        }

    }


    async sell_limit(accountId, symbol, amount, price) {
        try {
            const path = '/v1/order/orders/place';
            const extData = {
                "account-id": accountId,
                type: "sell-limit",
                source: 'margin-api',
                amount, symbol, price
            }
            const body = Object.assign({}, this.get_body(), extData);
            const payload = this.sign_sha('POST', URL_HUOBI_PRO, path, body);
            return await this.call_api('POST', path, payload, body);

        } catch (ex) {
            this.logger.error('sell_limit error:', ex);
        }

    }

    async sell_market(accountId, symbol, amount) {
        try {
            const path = '/v1/order/orders/place';
            const extData = {
                "account-id": accountId,
                type: "sell-market",
                source: 'margin-api',
                amount, symbol,
            }
            const body = Object.assign({}, this.get_body(), extData);
            const payload = this.sign_sha('POST', URL_HUOBI_PRO, path, body);
            return await this.call_api('POST', path, payload, body);

        } catch (ex) {
            this.logger.error('sell_market error:', ex);
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
                    this.logger.debug('huobi withdrawal', coin, 'no payment id provided, cancel withdrawal');
                    return Promise.resolve(null);
                }
            }
            const body = Object.assign({}, this.get_body(), extData);
            const payload = this.sign_sha('POST', URL_HUOBI_PRO, path, body);
            return await this.call_api('POST', path, payload, body);

        } catch (ex) {
            this.logger.error('get_account error:', ex);
        }

    }

    /**
     * @deprecated 
     * GET /market/depth 获取 Market Depth 数据
     * 用户选择“合并深度”时，一定报价精度内的市场挂单将予以合并显示。合并深度仅改变显示方式，不改变实际成交价格。
     * 
     * symbol	true	string	交易对		btcusdt, bchbtc, rcneth ...
     * type	true	string	Depth 类型		step0, step1, step2, step3, step4, step5（合并深度0-5）；step0时，不合并深度
     * 
     * 返回数据：
     * "tick": {
     * "id": 消息id,
     * "ts": 消息生成时间，单位：毫秒,
     * "bids": 买盘,[price(成交价), amount(成交量)], 按price降序,
     * "asks": 卖盘,[price(成交价), amount(成交量)], 按price升序
     * }
     */
    async get_depth(coin, currency, step = 'step0') {
        try {
            let url = `${BASE_URL}/market/depth?symbol=${coin}${currency}&type=${step}`;
            const data: string = await this.http.ssget(url, {
                timeout: 1000,
                gzip: true
            })
            let json = JSON.parse(data);
            if (json.status === 'ok') {
                let t = json.ts;
                let ch = json.ch;
                let asks = json.tick.asks;
                let bids = json.tick.bids;
                return Promise.resolve({ asks, bids })
            } else {
                this.logger.debug('调用get_depth发生错误：', json)
                return Promise.reject(json);

            }
        } catch (ex) {
            this.logger.error('get_depth error:', ex);
        }
    }


    /**
     * @description
     * GET /market/trade 获取 Trade Detail 数据
     * 
     * symbol	true	string	交易对		btcusdt, bchbtc, rcneth ...
     * 返回数据：
     *  "tick": {
     * "id": 消息id,
     * "ts": 最新成交时间,
     * "data": [
     * {
     * "id": 成交id,
     * "price": 成交价钱,
     * "amount": 成交量,
     * "direction": 主动成交方向,
     *  "ts": 成交时间
     * }
     * ]
     * }
     */
    async get_trade(coin, currency) {
        try {
            let url = `${BASE_URL}/market/trade?symbol=${coin}${currency}`;
            const data: string = await this.http.ssget(url, {
                timeout: 1000,
                gzip: true
            })
            let json = JSON.parse(data);
            if (json.status === 'ok') {
                let t = json.ts;
                let ch = json.ch;
                let tradeData = json.tick.data;
                let tradeId = json.tick.id;
                return Promise.resolve({ tradeData, tradeId })

            } else {
                this.logger.debug('调用get_trade发生错误：', json)
                return Promise.reject(json)

            }
        } catch (ex) {
            this.logger.error('get_trade error:', ex);
        }
    }

    /**
     * @description
     * GET /market/detail/merged 获取聚合行情(Ticker)
     * K线数据
     * "tick": {
     * "id": K线id,
     * "amount": 成交量,
     * "count": 成交笔数,
     * "open": 开盘价,
     * "close": 收盘价,当K线为最晚的一根时，是最新成交价
     * "low": 最低价,
     * "high": 最高价,
     * "vol": 成交额, 即 sum(每一笔成交价 * 该笔的成交量)
     * "bid": [买1价,买1量],
     * "ask": [卖1价,卖1量]
     * }
     * @param coin eos btc ....
     * @param currency  usdt....
     */
    async get_detail_merged(coin, currency) {
        try {
            let url = `${BASE_URL}/market/detail/merged?symbol=${coin}${currency}`;
            const data: string = await this.http.ssget(url, {
                timeout: 1000,
                gzip: true
            })
            let json = JSON.parse(data);
            if (json.status === 'ok') {
                const { amount, open, close, high } = json.tick;
                return Promise.resolve({ amount, open, close, high })
            } else {
                this.logger.debug('调用get_detail_merged发生错误：', json)
                return Promise.reject(json);
            }
        } catch (ex) {
            this.logger.error('get_detail_merged error:', ex);
        }
    }
    /**
     * 获取k线图
     * @param coin eos
     * @param currency  usdt
     * @param period 1min, 5min, 15min, 30min, 60min, 1day, 1mon, 1week, 1year
     * @param size [1,1000]
     */

    async get_kline(coin, currency,period='1day',size=150) {
        try {
            let url = `${BASE_URL}/market/history/kline?symbol=${coin}${currency}&period=${period}&size=${size}&AccessKeyId=${config.huobi.access_key}`;
            const data: string = await this.http.ssget(url, {
                timeout: 1000,
                gzip: true
            })
            let json = JSON.parse(data);
            if (json.status === 'ok') {
                //this.logger.debug('get_kline',json)
                return Promise.resolve(json.data)
            } else {
                this.logger.debug('调用get_kline发生错误：', json)
                return Promise.reject(json);
            }
        } catch (ex) {
            this.logger.error('get_detail_merged error:', ex);
        }
    }



}