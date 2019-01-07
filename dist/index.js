"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("./util");
exports.load = (data) => {
    const view = new DataView(data.buffer);
    const header = getHeader(view);
    const type = header.typeId;
    const infoTable = getInfoTable(view, header);
    const getLumpData = (info) => data.slice(info.filePosition, info.filePosition + info.size);
    const lumps = infoTable.map(info => ({
        name: info.name,
        data: getLumpData(info)
    }));
    return { type, lumps };
};
exports.save = (wad) => {
    const headerSize = 12;
    const infoSize = wad.lumps.length * 16;
    const lumpSize = wad.lumps.reduce((sum, lump) => sum + lump.data.length, 0);
    const wadSize = headerSize + lumpSize + infoSize;
    const lumpsOffset = headerSize;
    const infoTableOffset = lumpsOffset + lumpSize;
    const data = new Uint8Array(wadSize);
    const view = new DataView(data.buffer);
    //header
    util_1.writeAscii(view, 0, util_1.ensureStringLength(wad.type, 4));
    util_1.writeInt32(view, 4, wad.lumps.length);
    util_1.writeInt32(view, 8, infoTableOffset);
    let filePosition = headerSize;
    wad.lumps.forEach((lump, i) => {
        if (!util_1.lumpNameRegex.test(lump.name))
            throw Error(`Bad lump name: ${lump.name}`);
        const infoOffset = 16 * i + infoTableOffset;
        //info table entry
        util_1.writeInt32(view, infoOffset, filePosition);
        util_1.writeInt32(view, infoOffset + 4, lump.data.length);
        util_1.writeAscii(view, infoOffset + 8, util_1.ensureStringLength(lump.name, 8));
        //lump
        data.set(lump.data, filePosition);
        filePosition += lump.data.length;
    });
    return data;
};
const getHeader = (view) => {
    const typeId = util_1.readAscii(view, 0, 4);
    const numberOfLumps = util_1.readInt32(view, 4);
    const infoTableOffset = util_1.readInt32(view, 8);
    return {
        typeId,
        numberOfLumps,
        infoTableOffset
    };
};
const getInfo = (view, offset, id) => {
    const filePosition = util_1.readInt32(view, offset);
    const size = util_1.readInt32(view, offset + 4);
    const name = util_1.readAscii(view, offset + 8, offset + 16);
    return {
        id,
        filePosition,
        size,
        name
    };
};
const getInfoTable = (view, header) => {
    const infoTable = [];
    for (let i = 0; i < header.numberOfLumps; i++) {
        const offset = 16 * i + header.infoTableOffset;
        infoTable.push(getInfo(view, offset, i));
    }
    return infoTable;
};
//# sourceMappingURL=index.js.map