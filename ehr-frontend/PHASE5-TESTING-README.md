# Phase 5: Testing and Verification

This document provides instructions for running tests during Phase 5 of the Medplum v4.0.0 migration.

## Prerequisites

1. Node.js v20+ (required for Medplum v4.0.0)
2. Jest/Vitest and required testing libraries
3. JSDOM for browser environment tests

## Test Environment Setup

1. Install global dependencies:
   ```bash
   npm install -g jest vitest
   ```

2. Install project dependencies:
   ```bash
   cd ehr-frontend
   npm install
   ```

3. Install testing-specific dependencies:
   ```bash
   cd core
   npm install --save-dev jest ts-jest vitest @types/jest jest-environment-jsdom @testing-library/jest-dom @testing-library/react identity-obj-proxy
   ```

## Running Tests

### Using Vitest (Recommended for ES Modules)

Vitest provides better support for ES modules and is recommended for testing in this project:

```bash
cd ehr-frontend/core
npx vitest run
```

### Using Jest with ES Module Support

If you prefer to use Jest directly, you'll need to use the experimental VM modules flag:

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
npx vitest run src/__tests__/HomePage.test.tsx
```

## Test Configuration

The test configuration can be found in:

1. **Jest config**: `ehr-frontend/core/jest.config.mjs`
2. **Vitest config**: `ehr-frontend/core/vitest.config.ts`

Key configurations include:

- **ES Module Support**: Uses proper configuration for ES modules
- **JSDOM Environment**: For browser-like testing environment
- **Module Mocking**: CSS, images, and environment variables are mocked
- **Import Mocking**: The `src/config.ts` file is mocked to provide test values

## Writing Tests for ES Modules

When writing tests for ES Modules in our codebase, follow these guidelines:

1. **Use Vitest mocking instead of Jest**:
   ```typescript
   import { vi } from 'vitest';
   
   vi.mock('./component', () => ({
     Component: () => <div>Mocked Component</div>
   }));
   ```

2. **Import testing utilities from Vitest**:
   ```typescript
   import { describe, test, expect, vi } from 'vitest';
   ```

3. **Import DOM testing utilities**:
   ```typescript
   import '@testing-library/jest-dom';
   import { render, screen } from '@testing-library/react';
   ```

4. **Mock environment variables**:
   Create files in `__mocks__` folders to provide environment variables.

## Common Issues and Solutions

### ESM Issues

If you encounter issues with ES modules, ensure:
- `"type": "module"` is in `package.json`
- Using Vitest OR using `--experimental-vm-modules` flag with Jest
- Proper import/export syntax in test files

### Environment Variables

Vite's `import.meta.env` variables are not available in tests. To fix:
- Create mocks in `__mocks__` directory
- Configure moduleNameMapper in test config

### Missing Window Methods

JSDOM doesn't implement all browser APIs. For example:
- `window.matchMedia` needs to be mocked in `src/test/setup.ts`
- Add other browser API mocks as needed

### Mocking Difficulties with ESM

If you're having trouble with Jest mocks in ES modules:
1. Switch to Vitest which has better ESM support
2. Use the vi.mock() approach with a factory function
3. For complex components, create simplified test components

## Medplum v4.0.0 API Testing

We've added specific tests for the Medplum v4.0.0 API including:

1. CRUD operations on resources
2. Search functionality with exact matching
3. Value set expansion (formerly searchValueSet)
4. Batch operations
5. Reference handling

These tests verify compatibility with the new API version.

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

- [Vitest Documentation](https://vitest.dev/)
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Testing Library Documentation](https://testing-library.com/docs/)
- [TS-Jest Documentation](https://kulshekhar.github.io/ts-jest/) 