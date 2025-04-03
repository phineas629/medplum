#!/bin/bash

# Script to identify migration-specific code and technical debt
# This will help guide the cleanup process in Phase 7

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
REPORT_FILE="${REPORT_DIR}/migration-cleanup-${TIMESTAMP}.md"

# Create reports directory if it doesn't exist
mkdir -p "${REPORT_DIR}"

# Log function
log() {
  echo -e "${1}"
  echo -e "${1}" | sed -r "s/\x1B\[([0-9]{1,3}(;[0-9]{1,2})?)?[mGK]//g" >> "${REPORT_FILE}"
}

# Start the report
log "# Migration Code Cleanup Report\n"
log "**Generated:** $(date)\n"
log "This report identifies code that should be reviewed during the Phase 7 cleanup.\n"

# Function to search for patterns and report findings
find_pattern() {
  local title="${1}"
  local pattern="${2}"
  local file_globs="${3}"
  local description="${4}"
  local exclude_pattern="${5:-NONEXISTENTPATTERN}"
  
  log "## ${title}\n"
  log "${description}\n"
  
  # Run grep search
  local results
  results=$(grep -r --include="${file_globs}" "${pattern}" "${FRONTEND_DIR}" | grep -v "${exclude_pattern}" || true)
  
  if [ -z "${results}" ]; then
    log "${GREEN}✓ No instances found${NC}\n"
  else
    log "${YELLOW}⚠️ Found instances that need review:${NC}\n"
    log "```"
    echo "${results}" >> "${REPORT_FILE}"
    log "```\n"
    
    # Count occurrences
    local count
    count=$(echo "${results}" | wc -l)
    log "Total occurrences: ${count}\n"
  fi
}

# Main section
log "# 1. Migration-Specific Code\n"

# Look for TODO comments related to migration
find_pattern "TODOs Related to Migration" "TODO.*[mM]edplum.*[vV]4|TODO.*migration" "*.ts *.tsx *.js *.jsx" "Identifies TODO comments related to the Medplum v4.0.0 migration that may need to be addressed."

# Look for commented out code
find_pattern "Commented Out Code Blocks" "/\\*\\s*(.\\n)*.*[mM]edplum.*[vV][3-4].*\\n.*\\*/" "*.ts *.tsx *.js *.jsx" "Identifies commented code blocks that mention Medplum v3 or v4 which may be migration artifacts."

# Look for temporary compatibility layers
find_pattern "Compatibility Layers" "// Compatibility layer|// For compatibility with" "*.ts *.tsx *.js *.jsx" "Identifies compatibility layers added during migration that may now be removed."

# Look for deprecated method usage
find_pattern "Deprecated Method Calls" "matchesAccessPolicy|searchValueSet|uploadMedia|parseSearchUrl|parseSearchDefinition|parseCriteriaAsSearchRequest|crawlResource|crawlResourceAsync|ResourceVisitor|AsyncResourceVisitor" "*.ts *.tsx *.js *.jsx" "Identifies any remaining calls to deprecated methods that should be updated."

# Look for feature flags related to migration
find_pattern "Feature Flags" "enableV4Features|disableV3Compatibility|ENABLE_V4_API" "*.ts *.tsx *.js *.jsx *.json" "Identifies feature flags related to the migration that may no longer be needed."

log "# 2. Technical Debt\n"

# Look for any console.log statements
find_pattern "Console Log Statements" "console\\.log" "*.ts *.tsx *.js *.jsx" "Identifies console.log statements that should be removed or replaced with proper logging."

# Look for any debugger statements
find_pattern "Debugger Statements" "debugger" "*.ts *.tsx *.js *.jsx" "Identifies debugger statements that should be removed."

# Look for any FIXME comments
find_pattern "FIXME Comments" "FIXME" "*.ts *.tsx *.js *.jsx" "Identifies FIXME comments that should be addressed."

# Look for any hardcoded values that should be configurable
find_pattern "Hardcoded URLs/IDs" "https://api\\.medplum\\.com|https://app\\.medplum\\.com" "*.ts *.tsx *.js *.jsx" "Identifies hardcoded URLs that should be replaced with configurable values."

# Look for any ignored lint warnings
find_pattern "Ignored Lint Warnings" "// eslint-disable|/\\* eslint-disable" "*.ts *.tsx *.js *.jsx" "Identifies disabled ESLint rules that should be addressed."

log "# 3. Optimization Opportunities\n"

# Look for areas that could be optimized with new v4 features
find_pattern "Potential for v4 Feature Optimization" "// TODO: Use v4 feature when available|// Will be improved in v4" "*.ts *.tsx *.js *.jsx" "Identifies code that was marked for optimization with v4 features."

# Look for any large functions that could be refactored
find_pattern "Large Functions" "function .*{" "*.ts *.tsx *.js *.jsx" "Identifies function declarations for manual review of large functions that could be refactored." "export function|function component"

log "# 4. Documentation Needs\n"

# Look for code with missing JSDoc
find_pattern "Missing JSDoc Comments" "export (function|const|class)" "*.ts" "Identifies exported functions/classes that might need JSDoc documentation." "\\*\\/"

# Summary
log "# Summary\n"
log "This report identifies areas for cleanup during Phase 7. Review each section and address the findings according to the Phase 7 implementation plan.\n"
log "Report saved to: ${REPORT_FILE}"

# Print the final message
echo -e "\n${GREEN}✅ Cleanup analysis completed!${NC}"
echo -e "${BLUE}Report saved to: ${REPORT_FILE}${NC}" 