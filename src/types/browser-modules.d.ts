declare module 'stream-browserify' {
    const content: any;
    export = content;
}

declare module 'crypto-browserify' {
    const content: any;
    export = content;
}

declare module 'buffer' {
    interface BufferConstructor {
        new(str: string, encoding?: string): Buffer;
        new(size: number): Buffer;
        new(array: Uint8Array): Buffer;
        new(buffer: Buffer): Buffer;
        alloc(size: number): Buffer;
        from(arrayBuffer: ArrayBuffer): Buffer;
        from(str: string, encoding?: string): Buffer;
        isBuffer(obj: any): boolean;
        concat(list: Buffer[], totalLength?: number): Buffer;
        allocUnsafe(size: number): Buffer;
        poolSize: number;
    }

    interface Buffer extends Uint8Array {
        write(string: string, offset?: number, length?: number, encoding?: string): number;
        toString(encoding?: string, start?: number, end?: number): string;
        toJSON(): { type: 'Buffer'; data: number[] };
        equals(otherBuffer: Buffer): boolean;
        compare(otherBuffer: Buffer): number;
        copy(targetBuffer: Buffer, targetStart?: number, sourceStart?: number, sourceEnd?: number): number;
        slice(start?: number, end?: number): Buffer;
        writeUIntLE(value: number, offset: number, byteLength: number): number;
        writeUIntBE(value: number, offset: number, byteLength: number): number;
        writeIntLE(value: number, offset: number, byteLength: number): number;
        writeIntBE(value: number, offset: number, byteLength: number): number;
        readUIntLE(offset: number, byteLength: number): number;
        readUIntBE(offset: number, byteLength: number): number;
        readIntLE(offset: number, byteLength: number): number;
        readIntBE(offset: number, byteLength: number): number;
    }

    export const Buffer: BufferConstructor;
    export type { Buffer };
}

declare module 'process' {
    const process: {
        env: Record<string, string | undefined>;
        browser: boolean;
        version: string;
        platform: string;
    };
    export = process;
}