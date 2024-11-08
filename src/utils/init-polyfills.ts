// Initialize Buffer
import { Buffer } from 'buffer';
import process from 'process';

declare global {
    interface Window {
        Buffer: typeof Buffer;
        process: typeof process;
        global: typeof globalThis;
    }
}

// Initialize global objects
if (typeof window !== 'undefined') {
    // Set up Buffer
    window.Buffer = window.Buffer || Buffer;

    // Set up process
    window.process = window.process || process;

    // Set up global
    window.global = window.global || window;

    // Additional polyfills
    const globalAny: any = global;
    if (typeof globalAny.Buffer === 'undefined') {
        globalAny.Buffer = Buffer;
    }
    if (typeof globalAny.process === 'undefined') {
        globalAny.process = process;
    }
}

console.log('Polyfills initialized:', {
    hasBuffer: typeof window !== 'undefined' && !!window.Buffer,
    hasProcess: typeof window !== 'undefined' && !!window.process,
    hasGlobal: typeof window !== 'undefined' && !!window.global
});

export {};