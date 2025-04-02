# Medplum Dependency Inventory for EHR-Frontend

This document catalogs all Medplum dependencies in the ehr-frontend workspace, which is critical for planning the migration from version 3.2.7 to 4.0.0.

## Core Packages

| Package | Current Version | Target Version | Usage |
|---------|----------------|----------------|-------|
| @medplum/core | 3.2.7 | 4.0.0 | Core Medplum functionality |
| @medplum/fhirtypes | 3.2.7 | 4.0.0 | TypeScript definitions for FHIR resources |
| @medplum/react | 3.2.7 | 4.0.0 | React components for Medplum |
| @medplum/mock | 3.2.7 | 4.0.0 | Testing utilities |

## Project-Specific Dependencies

| Project | Medplum Packages | Additional Notes |
|---------|-----------------|-----------------|
| core | @medplum/core, @medplum/fhirtypes, @medplum/react, @medplum/mock | Main EHR application |
| patient-intake | @medplum/core, @medplum/fhirtypes, @medplum/react | Patient onboarding flows |
| chat | @medplum/core, @medplum/fhirtypes, @medplum/react | Chat functionality |
| scheduling | @medplum/core, @medplum/fhirtypes, @medplum/react | Appointment scheduling |
| chart | @medplum/core, @medplum/fhirtypes, @medplum/react | Patient chart viewing |
| provider | @medplum/core, @medplum/fhirtypes, @medplum/react | Provider-facing views |
| photon-integration | @medplum/core, @medplum/fhirtypes | Integration with Photon |
| hello-world | @medplum/core, @medplum/fhirtypes, @medplum/react | Example app |
| eligibility | @medplum/core, @medplum/fhirtypes, @medplum/react | Insurance eligibility |
| websocket-subscriptions | @medplum/core, @medplum/fhirtypes | Real-time subscriptions |
| demo-bots | @medplum/core, @medplum/fhirtypes | Automation examples |
| fhircast | @medplum/core, @medplum/fhirtypes, @medplum/react | FHIRcast implementation |
| task | @medplum/core, @medplum/fhirtypes, @medplum/react | Task management |
| nextjs | @medplum/core, @medplum/fhirtypes, @medplum/react | Next.js integration |
| client-external-idp | @medplum/core, @medplum/fhirtypes, @medplum/react | External identity provider |
| live-chat | @medplum/core, @medplum/fhirtypes, @medplum/react | Live chat functionality |

## AWS CDK Dependencies

| Package | Current Version | Target Version | Usage |
|---------|----------------|----------------|-------|
| @medplum/cdk | 3.2.7 | 4.0.0 | AWS CDK constructs for Medplum |
| aws-cdk-lib | 2.151.0 | Latest compatible | AWS CDK library |
| cdk | 2.151.0 | Latest compatible | CDK CLI tool |
| constructs | 10.3.0 | Latest compatible | CDK constructs library |

## Node.js Runtime Requirements

| Environment | Current Version | Target Version |
|-------------|----------------|----------------|
| Node.js | >= 18.0.0 | >= 20.0.0 |
| npm | >= 7.0.0 | >= 10.0.0 |

## Usage Patterns

The following patterns will need special attention during migration:

1. **MedplumClient Usage**:
   - Core API client instances
   - Authentication flows
   - FHIR resource operations

2. **React Component Usage**:
   - Form components
   - ResourceTable
   - SearchControl
   - CodeableConceptInput
   - ResourceBadge

3. **FHIR Type Usage**:
   - Patient resources
   - Practitioner resources
   - Appointment resources
   - Questionnaire/QuestionnaireResponse resources

4. **AWS CDK Infrastructure**:
   - Storage configurations
   - Frontend deployments
   - Backend service configurations
   - Security configurations

## Migration Strategy by Component

Each component will need the following workflow:

1. **Assessment**:
   - Identify Medplum package usages
   - Identify deprecated method usages
   - Assess component test coverage

2. **Upgrade**:
   - Update to v3.3.0 first
   - Validate functionality
   - Run data migrations
   - Update to v4.0.0
   - Replace deprecated methods
   - Update type references

3. **Validation**:
   - Run component tests
   - Verify functionality matches pre-migration
   - Test integration points

## Priority Order for Migration

1. Core
2. Infrastructure (CDK)
3. Patient-facing components
4. Provider-facing components
5. Administrative components
6. Integration components 