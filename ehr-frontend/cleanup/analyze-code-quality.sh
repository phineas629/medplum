#!/bin/bash

# Script to analyze code quality and identify areas for optimization
# Part of Phase 7: Cleanup and Future-Proofing

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
ANALYSIS_REPORT="${REPORT_DIR}/code-quality-analysis-${TIMESTAMP}.md"

# Create reports directory if it doesn't exist
mkdir -p "${REPORT_DIR}"

# Log function
log() {
  echo -e "${1}"
  echo -e "${1}" | sed -r "s/\x1B\[([0-9]{1,3}(;[0-9]{1,2})?)?[mGK]//g" >> "${ANALYSIS_REPORT}"
}

# Start the report
log "# Code Quality Analysis Report\n"
log "**Generated:** $(date)\n"
log "This report analyzes code quality and identifies areas for optimization as part of Phase 7 cleanup.\n"

# Function to count lines of code in a file
count_lines() {
  wc -l "$1" | awk '{print $1}'
}

# Function to count lines of code for a given file pattern
count_files_lines() {
  local pattern="$1"
  local total=0
  local files
  
  files=$(find "${FRONTEND_DIR}" -type f -name "${pattern}" | grep -v "node_modules" | grep -v "dist")
  
  for file in $files; do
    total=$((total + $(count_lines "$file")))
  done
  
  echo "$total"
}

# Function to analyze a specific file
analyze_file() {
  local file="$1"
  local lines=$(count_lines "$file")
  local imports=$(grep -c "^import " "$file" || echo 0)
  local functions=$(grep -c "function " "$file" || echo 0)
  local classes=$(grep -c "class " "$file" || echo 0)
  local comments=$(grep -c "//" "$file" || echo 0)
  local todo_comments=$(grep -c "TODO" "$file" || echo 0)
  local jsx_components=0
  local long_functions=0
  
  if [[ "$file" == *.tsx ]]; then
    # Count React components
    jsx_components=$(grep -c "export.*function.*(" "$file" || echo 0)
  fi
  
  # Identify long functions (over 50 lines)
  # This is a rough approximation and might include false positives
  long_functions=$(grep -n "function " "$file" | while read -r line_func; do
    line_num=${line_func%%:*}
    next_line_num=$((line_num + 50))
    if [ $next_line_num -lt $lines ]; then
      bracket_depth=0
      for i in $(seq $line_num $next_line_num); do
        line_content=$(sed -n "${i}p" "$file")
        open_brackets=$(echo "$line_content" | tr -cd '{' | wc -c)
        close_brackets=$(echo "$line_content" | tr -cd '}' | wc -c)
        bracket_depth=$((bracket_depth + open_brackets - close_brackets))
        if [[ $bracket_depth -eq 0 && $i -gt $((line_num + 5)) ]]; then
          # Function ended before 50 lines
          break
        fi
      done
      if [ $bracket_depth -gt 0 ]; then
        # Function is still open after 50 lines, so it's long
        echo "$line_func"
      fi
    fi
  done | wc -l)

  echo "File: $file"
  echo "  Lines: $lines"
  echo "  Imports: $imports"
  echo "  Functions/Methods: $functions"
  echo "  Classes: $classes"
  echo "  Comments: $comments"
  echo "  TODO Comments: $todo_comments"
  echo "  JSX Components: $jsx_components"
  echo "  Long Functions (>50 lines): $long_functions"
  
  # Return 1 if the file has potential issues
  if [ $long_functions -gt 0 ] || [ $todo_comments -gt 0 ]; then
    return 1
  fi
  
  return 0
}

# Run ESLint analysis
log "## ESLint Analysis\n"
cd "${FRONTEND_DIR}/core"

if [ -f "node_modules/.bin/eslint" ]; then
  log "Running ESLint to identify code quality issues...\n"
  log "```"
  node_modules/.bin/eslint --ext .ts,.tsx src/ --format stylish >> "${ANALYSIS_REPORT}" 2>&1 || true
  log "```\n"
else
  log "${YELLOW}ESLint not found. Install it with 'npm install eslint --save-dev'${NC}\n"
fi

# TypeScript compilation errors
log "## TypeScript Compilation\n"
if [ -f "node_modules/.bin/tsc" ]; then
  log "Checking for TypeScript compilation issues...\n"
  log "```"
  node_modules/.bin/tsc --noEmit >> "${ANALYSIS_REPORT}" 2>&1 || true
  log "```\n"
else
  log "${YELLOW}TypeScript not found. Install it with 'npm install typescript --save-dev'${NC}\n"
fi

# Run tests with coverage
log "## Test Coverage Analysis\n"
if [ -f "package.json" ]; then
  if grep -q '"test"' package.json; then
    log "Running tests with coverage...\n"
    npm test -- --coverage >> /dev/null 2>&1 || true
    
    if [ -f "coverage/lcov-report/index.html" ]; then
      # Extract coverage information
      log "Test coverage summary:\n"
      log "```"
      cat coverage/lcov-report/index.html | grep "<span class=\"strong\">" | head -n 3 | sed 's/<[^>]*>//g' | sed 's/^[ \t]*//' >> "${ANALYSIS_REPORT}"
      log "```\n"
      
      # Find files with low coverage
      log "### Files with Low Coverage\n"
      log "The following files have less than 70% test coverage and should be prioritized for additional tests:\n"
      
      low_coverage_files=$(find coverage/lcov-report -name "*.html" -not -name "index.html" -exec grep -l "low.*coverage" {} \;)
      
      if [ -z "$low_coverage_files" ]; then
        log "${GREEN}No files with low coverage found.${NC}\n"
      else
        log "| File | Line Coverage | Statement Coverage | Function Coverage |\n"
        log "|------|---------------|-------------------|-------------------|\n"
        
        for lcov_file in $low_coverage_files; do
          file_path=$(echo "$lcov_file" | sed 's/coverage\/lcov-report\///' | sed 's/\.html//')
          line_coverage=$(grep -A 3 "line-coverage" "$lcov_file" | grep "strong" | head -n 1 | sed 's/<[^>]*>//g' | sed 's/^[ \t]*//')
          statement_coverage=$(grep -A 3 "statement-coverage" "$lcov_file" | grep "strong" | head -n 1 | sed 's/<[^>]*>//g' | sed 's/^[ \t]*//')
          function_coverage=$(grep -A 3 "function-coverage" "$lcov_file" | grep "strong" | head -n 1 | sed 's/<[^>]*>//g' | sed 's/^[ \t]*//')
          
          log "| $file_path | $line_coverage | $statement_coverage | $function_coverage |\n"
        done
      fi
    else
      log "${YELLOW}Coverage report not found. Make sure tests are configured to generate coverage reports.${NC}\n"
    fi
  else
    log "${YELLOW}No test script found in package.json.${NC}\n"
  fi
else
  log "${RED}No package.json found in ${FRONTEND_DIR}/core${NC}\n"
fi

# Analyze code complexity
log "## Code Complexity Analysis\n"

# Find potentially complex files (large files)
log "### Large Files\n"
log "Files with more than 300 lines might be candidates for refactoring:\n"

large_files=$(find "${FRONTEND_DIR}" -type f \( -name "*.ts" -o -name "*.tsx" \) -not -path "*/node_modules/*" -not -path "*/dist/*" | xargs wc -l 2>/dev/null | sort -nr | head -n 10)

if [ -z "$large_files" ]; then
  log "${GREEN}No unusually large files found.${NC}\n"
else
  log "```"
  echo "$large_files" >> "${ANALYSIS_REPORT}"
  log "```\n"
fi

# Analyze most complex files in detail
log "### Detailed File Analysis\n"
log "Detailed analysis of the 5 largest files:\n"

largest_files=$(echo "$large_files" | head -n 5 | awk '{print $2}')

if [ -n "$largest_files" ]; then
  for file in $largest_files; do
    log "#### $(basename "$file")\n"
    log "Location: $file\n"
    log "```"
    analyze_file "$file" >> "${ANALYSIS_REPORT}" 2>&1
    log "```\n"
    
    # Extract long function names
    log "Long functions in this file:\n"
    
    long_functions=$(grep -n "function " "$file" | while read -r line_func; do
      func_line_num=${line_func%%:*}
      func_name=$(echo "$line_func" | sed -E 's/.*function[[:space:]]+([a-zA-Z0-9_]+).*/\1/')
      if [ -z "$func_name" ]; then
        # Try to extract function name for arrow functions or methods
        func_name=$(echo "$line_func" | sed -E 's/.*const[[:space:]]+([a-zA-Z0-9_]+)[[:space:]]*=.*/\1/')
        if [ -z "$func_name" ]; then
          func_name="anonymous function"
        fi
      fi
      
      # Get the next 50 lines and count brackets to detect long functions
      next_50_lines=$(tail -n +$func_line_num "$file" | head -n 50)
      open_brackets=$(echo "$next_50_lines" | tr -cd '{' | wc -c)
      close_brackets=$(echo "$next_50_lines" | tr -cd '}' | wc -c)
      
      if [ $open_brackets -gt $close_brackets ]; then
        echo "- Line $func_line_num: $func_name"
      fi
    done)
    
    if [ -z "$long_functions" ]; then
      log "${GREEN}No specific long functions identified.${NC}\n"
    else
      log "$long_functions\n"
    fi
  done
else
  log "${GREEN}No large files to analyze in detail.${NC}\n"
fi

# Duplicate code analysis
log "## Potential Code Duplication\n"
log "Searching for potential code duplication patterns...\n"

# Simple approach to detect potential duplication: look for similar import patterns
log "### Similar Import Patterns\n"
similar_imports=$(find "${FRONTEND_DIR}" -type f \( -name "*.ts" -o -name "*.tsx" \) -not -path "*/node_modules/*" -not -path "*/dist/*" | xargs grep -l "^import " | xargs cat | grep "^import " | sort | uniq -c | sort -nr | head -n 20)

log "Most common import patterns (may indicate similar components that could be refactored):\n"
log "```"
echo "$similar_imports" >> "${ANALYSIS_REPORT}"
log "```\n"

# Analyze component usage patterns
log "## Component Usage Analysis\n"
log "Analyzing component usage patterns to identify optimization opportunities...\n"

# Find React components with potential performance issues
log "### React Component Optimization Opportunities\n"
log "Components that might benefit from memoization or optimization:\n"

react_components=$(find "${FRONTEND_DIR}" -type f -name "*.tsx" -not -path "*/node_modules/*" -not -path "*/dist/*" | xargs grep -l "export.* function" | xargs grep -l "useState\|useEffect")

if [ -z "$react_components" ]; then
  log "${GREEN}No React components identified for optimization.${NC}\n"
else
  log "Components with state management that may benefit from optimization:\n"
  log "```"
  echo "$react_components" >> "${ANALYSIS_REPORT}"
  log "```\n"
  
  # Analyze re-render risks
  log "Components with potential re-render performance issues (multiple state/effect hooks):\n"
  log "| File | useState Count | useEffect Count | useCallback Count |\n"
  log "|------|---------------|-----------------|-------------------|\n"
  
  for component in $react_components; do
    useState_count=$(grep -c "useState" "$component" || echo 0)
    useEffect_count=$(grep -c "useEffect" "$component" || echo 0)
    useCallback_count=$(grep -c "useCallback" "$component" || echo 0)
    
    # Only report components with multiple hooks
    if [ $useState_count -gt 2 ] || [ $useEffect_count -gt 2 ]; then
      file_path=${component#"$FRONTEND_DIR/"}
      log "| $file_path | $useState_count | $useEffect_count | $useCallback_count |\n"
    fi
  done
fi

# Summary and recommendations
log "## Summary and Recommendations\n"

# Count issues by category
eslint_issues=$(grep -c "error\|warning" "${ANALYSIS_REPORT}" || echo 0)
large_files_count=$(echo "$large_files" | wc -l)
react_components_count=$(echo "$react_components" | wc -l)

# Generate recommendations
log "### Primary Recommendations\n"

# Overall stats
total_ts_files=$(find "${FRONTEND_DIR}" -type f \( -name "*.ts" -o -name "*.tsx" \) -not -path "*/node_modules/*" -not -path "*/dist/*" | wc -l)
total_js_files=$(find "${FRONTEND_DIR}" -type f \( -name "*.js" -o -name "*.jsx" \) -not -path "*/node_modules/*" -not -path "*/dist/*" | wc -l)
total_lines_ts=$(count_files_lines "*.ts")
total_lines_tsx=$(count_files_lines "*.tsx")

log "Based on the analysis of ${total_ts_files} TypeScript files (${total_lines_ts} + ${total_lines_tsx} lines of code), we recommend the following actions:\n"

if [ $eslint_issues -gt 0 ]; then
  log "1. **Address ESLint Issues**: Fix the ${eslint_issues} ESLint warnings and errors to improve code quality.\n"
fi

if [ $large_files_count -gt 0 ]; then
  log "2. **Refactor Large Files**: Break down the ${large_files_count} identified large files into smaller, more manageable components.\n"
fi

if [ -n "$react_components" ]; then
  log "3. **Optimize React Components**: Review and optimize React components with high state/effect counts for better performance.\n"
fi

log "4. **Improve Test Coverage**: Add tests for files with low coverage to ensure code reliability.\n"

log "5. **Modernize Code**: Take advantage of Medplum v4.0.0 features to simplify and optimize code.\n"

# Final summary
log "### Conclusion\n"
log "This analysis has identified several areas for improvement as part of the Phase 7 cleanup. Addressing these issues will result in a more maintainable, efficient, and future-proof codebase following the Medplum v4.0.0 migration.\n"
log "\nAnalysis report saved to: ${ANALYSIS_REPORT}"

echo -e "\n${GREEN}✅ Code quality analysis completed!${NC}"
echo -e "${BLUE}Analysis report saved to: ${ANALYSIS_REPORT}${NC}" 