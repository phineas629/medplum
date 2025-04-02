# Infrastructure Preparation Checklist

Use this checklist to track progress through the infrastructure preparation phase of the Medplum v4.0.0 migration.

## System Dependencies

- [ ] Update Node.js to v20+ (Required for Medplum v4.0.0)
  - Current version: v18.18.0
  - Target version: v20.x+
  - Command: `./update-node-version.sh`
  - Completed by: ___________________ on ___/___/_____

- [ ] Update npm to v10+ (Required for Medplum v4.0.0)
  - Current version: 9.8.1
  - Target version: v10.x+
  - Command: `npm install -g npm@10`
  - Completed by: ___________________ on ___/___/_____

- [ ] Verify PostgreSQL version ≥ 13.x (Required for Medplum v4.0.0)
  - Current version: _________________
  - Target version: v13.x+
  - Command: `./check-database-versions.sh`
  - Notes: _________________________________________________
  - Completed by: ___________________ on ___/___/_____

- [ ] Verify Redis version ≥ 6.x (Required for Medplum v4.0.0)
  - Current version: _________________
  - Target version: v6.x+
  - Command: `./check-database-versions.sh`
  - Notes: _________________________________________________
  - Completed by: ___________________ on ___/___/_____

## AWS CDK Updates

- [ ] Update AWS CDK dependencies
  - Current version: aws-cdk-lib 2.151.0
  - Updated version: _________________
  - Command: `./update-cdk-dependencies.sh`
  - Completed by: ___________________ on ___/___/_____

- [ ] Update CDK Node.js engine requirements to v20+
  - Command: `./update-cdk-dependencies.sh` (included in script)
  - Completed by: ___________________ on ___/___/_____

- [ ] Test CDK changes in isolation
  - Command: `./test-cdk-infrastructure.sh`
  - Results: [ ] Success [ ] Failure
  - Issues found: _________________________________________________
  - Completed by: ___________________ on ___/___/_____

## Configuration Updates

- [ ] Update infrastructure configuration to remove deprecated settings
  - Command: Review and update config files manually
  - Changes made:
    - [ ] Removed `databaseProxyEndpoint` setting
    - [ ] Configured database connection via Parameter Store
    - [ ] Other changes: _______________________________
  - Completed by: ___________________ on ___/___/_____

- [ ] Run "Rebuild ValueSets" process (if using terminology features)
  - Location: Super admin console
  - Notes: _________________________________________________
  - Completed by: ___________________ on ___/___/_____

## Database Preparation

- [ ] Create database backup before migration
  - Backup location: _______________________________
  - Backup method used: [ ] AWS Snapshot [ ] pg_dump [ ] Other: ___________
  - Completed by: ___________________ on ___/___/_____

- [ ] Plan PostgreSQL upgrade to v13+ (if required)
  - Upgrade method: [ ] In-place upgrade [ ] Blue/Green deployment
  - Scheduled date: ___/___/_____
  - Maintenance window: _______________________________
  - Completed by: ___________________ on ___/___/_____

## Testing

- [ ] Test synthesized CloudFormation template for unexpected changes
  - Command: `cat ../cdk-test/synth-output.txt`
  - Issues found: _________________________________________________
  - Completed by: ___________________ on ___/___/_____

- [ ] Deploy updated infrastructure to staging environment
  - Staging environment name: _______________________________
  - Deployment date: ___/___/_____
  - Results: [ ] Success [ ] Failure
  - Issues found: _________________________________________________
  - Completed by: ___________________ on ___/___/_____

## Rollback Preparation

- [ ] Backup current CloudFormation templates
  - Command: `aws cloudformation get-template --stack-name YOUR_STACK_NAME > template-backup.json`
  - Backup location: _______________________________
  - Completed by: ___________________ on ___/___/_____

- [ ] Backup current CDK code with dependencies
  - Command: `cp -r packages/cdk packages/cdk-backup`
  - Completed by: ___________________ on ___/___/_____

- [ ] Document current infrastructure state
  - Documentation location: _______________________________
  - Completed by: ___________________ on ___/___/_____

## Final Verification

- [ ] All system dependencies meet v4.0.0 requirements
- [ ] AWS CDK updates have been tested and verified
- [ ] Configuration updates have been applied
- [ ] Database preparation is complete
- [ ] Rollback plan is in place

## Notes

_____________________________________________________________________
_____________________________________________________________________
_____________________________________________________________________

## Next Phase: Incremental Migration to v3.3.0

Once all items on this checklist are complete, proceed to the next phase: Incremental Migration to v3.3.0. 