import { Injector, ReflectiveInjector, Injectable } from 'injection-js';
import { ConfigService } from '../service/ConfigService';
import { LoggerService } from '../service/LogService';
import { Connection } from '../lib/NodeESL/Connection';
import { Event } from '../lib/NodeESL/Event';

import { RuntimeData } from './RunTimeData';
import { PBXLocalNumberController } from '../controllers/pbx_localNumber';
import { PBXCDRController } from '../controllers/pbx_cdr';
import { PBXCallProcessController } from '../controllers/pbx_callProcess';

type DialLocalResult  = {
    localType:string;
}

interface IDialExtensionResult {

}

@Injectable()
export class FlowBase {
    private logger: LoggerService;
    private pbxLocalNumberController: PBXLocalNumberController;
    private pbxCdrController:PBXCDRController;
    private pbxCallProcessController:PBXCallProcessController;
    private runtimeData: RuntimeData;
    constructor(private injector: Injector) {
        this.logger = this.injector.get(LoggerService);
        this.pbxLocalNumberController = this.injector.get(PBXLocalNumberController);
        this.pbxCdrController = this.injector.get(PBXCDRController);
        this.pbxCallProcessController = this.injector.get(PBXCallProcessController);
        this.runtimeData = this.injector.get(RuntimeData);
    }
    /**
     * @description 拨打本地号码，包括分机，队列，IVR等
     */
    async diallocal(number: string) {
        try {
          
            const { tenantId,callId,caller} = this.runtimeData.getRunData();
            if (/@/.test(number)) {
                return Promise.reject(`Can't Dial Other Tenand!Called Is:${number}.`);
            } else {
                const { localType, assign } = await this.pbxLocalNumberController.getLocalByNumber(tenantId,number);
                const result:DialLocalResult = {
                    localType,
                };
                switch (localType) {
                    case 'ivr':
                    case 'extension':
                    {
                        await this.pbxCdrController.updateCalled(tenantId,callId,number);
                        await this.pbxCallProcessController.create({
                            caller,
                            called: number,
                            tenantId,
                            callId,
                            processName: localType,
                            passArgs: {number}
                          })
                        await this.dialExtension(number);
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
    async dialExtension(number:string) {

    }
}