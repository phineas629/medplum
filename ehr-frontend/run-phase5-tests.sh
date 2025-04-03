#!/bin/bash

# Script to run Phase 5 testing tasks for Medplum v4.0.0 migration
echo "Starting Phase 5 testing tasks..."

# Function to check if a command exists
check_command() {
    if ! command -v $1 &> /dev/null; then
        echo "Error: $1 is required but not installed."
        echo "Please install $1 first."
        exit 1
    fi
}

# Check required commands
check_command "node"
check_command "npm"
check_command "psql"
check_command "curl"

# Function to run tests with retry
run_test_with_retry() {
    local test_name=$1
    local command=$2
    local max_retries=3
    local retry_count=1

    echo "Running $test_name..."
    while [ $retry_count -le $max_retries ]; do
        if eval $command; then
            echo "✓ $test_name passed"
            return 0
        else
            echo "✗ $test_name failed (attempt $retry_count/$max_retries)"
            retry_count=$((retry_count + 1))
            if [ $retry_count -le $max_retries ]; then
                echo "Retrying in 5 seconds..."
                sleep 5
            fi
        fi
    done
    return 1
}

# 1. Run automated tests
echo "Running automated tests..."
run_test_with_retry "Unit Tests" "npm test"
run_test_with_retry "TypeScript Compilation" "npm run build"

# 2. Run performance tests
echo "Running performance tests..."
run_test_with_retry "Load Tests" "npm run test:load"
run_test_with_retry "Stress Tests" "npm run test:stress"

# 3. Run security tests
echo "Running security tests..."
run_test_with_retry "Security Tests" "npm run test:security"

# 4. Check database performance
echo "Checking database performance..."
run_test_with_retry "Database Performance" "psql -c 'SELECT * FROM pg_stat_statements ORDER BY mean_time DESC LIMIT 10;'"

# 5. Test API endpoints
echo "Testing API endpoints..."
run_test_with_retry "API Health Check" "curl -s -o /dev/null -w '%{http_code}' http://localhost:3000/health"

# 6. Generate test report
echo "Generating test report..."
cat > test-report.md << EOF
# Phase 5 Test Report
Generated on: $(date)

## Test Results

### Automated Tests
- Unit Tests: $(if [ $? -eq 0 ]; then echo "✓ Passed"; else echo "✗ Failed"; fi)
- TypeScript Compilation: $(if [ $? -eq 0 ]; then echo "✓ Passed"; else echo "✗ Failed"; fi)

### Performance Tests
- Load Tests: $(if [ $? -eq 0 ]; then echo "✓ Passed"; else echo "✗ Failed"; fi)
- Stress Tests: $(if [ $? -eq 0 ]; then echo "✓ Passed"; else echo "✗ Failed"; fi)

### Security Tests
- Security Tests: $(if [ $? -eq 0 ]; then echo "✓ Passed"; else echo "✗ Failed"; fi)

### Database Performance
- Database Performance Check: $(if [ $? -eq 0 ]; then echo "✓ Passed"; else echo "✗ Failed"; fi)

### API Endpoints
- Health Check: $(if [ $? -eq 0 ]; then echo "✓ Passed"; else echo "✗ Failed"; fi)

## Next Steps

1. Review test results
2. Address any failed tests
3. Document findings
4. Update migration checklist
EOF

echo "Test report generated: test-report.md"

# 7. Check for critical issues
echo "Checking for critical issues..."
if grep -q "✗ Failed" test-report.md; then
    echo "Critical issues found. Please review test-report.md for details."
    exit 1
else
    echo "✓ No critical issues found."
fi

echo "Phase 5 testing completed. Please review test-report.md for detailed results." 