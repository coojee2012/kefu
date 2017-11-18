/**
 * Created by jiayi on 2017/2/10.
 */
import * as path from 'path';
const rootPath = path.resolve(__dirname + '/..');
const env = process.env.NODE_ENV || 'development';

// 数据库配置
const config = {
    development: {
        root: rootPath,
        app: {
            name: 'kefu'
        },
        port: 3000,
        
        mongoUris: "mongodb://test:test@192.168.2.220:28017,192.168.2.220:28018,192.168.2.220:28019/test",
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
      mongoOpts: {},
      
    },

    test: {
        root: rootPath,
        app: {
            name: 'kefu'
        },
        port: 3000,
        mongoUris: "mongodb://call_control:call_control@172.31.0.21:28017,172.31.0.21:28018,172.31.0.21:28019/call_control",     
        mongoOpts: {},
    },

    production: {
        root: rootPath,
        app: {
            name: 'kefu'
        },
        mongoUris: "mongodb://call_control:call_control@172.31.0.21:28017,172.31.0.21:28018,172.31.0.21:28019/call_control",       
        mongoOpts: {},
        port: 3000,
    }
};

export = config[env];
