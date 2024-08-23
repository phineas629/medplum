import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: 'index.js', // or your main entry file
      formats: ['es']
    },
    rollupOptions: {
      external: ['react', 'react-native']
    }
  }
});