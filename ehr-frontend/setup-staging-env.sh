#!/bin/bash

# Script to set up a staging environment for migration testing
echo "Setting up staging environment for migration testing..."

# Create a staging directory
STAGING_DIR="./migration-staging"
mkdir -p $STAGING_DIR

# Copy only necessary files to staging directory
echo "Copying core files to staging environment..."
mkdir -p $STAGING_DIR/core
cp -r ./core/src $STAGING_DIR/core/
cp ./core/package.json $STAGING_DIR/core/
cp ./core/tsconfig.json $STAGING_DIR/core/
cp ./core/vite.config.ts $STAGING_DIR/core/

# Copy package.json and tsconfig.json
echo "Copying workspace configuration..."
cp ./package.json $STAGING_DIR/
cp ./tsconfig.json $STAGING_DIR/

# Create a README file with instructions
cat > $STAGING_DIR/README.md << EOF
# Migration Staging Environment

This environment is used to test Medplum upgrades from v3.2.7 to v4.0.0.

## Testing Process

1. Run the tests to verify current functionality:
   \`\`\`
   npm test
   \`\`\`

2. Update package.json to target v3.3.0
   \`\`\`
   npm install @medplum/core@3.3.0 @medplum/react@3.3.0 @medplum/fhirtypes@3.3.0
   \`\`\`

3. Run the tests again to verify v3.3.0 compatibility:
   \`\`\`
   npm test
   \`\`\`

4. Update package.json to target v4.0.0
   \`\`\`
   npm install @medplum/core@4.0.0 @medplum/react@4.0.0 @medplum/fhirtypes@4.0.0
   \`\`\`

5. Run the tests again to verify v4.0.0 compatibility:
   \`\`\`
   npm test
   \`\`\`
EOF

# Copy the test files
echo "Setting up test environment..."
cp ./test-setup.ts $STAGING_DIR/
cp ./migration-tests.ts $STAGING_DIR/
cp ./find-deprecated-methods.sh $STAGING_DIR/

# Create a simple package.json for the staging environment
cat > $STAGING_DIR/package.json << EOF
{
  "name": "medplum-migration-staging",
  "version": "1.0.0",
  "description": "Staging environment for Medplum migration testing",
  "main": "index.js",
  "scripts": {
    "test": "ts-node migration-tests.ts",
    "find-deprecated": "./find-deprecated-methods.sh"
  },
  "dependencies": {
    "@medplum/core": "3.2.7",
    "@medplum/fhirtypes": "3.2.7",
    "@medplum/mock": "3.2.7",
    "@medplum/react": "3.2.7"
  },
  "devDependencies": {
    "typescript": "5.5.4",
    "ts-node": "^10.9.2"
  }
}
EOF

# Create a basic tsconfig.json
cat > $STAGING_DIR/tsconfig.json << EOF
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
  "include": ["./*.ts", "core/src/**/*.ts", "core/src/**/*.tsx"]
}
EOF

echo "Staging environment setup complete at $STAGING_DIR"
echo "To use the staging environment, run:"
echo "  cd $STAGING_DIR"
echo "  npm install"
echo "  npm test" 