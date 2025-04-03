#!/bin/bash

# Script to fix deprecated Medplum methods in preparation for v4.0.0 migration
# To be run from the ehr-frontend directory

set -e  # Exit on error

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Starting deprecated methods migration for Medplum v4.0.0...${NC}"

# Function to replace deprecated methods in a file
replace_in_file() {
  local file="$1"
  local old_pattern="$2"
  local new_pattern="$3"
  local description="$4"

  if grep -q "$old_pattern" "$file"; then
    echo -e "${YELLOW}Replacing $description in $file${NC}"
    sed -i.bak "s/$old_pattern/$new_pattern/g" "$file"
    rm "${file}.bak"
    echo -e "${GREEN}✓ Fixed $description in $file${NC}"
    return 0
  fi
  return 1
}

# Find all TypeScript/JavaScript files in the core directory
CORE_FILES=$(find core -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" \) | grep -v "node_modules" | grep -v "dist")

# Counter for changes
CHANGES_MADE=0

echo -e "${YELLOW}Scanning and fixing files...${NC}"

# Process each file
for file in $CORE_FILES; do
  # 1. Replace matchesAccessPolicy with satisfiedAccessPolicy
  if replace_in_file "$file" "matchesAccessPolicy" "satisfiedAccessPolicy" "matchesAccessPolicy"; then
    ((CHANGES_MADE++))
  fi

  # 2. Replace searchValueSet with valueSetExpand
  if replace_in_file "$file" "searchValueSet" "valueSetExpand" "searchValueSet"; then
    ((CHANGES_MADE++))
  fi

  # 3. Replace uploadMedia with createMedia
  if replace_in_file "$file" "uploadMedia" "createMedia" "uploadMedia"; then
    ((CHANGES_MADE++))
  fi

  # 4. Replace parseSearchUrl with parseSearchRequest
  if replace_in_file "$file" "parseSearchUrl" "parseSearchRequest" "parseSearchUrl"; then
    ((CHANGES_MADE++))
  fi

  # 5. Replace parseSearchDefinition with parseSearchRequest
  if replace_in_file "$file" "parseSearchDefinition" "parseSearchRequest" "parseSearchDefinition"; then
    ((CHANGES_MADE++))
  fi

  # 6. Replace parseCriteriaAsSearchRequest with parseSearchRequest
  if replace_in_file "$file" "parseCriteriaAsSearchRequest" "parseSearchRequest" "parseCriteriaAsSearchRequest"; then
    ((CHANGES_MADE++))
  fi

  # 7. Replace crawlResource with crawlTypedValue
  if replace_in_file "$file" "crawlResource" "crawlTypedValue" "crawlResource"; then
    ((CHANGES_MADE++))
  fi

  # 8. Replace crawlResourceAsync with crawlTypedValueAsync
  if replace_in_file "$file" "crawlResourceAsync" "crawlTypedValueAsync" "crawlResourceAsync"; then
    ((CHANGES_MADE++))
  fi

  # 9. Replace ResourceVisitor with CrawlerVisitor
  if replace_in_file "$file" "ResourceVisitor" "CrawlerVisitor" "ResourceVisitor"; then
    ((CHANGES_MADE++))
  fi

  # 10. Replace AsyncResourceVisitor with AsyncCrawlerVisitor
  if replace_in_file "$file" "AsyncResourceVisitor" "AsyncCrawlerVisitor" "AsyncResourceVisitor"; then
    ((CHANGES_MADE++))
  fi

  # 11. Check for HL7 get/getAll usage and provide instructions for manual fixes
  if grep -q "\.get(" "$file" || grep -q "\.getAll(" "$file"; then
    echo -e "${YELLOW}Potential HL7 get/getAll usage found in $file${NC}"
    echo -e "${YELLOW}Please manually update to use getSegment/getField/getComponent as appropriate${NC}"
    ((CHANGES_MADE++))
  fi

  # 12. Update function signatures for createAttachment, createBinary, createPdf
  # These may need more specific patterns and manual review
  if grep -q "createAttachment" "$file" || grep -q "createBinary" "$file" || grep -q "createPdf" "$file"; then
    echo -e "${YELLOW}Found method with changed signature in $file${NC}"
    echo -e "${YELLOW}Please manually update to use new object-based parameter style${NC}"
    ((CHANGES_MADE++))
  fi
done

# Report results
if [ $CHANGES_MADE -eq 0 ]; then
  echo -e "${GREEN}✓ No deprecated methods found in the codebase${NC}"
else
  echo -e "${YELLOW}Made $CHANGES_MADE changes to migrate deprecated methods${NC}"
  echo -e "${YELLOW}Some changes may require manual review. Please check output for details.${NC}"
fi

# Check for typescript installation
if ! command -v tsc &> /dev/null; then
  echo -e "${YELLOW}Installing TypeScript globally...${NC}"
  npm install -g typescript
fi

# Run TypeScript compiler to check for errors
echo -e "${YELLOW}Running TypeScript compiler to check for errors...${NC}"
cd core
npx tsc --noEmit

echo -e "${GREEN}Finished fixing deprecated methods!${NC}"
echo -e "${YELLOW}Run tests to verify all changes work correctly.${NC}" 