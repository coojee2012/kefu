import { Injector, ReflectiveInjector, Injectable } from 'injection-js';
import { ConfigService } from '../service/ConfigService';
import { LoggerService } from '../service/LogService';
import { Connection } from '../lib/NodeESL/Connection';
import { Event } from '../lib/NodeESL/Event';

import { FreeSwitchPBX } from './FreeSwitchPBX';
import { RuntimeData } from './RunTimeData';

import { PBXIVRActionsController } from '../controllers/pbx_ivrAction';
import { PBXCallProcessController } from '../controllers/pbx_callProcess';
import { PBXCDRController } from '../controllers/pbx_cdr';


import { ActionPlaybackArgs } from '../models/pbx_ivrActions';

@Injectable()
export class IVR {
    private logger: LoggerService;
    private pbxActionController: PBXIVRActionsController;
    private pbxCallProcessController: PBXCallProcessController;
    private pbxCDRController: PBXCDRController;

    private runtimeData: RuntimeData;
    private fsPbx: FreeSwitchPBX;

    constructor(private injector: Injector) {
        this.logger = this.injector.get(LoggerService);
        this.pbxActionController = this.injector.get(PBXIVRActionsController);
        this.pbxCallProcessController = this.injector.get(PBXCallProcessController);
        this.pbxCDRController = this.injector.get(PBXCDRController);

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
    async ivrAction({ ivrNumber, ordinal, uuid }: { ivrNumber: string, ordinal: number, uuid: string }) {
        try {
            const { tenantId, callId, caller, ivrCurrentDeep, ivrMaxDeep } = this.runtimeData.getRunData();
            this.logger.debug(`正在处理IVR:Number-${ivrNumber},Action-${ordinal},uuid:${uuid}`);
            if (ivrCurrentDeep < ivrMaxDeep) {
                const actionDoc = await this.pbxActionController.getIvrAction(tenantId, ivrNumber, ordinal);
                if (actionDoc) {
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
                    const result = await this.doneAction(ivrNumber, actionDoc.actionType, actionDoc.args, uuid);
                } else {

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

    async doneAction(ivrNumber: string, actionType: number, args: any, uuid: string) {
        try {
            switch (actionType) {
                case 1: {
                    const result = await this.playback(ivrNumber, <ActionPlaybackArgs>args, uuid)
                }
            }
        }
        catch (ex) {
            return Promise.reject(ex);
        }
    }

    async playback(ivrNumber: string, args: ActionPlaybackArgs, uuid: string) {
        try {
            let { input, doneGo } = args.logic;
            let { 
                tries, timeout, invalid_file, regexp, digit_timeout,file,file_from_var
             } = args.pbx;
            if (input) {
                if(file_from_var){
                    file = await this.fsPbx.getChannelVar(file_from_var,uuid);
                }
            }
            else{

            }
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

        try{
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
        }
        catch(ex){
            return Promise.reject(ex);
        }
        
      }

}