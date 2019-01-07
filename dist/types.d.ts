export declare type WadType = 'IWAD' | 'PWAD';
export interface Wad {
    type: WadType;
    lumps: Lump[];
}
export interface Lump {
    name: string;
    data: Uint8Array;
}
