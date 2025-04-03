# Medplum v4.0.0: What's New
## Team Training Presentation

---

## Agenda

1. Migration Overview
2. New Features
3. API Changes
4. Performance Improvements
5. Best Practices
6. Q&A

---

## Migration Overview

- **7-Phase Project**
  - Assessment & Planning
  - Infrastructure Preparation
  - Incremental Migration to v3.3.0
  - Migration to v4.0.0
  - Testing & Verification
  - Production Deployment
  - Cleanup & Future-Proofing

- **Key Metrics**
  - Timeline: Completed in 16 weeks
  - Codebase Changes: ~50 files modified
  - Test Coverage: Increased to 80%+

---

## What's New in v4.0.0?

### Core Improvements

- Enhanced TypeScript type safety
- Modernized API methods
- Improved function signatures
- Better error handling
- Enhanced search capabilities
- Performance optimizations

---

## API Changes: Method Renames

| Old Method (v3) | New Method (v4) | Purpose |
|-----------------|-----------------|---------|
| matchesAccessPolicy | satisfiedAccessPolicy | Check access policy |
| searchValueSet | valueSetExpand | Expand ValueSet |
| uploadMedia | createMedia | Create Media resource |
| parseSearchUrl, parseSearchDefinition, parseCriteriaAsSearchRequest | parseSearchRequest | Parse search params |
| crawlResource | crawlTypedValue | Traverse resources |
| ResourceVisitor | CrawlerVisitor | Visitor interface |

---

## API Changes: Function Signatures

### Object Parameters Style

```typescript
// OLD (v3.x.x)
const attachment = await medplum.createAttachment(
  data,
  'filename.pdf',
  'application/pdf',
  onProgressCallback
);

// NEW (v4.0.0)
const attachment = await medplum.createAttachment({
  data: pdfData,
  filename: 'filename.pdf',
  contentType: 'application/pdf',
  onProgress: onProgressCallback
});
```

---

## Enhanced Search Capabilities

```typescript
// More precise filtering with $eq operator
const patients = await medplum.search('Patient', {
  name: { $eq: 'Smith' }  // Exact match
});

// Multiple criteria with various operators
const observations = await medplum.search('Observation', {
  subject: 'Patient/' + patientId,
  code: { $contains: 'glucose' },
  date: { $gt: '2023-01-01' }
});
```

---

## Enhanced Type Safety

```typescript
// v3.x.x - No warnings for potential undefined
const patient = await medplum.readResource('Patient', id);
const name = patient.name[0];
const family = name.family;

// v4.0.0 - Type-safe access with optional chaining
const patient = await medplum.readResource('Patient', id);
const family = patient.name?.[0]?.family;
```

---

## New Utility Functions

```typescript
// Format FHIR dateTime values
const formattedDate = formatFhirDateTime(new Date());

// Parse FHIR dateTime strings
const date = parseFhirDateTime('2023-04-05T14:30:00Z');

// Get extension values easily
const extension = getExtensionValue(
  patient, 
  'http://example.org/custom-extension'
);

// Create references easily
const reference = createReference(patient);
```

---

## React Component Improvements

- **Enhanced Form Components**
  - Better validation
  - Improved error handling
  - Accessibility enhancements

- **Data Display Components**
  - More flexible tables
  - Better responsive design
  - Enhanced Timeline component

- **Authentication Flows**
  - Improved OAuth integration
  - Better session management

---

## Performance Improvements

- **Smaller Bundle Size**
  - Reduced from ~XXkB to ~YYkB
  - Better tree-shaking
  - Reduced dependencies

- **Faster Operations**
  - Improved FHIR resource handling
  - Better caching
  - Reduced network requests

- **Rendering Optimizations**
  - Fewer unnecessary re-renders
  - More efficient component updates

---

## Best Practices for v4.0.0

1. **Use Object Parameters**
   ```typescript
   medplum.createBinary({ data, filename, contentType });
   ```

2. **Leverage Enhanced Search**
   ```typescript
   // Use $eq, $contains, $gt, etc.
   const results = await medplum.search('Patient', {
     identifier: { $eq: 'MRN123' }
   });
   ```

3. **Use Optional Chaining**
   ```typescript
   const phoneNumber = patient.telecom?.find(
     t => t.system === 'phone'
   )?.value;
   ```

---

## Best Practices (continued)

4. **Use New Utility Functions**
   ```typescript
   import { formatFhirDateTime } from '@medplum/core';
   ```

5. **Optimize React Components**
   - Use React.memo for pure components
   - Use useCallback for event handlers
   - Consider useMemo for expensive calculations

6. **Follow Type Safety**
   - Let TypeScript help you catch errors
   - Avoid type assertions (as) where possible

---

## Migration Resources

- **Documentation**
  - MAINTENANCE-GUIDE-V4.md
  - MEDPLUM-V4-FEATURES.md
  - Updated API Reference

- **Tools**
  - identify-migration-code.sh
  - cleanup-migration-code.sh
  - analyze-code-quality.sh

- **Support**
  - Team leads are available for questions
  - Regular office hours for migration support

---

## Q&A

Questions about the migration or new features?

---

## Additional Resources

- Medplum v4.0.0 Release Notes
- TypeScript Documentation
- React Optimization Guides
- FHIR R4 Documentation 