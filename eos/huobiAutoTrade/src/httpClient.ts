import { resolve } from "bluebird";

import http = require('http');
import https = require('https');
import request = require('request');
import moment = require('moment');
import URL = require('url');



import shttp = require('socks5-http-client');
import shttps = require('socks5-https-client');
import SocksProxyAgent = require('socks-proxy-agent');

const default_post_headers = {

    'content-type': 'application/json;charset=utf-8',
}

const agentOptions = {
    keepAlive: true,
    maxSockets: 256,
}
import { LoggerService } from './LogService';
export class HttpClient {
    private proxy: string;
    private logger: LoggerService;
    constructor(proxy: string = '') {
        this.proxy = proxy;
        this.logger = new LoggerService();
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
            //this.logger.debug(httpOptions);
            return await new Promise<string>((resolve, reject) => {
                const req = shttps.get(httpOptions, (res) => {
                    let result = '';
                    res.setEncoding('utf8');
                    res.on('readable', () => {
                        const data = res.read();
                        if (data === null) {
                            //console.log('data=null', data); // Log response to console.
                            resolve(result);
                        } else {
                            result += data;
                        }
                        //console.log('readable 1111111');
                    });

                    // res.on('data', (d) => {
                    //    this.logger.debug('data=null', d)
                    // });

                    // res.on('end', (err) => {
                    //    this.logger.debug('read error:', err);
                    // })
                });
                req.on('error', (error) => { reject(error) });
                // GET request, so end without sending any data.
                req.end();
            })

        } catch (ex) {
            this.logger.error('sget error:', ex);
        }
    }

    async spost(url, postdata, options): Promise<string> {
        try {
            const httpOptions = Object.assign({}, URL.parse(url), {
                socksHost: '127.0.0.1',
                socksPort: '1080',
                timeout: options.timeout || 3000,
                method:'POST',
                headers: options.headers || default_post_headers,
                //agentOptions: agentOptions
            });
            //this.logger.debug(httpOptions);
            return await new Promise<string>((resolve, reject) => {
                const req = shttps.request(httpOptions, (res) => {
                    let result = '';
                    res.setEncoding('utf8');
                    res.on('readable', () => {
                        const data = res.read();
                        if (data === null) {
                            //console.log('data=null', data); // Log response to console.
                            resolve(result);
                        } else {
                            result += data;
                        }
                        //console.log('readable 1111111');
                    });

                    // res.on('data', (d) => {
                    //    this.logger.debug('data=null', d)
                    // });

                    // res.on('end', (err) => {
                    //    this.logger.debug('read error:', err);
                    // })
                });
                req.on('error', (error) => { reject(error) });
                req.write(JSON.stringify(postdata));
                req.end();
            })
        } catch (ex) {
            this.logger.error('spost error:', ex);
        }
    }

    async ssget(url, options): Promise<string> {
        try {
            const agent = new SocksProxyAgent('socks://127.0.0.1:1080', true);
            const opts = URL.parse(url);
            opts.headers = {
                "content-type": "application/json;charset=utf-8",
                "accept": "application/json"
            };
            opts.agent = agent;


           this.logger.debug('=====', opts)
            return await new Promise<string>((resolve, reject) => {
                const req = https.request(opts, (res) => {
                    //this.logger.debug('statusCode:', res.statusCode);
                    //this.logger.debug('headers:', res.headers);
                    let result = '';
                    res.on('data', (d) => {
                        //process.stdout.write(d);
                        result += d;
                    });
                    res.on('end', () => {
                        //console.log('res:',result);
                        resolve(result);
                    })
                });
                req.on('error', (e) => {
                    this.logger.error('ssget errr', e);
                    reject(e);
                });
                req.end();
            });
        } catch (ex) {
            this.logger.error(ex);
        }
    }


    get(url, options) {
        //this.logger.debug(`${moment().format()} HttpGet: ${url}`)
        return new Promise((resolve, reject) => {
            options = options || {};
            var httpOptions = {
                url: url,
                method: 'get',
                timeout: options.timeout || 3000,
                headers: options.headers || default_post_headers,
                //rejectUnauthorized:false,
                proxy: this.proxy || '',
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
        //this.logger.debug(`${moment().format()} HttpPost: ${url}`)
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
        //this.logger.debug(`${moment().format()} HttpFormPost: ${url}`)
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