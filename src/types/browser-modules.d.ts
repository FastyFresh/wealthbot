
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

interface Window {
    solana?: {
        isPhantom?: boolean;
        connect: () => Promise<{ publicKey: { toString: () => string } }>;
        disconnect: () => Promise<void>;
        signTransaction: <T>(transaction: T) => Promise<T>;
        signAllTransactions: <T>(transactions: T[]) => Promise<T[]>;
        request: (params: { method: string; params: any }) => Promise<any>;
        on: (event: string, callback: (args: any) => void) => void;
        off: (event: string, callback: (args: any) => void) => void;
        publicKey?: { toString(): string };
    };
    Buffer: typeof Buffer;
    process: typeof process;
}

declare module 'lightweight-charts' {
    export * from 'lightweight-charts';
}

declare module '@tensorflow/tfjs' {
    export * from '@tensorflow/tfjs';
}

declare module 'technicalindicators' {
    export * from 'technicalindicators';
}

declare module '@drift-labs/sdk' {
    export * from '@drift-labs/sdk';
}

declare module '@project-serum/anchor' {
    export * from '@project-serum/anchor';
}

declare module '@solana/web3.js' {
    export * from '@solana/web3.js';
}

declare module '@solana/spl-token' {
    export * from '@solana/spl-token';
}

declare module '*.svg' {
    const content: any;
    export default content;
}

declare module '*.png' {
    const content: any;
    export default content;
}

declare module '*.jpg' {
    const content: any;
    export default content;
}

declare module '*.json' {
    const content: any;
    export default content;
}
