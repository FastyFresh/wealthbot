
import { Buffer } from 'buffer';
import process from 'process';

// Polyfill Buffer for the browser environment
if (typeof window !== 'undefined') {
  window.Buffer = Buffer;
  window.global = window;
  window.process = process;
}

// Initialize process.env if it doesn't exist
if (!process.env) {
  process.env = {};
}

// Set default process values
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
process.browser = true;
process.version = process.version || '';
process.versions = process.versions || {};

// Add nextTick functionality
if (!process.nextTick) {
  process.nextTick = function(callback: Function, ...args: any[]) {
    Promise.resolve().then(() => callback(...args));
  };
}

// Export process for use in other files
export { process };

// Export a function to check if polyfills are initialized
export function checkPolyfills() {
  return {
    hasBuffer: typeof window !== 'undefined' && !!window.Buffer,
    hasProcess: typeof window !== 'undefined' && !!window.process,
    hasGlobal: typeof window !== 'undefined' && !!window.global,
  };
}
