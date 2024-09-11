import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';
import { configDefaults } from 'vitest/config';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    server: {
      port: 8000,
    },
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['./src/setupTests.ts'],
      exclude: [...configDefaults.exclude, 'e2e/*'],
      css: true,
    },
    define: {
      'import.meta.env.VITE_AWS_REGION': JSON.stringify(env.VITE_AWS_REGION),
      'import.meta.env.VITE_SECRET_NAME': JSON.stringify(env.VITE_SECRET_NAME),
      'import.meta.env.VITE_PARAMETER_PATH': JSON.stringify(env.VITE_PARAMETER_PATH),
    },
  };
});