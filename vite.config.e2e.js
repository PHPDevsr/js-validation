import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: resolve(import.meta.dirname, 'test/e2e'),
  server: {
    port: 5174,
  },
  resolve: {
    alias: {
      '/src': resolve(import.meta.dirname, 'src'),
    },
  },
});
