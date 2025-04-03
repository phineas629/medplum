#!/bin/bash

# Phase 5 Test Runner for Medplum v4.0.0 Migration
# This script runs comprehensive tests to validate the migration to Medplum v4.0.0

set -e  # Exit on error

# Configuration
export NODE_OPTIONS="--max-old-space-size=4096"  # Increase memory for Node.js
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"
REPORT_DIR="${ROOT_DIR}/test-reports"
TIMESTAMP=$(date +"%Y%m%d-%H%M%S")
REPORT_FILE="${REPORT_DIR}/phase5-test-report-${TIMESTAMP}.md"

# Check environment
echo "🔍 Checking environment..."
if [[ $(node -v) != v20* ]]; then
  echo "❌ Error: Node.js v20+ is required for Medplum v4.0.0"
  echo "Current version: $(node -v)"
  echo "Please install or use Node.js v20+"
  exit 1
fi

# Create report directory
mkdir -p "${REPORT_DIR}"

# Start test report
cat > "${REPORT_FILE}" << EOF
# Phase 5 Test Report - Medplum v4.0.0 Migration
Generated: $(date)

## Environment
- Node.js: $(node -v)
- npm: $(npm -v)
- OS: $(uname -s) $(uname -r)

## Test Results
EOF

# Function to run tests and record results
run_test() {
  local test_name="$1"
  local test_command="$2"
  local test_dir="$3"
  
  echo "🧪 Running ${test_name}..."
  echo "### ${test_name}" >> "${REPORT_FILE}"
  echo '```bash' >> "${REPORT_FILE}"
  echo "$ ${test_command}" >> "${REPORT_FILE}"
  
  pushd "${test_dir}" > /dev/null
  if ${test_command} >> "${REPORT_FILE}" 2>&1; then
    echo '```' >> "${REPORT_FILE}"
    echo "✅ **PASSED**" >> "${REPORT_FILE}"
    echo -e "\n" >> "${REPORT_FILE}"
    echo "✅ ${test_name} passed"
    result=0
  else
    echo '```' >> "${REPORT_FILE}"
    echo "❌ **FAILED**" >> "${REPORT_FILE}"
    echo -e "\n" >> "${REPORT_FILE}"
    echo "❌ ${test_name} failed"
    result=1
  fi
  popd > /dev/null
  return $result
}

# Run tests
echo "🚀 Starting Phase 5 tests..."

# 1. Unit Tests
run_test "Core Unit Tests" "npx vitest run" "${SCRIPT_DIR}/core" || true

# 2. API Compatibility Tests
run_test "Medplum v4.0.0 API Tests" "npx vitest run src/__tests__/MedplumApiV4.test.ts" "${SCRIPT_DIR}/core" || true

# 3. TypeScript Compilation
run_test "TypeScript Compilation Check" "tsc --noEmit" "${SCRIPT_DIR}/core" || true

# 4. Dependency Checks
run_test "Dependency Check" "npm list @medplum/core @medplum/react @medplum/fhirtypes" "${SCRIPT_DIR}/core" || true

# 5. Environment Variables
echo "### Environment Variables" >> "${REPORT_FILE}"
echo '```' >> "${REPORT_FILE}"
echo "Checking for required environment variables in code..." >> "${REPORT_FILE}"
grep -r "import.meta.env" --include="*.ts" --include="*.tsx" "${SCRIPT_DIR}/core/src" >> "${REPORT_FILE}" 2>&1 || true
echo '```' >> "${REPORT_FILE}"
echo -e "\n" >> "${REPORT_FILE}"

# 6. Check for Deprecated Methods
if [ -f "${SCRIPT_DIR}/verify-deprecated-methods.sh" ]; then
  run_test "Deprecated Methods Check" "${SCRIPT_DIR}/verify-deprecated-methods.sh" "${ROOT_DIR}" || true
fi

# Summary
echo "### Test Summary" >> "${REPORT_FILE}"
PASS_COUNT=$(grep -c "✅ \*\*PASSED\*\*" "${REPORT_FILE}" || echo 0)
FAIL_COUNT=$(grep -c "❌ \*\*FAILED\*\*" "${REPORT_FILE}" || echo 0)
TOTAL_COUNT=$((PASS_COUNT + FAIL_COUNT))

echo "- Total Tests: ${TOTAL_COUNT}" >> "${REPORT_FILE}"
echo "- Passed: ${PASS_COUNT}" >> "${REPORT_FILE}"
echo "- Failed: ${FAIL_COUNT}" >> "${REPORT_FILE}"
echo -e "\n" >> "${REPORT_FILE}"

# Recommendations
echo "## Recommendations" >> "${REPORT_FILE}"
if [ ${FAIL_COUNT} -gt 0 ]; then
  echo "⚠️ Some tests failed. Review the test report for details and address issues before proceeding to production deployment." >> "${REPORT_FILE}"
else
  echo "✅ All tests passed. Ready to proceed to Phase 6: Production Deployment." >> "${REPORT_FILE}"
fi

echo "📝 Test report generated: ${REPORT_FILE}"

if [ ${FAIL_COUNT} -gt 0 ]; then
  echo "⚠️ ${FAIL_COUNT} tests failed. Review the report for details."
  exit 1
else
  echo "✅ All tests passed!"
  exit 0
fi 