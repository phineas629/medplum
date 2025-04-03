#!/bin/bash

# Run Phase 5 core tests for Medplum v4.0.0 migration
echo "Starting Phase 5 core tests..."

# Check if Node.js v20 is available
if ! node -v | grep -q "v20"; then
  echo "Error: Node.js v20+ is required for Medplum v4.0.0"
  echo "Current version: $(node -v)"
  echo "Please install or use Node.js v20+"
  exit 1
fi

# Check for Jest
if ! which jest &> /dev/null; then
  echo "Jest not found. Installing..."
  npm install -g jest
fi

# Go to core directory
cd "$(dirname "$0")/core" || exit 1

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
  echo "Installing dependencies..."
  npm install --legacy-peer-deps
fi

# Run tests
echo "Running tests..."
node --experimental-vm-modules $(which jest) --config=jest.config.mjs

# Check exit code
if [ $? -eq 0 ]; then
  echo "✅ All tests passed!"
  exit 0
else
  echo "❌ Tests failed. Please check the output for details."
  exit 1
fi 