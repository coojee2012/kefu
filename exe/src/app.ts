import { FCTrade } from './FCTrade';
if (!String.prototype.trim) {
    String.prototype.trim = function () {
        return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
    };
}

if (!String.prototype.dequote) {
    String.prototype.dequote = function (q) {
        if (this.substr(0, 1) === q && this.substr((this.length-1), 1) === q) {
            return this.substr(1, (this.length-2)).trim();
        } else {
            return this;
        }
    };
}

const run = async () => {
    try {
        const autoTrade = new FCTrade();
        await autoTrade.run2();

    } catch (ex) {
        console.error('run error:', ex);
    }
};

run()
    .then(
        () => {
            console.log('END!')
        }
    )
    .catch(err => {
        console.error('run error:', err);
    })