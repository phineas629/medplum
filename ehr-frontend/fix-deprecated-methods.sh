#!/bin/bash

# Script to replace deprecated methods with their v4.0.0 alternatives
echo "Scanning codebase for deprecated method usage..."

# Create a log file for the replacements
CHANGES_LOG="deprecated-method-changes.log"
echo "Deprecated Method Replacement Log" > $CHANGES_LOG
echo "--------------------------------" >> $CHANGES_LOG
echo "Generated on: $(date)" >> $CHANGES_LOG
echo "" >> $CHANGES_LOG

# Function to replace deprecated methods in files
replace_in_files() {
  local pattern=$1
  local replacement=$2
  local pattern_desc=$3
  local files_glob=$4

  echo "Searching for $pattern_desc..."
  
  # Find files containing the pattern
  matched_files=$(grep -l "$pattern" --include="$files_glob" --recursive .)
  
  if [ -z "$matched_files" ]; then
    echo "No files found with $pattern_desc."
    echo "No files found with $pattern_desc." >> $CHANGES_LOG
    return 0
  fi
  
  echo "Found $pattern_desc in the following files:"
  echo "$matched_files"
  echo "" >> $CHANGES_LOG
  echo "Files containing $pattern_desc:" >> $CHANGES_LOG
  echo "$matched_files" >> $CHANGES_LOG
  echo "" >> $CHANGES_LOG
  
  # Ask if we should proceed with replacement
  read -p "Replace $pattern_desc with $replacement? (y/n): " answer
  if [[ $answer == "y" ]]; then
    for file in $matched_files; do
      echo "Replacing in $file..."
      
      # Create backup
      cp "$file" "${file}.bak"
      
      # Perform replacement
      sed -i.tmp "s/$pattern/$replacement/g" "$file"
      rm -f "${file}.tmp"
      
      echo "Replaced in $file" >> $CHANGES_LOG
    done
    echo "Replacement completed."
  else
    echo "Skipping replacement for $pattern_desc."
    echo "Skipped replacement for $pattern_desc." >> $CHANGES_LOG
  fi
  
  echo "" >> $CHANGES_LOG
}

# Map of deprecated methods to their replacements
echo "Processing replacements for deprecated methods..."

# 1. matchesAccessPolicy -> satisfiedAccessPolicy
replace_in_files "matchesAccessPolicy" "satisfiedAccessPolicy" "matchesAccessPolicy method" "*.ts"

# 2. searchValueSet -> valueSetExpand
replace_in_files "searchValueSet" "valueSetExpand" "searchValueSet method" "*.ts"

# 3. uploadMedia -> createMedia
replace_in_files "uploadMedia" "createMedia" "uploadMedia method" "*.ts"

# 4. parseSearchUrl -> parseSearchRequest
replace_in_files "parseSearchUrl" "parseSearchRequest" "parseSearchUrl method" "*.ts"

# 5. parseSearchDefinition -> parseSearchRequest
replace_in_files "parseSearchDefinition" "parseSearchRequest" "parseSearchDefinition method" "*.ts"

# 6. parseCriteriaAsSearchRequest -> parseSearchRequest
replace_in_files "parseCriteriaAsSearchRequest" "parseSearchRequest" "parseCriteriaAsSearchRequest method" "*.ts"

# 7. crawlResource -> crawlTypedValue
replace_in_files "crawlResource" "crawlTypedValue" "crawlResource method" "*.ts"

# 8. crawlResourceAsync -> crawlTypedValueAsync
replace_in_files "crawlResourceAsync" "crawlTypedValueAsync" "crawlResourceAsync method" "*.ts"

# 9. ResourceVisitor -> CrawlerVisitor
replace_in_files "ResourceVisitor" "CrawlerVisitor" "ResourceVisitor interface" "*.ts"

# 10. AsyncResourceVisitor -> AsyncCrawlerVisitor
replace_in_files "AsyncResourceVisitor" "AsyncCrawlerVisitor" "AsyncResourceVisitor interface" "*.ts"

# 11. HL7 get and getAll -> getSegment, getField, getComponent
echo "HL7 get and getAll methods require context-dependent replacements."
echo "Please manually review files that use HL7 get/getAll and replace with appropriate methods:"
echo "  - getSegment"
echo "  - getField" 
echo "  - getComponent"

echo "For example:"
echo "  - Replace 'get('MSH')' with 'getSegment('MSH')'"
echo "  - Replace 'get('MSH.7')' with 'getField('MSH', 7)'"

# Function overload methods require more careful handling
echo ""
echo "The following methods have changed signatures but need manual review:"
echo "- createAttachment"
echo "- createBinary"
echo "- createPdf"

echo "Scanning for potential getReferenceString({}) usage..."
getReferenceStringEmpty=$(grep -r "getReferenceString(\{\})" --include="*.ts" --include="*.tsx" .)
if [ -n "$getReferenceStringEmpty" ]; then
  echo "Found potentially problematic getReferenceString({}) calls:"
  echo "$getReferenceStringEmpty"
  echo ""
  echo "In v4.0.0, getReferenceString requires input to have 'reference' string for Reference types"
  echo "or both 'resourceType' and 'id' for Resource types."
  echo "Please update these calls manually."
fi

echo ""
echo "Replacement process completed. See $CHANGES_LOG for details."
echo "Please review all changes and manually fix any remaining issues."
echo ""
echo "IMPORTANT: Run tests after making these changes to verify functionality." 