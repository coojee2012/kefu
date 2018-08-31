import { Injectable, Injector } from 'injection-js';
import * as mongoose from 'mongoose';

import { LoggerService } from '../service/LogService';
import { MongoService } from '../service/MongoService';

@Injectable()
export class PBXMessageController {
    constructor(private injector: Injector, private logger: LoggerService, private mongoDB: MongoService) {

    }

    async createLiveChatMessage(data) {
        try {

            const { tenantId, rid, msg, conentType, from } = data;
            if (!tenantId) {
                return Promise.reject('pramas error!');
            }
            else {
                const newMessage = new this.mongoDB.models.Messages({
                    tenantId,
                    rid,
                    msg,
                    conentType,
                    from,
                    msgType: 'livechat'

                });
                const msgDoc = await newMessage.save();
                return msgDoc;
            }
        }
        catch (ex) {
            return Promise.reject(ex);
        }
    }

}
