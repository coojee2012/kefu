/**
 * Created by lil on 2017/4/25.
 */
export declare class S3Config {
    bucket: string;
    prefix: string;
    region: string;
    accessKeyId: string;
    secretAccessKey: string;
    constructor(bucket: string, prefix: string, region: string, accessKeyId: string, secretAccessKey: string);
}
export declare class Setting {
    host: string;
    port: number;
    s3Config: S3Config;
    constructor(node_env: string);
}
