# Medplum v3.3.0 Database Migration Guide

This guide provides instructions for running the critical data migrations required in Medplum v3.3.0 before upgrading to v4.0.0.

## Important Warning

**DO NOT attempt to upgrade directly from v3.2.7 to v4.0.0 without first running the v3.3.0 data migrations.**

Attempting to run Medplum v4.0.0 without completing these migrations will result in a server crash on startup.

## Prerequisites

- PostgreSQL ≥ 13.x
- Redis ≥ 6.x
- Current Medplum version ≥ 3.2.7
- Super admin access to your Medplum instance

## Migration Process

### 1. Prepare for Migration

1. **Create Database Backup**
   
   Always create a full database backup before performing migrations:

   ```bash
   # For self-hosted PostgreSQL
   pg_dump -U [username] -d [database_name] > medplum_v3.2.7_backup.sql

   # For AWS RDS
   # Create a manual snapshot through the AWS Console
   ```

2. **Plan for Downtime**

   Migration duration depends on your database size:
   - Small deployments (< 1M resources): Seconds to minutes
   - Medium deployments (1M+ resources): Minutes
   - Large deployments (10M+ resources): Hours
   - Extra large deployments (100M+ resources): Days

   Schedule an appropriate maintenance window based on your database size.

### 2. Upgrade to v3.3.0

1. **Update Dependencies**

   Run the upgrade script provided in this repository:

   ```bash
   ./upgrade-to-v3.3.0.sh
   ```

2. **Install Updated Dependencies**

   ```bash
   npm install
   ```

3. **Deploy v3.3.0**

   Deploy the updated application with v3.3.0 dependencies to your environment.

### 3. Run Data Migrations

1. **Log in as Super Admin**

   Access your Medplum instance with a super admin account.

2. **Navigate to Admin Console**

   Go to the super admin console section of your application.

3. **Locate Migration Controls**

   Find the "Run Data Migrations" button in the admin interface.

4. **Start Migration**

   Click the "Run Data Migrations" button to initiate the process.

5. **Monitor Progress**

   - For small to medium deployments: Wait on the admin page for completion
   - For large deployments: Monitor the server logs for progress updates

6. **Verify Completion**

   The admin interface will display a success message once migrations are complete.

### 4. Troubleshooting

If you encounter issues during migration:

1. **Check Server Logs**

   Look for specific error messages in your server logs.

2. **Database Connection Issues**

   Verify that the database connection settings are correct and the database is accessible.

3. **Timeout Errors**

   For large databases, you may need to:
   - Increase timeout settings in your server configuration
   - Run migrations during off-peak hours
   - Consider breaking migrations into smaller batches (contact Medplum support)

4. **Restore From Backup**

   If migration fails and cannot be fixed:
   ```bash
   # Restore from backup
   psql -U [username] -d [database_name] < medplum_v3.2.7_backup.sql
   
   # For AWS RDS
   # Restore from snapshot through the AWS Console
   ```

## Post-Migration Verification

After completing the migrations:

1. **Test Core Functionality**

   Verify that all critical functions still work correctly:
   - Authentication and authorization
   - Resource creation, reading, updating, and deletion
   - Search operations
   - Subscriptions and integrations

2. **Check Migration Logs**

   Review logs for any warnings or issues that need to be addressed.

3. **Run Automated Tests**

   ```bash
   npm test
   ```

## Proceeding to v4.0.0

Once you have successfully:

1. Upgraded to v3.3.0
2. Completed all data migrations
3. Verified system functionality

You are ready to proceed with the v4.0.0 upgrade process.

## Support

If you encounter issues during migration that you cannot resolve, contact Medplum support or community:

- GitHub Issues: [https://github.com/medplum/medplum/issues](https://github.com/medplum/medplum/issues)
- Medplum Discord: [https://discord.gg/medplum](https://discord.gg/medplum) 