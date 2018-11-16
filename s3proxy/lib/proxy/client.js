"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Created by lil on 2017/4/25.
 */
class ProxyClient {
    constructor(configuration) {
        this.executeResult = {
            UploadSuccess: 'UploadSuccess',
            UploadFailed: 'UploadFailed',
            DownloadSuccess: 'DownloadSuccess',
            DownloadFailed: 'DownloadFailed'
        };
        this.createS3Key = (path) => {
            let s3Key = this.prefix;
            if (path.length > 0 && path.charAt(0) === '/') {
                if (s3Key.length === 0) {
                    s3Key = path.substr(1);
                }
                else {
                    s3Key += path;
                }
            }
            else {
                if (s3Key.length === 0) {
                    s3Key = path;
                }
                else {
                    s3Key += '/' + path;
                }
            }
            return s3Key;
        };
        this.upload = (inputStream, path, ContentType) => {
            try {
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
            }
            catch (e) {
                return this.executeResult.UploadFailed;
            }
        };
        this.download = (path) => {
            let download = this.s3Streaming.ReadStream(new this.AWS.S3(), {
                Bucket: this.bucketName,
                Key: this.createS3Key(path),
            });
            //download.pipe(outputStream);
            return download;
        };
        this.prefix = configuration.prefix;
        this.bucketName = configuration.bucket;
        const AWS = require('aws-sdk');
        this.AWS = AWS;
        const config = AWS.config;
        this.option = {
            accessKeyId: configuration.accessKeyId,
            secretAccessKey: configuration.secretAccessKey,
            region: configuration.region
        };
        config.update(this.option);
        this.s3Streaming = require('s3-streams');
    }
}
exports.default = ProxyClient;
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
