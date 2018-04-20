import { speech } from '../baidu-ai';
import Tools from './tools';
import fs from 'fs';
import crypto from 'crypto';
import http from 'http';
import url from 'url';
class TTS {
    constructor(config,logger) {
        this.config = config;
        this.logger = logger;
        this.APP_ID = config.baiduTTS.APP_ID;
        this.API_KEY = config.baiduTTS.API_KEY;
        this.SECRET_KEY = config.baiduTTS.SECRET_KEY;
        this.TTSOPTS = config.baiduTTS.opts;

        this.client = new speech(this.APP_ID, this.API_KEY, this.SECRET_KEY);
        this.loggerPrefix = ['ESL', 'CallFlow', 'TTS'];
    
    }

    async saveToLocal(txt, path) {
        const loggerPrefix = this.loggerPrefix.join('-') + '-saveToLocal';
        try {
            const result = await this.client.text2audio(txt, this.TTSOPTS);
            await new Promise((resolve, reject) => {
                fs.writeFile(path, result.data, (err) => {
                    if (err) reject(err);
                    resolve('The file has been saved!');
                });
            });
            return Promise.resolve(path);
        }
        catch (ex) {
            this.logger.error(loggerPrefix, ex);
            return Promise.reject(ex);
        }
    }


    async saveToS3(txt) {
       
        const loggerPrefix = this.loggerPrefix.join('-') + '-saveToS3';
        try {
            const md5Name = crypto.createHash('md5').update(txt).digest('hex');
            const path = `/tmp/${md5Name}.mp3`;
            const s3Url = this.config.s3FileProxy + `TTS/${md5Name}.mp3`;
            const hasExists = await this.httpCheckExists(s3Url);
            if(!hasExists){
                const result = await this.client.text2audio(txt,this.TTSOPTS);
                await this.httpUploadFileByBuffer(s3Url, result.data);
            }
            await this.wait(150);
            this.logger.debug(loggerPrefix, hasExists,s3Url);
            return Promise.resolve(s3Url);
        }
        catch (ex) {
            this.logger.error(loggerPrefix, ex);
            return Promise.reject(ex);
        }
    }

    async playback(uuid,txt,pbxApi,bePlayed) {
       
        const loggerPrefix = this.loggerPrefix.join('-') + '-playback';
        try {
            const url = await this.saveToS3(txt);
            const shoutUrl = url.replace(/^http/, 'shout');
            this.logger.debug(loggerPrefix, shoutUrl);
            await pbxApi.playback({
                terminators: 'none',
                file: shoutUrl,
              }, false,false,uuid);
        }
        catch(ex){
            this.logger.error(loggerPrefix, ex);
            return Promise.reject(ex);
        }
    }

    async broadcast(uuid,txt,pbxApi,bePlayed) {
        
         const loggerPrefix = this.loggerPrefix.join('-') + '-broadcast';
         try {
             const url = await this.saveToS3(txt);
             const shoutUrl = url.replace(/^http/, 'shout');
             this.logger.debug(loggerPrefix, shoutUrl);
             await pbxApi.uuidBroadcast(uuid, shoutUrl, 'aleg');
         }
         catch(ex){
             this.logger.error(loggerPrefix, ex);
             return Promise.reject(ex);
         }
     }


    httpCheckExists(s3Url) {
        const loggerPrefix = this.loggerPrefix.join('-') + '-httpCheckExists';
        const _this = this;
        return new Promise((resolve, reject) => {
            const urlObj = url.parse(s3Url);
            const req = http.get(urlObj, (res) => {
                if (res.statusCode < 399) {
                    let text = '';
                    res.on('data', (chunk) => {
                        text += chunk;
                    })
                    res.on('end', (data) => {
                        _this.logger.debug(loggerPrefix, res.headers['content-length']);
                        if(text.length) {
                            resolve(true);
                        }
                        else {
                            resolve(false); 
                        } 
                    })
                    res.on('error', reject);
                    // req.abort();                  
                }
                else if(res.statusCode == 404){
                    resolve(false);
                }
                else {
                    reject(res.statusCode);
                }
            });
            req.end();
            req.on('error', reject);  
        });
    }
    httpUploadFileByBuffer(s3url, buffer) {
        return new Promise((resolve, reject) => {
            const urlObj = url.parse(s3url);
            const options = Object.assign({}, urlObj, {
                timeout: 120000,
                method: 'POST',
            });
            const req = http.request(options, (res) => {
                if (res.statusCode < 399) {
                    let text = '';
                    res.on('data', (chunk) => {
                        text += chunk
                    })
                    res.on('end', (data) => {
                        resolve(text);
                    })
                    res.on('error', reject);
                } else {
                    reject(res.statusCode);
                }
            });

            const crlf = "\r\n";
            const boundaryKey = Math.random().toString(16);
            const boundary = `--${boundaryKey}`;
            const delimeter = `${crlf}--${boundary}`;
            const headers = [
                'Content-Disposition: form-data; name="file"; filename="test.mp3"' + crlf,
            ];
            const closeDelimeter = `${delimeter}--`;

            const multipartBody = Buffer.concat([
                new Buffer(delimeter + crlf + headers.join('') + crlf),
                buffer,
                new Buffer(closeDelimeter)]
            );

            req.setHeader('Content-Type', 'multipart/form-data; boundary=' + boundary);
            req.setHeader('Content-Length', multipartBody.length);

            req.write(multipartBody);
            req.end();
            req.on('error', reject);
        })
    }

    wait(ms) {
        return new Promise((resolve)=> {
          setTimeout(()=> {
            resolve()
          }, ms);
        })
      }
}
export default TTS;
