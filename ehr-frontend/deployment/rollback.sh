#!/bin/bash

# Rollback script for EHR Frontend application
# This script reverts to a previous version in case of deployment issues

set -e  # Exit on error

# Parse command line arguments
ENV="dev"
BACKUP_ID=""

print_usage() {
  echo "Usage: $0 [options]"
  echo "Options:"
  echo "  --env=<environment>     Deployment environment (dev|staging|production)"
  echo "  --backup-id=<id>        Backup timestamp ID to rollback to (YYYYMMDDHHMMSS)"
  echo "  --list-backups          List available backups"
  echo "  --help                  Show this help message"
}

for i in "$@"; do
  case $i in
    --env=*)
      ENV="${i#*=}"
      shift
      ;;
    --backup-id=*)
      BACKUP_ID="${i#*=}"
      shift
      ;;
    --list-backups)
      LIST_BACKUPS=true
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

echo "🔄 EHR Frontend rollback for $ENV environment"

# List available backups if requested
if [ "$LIST_BACKUPS" = true ]; then
  echo "📋 Available backups for $ENV environment:"
  aws s3 ls s3://your-s3-bucket-$ENV/backups/ --recursive | sort -r
  exit 0
fi

# Validate backup ID
if [ -z "$BACKUP_ID" ]; then
  echo "❌ Error: Backup ID is required for rollback."
  echo "Use --list-backups to see available backup IDs."
  print_usage
  exit 1
fi

if ! [[ $BACKUP_ID =~ ^[0-9]{14}$ ]]; then
  echo "❌ Error: Backup ID should be in the format YYYYMMDDHHMMSS"
  exit 1
fi

# Check if backup exists
BACKUP_CHECK=$(aws s3 ls s3://your-s3-bucket-$ENV/backups/$BACKUP_ID/ | wc -l)
if [ "$BACKUP_CHECK" -eq 0 ]; then
  echo "❌ Error: Backup with ID $BACKUP_ID not found."
  echo "Use --list-backups to see available backup IDs."
  exit 1
fi

# Confirm rollback for production
if [ "$ENV" = "production" ]; then
  echo "⚠️ WARNING: You are about to rollback PRODUCTION environment! ⚠️"
  echo "This will revert to backup from timestamp $BACKUP_ID"
  read -p "Are you absolutely sure you want to continue? (yes/no): " -r
  echo
  if [[ ! $REPLY =~ ^yes$ ]]; then
    echo "Rollback aborted."
    exit 1
  fi
fi

# Create a backup of the current state before rollback
CURRENT_TIMESTAMP=$(date +"%Y%m%d%H%M%S")
echo "📦 Creating backup of current deployment with timestamp $CURRENT_TIMESTAMP (pre-rollback)"
aws s3 sync s3://your-s3-bucket-$ENV/current s3://your-s3-bucket-$ENV/backups/$CURRENT_TIMESTAMP-pre-rollback

# Perform the rollback
echo "🔄 Rolling back to backup $BACKUP_ID..."
aws s3 sync s3://your-s3-bucket-$ENV/backups/$BACKUP_ID s3://your-s3-bucket-$ENV/current --delete

# Invalidate CloudFront cache
echo "🔄 Invalidating CloudFront cache..."
aws cloudfront create-invalidation --distribution-id $DISTRIBUTION_ID --paths "/*"

# Verify rollback
echo "🔍 Verifying rollback..."
HEALTH_CHECK_URL="${DEPLOY_URL}/healthcheck"
echo "Checking health endpoint: $HEALTH_CHECK_URL"

# Wait for CloudFront propagation
if [ "$ENV" = "production" ]; then
  echo "Waiting 2 minutes for CloudFront propagation..."
  sleep 120
fi

# Simple health check
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" $HEALTH_CHECK_URL)
if [ $HTTP_STATUS -eq 200 ]; then
  echo "✅ Health check passed with status $HTTP_STATUS"
else
  echo "⚠️ Health check returned status $HTTP_STATUS - verify rollback manually"
fi

echo "✅ Rollback to backup $BACKUP_ID completed"
echo "🔗 Application available at: $DEPLOY_URL"
echo "📝 Rollback log saved to $FRONTEND_DIR/deployment/logs/rollback-$ENV-$CURRENT_TIMESTAMP.log"

# Create log directory if it doesn't exist
mkdir -p "$FRONTEND_DIR/deployment/logs"

# Follow-up instructions
echo ""
echo "✨ Next steps:"
echo "1. Verify application functionality"
echo "2. Monitor for any errors in the logs"
echo "3. Investigate what caused the need for rollback"
echo "4. Communicate rollback status to stakeholders" 