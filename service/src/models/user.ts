/**
 * @description 用户表
 * @author 11366846@qq.com,LinYong
 */
/**
 * 引入依赖
 */
import * as bcrypt from 'bcrypt';
import * as mongoose from 'mongoose';


/**
 * 定义接口
 */
export type UserModel = mongoose.Document & {
    slug: String;
    _id: String;
    createdAt: Date;   // 创建时间
    updatedAt: Date;   // 更新时间
    username: String; // 登陆账号
    password: String; // 登陆密码
    status: String;  // 用户账号状态
    state: String;  // 用户工作状态
    phone: String; // 用户工作电话
    checkInType: String; // 签入方式
    tokens: AuthToken[];  // 第三方认证
    auths: AuthList[];  // 实名认证
    profile: {        // 个人资料
        gender: String;   // 性别
        location: String;  // 地址
        intro: String;   // 个人介绍
        qrcode: String;   // 个人二维码
        homepage: String;   // 个人主页
        country_code: String   // 来自哪个国家
    };
    author: String;   // 作者身份
    domain: String; // 企业域
    role: String; // 用户角色   
    basic: {   // 基本设置
        nickname: String;   // 昵称
        avatar: String;    // 头像
        locale: String;    // 阅读语言
        chats_notify: Boolean;   // 简信接收设置
        email_notify: String    // 提醒邮件通知
    };
    token: String;    // 登陆签名
    memo: String; // 备注
    extension: String; // 使用分机
    customer?: any; // 针对vistor访客，绑定在某个客户上
    comparePassword: (candidatePassword: String, callback: (err: any, isMatch: boolean) => any) => void;  // 验证密码
    gravatar: (size: number) => String   // 获取头像
};

/**
 * 实名认证
 */
export interface AuthList {
    key: String;   // 认证名称 mobile 手机 email 邮箱 realname 实名认证 identity
    value: String;  // 认证内容
    status: String;    // 认证状态 0 未认证 1 已认证 2 已注销
}

/**
 * 社交认证
 */
export interface AuthToken {
    accessToken: String;
    kind: String;
}

const userSchema = new mongoose.Schema({
    username: {    // 登陆账号
        type: String,
        // unique: true, // 不可重复约束
        require: true // 不可为空约束
    },
    password: {    // 登陆密码
        type: String,
        require: true // 不可为空约束
    },
    domain: {    // 登陆密码
        type: String,
        require: true // 不可为空约束
    },
    status: {  // 用户状态  0 不存在（注销） 1 启用 2 黑名单 
        type: String,
        required: true,
        enum: ['0', '1', '2'],
        default: '0'
    },
    state: {  // 用户业务状态  -1 未签入 waiting 空闲 busy 示忙 rest 小休  ringing SIP响铃  inthecall SIP通话中 idle  话后处理
        type: String,
        required: true,
        enum: ['-1', 'waiting', 'busy', 'rest', 'idle', 'ringing', 'inthecall'],
        default: '-1'
    },
    checkInType: { // 用户电话签入类型 mobile  sip  embed msg
        type: String,
        required: true,
        enum: ['-1', 'embed', 'sip', 'mobile', 'msg'],
        default: '-1'
    },
    role: {    // 角色身份  0 超级管理员 1 坐席 group 组长
        type: String,
        required: true,
        enum: ['master', 'agent', 'group', 'visitor'],
        default: 'agent'
    },
    phone: { // 工作使用的电话
        type: String,
        default: () => ''
    },
    customer: {
        type: mongoose.Schema.Types.ObjectId,    // 引用类型
        ref: 'Customer'                     // 关联客户 针对访客有效
    }, 
    memo: { // 备注
        type: String,
        default: () => ''
    },
    extension: { // 工作使用的分机
        type: String,
        default: () => ''
    },
    author: {    // 作者身份  0 普通作者 1 签约作者 2 金牌作者
        type: String,
        enum: ['0', '1', '2'],
        default: '0'
    },
    tokens: [{
        accessToken: String,
        kind: String
    }],
    auths: [{
        key: String,   // 认证名称 mobile 手机 email 邮箱 realname 实名认证 identity
        value: String,  // 认证内容
        status: String    // 认证状态 0 未认证 1 已认证 2 已注销
    }],
    profile: {
        gender: {  // 性别 0 保密 1 男 2 女
            type: String,
            enum: ['0', '1', '2'],
            default: '0'
        },
        location: String,
        intro: String,
        qrcode: String,
        homepage: String,
        country_code: {
            type: String,
            'default': 'cn'
        }
    },
    basic: {
        nickname: {    // 昵称
            type: String,
            minlength: 2,   // 最小2个字符
            maxlength: 10,  // 最大10个字符
            unique: true,  // 不可重复约束
            require: true  // 不可为空约束
        },
        avatar: String,
        locale: {
            type: String,
            'default': 'zh-CN'
        },
        chats_notify: {
            type: Boolean,
            'default': true
        },
        email_notify: {
            type: String,
            'default': 'none',
            'enum': ['none', 'later', 'instantly']
        }
    },
    token: String
}, { timestamps: true });

userSchema.index({ username: 1, domain: 1 }, { unique: true });
/**
 * 添加用户保存时中间件对password进行bcrypt加密,这样保证用户密码只有用户本人知道
 */
userSchema.pre('save', function (next) {
    const user = this;
    if (!user.isModified('password')) {
        return next();
    }
    bcrypt.genSalt(10, (err, salt) => {
        if (err) {
            return next(err);
        }
        bcrypt.hash(user.password, salt, (error, hash) => {
            if (error) {
                return next(error);
            }
            user.password = hash;
            // user.status = 1;
            user.auths.push({
                key: 'mobile',
                value: user.username,
                status: '1'
            });
            next();
        });
    });
});

userSchema.pre('update', function (next) {
    const self = this;
    if (self._update.$set.password) {
        const password = self._update.$set.password;
        bcrypt.genSalt(10, (err, salt) => {
            if (err) {
                return next(err);
            }
            bcrypt.hash(password, salt, (error, hash) => {
                if (error) {
                    return next(error);
                }
                self._update.$set.password = hash
                next();
            });
        });
    } else {
        next();
    }

});

/**
 * 校验用户输入密码是否正确
 * @method comparePassword
 * @param candidatePassword {String}  验证密码
 * @param callback {Function}  回调函数
 */
userSchema.methods.comparePassword = function (candidatePassword?: string, callback?: any): any {
    bcrypt.compare(candidatePassword, this.password, (err: any, isMatch: boolean) => {
        if (err) {
            return callback(err);
        }
        callback(null, isMatch);
    });
};

/**
 * 校验用户输入密码是否正确
 * @method gravatar
 * @param size {Number}  验证密码
 */
userSchema.methods.gravatar = function (size: number) {
    return size;
};


export default userSchema;
// export default mongoose.model('User', userSchema);
