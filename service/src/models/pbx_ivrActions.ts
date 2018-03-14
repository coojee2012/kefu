import * as mongoose from 'mongoose';
/**
 * 定义接口
 */
export type PBXIVRActionsModel = mongoose.Document & {
  tenantId: string;
  ivrNumber: string;
  ordinal: number;
  actionType: number;
  args: any;
}

export type ActionPlaybackArgs = {
  pbx: ActionPlaybackPbxArgs,
  logic: ActionPlaybackLogicArgs
}

export type ActionPlaybackPbxArgs = {
  transfer_on_failure: string;
  digit_timeout: number;
  regexp: string;
  var_name: string;
  invalid_file: string;
  input_err_file: string;
  input_timeout_file: string;
  input_err_retry: number;
  input_timeout_retry: number;
  file_from_var: string;
  file: string;
  terminators: string;
  timeout: number;
  tries: number;
  max: number;
  min: number;
}

export type ActionPlaybackLogicArgs = {
  input?: boolean;
  doneGo?:string; // '200,1' 字符串表示的将要去向的IVR及其ordinal
}

const pbxIVRMenmuSchema = new mongoose.Schema({
  tenantId: {
    type: String,
    required: true
  },
  ivrNumber: {
    type: String,
    required: true
  },
  describe: {
    type: String,
    default: () => ''
  },
  ordinal: {
    type: Number,
    default: 1
  },
  actionType: {
    type: Number,
    default: 1
  },
  args: {},
  ts: {
    type: Date,
    default: () => new Date()
  },
  lm: {
    type: Date,
    default: null
  }
})
pbxIVRMenmuSchema.index({ tenantId: 1, ivrNumber: 1, ordinal: 1 }, { unique: true });
export default pbxIVRMenmuSchema;