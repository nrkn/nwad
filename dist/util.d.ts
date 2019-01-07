export declare const readInt32: (view: DataView, offset: number) => number;
export declare const writeInt32: (view: DataView, offset: number, value: number) => void;
export declare const readAscii: (view: DataView, from: number, to: number) => string;
export declare const writeAscii: (view: DataView, offset: number, str: string) => void;
export declare const ensureStringLength: (str: string, len: number) => string;
export declare const lumpNameRegex: RegExp;
