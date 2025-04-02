#!/bin/bash

# Script to update Node.js to v20+ for Medplum v4.0.0 compatibility

echo "Checking current Node.js and npm versions..."
current_node_version=$(node -v)
current_npm_version=$(npm -v)
echo "Current Node.js version: $current_node_version"
echo "Current npm version: $current_npm_version"

# Verify if Node.js version is already v20+
if [[ $current_node_version == v20* ]] || [[ $current_node_version == v21* ]]; then
  echo "Node.js version is already v20+. No update needed."
else
  echo "Node.js version needs to be updated to v20+ for Medplum v4.0.0 compatibility."
  
  # Check if nvm is installed
  if command -v nvm &> /dev/null; then
    echo "Using nvm to install Node.js v20..."
    nvm install 20
    nvm use 20
  else
    # Different instructions based on OS
    if [[ "$OSTYPE" == "darwin"* ]]; then
      echo "macOS detected. Please use one of the following methods to update Node.js:"
      echo "1. Using Homebrew:"
      echo "   brew update"
      echo "   brew install node@20"
      echo "   brew link node@20"
      echo ""
      echo "2. Using nvm (recommended):"
      echo "   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash"
      echo "   nvm install 20"
      echo "   nvm use 20"
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
      echo "Linux detected. Please use one of the following methods to update Node.js:"
      echo "1. Using apt (Ubuntu/Debian):"
      echo "   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -"
      echo "   sudo apt-get install -y nodejs"
      echo ""
      echo "2. Using nvm (recommended):"
      echo "   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash"
      echo "   nvm install 20"
      echo "   nvm use 20"
    elif [[ "$OSTYPE" == "msys"* ]] || [[ "$OSTYPE" == "cygwin"* ]]; then
      echo "Windows detected. Please download and install Node.js v20 from:"
      echo "https://nodejs.org/en/download/"
    fi
  fi
fi

# Verify if npm version is already 10+
if [[ $current_npm_version == 10* ]] || [[ $current_npm_version == 11* ]]; then
  echo "npm version is already 10+. No update needed."
else
  echo "npm version needs to be updated to 10+ for Medplum v4.0.0 compatibility."
  echo "Running: npm install -g npm@10"
  npm install -g npm@10
fi

# Check versions after update
echo "Verifying versions after update..."
echo "Node.js version: $(node -v)"
echo "npm version: $(npm -v)"

# Update package.json files to require Node.js v20+
echo "Updating package.json files to specify Node.js v20+ requirement..."

# Update main package.json engines field
if [ -f "./package.json" ]; then
  # Use temporary file for sed compatibility across operating systems
  sed -i.bak 's/"node": ">=18.0.0"/"node": ">=20.0.0"/g' ./package.json
  rm -f ./package.json.bak
  echo "Updated Node.js engine requirement in main package.json"
fi

echo "Infrastructure dependency updates completed."
echo "Please ensure all team members update their environments accordingly." 