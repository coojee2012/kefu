/**
 * Created by lil on 2017/4/25.
 */
import proxyRegister from "../proxy/routes"
import healthChecker from '../check/routes'
const tools=require('hapi-plugin-tools');
class Plugins extends Array{
    constructor(configuration){
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
            register: proxyRegister.register,
            options: configuration
        });
        this.push({
            register: healthChecker.register,
            options: {}
        })
    }
}
export default Plugins

