import { Injector, ReflectiveInjector, Injectable } from 'injection-js';
import { ConfigService } from '../service/ConfigService';
import { LoggerService } from '../service/LogService';
import { Connection } from '../lib/NodeESL/Connection';
import { Event } from '../lib/NodeESL/Event';

import { FreeSwitchPBX } from './FreeSwitchPBX';
import { RuntimeData } from './RunTimeData';
import { IVR } from './IVR';


import { PBXLocalNumberController } from '../controllers/pbx_localNumber';
import { PBXCDRController } from '../controllers/pbx_cdr';
import { PBXCallProcessController } from '../controllers/pbx_callProcess';
import { PBXIVRMenuController } from '../controllers/pbx_ivrMenu';
type DialLocalResult = {
    localType: string;
}

interface IDialExtensionResult {

}

@Injectable()
export class FlowBase {
    private logger: LoggerService;
    private pbxLocalNumberController: PBXLocalNumberController;
    private pbxCdrController: PBXCDRController;
    private pbxCallProcessController: PBXCallProcessController;
    private runtimeData: RuntimeData;
    private fsPbx: FreeSwitchPBX;
    private ivr: IVR;
    private pbxIvrMenuController: PBXIVRMenuController;
    constructor(private injector: Injector) {
        this.logger = this.injector.get(LoggerService);
        this.pbxLocalNumberController = this.injector.get(PBXLocalNumberController);
        this.pbxCdrController = this.injector.get(PBXCDRController);
        this.pbxCallProcessController = this.injector.get(PBXCallProcessController);
        this.runtimeData = this.injector.get(RuntimeData);
        this.fsPbx = this.injector.get(FreeSwitchPBX);
        this.pbxIvrMenuController = this.injector.get(PBXIVRMenuController);
        this.ivr = this.injector.get(IVR);
    }
    /**
     * @description 拨打本地号码，包括分机，队列，IVR等
     */
    async diallocal(number: string) {
        try {

            const { tenantId, callId, caller } = this.runtimeData.getRunData();
            if (/@/.test(number)) {
                return Promise.reject(`Can't Dial Other Tenand!Called Is:${number}.`);
            } else {
                const { localType, assign } = await this.pbxLocalNumberController.getLocalByNumber(tenantId, number);
                const result: DialLocalResult = {
                    localType,
                };

                await this.pbxCdrController.updateCalled(tenantId, callId, number);

                switch (localType) {
                    case 'ivr':
                        {
                            await this.dialIVR(number);
                            break;
                        }
                    case 'extension':
                        {
                            await this.pbxCallProcessController.create({
                                caller,
                                called: number,
                                tenantId,
                                callId,
                                processName: localType,
                                passArgs: { number }
                            })
                            await this.dialExtension(number);
                            break;
                        }
                    case 'queue':
                    case 'voicemail':
                    case 'conference':
                    case 'fax':
                    default:
                        break;
                }

            }
        } catch (ex) {
            return Promise.reject(ex);
        }
    }

    /** 
     * @description 拨打出局电话
     * */
    async dialout() {
        try {

        } catch (ex) {

        }
    }

    /**
     * @description 拨打分机
     */
    async dialExtension(number: string) {
        try {

        } catch (ex) {
            return Promise.reject(ex);
        }
    }

    async dialIVR(number: string) {
        try {
            const { answered, tenantId, callId, caller } = this.runtimeData.getRunData();
            if (!answered) {
                await this.fsPbx.answer();
                this.runtimeData.setAnswered();
                await this.fsPbx.startDTMF();
            }
            const ivrInfo = await this.pbxIvrMenuController.getIVRByNumber(tenantId, number);
            await this.pbxCallProcessController.create({
                caller,
                called: number,
                tenantId,
                callId,
                processName: 'ivr',
                passArgs: { number, ivrName: ivrInfo ? ivrInfo.ivrName : `${number}` }
            })
            await this.ivr.ivrAction({
                ivrNumber:number,
                ordinal:1,
                uuid:callId
            })

        } catch (ex) {
            return Promise.reject(ex);
        }
    }
}