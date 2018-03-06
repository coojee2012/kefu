import * as mongoose from 'mongoose';
/**
 * 定义接口
 */
export type CallProcessModel = mongoose.Document & {
    _id:string;
    tenantId:string;
    callId:string;
    caller:string;
    called:string;
    processName:string;
    passArgs:any;
    isHide:boolean;
    ts:Date;
}
const callProcessSchema = new mongoose.Schema({
    tenantId: {type: String, required: true},
    callId: {type: String, required: true},
    caller: {type: String},
    called: {type: String},
    processName: {
      type: String,
     /* enum: {
        values: 'cgrate,route,ivr,holdOn,holdOff,queue,dialout,input,extension,conference,voicemail'.split(','),
        message: ''
      }*/
    },
    passArgs: {},
    isHide:{type:Boolean},
    ts: {type: Date, default: ()=>new Date()},
});

export default callProcessSchema;