import net = require('net');
import { FreeSwitchParser, parse_header_text} from './parser';
import { FreeSwitchResponse} from './response';
import assert = require('assert');
import pkg from './package.json';

const debug = (require('debug'))('esl:response');

const trace = (require('debug'))('esl:response:trace');

class FreeSwitchParserError extends Error {
    constructor(private args) {
        super();
    }
}

const connectionListener = (call) => {
    const parser = new FreeSwitchParser(call.socket);
    call.on('CHANNEL_EXECUTE_COMPLETE', function(res) {
      let ref, unique_id;
      const application = res.body['Application'];
      const application_data = (ref = res.body['Application-Data']) != null ? ref : '';
      call.emit("CHANNEL_EXECUTE_COMPLETE " + application + " " + application_data, res);
      unique_id = res.body['Unique-ID'];
      if (unique_id != null) {
        return call.emit("CHANNEL_EXECUTE_COMPLETE " + unique_id + " " + application + " " + application_data, res);
      }
    });
    call.on('BACKGROUND_JOB', function(res) {
      const job_uuid = res.body['Job-UUID'];
      return call.emit_later("BACKGROUND_JOB " + job_uuid, {
        body: res.body._body
      });
    });
    parser.process = (headers, body) => {
      let base, base1, base10, base2, base3, base4, base5, base6, base7, base8, base9, content_type, event, exception, i, len, msg, n, ref;
      content_type = headers['Content-Type'];
      if (content_type == null) {
        if (call.stats != null) {
          if ((base = call.stats).missing_content_type == null) {
            base.missing_content_type = 0;
          }
          call.stats.missing_content_type++;
        }
        call.emit('error.missing-content-type', new FreeSwitchParserError({
          headers: headers,
          body: body
        }));
        return;
      }
      switch (content_type) {
        case 'auth/request':
          event = 'freeswitch_auth_request';
          if (call.stats != null) {
            if ((base1 = call.stats).auth_request == null) {
              base1.auth_request = 0;
            }
            call.stats.auth_request++;
          }
          break;
        case 'command/reply':
          event = 'freeswitch_command_reply';
          if (headers['Event-Name'] === 'CHANNEL_DATA') {
            body = headers;
            headers = {};
            ref = ['Content-Type', 'Reply-Text', 'Socket-Mode', 'Control'];
            for (let i = 0, len = ref.length; i < len; i++) {
              n = ref[i];
              headers[n] = body[n];
              delete body[n];
            }
          }
          if (call.stats != null) {
            if ((base2 = call.stats).command_reply == null) {
              base2.command_reply = 0;
            }
            call.stats.command_reply++;
          }
          break;
        case 'text/event-json':
          if (call.stats != null) {
            if ((base3 = call.stats).events == null) {
              base3.events = 0;
            }
            call.stats.events++;
          }
          try {
            body = body.replace(/[\x00-\x1F\x7F-\x9F]/g, '');
            body = JSON.parse(body);
          } catch (error1) {
            exception = error1;
            trace('Invalid JSON', body);
            if (call.stats != null) {
              if ((base4 = call.stats).json_parse_errors == null) {
                base4.json_parse_errors = 0;
              }
              call.stats.json_parse_errors++;
            }
            call.emit('error.invalid-json', exception);
            return;
          }
          event = body['Event-Name'];
          break;
        case 'text/event-plain':
          body = parse_header_text(body);
          event = body['Event-Name'];
          if (call.stats != null) {
            if ((base5 = call.stats).events == null) {
              base5.events = 0;
            }
            call.stats.events++;
          }
          break;
        case 'log/data':
          event = 'freeswitch_log_data';
          if (call.stats != null) {
            if ((base6 = call.stats).log_data == null) {
              base6.log_data = 0;
            }
            call.stats.log_data++;
          }
          break;
        case 'text/disconnect-notice':
          event = 'freeswitch_disconnect_notice';
          if (call.stats != null) {
            if ((base7 = call.stats).disconnect == null) {
              base7.disconnect = 0;
            }
            call.stats.disconnect++;
          }
          break;
        case 'api/response':
          event = 'freeswitch_api_response';
          if (call.stats != null) {
            if ((base8 = call.stats).api_responses == null) {
              base8.api_responses = 0;
            }
            call.stats.api_responses++;
          }
          break;
        case 'text/rude-rejection':
          event = 'freeswitch_rude_rejection';
          if (call.stats != null) {
            if ((base9 = call.stats).rude_rejections == null) {
              base9.rude_rejections = 0;
            }
            call.stats.rude_rejections++;
          }
          break;
        default:
          trace('Unhandled Content-Type', content_type);
          event = "freeswitch_" + (content_type.replace(/[^a-z]/, '_'));
          call.emit('error.unhandled-content-type', new FreeSwitchParserError({
            content_type: content_type
          }));
          if (call.stats != null) {
            if ((base10 = call.stats).unhandled == null) {
              base10.unhandled = 0;
            }
            call.stats.unhandled++;
          }
      }
      msg = {
        headers: headers,
        body: body
      };
      call.emit(event, msg);
    };
    call.emit('freeswitch_connect');
  };


class FreeSwitchServer extends net.Server {
 constructor(requestListener){
    super();
    this.on('connection', function(socket) {
        const call = new FreeSwitchResponse(socket);
        call.once('freeswitch_connect', function() {
          let exception;
          try {
            return requestListener.call(call);
          } catch (error1) {
            exception = error1;
            return call.emit('error.listener', exception);
          }
        });
        connectionListener(call);
      });
 }
}


export const ESLServer = (options, handler, report) => {
    let ref, server;
    if (options == null) {
      options = {};
    }
    if (typeof options === 'function') {
      ref = [{}, options, handler], options = ref[0], handler = ref[1], report = ref[2];
    }
    if (report == null) {
      report = options.report;
    }
    if (report == null) {
      report = function(error) {
        return debug("Server: " + error);
      };
    }
    if (options.all_events == null) {
      options.all_events = true;
    }
    if (options.my_events == null) {
      options.my_events = true;
    }
    assert.ok(handler != null, "server handler is required");
    assert.strictEqual(typeof handler, 'function', "server handler must be a function");
    server = new FreeSwitchServer(function() {
      let Unique_ID, exception;
      try {
        Unique_ID = 'Unique-ID';
        this.connect().then(function(res) {
          this.data = res.body;
          this.uuid = this.data[Unique_ID];
          if (options.my_events) {
            return this.filter(Unique_ID, this.uuid);
          }
        }).then(function() {
          return this.auto_cleanup();
        }).then(function() {
          if (options.all_events) {
            return this.event_json('ALL');
          } else {
            return this.event_json('CHANNEL_EXECUTE_COMPLETE', 'BACKGROUND_JOB');
          }
        }).then(function() {
          return handler.apply(this, arguments);
        })["catch"](function() {
          return report.apply(this, arguments);
        });
      } catch (error1) {
        exception = error1;
        report(exception);
      }
    });
    debug("Ready to start " + pkg.name + " " + pkg.version + " server.");
    return server;
  };