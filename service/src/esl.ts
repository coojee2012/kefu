/**
 * Freeswitch ESL 应用
 */

import { FreeSwitchServer } from './lib/NodeESL/Server';

const opts = {
    host: '0.0.0.0',
    port: 8085
}
const ESLServer = new FreeSwitchServer(opts);
ESLServer.createOutboundServer()
    .then(res => {
        console.log(res);
    })
    .catch(err => {
        console.log(err);
    })