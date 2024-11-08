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
      'buffer': 'buffer',
      'process': 'process/browser',
      'stream': 'stream-browserify',
      'util': 'util',
      'crypto': 'crypto-browserify'
    }
  },
  define: {
    'process.env': {},
    'global': 'globalThis',
    'Buffer': ['buffer', 'Buffer']
  },
  optimizeDeps: {
    include: [
      'buffer',
      'process',
      'util',
      'stream-browserify',
      'crypto-browserify',
      '@tensorflow/tfjs',
      'technicalindicators'
    ],
    esbuildOptions: {
      define: {
        global: 'globalThis'
      }
    }
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
    },
    sourcemap: true,
    commonjsOptions: {
      transformMixedEsModules: true
    }
  }
});