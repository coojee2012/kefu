import { ReadStream } from "fs";
import { Server } from "../../node_modules/@types/hapi/index";
import { Setting } from "../conf/settings";
/**
 * Created by lil on 2017/4/25.
 */
'use strict';
import ProxyClient from "./client"
exports.register = function (server: Server, options: Setting, next) {

    const client = new ProxyClient(options.s3Config);
    let upload: Function = (request) => {
        console.log(request.mime)
        switch (request.mime) {
            case 'multipart/form-data':
                return client.upload(request.payload.file, request.params.path, request.mime);
            case 'application/json':
                return client.upload(request.payload, request.params.path, request.mime);
            case 'audio/x-wave':
                return client.upload(request.payload, request.params.path, request.mime);
        }
    }
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
                let stream: ReadStream = client.download(request.params.path);
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
                    let result: string = upload(request);
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
                    let result: string = upload(request);
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
export default exports