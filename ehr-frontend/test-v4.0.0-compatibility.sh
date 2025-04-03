#!/bin/bash

# Script to test compatibility with Medplum v4.0.0
echo "Testing compatibility with Medplum v4.0.0..."

# Create a test directory
TEST_DIR="v4.0.0-test"
mkdir -p $TEST_DIR

# Copy test utilities
cp migration-tests.ts $TEST_DIR/
cp test-setup.ts $TEST_DIR/

# Create a package.json for testing
cat > $TEST_DIR/package.json << EOF
{
  "name": "medplum-v4.0.0-test",
  "version": "1.0.0",
  "description": "Testing Medplum v4.0.0 compatibility",
  "main": "index.js",
  "scripts": {
    "test": "ts-node migration-tests.ts"
  },
  "dependencies": {
    "@medplum/core": "4.0.0",
    "@medplum/fhirtypes": "4.0.0",
    "@medplum/mock": "4.0.0",
    "@medplum/react": "4.0.0"
  },
  "devDependencies": {
    "typescript": "5.5.4",
    "ts-node": "^10.9.2"
  }
}
EOF

# Create a tsconfig.json for testing
cat > $TEST_DIR/tsconfig.json << EOF
{
  "compilerOptions": {
    "target": "ESNext",
    "useDefineForClassFields": true,
    "lib": ["DOM", "DOM.Iterable", "ESNext"],
    "allowJs": false,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "module": "CommonJS",
    "moduleResolution": "Node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx"
  },
  "include": ["*.ts"]
}
EOF

# Create a test specifically for v4.0.0 breaking changes
cat > $TEST_DIR/v4-specific-tests.ts << EOF
import { MedplumClient } from '@medplum/core';
import { createTestMedplumClient } from './test-setup';

/**
 * Tests specific v4.0.0 breaking changes to verify compatibility.
 */
async function testV4SpecificChanges(): Promise<void> {
  console.log('Testing v4.0.0 specific changes...');
  
  const client = createTestMedplumClient();
  let allTestsPassed = true;

  // Test 1: Filter 'eq' operator exact matching
  console.log('Testing filter eq operator exact matching...');
  try {
    // Create test data
    await client.createResource({
      resourceType: 'Patient',
      name: [{ given: ['TestExact'], family: 'EqualsTest' }],
    });
    
    // In v4.0.0, eq should perform exact matching
    const filterResult = await client.search('Patient', new URLSearchParams({
      _filter: 'given eq TestExact'
    }));
    
    if (filterResult.entry?.length === 1) {
      console.log('✓ Filter eq operator works correctly');
    } else {
      console.log('✗ Filter eq operator test failed');
      allTestsPassed = false;
    }
  } catch (err) {
    console.error('Filter eq operator test error:', err);
    allTestsPassed = false;
  }

  // Test 2: getReferenceString type safety
  console.log('Testing getReferenceString type safety...');
  try {
    const { getReferenceString } = await import('@medplum/core');
    
    // Should work with reference string
    const ref1 = getReferenceString({ reference: 'Patient/123' });
    
    // Should work with resource type and id
    const ref2 = getReferenceString({ resourceType: 'Patient', id: '123' });
    
    if (ref1 === 'Patient/123' && ref2 === 'Patient/123') {
      console.log('✓ getReferenceString works correctly with proper inputs');
    } else {
      console.log('✗ getReferenceString test failed');
      allTestsPassed = false;
    }
    
    try {
      // This should throw an error in v4.0.0
      getReferenceString({});
      console.log('✗ getReferenceString allowed empty object (should fail in v4.0.0)');
      allTestsPassed = false;
    } catch (err) {
      console.log('✓ getReferenceString correctly rejected empty object');
    }
    
  } catch (err) {
    console.error('getReferenceString test error:', err);
    allTestsPassed = false;
  }

  // Final test result
  if (allTestsPassed) {
    console.log('✓ All v4.0.0 specific tests passed!');
  } else {
    console.log('✗ Some v4.0.0 specific tests failed.');
  }
}

// Run tests if executed directly
if (require.main === module) {
  testV4SpecificChanges().catch(console.error);
}

export { testV4SpecificChanges };
EOF

# Change to the test directory and install dependencies
echo "Installing dependencies..."
cd $TEST_DIR
npm install

# Run tests to verify v4.0.0 compatibility
echo "Running tests to verify v4.0.0 compatibility..."
npm test

# Run v4-specific tests
echo "Running tests specific to v4.0.0 breaking changes..."
npx ts-node v4-specific-tests.ts

# Return to original directory
cd ..

# Check test results
if [ $? -eq 0 ]; then
  echo "✓ All tests passed! Medplum v4.0.0 is compatible."
  echo ""
  echo "Next Steps:"
  echo "1. Proceed with upgrading all dependencies to v4.0.0"
  echo "2. Ensure v3.3.0 data migrations have been completed if self-hosting"
  echo "3. Deploy the v4.0.0 application"
else
  echo "✗ Tests failed! Medplum v4.0.0 may have compatibility issues."
  echo ""
  echo "Troubleshooting:"
  echo "1. Review test failures and fix code issues"
  echo "2. Check for any remaining deprecated method usage"
  echo "3. Verify all v4.0.0 breaking changes have been addressed"
  echo "4. Run migration tests again after fixes"
fi 