import {Server} from "hapi";
/**
 * Created by lil on 2017/4/25.
 */
'use strict';
import Hapi = require('hapi');
import  {Setting} from '../conf/settings';
import Plugins from "./hapi-plugins"


class ProxyServer {
    server: Server;
    start: Function =()=> {
        const self = this;
        let setting = new Setting('NODE_ENV is not important');
        let plugins = new Plugins(setting);
        this.server.connection({port: setting.port, host: setting.host});
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
            }
        );
    };
    constructor() {
       
        this.server = new Hapi.Server();
    };
}
export default ProxyServer

