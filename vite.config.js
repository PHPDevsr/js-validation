import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: './src/index.js',
      name: 'jsValidation',
      formats: ['umd', 'es'],
      fileName: (format) => {
        if (format === 'umd') return 'js-validation.js';
        return 'js-validation.esm.js';
      }
    },
    outDir: 'dist',
    emptyOutDir: true,
    minify: false,
    rollupOptions: {
      output: {
        exports: 'named'
      }
    }
  }
});
