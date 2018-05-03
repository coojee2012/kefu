/**
 * @flow
 * Created by linyong on 9/26/17.
 */
import RecordData from './RecordData';
import Ivr from './Ivr';
import Tools from './tools';
import {AGENTSTATE} from '../configs/consts';

class Transfer {
  constructor(R) {
    this.R = R;
    this.db = new RecordData(R);
    this.ivr = new Ivr(this.R);
    this.loggerPrefix = ['ESL', 'CallFlow', 'Transfer'];
    this.tools = new Tools(R);
  }

  async blind(message) {
    const _this = this;
    try {
      const {tenantId, agentNumber, callId, agentId, extNumber, extAgentId} = message;
      const {caller, called, service, pbxApi, logger, routerLine} = _this.R;
      const loggerPrefix = _this.loggerPrefix.concat('blind');
      logger.debug(loggerPrefix, `监听到坐席发起盲转事件:`, message, _this.R.agentLeg);
      const blegId = _this.R.agentLeg[`${agentNumber}`];
      _this.R.transferTime = _this.R.transferTime + 1;

      service.callProcess.create({
        caller,
        called,
        tenantId,
        callId,
        processName: 'blindTransfer',
        passArgs: {
          agentNumber,
          agentId,
          extNumber,
          extAgentId,
          transportTime: _this.R.transportTime,
          transferTime: _this.R.transferTime
        }
      })
      // const res = pbxApi.uuidTransfer(blegId,'b-leg',extNumber);
      if (_this.R.isInQueue && !_this.R.transferData.transferFromQueue) {
        _this.R.transferData.transferFromQueue = true;
      }
      //_this.R.isInQueue = false;
      service.cdr.update({
        tenantId,
        callId,
      }, {
        $inc: {transferTimes: 1}
      })
      pbxApi.uuidRecord(callId, 'stop', tenantId, _this.R.config.s3FileProxy, _this.R.recordFiles[callId])
          .then(result => {
            logger.debug(loggerPrefix, '转接停止之前录音成功!');
          })
          .catch(err => {
            logger.error(loggerPrefix, '转接停止之前的录音失败:', err);
          });

      await pbxApi.uuidTransfer(callId, '-both', 'consulting');


      let beKilledId, beTransferId, beTransferNumber;
      if (routerLine === '呼入') {
        beKilledId = blegId;
        beTransferId = callId;
        beTransferNumber = _this.R.caller;
      }
      else if (routerLine === '呼出') {
        beKilledId = callId;
        beTransferId = blegId;
        beTransferNumber = _this.R.called;
      }
      else if (routerLine === '本地') {
        //发起转接的是主叫
        if (_this.R.caller === agentNumber) {
          beKilledId = callId;
          beTransferId = blegId;
          beTransferNumber = _this.R.called;
        } else {
          beKilledId = blegId;
          beTransferId = callId;
          beTransferNumber = _this.R.caller;
        }
      }
      await pbxApi.uuidKill(beKilledId);

      const clegId = await pbxApi.createUuid();
      _this.R.agentLeg[`${extNumber}`] = clegId;
      const runtimeData = {
        isBeTransferHangup: false,
        isCLegHangup: false,
        isCLegAnswer: false
      }
      const onBeTansferHangup = async() => {
        runtimeData.isBeTransferHangup = true;
        _this.R.satisData.hangup = true;
        if (!runtimeData.isCLegAnswer || !runtimeData.isCLegHangup) {
          pbxApi.uuidKill(clegId)
        }
      }
      pbxApi.conn.once(`esl::event::CHANNEL_HANGUP::${beTransferId}`, onBeTansferHangup);

      const logicOptions = {
        transferCall: true,
        transferType: 'blind',
        transferFrom: agentNumber,
        transferTo: extNumber,
        transferCallId: clegId,
        transferProcess: 'c_to_a',
        beTransferNumber: beTransferNumber,
      }

      const pubData = {
        tenantId: tenantId,
        agentId: extAgentId,
        agent: extNumber,
        state: '',
        fsName: _this.R.fsName,
        fsCoreId: _this.R.fsCoreId,
        callType: _this.R.callType,
        logicInTheCall: true,
        consultOn: false,
        consultOff: false,
        transferCall: true,
        transferType: 'blind',
        transferFrom: agentNumber,
        transferTo: extNumber,
        roomId: _this.R.roomId,
        answeredCallId: _this.R.originationUuid,
        transferCallId: clegId,
        sipCallId: _this.R.pbxApi.getChannelData().sipCallId,
        beTransferNumber: beTransferNumber,
        transferProcess: 'c_to_a',
        logicType: 'transfer',
        logicOptions,
        isClickOut: _this.R.clickOut === 'yes' ? true : false,
        options: {
          callId: _this.R.callId,
          callee: _this.R.called,
          caller: _this.R.caller,
          DND: _this.R.DND,
          direction: _this.R.direction
        }
      }

      const dialExtenResult = await _this.tools.originateACall({
        newUuid: clegId,
        transferCallId: clegId,
        dialNumber: extNumber,
        tenantId,
        callerIdName: agentNumber,
        callId,
        agentId: extAgentId,
        logicType: 'transfer',
        logicOptions,
        isTransfer: true,
        transferType: 'blind',
        transferFrom: agentNumber,
        transferTo: extNumber,
        beTransferNumber: beTransferNumber,
        recordCall: true
      })
      if (dialExtenResult.success) {
        runtimeData.isCLegAnswer = true;
        /*_this.R.service.callProcess.create({
         caller,
         called,
         tenantId,
         callId,
         processName: 'answer',
         passArgs: {number: extNumber, agentId: extAgentId}
         })*/
        await _this.tools.wait(200);
        let bridgeResult = await pbxApi.uuidBridge(beTransferId, clegId);
        logger.debug(loggerPrefix, 'Agent dial Extension Result  Dial Result:', bridgeResult);

        if (bridgeResult.success) {
          pbxApi.conn.off(`esl::event::CHANNEL_HANGUP::${beTransferId}`, onBeTansferHangup);
          _this.R.satisData.agentNumber = extNumber;
          _this.R.satisData.agentId = extAgentId;
          _this.R.satisData.agentLeg = clegId;
          _this.R.satisData.uuid = beTransferId;

          pubData.state = AGENTSTATE.inthecall;
          pubData.transferProcess = 'c_to_a';
          pubData.logicOptions.transferProcess = 'c_to_a';
          pubData.agent = extNumber;
          _this.db.setAgentState(pubData);

          _this.R.recordFiles[callId] = `${callId}_${clegId}`;
          pbxApi.uuidRecord(callId, 'start', tenantId, _this.R.config.s3FileProxy, _this.R.recordFiles[callId])
              .then(result => {
                service.record.create({
                  tenantId: tenantId,
                  direction: _this.R.callType,
                  callId: callId,
                  filename: `${_this.R.recordFiles[callId]}`,
                  extension:extNumber,
                  agentId: `${extAgentId || extNumber}`
                });
                logger.debug(loggerPrefix, `开始录音成功!`);
              })
              .catch(err => {
                logger.error(loggerPrefix, `开始录音失败:`, err);
              });
          await new Promise((resolve, reject) => {
            logger.debug(loggerPrefix, `转接成功后开始监听各方!`);
            const onBeTransferHangup = () => {
              runtimeData.isBeTransferHangup = true;
              _this.R.satisData.hangup = true;
              logger.debug(loggerPrefix, `监听到BeTransferHangup!`, runtimeData);
              if (!runtimeData.isCLegHangup) {
                pbxApi.conn.off(`esl::event::CHANNEL_HANGUP::${clegId}`, onClegHangup);
                pbxApi.uuidKill(clegId);
                resolve()
              }
            }
            const onClegHangup = () => {
              runtimeData.isCLegHangup = true;
              logger.debug(loggerPrefix, `监听到ClegHangup!`, runtimeData);
              if (!runtimeData.isBeTransferHangup) {

                pbxApi.conn.off(`esl::event::CHANNEL_HANGUP::${beTransferId}`, onBeTransferHangup);
                logger.debug(loggerPrefix, `取消监听onBeTransferHangup`);
              }
              logger.debug(loggerPrefix, 'resolve');
              resolve();
            }
            pbxApi.conn.once(`esl::event::CHANNEL_HANGUP::${clegId}`, onClegHangup);
            pbxApi.conn.once(`esl::event::CHANNEL_HANGUP::${beTransferId}`, onBeTransferHangup);
          })
        }
        else {
          logger.warn(loggerPrefix, 'blindTransfer error:', bridgeResult);
          pbxApi.uuidKill(beTransferId);
          pbxApi.uuidKill(clegId);
        }
      }
      else {
        await pbxApi.uuidKill(beTransferId);
      }

    }
    catch (ex) {
      return Promise.reject(ex);
    }
  }

  async appoint(message) {
    const _this = this;
    try {
      const loggerPrefix = _this.loggerPrefix.concat('appoint');
      const {caller, called, service, pbxApi, logger,EE3} = _this.R;
      logger.debug(loggerPrefix, `监听到坐席发起指定转接事件:`, message, _this.R.agentLeg);
      const {tenantId, agentNumber, callId, agentId, extNumber, extAgentId} = message;
      const blegId = _this.R.agentLeg[`${agentNumber}`];

      _this.R.lastLogic = 'appoint_transfer';
      _this.R.transferTime = _this.R.transferTime + 1;

     service.callProcess.create({
        caller,
        called,
        tenantId,
        callId,
        processName: 'appointTransfer',
        passArgs: {
          agentNumber,
          agentId,
          extNumber,
          extAgentId,
          transportTime: _this.R.transportTime,
          transferTime: _this.R.transferTime
        }
      })
      if (_this.R.isInQueue && !_this.R.transferData.transferFromQueue) {
        _this.R.transferData.transferFromQueue = true;
      }
      // _this.R.isInQueue = false;
     service.cdr.update({
        tenantId,
        callId,
      }, {
        $inc: {transferTimes: 1}
      })

      pbxApi.uuidRecord(callId, 'stop', tenantId, _this.R.config.s3FileProxy, _this.R.recordFiles[callId])
          .then(result => {
            logger.debug(loggerPrefix, '指定转接停止之前录音成功!');
          })
          .catch(err => {
            logger.error(loggerPrefix, '指定转接停止之前的录音失败:', err);
          });

      await pbxApi.uuidTransfer(callId, '-both', 'consulting');


      let beKilledId, beTransferId, beTransferNumber;
      if (_this.R.routerLine === '呼入') {
        beKilledId = blegId;
        beTransferId = callId;
        beTransferNumber = _this.R.caller;
      }
      else if (_this.R.routerLine === '呼出') {
        beKilledId = callId;
        beTransferId = blegId;
        beTransferNumber = _this.R.called;
      }
      else if (_this.R.routerLine === '本地') {
        //发起转接的是主叫
        if (_this.R.caller === agentNumber) {
          beKilledId = callId;
          beTransferId = blegId;
          beTransferNumber = _this.R.called;
        }
        else {
          beKilledId = blegId;
          beTransferId = callId;
          beTransferNumber = _this.R.caller;
        }
      }


      //await pbxApi.uuidKill(beKilledId);

      const clegId = await pbxApi.createUuid();
      _this.R.agentLeg[`${extNumber}`] = clegId;
      const runtimeData = {
        isBeTransferHangup: false,
        transferSuccess: false,
        isInitiatorHangup: false,//转接发起人是否挂机
        isCLegHangup: false,//指定转接者是否挂机
        isCLegAnswer: false,//指定转接是否接听
        initiatorTalkToC: false // 转接发起人和指定转接的接通电话
      }

      const logicOptions = {
        transferCall: true,
        transferType: 'appoint',
        transferFrom: agentNumber,
        transferTo: extNumber,
        transferCallId: clegId,
        transferProcess: '',
        beTransferNumber: beTransferNumber,
      }

      const pubData = {
        tenantId: tenantId,
        agentId: agentId,
        agent: agentNumber,
        state: '',
        fsName: _this.R.fsName,
        fsCoreId: _this.R.fsCoreId,
        callType: _this.R.callType,
        logicInTheCall: true,
        consultOn: false,
        consultOff: false,
        transferCall: true,
        transferType: 'appoint',
        transferFrom: agentNumber,
        transferTo: extNumber,
        logicType: 'transfer',
        logicOptions,
        sipCallId: _this.R.pbxApi.getChannelData().sipCallId,
        roomId: _this.R.roomId,
        answeredCallId: _this.R.originationUuid,
        transferCallId: clegId,
        beTransferNumber: beTransferNumber,
        isClickOut: _this.R.clickOut === 'yes' ? true : false,
        options: {
          callId: _this.R.callId,
          callee: _this.R.called,
          caller: _this.R.caller,
          DND: _this.R.DND,
          direction: _this.R.direction
        }
      }

      const onBeTransferHangup = async() => {
        logger.debug(loggerPrefix, 'appointTransfer被转接发挂机事件处理', runtimeData)
        runtimeData.isBeTransferHangup = true;
        _this.R.satisData.hangup = true;
        if (!runtimeData.initiatorTalkToC) {
          pbxApi.uuidKill(beKilledId);
          pbxApi.uuidKill(clegId);
          EE3.emit(`blindTransfer::after::transferFail::${clegId}`, 'BeTransfer');
        }
        // 发起方和指定方正在通话
        else if (runtimeData.initiatorTalkToC && !runtimeData.transferSuccess && !runtimeData.isCLegHangup) {
          //通知指定转接方,被转接方已经挂机了

          _this.db.sendMsgToAgent({
            tenantId,
            agentNumber,
            appointNumber: extNumber,
            code: 1305,
            message: 'beTransfer hangup',
            logicType: 'transfer'
          })
          //TODO 跟换提示音
          await pbxApi.uuidBroadcast(clegId, 'demo/custom_hangup.wav', 'both');
          await new Promise((resolve, reject) => {
            pbxApi.conn.once(`esl::event::PLAYBACK_STOP::${clegId}`, (evt) => {
              pbxApi.uuidKill(clegId);
              pbxApi.uuidKill(beKilledId);
              resolve()
            });
          })
          EE3.emit(`blindTransfer::in::initiatorTalkToC::${clegId}`, 'BeTransfer');


        }
        else if (runtimeData.initiatorTalkToC && !runtimeData.transferSuccess && runtimeData.isCLegHangup) {
          EE3.emit(`blindTransfer::after::initiatorTalkToC::${clegId}:`, 'BeTransfer');
          pbxApi.uuidKill(beKilledId);
        }
        else if (runtimeData.transferSuccess && !runtimeData.isCLegHangup) {
          await pbxApi.uuidKill(clegId);
          EE3.emit(`blindTransfer::after::transferSuccess::${clegId}`, 'BeTransfer');
        }

      }

      /**
       * @description - 转接发起人挂机
       */
      const onInitiatorHangup = async() => {
        runtimeData.isInitiatorHangup = true;
        logger.debug(loggerPrefix, 'appointTransfer转接发起方挂机事件处理')
        if (runtimeData.initiatorTalkToC && !runtimeData.isCLegHangup && !runtimeData.isBeTransferHangup) {
          logger.debug(loggerPrefix, 'appointTransfer转接发起方挂机,桥接被转接方和指定转接方');
          const bridgeResult = await pbxApi.uuidBridge(beTransferId, clegId);
          logger.debug(loggerPrefix, 'appointTransfer转接发起方挂机,桥接被转接方和指定转接方结果:', bridgeResult);
          // 指定转接成功
          if (bridgeResult.success) {
            runtimeData.transferSuccess = true;
            // 设置满意度相关参数
            _this.R.satisData.agentNumber = extNumber;
            _this.R.satisData.agentId = extAgentId;
            _this.R.satisData.agentLeg = clegId;
            _this.R.satisData.uuid = beTransferId;

            _this.db.setAgentState(Object.assign({}, pubData, {
              state: AGENTSTATE.inthecall,
              transferProcess: 'c_to_a',
              agent: extNumber
            }));

            pbxApi.uuidRecord(clegId, 'stop', tenantId, _this.R.config.s3FileProxy, _this.R.recordFiles[clegId])
                .then(()=>{})
                .catch((err)=>{});
            logger.debug(loggerPrefix, '指定转接后,停止与发起方录音成功!')
            _this.R.recordFiles[beTransferId] = `${beTransferId}_${clegId}`;
            pbxApi.uuidRecord(beTransferId, 'start', tenantId, _this.R.config.s3FileProxy, _this.R.recordFiles[beTransferId])
                .then(()=>{})
                .catch((err)=>{});
           service.record.create({
              tenantId: tenantId,
              direction: _this.R.callType,
              callId: callId,
              filename: `${_this.R.recordFiles[beTransferId]}`,
              agentId: `${extAgentId || extNumber}`
            });
            logger.debug(loggerPrefix, '指定转接后,还是与被转接方的录音成功!');
            EE3.emit(`blindTransfer::in::initiatorTalkToC::${clegId}`, 'Initiator');
          }
          else {
            pbxApi.uuidKill(beTransferId);
            EE3.emit(`blindTransfer::in::initiatorTalkToC::${clegId}`, 'Initiator');
          }
        }
        else if (runtimeData.initiatorTalkToC && !runtimeData.isCLegHangup && runtimeData.isBeTransferHangup) {
          pbxApi.uuidKill(clegId);
        }
        // B-C通过话,C挂机后
        else if (runtimeData.initiatorTalkToC && runtimeData.isCLegHangup && !runtimeData.isBeTransferHangup) {

          //pbxApi.uuidKill(beTransferId);
          EE3.emit(`blindTransfer::after::initiatorTalkToC::${clegId}`, 'Initiator');
        }
        else if (!runtimeData.initiatorTalkToC) {
          EE3.emit(`blindTransfer::after::transferFail::${clegId}`, 'Initiator');
          //pbxApi.uuidKill(beTransferId);
        }
      }

      const onAppointHangup = async() => {
        logger.debug(loggerPrefix, 'appointTransfer指定转接方挂机事件处理:', runtimeData);
        runtimeData.isCLegHangup = true;
        // 转接成功后,指定转接方先发起了挂机
        if (runtimeData.transferSuccess && !runtimeData.isBeTransferHangup) {
          EE3.emit(`blindTransfer::after::transferSuccess::${clegId}`, 'Appoint');
        }
        else if (runtimeData.initiatorTalkToC && !runtimeData.isInitiatorHangup && !runtimeData.isBeTransferHangup) {
          // 取消监听被转接方挂机事件
          // pbxApi.conn.off(`esl::event::CHANNEL_HANGUP::${beTransferId}`, onBeTransferHangup);
          // 取消监听转接发起方挂机事件
          //pbxApi.conn.off(`esl::event::CHANNEL_HANGUP::${beKilledId}`, onInitiatorHangup);

          // 先保持A-B
          /* await  pbxApi.uuidTransfer(beKilledId, '-both', 'consulting');


           _this.db.setAgentState(Object.assign({}, pubData, {
           state: AGENTSTATE.inthecall,
           callType: String(extNumber).length > 4 ? 'outbound' : 'local',
           transferFail: 'on_appoint_hangup',
           agent: agentNumber
           }));

           EE3.once(`${EVENTNAME.callControl.PUB.agentHoldOff}::${_this.R.tenantId}::${_this.R.callId}`, ()=> {
           pbxApi.uuidBridge(beTransferId, beKilledId)
           .then((res)=> {
           logger.debug(loggerPrefix, 'appointTransfer转接发起方挂机,桥接被转接方和发起转接方结果:', res);
           })
           .catch(err=> {
           logger.error(loggerPrefix, 'appointTransfer转接发起方挂机,桥接被转接方和发起转接方异常:', err)
           })
           });*/

          _this.db.sendMsgToAgent({
            tenantId,
            agentNumber,
            appointNumber: extNumber,
            code: 1301,
            message: 'appoint_transfer_hangup',
            logicType: 'transfer'
          })
          await pbxApi.uuidSetvar({uuid: beTransferId, varname: 'park_after_bridge', varvalue: 'true'});
          await pbxApi.uuidSetvar({uuid: beKilledId, varname: 'park_after_bridge', varvalue: 'true'});

          pbxApi.uuidBridge(beTransferId, beKilledId)
              .then(res => {
                _this.db.setAgentState(Object.assign({}, pubData, {
                  state: AGENTSTATE.inthecall,
                  transferProcess: 'b_to_a',
                  transferFail: 'on_appoint_hangup',
                  agent: agentNumber
                }));
                // _this.R.isInQueue = true;
                logger.debug(loggerPrefix, 'appointTransfer转接发起方挂机,桥接被转接方和发起转接方结果:', res);
                if (!res.success) {
                  pbxApi.uuidKill(beTransferId);
                  pbxApi.uuidKill(beKilledId);
                }
              })
              .catch(ex => {
                pbxApi.uuidKill(beTransferId);
                pbxApi.uuidKill(beKilledId);
                logger.error(loggerPrefix, 'appointTransfer转接发起方挂机,桥接被转接方和发起转接方异常:', ex)
              });

          EE3.emit(`blindTransfer::in::initiatorTalkToC::${clegId}`, 'Appoint');
        }
        else if (!runtimeData.initiatorTalkToC) {
          logger.debug(loggerPrefix, '指定转接方还未与发起转接方接通,就挂机了')
        }
      }

      // 监听被转接方挂机事件
      pbxApi.conn.once(`esl::event::CHANNEL_HANGUP::${beTransferId}`, onBeTransferHangup);
      // 监听转接发起方挂机事件
      pbxApi.conn.once(`esl::event::CHANNEL_HANGUP::${beKilledId}`, onInitiatorHangup);
      // 监听指定转接方挂机事件
      pbxApi.conn.once(`esl::event::CHANNEL_HANGUP::${clegId}`, onAppointHangup);


      logicOptions.transferProcess = 'c_to_b';
      const dialExtenResult = await _this.tools.originateACall({
        newUuid: clegId,
        dialNumber: extNumber,
        tenantId,
        callerIdName: agentNumber,
        callId,
        agentId: extAgentId,
        isTransfer: true,
        transferFrom: agentNumber,
        transferTo: extNumber,
        transferType: 'appoint',
        logicOptions,
        logicType: 'transfer',
        answeredCallId: _this.R.originationUuid,
        transferCallId: clegId,
        beTransferNumber: beTransferNumber,
        recordCall: true
      })
      if (dialExtenResult.success) {
        runtimeData.isCLegAnswer = true;
        /*_this.R.service.callProcess.create({
         caller,
         called,
         tenantId,
         callId,
         processName: 'answer',
         passArgs: {number: extNumber, agentId: extAgentId}
         })*/
        await _this.tools.wait(200);
        // 将坐席与C-LEG桥接
        if (!runtimeData.isInitiatorHangup && !runtimeData.isBeTransferHangup) {
          let bridgeResult = {success: false};
          bridgeResult = await pbxApi.uuidBridge(beKilledId, clegId);
          logger.debug(loggerPrefix, 'appointTransfer  bridge A-C Result:', bridgeResult);
          if (bridgeResult.success) {
            runtimeData.initiatorTalkToC = true;
            logicOptions.transferProcess = 'b_to_c';
            _this.db.setAgentState(Object.assign({}, pubData, {
              state: AGENTSTATE.inthecall,
              callType: String(extNumber).length > 4 ? 'outbound' : 'local',
              transferProcess: 'b_to_c',
              logicOptions,
              agent: agentNumber
            }));
            _this.db.sendMsgToAgent({
              tenantId,
              agentNumber,
              appointNumber: extNumber,
              code: 1303,
              message: 'appoint_transfer_success',
              logicType: 'transfer'
            })
            _this.R.recordFiles[clegId] = `${clegId}_${beKilledId}`;
            pbxApi.uuidRecord(clegId, 'start', tenantId, _this.R.config.s3FileProxy, _this.R.recordFiles[clegId])
                .then(result => {
                 service.record.create({
                    tenantId: tenantId,
                    direction: _this.R.callType,
                    callId: callId,
                    filename: `${_this.R.recordFiles[clegId]}`,
                    agentId: `${agentId},${extAgentId || extNumber}`
                  });
                  logger.debug(loggerPrefix, `转接发起方和指定方[${beKilledId}_${clegId}],开始录音成功!`);
                })
                .catch(err => {
                  logger.error(loggerPrefix, `转接发起方和指定方[${beKilledId}_${clegId}],开始录音失败:`, err);
                });

            await new Promise((resolve, reject) => {
              const event = `blindTransfer::in::initiatorTalkToC::${clegId}`;
              logger.debug(loggerPrefix, event);
              EE3.once(event, (ty) => {
                resolve(ty);
              })
            })

            if (runtimeData.transferSuccess) {
              await new Promise((resolve, reject) => {
                const event = `blindTransfer::after::transferSuccess::${clegId}`;
                logger.debug(loggerPrefix, event);
                EE3.once(event, (ty) => {
                  resolve(ty);
                })
              })
            }
            else if (runtimeData.initiatorTalkToC && runtimeData.isCLegHangup) {
              await new Promise((resolve, reject) => {
                const event = `blindTransfer::after::initiatorTalkToC::${clegId}`;
                logger.debug(loggerPrefix, event);
                EE3.once(event, (ty) => {
                  resolve(ty);
                })
              })
            }

          }
          else {
            _this.db.sendMsgToAgent({
              tenantId,
              agentNumber,
              code: 1302,
              appointNumber: extNumber,
              message: 'appoint_transfer_fail_on_bridge',
              logicType: 'transfer'
            })
            // TODO 未知bridge失败的情况
            logger.warn(loggerPrefix, 'appointTransfer  bridge A-C fail:', bridgeResult.reason);
          }
        }
      }

      else {
        //TODO  通知坐席拨打指定转接的分机或外线失败
        logger.warn(loggerPrefix, `Originate ${clegId} Fail: `, dialExtenResult);
        _this.db.sendMsgToAgent({
          tenantId,
          agentNumber,
          code: 1304,
          appointNumber: extNumber,
          message: 'appoint_transfer_fail_on_originate',
          logicType: 'transfer'
        })
        if (!runtimeData.isInitiatorHangup && !runtimeData.isBeTransferHangup) {
          // await pbxApi.uuidBridge(beTransferId, beKilledId);
          _this.db.setAgentState(Object.assign({}, pubData, {
            state: AGENTSTATE.inthecall,
            transferProcess: 'b_to_a',
            transferFail: 'on_originate',
            agent: agentNumber
          }));
          await pbxApi.uuidSetvar({uuid: beTransferId, varname: 'park_after_bridge', varvalue: 'true'});
          await pbxApi.uuidSetvar({uuid: beKilledId, varname: 'park_after_bridge', varvalue: 'true'});
          await pbxApi.uuidBridge(beTransferId, beKilledId);
          _this.R.recordFiles[beTransferId] = `${beTransferId}_${beKilledId}.${_this.R.transferTime}`;
          pbxApi.uuidRecord(beTransferId, 'start', tenantId, _this.R.config.s3FileProxy, _this.R.recordFiles[beTransferId])
              .then(result => {
               service.record.create({
                  tenantId: tenantId,
                  direction: _this.R.callType,
                  callId: callId,
                  filename: `${_this.R.recordFiles[beTransferId]}`,
                  agentId: `${agentId}`
                });
                logger.debug(loggerPrefix, `开始录音成功!`);
              })
              .catch(err => {
                logger.error(loggerPrefix, `开始录音失败:`, err);
              });
          await new Promise((resolve, reject) => {
            EE3.once(`blindTransfer::after::transferFail::${clegId}`, (ty) => {
              resolve(ty);
            })
          })
        }
      }
    }
    catch (ex) {
      return Promise.reject(ex);
    }
  }
}
export default Transfer;