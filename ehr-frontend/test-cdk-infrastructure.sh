#!/bin/bash

# Script to test AWS CDK infrastructure changes in isolation
echo "Testing AWS CDK infrastructure changes for Medplum v4.0.0 compatibility..."

# Check if the CDK package exists
if [ ! -d "../packages/cdk" ]; then
  echo "Error: CDK package directory not found at ../packages/cdk"
  echo "Please run this script from the ehr-frontend directory."
  exit 1
fi

# Create a test directory for CDK synthesis
TEST_DIR="../cdk-test"
mkdir -p $TEST_DIR

# Copy necessary files to test directory
echo "Setting up test environment..."
cp -r ../packages/cdk $TEST_DIR/
cp ../packages/core/src/config.ts $TEST_DIR/

# Create a minimal test configuration file
cat > $TEST_DIR/medplum.test.config.json << EOF
{
  "name": "test",
  "stackName": "MedplumCdkTestStack",
  "accountNumber": "123456789012",
  "region": "us-east-1",
  "domainName": "test.example.com",
  "apiDomainName": "api.test.example.com",
  "apiSslCertArn": "arn:aws:acm:us-east-1:123456789012:certificate/test",
  "appDomainName": "app.test.example.com",
  "appSslCertArn": "arn:aws:acm:us-east-1:123456789012:certificate/test",
  "storageBucketName": "medplum-test-storage",
  "storageDomainName": "storage.test.example.com",
  "storageSslCertArn": "arn:aws:acm:us-east-1:123456789012:certificate/test",
  "storagePublicKey": "-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAumuI2MD8T0OVgL+XVMtc\nbFfFFdqO5nQydXGd8bWUFQSH9DZR0RxEfzljNGdyj1J0/WGIoWkBdW5yEe1feFsh\nXRn3p5I1Bm3JhpKFj7HzjdNjWRR5cv0FcQyWUYoJdFmJdR8ozEIz5lS9OxOQxEKw\nGR4n0d00GYXnNgJ5BGQnzZYJ9H0SLDZXmDexdYcCGAEKrEm+hnzEGXZMn/NeJYtQ\nTMn1QD8Nct/zZ5W0YMZ2h3GJCsd263ed+vzqRwUcSgWo9D88YI8AOaKaNL3D1F3P\n7YeFjI5QT+ULWTGFhZgW3JA2K6RP+SkUkGbpMnJkLTXsrNCrnrUz+GRVsKRx6GXv\nQwIDAQAB\n-----END PUBLIC KEY-----",
  "maxAzs": 2,
  "rdsInstances": 1,
  "rdsInstanceType": "t3.micro",
  "cacheNodeType": "cache.t2.micro",
  "desiredServerCount": 1,
  "serverImage": "medplum/medplum-server:latest",
  "serverMemory": 512,
  "serverCpu": 256
}
EOF

# Create a simple CDK app for testing
cat > $TEST_DIR/app.ts << EOF
import { App } from 'aws-cdk-lib';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { MedplumStack } from './cdk/dist/index';
import { normalizeInfraConfig } from './cdk/dist/config';

const app = new App();
const configFilePath = resolve('./medplum.test.config.json');
const configFileContent = readFileSync(configFilePath, 'utf-8');
const infraConfig = normalizeInfraConfig(JSON.parse(configFileContent));

new MedplumStack(app, infraConfig);
EOF

# Install dependencies and build
echo "Installing dependencies and building..."
cd $TEST_DIR/cdk
npm install

# Build the CDK package
echo "Building CDK package..."
npm run build

# Return to test directory
cd ..

# Install typescript and cdk globally if needed
if ! command -v tsc &> /dev/null; then
  echo "Installing TypeScript..."
  npm install -g typescript
fi

if ! command -v cdk &> /dev/null; then
  echo "Installing CDK CLI..."
  npm install -g aws-cdk
fi

# Compile the test app
echo "Compiling test app..."
tsc --skipLibCheck app.ts

# Synthesize the CDK stack to test for any errors
echo "Synthesizing CDK stack to test for errors..."
cdk synth --app "node app.js" --no-staging > synth-output.txt

# Check if synthesis was successful
if [ $? -eq 0 ]; then
  echo "✓ CDK synthesis successful. The updated CDK is compatible."
  echo "Output saved to $TEST_DIR/synth-output.txt"
else
  echo "✗ CDK synthesis failed. Please check the output for errors."
  echo "Output saved to $TEST_DIR/synth-output.txt"
  cat synth-output.txt
fi

# Return to original directory
cd ../ehr-frontend

echo ""
echo "CDK infrastructure test completed."
echo "Full test output available at $TEST_DIR/synth-output.txt" 