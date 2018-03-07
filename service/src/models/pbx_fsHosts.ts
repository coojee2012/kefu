import * as mongoose from 'mongoose';
/**
 * 定义接口
 */
export type PBXFSHostModel = mongoose.Document & {
    fsName:string;
    fsCoreId:string;
    fsHost:string;
    runStatus:any;
    lm:Date;
}

const pbxFSHostSchema = new mongoose.Schema({
    fsName: {
        type: String,
        required: true
    },
    fsCoreId: {
        type: String,
        unique: true,
        required: true
    },
    fsHost: {
        type: String,
    },
    runStatus: {},
    lm: {
        type: Date,
        required: true
    }
})
pbxFSHostSchema.index({ fsCoreId: 1 }, { unique: true });
export default pbxFSHostSchema;