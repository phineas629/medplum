/** @type {import('jest').Config} */
export default {
  preset: 'ts-jest/presets/js-with-ts-esm',
  testEnvironment: 'jsdom',
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/__mocks__/fileMock.js',
    '^src/config': '<rootDir>/src/__mocks__/config.ts',
  },
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      useESM: true,
      tsconfig: {
        allowJs: true,
      }
    }],
  },
  setupFilesAfterEnv: ['<rootDir>/src/test/setup.ts'],
  testMatch: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'],
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/index.tsx',
    '!src/test/setup.ts',
  ],
  globals: {
    'import.meta': {
      env: {
        VITE_MEDPLUM_PROJECT_ID: 'test-project-id',
        VITE_MEDPLUM_GOOGLE_CLIENT_ID: 'test-google-client-id',
        VITE_MEDPLUM_RECAPTCHA_SITE_KEY: 'test-recaptcha-site-key',
      },
    },
  },
}; 