import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: resolve(__dirname, 'test/e2e'),
  server: {
    port: 5174,
  },
  resolve: {
    alias: {
      '/src': resolve(__dirname, 'src'),
    },
  },
});
