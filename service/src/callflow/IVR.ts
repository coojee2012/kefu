import { Injector, ReflectiveInjector, Injectable } from 'injection-js';
import  crypto = require('crypto');
import { ConfigService } from '../service/ConfigService';
import { LoggerService } from '../service/LogService';
import { Connection } from '../lib/NodeESL/Connection';
import { Event } from '../lib/NodeESL/Event';

import { FreeSwitchPBX, uuidPlayAndGetDigitsOptions } from './FreeSwitchPBX';
import { RuntimeData } from './RunTimeData';

import { PBXIVRActionsController } from '../controllers/pbx_ivrAction';
import { PBXCallProcessController } from '../controllers/pbx_callProcess';
import { PBXCDRController } from '../controllers/pbx_cdr';
import { PBXIVRInputController } from '../controllers/pbx_ivrInput';

import { ActionPlaybackArgs } from '../models/pbx_ivrActions';

type TDoneIvrActionResult = {
    nextType: string; // 下一步执行的操作类型[ivr,diallocal,extension,queue,conference],除了下一步为ivr外，其余步骤全部为结束IVR，并回到调用处
    nextArgs?: string;// 下一步的参数
}

@Injectable()
export class IVR {
    private logger: LoggerService;
    private pbxActionController: PBXIVRActionsController;
    private pbxCallProcessController: PBXCallProcessController;
    private pbxCDRController: PBXCDRController;
    private pbxIvrInputController: PBXIVRInputController;

    private runtimeData: RuntimeData;
    private fsPbx: FreeSwitchPBX;

    private mainIvrNumber: string; // 主菜单IVR号码，通常表示为第一次该IVR的号码
    private preIvrNumber: string; // 上一层IVR菜单的号码

    constructor(private injector: Injector) {
        this.logger = this.injector.get(LoggerService);
        this.pbxActionController = this.injector.get(PBXIVRActionsController);
        this.pbxCallProcessController = this.injector.get(PBXCallProcessController);
        this.pbxCDRController = this.injector.get(PBXCDRController);
        this.pbxIvrInputController = this.injector.get(PBXIVRInputController);

        this.fsPbx = this.injector.get(FreeSwitchPBX);
        this.runtimeData = this.injector.get(RuntimeData);
    }
    /**
   * @description
   * 关于IVR中发生跳转的规则说明:
   * 1.IVR跳转到其他IVR后,当其他ivr执行完毕后,不允许到原来的IVR继续执行;
   * 2.IVR转到队列,分机,会议,或拨打外线后,不继续执行原IVR的步骤
   * @param ivrNumber
   * @param action
   * @return {*}
   */
    async ivrAction({ ivrNumber, ordinal, uuid }: { ivrNumber: string, ordinal: number, uuid: string }): Promise<TDoneIvrActionResult> {
        try {
            const { tenantId, callId, caller, ivrCurrentDeep, ivrMaxDeep } = this.runtimeData.getRunData();
            this.logger.debug(`正在处理IVR:Number-${ivrNumber},Action-${ordinal},uuid:${uuid}`);
            if (ivrCurrentDeep < ivrMaxDeep) {
                const actionDoc = await this.pbxActionController.getIvrAction(tenantId, ivrNumber, ordinal);
                if (actionDoc) {
                    if (!this.mainIvrNumber) this.mainIvrNumber = ivrNumber;
                    const actionTypeName = this.getActionType(actionDoc.actionType);
                    await this.pbxCallProcessController.create({
                        caller,
                        called: ivrNumber,
                        tenantId,
                        callId,
                        processName: 'ivrAction',
                        passArgs: { ivrNumber, ordinal, actionType: actionTypeName }
                    });
                    await this.pbxCDRController.lastApp(callId, tenantId, `IVRAction:${ivrNumber}-Action:${ordinal}-Type:${actionTypeName}`);
                    this.runtimeData.increaseIvrCurrentDeep(1);
                    const result: TDoneIvrActionResult = await this.doneAction(ivrNumber, actionDoc.actionType, actionDoc.args, uuid);
                    if (result.nextType === 'ivr') {
                        let gotoIvrNumber = ivrNumber;
                        let gotoIvrActId = ordinal + 1;
                        if (result.nextArgs) {
                            const args2 = result.nextArgs.split(',');
                            gotoIvrNumber = args2[0];
                            gotoIvrActId = +args2[1] ? +args2[1] : 1;

                        }
                        return await this.ivrAction({ ivrNumber: gotoIvrNumber, ordinal: gotoIvrActId, uuid });

                    } else {
                        return result;
                    }
                }
                // 指向一个不存在的action时，表示IVR执行完毕
                else {
                    return { nextType: 'normal' }
                }
            }
            else {
                return Promise.reject(`IVR DEEP MAX:${ivrMaxDeep}`);
            }
        }
        catch (ex) {
            return Promise.reject(ex);
        }
    }

    async doneAction(ivrNumber: string, actionType: number, args: any, uuid: string): Promise<TDoneIvrActionResult> {
        try {
            let result: TDoneIvrActionResult;
            switch (actionType) {
                case 1: {
                    this.logger.debug('执行IVR播放语音菜单。');
                    result = await this.playback(ivrNumber, <ActionPlaybackArgs>args, uuid);
                    break;
                }
                case 4:
                    {
                        this.logger.debug('录制用户数字按键');
                        let file = 'ivr/8000/silence.wav';

                        break;
                    }
                case 9:
                    {
                        result = await this.checkDateTime(ivrNumber, args);
                        break;
                    }
                default: {
                    this.logger.warn('未知的IVR Action');
                    break;
                }
            }
            return result;
        }
        catch (ex) {
            return Promise.reject(ex);
        }
    }

    async playback(ivrNumber: string, args: ActionPlaybackArgs, uuid: string): Promise<TDoneIvrActionResult> {
        try {
            const { tenantId, callId, caller, ivrCurrentDeep, ivrMaxDeep } = this.runtimeData.getRunData();
            let { input, doneGo, errorGo } = args.logic;
            let result: TDoneIvrActionResult;
            const opsTmp = Object.assign({}, args.pbx);
            if (opsTmp.file_from_var) {
                opsTmp.file = await this.fsPbx.getChannelVar(opsTmp.file_from_var, uuid);
            }
            if (input) {
                const ops: uuidPlayAndGetDigitsOptions = <uuidPlayAndGetDigitsOptions>opsTmp;
                const inputKey = await this.fsPbx.uuidPlayAndGetDigits({ options: ops, uuid: callId, includeLast: false });
                await this.pbxCallProcessController.create({
                    caller,
                    called: ivrNumber,
                    tenantId,
                    callId,
                    processName: 'input',
                    passArgs: { key: inputKey }
                });
                if (inputKey && inputKey != '' && inputKey != '_invalid_') {
                    // _this.lastInputKey = inputKey;
                    // result = await _this.doneIvrInput(ivrNumber, inputKey);
                    const ivrInputDoc = await this.pbxIvrInputController.getIvrInput(tenantId, ivrNumber, inputKey);
                    if (ivrInputDoc) {
                        result = {
                            nextType: 'ivr',
                            nextArgs: `${ivrInputDoc.gotoIvrNumber},${ivrInputDoc.gotoIvrActId}`
                        }
                    } else {
                        result = {
                            nextType: 'ivr',
                            nextArgs: errorGo
                        }
                    }
                }
                // 获取按键错误超过限制的次数,或者等待按键超时
                else {
                    this.logger.warn(`获取按键${inputKey}错误或超时！！！`);
                    result = {
                        nextType: 'ivr',
                        nextArgs: errorGo
                    }
                }
            }
            else {
                await this.fsPbx.uuidPlayback({ uuid: callId, file: opsTmp.file, terminators: 'none' });
                result = {
                    nextType: 'ivr',
                    nextArgs: doneGo
                }
            }
            return result;
        }
        catch (ex) {
            return Promise.reject(ex);
        }
    }

    async checkDateTime(ivrNumber: string, args): Promise<TDoneIvrActionResult> {
        try {
            const { tenantId, callId, caller } = this.runtimeData.getRunData();
            let result: TDoneIvrActionResult;
            let workDayAndTime = true;
            const serverNow = new Date();
            const serverLocalTime = serverNow.getTime();
            const localOffset = serverNow.getTimezoneOffset() * 60000; //获得当地时间偏移的毫秒数
            const utc = serverLocalTime + localOffset; //utc即GMT时间
            const offset = 8; //以北京时间为例，东8区
            const hawaii = utc + (3600000 * offset);
            const now = new Date(hawaii);

            const year = now.getFullYear();
            const month = now.getMonth() + 1;
            const date = now.getDate(); // 每月的几号1-31
            const week = now.getDay();//星期0-6,0是星期天
            const hour = now.getHours();//0-23
            const seconds = now.getSeconds();//0-59
            const minutes = now.getMinutes();//0-59
            if (args && args.logic) {
                //不工作的日期时间,指定到月份 和 日期
                // ['01-01 08:30_01-01 18:30','10-01 08:30_10-07 18:30']
                const { notWorkTimes, times, weeks, dates } = args.logic
                if (notWorkTimes && notWorkTimes.length > 0) {
                    let timeOK = true;
                    for (let i = 0; i < notWorkTimes.length; i++) {
                        const [start, end] = notWorkTimes[i].split('_');
                        const startTime = new Date(`${year}-${start}:00`).getTime();
                        const endTime = new Date(`${year}-${end}:59`).getTime();
                        if (now.getTime() >= startTime && now.getTime() <= endTime) {
                            timeOK = false;
                            break;
                        }
                    }
                    workDayAndTime = timeOK;
                }
                //时间范围检测，目标支持多个时间段
                if (workDayAndTime && times && times.length > 0) {
                    const monthStr = month < 10 ? `0${month}` : `${month}`;
                    const dateStr = date < 10 ? `0${date}` : `${date}`;
                    const today = `${year}-${monthStr}-${dateStr}`;
                    //格式为:['08:30-17:30','18:30-20:30']
                    let timeOK = false;
                    for (let i = 0; i < times.length; i++) {
                        const [start, end] = times[i].split('-')
                        const startTime = new Date(`${today} ${start}:00`).getTime();
                        const endTime = new Date(`${today} ${end}:59`).getTime();
                        if (now.getTime() >= startTime && now.getTime() <= endTime) {
                            timeOK = true;
                            break;
                        }
                    }
                    workDayAndTime = timeOK;
                }
                // 星期检测
                // atgs.weeks = [1,2,3,4,5]
                if (workDayAndTime && weeks && weeks.length > 0) {
                    if (weeks.indexOf(week) < 0) {
                        workDayAndTime = false;
                    }
                }

                // 日期检测
                // atgs.dates = [1,2,3,4,5...,31]
                if (workDayAndTime && dates && dates.length > 0) {
                    if (dates.indexOf(date) < 0) {
                        workDayAndTime = false;
                    }
                }

                //TODO 月份
                //TODO 年份

            }
            await this.pbxCallProcessController.create({
                caller,
                called: ivrNumber,
                tenantId,
                callId,
                processName: 'ivrReturn',
                passArgs: { result: workDayAndTime ? '工作时间' : '非工作时间' }
            })
            // 如果不是上班时间如何处理
            const pbxArgs = Object.assign({}, { doneGo: '', errorGo: '' }, args.pbx);
            if (!workDayAndTime) {
                this.logger.debug('目前是非工作时间!');
                result = { nextType: 'ivr', nextArgs: pbxArgs.errorGo }
            }
            else {
                result = { nextType: 'ivr', nextArgs: pbxArgs.doneGo }
            }
            // 正常情况下默认进入ivr的下一步，暂时不做太多的处理
            return result;
        }
        catch (ex) {
            return Promise.reject(ex);
        }
    }

    async recordKeys(ivrNumber,args, uuid) {
        try {
            let file: string;
            const { tenantId, callId, caller } = this.runtimeData.getRunData();
            if (args.pbx.file_from_var && args.pbx.file_from_var != '') {
                const chelfile = await this.fsPbx.getChannelVar(args.pbx.file_from_var, uuid);
                file = await this.fillSoundFilePath(chelfile);

            }
            else if (args.pbx.file) {
                file = await this.fillSoundFilePath(args.pbx.file);
            }
            else if (args.logic.playBee) {
                file = 'ivr/8000/bee.wav';
            }
            else {

            }
            const ops = Object.assign({}, args.pbx, { file });
            ops.invalid_file = await this.fillSoundFilePath(ops.invalid_file);
            delete ops.file_from_var;
            ops.input_err_file = await this.fillSoundFilePath(ops.input_err_file);
            ops.input_timeout_file = await this.fillSoundFilePath(ops.input_timeout_file);

            let inputs = await this.fsPbx.playback(ops, true, args.logic.includeLast, uuid);
            // 输入超过错误次数或者超过超时次数,值为:_invalid_
            const chanData = {};
            if (args.logic.needEncrypt) {
                inputs = this.encryptText({
                    password: tenantId,
                    text: inputs
                })
                inputs = `jm00000001${inputs}`;
            }
            await this.pbxCallProcessController.create({
                caller,
                called: ivrNumber,
                tenantId,
                callId,
                processName: 'recordDigits',
                passArgs: { inputs: inputs }
            })
            //_this.R.inputKeys[args.pbx.var_name] = inputs;
            chanData[args.pbx.var_name] = inputs;
            await this.fsPbx.set(chanData);
        }
        catch (ex) {
            return Promise.reject(ex);
        }
    }

    encryptText({ algorithm='aes-256-ctr', password, text }:{algorithm?:string, password:string, text:string}) {
        const cipher = crypto.createCipher(algorithm, password)
        let crypted = cipher.update(text, 'utf8', 'hex')
        crypted += cipher.final('hex');
        this.logger.debug("加密结果：", crypted);
        return crypted;
    }

    decryptText({ algorithm='aes-256-ctr', password, text }:{algorithm?:string, password:string, text:string}) {
        const decipher = crypto.createDecipher(algorithm, password)
        let dec = decipher.update(text, 'hex', 'utf8')
        dec += decipher.final('utf8');
        return dec;
    }

    /**
    * @description 执行IVR按键中断
    * @param ivrNumber
    * @param input
    * @returns {Promise.<*>}
    */
    async doneIvrInput(ivrNumber: string, input: string): Promise<any> {
        try {

        }
        catch (ex) {
            return Promise.reject(ex);
        }
    }

    getActionArgs<T>(args: T): T {
        return args;
    }

    getActionType(action: number) {
        const IVRACTION = [
            '', '播放语音', '发起录音', '播放录音', '录制数字字符', '读出数字字符', '拨打号码',
            '数字方式读出', '读出日期时间', '检测日期', '主叫变换', '检查号码归属地', '跳转到语音信箱',
            '跳转到IVR菜单', 'WEB交互接口', 'AGI扩展接口', '等待几秒', '播放音调', '挂机',
            '消息发布', '通道变量检测', '设置通道变量', '通过redis发送消息', '满意度'
        ];
        return IVRACTION[action];
    }

    async fillSoundFilePath(file) {

        try {
            // const _this = this;
            // const {dbi, tenantId} = _this.R;
            // let resFile = '';
            // let filePrefix = _this.R.config.s3FileProxy ? 'http_cache://' + _this.R.config.s3FileProxy : '/usr/local/freeswitch/files/';
            // if (ObjectID.isValid(file)) {
            //   const soundFileObj = await dbi.sound.get(tenantId, file);
            //   if (soundFileObj) {
            //     resFile = filePrefix + soundFileObj.url;
            //   } else {
            //     resFile = file;
            //   }
            // }
            // else if (/^http/.test(file)) {
            //   resFile = 'http_cache://' + file;
            // }
            // else {
            //   resFile = file;
            // }
            // _this.R.logger.debug('fillSoundFilePath:', resFile);
            // return resFile;
            return file;
        }
        catch (ex) {
            return Promise.reject(ex);
        }

    }



}