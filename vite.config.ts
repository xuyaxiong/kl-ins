import { defineConfig } from 'vite';
import { resolve } from 'path';
import typescript from '@rollup/plugin-typescript';

export default defineConfig({
  build: {
    target: 'node18',
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'kl-ins',
      formats: ['umd'],
      fileName: (format) => `index.js`
    },
    rollupOptions: {
      external: ['net', 'fs'],
      output: {
        globals: {
          net: 'net',
          fs: 'fs',
        }
      },
      plugins: [typescript()]
    }
  }
});
