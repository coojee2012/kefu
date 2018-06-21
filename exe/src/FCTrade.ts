import Fcoin = require('fcoin-api');
import { readFile, readFileSync } from 'fs';
import { LoggerService } from './LogService';

const ignore = {
    ';': true,
    '#': true
};

type TBalance = {
    currency: string;
    available: string,
    frozen: string,
    balance: string
}
export class FCTrade {
    private fcoin: Fcoin;
    private fcoinA: Fcoin;
    private fcoinB: Fcoin;
    private logger: LoggerService;
    private configs: any;
    private timeoutTimes: number;
    constructor() {
        this.logger = new LoggerService();
        this.fcoin = new Fcoin({
            key: '20f76983945545a28421c620ce6dc9e3',
            secret: 'e5deb5ff3415438eb02e82e943fdcb44'
        });
        this.timeoutTimes = 100;
        this.configs = this.parse(readFileSync(`config.ini`, 'utf8'));
        this.logger.debug('configs:', this.configs);
    }

    //     var crypto = require('crypto');
    // //加密
    // function encrypt(str,secret){
    // 	var cipher = crypto.createCipher('aes192',secret);
    // 	var enc = cipher.update(str,'utf8','hex');
    // 	enc += cipher.final('hex');
    // 	return enc;
    // }
    // //解密
    // function decrypt(str,secret){
    // 	var decipher = crypto.createDecipher('aes192',secret);
    // 	var dec = decipher.update(str,'hex','utf8');
    // 	dec += decipher.final('utf8');
    // 	return dec;
    // }

    async initAccount() {
        try {
            const { useAccount, authorization, keyA, secretA, keyB, secretB } = this.configs.Main;
            if (useAccount === 1) {
                this.fcoinA = new Fcoin({
                    key: keyA,
                    secret: secretA
                });
            } else if (useAccount === 2) {
                this.fcoinA = new Fcoin({
                    key: keyA,
                    secret: secretA
                });

                this.fcoinB = new Fcoin({
                    key: keyB,
                    secret: secretB
                });

                // this.logger.debug('fcoinB', this.fcoinB)
            } else {
                throw new Error('使用账户数<useAccount>，值应该为数字1或2');
            }
        }
        catch (ex) {
            return Promise.reject(ex);
        }
    }

    isNumber(input) {
        return (1 * input === parseFloat(input)) || (1 * input === parseInt(input));
    }

    /**
     * Checks if line is "empty" or comment
     * @param string line Input
     * @returns boolean
     */
    isEmpty(line) {
        return (line.length === 0 || ignore[line.substr(0, 1)] === true);
    }

    /**
     * Trim, remove quotes, returns net value
     * @param string string Input value
     * @returns string
     */
    sanitize(string) {
        let out = [], val;
        for (let c = 0; c < string.length; c++) {
            if (ignore[string[c]]) {
                break;
            }
            out.push(string[c]);
        }
        val = out.join('').trim().dequote('\'').dequote('"');
        if ('' + parseFloat(val) === val) {
            return parseFloat(val);
        } else if ('' + parseInt(val) === val) {
            return parseInt(val);
        } else {
            return val;
        }
    }


    readline(line) {
        line = line.trim();
        let out = {
            type: null, // section|item
            key: null,  // keyname
            value: null // value (without quotes if found)
        },
            sectionOpen = line.indexOf('['),
            sectionClose = line.indexOf(']'),
            indexEquals = line.indexOf('='),
            len = line.length,
            multivalue = line.indexOf('[]') > 0;

        if (multivalue === true) {
            out = {
                type: 'multi-value',
                key: line.substr(0, (indexEquals - 1)),
                value: line.substr((indexEquals + 1), len - (indexEquals + 1))
            };
            if (out.key.indexOf('[]') > 0) {
                out.key = out.key.split('[]')[0];
            }
        } else if (sectionOpen > -1 && (sectionClose - sectionOpen) > 0) {
            out = {
                type: 'section',
                key: line.substr((sectionOpen + 1), (sectionClose - sectionOpen) - 1),
                value: ''
            };
        } else {
            out = {
                type: 'item',
                key: line.substr(0, (indexEquals - 1)),
                value: line.substr((indexEquals + 1), len - (indexEquals + 1))
            };
        }
        if (out.key.length === 0) {
            out.type = 'empty';
        }

        out.value = this.sanitize(out.value);
        return out;
    }

    parse(input) {
        let _loop = 0, out = {}, details = {},
            currentSection = '',
            lines = input.split('\n');
        for (let i in lines) {
            if (this.isEmpty(lines[i])) {
                delete lines[i];
            } else {
                ++_loop;
                details = this.readline(lines[i]);

                if (typeof details.value !== 'function') {
                    if (details.key) {
                        details.key = details.key.trim();
                    }
                    if (details.type === 'section') {
                        currentSection = details.key;
                        out[currentSection] = {};
                    } else if (details.type === 'item') {
                        out[currentSection][details.key] = details.value;
                    } else if (details.type === 'multi-value') {
                        if (!out[currentSection][details.key]) {
                            out[currentSection][details.key] = []; // create array
                        }
                        if (typeof details.value !== 'function') {
                            out[currentSection][details.key].push(details.value);
                        }
                    } else if (details.type === 'empty') {
                        _loop = _loop - 1;
                    } else {
                        throw new Error('Invalid line data type type in line no. ' + i);
                    }
                    delete lines[i];
                }
            }
        }
        return (_loop > 0) ? out : false;
    }

    async run() {
        try {
            this.logger.info('欢迎使用FT自动挖矿程序，祝你早日发财，别墅靠海！(^_^) ');
            await this.initAccount();
            while (true) {
                /**
             * 行情接口(ticker)
             * @param {交易对} symbol 
             */
                //const tickerData = await this.fcoin.getTicker('ethusdt');
                //this.logger.debug('tickerData:', tickerData);

                /**
                 * 深度查询
                 * @param {L20 default} deep 
                 * @param {交易对} symbol 
                 */
                //const depthData = await this.fcoin.getDepth('L20', 'ethusdt');
                //this.logger.debug('depthData:', depthData);

                const { base_currency, quote_currency } = this.configs.Main;
                const balancesData = await this.fcoin.getBalance();
                const balances: TBalance[] = balancesData.data;
                const status = balancesData.status;
                if (balances && balances.length) {
                    for (let i = 0; i < balances.length; i++) {
                        const { currency, available, frozen, balance } = this.floorBlance(balances[i]);
                        if (currency === this.configs.Main.base_currency) {
                            this.logger.debug(`当前账户${currency.toUpperCase()},可用：${available},冻结：${frozen},余额：${balance}`);
                        }
                        else if (currency === this.configs.Main.quote_currency) {
                            this.logger.debug(`当前账户${currency.toUpperCase()},可用：${available},冻结：${frozen},余额：${balance}`);
                        }
                    }
                }


                /**
                 * 创建订单（买卖）
                 * @param {交易对} symbol 
                 * @param {买卖方向} side 
                 * @param {现价还是市价} type 
                 * @param {价格, string} price 
                 * @param {数量, string} amount 
                 */

                // fcoin.createOrder(symbol, side, type, price, amount).then(data => {})

                /**
                 * 撤销订单（买卖）
                 * @param {订单id} id 
                 */

                // fcoin.cancelOrder(id).then(data => {})

                /**
                 * 查询账户资产
                 */



                /**
                 * 查询所有订单
                 * @param {交易对} symbol  'submitted,filled'
                 * @param {订单状态} states 
                 * @param {每页限制数量} limit 
                 * @param {在某个时间戳之后, string} after
                 * @param {在某个时间戳之前, string} before
                 */

                //  fcoin.getOrders(symbol, states, limit, after, before).then(data => {})

                /**
                 * 获取指定 id 的订单 
                 * @param {订单id} id 
                 */

                //  fcoin.getOrderByid(id).then(data => {})
                await this.wait(3 * 1000);
            }
        }
        catch (ex) {
            this.logger.error('Trade Error:', ex);
        }
    }


    async run2() {

        try {
            await this.initAccount();
            const ab = await this.readAccount(this.fcoinA);
            const bb = await this.readAccount(this.fcoinB);
            if (ab.eth && ab.eth > 0.5) {
                throw new Error('A账户ETH大于0.5')
            }
            else if (ab.usdt && ab.usdt > 500) {
                throw new Error('A账户USDT大于500')
            }
            else if (bb.eth && bb.eth > 0.5) {
                throw new Error('B账户ETH大于0.5')
            }
            else if (bb.usdt && bb.usdt > 500) {
                throw new Error('B账户USDT大于500')
            }

            var lastOrderIds = null;
            var timeoutTimes = 100;
            while (true) {
                const ab = await this.readAccount(this.fcoinA);
                const bb = await this.readAccount(this.fcoinB);
                this.logger.debug("读取账户", ab, bb);
                try {
                    if (ab.eth && bb.usdt) {
                        var aOrderId = (await this.makeOrder(this.fcoinA, 'ethusdt', 'sell', 'market', ab.eth)).data;
                        var bOrderId = (await this.makeOrder(this.fcoinB, 'ethusdt', 'buy', 'market', bb.usdt)).data;
                        var aOrder = await this.readOrder(this.fcoinA, aOrderId);
                        var bOrder = await this.readOrder(this.fcoinB, bOrderId);
                        this.logger.debug("订单", aOrderId, aOrder.data.side, aOrder.data.amount, aOrder.data.state);
                        this.logger.debug("订单", bOrderId, bOrder.data.side, bOrder.data.amount, bOrder.data.state);
                    } else if (ab.usdt && bb.eth) {
                        var aOrderId = (await this.makeOrder(this.fcoinA, 'ethusdt', 'buy', 'market', ab.usdt)).data;
                        var bOrderId = (await this.makeOrder(this.fcoinB, 'ethusdt', 'sell', 'market', bb.eth)).data;
                        var aOrder = await this.readOrder(this.fcoinA, aOrderId);
                        var bOrder = await this.readOrder(this.fcoinB, bOrderId);
                        this.logger.debug("订单", aOrderId, aOrder.data.side, aOrder.data.amount, aOrder.data.state);
                        this.logger.debug("订单", bOrderId, bOrder.data.side, bOrder.data.amount, bOrder.data.state);
                    } else {
                        this.logger.debug("不ready，waiting");
                    }
                    await this.wait(3 * 1000);
                } catch (e) {

                }

                /*if(ab.eth && bb.usdt){
                 //不适合await，要同时下单
                 var aOrder = (await aClientt.createMarketOrder('ethusdt', 'sell', 'market',  ab.eth)).data;
                 var bOrder = (await bClientt.createMarketOrder('ethusdt', 'buy', 'market',  ab.usdt)).data;
                 lastOrderIds = [aOrder,bOrder];
                 }else if(ab.usdt && bb.eth){
                 var aOrder = (await aClientt.createMarketOrder('ethusdt', 'buy', 'market',  ab.usdt)).data;
                 var bOrder = (await bClientt.createMarketOrder('ethusdt', 'sell', 'market',  ab.eth)).data;
                 lastOrderIds = [aOrder,bOrder];
                 }*/


            }





            /*let fcoin = new Fcoin({
                key: '789fd1e7c1ef4dd18bd53bea1b46d36c',
                secret: 'a69f37e25dd042d7856c981c262af5da'
            });*/
            /*setInterval(function(){
             fcoin.getBalance().then(res => {
             res.data;
             });
            
             },30*1000)*/



            /*
             fcoin.createOrder('btcusdt', 'buy', 'limit', '100.0', '100.0').then(data => {
             console.log(data)
             })*/
        }
        catch (ex) {

        }
    }



    async  makeOrder(client, symbol, direction, type, amount) {
        var i = 0;
        while (true) {
            try {
                var rest = await client.createMarketOrder(symbol, direction, type, amount);
                if (rest) {
                    return rest;
                } else {
                    await this.wait(1000);
                }
            } catch (e) {
                console.log("下单异常",e);
                await this.wait(1000);
            }

            if (i > 30) {
                return null;;
            }
        }

    }

    async  readOrder(client, id) {
        var i = 0;
        while (true) {
            try {
                var order = await client.getOrderByid(id);
                if (order && order.data && order.data.state === 'filled') {
                    return order;
                } else {
                    await this.wait(1000);
                }
            } catch (e) {
                console.log("访问异常", id);
                await this.wait(1000);
            }
            if (i > this.timeoutTimes) {
                process.exit();
            }
        }
    }

    readEthusdt(arr) {
        const res = { eth: 0, usdt: 0 };
        arr.forEach(record => {
            if (record.currency === 'eth' && parseFloat(record.available) > 0.01) {
                res.eth = Math.floor(+record.available * 10000) / 10000;
            } else if (record.currency === 'usdt' && parseFloat(record.available) > 10) {
                res.usdt = Math.floor(+record.available * 100) / 100;
            }
        })
        this.logger.debug(`账户资金情况,ETH:${res.eth},USDT:${res.usdt}`);
        return res;
    }

    async  readAccount(client) {
        var i = 0;
        try {
            var balance = await client.getBalance();
            if (balance && balance.data) {
                return this.readEthusdt(balance.data);
            }
        } catch (e) {
            this.logger.error("访问异常", 'read account', e)
        }
    }

    floorBlance(blance) {
        let { currency, available, frozen, balance } = blance;
        available = Math.floor(+available * 10000) / 10000;
        frozen = Math.floor(+available * 10000) / 10000;
        balance = Math.floor(+available * 10000) / 10000;
        return { currency, available, frozen, balance };
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