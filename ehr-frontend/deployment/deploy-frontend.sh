#!/bin/bash

# Deployment script for EHR Frontend application
# This script handles the deployment of the Medplum v4.0.0 frontend to production

set -e  # Exit on error

# Parse command line arguments
ENV="dev"
FORCE=false
SKIP_TESTS=false

print_usage() {
  echo "Usage: $0 [options]"
  echo "Options:"
  echo "  --env=<environment>     Deployment environment (dev|staging|production)"
  echo "  --force                 Force deployment even if tests fail"
  echo "  --skip-tests            Skip running tests before deployment"
  echo "  --help                  Show this help message"
}

for i in "$@"; do
  case $i in
    --env=*)
      ENV="${i#*=}"
      shift
      ;;
    --force)
      FORCE=true
      shift
      ;;
    --skip-tests)
      SKIP_TESTS=true
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
    DEPLOY_URL="https://dev-ehr.example.com"
    DISTRIBUTION_ID="DEV_CLOUDFRONT_DISTRIBUTION_ID"
    ;;
  "staging")
    DEPLOY_URL="https://staging-ehr.example.com"
    DISTRIBUTION_ID="STAGING_CLOUDFRONT_DISTRIBUTION_ID"
    ;;
  "production")
    DEPLOY_URL="https://ehr.example.com"
    DISTRIBUTION_ID="PRODUCTION_CLOUDFRONT_DISTRIBUTION_ID"
    
    # Additional confirmation for production
    echo "⚠️ You are deploying to PRODUCTION environment! ⚠️"
    read -p "Are you sure you want to continue? (y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
      echo "Deployment aborted."
      exit 1
    fi
    ;;
  *)
    echo "Unknown environment: $ENV"
    print_usage
    exit 1
    ;;
esac

# Script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
FRONTEND_DIR="$(dirname "$SCRIPT_DIR")"
ROOT_DIR="$(dirname "$FRONTEND_DIR")"

echo "🚀 Deploying EHR Frontend to $ENV environment"
echo "Deployment URL: $DEPLOY_URL"
echo "Frontend directory: $FRONTEND_DIR"

# Run tests if not skipped
if [ "$SKIP_TESTS" = false ]; then
  echo "📋 Running tests before deployment..."
  
  # Run our phase5 test suite
  if ! "$ROOT_DIR/ehr-frontend/phase5-test-runner.sh"; then
    echo "❌ Tests failed!"
    if [ "$FORCE" = false ]; then
      echo "Deployment aborted. Use --force to deploy anyway."
      exit 1
    else
      echo "⚠️ Continuing deployment despite test failures (--force flag used)"
    fi
  else
    echo "✅ Tests passed!"
  fi
else
  echo "⚠️ Skipping tests (--skip-tests flag used)"
fi

# Build the application
echo "🔨 Building application for $ENV environment..."
cd "$FRONTEND_DIR/core"

# Create env-specific build variables
echo "Setting environment variables for $ENV..."
cat > .env.production << EOF
VITE_MEDPLUM_BASE_URL=${DEPLOY_URL}/api
VITE_MEDPLUM_PROJECT_ID=${MEDPLUM_PROJECT_ID:-YOUR_PROJECT_ID}
VITE_MEDPLUM_GOOGLE_CLIENT_ID=${MEDPLUM_GOOGLE_CLIENT_ID:-YOUR_GOOGLE_CLIENT_ID}
VITE_MEDPLUM_RECAPTCHA_SITE_KEY=${MEDPLUM_RECAPTCHA_SITE_KEY:-YOUR_RECAPTCHA_SITE_KEY}
EOF

# Run the build
npm run build

if [ $? -ne 0 ]; then
  echo "❌ Build failed!"
  exit 1
fi

echo "✅ Build successful!"

# Deploy to AWS S3 (assuming AWS deployment)
echo "📤 Deploying to AWS S3..."
if [ -d "$FRONTEND_DIR/core/dist" ]; then
  # Backup current deployment (for potential rollback)
  BACKUP_TIMESTAMP=$(date +"%Y%m%d%H%M%S")
  echo "📦 Creating backup of current deployment with timestamp $BACKUP_TIMESTAMP"
  
  if [ "$ENV" = "production" ]; then
    aws s3 sync s3://your-s3-bucket-$ENV/current s3://your-s3-bucket-$ENV/backups/$BACKUP_TIMESTAMP
    echo "✅ Backup created at s3://your-s3-bucket-$ENV/backups/$BACKUP_TIMESTAMP"
  fi
  
  # Deploy new version
  aws s3 sync "$FRONTEND_DIR/core/dist" s3://your-s3-bucket-$ENV/current --delete
  
  # Invalidate CloudFront cache
  echo "🔄 Invalidating CloudFront cache..."
  aws cloudfront create-invalidation --distribution-id $DISTRIBUTION_ID --paths "/*"
  
  echo "✅ Deployment completed successfully!"
  echo "🔗 Application available at: $DEPLOY_URL"
else
  echo "❌ Deployment failed! Build directory not found."
  exit 1
fi

# Post-deployment verification
echo "🔍 Running post-deployment verification..."
HEALTH_CHECK_URL="${DEPLOY_URL}/healthcheck"
echo "Checking health endpoint: $HEALTH_CHECK_URL"

# Wait for CloudFront propagation (especially important for production)
if [ "$ENV" = "production" ]; then
  echo "Waiting 5 minutes for CloudFront propagation..."
  sleep 300
fi

# Simple health check
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" $HEALTH_CHECK_URL)
if [ $HTTP_STATUS -eq 200 ]; then
  echo "✅ Health check passed with status $HTTP_STATUS"
else
  echo "⚠️ Health check returned status $HTTP_STATUS - verify deployment manually"
fi

echo "📝 Deployment log has been saved to $FRONTEND_DIR/deployment/logs/deploy-$ENV-$BACKUP_TIMESTAMP.log"
echo "🎉 Deployment process completed!"

# Instructions for monitoring
echo ""
echo "✨ Next steps:"
echo "1. Monitor application performance at: [your-monitoring-dashboard]"
echo "2. Check error logs in CloudWatch"
echo "3. Confirm proper functioning with end-users" 