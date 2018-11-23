/**
 * Created by lil on 2017/4/25.
 */
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const Hapi = require("hapi");
const settings_1 = require("../conf/settings");
const hapi_plugins_1 = require("./hapi-plugins");
class ProxyServer {
    constructor() {
        this.start = () => {
            const self = this;
            let setting = new settings_1.Setting('NODE_ENV is not important');
            let plugins = new hapi_plugins_1.default(setting);
            this.server.connection({ port: setting.port, host: setting.host });
            this.server.register(plugins, function (err) {
                if (err) {
                    throw err;
                }
                self.server.start((err) => {
                    if (err) {
                        throw err;
                    }
                    self.server.log('info', 'Server running at: ' + self.server.info.uri);
                });
            });
        };
        this.server = new Hapi.Server();
    }
    ;
}
exports.default = ProxyServer;
