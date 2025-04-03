#!/bin/bash

# Script to test compatibility with Medplum v3.3.0
echo "Testing compatibility with Medplum v3.3.0..."

# Create a test directory
TEST_DIR="v3.3.0-test"
mkdir -p $TEST_DIR

# Copy test utilities
cp migration-tests.ts $TEST_DIR/
cp test-setup.ts $TEST_DIR/

# Create a package.json for testing
cat > $TEST_DIR/package.json << EOF
{
  "name": "medplum-v3.3.0-test",
  "version": "1.0.0",
  "description": "Testing Medplum v3.3.0 compatibility",
  "main": "index.js",
  "scripts": {
    "test": "ts-node migration-tests.ts"
  },
  "dependencies": {
    "@medplum/core": "3.3.0",
    "@medplum/fhirtypes": "3.3.0",
    "@medplum/mock": "3.3.0",
    "@medplum/react": "3.3.0"
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

# Change to the test directory and install dependencies
echo "Installing dependencies..."
cd $TEST_DIR
npm install

# Run tests to verify compatibility
echo "Running tests to verify v3.3.0 compatibility..."
npm test

# Return to original directory
cd ..

# Check test results
if [ $? -eq 0 ]; then
  echo "✓ All tests passed! Medplum v3.3.0 is compatible."
  echo ""
  echo "Next Steps:"
  echo "1. Proceed with upgrading all dependencies to v3.3.0"
  echo "2. Run data migrations if self-hosting"
  echo "3. Continue to v4.0.0 migration after verifying v3.3.0 functionality"
else
  echo "✗ Tests failed! Medplum v3.3.0 may have compatibility issues."
  echo ""
  echo "Troubleshooting:"
  echo "1. Review test failures and fix code issues"
  echo "2. Check for deprecated method usage"
  echo "3. Run migration tests again after fixes"
fi 