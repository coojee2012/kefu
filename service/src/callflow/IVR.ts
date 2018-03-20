import { Injector, ReflectiveInjector, Injectable } from 'injection-js';
import crypto = require('crypto');
import HTTP = require('request');
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
import { PBXQueueStatisticController } from '../controllers/pbx_queueStatistic';
import { PBXAgentStatisticController } from '../controllers/pbx_agentStatistic';
import { PBXBlackListController } from '../controllers/pbx_blacklist';

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
    private pbxQueueStatisticController: PBXQueueStatisticController;
    private pbxAgentStatisticController: PBXAgentStatisticController;
    private pbxBlacklistController: PBXBlackListController;

    private runtimeData: RuntimeData;
    private fsPbx: FreeSwitchPBX;
    private config: ConfigService;

    private mainIvrNumber: string; // 主菜单IVR号码，通常表示为第一次该IVR的号码
    private preIvrNumber: string; // 上一层IVR菜单的号码

    constructor(private injector: Injector) {
        this.logger = this.injector.get(LoggerService);
        this.config = this.injector.get(ConfigService);
        this.pbxActionController = this.injector.get(PBXIVRActionsController);
        this.pbxCallProcessController = this.injector.get(PBXCallProcessController);
        this.pbxCDRController = this.injector.get(PBXCDRController);
        this.pbxIvrInputController = this.injector.get(PBXIVRInputController);
        this.pbxQueueStatisticController = this.injector.get(PBXQueueStatisticController);
        this.pbxAgentStatisticController = this.injector.get(PBXAgentStatisticController);
        this.pbxBlacklistController = this.injector.get(PBXBlackListController);

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
                        result = await this.recordKeys(ivrNumber, args, uuid);
                        break;
                    }
                case 6:
                    {
                        let dialNumber = args.pbx.number;
                        this.logger.debug(`拨打号码:${dialNumber}`);
                        if (args.pbx.var_name && args.pbx.var_name !== '') {
                            const varNumber = await this.fsPbx.uuidGetvar({ varname: args.pbx.var_name, uuid });
                            console.log('FFFFFFFFFFFuuid_getvar', varNumber);
                            dialNumber = varNumber;
                            // localNumber = _this.R.inputKeys[args.pbx.var_name];
                        }
                        const dialWay = args && args.logic && args.logic.dial ? args.logic.dial : String(dialNumber).length > 4 ? 'dialout' : 'diallocal';
                        if (dialWay === 'diallocal') {
                            result = {
                                nextType: 'diallocal',
                                nextArgs: dialNumber,
                            }
                        }
                        else if (dialWay === 'dialout') {
                            const failDone = args.pbx && args.pbx.failDone ? args.pbx.failDone : null;
                            const ringingTime = args.pbx && args.pbx.ringingTime ? args.pbx.ringingTime : 30;
                            const isLastService = args.pbx.isLastService;
                            result = {
                                nextType: 'dialout',
                                nextArgs: `dialNumber=${dialNumber};ringingTime=${ringingTime};isLastService=${isLastService};failDone=${failDone}`,
                            }
                        }
                        else {
                            result = { nextType: 'normal' }
                        }
                        break;
                    }
                case 9:
                    {
                        result = await this.checkDateTime(ivrNumber, args);
                        break;
                    }
                case 16:
                    {
                        let { seconds = 1 } = args.logic;
                        result = await this.waitAmoment(ivrNumber, +seconds);
                        break;
                    }
                case 14:
                    {
                        // WEB交互接口
                        result = await this.webApi(uuid, ivrNumber, args);
                        break;
                    }
                case 18:
                    {
                        result = { nextType: 'normal' }
                        break;
                    }
                case 19: {

                    // break;
                }
                case 20: {
                    // 比较
                    result = await this.compareValues(uuid, ivrNumber, args);
                    break;
                }
                case 21:
                    {
                        result = await this.setChannelVar(uuid, args);
                        break;
                    }
                case 22:
                    {

                    }

                case 23:
                    {
                        result = await this.satisfaction({ uuid, options: args.pbx });
                        break;
                    }

                case 24:
                    {
                        result = await this.blackListAction(uuid);
                        break;
                    }
                case 25: {
                    //result = await _this.lastService(args);
                    //break;
                }
                default: {
                    this.logger.warn('未知的IVR Action');
                    result = { nextType: 'normal' }
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

    async recordKeys(ivrNumber, args, uuid): Promise<TDoneIvrActionResult> {
        try {
            let file: string;
            let result: TDoneIvrActionResult;
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
                file = 'ivr/8000/silence.wav';
            }
            const ops = Object.assign({}, args.pbx, { file });
            ops.invalid_file = await this.fillSoundFilePath(ops.invalid_file);
            delete ops.file_from_var;
            ops.input_err_file = await this.fillSoundFilePath(ops.input_err_file);
            ops.input_timeout_file = await this.fillSoundFilePath(ops.input_timeout_file);
            delete ops.var_name;

            let inputs = await this.fsPbx.uuidPlayAndGetDigits({
                uuid: uuid,
                options: <uuidPlayAndGetDigitsOptions>ops,
                includeLast: args.logic.includeLast
            });
            // 输入超过错误次数或者超过超时次数,值为:_invalid_

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
            await this.fsPbx.uuidSetvar({ uuid, varname: args.pbx.var_name, varvalue: inputs });
            result = { nextType: 'ivr', nextArgs: '' }
            return result;
        }
        catch (ex) {
            return Promise.reject(ex);
        }
    }

    async waitAmoment(ivrNumber: string, seconds: number): Promise<TDoneIvrActionResult> {
        try {
            const { tenantId, callId, caller } = this.runtimeData.getRunData();
            await this.pbxCallProcessController.create({
                caller,
                called: ivrNumber,
                tenantId,
                callId,
                processName: 'ivrReturn',
                passArgs: { result: `等待:${seconds * 1000}ms` }
            });
            await this.fsPbx.wait(seconds * 1000);
            return { nextType: 'normal' };
        } catch (ex) {
            return Promise.reject(ex);
        }
    }

    async webApi(uuid: string, ivrNumber: string, args) {
        try {
            const { tenantId, callId, caller } = this.runtimeData.getRunData();
            const { method, url, data = {}, channelVarData = {}, sendAgentMsg, successMsg } = args.logic;
            let result: TDoneIvrActionResult;
            const cvData = {};//存取从通道变量获取的
            if (channelVarData) {
                const ckeys = Object.keys(channelVarData)
                for (let i = 0; i < ckeys.length; i++) {
                    const varName = ckeys[i];
                    const varValue = await this.fsPbx.getChannelVar(channelVarData[varName], uuid);
                    cvData[varName] = varValue === '_undef_' ? '' : varValue;
                }
            }
            const passData = Object.assign({}, data, cvData, {
                tenantId,
                callerIdNumber: caller,
                reqId: `${callId}.${new Date().getTime()}`
            });
            const urlAddr = /^http/.test(url) ? url : this.config.getConfig().callControlApi.baseUrl + url;
            this.logger.debug(`Action 14 Request URL:${urlAddr}`);
            await this.pbxCallProcessController.create({
                caller,
                called: ivrNumber,
                tenantId,
                callId,
                processName: 'ivrRestApi',
                passArgs: { url: urlAddr, method }
            });

            const { error, response, body } = await this.httpPromise({
                url: urlAddr,
                method: method.toUpperCase(),
                json: true,
                timeout: 15 * 1000,
                body: passData,
            });
            if (error || response.statusCode > 299) {
                this.logger.error('Action 14 Request Error:', error || response.statusCode);
                const errCode = error ? error.code : response.statusCode;
                await this.pbxCallProcessController.create({
                    caller,
                    called: ivrNumber,
                    tenantId,
                    callId,
                    processName: 'ivrReturn',
                    passArgs: { result: `访问API接口异常:${errCode} ${response.statusCode}` }
                })
                switch (errCode) {
                    case 'ETIMEDOUT':
                        break;
                    default:
                        break;
                }
                /* result = {
                 success: true,
                 jumpOut: true,
                 nextMode: 'diallocal',
                 nextArgs: args.pbx.error
                 }*/
                result = {
                    nextType: 'ivr',
                    nextArgs: args.pbx.error
                }
            }
            else {
                this.logger.error('Action 14 Response:', body);
                let channelVarValue = body.data;
                if (args.pbx.reset_var) {
                    const conditions = args.pbx.reset_var.split(',');
                    for (let i = 0; i < conditions.length; i++) {
                        const [k, v] = conditions[i].split('=');
                        if (k == body.data) {
                            channelVarValue = v;
                            break;
                        }
                    }
                }

                await this.fsPbx.uuidSetvar({ uuid, varname: args.pbx.var_name, varvalue: channelVarValue })
                await this.pbxCallProcessController.create({
                    caller,
                    called: ivrNumber,
                    tenantId,
                    callId,
                    processName: 'ivrReturn',
                    passArgs: { result: `访问API接口成功:${body.data}` }
                })
                const gotoIvr = body && body.success ? args.pbx.success : args.pbx.fail;
                result = {
                    nextType: 'ivr',
                    nextArgs: `${gotoIvr.split(',')[0]},${gotoIvr.split(',')[1] || 1}`
                }
            }
            return result;
        }
        catch (ex) {
            return Promise.reject(ex);
        }
    }

    async  httpPromise(options) {
        try {
            const result = new Promise<{ error: any, response: any, body: any }>((resolve) => {
                HTTP(options, (error, response, body) => {
                    resolve({ error, response, body })
                })
            })
            return result;
        }
        catch (ex) {
            return Promise.reject(ex);
        }

    }

    async compareValues(uuid: string, ivrNumber: string, args): Promise<TDoneIvrActionResult> {
        try {
            const { tenantId, callId, caller } = this.runtimeData.getRunData();
            let {
                varName,
                valueType = 'string',
                success,
                fail,
                compareSymbol,
                compareValue,
                compareChannelVar,
                sendAgentMsg,
                successMsg,
                failMsg
            } = args.logic;
            let result: TDoneIvrActionResult;
            if (!varName || !success || !fail || !compareSymbol) {
                result = {
                    nextType: 'normal',
                    nextArgs: ''
                }
            } else {
                const c = ['eq', 'ne', 'gt', 'lt', 'gth', 'lth'];

                const varValue: string = await this.fsPbx.getChannelVar(varName, uuid);
                if (compareChannelVar) {
                    compareValue = await this.fsPbx.getChannelVar(compareChannelVar, uuid);
                }
                if (!compareValue) {
                    result = {
                        nextType: 'ivr',
                        nextArgs: fail
                    }
                    return result;
                }
                let value, comValue;
                switch (valueType) {
                    case 'string':
                        value = String(varValue);
                        comValue = String(compareValue);
                        break;
                    case 'boolean':
                        value = Boolean(varValue);
                        comValue = Boolean(compareValue);
                        break;
                    case 'number':
                        value = Number(varValue);
                        comValue = Number(compareValue);
                        break;
                    case 'length':
                        value = String(varValue).length;
                        comValue = Number(compareValue);
                    default:
                        break;
                }
                let res = false;
                switch (compareSymbol) {
                    case 'eq':
                        res = value === comValue;
                        break;
                    case 'ne':
                        res = value !== comValue;
                        break;
                    case 'gt':
                        res = value > comValue;
                        break;
                    case 'gth':
                        res = value >= comValue;
                        break;
                    case 'lt':
                        res = value < comValue;
                        break;
                    case 'lth':
                        res = value <= comValue;
                        break;
                    default:
                        break;
                }
                this.logger.debug(`IVR Action compare:${value} ${compareSymbol} ${compareValue} = ${res}`);
                await this.pbxCallProcessController.create({
                    caller,
                    called: ivrNumber,
                    tenantId,
                    callId,
                    processName: 'ivrReturn',
                    passArgs: { result: `判定结果为${res ? '真' : '假'}` }
                })
                if (res) {

                    result = {
                        nextType: 'ivr',
                        nextArgs: success
                    }
                } else {
                    result = {
                        nextType: 'ivr',
                        nextArgs: fail
                    }
                }
            }
            return result;
        } catch (ex) {
            return Promise.reject(ex);
        }
    }


    async setChannelVar(uuid: string, args): Promise<TDoneIvrActionResult> {
        try {
            const { varName, varValue, channelVarName, doneGo } = args.logic;
            let setValue = varValue || '';
            let result: TDoneIvrActionResult = {
                nextType: 'ivr'
            };
            if (channelVarName) {
                let channelVarValue = await this.fsPbx.getChannelVar(channelVarName, uuid) || '';
                channelVarValue = channelVarValue === '_undef_' ? '' : channelVarValue;
                setValue = channelVarValue;
            }
            const data = {};
            data[varName] = setValue;
            await this.fsPbx.uuidSetvar({ uuid, varname: varName, varvalue: setValue });
            if (doneGo) {
                result = {
                    nextType: 'ivr',
                    nextArgs: doneGo
                }
            }
            return result;

        } catch (ex) {
            return Promise.reject(ex);
        }
    }
    /**
 * @description
 * 队列转满意度流程
 *   "非常满意":5;
 *   "满意": sd = 4;
 *   "一般":sd = 3
 *   "不满意":sd = 2;
 *   "非常不满意":sd = 1;
 * @return {*}
 */
    async satisfaction({ uuid, options }: { uuid: string, options: any }): Promise<TDoneIvrActionResult> {
        try {
            const { regexp, very_play } = options;
            const { caller, callee: called, callId, tenantId } = this.runtimeData.getRunData();
            const { hangup, agentId, sType, agentNumber, queueNumber, queueName } = this.runtimeData.getStatisData();
            let result: TDoneIvrActionResult = {
                nextType: 'normal',
                nextArgs: ''
            }
            await this.pbxCallProcessController.create({
                caller,
                called,
                tenantId,
                callId,
                processName: 'satisfaction',
                passArgs: { sType, agentId, agentNumber, queueNumber, queueName }
            })
            if (!hangup) {
                let isHangup = false;
                const onHangup = async (evt) => {
                    try {
                        this.logger.info(`监听到被满意度方[${uuid}]挂机了!`);
                        isHangup = true;
                        this.runtimeData.setStatisData({ hangupCase: evt.getHeader('Hangup-Cause') })
                        await this.saveSatisfaction(-1);
                    } catch (ex) {
                        this.logger.error(ex);
                    }

                }
                this.fsPbx.addConnLisenter(`esl::event::CHANNEL_HANGUP::${uuid}`, 'once', onHangup);
                // options.file = await _this.tools.fillSoundFilePath(options.file);

                let inputs = await this.fsPbx.uuidPlayAndGetDigits({ uuid, options, includeLast: false });
                const indexOfKeys = regexp.split("|").indexOf(inputs);

                let inputKey = inputs;
                if (inputs === 'timeout' || !inputs) {
                    inputKey = '-1';// 未按键
                    inputs = '-1';
                }
                else if (indexOfKeys < 0) {
                    inputKey = '-2';// 按键错误
                    inputs = '-1';
                }
                await this.pbxCallProcessController.create({
                    caller,
                    called,
                    tenantId,
                    callId,
                    processName: 'input',
                    passArgs: { key: inputKey + '' }
                })
                if (!isHangup) {
                    this.fsPbx.removeConnLisenter(`esl::event::CHANNEL_HANGUP::${uuid}`, onHangup);
                    await this.pbxQueueStatisticController.updateSatisValue(tenantId, callId, queueNumber, +inputKey);
                    if (very_play) {
                        const playBackFile = await this.fillSoundFilePath(very_play);
                        await this.fsPbx.uuidPlayback({ uuid, terminators: 'none', file: playBackFile });
                    }
                    this.logger.info(`满意度完毕[${uuid},${indexOfKeys},${inputs},${very_play}]执行挂机!`);
                    await this.fsPbx.uuidKill(uuid, 'NORMAL_CLEARING');
                }
                if (sType === 'queue') {
                    await this.pbxQueueStatisticController.hangupCall(callId, tenantId, queueNumber, 'agent');
                }
            } else {
                await this.pbxCallProcessController.create({
                    caller,
                    called,
                    tenantId,
                    callId,
                    processName: 'input',
                    passArgs: { key: '-1' }
                })
                await this.saveSatisfaction(-1);
            }
            //_this.R.pbxApi.disconnect(`满意度结束!`);
            this.logger.error('satisfaction end:', result);
            return Promise.resolve(result);
        }
        catch (ex) {
            return Promise.reject(ex);
        }
    }

    async saveSatisfaction(inputKey, isGlobal?: boolean): Promise<number> {
        const _this = this;
        try {

            const { caller, callee: called, callId, tenantId } = this.runtimeData.getRunData();
            const { hangup, agentId, sType, agentNumber, queueNumber, queueName, agentLeg } = this.runtimeData.getStatisData();
            const statisCode = [5, 4, 2];
            const surveyResult = inputKey > 0 ? statisCode[inputKey - 1] : -1;
            const timestamp = new Date().getTime();


            await this.pbxCallProcessController.create({
                caller,
                called,
                tenantId,
                callId,
                processName: 'satisfactionScore',
                passArgs: { score: surveyResult }
            })



            const nModified = await this.pbxQueueStatisticController.updateSatisValue(tenantId, callId, queueNumber, +inputKey);

            if (nModified === 1) {
                // 排除其他事件更新过

                if (sType === 'queue') {

                    await this.pbxAgentStatisticController.setSatisfaction(callId, agentLeg, +inputKey)
                }

                return Promise.resolve(-1)
            }
            else {
                // 处理已经提交过满意度的用户挂机
                if (inputKey == -1 && !isGlobal) {
                    const doc = await this.pbxQueueStatisticController.findOne({
                        callId: callId,
                        satisfaction: { $gt: 0 }
                    })
                }
                return Promise.resolve(-1)
            }
        }
        catch (ex) {
            return Promise.reject(ex);
        }
    }

    async blackListAction(uuid: string): Promise<TDoneIvrActionResult> {
        try {
            const { caller, callee: called, callId, tenantId, routerLine } = this.runtimeData.getRunData();
            const tenantInfo = this.runtimeData.getTenantInfo();
            let result: TDoneIvrActionResult = {
                nextType: 'ivr'
            };
            let checkNumber: string = '';
            if (routerLine === '呼入') {
                checkNumber = caller;
            }
            else if (routerLine === '呼出') {
                checkNumber = called;
            }
            else {
                // 本地电话可黑名单吗?
                checkNumber = caller;
            }
            let isBlackNumber = false;
            this.logger.debug(`checkNumber${checkNumber}`, tenantInfo && tenantInfo.callCenterOpts && tenantInfo.callCenterOpts.useBlackList);
            if (tenantInfo && tenantInfo.callCenterOpts && tenantInfo.callCenterOpts.useBlackList) {
                isBlackNumber = await this.pbxBlacklistController.isBlackNumber(tenantId, checkNumber);
            }
            await this.pbxCallProcessController.create({
                caller,
                called,
                tenantId,
                callId,
                processName: 'blackListCheck',
                passArgs: { isBlackNumber: isBlackNumber, checkNumber: checkNumber }
            })

            const chanData = {};
            chanData['isBlackNumber'] = String(isBlackNumber);
            await this.fsPbx.uuidSetvar({ uuid, varname: 'isBlackNumber', varvalue: String(isBlackNumber) });

            this.logger.debug(`${checkNumber}黑名单检测:${isBlackNumber}`);
            return result;
        }
        catch (ex) {

            return Promise.reject(ex);
        }
    }


    encryptText({ algorithm = 'aes-256-ctr', password, text }: { algorithm?: string, password: string, text: string }) {
        const cipher = crypto.createCipher(algorithm, password)
        let crypted = cipher.update(text, 'utf8', 'hex')
        crypted += cipher.final('hex');
        this.logger.debug("加密结果：", crypted);
        return crypted;
    }

    decryptText({ algorithm = 'aes-256-ctr', password, text }: { algorithm?: string, password: string, text: string }) {
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