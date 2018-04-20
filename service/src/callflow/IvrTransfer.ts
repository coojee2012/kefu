/**
 * @flow
 * Created by linyong on 9/26/17.
 */
import RecordData from './RecordData';
import Ivr from './Ivr';
import Tools from './tools';
import {AGENTSTATE} from '../configs/consts';
class IvrTransfer {

  constructor(R) {
    this.R = R;
    this.db = new RecordData(R);
    this.ivr = new Ivr(this.R);
    this.loggerPrefix = ['ESL', 'CallFlow', 'IvrTransfer'];
  }

  async transfer(message) {
    const _this = this;
    try {
      // uuidDualTransfer
      //_this.R.isInQueue = false;
      const loggerPrefix = this.loggerPrefix.concat('transfer');
      const {tenantId, agentNumber, callId, agentId, ivrNumber} = message;
      const {service, dbi, pbxApi,caller, called,routerLine,logger} = _this.R;
      const blegId = _this.R.agentLeg[`${agentNumber}`];
      _this.R.ivrTransferData = Object.assign({}, _this.R.ivrTransferData, {
        agentNumber,
        ivrNumber,
        agentHangup: false,
        customerHangup: false,
        transfer: true
      });
      const ivrInfo = await service.ivrMenu.getIVRByNumber(tenantId, ivrNumber);
      service.callProcess.create({
        caller,
        called,
        tenantId,
        callId,
        processName: 'ivrTransfer',
        passArgs: {ivrNumber, ivrName: ivrInfo ? ivrInfo.ivrName : `${ivrNumber}`, agentId}
      })
      const pubData = {
        tenantId: tenantId,
        agentId: _this.R.agentId,
        agent: agentNumber,
        state: '',
        fsName: _this.R.fsName,
        fsCoreId: _this.R.fsCoreId,
        callType: _this.R.callType,
        transferCall: _this.R.transferCall,
        roomId: _this.R.roomId,
        sipCallId: _this.R.pbxApi.getChannelData().sipCallId,
        isClickOut: _this.R.clickOut === 'yes' ? true : false,
        options: {
          callId: _this.R.callId,
          callee: _this.R.called,
          caller: _this.R.caller,
          DND: _this.R.DND,
          direction: _this.R.direction
        }
      }

      _this.R.lastLogic = 'ivr-transfer';
      const data = {
        'ivr_transfer': 'yes',
      }
      await pbxApi.set(data);

      _this.db.setAgentState(Object.assign({}, pubData, {state: AGENTSTATE.inivrtransfer}));

      const agentHangupDone = (evt) => {
        _this.R.ivrTransferData.agentHangup = true;
        //客户未挂机,且已经结束IVR
        if (!_this.R.ivrTransferData.customerHangup && !_this.R.ivrTransferData.transfer) {
          //_this.R.isInQueue = false;
          //_this.beforeEndTheCall(callId);
          //_this.R.pbxApi.dialPlanTransfer('after_hangup');
        }
      }
      const customerHangupDone = (evt) => {
        _this.R.ivrTransferData.customerHangup = true;
        if (!_this.R.ivrTransferData.agentHangup) {
          _this.R.pbxApi.uuidKill(_this.R.routerLine === '呼入' ? blegId : callId)
        }
      }
      let agentHangupEvent = `esl::event::CHANNEL_HANGUP::${blegId}`;
      let customerHangupEvent = `esl::event::CHANNEL_HANGUP::${callId}`;

      if (routerLine === '呼出') {
        agentHangupEvent = `esl::event::CHANNEL_HANGUP::${callId}`;
        customerHangupEvent = `esl::event::CHANNEL_HANGUP::${blegId}`;
      }
      pbxApi.conn.once(agentHangupEvent, agentHangupDone);
      pbxApi.conn.once(customerHangupEvent, customerHangupDone);

      await _this.R.pbxApi.uuidTransfer(callId, '-both', 'consulting');


      await _this.doneIvrAction({callId, blegId, tenantId, ivrNumber});


      _this.R.ivrTransferData.transfer = false;
      data['ivr_transfer'] = 'no';
      await pbxApi.set(data);
      // IVR执行完毕后,如果坐席已挂机
      if (_this.R.ivrTransferData.agentHangup && !_this.R.ivrTransferData.customerHangup) {
        // await _this.beforeEndTheCall(callId);
        //_this.R.pbxApi.dialPlanTransfer('after_hangup');
      }
      else {
        const bridgeResult = await pbxApi.uuidBridge(callId, blegId);
        if (bridgeResult && bridgeResult.success) {
          //_this.R.isInQueue = true;
          _this.db.setAgentState(Object.assign({}, pubData, {state: AGENTSTATE.inthecall, logicInTheCall: true}));
        } else {
          await pbxApi.uuidKill(callId);
          logger.debug(loggerPrefix, 'IVR转接执行结束后,Bridge失败:', bridgeResult);
        }
      }
    }
    catch (ex) {
      return Promise.reject(ex);
    }
  }

  async doneIvrAction({ivrNumber, callId, blegId, tenantId}) {
    const _this = this;
    try {
      const loggerPrefix = _this.loggerPrefix.concat('doneIvrAction');
      const {logger,routerLine,dbi} = _this.R;
      let ivrResult;
      if (routerLine === '呼入') {
        logger.debug(loggerPrefix, '呼入-IVR转接执行前:', callId);
        ivrResult = await _this.ivr.ivrAction(ivrNumber, 1, callId);
      }
      //TODO 目前版本不支持
      else if (routerLine === '呼出') {
        _this.R.logger.debug(loggerPrefix, '呼出-IVR转接执行前:', blegId);
        ivrResult = await _this.ivr.ivrAction(ivrNumber, 1, blegId);
      }
      //TODO 目前版本不支持
      else if (_this.R.routerLine === '本地') {

      }
      logger.debug(loggerPrefix, 'IVR转接执行结果:', ivrResult);

      if (ivrResult && ivrResult.success && ivrResult.jumpOut && ivrResult.nextMode === 'diallocal') {
        const {localType, assign} = await dbi.localNumber.getLocalByNumber(tenantId, ivrResult.nextArgs);
        if (localType === 'ivr') {
          await _this.doneIvrAction({ivrNumber, callId, blegId, tenantId})
        }
      }
      return ivrResult;
    } catch (ex) {
      return Promise.reject(ex);
    }
  }
}
export default IvrTransfer