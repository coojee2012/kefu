/**
 * @flow
 * Created by linyong on 9/26/17.
 */
import Tools from './tools';
import {EVENTNAME, AGENTSTATE} from '../configs/consts';
import RecordData from './RecordData';
class Monitor {
  constructor(R) {
    this.R = R;
    this.loggerPrefix = ['ESL', 'CallFlow', 'Monitor'];
    this.tools = new Tools(R);
    this.db = new RecordData(R);
    this.isBreakIn = false;
  }

  async monitor(message) {
    const _this = this;
    try {
      const {caller, called, EE3, logger, pbxApi, DND, service, routerLine, tenantInfo} = _this.R;
      logger.debug(_this.loggerPrefix, `监听到管理员发起监听:DND=${DND}`, message);
      const {callId, tenantId, agentNumber, agentId, monitorNumber, monitorId} = message;
      service.callProcess.create({
        caller,
        called,
        tenantId,
        callId,
        processName: 'inviteSpy',
        isHide: true,
        passArgs: {agentNumber, agentId, monitorNumber, monitorId}
      })
      const pubData = {
        tenantId: tenantId,
        agentId: agentId,
        agent: agentNumber,
        state: '',
        fsName: _this.R.fsName,
        fsCoreId: _this.R.fsCoreId,
        callType: _this.R.callType,
        logicInTheCall: false,
        consultOn: false,
        consultOff: false,
        transferCall: false,
        roomId: _this.R.roomId,
        answeredCallId: _this.R.originationUuid,
        sipCallId: _this.R.pbxApi.getChannelData().sipCallId,
        logicType: 'monitor',
        isClickOut: _this.R.clickOut === 'yes' ? true : false,
        options: {
          callId: _this.R.callId,
          callee: _this.R.called,
          caller: _this.R.caller,
          DND: _this.R.DND,
          direction: _this.R.direction
        }
      }

      const spyCdr = await service.cdr.get(tenantId, callId);

      let spySpeakTo = '';
      if (routerLine === '呼入') {
        spySpeakTo = spyCdr.caller;
      }
      else if (routerLine === '呼出') {
        spySpeakTo = spyCdr.called;
      }
      else if (routerLine === '本地' && monitorNumber == spyCdr.caller) {
        spySpeakTo = spyCdr.called;
      }
      else if (routerLine === '本地' && monitorNumber == spyCdr.called) {
        spySpeakTo = spyCdr.caller;
      }


      const managerLegId = await pbxApi.createUuid();
      _this.R.agentLeg[`${agentNumber}`] = managerLegId;
      const monitorLegId = _this.R.agentLeg[`${monitorNumber}`];
      const dialExtenResult = await _this.tools.originateACall({
        newUuid: managerLegId,
        dialNumber: agentNumber,
        tenantId,
        callerIdName: DND,
        callId,
        agentId: agentId,
        isTransfer: false,
        isHide: true,
        logicType: 'monitor',
        logicOptions: {
          process: 'spy',
          spyNumber: monitorNumber,
          spyAgentId: monitorId,
          spyLegId: monitorLegId,
          spySpeakTo: spySpeakTo,
          managerLegId: managerLegId,
        },
        answeredCallId: _this.R.originationUuid,
        recordCall: false,
        appOrExten: `&eavesdrop(${monitorLegId})`
      })

      const onManagerHangup = async(evt)=> {
        try {
          logger.debug(_this.loggerPrefix, `监听到监听管理员${agentNumber}挂机!`);
          if (_this.isBreakIn) {
            _this.db.setAgentState(Object.assign({}, pubData, {
              state: tenantInfo.afterCallState || AGENTSTATE.idle,
              logicOptions: {
                process: 'breakIn',
                spyNumber: monitorNumber,
                spyAgentId: monitorId,
                spyLegId: monitorLegId,
                spySpeakTo: spySpeakTo,
                managerLegId: managerLegId,
              }
            }));

            _this.R.service.callProcess.create({
              caller,
              called,
              tenantId,
              callId,
              processName: 'hangup',
              passArgs: {
                hangupMsg: "结束通话",
                agentId,
                number: agentNumber
              }
            })
          }
          return Promise.resolve();
        } catch (ex) {
          return Promise.reject(ex);
        }
      }

      const onMonitorHangup = async(evt) => {
        logger.debug(_this.loggerPrefix, `监听到被监听分机${monitorNumber}挂机了!`);
        return Promise.resolve();
      }

      const managerBreakIn = `${EVENTNAME.callControl.PUB.managerBreakIn}::${tenantId}::${callId}`;
      const managerBreakDown = `${EVENTNAME.callControl.PUB.managerBreakdown}::${tenantId}::${callId}`;

      const onBreakDown = async (message)=> {
        try {
          const agentNumberBreakIn = message.agentNumber;
          // 多个监听者的时候,挂掉非发起强拆的监听者
          if (agentNumberBreakIn != agentNumber) {
            await pbxApi.uuidKill(managerLegId);
            return Promise.resolve(`${agentNumber}:其他监听者[${agentNumberBreakIn}]发起了强拆!`);
          }
          await  pbxApi.uuidSetvar({uuid: monitorLegId, varname: ' hangup_after_bridge', varvalue: 'false'});
          await  pbxApi.uuidSetvar({uuid: monitorLegId, varname: ' park_after_bridge', varvalue: 'true'});
          const bridgeUuid = await pbxApi.uuidGetvar({uuid: monitorLegId, varname: 'bridge_uuid'});


          await Promise.all([
            service.callProcess.create({
              caller,
              called,
              tenantId,
              callId,
              processName: 'breakDown',
              passArgs: {agentNumber, agentId, monitorNumber, monitorId}
            }),
            service.extension.setAgentLogicType(tenantId, agentNumber, 'monitor', {
              process: 'breakDown',
              spyNumber: monitorNumber,
              spyAgentId: monitorId,
              spyLegId: monitorLegId,
              spySpeakTo: spySpeakTo,
              managerLegId: managerLegId,
            })
          ])


          await  pbxApi.uuidKill(bridgeUuid);
          await  pbxApi.uuidKill(managerLegId);
          // 向被强拆的分机语音提示


          _this.db.sendMsgToAgent({
            tenantId,
            agentNumber:monitorNumber,
            code: 1502,
            message: 'break_down',
            logicType: 'monitor'
          })
          // 您的电话已被管理员挂断
          const playResult = await  pbxApi.uuidPlayback({uuid: monitorLegId, file: 'demo/break-down.wav'})
          await  pbxApi.uuidKill(monitorLegId);

        } catch (ex) {
          logger.error(_this.loggerPrefix.concat(['managerBreakDownEmitted']), ex);
        }
      }

      const onBreakIn = async(message) => {
        try {
          const agentNumberBreakIn = message.agentNumber;
          // 取消监听强拆
          EE3.removeListener(managerBreakDown, onBreakDown);
          
          // 多个监听者的时候,挂掉非发起强拆的监听者
          if (agentNumberBreakIn != agentNumber) {
            await pbxApi.uuidKill(managerLegId);
            return Promise.resolve(`${agentNumber}:其他监听者[${agentNumberBreakIn}]发起了强插!`);
          }


          await  pbxApi.uuidSetvar({uuid: monitorLegId, varname: ' hangup_after_bridge', varvalue: 'false'});
          await  pbxApi.uuidSetvar({uuid: monitorLegId, varname: ' park_after_bridge', varvalue: 'true'});
          const session = await  pbxApi.uuidDump(monitorLegId, 'json');
          const bridgeUuid = await pbxApi.uuidGetvar({uuid: monitorLegId, varname: 'bridge_uuid'});
          const lastBridgeTo = await pbxApi.uuidGetvar({uuid: monitorLegId, varname: 'last_bridge_to'});
          _this.isBreakIn = true;
          await  pbxApi.uuidBridge(bridgeUuid, managerLegId);
          await Promise.all([
            service.callProcess.create({
              caller,
              called,
              tenantId,
              callId,
              processName: 'breakIn',
              passArgs: {agentNumber, agentId, monitorNumber, monitorId}
            }),
            service.extension.setAgentLogicType(tenantId, agentNumber, 'monitor', {
              process: 'breakIn',
              spyNumber: monitorNumber,
              spyAgentId: monitorId,
              spyLegId: monitorLegId,
              spySpeakTo: spySpeakTo,
              managerLegId: managerLegId,
            })
          ]);
          
          _this.db.setAgentState(Object.assign({}, pubData, {
            state: AGENTSTATE.inthecall,
            logicOptions: {
              process: 'breakIn',
              spyNumber: monitorNumber,
              spyAgentId: monitorId,
              spyLegId: monitorLegId,
              spySpeakTo: spySpeakTo,
              managerLegId: managerLegId,
            }
          }));

          // 向被强插的分机语音提示
          _this.db.sendMsgToAgent({
            tenantId,
            agentNumber:monitorNumber,
            code: 1501,
            message: 'break_in',
            logicType: 'monitor'
          })
          // 您的电话已被管理员接听
          const playResult = await  pbxApi.uuidPlayback({uuid: monitorLegId, file: 'demo/break-in.wav'})
          await  pbxApi.uuidKill(monitorLegId);
        } catch (ex) {
          logger.error(_this.loggerPrefix.concat(['managerBreakInEmitted']), ex);
        }
      }



      EE3.once(managerBreakIn, onBreakIn);
      EE3.once(managerBreakDown, onBreakDown);

      if (dialExtenResult.success) {
        logger.debug(_this.loggerPrefix.concat(['monitorEmitted']), `监听电话成功!`);
        _this.R.service.callProcess.create({
          caller,
          called,
          tenantId,
          callId,
          processName: 'startSpy',
          passArgs: {agentNumber, agentId, monitorNumber, monitorId}
        })

        pbxApi.conn.once(`esl::event::CHANNEL_HANGUP::${monitorLegId}`, onMonitorHangup);

        await new Promise((resolve, reject)=> {
          pbxApi.conn.once(`esl::event::CHANNEL_HANGUP::${managerLegId}`, (evt)=> {
            logger.debug(_this.loggerPrefix.concat(['monitorEmitted']), `监听相关的管理员:${agentNumber}挂机`);
            onManagerHangup(evt)
                .then(()=> {
                  resolve()
                })
                .catch(err=> {
                  logger.error(_this.loggerPrefix.concat(['monitorEmitted']), err);
                  reject(err);
                })
          });
        })

      }
      else {
        _this.R.service.callProcess.create({
          caller,
          called,
          tenantId,
          callId,
          processName: 'cancelSpy',
          passArgs: {failType: dialExtenResult.failType}
        })
        logger.debug(_this.loggerPrefix.concat(['monitorEmitted']), `监听电话失败!`);
      }
      EE3.removeListener(managerBreakIn, onBreakIn);
      EE3.removeListener(managerBreakDown, onBreakDown);
    }
    catch (ex) {

      return Promise.reject(ex);
    }
  }

}

export  default Monitor;