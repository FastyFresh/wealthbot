
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// Try to use a high port number to avoid conflicts
const BASE_PORT = 8080;

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'stream': 'stream-browserify',
      'crypto': 'crypto-browserify',
      'util': 'util',
      'buffer': 'buffer',
      'process': 'process/browser',
    }
  },
  define: {
    'process.env': process.env,
    global: 'globalThis',
    'process.env.NODE_DEBUG': JSON.stringify(''),
    Buffer: ['buffer', 'Buffer'],
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis'
      }
    },
    include: [
      'buffer',
      'process',
      'util',
      'stream-browserify',
      'crypto-browserify',
      '@tensorflow/tfjs',
      'technicalindicators',
      '@solana/web3.js',
      '@drift-labs/sdk',
      '@project-serum/anchor',
      'lightweight-charts'
    ]
  },
  server: {
    port: BASE_PORT,
    strictPort: false, // Allow Vite to find next available port
    host: true,
    cors: true,
    hmr: {
      overlay: true,
      port: BASE_PORT
    },
    watch: {
      usePolling: true
    }
  },
  build: {
    target: 'esnext',
    sourcemap: true,
    commonjsOptions: {
      transformMixedEsModules: true
    },
    rollupOptions: {
      external: [
        'socks-proxy-agent',
        'http',
        'https',
        'net',
        'tls',
        'zlib'
      ]
    }
  }
});
