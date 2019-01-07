"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readInt32 = (view, offset) => view.getInt32(offset, true);
exports.writeInt32 = (view, offset, value) => view.setInt32(offset, value, true);
exports.readAscii = (view, from, to) => {
    let result = '';
    for (let i = from; i < to; i++) {
        result += String.fromCharCode(view.getUint8(i));
    }
    return result.replace(/\0/g, '');
};
exports.writeAscii = (view, offset, str) => {
    for (let i = 0; i < str.length; i++) {
        view.setUint8(offset + i, str.charCodeAt(i));
    }
};
exports.ensureStringLength = (str, len) => {
    if (str.length > len) {
        str = str.substr(0, len);
    }
    while (str.length < len) {
        str += '\0';
    }
    return str;
};
exports.lumpNameRegex = /[0-9A-Z\[\]_\-\\]+/;
//# sourceMappingURL=util.js.map