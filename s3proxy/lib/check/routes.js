/**
 * Created by lil on 2017/4/25.
 */
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = function (server, options, next) {
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
exports.default = exports;
