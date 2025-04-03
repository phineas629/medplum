#!/bin/bash

# Script to clean up migration-specific code and technical debt
# This script implements the cleanup actions identified by identify-migration-code.sh

set -e  # Exit on error

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
FRONTEND_DIR="$(dirname "$SCRIPT_DIR")"
ROOT_DIR="$(dirname "$FRONTEND_DIR")"
REPORT_DIR="${SCRIPT_DIR}/reports"
TIMESTAMP=$(date +"%Y%m%d%H%M%S")
CLEANUP_LOG="${REPORT_DIR}/cleanup-actions-${TIMESTAMP}.md"

# Interactive mode flag
INTERACTIVE=true

# Create reports directory if it doesn't exist
mkdir -p "${REPORT_DIR}"

# Log function
log() {
  echo -e "${1}"
  echo -e "${1}" | sed -r "s/\x1B\[([0-9]{1,3}(;[0-9]{1,2})?)?[mGK]//g" >> "${CLEANUP_LOG}"
}

# Start the log
log "# Migration Code Cleanup Actions\n"
log "**Generated:** $(date)\n"
log "This log details the actions taken during Phase 7 cleanup.\n"

# Parse command line arguments
while [[ "$#" -gt 0 ]]; do
  case $1 in
    --non-interactive) INTERACTIVE=false ;;
    --help) 
      echo "Usage: $0 [options]"
      echo "Options:"
      echo "  --non-interactive    Run in non-interactive mode (will apply all changes without confirmation)"
      echo "  --help               Display this help message"
      exit 0
      ;;
    *) echo "Unknown parameter: $1"; exit 1 ;;
  esac
  shift
done

# Function to clean up patterns in files
cleanup_pattern() {
  local title="${1}"
  local search_pattern="${2}"
  local replacement="${3}"
  local file_pattern="${4}"
  local description="${5}"
  
  log "## ${title}\n"
  log "${description}\n"
  
  # Find files containing the pattern
  local matching_files
  matching_files=$(grep -l -r --include="${file_pattern}" "${search_pattern}" "${FRONTEND_DIR}" | sort -u || true)
  
  if [ -z "${matching_files}" ]; then
    log "${GREEN}✓ No instances found to clean up${NC}\n"
    return 0
  fi
  
  log "${YELLOW}Found instances to clean up in the following files:${NC}\n"
  log "```"
  echo "${matching_files}" >> "${CLEANUP_LOG}"
  log "```\n"
  
  # Count files
  local file_count
  file_count=$(echo "${matching_files}" | wc -l)
  log "Files to modify: ${file_count}\n"
  
  # Handle interactive mode
  if [ "${INTERACTIVE}" = true ]; then
    echo -e "${YELLOW}Found ${file_count} files with instances of '${search_pattern}' to replace with '${replacement}'${NC}"
    read -p "Do you want to proceed with cleanup? (y/n): " -r confirm
    echo
    if [[ ! $confirm =~ ^[Yy]$ ]]; then
      log "${RED}Skipped cleanup of ${title}${NC}\n"
      return 0
    fi
  fi
  
  # Process each file
  local files_changed=0
  for file in $matching_files; do
    if [ -f "$file" ]; then
      # Create backup
      cp "$file" "${file}.bak"
      
      # Replace pattern
      if [ "$replacement" = "REMOVE_ENTIRE_LINE" ]; then
        # Special case: remove the entire line containing the pattern
        sed -i '' "/$(echo "${search_pattern}" | sed 's:/:\\/:g')/d" "$file"
      else
        # Normal replacement
        sed -i '' "s/$(echo "${search_pattern}" | sed 's:/:\\/:g')/$(echo "${replacement}" | sed 's:/:\\/:g')/g" "$file"
      fi
      
      # Verify if changes were made by comparing with backup
      if diff -q "$file" "${file}.bak" > /dev/null; then
        # No changes, restore backup
        mv "${file}.bak" "$file"
      else
        # Changes made, remove backup
        rm "${file}.bak"
        log "✓ Updated: ${file}\n"
        ((files_changed++))
      fi
    fi
  done
  
  log "${GREEN}Files updated: ${files_changed}/${file_count}${NC}\n"
  
  # Run tests after making changes
  if [ $files_changed -gt 0 ] && [ -f "${FRONTEND_DIR}/core/package.json" ]; then
    log "Running tests to verify changes...\n"
    echo -e "${BLUE}Running tests to verify changes...${NC}"
    
    # Go to core directory
    pushd "${FRONTEND_DIR}/core" > /dev/null
    
    # Run tests
    if npm test > /dev/null 2>&1; then
      log "${GREEN}✓ Tests passed after changes${NC}\n"
      echo -e "${GREEN}✓ Tests passed after changes${NC}"
    else
      log "${RED}✗ Tests failed after changes${NC}\n"
      echo -e "${RED}✗ Tests failed after changes${NC}"
      
      if [ "${INTERACTIVE}" = true ]; then
        read -p "Tests failed. Do you want to continue with other cleanup actions? (y/n): " -r continue_confirm
        echo
        if [[ ! $continue_confirm =~ ^[Yy]$ ]]; then
          popd > /dev/null
          exit 1
        fi
      fi
    fi
    
    popd > /dev/null
  fi
}

# Function to clean up comments
cleanup_comments() {
  local title="${1}"
  local pattern="${2}"
  local file_globs="${3}"
  local description="${4}"
  
  log "## ${title}\n"
  log "${description}\n"
  
  # Find files containing the pattern
  local matching_files
  matching_files=$(grep -l -r --include="${file_globs}" "${pattern}" "${FRONTEND_DIR}" | sort -u || true)
  
  if [ -z "${matching_files}" ]; then
    log "${GREEN}✓ No instances found to clean up${NC}\n"
    return 0
  fi
  
  log "${YELLOW}Found instances to clean up in the following files:${NC}\n"
  log "```"
  echo "${matching_files}" >> "${CLEANUP_LOG}"
  log "```\n"
  
  # Count files
  local file_count
  file_count=$(echo "${matching_files}" | wc -l)
  log "Files to modify: ${file_count}\n"
  
  # Handle interactive mode
  if [ "${INTERACTIVE}" = true ]; then
    echo -e "${YELLOW}Found ${file_count} files with instances of '${pattern}' to clean up${NC}"
    read -p "Do you want to proceed with cleanup? (y/n): " -r confirm
    echo
    if [[ ! $confirm =~ ^[Yy]$ ]]; then
      log "${RED}Skipped cleanup of ${title}${NC}\n"
      return 0
    fi
  fi
  
  # Process each file
  local files_changed=0
  for file in $matching_files; do
    if [ -f "$file" ]; then
      # Create backup
      cp "$file" "${file}.bak"
      
      # For comment blocks, we need to do a multi-line replacement
      if [[ "${pattern}" == *"/*"* ]]; then
        # Remove multi-line comment blocks containing the pattern
        perl -0777 -i -pe "s:/\*.*${pattern}.*?\*/::gs" "$file"
      else
        # Remove single line comments containing the pattern
        sed -i '' "/$(echo "${pattern}" | sed 's:/:\\/:g')/d" "$file"
      fi
      
      # Verify if changes were made by comparing with backup
      if diff -q "$file" "${file}.bak" > /dev/null; then
        # No changes, restore backup
        mv "${file}.bak" "$file"
      else
        # Changes made, remove backup
        rm "${file}.bak"
        log "✓ Updated: ${file}\n"
        ((files_changed++))
      fi
    fi
  done
  
  log "${GREEN}Files updated: ${files_changed}/${file_count}${NC}\n"
}

echo -e "${BLUE}Starting migration code cleanup...${NC}"

# 1. Clean up deprecated method calls
log "# 1. Deprecated Method Replacements\n"
cleanup_pattern "Replace matchesAccessPolicy" "matchesAccessPolicy" "satisfiedAccessPolicy" "*.ts *.tsx" "Replace deprecated matchesAccessPolicy method with satisfiedAccessPolicy"
cleanup_pattern "Replace searchValueSet" "searchValueSet" "valueSetExpand" "*.ts *.tsx" "Replace deprecated searchValueSet method with valueSetExpand"
cleanup_pattern "Replace uploadMedia" "uploadMedia" "createMedia" "*.ts *.tsx" "Replace deprecated uploadMedia method with createMedia"
cleanup_pattern "Replace parseSearchUrl" "parseSearchUrl" "parseSearchRequest" "*.ts *.tsx" "Replace deprecated parseSearchUrl method with parseSearchRequest"
cleanup_pattern "Replace parseSearchDefinition" "parseSearchDefinition" "parseSearchRequest" "*.ts *.tsx" "Replace deprecated parseSearchDefinition method with parseSearchRequest"
cleanup_pattern "Replace parseCriteriaAsSearchRequest" "parseCriteriaAsSearchRequest" "parseSearchRequest" "*.ts *.tsx" "Replace deprecated parseCriteriaAsSearchRequest method with parseSearchRequest"
cleanup_pattern "Replace crawlResource" "crawlResource" "crawlTypedValue" "*.ts *.tsx" "Replace deprecated crawlResource method with crawlTypedValue"
cleanup_pattern "Replace crawlResourceAsync" "crawlResourceAsync" "crawlTypedValueAsync" "*.ts *.tsx" "Replace deprecated crawlResourceAsync method with crawlTypedValueAsync"
cleanup_pattern "Replace ResourceVisitor" "ResourceVisitor" "CrawlerVisitor" "*.ts *.tsx" "Replace deprecated ResourceVisitor interface with CrawlerVisitor"
cleanup_pattern "Replace AsyncResourceVisitor" "AsyncResourceVisitor" "AsyncCrawlerVisitor" "*.ts *.tsx" "Replace deprecated AsyncResourceVisitor interface with AsyncCrawlerVisitor"

# 2. Clean up migration-specific code
log "# 2. Migration-Specific Code Cleanup\n"
cleanup_comments "Remove Migration TODOs" "TODO.*[mM]edplum.*[vV]4|TODO.*migration" "*.ts *.tsx *.js *.jsx" "Remove TODOs related to the migration that are no longer needed"
cleanup_comments "Remove Commented Migration Code" "/\\*.*[mM]edplum.*[vV][3-4].*\\*/" "*.ts *.tsx *.js *.jsx" "Remove commented out code blocks related to Medplum v3 or v4"
cleanup_comments "Remove Compatibility Comments" "// Compatibility layer|// For compatibility with" "*.ts *.tsx *.js *.jsx" "Remove comments about compatibility layers"

# 3. Remove feature flags
log "# 3. Feature Flag Cleanup\n"
cleanup_pattern "Remove enableV4Features Flag" "enableV4Features\\s*[:=]\\s*true" "REMOVE_ENTIRE_LINE" "*.ts *.tsx *.js *.jsx *.json" "Remove enableV4Features flag as it's no longer needed"
cleanup_pattern "Remove disableV3Compatibility Flag" "disableV3Compatibility\\s*[:=]\\s*(true|false)" "REMOVE_ENTIRE_LINE" "*.ts *.tsx *.js *.jsx *.json" "Remove disableV3Compatibility flag as it's no longer needed"
cleanup_pattern "Remove ENABLE_V4_API Flag" "ENABLE_V4_API\\s*[:=]\\s*(true|false)" "REMOVE_ENTIRE_LINE" "*.ts *.tsx *.js *.jsx *.json" "Remove ENABLE_V4_API flag as it's no longer needed"

# 4. Clean up technical debt
log "# 4. Technical Debt Cleanup\n"
cleanup_comments "Remove Debug Console Logs" "console\\.log\\(" "*.ts *.tsx *.js *.jsx" "Remove console.log statements that were used for debugging"
cleanup_comments "Remove Debugger Statements" "debugger;" "*.ts *.tsx *.js *.jsx" "Remove debugger statements"
cleanup_comments "Remove FIXME Comments" "FIXME" "*.ts *.tsx *.js *.jsx" "Remove FIXME comments that have been addressed"

# Summary
log "# Summary\n"
log "Migration code cleanup has been completed. The following actions were taken:\n"
log "1. Replaced deprecated method calls with their v4.0.0 equivalents\n"
log "2. Removed migration-specific TODOs and comments\n"
log "3. Removed compatibility layers and feature flags\n"
log "4. Cleaned up technical debt artifacts\n"
log "\nCleanup log saved to: ${CLEANUP_LOG}"

echo -e "\n${GREEN}✅ Migration code cleanup completed!${NC}"
echo -e "${BLUE}Cleanup log saved to: ${CLEANUP_LOG}${NC}" 