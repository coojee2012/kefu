import { Server } from "hapi";
declare class ProxyServer {
    server: Server;
    start: Function;
    constructor();
}
export default ProxyServer;
