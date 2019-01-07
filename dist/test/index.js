"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
const fs_1 = require("fs");
const __1 = require("..");
const testWadData = fs_1.readFileSync('./src/test/fixtures/doomba.wad');
describe('nwad', () => {
    it('loads a WAD', () => {
        const wad = __1.load(testWadData);
        assert.strictEqual(wad.type, 'PWAD');
        assert.strictEqual(wad.lumps.length, 11);
    });
    it('copies lumps so underlying buffer is not whole file', () => {
        const wad = __1.load(testWadData);
        wad.lumps.forEach(lump => {
            assert.strictEqual(lump.data.byteLength, lump.data.buffer.byteLength);
        });
    });
    it('saves a WAD', () => {
        const wad = __1.load(testWadData);
        const outWadData = __1.save(wad);
        assert.deepEqual(outWadData.buffer, testWadData.buffer);
    });
    it('ensures string length for lump names', () => {
        const lump = {
            name: 'GOODLUMP1',
            data: new Uint8Array([1, 2, 3])
        };
        const expect = {
            name: 'GOODLUMP',
            data: new Uint8Array([1, 2, 3])
        };
        const wad = {
            type: 'PWAD',
            lumps: [lump]
        };
        const wadData = __1.save(wad);
        const outWad = __1.load(wadData);
        assert.deepEqual(outWad.lumps[0], expect);
    });
    it('enforces valid lump names', () => {
        const lump = {
            name: 'bad lump name',
            data: new Uint8Array([1, 2, 3])
        };
        const wad = {
            type: 'PWAD',
            lumps: [lump]
        };
        assert.throws(() => __1.save(wad));
    });
});
//# sourceMappingURL=index.js.map