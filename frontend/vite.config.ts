import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    port: 3001,
    host: true
  },
  optimizeDeps: {
    exclude: ['@rollup/rollup-linux-x64-gnu', '@rollup/rollup-linux-x64-musl']
  },
  build: {
    rollupOptions: {
      external: [
        '@rollup/rollup-linux-x64-gnu',
        '@rollup/rollup-linux-x64-musl'
      ]
    }
  }
});
