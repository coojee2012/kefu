import { resolve } from "bluebird";

const http = require('http');
const https = require('https');
const request = require('request');
const moment = require('moment');
const logger = console;
const URL = require('url');



const shttp = require('socks5-http-client');
const shttps = require('socks5-https-client');
const SocksProxyAgent = require('socks-proxy-agent');
const default_post_headers = {

    'content-type': 'application/json;charset=utf-8',
}

const agentOptions = {
    keepAlive: true,
    maxSockets: 256,
}

export class HttpClient {
    private proxy: string;
    constructor(proxy: string = '') {
        this.proxy = proxy;
    }

    async sget(url, options): Promise<string> {
        try {
            const httpOptions = Object.assign({}, URL.parse(url), {
                socksHost: '127.0.0.1',
                socksPort: '1080',
                timeout: options.timeout || 3000,
                headers: options.headers || default_post_headers,
                //agentOptions: agentOptions
            });
            console.log(httpOptions);
            return await new Promise<string>((resolve, reject) => {
                const req = shttps.get(httpOptions, (res) => {
                    let result = '';
                    res.setEncoding('utf8');
                    // res.on('readable', () => {
                    //     const data = res.read();                     
                    //     if (data === null) {
                    //         console.log('data=null', data); // Log response to console.
                    //         resolve(result);
                    //     } else {
                    //         result += data;
                    //     }
                    //     console.log('readable 1111111');
                    // });

                    res.on('data', (d) => {
                        console.log('data=null', d)
                    });

                    res.on('end', (err) => {
                        console.log('read error:', err);
                    })
                });
                req.on('error', (error) => { reject(error) });
                // GET request, so end without sending any data.
                // req.end();
            })

        } catch (ex) {
            console.error('sget error:', ex);
        }
    }

    async ssget(url, options): Promise<string>  {
        try {
            const agent = new SocksProxyAgent('socks://127.0.0.1:1080', true);
            const opts = URL.parse(url);
            opts.headers = {
                "content-type": "application/json",
                "accept": "application/json"
            };
            opts.agent = agent;
            return await new Promise<string>((resolve, reject) => {
                const req = https.request(opts, (res) => {
                    // console.log('statusCode:', res.statusCode);
                    // console.log('headers:', res.headers);
                    let result = '';
                    res.on('data', (d) => {
                        //process.stdout.write(d);
                        result+=d;
                    });
                    res.on('end', () => {
                        //console.log('res:',result);
                        resolve(result);
                    })
                });
                req.on('error', (e) => {
                    console.error('ddddddderrr', e);
                    reject(e);
                });
                req.end();
            });
        } catch (ex) {
            console.error(ex);
        }
    }


    get(url, options) {
        // console.log(`${moment().format()} HttpGet: ${url}`)
        return new Promise((resolve, reject) => {
            options = options || {};
            var httpOptions = {
                url: url,
                method: 'get',
                timeout: options.timeout || 3000,
                headers: options.headers || default_post_headers,
                //rejectUnauthorized:false,
                //proxy: this.proxy || '',
                agentOptions: agentOptions
            }
            request.get(httpOptions, function (err, res, body) {
                if (err) {
                    reject(err);
                } else {
                    if (res.statusCode == 200) {
                        resolve(body);
                    } else {
                        reject(res.statusCode);
                    }
                }
            }).on('error', logger.error);
        });
    }

    post(url, postdata, options) {
        // console.log(`${moment().format()} HttpPost: ${url}`)
        return new Promise((resolve, reject) => {
            options = options || {};
            var httpOptions = {
                url: url,
                body: JSON.stringify(postdata),
                method: 'post',
                timeout: options.timeout || 3000,
                headers: options.headers || default_post_headers,
                proxy: options.proxy || this.proxy,
                agentOptions: agentOptions
            };
            request(httpOptions, function (err, res, body) {
                if (err) {
                    reject(err);
                } else {
                    if (res.statusCode == 200) {
                        resolve(body);
                    } else {
                        reject(res.statusCode);
                    }
                }
            }).on('error', logger.error);
        });
    };

    form_post(url, postdata, options) {
        // console.log(`${moment().format()} HttpFormPost: ${url}`)
        return new Promise((resolve, reject) => {
            options = options || {};
            var httpOptions = {
                url: url,
                form: postdata,
                method: 'post',
                timeout: options.timeout || 3000,
                headers: options.headers || default_post_headers,
                proxy: options.proxy || this.proxy,
                agentOptions: agentOptions
            };
            request(httpOptions, function (err, res, body) {
                if (err) {
                    reject(err);
                } else {
                    if (res.statusCode == 200) {
                        resolve(body);
                    } else {
                        reject(res.statusCode);
                    }
                }
            }).on('error', logger.error);
        });
    };

}