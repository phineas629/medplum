#!/bin/bash

# Script to check PostgreSQL and Redis versions for Medplum v4.0.0 compatibility
echo "Checking database system versions for Medplum v4.0.0 compatibility..."

echo "-----------------------"
echo "PostgreSQL Requirements"
echo "-----------------------"
echo "Medplum v4.0.0 requires PostgreSQL 13+."

# Try to check PostgreSQL version
if command -v psql &> /dev/null; then
  pg_version=$(psql --version | awk '{print $3}')
  echo "Detected PostgreSQL version: $pg_version"
  
  # Extract major version number
  major_version=$(echo $pg_version | cut -d. -f1)
  
  if [ "$major_version" -ge 13 ]; then
    echo "✓ PostgreSQL version is compatible with Medplum v4.0.0"
  else
    echo "✗ PostgreSQL version needs upgrade to version 13+ for Medplum v4.0.0 compatibility"
    echo "Upgrade recommendations:"
    echo "  - For self-hosted environments: https://www.postgresql.org/docs/current/upgrading.html"
    echo "  - For AWS RDS: Use AWS console to upgrade the PostgreSQL instance"
    echo "  - For AWS Aurora: https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/AuroraPostgreSQL.Updates.html"
  fi
else
  echo "PostgreSQL not found in PATH. Unable to determine version."
  echo "If you're using a managed PostgreSQL service, please verify your database version."
fi

echo ""
echo "-----------------"
echo "Redis Requirements"
echo "-----------------"
echo "Medplum v4.0.0 requires Redis 6+."

# Try to check Redis version
if command -v redis-cli &> /dev/null; then
  redis_version=$(redis-cli --version | awk '{print $2}' | cut -d= -f2)
  echo "Detected Redis version: $redis_version"
  
  # Extract major version number
  major_version=$(echo $redis_version | cut -d. -f1)
  
  if [ "$major_version" -ge 6 ]; then
    echo "✓ Redis version is compatible with Medplum v4.0.0"
  else
    echo "✗ Redis version needs upgrade to version 6+ for Medplum v4.0.0 compatibility"
    echo "Upgrade recommendations:"
    echo "  - For self-hosted Redis: https://redis.io/topics/upgrade"
    echo "  - For AWS ElastiCache: Use AWS console to upgrade the Redis cluster"
  fi
else
  echo "Redis CLI not found in PATH. Unable to determine version."
  echo "If you're using a managed Redis service, please verify your Redis version."
fi

echo ""
echo "Database version check completed."
echo "Ensure all database systems meet the minimum requirements for Medplum v4.0.0."
echo ""
echo "Important: Before upgrading to Medplum v4.0.0, you must:"
echo "1. Ensure PostgreSQL is version 13+"
echo "2. Ensure Redis is version 6+"
echo "3. Take database backups before any migration"
echo "4. Run v3.3.0 data migrations before upgrading to v4.0.0" 