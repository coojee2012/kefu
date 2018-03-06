import * as mongoose from 'mongoose';
/**
 * 定义接口
 */
export type PBXAgentModel = mongoose.Document & {}

const pbxAgentSchema = new mongoose.Schema({})
export default pbxAgentSchema;