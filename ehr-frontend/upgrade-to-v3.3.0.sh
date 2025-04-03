#!/bin/bash

# Script to upgrade Medplum dependencies to v3.3.0
echo "Upgrading Medplum dependencies to v3.3.0..."

# Function to update dependencies in a package.json file
update_dependencies() {
  local package_file=$1
  local backup_file="${package_file}.bak"
  
  # Create backup
  cp "$package_file" "$backup_file"
  echo "Created backup at $backup_file"
  
  # Update @medplum/* dependencies to v3.3.0
  echo "Updating Medplum dependencies in $package_file to v3.3.0..."
  
  # Use temporary file for compatibility across operating systems
  jq '
    (.dependencies | 
      keys | 
      map(select(startswith("@medplum/"))) | 
      reduce .[] as $key (.; .dependencies[$key] = "3.3.0")
    ) |
    (.devDependencies | 
      keys | 
      map(select(startswith("@medplum/"))) | 
      reduce .[] as $key (.; .devDependencies[$key] = "3.3.0")
    )
  ' "$package_file" > "${package_file}.tmp"
  
  # Check if jq command succeeded
  if [ $? -ne 0 ]; then
    echo "Error updating $package_file. Reverting to backup."
    mv "$backup_file" "$package_file"
    rm -f "${package_file}.tmp"
    return 1
  fi
  
  # Replace the original file
  mv "${package_file}.tmp" "$package_file"
  echo "Successfully updated $package_file"
  return 0
}

# First, check if jq is installed (required for JSON manipulation)
if ! command -v jq &> /dev/null; then
  echo "Error: jq is required but not installed."
  echo "Please install jq first:"
  echo "  - macOS: brew install jq"
  echo "  - Ubuntu/Debian: sudo apt-get install jq"
  echo "  - Windows with Chocolatey: choco install jq"
  exit 1
fi

# Update main package.json
echo "Updating main EHR-Frontend package.json..."
update_dependencies "./package.json" || exit 1

# Update core package.json
echo "Updating core package.json..."
update_dependencies "./core/package.json" || exit 1

# Update other projects if they have direct Medplum dependencies
packages=("patient-intake" "chat" "scheduling" "chart" "provider" 
          "photon-integration" "hello-world" "eligibility" "websocket-subscriptions"
          "demo-bots" "fhircast" "task" "nextjs" "client-external-idp" "live-chat")

for pkg in "${packages[@]}"; do
  if [ -f "./$pkg/package.json" ]; then
    echo "Updating $pkg package.json..."
    update_dependencies "./$pkg/package.json" || echo "Warning: Failed to update $pkg"
  fi
done

echo "All package.json files have been updated to use Medplum v3.3.0"
echo "Next steps:"
echo "1. Run 'npm install' to install the updated dependencies"
echo "2. Test the application to verify compatibility with v3.3.0"
echo "3. If self-hosting, run v3.3.0 data migrations before proceeding to v4.0.0" 