#!/bin/bash

# Script to verify that all deprecated methods have been properly replaced
echo "Verifying that all deprecated methods have been properly replaced..."

ISSUES_FOUND=false

# Function to check for deprecated methods in codebase
check_for_method() {
  local method=$1
  local method_desc=$2
  local files_glob=$3
  
  echo "Checking for $method_desc usage..."
  
  # Find files containing the method
  matched_files=$(grep -l "$method" --include="$files_glob" --recursive .)
  
  if [ -z "$matched_files" ]; then
    echo "✓ No $method_desc usage found."
    return 0
  else
    echo "✗ Found $method_desc in the following files (these should be fixed before proceeding):"
    echo "$matched_files"
    ISSUES_FOUND=true
    return 1
  fi
}

# Check for all deprecated methods
echo "Scanning for deprecated methods..."

# 1. matchesAccessPolicy -> satisfiedAccessPolicy
check_for_method "matchesAccessPolicy" "matchesAccessPolicy method" "*.ts"

# 2. searchValueSet -> valueSetExpand
check_for_method "searchValueSet" "searchValueSet method" "*.ts"

# 3. uploadMedia -> createMedia
check_for_method "uploadMedia" "uploadMedia method" "*.ts"

# 4. parseSearchUrl -> parseSearchRequest
check_for_method "parseSearchUrl" "parseSearchUrl method" "*.ts"

# 5. parseSearchDefinition -> parseSearchRequest
check_for_method "parseSearchDefinition" "parseSearchDefinition method" "*.ts"

# 6. parseCriteriaAsSearchRequest -> parseSearchRequest
check_for_method "parseCriteriaAsSearchRequest" "parseCriteriaAsSearchRequest method" "*.ts"

# 7. crawlResource -> crawlTypedValue
check_for_method "crawlResource" "crawlResource method" "*.ts"

# 8. crawlResourceAsync -> crawlTypedValueAsync
check_for_method "crawlResourceAsync" "crawlResourceAsync method" "*.ts"

# 9. ResourceVisitor -> CrawlerVisitor
check_for_method "ResourceVisitor" "ResourceVisitor interface" "*.ts"

# 10. AsyncResourceVisitor -> AsyncCrawlerVisitor
check_for_method "AsyncResourceVisitor" "AsyncResourceVisitor interface" "*.ts"

# 11. Check for HL7 get and getAll
echo "Checking for HL7 get/getAll methods..."
hl7_methods=$(grep -r "\.get(" --include="*.ts" --include="*.tsx" . | grep -i "hl7")
if [ -n "$hl7_methods" ]; then
  echo "✗ Found potential HL7 get() method usage (these should be replaced with getSegment/getField/getComponent):"
  echo "$hl7_methods"
  ISSUES_FOUND=true
else
  echo "✓ No HL7 get() method usage found."
fi

hl7_methods_all=$(grep -r "\.getAll(" --include="*.ts" --include="*.tsx" . | grep -i "hl7")
if [ -n "$hl7_methods_all" ]; then
  echo "✗ Found potential HL7 getAll() method usage (these should be replaced with getSegment/getField/getComponent):"
  echo "$hl7_methods_all"
  ISSUES_FOUND=true
else
  echo "✓ No HL7 getAll() method usage found."
fi

# 12. Check for potentially problematic getReferenceString({}) usage
echo "Checking for problematic getReferenceString({}) usage..."
getReferenceStringEmpty=$(grep -r "getReferenceString(\{\})" --include="*.ts" --include="*.tsx" .)
if [ -n "$getReferenceStringEmpty" ]; then
  echo "✗ Found potentially problematic getReferenceString({}) calls:"
  echo "$getReferenceStringEmpty"
  echo ""
  echo "In v4.0.0, getReferenceString requires input to have 'reference' string for Reference types"
  echo "or both 'resourceType' and 'id' for Resource types."
  ISSUES_FOUND=true
else
  echo "✓ No problematic getReferenceString({}) usage found."
fi

# 13. Check for function overloads that may need review
echo ""
echo "Checking for methods with changed signatures..."

# createAttachment
createAttachment=$(grep -r "createAttachment" --include="*.ts" --include="*.tsx" .)
if [ -n "$createAttachment" ]; then
  echo "⚠️ Found createAttachment usage that may need review:"
  echo "$createAttachment"
  echo ""
  echo "In v4.0.0, createAttachment function signature has changed. Please review these calls manually."
fi

# createBinary
createBinary=$(grep -r "createBinary" --include="*.ts" --include="*.tsx" .)
if [ -n "$createBinary" ]; then
  echo "⚠️ Found createBinary usage that may need review:"
  echo "$createBinary"
  echo ""
  echo "In v4.0.0, createBinary function signature has changed. Please review these calls manually."
fi

# createPdf
createPdf=$(grep -r "createPdf" --include="*.ts" --include="*.tsx" .)
if [ -n "$createPdf" ]; then
  echo "⚠️ Found createPdf usage that may need review:"
  echo "$createPdf"
  echo ""
  echo "In v4.0.0, createPdf function signature has changed. Please review these calls manually."
fi

echo ""
if [ "$ISSUES_FOUND" = true ]; then
  echo "✗ Issues found. Please fix all deprecated method usage before proceeding to v4.0.0."
  echo "Use ./fix-deprecated-methods.sh to help replace deprecated methods."
  exit 1
else
  echo "✓ No deprecated method usage found. Ready to proceed with v4.0.0 upgrade."
  exit 0
fi 