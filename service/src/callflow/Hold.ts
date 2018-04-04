import { Injector, ReflectiveInjector, Injectable } from 'injection-js';
import { ConfigService } from '../service/ConfigService';
import { LoggerService } from '../service/LogService';
import { EventService } from '../service/EventService';
import { Connection } from '../lib/NodeESL/Connection';
import { Event } from '../lib/NodeESL/Event';

import { FreeSwitchPBX } from './FreeSwitchPBX';
import { RuntimeData } from './RunTimeData';

@Injectable()
export class Hold {
  private logger: LoggerService;
  private config: ConfigService;
  private eventService: EventService;

  private fsPbx: FreeSwitchPBX;
  private runtimeData: RuntimeData;
    constructor(private injector: Injector) {
      this.logger = this.injector.get(LoggerService);
      this.config = this.injector.get(ConfigService);
      this.eventService = this.injector.get(EventService);
      this.fsPbx = this.injector.get(FreeSwitchPBX);
    }

    async holdOn(message) {
        
        try {
          const {tenantId, agentNumber, callId, agentId} = message;
          const { caller, callee: called, routerLine } = this.runtimeData.getRunData();
          const agentLegId = this.runtimeData.getLegIdByNumber[`${agentNumber}`];
          const agentBridgedUuid = await this.fsPbx.uuidGetvar({uuid: agentLegId, varname: 'bridge_uuid'});
          this.logger.debug( `监听到坐席发起保持事件:${agentLegId} | ${agentBridgedUuid}`, message);
          _this.R.service.callProcess.create({
            caller,
            called,
            tenantId,
            callId,
            processName: 'holdOn',
            passArgs: {agentNumber, agentId}
          })
    
          _this.R.holdData = Object.assign({}, _this.R.holdData, {
            agentLegId, tenantId, agentNumber, callId,
            holdOff: false,
            beHoledHangup: false,
            holdInitiatorHangup: false
          });
          _this.R.holdData.holdTimes = _this.R.holdData.holdTimes ? _this.R.holdData.holdTimes + 1 : 1; //反复点保持
          _this.R.lastLogic = 'hold';
    
          const pubData = {
            tenantId: tenantId,
            agentId: _this.R.agentId,
            agent: agentNumber,
            state: '',
            fsName: _this.R.fsName,
            fsCoreId: _this.R.fsCoreId,
            callType: _this.R.callType,
            transferCall: _this.R.transferCall,
            logicType: 'hold',
            roomId: _this.R.roomId,
            sipCallId: _this.R.pbxApi.getChannelData().sipCallId,
            fromQueue: _this.R.isInQueue ? 'yes' : 'no',
            isClickOut: _this.R.clickOut === 'yes' ? true : false,
            options: {
              callId: _this.R.callId,
              callee: _this.R.called,
              caller: _this.R.caller,
              DND: _this.R.DND,
              direction: _this.R.direction
            }
          }
    
          const setState = async(state, logicOptions = {}) => {
            try {
              await _this.db.setAgentState(Object.assign({}, pubData, {state, logicOptions}));
            } catch (ex) {
              return Promise.reject(ex);
            }
          }
          /**
           * @description
           * 处理被保持的一方挂机时的相关事务
           * @param evt
           * @return {*}
           */
          const onBeHoldedHangup = async(evt) => {
            try {
              if (_this.R.lastLogic !== 'hold') {
                return Promise.resolve();
              }
              logger.debug(loggerPrefix, `保持业务监听到用户挂机!`);
              pbxApi.conn.off(`esl::event::CHANNEL_HANGUP::${agentLegId}`, onHoldInitiatorHangup);
              await _this.tools.wait(1000);
              await pbxApi.uuidKill(agentLegId);
              await _this.db.sendMsgToAgent({
                tenantId,
                agentNumber,
                code: 1104,
                message: 'hold_on_caller_hangup',
                logicType: 'hold'
              })
            } catch (ex) {
              logger.error(loggerPrefix, ex);
              return Promise.reject(ex);
            }
          }
    
          /**
           * @description
           * 处理保持发起方挂机相关事务
           * @param evt
           * @return {*}
           */
          const onHoldInitiatorHangup = async(evt) => {
            try {
              if (_this.R.lastLogic !== 'hold') {
                return Promise.resolve();
              }
              logger.debug(loggerPrefix, `保持业务监听到坐席挂机!`, _this.R.holdData);
              pbxApi.conn.off(`esl::event::CHANNEL_HANGUP::${agentBridgedUuid}`, onBeHoldedHangup);
              await _this.tools.wait(1000);
              await pbxApi.uuidKill(agentBridgedUuid);
              await _this.db.sendMsgToAgent({
                tenantId,
                agentNumber,
                code: 1105,
                message: 'hold_on_agent_hangup',
                logicType: 'hold'
              })
            } catch (ex) {
              logger.error(loggerPrefix, ex);
              return Promise.reject(ex);
            }
          }
    
          const holdOffEmitted = async(messageOff)=> {
            try {
              const loggerPrefix = _this.loggerPrefix.concat('off');
              logger.debug(loggerPrefix, `监听到坐席取消保持事件:`, messageOff);
              pbxApi.conn.off(`esl::event::CHANNEL_HANGUP::${agentBridgedUuid}`, onBeHoldedHangup);
              pbxApi.conn.off(`esl::event::CHANNEL_HANGUP::${agentLegId}`, onHoldInitiatorHangup);
    
              const stillHold = messageOff.stillHold;
              if(stillHold){
                logger.debug(loggerPrefix, `业务逻辑发生改版,蛋但需要继续保持:`, messageOff);
                return Promise.resolve();
              }
              _this.R.service.callProcess.create({
                caller,
                called,
                tenantId,
                callId,
                processName: 'holdOff',
                passArgs: {agentNumber, agentId}
              })
    
              if (_this.R.lastLogic === 'appoint_transfer') {
                logger.debug(loggerPrefix, `监听到指定转接取消保持事件:`, message);
                return Promise.resolve();
              }
    
    
              _this.R.holdData.holdOff = true;
              await _this.R.pbxApi.uuidBridge(agentLegId, agentBridgedUuid);
    
              await setState(AGENTSTATE.inthecall);
    
              await _this.db.sendMsgToAgent({
                tenantId,
                agentNumber,
                code: 1102,
                message: 'hold_off_success',
                logicType: 'hold'
              })
            }
            catch (ex) {
              await _this.db.sendMsgToAgent({
                tenantId,
                agentNumber,
                code: 1103,
                message: 'hold_off_error',
                logicType: 'hold'
              })
              _this.R.logger.error(loggerPrefix, `坐席通过web取消保持错误:`, ex);
            }
          }
    
    
          await _this.R.pbxApi.uuidTransfer(callId, '-both', 'consulting');
    
          pbxApi.conn.once(`esl::event::CHANNEL_HANGUP::${agentBridgedUuid}`, onBeHoldedHangup);
          pbxApi.conn.once(`esl::event::CHANNEL_HANGUP::${agentLegId}`, onHoldInitiatorHangup);
    
    
          await setState(AGENTSTATE.holding);
    
          await _this.db.sendMsgToAgent({
            tenantId,
            agentNumber,
            code: 1100,
            message: 'hold_on_success',
            logicType: 'hold'
          })
    
          // 等待用户取消保持业务
          await new Promise((resolve, reject)=> {
            const holdOffEvent = `${EVENTNAME.callControl.PUB.agentHoldOff}::${tenantId}::${callId}`;
            EE3.on(holdOffEvent, (msg)=> {
              holdOffEmitted(msg)
                  .then(()=> {
                    resolve();
                  })
                  .catch(err=> {
                    reject(err);
                  })
            });
          })
        }
        catch (ex) {
          await _this.db.sendMsgToAgent({
            tenantId,
            agentNumber,
            code: 1101,
            message: 'hold_on_error',
            logicType: 'hold'
          })
          _this.R.logger.error(loggerPrefix, `坐席保持通话错误:`, ex);
        }
      }

}