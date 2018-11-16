"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Created by lil on 2017/4/25.
 */
class S3Config {
    constructor(bucket, prefix, region, accessKeyId, secretAccessKey) {
        this.bucket = bucket;
        this.prefix = prefix;
        this.region = region;
        this.accessKeyId = accessKeyId;
        this.secretAccessKey = secretAccessKey;
    }
}
exports.S3Config = S3Config;
class Setting {
    constructor(node_env) {
        this.host = "0.0.0.0";
        this.port = 3000;
        this.s3Config = new S3Config('uobject', '', 'cn-north-1', 'AKIAODZ6AJ7IGXT326NA', '7HxhSjhVSFrGGKKpLXB6xS334aa5U5oBMxXyR0Aw');
    }
}
exports.Setting = Setting;
