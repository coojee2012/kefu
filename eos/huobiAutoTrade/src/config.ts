const config = {
    huobi: {
        "access_key": "2e2ec210-97747904-a0a3580b-0efc9",
        "secretkey": "",
        "account_id": "15308098290",
        "account_id_pro": "15308098290",
        "trade_password": "replace_me"
    },
    mongo: {
        uris: "mongodb://test:test@192.168.2.220:28017,192.168.2.220:28018,192.168.2.220:28019/test",
        /**
        * db      - passed to the connection db instance
        * server  - passed to the connection server instance(s)
        * replset - passed to the connection ReplSetServer instance
        * user    - username for authentication
        * pass    - password for authentication
        *
        * auth    - options for authentication (see http://mongodb.github.com/node-mongodb-native/api-generated/db.html#authenticate)
        * mongos  - Boolean - if true, enables High Availability support for mongos
        */
        opts: {
            //useMongoClient: true,
            autoIndex: false, // Don't build indexes
            reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
            reconnectInterval: 500, // Reconnect every 500ms
            poolSize: 10, // Maintain up to 10 socket connections
            // If not connected, return errors immediately rather than waiting for reconnect
            bufferMaxEntries: 0,
            replicaSet:'meteor'
        },
    },
}

export  default config