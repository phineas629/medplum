#!/bin/bash

# Script to find deprecated methods that need to be replaced for v4.0.0 migration
echo "Scanning for deprecated methods in ehr-frontend..."

# The list of deprecated methods to search for
DEPRECATED_METHODS=(
  "matchesAccessPolicy"
  "searchValueSet"
  "uploadMedia"
  "parseSearchUrl"
  "parseSearchDefinition"
  "parseCriteriaAsSearchRequest"
  "crawlResource"
  "crawlResourceAsync"
  "ResourceVisitor"
  "AsyncResourceVisitor"
  "HL7 get"
  "HL7 getAll"
  "getReferenceString({})"
)

# Search each method in the codebase
for method in "${DEPRECATED_METHODS[@]}"; do
  echo "Searching for: $method"
  grep -r "$method" --include="*.ts" --include="*.tsx" ./
  echo ""
done

# Also look for method signatures that have changed
echo "Searching for createAttachment with overloads..."
grep -r "createAttachment" --include="*.ts" --include="*.tsx" ./
echo ""

echo "Searching for createBinary with overloads..."
grep -r "createBinary" --include="*.ts" --include="*.tsx" ./
echo ""

echo "Searching for createPdf with overloads..."
grep -r "createPdf" --include="*.ts" --include="*.tsx" ./
echo ""

echo "Scan complete." 