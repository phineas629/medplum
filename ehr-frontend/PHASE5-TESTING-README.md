# Phase 5: Testing and Verification

This document provides instructions for running tests during Phase 5 of the Medplum v4.0.0 migration.

## Prerequisites

1. Node.js v20+ (required for Medplum v4.0.0)
2. Jest and required testing libraries
3. JSDOM for browser environment tests

## Test Environment Setup

1. Install global dependencies:
   ```bash
   npm install -g jest
   ```

2. Install project dependencies:
   ```bash
   cd ehr-frontend
   npm install
   ```

3. Install testing-specific dependencies:
   ```bash
   cd core
   npm install --save-dev jest ts-jest @types/jest jest-environment-jsdom @testing-library/jest-dom @testing-library/react identity-obj-proxy
   ```

## Running Tests

### Core Package Tests

These tests validate the core functionality of the EHR frontend application.

```bash
cd ehr-frontend/core
node --experimental-vm-modules $(which jest) --config=jest.config.mjs
```

### Running All Tests

```bash
cd ehr-frontend
npm test
```

> **Note:** Some workspaces might have dependency issues (e.g., mantine-analytics-dashboard). You can skip these by filtering them out.

### Running Specific Test Suites

```bash
cd ehr-frontend/core
node --experimental-vm-modules $(which jest) --config=jest.config.mjs src/__tests__/HomePage.test.tsx
```

## Test Configuration

The Jest configuration can be found in `ehr-frontend/core/jest.config.mjs`. Key configurations include:

- **ES Module Support**: Uses `ts-jest/presets/js-with-ts-esm` for ES modules
- **JSDOM Environment**: For browser-like testing environment
- **Module Mocking**: CSS, images, and environment variables are mocked
- **Import Mocking**: The `src/config.ts` file is mocked to provide test values

## Common Issues and Solutions

### ESM Issues

If you encounter issues with ES modules, ensure:
- `"type": "module"` is in `package.json`
- Using `--experimental-vm-modules` flag when running Jest
- Proper import/export syntax in test files

### Environment Variables

Vite's `import.meta.env` variables are not available in Jest. To fix:
- Create mocks in `__mocks__` directory
- Configure moduleNameMapper in Jest config

### Missing Window Methods

JSDOM doesn't implement all browser APIs. For example:
- `window.matchMedia` needs to be mocked in `src/test/setup.ts`
- Add other browser API mocks as needed

## Next Steps

After successfully running tests and verifying core functionality:

1. Run the comprehensive test plan in `PHASE5-TESTING-PLAN.md`
2. Document any issues found in the test report
3. Fix any failures before proceeding to Phase 6 (Production Deployment)

## Troubleshooting

If tests are failing:

1. Check the error message for clues
2. Verify mock implementations match expected interfaces
3. Check for missing dependencies
4. Try running tests in isolation
5. Update test configuration if needed

## Additional Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Testing Library Documentation](https://testing-library.com/docs/)
- [TS-Jest Documentation](https://kulshekhar.github.io/ts-jest/) 