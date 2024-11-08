import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'socks-proxy-agent': path.resolve(__dirname, './src/utils/polyfills.ts'),
      'http': path.resolve(__dirname, './src/utils/polyfills.ts'),
      'https': path.resolve(__dirname, './src/utils/polyfills.ts'),
      'net': path.resolve(__dirname, './src/utils/polyfills.ts'),
      'tls': path.resolve(__dirname, './src/utils/polyfills.ts'),
      'crypto': path.resolve(__dirname, './src/utils/polyfills.ts'),
      'stream': path.resolve(__dirname, './src/utils/polyfills.ts'),
      'zlib': path.resolve(__dirname, './src/utils/polyfills.ts'),
      'util': path.resolve(__dirname, './src/utils/polyfills.ts'),
      'buffer': path.resolve(__dirname, './src/utils/polyfills.ts'),
      '@': path.resolve(__dirname, './src'),
    }
  },
  define: {
    'process.env': {},
    global: 'globalThis',
  },
  server: {
    port: 3001,
    host: true,
    cors: true,
  },
  build: {
    rollupOptions: {
      external: [
        'socks-proxy-agent',
        'http',
        'https',
        'net',
        'tls',
        'crypto',
        'stream',
        'zlib',
        'util',
        'buffer'
      ]
    }
  }
});