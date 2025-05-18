/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { copyFileSync } from 'fs';

// Copy manifest and assets to dist folder
function copyAssets() {
  return {
    name: 'copy-assets',
    closeBundle() {
      // Copy manifest
      copyFileSync('manifest.json', 'dist/manifest.json');
      
      // Copy icons
      copyFileSync('src/assets/icon16.png', 'dist/icon16.png');
      copyFileSync('src/assets/icon48.png', 'dist/icon48.png');
      copyFileSync('src/assets/icon128.png', 'dist/icon128.png');
    }
  };
}

export default defineConfig({
  plugins: [react(), copyAssets()],
  build: {
    outDir: 'dist',
    emptyOutDir: true, // Clean the dist folder before each build
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js',
        assetFileNames: '[name].[ext]'
      }
    }
  },
  server: {
    port: 3000,
    open: true
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
      ],
    },
  },
}); 