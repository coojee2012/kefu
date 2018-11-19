import {ReadStream} from "fs";
import {WriteStream} from "fs";
import {S3Config} from "../conf/settings";
import {Config} from "../../node_modules/aws-sdk/lib/config";
import {ConfigurationOptions} from "../../node_modules/aws-sdk/lib/config";
import {ConfigurationServicePlaceholders} from "../../node_modules/aws-sdk/lib/config_service_placeholders";
import {APIVersions} from "../../node_modules/aws-sdk/lib/config";
/**
 * Created by lil on 2017/4/25.
 */
class ProxyClient{
    prefix: string;
    bucketName: string;
    s3Streaming: any;
    AWS :any;
    option:ConfigurationOptions & ConfigurationServicePlaceholders & APIVersions;
    executeResult = {
        UploadSuccess:'UploadSuccess',
        UploadFailed:'UploadFailed',
        DownloadSuccess:'DownloadSuccess',
        DownloadFailed:'DownloadFailed'
    };
    createS3Key:Function =(path :string):string=>{
        let s3Key :string = this.prefix;
        if(path.length > 0 && path.charAt(0) === '/'){
            if(s3Key.length === 0){
                s3Key = path.substr(1);
            }else{
                s3Key += path;
            }
        }else{
            if(s3Key.length === 0){
                s3Key = path;
            }else{
                s3Key += '/' + path;
            }
        }
        return s3Key;
    }
    upload: Function =(inputStream: ReadStream ,path: string,ContentType: string): string=>{
        try{
            var upload = this.s3Streaming.WriteStream(new this.AWS.S3(), {
                Bucket: this.bucketName,
                Key: this.createS3Key(path),
                // Any other AWS SDK options
                ContentType: ContentType
                //Expires: ExpireTime
                // ...
            });
            inputStream.pipe(upload);
            return this.executeResult.UploadSuccess;
        }catch(e){
            return this.executeResult.UploadFailed;
        }
    }
    download: Function = (path: string): ReadStream =>{
        let download: ReadStream = this.s3Streaming.ReadStream(new this.AWS.S3(), {
            Bucket: this.bucketName,
            Key: this.createS3Key(path),
            // Any other AWS SDK options
        });
        //download.pipe(outputStream);
        return download;
    };
    constructor(configuration: S3Config){
        this.prefix =configuration.prefix;
        this.bucketName = configuration.bucket;
        const AWS = require('aws-sdk');
        this.AWS = AWS;
        const config: Config =AWS.config;
        this.option = < ConfigurationOptions & ConfigurationServicePlaceholders & APIVersions>{
            accessKeyId: configuration.accessKeyId,
            secretAccessKey: configuration.secretAccessKey,
            region: configuration.region
        };
        config.update(this.option);
        this.s3Streaming = require('s3-streams');
    }

}
export default ProxyClient;
//const AWS = require('aws-sdk');
//const config: Config =AWS.config;
//export default function(configuration: S3Config){
//    const S3S = require('s3-streams');
//    const bucketName: string =configuration.bucket;
//    let option : ConfigurationOptions & ConfigurationServicePlaceholders & APIVersions = < ConfigurationOptions & ConfigurationServicePlaceholders & APIVersions>{
//        accessKeyId: configuration.accessKeyId,
//        secretAccessKey: configuration.secretAccessKey,
//        region: configuration.region
//    };
//    config.update(option);
//    function createS3Key(path :string):string{
//        let s3Key :string = configuration.prefix;
//        if(path.length > 0 && path.charAt(0) === '/'){
//            if(s3Key.length === 0){
//                s3Key = path.substr(1);
//            }else{
//                s3Key += path;
//            }
//        }else{
//            if(s3Key.length === 0){
//                s3Key = path;
//            }else{
//                s3Key += '/' + path;
//            }
//        }
//        return s3Key;
//    }
//    const executeResult={
//        UploadSuccess:'UploadSuccess',
//        UploadFailed:'UploadFailed',
//        DownloadSuccess:'DownloadSuccess',
//        DownloadFailed:'DownloadFailed'
//    }
//    return {
//        upload:(inputStream: ReadStream ,path: string,ContentType: string): string=>{
//            try{
//                var upload = S3S.WriteStream(new AWS.S3(), {
//                    Bucket: bucketName,
//                    Key: createS3Key(path),
//                    // Any other AWS SDK options
//                    ContentType: ContentType
//                    //Expires: ExpireTime
//                    // ...
//                });
//                inputStream.pipe(upload);
//                return executeResult.UploadSuccess;
//            }catch(e){
//                return executeResult.UploadFailed;
//            }
//        },
//        download:(path: string): ReadStream =>{
//            let download: ReadStream = S3S.ReadStream(new AWS.S3(), {
//                Bucket: bucketName,
//                Key: createS3Key(path),
//                // Any other AWS SDK options
//            });
//            //download.pipe(outputStream);
//            return download;
//        }
//    }
//}