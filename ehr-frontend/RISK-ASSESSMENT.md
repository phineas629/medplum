# Medplum Migration Risk Assessment

## Critical Components

| Component | Risk Level | Impact | Mitigation |
|-----------|------------|--------|------------|
| Core FHIR Operations | High | Data retrieval and storage failures | Comprehensive testing before and after migration |
| Search functionality | Medium | Search results may differ with v4.0.0 due to `eq` operator changes | Test with both exact and partial matches |
| Reference handling | High | `getReferenceString` changes could break reference handling | Update code to ensure references contain required properties |
| AWS CDK Infrastructure | High | Infrastructure deployment failures | Incremental updates with backup strategy |
| Component dependencies | Medium | UI component changes may break layout/functionality | Develop comprehensive test suite for UI components |
| Authentication | High | Auth failures would prevent system access | Test auth flows in staging environment |

## Deprecated Methods

The following methods are deprecated in v4.0.0 and will need to be replaced:

| Old Method | Replacement | Files Affected | Priority |
|------------|-------------|----------------|----------|
| matchesAccessPolicy | satisfiedAccessPolicy | TBD | Medium |
| searchValueSet | valueSetExpand | TBD | Medium |
| uploadMedia | createMedia | TBD | Medium |
| parseSearchUrl | parseSearchRequest | TBD | Medium |
| parseSearchDefinition | parseSearchRequest | TBD | Low |
| parseCriteriaAsSearchRequest | parseSearchRequest | TBD | Low |
| crawlResource | crawlTypedValue | TBD | Medium |
| crawlResourceAsync | crawlTypedValueAsync | TBD | Medium |
| ResourceVisitor | CrawlerVisitor | TBD | Low |
| AsyncResourceVisitor | AsyncCrawlerVisitor | TBD | Low |
| HL7 get and getAll | getSegment, getField, getComponent | TBD | High |
| createAttachment (overloads) | Updated signature | TBD | Medium |
| createBinary (overloads) | Updated signature | TBD | Medium |
| createPdf (overloads) | Updated signature | TBD | Medium |

## System Requirements Changes

| Component | v3.2.7 Minimum | v4.0.0 Minimum | Migration Plan |
|-----------|----------------|----------------|----------------|
| Node.js | 16+ | 20+ | Upgrade Node.js version |
| npm | 7+ | 10+ | Upgrade npm version |
| PostgreSQL | 12+ | 13+ | Schedule database upgrade |
| Redis | 6+ | 6+ | No change required |

## Rollback Strategy

1. **Code Rollback**: 
   - Maintain git branches for each migration step
   - Create tag points at stable versions
   - Prepare rollback scripts to revert dependencies

2. **Database Rollback**:
   - Create database snapshots before v3.3.0 migration
   - Create snapshots before v4.0.0 migration
   - Test restore procedures before migration

3. **Infrastructure Rollback**:
   - Document current infrastructure state
   - Create CDK snapshot of current deployment
   - Prepare rollback deployment script

## Test Case Priority

1. **High Priority Tests**:
   - FHIR resource CRUD operations
   - Authentication and authorization
   - Reference handling
   - Search operations with filters
   - AWS CDK deployment

2. **Medium Priority Tests**:
   - UI component rendering
   - Form submissions
   - Batch operations
   - File uploads and downloads

3. **Low Priority Tests**:
   - Cosmetic UI elements
   - Non-critical reporting functionality
   - Administrative utilities

## Timeline Risks

- Database migration time could exceed estimates for large datasets
- Unforeseen compatibility issues with custom components
- External system integration failures
- AWS infrastructure changes requiring additional permissions

## Contingency Planning

1. **Extended Maintenance Window**:
   - Prepare for maintenance window extension if needed
   - Communicate potential timeline extensions to stakeholders

2. **Phased Rollout**:
   - Prepare for partial rollout to subset of services
   - Plan isolation strategy for components 