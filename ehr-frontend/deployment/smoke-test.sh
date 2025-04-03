#!/bin/bash

# Smoke test script for EHR Frontend application
# This script runs basic functionality tests against a deployed environment

set -e  # Exit on error

# Parse command line arguments
ENV="dev"
VERBOSE=false

print_usage() {
  echo "Usage: $0 [options]"
  echo "Options:"
  echo "  --env=<environment>     Target environment (dev|staging|production)"
  echo "  --verbose               Show detailed test output"
  echo "  --help                  Show this help message"
}

for i in "$@"; do
  case $i in
    --env=*)
      ENV="${i#*=}"
      shift
      ;;
    --verbose)
      VERBOSE=true
      shift
      ;;
    --help)
      print_usage
      exit 0
      ;;
    *)
      echo "Unknown option: $i"
      print_usage
      exit 1
      ;;
  esac
done

# Configuration based on environment
case $ENV in
  "dev")
    BASE_URL="https://dev-ehr.example.com"
    ;;
  "staging")
    BASE_URL="https://staging-ehr.example.com"
    ;;
  "production")
    BASE_URL="https://ehr.example.com"
    ;;
  *)
    echo "Unknown environment: $ENV"
    print_usage
    exit 1
    ;;
esac

API_URL="${BASE_URL}/api"
TEST_USERNAME="smoke-test-user@example.com"
TEST_PASSWORD="smoke-test-password" # In real scenario, use environment variables or secure secrets

# Script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TIMESTAMP=$(date +"%Y%m%d%H%M%S")
LOG_FILE="${SCRIPT_DIR}/logs/smoke-test-${ENV}-${TIMESTAMP}.log"

# Create logs directory if it doesn't exist
mkdir -p "${SCRIPT_DIR}/logs"

# Log function
log() {
  echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

# Test function with output control
run_test() {
  local test_name="$1"
  local test_command="$2"
  
  log "Running test: $test_name"
  
  if [ "$VERBOSE" = true ]; then
    eval "$test_command" | tee -a "$LOG_FILE"
    exit_code=${PIPESTATUS[0]}
  else
    eval "$test_command" >> "$LOG_FILE" 2>&1
    exit_code=$?
  fi
  
  if [ $exit_code -eq 0 ]; then
    log "✅ PASSED: $test_name"
    return 0
  else
    log "❌ FAILED: $test_name"
    return 1
  fi
}

# Start smoke tests
log "🔥 Starting smoke tests for $ENV environment ($BASE_URL)"
log "Test timestamp: $TIMESTAMP"

# 1. Health check endpoint
run_test "Health endpoint" "curl -s -o /dev/null -w '%{http_code}' $BASE_URL/healthcheck | grep -q 200"

# 2. Static assets check
run_test "Main JavaScript bundle" "curl -s -o /dev/null -w '%{http_code}' $BASE_URL/assets/main.js | grep -q 200"
run_test "Main CSS bundle" "curl -s -o /dev/null -w '%{http_code}' $BASE_URL/assets/main.css | grep -q 200"

# 3. API health check
run_test "API health check" "curl -s -o /dev/null -w '%{http_code}' $API_URL/healthcheck | grep -q 200"

# 4. Authentication test (requires a test account)
COOKIE_JAR="/tmp/medplum-smoke-test-cookies-$TIMESTAMP.txt"

login_test() {
  # Get CSRF token
  csrf_token=$(curl -s -c "$COOKIE_JAR" "$BASE_URL/login" | grep -o 'name="csrf-token" content="[^"]*"' | sed 's/name="csrf-token" content="//' | sed 's/"$//')
  
  # Attempt login
  login_response=$(curl -s -b "$COOKIE_JAR" -c "$COOKIE_JAR" -H "Content-Type: application/json" -H "X-CSRF-Token: $csrf_token" \
    -d "{\"email\":\"$TEST_USERNAME\",\"password\":\"$TEST_PASSWORD\"}" \
    "$API_URL/auth/login")
  
  echo "$login_response" | grep -q "\"success\":true"
}

run_test "User authentication" login_test

# 5. Test accessing a protected page (requires successful login)
run_test "Protected page access" "curl -s -b \"$COOKIE_JAR\" \"$BASE_URL/patients\" | grep -q 'Patient List'"

# 6. Test a FHIR API endpoint
run_test "FHIR API access" "curl -s -b \"$COOKIE_JAR\" \"$API_URL/fhir/R4/Patient?_count=1\" | grep -q 'resourceType'"

# 7. Logout test
run_test "Logout" "curl -s -b \"$COOKIE_JAR\" -c \"$COOKIE_JAR\" \"$BASE_URL/logout\" -o /dev/null -w '%{http_code}' | grep -q '200'"

# Clean up
rm -f "$COOKIE_JAR"

# Summarize results
TESTS_TOTAL=$(grep -c 'Running test:' "$LOG_FILE")
TESTS_PASSED=$(grep -c 'PASSED:' "$LOG_FILE")
TESTS_FAILED=$(grep -c 'FAILED:' "$LOG_FILE")

log "📊 Smoke test summary:"
log "Total tests: $TESTS_TOTAL"
log "Passed: $TESTS_PASSED"
log "Failed: $TESTS_FAILED"

if [ $TESTS_FAILED -eq 0 ]; then
  log "🎉 All smoke tests passed!"
  echo "🎉 All smoke tests passed! See detailed log at: $LOG_FILE"
  exit 0
else
  log "⚠️ Some smoke tests failed. Please review the log for details."
  echo "⚠️ $TESTS_FAILED of $TESTS_TOTAL smoke tests failed. See detailed log at: $LOG_FILE"
  exit 1
fi 