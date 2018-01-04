
import { EventEmitter2 } from 'eventemitter2';

import util = require('util');
import net = require('net');
import crypto = require('crypto');
import { Connection } from './Connection';



export class FreeSwitchServer extends EventEmitter2 {
    seq: number;
    port: number;
    host: string;
    password: string;
    server: any;
    connections: any;
    constructor(opts?, readyCb?) {
        super({ wildcard: true, delimiter: '::', maxListeners: 1000 });
        this.port = opts.port || 8085;
        this.host = opts.host || '127.0.0.1';
        this.password = opts.password || 'ClueCon';
        this.connections = {};
    }
    createInboundServer() {
        const conn = new Connection();
        conn.client(this.host, this.port, this.password);
    }
    
    async createOutboundServer() {
        try {
            const self = this;
            this.server = net.createServer(this._onConnection.bind(this));
            this.server.listen(this.port, this.host, this._onListening.bind(this));
            const result = await new Promise((resolve, reject) => {
                this.once('ready', () => {
                    resolve(`FreeSwitch Outbound Server Start At:${this.port}`);
                });
            })
            return result;
        }
        catch (ex) {
            return Promise.reject(ex);
        }
    }
    close(callback) {
        this.server.close(callback);
    }

    _onConnection(socket: net.Socket) {
        const conn = new Connection();
        conn.server(socket);
        const id = this._generateId();

        this.connections[id] = conn;
        this.connections[id]._id = id;

        this.emit('connection::open', conn, id);

        conn.on('esl::ready', function (id) {
            if (this.bindEvents) {
                conn.sendRecv('myevents', function () {
                    this.emit('connection::ready', this.connections[id], id);
                }.bind(this));
            } else {
                this.emit('connection::ready', this.connections[id], id);
            }
        }.bind(this, id));

        conn.on('esl::end', function (id) {
            this.emit('connection::close', this.connections[id], id);

            delete this.connections[id];
        }.bind(this, id));
    }

    _onListening() {
        this.emit('ready');
    }

    _generateId() {
        var rand = new Buffer(15); // multiple of 3 for base64

        //next in sequence
        this.seq = (this.seq + 1) | 0;

        //write sequence to last 4 bytes of buffer
        rand.writeInt32BE(this.seq, 11);

        //write random to first 11 bytes of buffer
        crypto.randomBytes(11).copy(rand);

        //make the base64 safe for an object property
        return rand.toString('base64').replace(/\//g, '_').replace(/\+/g, '-');
    }

}


