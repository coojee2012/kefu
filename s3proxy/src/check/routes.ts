import {Server} from "../../node_modules/@types/hapi/index";
import {Setting} from "../conf/settings";
/**
 * Created by lil on 2017/4/25.
 */
'use strict';
exports.register = function (server: Server,options:Setting, next) {


    server.route([
        {
            method: 'GET',
            path: '/healthCheck',
            handler: (request, reply) => {
                return reply("Alive");
            }
        }
    ]);
    return next();
};

exports.register.attributes = {
    name: 'health-check',
    version: '1.0.0'
};
export default exports