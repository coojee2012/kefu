import { Injector, ReflectiveInjector, Injectable } from 'injection-js';
import { ConfigService } from '../service/ConfigService';
import { LoggerService } from '../service/LogService';
import { Connection } from '../lib/NodeESL/Connection';
import { Event } from '../lib/NodeESL/Event';

export type uuidPlayAndGetDigitsOptions = {
  transfer_on_failure?: string;
  digit_timeout?: number;
  regexp: string;
  var_name?: string;
  invalid_file?: string;
  input_err_file?: string;
  input_timeout_file?: string;
  input_err_retry?: number;
  input_timeout_retry?: number;
  inputWhenInvalidTip?: boolean;
  file: string;
  terminators?: string;
  timeout?: number;
  tries?: number;
  max?: number;
  min?: number;
}

export type uuidReadOptions = {
  uuid: string;
  file: string;
  terminators?: string;
  min?: number;
  max?: number;
  variableName?: string;
  timeout?: number;
  legs?: string;
}
@Injectable()
export class FreeSwitchPBX {
  private logger: LoggerService;
  private lastInputKey: string;
  constructor(private conn: Connection, private injector: Injector) {
    this.logger = this.injector.get(LoggerService);
    this.logger.debug('init freeswitch PBX!');
    this.lastInputKey = '';
  }
  /**
   * @description
   * 监听指定的FS事件，FS事件默认返回json字符串
   * event plain ALL
   * event plain CHANNEL_CREATE CHANNEL_DESTROY CUSTOM conference::maintenance sofia::register sofia::expire
   * event xml ALL
   * event json CHANNEL_ANSWER
   * 先执行
   * event plain DTMF
   * 再执行
   * event plain CHANNEL_ANSWER
   * 最终会监听 DTMF 和 CHANNEL_ANSWER 两个事件
   * @param events 
   */
  async subscribe(events: string[]) {
    try {
      const result = await new Promise((resolve, reject) => {
        this.conn.subscribe(events, (evt: Event) => {
          this.logger.debug('subscribe:', evt.getHeader('Reply-Text'));
          resolve();
        });
      });
    }
    catch (ex) {
      this.logger.error('subscribe', ex);
    }
  }
  async linger(time: Number) {
    try {
      const result = await new Promise((resolve, reject) => {
        this.conn.sendRecv(`linger ${time}`, (evt: Event) => {
          this.logger.debug('linger:', evt.getHeader('Reply-Text'));
          resolve();
        });
      })
      return result;
    }
    catch (ex) {
      this.logger.error('linger', ex);
    }
  }

  /**
   * @description
   * 指定要侦听的事件类型。注意：这里的过滤不是排除出去而是加入
   * 以下示例将订阅所有事件，然后创建两个过滤器，一个用于侦听HEARTBEATS，另一个用于侦听CHANNEL_EXECUTE事件。
   * events json all
   * filter Event-Name CHANNEL_EXECUTE
   * filter Event-Name HEARTBEAT
   * 现在只会收到HEARTBEAT和CHANNEL_EXECUTE事件。您可以过滤事件中任何的header。要筛选特定channel，您需要使用uuid：
   * filter Unique-ID d29a070f-40ff-43d8-8b9d-d369b2389dfe
   * 要过滤多个唯一ID，您可以为每个UUID添加另一个事件过滤器。
   * filter plain all
   * filter plain CUSTOM conference::maintenance
   * filter Unique-ID $participantB
   * filter Unique-ID $participantA
   * filter Unique-ID $participantC
   * 这会给你参加任何会议的参与者A，B和C的事件。要接收会议中所有用户的事件，您可以使用如下所示的内容：
   * filter Conference-Unique-ID $ConfUUID
   * @param header 
   * @param value 
   */
  async filter(header, value) {
    try {
      const result = await new Promise((resolve, reject) => {
        this.conn.filter(header, value, (evt: Event) => {
          this.logger.debug('filter:', evt.getHeader('Reply-Text'));
          resolve();
        });
      })
      return result;
    } catch (ex) {
      this.logger.error('filter', ex);
    }
  }

  /**
   * @description
   * 指定您要撤消过滤器的事件。当某些过滤器错误地应用或者没有使用过滤器时，可以使用过滤器删除。
   * 使用方式：
   * filter delete <EventHeader> <ValueToFilter>
   * 比如：
   * filter delete Event-Name HEARTBEAT
   * 现在，你将不再收到HEARTBEAT事件。您可以删除以这种方式应用的任何过滤器。
   * filter delete Unique-ID d29a070f-40ff-43d8-8b9d-d369b2389dfe
   * 这是删除为给定的唯一标识符应用的过滤器。在此之后，您将不会收到任何此唯一ID的事件。
   * filter delete Unique-ID
   * 这会删除基于unique-id应用的所有过滤器。
   */
  async filterDelete() {

  }


  /**
   * outbound模式下应答采用的uuid直接从通道变量获得
   */
  async answer(uuid?: string): Promise<any> {
    try {
      const result = await new Promise((resolve, reject) => {
        this.conn.execute('answer', '', uuid, (evt: Event) => {
          //  console.log('Answer -> ',evt);
          resolve();
        })
      });
      return Promise.resolve(result);
    }
    catch (ex) {
      return Promise.reject(ex);
    }

  }

  /**
   * outbound模式下应答采用的uuid直接从通道变量获得
   */
  async startDTMF(uuid?: string): Promise<any> {
    try {
      const result = await new Promise((resolve, reject) => {
        this.conn.execute('start_dtmf', '', uuid, (evt: Event) => {
          //  console.log('Answer -> ',evt);
          resolve();
        })
      });
      return Promise.resolve(result);
    }
    catch (ex) {
      return Promise.reject(ex);
    }

  }


  async  getChannelVar(varname: string, uuid: string): Promise<string> {
    try {
      const result = await new Promise<string>((resolve, reject) => {
        this.conn.api('uuid_getvar', [uuid, varname], (evt: Event) => {
          const value: string = evt.body;
          resolve(value);
        });
      });
      return result;
    }
    catch (ex) {
      return Promise.reject(ex);
    }
  }

  async uuidPlayAndGetDigits({ uuid, options, includeLast = false }: { uuid: string, options: uuidPlayAndGetDigitsOptions, includeLast: boolean }) {
    try {
      let {
        transfer_on_failure,
        digit_timeout,
        regexp,
        var_name,
        input_err_file,
        inputWhenInvalidTip,
        input_err_retry = 3,
        input_timeout_file,
        input_timeout_retry = 3,
        file,
        terminators = '#',
        timeout = 30,
        tries = 3,
        max = 1,
        min = 1
      } = options;
      const readArgs = {
        uuid,
        min: min,
        max: max,
        file,
        variableName: var_name,
        timeout: digit_timeout,
        terminators: terminators
      }


      input_err_retry = input_err_retry < 1 ? 3 : input_err_retry;
      input_timeout_retry = input_timeout_retry < 1 ? 3 : input_timeout_retry;
      let inputKeys = '';
      let success = false;
      while (input_err_retry > 0 && input_timeout_retry > 0) {
        tries--;
        const res = await this.uuidRead(readArgs);
        this.logger.debug('uuidPlayAndGetDigits:', input_err_retry, input_timeout_retry);
        const reg = new RegExp(regexp);
        if (res && reg.test(res)) {
          inputKeys = res;
          success = true;
          break;
        }
        else if (res && res === 'hangup') {
          break;
        }
        else {
          let tipFile;
          if (res == 'timeout') {
            tipFile = input_timeout_file ? input_timeout_file : 'demo/timeout.wav';
            input_timeout_retry--;
          } else {
            tipFile = input_err_file ? input_err_file : 'demo/inputerror.wav';
            input_err_retry--;
          }
          if (!inputWhenInvalidTip && input_err_retry > 0 && input_timeout_retry > 0) {
            await this.uuidPlayback({ uuid, terminators: 'none', file: tipFile });
          } else {
            readArgs.file = tipFile;
          }
        }
      }

      if (success) {
        if (includeLast) {
          inputKeys = `${this.lastInputKey}${inputKeys}`;
        }
        if (inputKeys && inputKeys.length) {
          this.lastInputKey = inputKeys[inputKeys.length - 1];
        }
      } else {
        inputKeys = '_invalid_';
      }

      if (var_name) {
        await this.uuidSetvar({
          uuid,
          varname: var_name,
          varvalue: inputKeys
        });
      }
      return inputKeys;
    } catch (ex) {
      this.logger.error('uuidReadDigits', ex);
      return Promise.reject(ex);
    }
  }

  async uuidPlayback({ uuid, file, terminators = 'none', legs = 'aleg' }: { uuid: string, file: string, terminators?: string, legs?: string }) {
    try {
      const getTerminatorsKey = (evt) => {
        const input = evt.headers.get('DTMF-Digit');
        this.logger.debug('DTMF-Digit:', evt, input);
        if (input == terminators) {
          this.uuidBreak(uuid);
        }
      }
      await this.uuidBroadcast(uuid, file, legs);
      const playResult = await new Promise((resolve, reject) => {
        if (terminators && terminators !== 'none') {
          this.conn.on(`esl::event::DTMF::${uuid}`, getTerminatorsKey)
        }
        // PLAYBACK_START
        this.conn.once(`esl::event::PLAYBACK_START::${uuid}`, (evt) => {
          this.logger.debug('uuidPlay start:', evt);

        })
        this.conn.once(`esl::event::PLAYBACK_STOP::${uuid}`, (evt) => {
          const stopReason = evt.headers.get('Playback-Status');
          this.logger.debug('uuidPlay stop:', evt);
          resolve(stopReason);
        })
      })
      if (terminators && terminators !== 'none') {
        this.conn.off(`esl::event::DTMF::${uuid}`, getTerminatorsKey);
      }
      return playResult;
    } catch (ex) {
      this.logger.error('uuidPlayback', ex);
      return Promise.reject(ex);
    }
  }


  async uuidRead({ uuid, file, terminators = 'none', min = 1, max = 1, variableName, timeout = 30000, legs = 'aleg' }: uuidReadOptions) {
    try {
      let inputs = '';
      let playStoped = false;
      let isTimeOut = false;
      let isOver = false; //是否接收按键结束
      let channelHangup = false;
      const getTerminatorsKey = (evt) => {
        const input = evt.headers.get('DTMF-Digit');
        this.logger.debug('DTMF-Digit:', input);
        // 一旦接收到按键信息,立即终止播放音乐
        if (!playStoped) {
          this.uuidBreak(uuid)
            .then(res => {
              this.logger.debug('终止播放语音结果:', res);
            })
            .catch(err => {
              this.logger.error('终止播放语音错误:', err);
            });
        }
        if (input == terminators) {
          isOver = true;
        } else if (inputs == 'timeout') {
          isOver = true;
        }
        else if (isOver) {
          this.logger.debug('按键接收已完毕多余按键将忽略！');
          return;
        }
        else {
          inputs = `${inputs}${input}`;
          if (inputs && inputs.length == max) {
            isOver = true;
          }
        }
      }

      const onCallHangup = () => {
        this.logger.debug(` uuidRead CHANNEL_HANGUP  ${uuid}!`);
        isOver = true;
        channelHangup = true;
      }
      this.conn.once(`esl::event::CHANNEL_HANGUP::${uuid}`, onCallHangup);

      // PLAYBACK_START
      this.conn.once(`esl::event::PLAYBACK_START::${uuid}`, (evt) => {
        this.logger.debug(`uuidPlay start ${uuid}!`);
      })

      await this.uuidBroadcast(uuid, file, legs);
      this.logger.debug('uuidRead BBBB', this.conn.listeners(`esl::event::DTMF::${uuid}`))
      this.conn.on(`esl::event::DTMF::${uuid}`, getTerminatorsKey);
      this.logger.debug('uuidRead EEEE', this.conn.listeners(`esl::event::DTMF::${uuid}`))
      await new Promise((resolve, reject) => {
        const startOnHangup = () => {
          if (!playStoped) {
            playStoped = true;
            isOver = true;
            inputs = 'hangup';
            this.logger.debug(`uuidPlay when hangup ${uuid}`);
            resolve();
          }
        }
        this.conn.once(`esl::event::PLAYBACK_STOP::${uuid}`, (evt) => {
          if (!playStoped) {
            playStoped = true;
            this.conn.removeListener(`esl::event::CHANNEL_HANGUP::${uuid}`, startOnHangup);
            const stopReason = evt.headers.get('Playback-Status');
            this.logger.debug(`uuidPlay stop${uuid}:`, stopReason);
            resolve(stopReason);
          }
        })
        this.conn.once(`esl::event::CHANNEL_HANGUP::${uuid}`, startOnHangup);
      })

      await this.wait(1 * 1000);

      if (!isOver) {
        this.logger.debug('uuidRead等待超时处理11111');

        await new Promise((resolve, reject) => {
          let time = process.hrtime();
          /* let timeRef = setInterval(() => {
           const diff = process.hrtime(time);
           this.logger.debug(`uuidRead检查超时:${diff}`);
           if (isOver || diff[0] * 1000 > timeout) {
           clearInterval(timeRef);
           timeRef = null;
           isOver = true;
           resolve();
           }
           }, 1000);*/
          const checkTimeout = () => {
            const diff = process.hrtime(time);
            this.logger.debug(`uuidRead检查超时:diff = ${diff[0] * 1000} ,timeout=${timeout}`);
            if (isOver) {
              resolve();
            } else if (diff[0] * 1000 > timeout) {
              isOver = true;
              inputs = 'timeout';
              resolve();
            } else {
              process.nextTick(() => {
                setTimeout(checkTimeout, 500);
              });
            }
          }
          checkTimeout();
        })
      }

      this.logger.debug(`uuidRead等待超时处理完毕:${inputs}`);

      this.conn.removeListener(`esl::event::DTMF::${uuid}`, getTerminatorsKey);
      this.conn.removeListener(`esl::event::CHANNEL_HANGUP::${uuid}`, onCallHangup);
      if (variableName) {
        this.logger.debug(`uuidRead设置通道变量${variableName}=${inputs}`);
        if (!channelHangup) {
          await this.uuidSetvar({
            uuid,
            varname: variableName,
            varvalue: inputs
          });
        }
        else {
          this.logger.debug('需要设置通道变量，但是已经挂机了！');
        }
      }
      return inputs;
    } catch (ex) {
      this.logger.error('uuidRead', ex);
      return Promise.reject(ex);
    }
  }

  async uuidBreak(uuid: string, flag?: string) {
    try {
      const args = [uuid];
      if (flag && flag === 'all') {
        args.push(flag);
      }
      await new Promise((resolve, reject) => {
        this.conn.api('uuid_break', args, (evt) => {
          this.logger.debug('uuid_break result:', evt, evt.headers);
          const body = evt.getBody();
          if (/^\+OK/.test(body)) {
            resolve({
              success: true,
              body
            });
          } else {
            //TODO 不知道是不是有BUG,效果成功了,BODY里面确实ERR
            this.logger.warn('uuid_break:', body.split(/\s+/)[1]);
            resolve({
              success: true,
              body
            })
            //reject({success: false, reason: body.split(/\s+/)[1]});
          }
        })
      })
    }
    catch (ex) {
      return Promise.reject(ex);
    }
  }

  async uuidSetvar({ uuid, varname, varvalue }: { uuid: string, varname: string, varvalue: string }) {
    try {
      const result = await new Promise((resolve, reject) => {
        this.conn.api('uuid_setvar', [uuid, varname, varvalue], (evt) => {
          const body = evt.getBody();
          this.logger.debug('uuid_setvar result:', body);
          if (/^\+OK/.test(body)) {
            resolve({
              success: true
            });
          } else {
            reject({
              success: false,
              reason: body.split(/\s+/)[1]
            });
          }
        })
      })
      return result;
    } catch (ex) {
      return Promise.reject(ex);
    }
  }

  async uuidGetvar({ uuid, varname }: { uuid: string, varname: string }): Promise<string> {
    try {
      const result = await new Promise<string>((resolve, reject) => {
        this.conn.api('uuid_getvar', [uuid, varname], (evt) => {
          const body = evt.getBody();
          this.logger.debug(' uuid_getvar result:', body);
          resolve(body);
        })
      })
      return result;
    } catch (ex) {
      return Promise.reject(ex);
    }

  }

  /**
    * 对特定的uuid异步执行任意拨号计划应用程序。
    * 如果指定了文件名，则将其播放到通道中。
    * Usage: uuid_broadcast <uuid> <path> [aleg|bleg|both]
    * Execute an application on a chosen leg(s) with optional hangup afterwards:
    * Usage: uuid_broadcast <uuid> app[![hangup_cause]]::args [aleg|bleg|both]
    * Examples:
    * uuid_broadcast 336889f2-1868-11de-81a9-3f4acc8e505e sorry.wav both
    * uuid_broadcast 336889f2-1868-11de-81a9-3f4acc8e505e say::en\snumber\spronounced\s12345 aleg
    * uuid_broadcast 336889f2-1868-11de-81a9-3f4acc8e505e say!::en\snumber\spronounced\s12345 aleg
    * uuid_broadcast 336889f2-1868-11de-81a9-3f4acc8e505e say!user_busy::en\snumber\spronounced\s12345 aleg
    * uuid_broadcast 336889f2-1868-11de-81a9-3f4acc8e505e playback!user_busy::sorry.wav aleg
    * @param uuid
    */
  async uuidBroadcast(uuid, pathOrAppStr, legs = 'both') {
    try {
      const result = await new Promise((resolve, reject) => {
        this.conn.api('uuid_broadcast', [uuid, pathOrAppStr, legs], (evt) => {
          this.logger.debug('uuid_broadcast:', evt);
          const body = evt.getBody();
          this.logger.debug('uuid_broadcast result:', body);
          if (/^\+OK/.test(body)) {
            resolve({
              success: true
            });
          } else {
            reject({
              success: false,
              reason: body.split(/\s+/)[1]
            });
          }
        })
      })
      return result;
    }
    catch (ex) {
      console.log('uuidBroadcast error ', ex);
      return Promise.reject(ex);
    }

  }


  async wait(millisecond) {
    try {
      if (millisecond <= 0) {
        millisecond = 3 * 1000;
      }
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve();
        }, millisecond)
      })
    }
    catch (ex) {
      return Promise.reject(ex);
    }
  }

}