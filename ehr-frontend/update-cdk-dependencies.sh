#!/bin/bash

# Script to update AWS CDK dependencies for Medplum v4.0.0 compatibility
echo "Updating AWS CDK dependencies for Medplum v4.0.0 compatibility..."

# Check if the CDK package exists
if [ ! -d "../packages/cdk" ]; then
  echo "Error: CDK package directory not found at ../packages/cdk"
  echo "Please run this script from the ehr-frontend directory."
  exit 1
fi

# Create backup of existing package.json
echo "Creating backup of current package.json..."
cp ../packages/cdk/package.json ../packages/cdk/package.json.bak

# Update the Node.js version requirement
echo "Updating Node.js version requirement..."
sed -i.tmp 's/"node": ">=18.0.0"/"node": ">=20.0.0"/g' ../packages/cdk/package.json
rm -f ../packages/cdk/package.json.tmp

# Update AWS CDK dependencies
echo "Updating AWS CDK dependencies..."
cd ../packages/cdk

# Store current dependency versions
CURRENT_AWS_CDK_VERSION=$(node -p "require('./package.json').dependencies['aws-cdk-lib']")
CURRENT_CDK_VERSION=$(node -p "require('./package.json').dependencies['cdk']")
CURRENT_CDK_NAG_VERSION=$(node -p "require('./package.json').dependencies['cdk-nag']")
CURRENT_CONSTRUCTS_VERSION=$(node -p "require('./package.json').dependencies['constructs']")

echo "Current CDK versions:"
echo "aws-cdk-lib: $CURRENT_AWS_CDK_VERSION"
echo "cdk: $CURRENT_CDK_VERSION" 
echo "cdk-nag: $CURRENT_CDK_NAG_VERSION"
echo "constructs: $CURRENT_CONSTRUCTS_VERSION"

# Update to latest compatible versions
echo "Updating to latest compatible versions..."
npm install --save aws-cdk-lib@latest cdk@latest cdk-nag@latest constructs@latest

# Display updated versions
NEW_AWS_CDK_VERSION=$(node -p "require('./package.json').dependencies['aws-cdk-lib']")
NEW_CDK_VERSION=$(node -p "require('./package.json').dependencies['cdk']")
NEW_CDK_NAG_VERSION=$(node -p "require('./package.json').dependencies['cdk-nag']")
NEW_CONSTRUCTS_VERSION=$(node -p "require('./package.json').dependencies['constructs']")

echo "Updated CDK versions:"
echo "aws-cdk-lib: $NEW_AWS_CDK_VERSION"
echo "cdk: $NEW_CDK_VERSION"
echo "cdk-nag: $NEW_CDK_NAG_VERSION"
echo "constructs: $NEW_CONSTRUCTS_VERSION"

# Return to original directory
cd ../../ehr-frontend

echo "CDK dependencies have been updated. Backup saved at ../packages/cdk/package.json.bak"
echo ""
echo "Next steps:"
echo "1. Run 'npm install' in the packages/cdk directory"
echo "2. Run tests to verify CDK changes: 'npm test' in the packages/cdk directory"
echo "3. Test infrastructure changes in isolation before updating Medplum" 