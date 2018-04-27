const http = require('http');
const request = require('request');
const moment = require('moment');
const logger = console;

var default_post_headers = {
    'content-type': 'application/json;charset=utf-8',
}

var agentOptions = {
    keepAlive: true,
    maxSockets: 256,
}

export class HttpClient {
    constructor() {

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
                proxy: options.proxy || '',
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
                proxy: options.proxy || '',
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
                proxy: options.proxy || '',
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