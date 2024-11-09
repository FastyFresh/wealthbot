
// Initialize Buffer
import { Buffer } from 'buffer';
import process from 'process';

declare global {
    interface Window {
        Buffer: typeof Buffer;
        process: typeof process;
        global: typeof globalThis;
        solana?: {
            isPhantom?: boolean;
            connect: () => Promise<{ publicKey: { toString: () => string } }>;
            disconnect: () => Promise<void>;
            signTransaction: (transaction: any) => Promise<any>;
            signAllTransactions: (transactions: any[]) => Promise<any[]>;
            request: (params: { method: string; params: any }) => Promise<any>;
            on: (event: string, callback: (args: any) => void) => void;
            off: (event: string, callback: (args: any) => void) => void;
        };
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

    // Log initialization status
    console.log('Polyfills initialized:', {
        hasBuffer: !!window.Buffer,
        hasProcess: !!window.process,
        hasGlobal: !!window.global,
        hasPhantom: !!window.solana?.isPhantom
    });

    // Set up Phantom wallet detection
    const checkForPhantom = () => {
        if ('solana' in window && window.solana.isPhantom) {
            console.log('Phantom wallet detected');
            window.dispatchEvent(new Event('phantom-ready'));
        } else {
            console.log('Phantom wallet not detected');
        }
    };

    // Check for Phantom wallet
    if (document.readyState === 'complete') {
        checkForPhantom();
    } else {
        window.addEventListener('load', checkForPhantom);
    }

    // Handle network changes
    if (window.solana) {
        window.solana.on('networkChanged', (network: string) => {
            console.log('Solana network changed:', network);
            window.dispatchEvent(new CustomEvent('solana-network-change', { detail: network }));
        });

        window.solana.on('connect', () => {
            console.log('Phantom wallet connected');
            window.dispatchEvent(new Event('solana-connected'));
        });

        window.solana.on('disconnect', () => {
            console.log('Phantom wallet disconnected');
            window.dispatchEvent(new Event('solana-disconnected'));
        });
    }
}

export {};
