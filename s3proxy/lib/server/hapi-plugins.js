"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Created by lil on 2017/4/25.
 */
const routes_1 = require("../proxy/routes");
const routes_2 = require("../check/routes");
const tools = require('hapi-plugin-tools');
class Plugins extends Array {
    constructor(configuration) {
        super();
        const Good = require('good');
        this.push({
            register: Good,
            options: {
                reporters: [{
                        reporter: require('good-console'),
                        events: {
                            response: '*',
                            log: '*'
                        }
                    }]
            }
        });
        this.push({
            register: tools.default,
            options: {}
        });
        this.push({
            register: routes_1.default.register,
            options: configuration
        });
        this.push({
            register: routes_2.default.register,
            options: {}
        });
    }
}
exports.default = Plugins;
