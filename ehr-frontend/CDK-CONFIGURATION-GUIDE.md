# AWS CDK Configuration Guide for Medplum v4.0.0

This guide documents the AWS CDK configuration changes required when upgrading to Medplum v4.0.0.

## System Requirements

- Node.js ≥ 20.x (previously ≥ 18.x)
- npm ≥ 10.x (previously ≥ 7.x)
- AWS CDK ≥ 2.151.0 (or latest compatible version)
- PostgreSQL ≥ 13.x (previously ≥ 12.x)
- Redis ≥ 6.x (unchanged)

## Dependency Changes

Update your CDK package dependencies to:

```json
"dependencies": {
  "@aws-sdk/types": "latest compatible version",
  "@medplum/core": "4.0.0",
  "aws-cdk-lib": "latest compatible version",
  "cdk": "latest compatible version",
  "cdk-nag": "latest compatible version",
  "constructs": "latest compatible version"
}
```

## Configuration Changes

Medplum v4.0.0 includes several changes to the CDK configuration:

### Required Updates

1. **Node.js Engine Configuration**:
   ```json
   "engines": {
     "node": ">=20.0.0"
   }
   ```

2. **Infrastructure Configuration**:
   - The `databaseProxyEndpoint` setting is now deprecated
   - Configure your database connection via `database.host` and `database.ssl.require` within Parameter Store

### Feature Flag Updates

- **Terminology Feature Flag**: The `terminologyEnabled` feature flag has been removed. Ensure that the "Rebuild ValueSets" process has been run on your production environment before upgrading to v4.0.0.

## RDS Configuration

When upgrading PostgreSQL to v13+, consider the following options:

1. **In-place upgrade**:
   - For AWS Aurora: Use the AWS console to perform a major version upgrade
   - Create a database snapshot before upgrading

2. **Blue/Green deployment**:
   - Create a new v13+ RDS instance
   - Use the AWS Database Migration Service to replicate data
   - Switch over with minimal downtime

## Testing Procedure

Before applying changes to your production environment:

1. Update CDK dependencies using the provided script:
   ```bash
   ./update-cdk-dependencies.sh
   ```

2. Test infrastructure changes in isolation:
   ```bash
   ./test-cdk-infrastructure.sh
   ```

3. Review the synthesized CloudFormation template for unexpected changes:
   ```
   cd ../cdk-test
   cat synth-output.txt
   ```

4. Deploy to a staging environment before moving to production

## Potential Breaking Changes

1. **VPC Configuration**: Double-check your VPC configuration, especially if you've customized networking aspects.

2. **Security Groups**: Verify that security group rules are preserved across the upgrade.

3. **IAM Policies**: Check for any changes in IAM policies that might restrict required permissions.

4. **Custom Resources**: Any custom resources or extensions to the CDK constructs should be tested thoroughly.

## Rollback Plan

In case of issues with the upgraded infrastructure:

1. Keep a backup of the current CloudFormation templates:
   ```bash
   aws cloudformation get-template --stack-name YOUR_STACK_NAME > template-backup.json
   ```

2. Maintain a copy of your current CDK code with all dependencies:
   ```bash
   cp -r packages/cdk packages/cdk-backup
   ```

3. Document the current infrastructure state to enable manual recovery if needed.

## Deployment Strategy

1. **Pre-Deployment**:
   - Take database snapshots
   - Validate all tests pass with the updated CDK

2. **Deployment**:
   - Schedule a maintenance window
   - Deploy the updated infrastructure
   - Monitor for any issues

3. **Post-Deployment**:
   - Verify all services are running correctly
   - Run application-level tests to ensure functionality
   - Monitor for any performance issues 