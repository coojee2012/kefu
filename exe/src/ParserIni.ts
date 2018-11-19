
const ignore = {
    ';': true,
    '#': true
};

export class ParserIni {
    constructor() {

        if (!String.prototype.trim) {
            String.prototype.trim = function () {
                return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
            };
        }

        if (!String.prototype.dequote) {
            String.prototype.dequote = function (q) {
                if (this.substr(0, 1) === q && this.substr((this.length - 1), 1) === q) {
                    return this.substr(1, (this.length - 2)).trim();
                } else {
                    return this;
                }
            };
        }

    }

    isNumber(input) {
        return (1 * input === parseFloat(input)) || (1 * input === parseInt(input));
    }

    /**
     * Checks if line is "empty" or comment
     * @param string line Input
     * @returns boolean
     */
    isEmpty(line) {
        return (line.length === 0 || ignore[line.substr(0, 1)] === true);
    }

    /**
     * Trim, remove quotes, returns net value
     * @param string string Input value
     * @returns string
     */
    sanitize(string) {
        let out = [], val;
        for (let c = 0; c < string.length; c++) {
            if (ignore[string[c]]) {
                break;
            }
            out.push(string[c]);
        }
        val = out.join('').trim().dequote('\'').dequote('"');
        if ('' + parseFloat(val) === val) {
            return parseFloat(val);
        } else if ('' + parseInt(val) === val) {
            return parseInt(val);
        } else {
            return val;
        }
    }


    readline(line) {
        line = line.trim();
        let out = {
            type: null, // section|item
            key: null,  // keyname
            value: null // value (without quotes if found)
        },
            sectionOpen = line.indexOf('['),
            sectionClose = line.indexOf(']'),
            indexEquals = line.indexOf('='),
            len = line.length,
            multivalue = line.indexOf('[]') > 0;

        if (multivalue === true) {
            out = {
                type: 'multi-value',
                key: line.substr(0, (indexEquals - 1)),
                value: line.substr((indexEquals + 1), len - (indexEquals + 1))
            };
            if (out.key.indexOf('[]') > 0) {
                out.key = out.key.split('[]')[0];
            }
        } else if (sectionOpen > -1 && (sectionClose - sectionOpen) > 0) {
            out = {
                type: 'section',
                key: line.substr((sectionOpen + 1), (sectionClose - sectionOpen) - 1),
                value: ''
            };
        } else {
            out = {
                type: 'item',
                key: line.substr(0, (indexEquals - 1)),
                value: line.substr((indexEquals + 1), len - (indexEquals + 1))
            };
        }
        if (out.key.length === 0) {
            out.type = 'empty';
        }

        out.value = this.sanitize(out.value);
        return out;
    }

    parse(input) {
        let _loop = 0, out = {}, details = {},
            currentSection = '',
            lines = input.split('\n');
        for (let i in lines) {
            if (this.isEmpty(lines[i])) {
                delete lines[i];
            } else {
                ++_loop;
                details = this.readline(lines[i]);

                if (typeof details.value !== 'function') {
                    if (details.key) {
                        details.key = details.key.trim();
                    }
                    if (details.type === 'section') {
                        currentSection = details.key;
                        out[currentSection] = {};
                    } else if (details.type === 'item') {
                        out[currentSection][details.key] = details.value;
                    } else if (details.type === 'multi-value') {
                        if (!out[currentSection][details.key]) {
                            out[currentSection][details.key] = []; // create array
                        }
                        if (typeof details.value !== 'function') {
                            out[currentSection][details.key].push(details.value);
                        }
                    } else if (details.type === 'empty') {
                        _loop = _loop - 1;
                    } else {
                        throw new Error('Invalid line data type type in line no. ' + i);
                    }
                    delete lines[i];
                }
            }
        }
        return (_loop > 0) ? out : false;
    }
}