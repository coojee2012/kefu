/**
 * Created by lil on 2017/4/25.
 */
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("./client");
exports.register = function (server, options, next) {
    const client = new client_1.default(options.s3Config);
    let upload = (request) => {
        switch (request.mime) {
            case 'multipart/form-data':
                return client.upload(request.payload.file, request.params.path, request.mime);
            case 'audio/x-wave':
                return client.upload(request.payload, request.params.path, request.mime);
        }
    };
    // Declare routes
    const prefix = '/api/v1/';
    const payloadSetting = {
        maxBytes: 209715200,
        output: 'stream',
        allow: ['application/json', 'audio/x-wave', 'image/jpeg', 'multipart/form-data', 'application/pdf', 'application/x-www-form-urlencoded']
    };
    server.route([
        {
            method: 'GET',
            path: prefix + '{path*}',
            handler: (request, reply) => {
                let stream = client.download(request.params.path);
                //read s3 to reply
                return reply(stream);
            }
        },
        {
            method: 'POST',
            path: prefix + '{path*}',
            config: {
                handler: (request, reply) => {
                    // upload request.payload
                    let result = upload(request);
                    return reply(result);
                },
                payload: payloadSetting
            }
        },
        {
            method: 'PUT',
            path: prefix + '{path*}',
            config: {
                handler: (request, reply) => {
                    let result = upload(request);
                    return reply(result);
                },
                payload: payloadSetting
            }
        }
    ]);
    //209715200 byte is 200 M byte
    return next();
};
exports.register.attributes = {
    name: 'routes-s3proxy',
    version: '1.0.0'
};
exports.default = exports;
