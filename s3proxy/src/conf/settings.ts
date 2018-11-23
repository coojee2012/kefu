/**
 * Created by lil on 2017/4/25.
 */
export class S3Config {
    bucket:string;
    prefix:string;
    region: string;
    accessKeyId: string;
    secretAccessKey: string;
    constructor(bucket:string ,prefix:string ,region:string ,accessKeyId:string ,secretAccessKey:string){
        this.bucket = bucket;
        this.prefix = prefix;
        this.region = region;
        this.accessKeyId = accessKeyId;
        this.secretAccessKey = secretAccessKey;
    }
}
export class Setting {
    host: string;
    port: number;
    s3Config:S3Config;
    constructor(node_env:string){
        this.host = "0.0.0.0";
        this.port = 3000;
        this.s3Config = new S3Config('uobject','','cn-north-1','AKIAODZ6AJ7IGXT326NA','7HxhSjhVSFrGGKKpLXB6xS334aa5U5oBMxXyR0Aw');

    }
}
