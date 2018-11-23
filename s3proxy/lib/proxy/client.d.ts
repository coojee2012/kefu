import { S3Config } from "../conf/settings";
import { ConfigurationOptions } from "../../node_modules/aws-sdk/lib/config";
import { ConfigurationServicePlaceholders } from "../../node_modules/aws-sdk/lib/config_service_placeholders";
import { APIVersions } from "../../node_modules/aws-sdk/lib/config";
/**
 * Created by lil on 2017/4/25.
 */
declare class ProxyClient {
    prefix: string;
    bucketName: string;
    s3Streaming: any;
    AWS: any;
    option: ConfigurationOptions & ConfigurationServicePlaceholders & APIVersions;
    executeResult: {
        UploadSuccess: string;
        UploadFailed: string;
        DownloadSuccess: string;
        DownloadFailed: string;
    };
    createS3Key: Function;
    upload: Function;
    download: Function;
    constructor(configuration: S3Config);
}
export default ProxyClient;
