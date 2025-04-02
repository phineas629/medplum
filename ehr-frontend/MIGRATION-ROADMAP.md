# Comprehensive Migration Roadmap: EHR-Frontend to Medplum v4.0.0

## Phase 1: Assessment and Planning (1-2 weeks)

### Technical Assessment
1. Conduct full dependency inventory
   - Document all @medplum/* package versions (currently at 3.2.7)
   - Identify custom integrations with Medplum API
   - Review AWS CDK infrastructure usage

### Environment Setup
1. Create staging environment for migration testing
2. Set up CI/CD pipelines for testing migrations
3. Establish rollback procedures

### Risk Assessment
1. Identify critical workflows and components
2. Document potential breaking changes impact
3. Create test cases for high-risk areas

## Phase 2: Infrastructure Preparation (2-3 weeks)

### System Dependencies Upgrade
1. Upgrade Node.js to v20+ (from current version)
2. Upgrade PostgreSQL to v13+ (if self-hosting)
3. Verify Redis version is 6+ or upgrade if needed

### AWS CDK Updates
1. Update AWS CDK library to latest version in packages/cdk
2. Review and update infrastructure configuration
3. Test infrastructure changes in isolation
4. Document configuration changes required for v4 compatibility

## Phase 3: Incremental Migration to v3.3.0 (3-4 weeks)

### Core Migration Prep
1. Create feature branch for v3.3.0 upgrade
2. Update package.json dependencies to target v3.3.0:
   ```
   "@medplum/core": "3.3.0",
   "@medplum/fhirtypes": "3.3.0",
   "@medplum/react": "3.3.0",
   "@medplum/mock": "3.3.0"
   ```

### Application Updates
1. Address TypeScript SDK changes
   - Replace deprecated methods with their alternatives
   - Update function signatures where required
   - Fix type safety issues with `getReferenceString`

### Database Migration (If Self-Hosting)
1. Run data migrations in v3.3.0 before proceeding
   - Log in as super admin
   - Navigate to admin console
   - Run data migrations
   - Monitor completion (may take minutes to days depending on database size)

### Testing
1. Run comprehensive test suite
2. Verify all FHIR operations continue to function
3. Test all integrated components and workflows

## Phase 4: Migration to v4.0.0 (3-4 weeks)

### Core Upgrade
1. Create feature branch for v4.0.0 upgrade 
2. Update package.json dependencies to v4.0.0:
   ```
   "@medplum/core": "4.0.0",
   "@medplum/fhirtypes": "4.0.0",
   "@medplum/react": "4.0.0",
   "@medplum/mock": "4.0.0",
   "@medplum/cdk": "4.0.0" (for AWS infrastructure)
   ```

### Component Library Compatibility
1. Update Mantine dependencies if needed
2. Fix any breaking changes in component props
3. Update any custom components built on Medplum components

### Code Modernization
1. Address all remaining TypeScript warnings
2. Update code for any v4.0.0-specific changes:
   - Exact matching for `_filter` search with `eq` operator
   - Control character handling in strings
   - Updated access policy methods
   - Other breaking changes from SDK

### Infrastructure Deployment
1. Update AWS CDK implementation using Medplum v4 CDK package
2. Validate infrastructure changes
3. Deploy updated infrastructure

## Phase 5: Testing and Verification (2-3 weeks)

### Comprehensive Testing
1. End-to-end testing of all application features
2. Performance testing to identify any regressions
3. Security testing of updated components
4. Load testing with production-like data

### Documentation Updates
1. Update internal documentation with new API usage
2. Document any changes to deployment procedures
3. Update architectural diagrams if needed

## Phase 6: Production Deployment (1-2 weeks)

### Deployment Planning
1. Schedule maintenance window (if needed)
2. Notify stakeholders of upcoming changes
3. Prepare rollback procedures

### Staged Rollout
1. Deploy to a subset of production environment first (if applicable)
2. Monitor for any issues
3. Complete full production deployment

### Post-Deployment
1. Monitor application metrics and logs
2. Verify functionality across all components
3. Address any issues that arise

## Phase 7: Cleanup and Future-Proofing (1-2 weeks)

### Code Cleanup
1. Remove any migration-specific code
2. Address technical debt accumulated during migration
3. Optimize for new version features

### Documentation Finalization
1. Update all documentation to reflect v4.0.0
2. Document lessons learned from migration
3. Create maintenance plan for future upgrades

### Knowledge Sharing
1. Conduct team training on new features
2. Share migration experience and best practices

## Total Timeline: 13-20 weeks

## Appendix A: Deprecated Method Replacements

| Old Method                   | Replacement/Alternative                                |
| ---------------------------- | ------------------------------------------------------ |
| matchesAccessPolicy          | satisfiedAccessPolicy                                  |
| searchValueSet               | valueSetExpand                                         |
| uploadMedia                  | createMedia                                            |
| parseSearchUrl               | parseSearchRequest                                     |
| parseSearchDefinition        | parseSearchRequest                                     |
| parseCriteriaAsSearchRequest | parseSearchRequest                                     |
| crawlResource                | crawlTypedValue                                        |
| crawlResourceAsync           | crawlTypedValueAsync                                   |
| ResourceVisitor              | CrawlerVisitor                                         |
| AsyncResourceVisitor         | AsyncCrawlerVisitor                                    |
| HL7 get and getAll           | getSegment, getField, getComponent (context-dependent) |
| createAttachment (overloads) | Function signature changed, but function remains.      |
| createBinary (overloads)     | Function signature changed, but function remains.      |
| createPdf (overloads)        | Function signature changed, but function remains.      |

## Appendix B: System Requirements

| Component   | v3.2.7 Minimum | v4.0.0 Minimum |
|-------------|----------------|----------------|
| Node.js     | 16+            | 20+            |
| npm         | 7+             | 10+            |
| PostgreSQL  | 12+            | 13+            |
| Redis       | 6+             | 6+             | 