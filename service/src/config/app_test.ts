/**
 * @description 开发环境配置
 */
const Config = {
    api: {
        port: '8008'
    },
    redis: {
        host: '127.0.0.1',
        port: '6379',
        //password: '',
        parser: "javascript",
        db: 1
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
        opts: {},
    },
    aws: {
        url: "amazonaws.com.cn",
        region: "cn-north-1",
        accessKeyId: "AKIAPSATLL73CQVBBZYA",
        secretAccessKey: "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",
        expires: 600,
        protocol: "https://"
    },
    baiduTTS: {
        APP_ID: '10356948',
        API_KEY: 'flH0fFNB65DO2oCxow9nDAi2',
        SECRET_KEY: 'qP2SclabGYKYns1zKO9xVnv6wPDAltLG',
        opts: {
            spd: 5, // 语速，取值0-9，默认为5中语速
            pit: 5, // 音调，取值0-9，默认为5中语调
            vol: 10, // 音量，取值0-15，默认为5中音量
            per: 0, // 发音人选择, 0为女声，1为男声，3为情感合成-度逍遥，4为情感合成-度丫丫，默认为普通女
        },
    },
    kamailio: {
        host: '192.168.2.230',
        port: '5060',
        dbHost: '192.168.2.220',
        dbPort: '3306',
        dbUser: 'root',
        dbPassword: 'unicall@2015',
        database: 'kamailio',
        database_default: 'kamailio',
        database_call_control: 'call_control',
        database_cgrates: 'cgrates'
    },
    callControlApi:{
        baseUrl:''
    },
    deepstream: {
        host: '192.168.2.230',
        port: '6020'
    },
    logLevel: 'debug',
    sipRegInFS:false,
    esl: {
        port: '8058',
        host: ''
    }
}
export default Config;
