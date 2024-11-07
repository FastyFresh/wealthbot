import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'socks-proxy-agent': 'empty-module',
      'http': 'empty-module',
      'https': 'empty-module',
      'net': 'empty-module',
      'tls': 'empty-module',
      'crypto': 'crypto-browserify',
      'stream': 'stream-browserify',
      'zlib': 'browserify-zlib',
      'util': 'util',
      'buffer': 'buffer',
    },
  },
  define: {
    'process.env': {},
    global: 'globalThis',
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis'
      }
    }
  },
  server: {
    port: 4000,
    host: true,
    cors: true,
  }
});