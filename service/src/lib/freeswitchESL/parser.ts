
import querystring = require('querystring');
import util = require('util');

class FreeSwitchParserError extends Error {
    constructor(private error, private buffer) {
        super();
    }
}

export const parse_header_text = (header_text) => {
    let fn, header_lines, headers, i, len, line, name, ref;
    header_lines = header_text.split('\n');
    headers = {};
    fn = function (line) {
        var name, ref, value;
        ref = line.split(/: /, 2), name = ref[0], value = ref[1];
        return headers[name] = value;
    };
    for (i = 0, len = header_lines.length; i < len; i++) {
        line = header_lines[i];
        fn(line);
    }
    if (((ref = headers['Reply-Text']) != null ? ref[0] : void 0) === '%') {
        for (name in headers) {
            headers[name] = querystring.unescape(headers[name]);
        }
    }
    return headers;
};

export class FreeSwitchParser {
    body_length: number;
    buffer: Buffer;
    buffer_length: number;
    headers:any;
    public process:any;
    constructor(private socket: any) {
        this.body_length = 0;
        this.buffer = new Buffer(0);
        this.buffer_length = 0;
        this.socket.on('data', (function (_this) {
            return function (data) {
                return _this.on_data(data);
            };
        })(this));
        this.socket.on('end', (function (_this) {
            return function () {
                return _this.on_end();
            };
        })(this));
    }

    capture_body(data) {
        var body;
        this.buffer_length += data.length;
        this.buffer = Buffer.concat([this.buffer, data], this.buffer_length);
        if (this.buffer_length < this.body_length) {
            return;
        }
        body = this.buffer.toString('utf8', 0, this.body_length);
        this.buffer = this.buffer.slice(this.body_length);
        this.buffer_length -= this.body_length;
        this.body_length = 0;
        this.process(this.headers, body);
        this.headers = {};
        this.capture_headers(new Buffer(0));
    };

    capture_headers(data) {
        var header_end, header_text;
        this.buffer_length += data.length;
        this.buffer = Buffer.concat([this.buffer, data], this.buffer_length);
        header_end = this.buffer.indexOf('\n\n');
        if (header_end < 0) {
            return;
        }
        header_text = this.buffer.toString('utf8', 0, header_end);
        this.buffer = this.buffer.slice(header_end + 2);
        this.buffer_length -= header_end + 2;
        this.headers = parse_header_text(header_text);
        if (this.headers["Content-Length"]) {
            this.body_length = this.headers["Content-Length"];
            this.capture_body(new Buffer(0));
        } else {
            this.process(this.headers);
            this.headers = {};
            this.capture_headers(new Buffer(0));
        }
    };

    on_data(data) {
        if (this.body_length > 0) {
            return this.capture_body(data);
        } else {
            return this.capture_headers(data);
        }
    };

    on_end() {
        if (this.buffer_length > 0) {
            this.socket.emit('error', new FreeSwitchParserError('Buffer is not empty at end of stream', this.buffer));
        }
    };
}