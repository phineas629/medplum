#!/bin/bash

# Verification script for Medplum v4.0.0 migration
# Checks that all deprecated methods have been properly replaced

set -e  # Exit on error

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo "Verifying that all deprecated methods have been properly replaced..."

# Flag to track if we found any issues
ISSUES_FOUND=0

# Function to check for deprecated method usage
check_method() {
  local method_name="$1"
  local files_to_search="$2"
  
  echo "Checking for $method_name method usage..."
  
  # Only look in our own code, not node_modules
  found_usage=$(grep -r "$method_name" $files_to_search 2>/dev/null | grep -v "node_modules" || true)
  
  if [ -n "$found_usage" ]; then
    echo -e "${RED}✗ Found $method_name method in the following files (these should be fixed before proceeding):${NC}"
    echo "$found_usage" | head -n 10
    
    # Show count if more than 10 lines
    count=$(echo "$found_usage" | wc -l)
    if [ $count -gt 10 ]; then
      echo -e "${YELLOW}...and $(($count - 10)) more occurrences${NC}"
    fi
    
    ISSUES_FOUND=1
    return 1
  else
    echo -e "${GREEN}✓ No usage of $method_name found${NC}"
    return 0
  fi
}

echo "Scanning for deprecated methods..."

# Check for each deprecated method
check_method "matchesAccessPolicy" "--include='*.ts' --include='*.tsx' ."
check_method "searchValueSet" "--include='*.ts' --include='*.tsx' ."
check_method "uploadMedia" "--include='*.ts' --include='*.tsx' ."
check_method "parseSearchUrl" "--include='*.ts' --include='*.tsx' ."
check_method "parseSearchDefinition" "--include='*.ts' --include='*.tsx' ."
check_method "parseCriteriaAsSearchRequest" "--include='*.ts' --include='*.tsx' ."
check_method "crawlResource" "--include='*.ts' --include='*.tsx' ."
check_method "crawlResourceAsync" "--include='*.ts' --include='*.tsx' ."
check_method "ResourceVisitor" "--include='*.ts' --include='*.tsx' ."
check_method "AsyncResourceVisitor" "--include='*.ts' --include='*.tsx' ."

# Check for HL7 get/getAll methods (these are more specific)
echo "Checking for HL7 get/getAll methods..."
hl7_get_usage=$(grep -r "\.get(" --include='*.ts' --include='*.tsx' . | grep -v "node_modules" | grep -E "(msg|msh|pid|segment)\.get\(" || true)
if [ -n "$hl7_get_usage" ]; then
  echo -e "${RED}✗ Found potential HL7 get() method usage (these should be replaced with getSegment/getField/getComponent):${NC}"
  echo "$hl7_get_usage"
  ISSUES_FOUND=1
else
  echo -e "${GREEN}✓ No HL7 get() method usage found${NC}"
fi

hl7_getall_usage=$(grep -r "\.getAll(" --include='*.ts' --include='*.tsx' . | grep -v "node_modules" || true)
if [ -n "$hl7_getall_usage" ]; then
  echo -e "${RED}✗ Found potential HL7 getAll() method usage (these should be replaced with getSegment/getField/getComponent):${NC}"
  echo "$hl7_getall_usage"
  ISSUES_FOUND=1
else
  echo -e "${GREEN}✓ No HL7 getAll() method usage found${NC}"
fi

# Check for problematic getReferenceString({}) usage
echo "Checking for problematic getReferenceString({}) usage..."
reference_string_usage=$(grep -r "getReferenceString(\{\})" --include='*.ts' --include='*.tsx' . | grep -v "node_modules" || true)
if [ -n "$reference_string_usage" ]; then
  echo -e "${RED}✗ Found problematic getReferenceString({}) usage:${NC}"
  echo "$reference_string_usage"
  ISSUES_FOUND=1
else
  echo -e "${GREEN}✓ No problematic getReferenceString({}) usage found.${NC}"
fi

# Check for methods with changed signatures
echo "Checking for methods with changed signatures..."

# createAttachment
attachment_usage=$(grep -r "createAttachment" --include='*.ts' --include='*.tsx' . | grep -v "node_modules" || true)
if [ -n "$attachment_usage" ]; then
  echo -e "${YELLOW}⚠️ Found createAttachment usage that may need review:${NC}"
  echo "$attachment_usage" | head -n 10
  echo ""
  echo -e "${YELLOW}In v4.0.0, createAttachment function signature has changed. Please review these calls manually.${NC}"
  ISSUES_FOUND=1
fi

# createBinary
binary_usage=$(grep -r "createBinary" --include='*.ts' --include='*.tsx' . | grep -v "node_modules" || true)
if [ -n "$binary_usage" ]; then
  echo -e "${YELLOW}⚠️ Found createBinary usage that may need review:${NC}"
  echo "$binary_usage" | head -n 10
  echo ""
  echo -e "${YELLOW}In v4.0.0, createBinary function signature has changed. Please review these calls manually.${NC}"
  ISSUES_FOUND=1
fi

# createPdf
pdf_usage=$(grep -r "createPdf" --include='*.ts' --include='*.tsx' . | grep -v "node_modules" || true)
if [ -n "$pdf_usage" ]; then
  echo -e "${YELLOW}⚠️ Found createPdf usage that may need review:${NC}"
  echo "$pdf_usage" | head -n 10
  echo ""
  echo -e "${YELLOW}In v4.0.0, createPdf function signature has changed. Please review these calls manually.${NC}"
  ISSUES_FOUND=1
fi

# Final output
if [ $ISSUES_FOUND -eq 1 ]; then
  echo -e "${RED}✗ Issues found. Please fix all deprecated method usage before proceeding to v4.0.0.${NC}"
  echo -e "${YELLOW}Use ./fix-deprecated-methods.sh to help replace deprecated methods.${NC}"
  exit 1
else
  echo -e "${GREEN}✓ No deprecated method usage found. Ready for v4.0.0!${NC}"
  exit 0
fi 