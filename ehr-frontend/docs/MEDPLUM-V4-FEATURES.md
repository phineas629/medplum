# Medplum v4.0.0: New Features and Improvements

## Overview

Medplum v4.0.0 introduces a variety of new features, performance improvements, and API enhancements. This document provides an overview of the key changes and how to leverage them effectively in your EHR Frontend application.

## Core SDK Improvements

### Enhanced Type Safety

Medplum v4.0.0 significantly improves TypeScript type safety across the SDK:

- More accurate FHIR resource typing
- Stricter typing for API responses
- Better type inference for search results
- Improved generics usage throughout the SDK

**Example**:
```typescript
// v3.x.x
const patient = await medplum.readResource('Patient', id);
const name = patient.name[0]; // No type safety for array access

// v4.0.0
const patient = await medplum.readResource('Patient', id);
// Type safety warnings if name might be undefined
const name = patient.name?.[0];
```

### Modernized API Methods

Several API methods have been renamed and modernized to provide more consistent interfaces:

| Old Method (v3.x.x) | New Method (v4.0.0) | Notes |
|---------------------|---------------------|-------|
| `matchesAccessPolicy` | `satisfiedAccessPolicy` | More accurate naming |
| `searchValueSet` | `valueSetExpand` | Aligns with FHIR operation naming |
| `uploadMedia` | `createMedia` | Consistent with other creation methods |
| `parseSearchUrl` | `parseSearchRequest` | Unified search parsing |
| `parseSearchDefinition` | `parseSearchRequest` | Unified search parsing |
| `parseCriteriaAsSearchRequest` | `parseSearchRequest` | Unified search parsing |
| `crawlResource` | `crawlTypedValue` | Better reflects its capabilities |
| `crawlResourceAsync` | `crawlTypedValueAsync` | Better reflects its capabilities |
| `ResourceVisitor` | `CrawlerVisitor` | More generic interface |
| `AsyncResourceVisitor` | `AsyncCrawlerVisitor` | More generic interface |

### Improved Function Signatures

Several functions now use object parameter style for improved readability and maintainability:

```typescript
// v3.x.x
const attachment = await medplum.createAttachment(
  data,
  'filename.pdf',
  'application/pdf',
  onProgressCallback
);

// v4.0.0
const attachment = await medplum.createAttachment({
  data: pdfData,
  filename: 'filename.pdf',
  contentType: 'application/pdf',
  onProgress: onProgressCallback
});
```

## Search Improvements

### Enhanced Search Capabilities

- More precise search filtering with the `eq` operator
- Better handling of string searches with special characters
- Improved pagination and result handling
- More accurate type definitions for search parameters

**Example**:
```typescript
// v4.0.0 enhanced search with precise filtering
const patients = await medplum.search('Patient', {
  name: { $eq: 'Smith' }  // Exact match
});

// v4.0.0 search with multiple criteria
const observations = await medplum.search('Observation', {
  subject: 'Patient/' + patientId,
  code: { $contains: 'glucose' },
  date: { $gt: '2023-01-01' }
});
```

### Search Result Typing

Search results now provide better TypeScript typing:

```typescript
// v4.0.0
const searchResult = await medplum.search('Patient');
// searchResult.entry is properly typed as Array<PatientResource>
```

## React Component Enhancements

### Form Component Improvements

- Enhanced form validation
- Better error message handling
- Improved accessibility
- More consistent styling

### Data Display Components

- More flexible table components
- Enhanced ResourceBadge component
- Improved Timeline component
- Better responsive behavior

### Authentication Components

- Enhanced OAuth integration
- Improved sign-in flows
- Better session management
- More secure authentication handling

## Performance Optimizations

### Reduced Bundle Size

- Smaller package size through tree-shaking optimizations
- Reduced dependencies
- Code splitting improvements

### Improved Caching

- More efficient caching strategies
- Better cache invalidation
- Reduced redundant network requests
- Optimized memory usage

### Faster Operations

- Improved FHIR resource serialization/deserialization
- More efficient search operations
- Optimized rendering performance

## Best Practices for v4.0.0

### Leveraging New Features

1. **Object Parameters**:
   - Update all calls to createAttachment, createBinary, and createPdf to use the object parameter style.
   - Example:
     ```typescript
     // Instead of:
     medplum.createBinary(data, filename, contentType);
     
     // Use:
     medplum.createBinary({
       data,
       filename,
       contentType
     });
     ```

2. **Enhanced Search**:
   - Take advantage of the improved search operators:
     ```typescript
     // Use $eq for exact matching
     const exactMatch = await medplum.search('Patient', {
       identifier: { $eq: 'MRN123' }
     });
     
     // Use $contains for partial matching
     const partialMatch = await medplum.search('Patient', {
       name: { $contains: 'Smi' }
     });
     ```

3. **Optional Chaining**:
   - Use optional chaining with FHIR resources:
     ```typescript
     const patient = await medplum.readResource('Patient', id);
     const familyName = patient.name?.[0]?.family;
     const phoneNumber = patient.telecom?.find(t => t.system === 'phone')?.value;
     ```

### Migration Considerations

1. **Update Deprecated Methods**:
   - Replace all deprecated methods with their modern equivalents.
   - Use the methods mapping table provided earlier in this document.

2. **Review Type Usage**:
   - Review code where you've previously needed type assertions.
   - Many of these can be removed in v4.0.0 due to improved typing.

3. **Update Tests**:
   - Update tests to account for stricter type checking.
   - Ensure tests cover the new function signatures.

4. **Performance Profiling**:
   - Profile your application to identify areas that benefit from v4.0.0 performance improvements.
   - Look for opportunities to reduce unnecessary renders.

## New Utility Functions

Medplum v4.0.0 introduces several new utility functions:

1. **`formatFhirDateTime`**: Format FHIR dateTime values consistently.
2. **`parseFhirDateTime`**: Parse FHIR dateTime strings into JavaScript Date objects.
3. **`getValueSetValues`**: Get an array of expanded values from a ValueSet.
4. **`getExtensionValue`**: Get extension values more easily.
5. **`createReference`**: Create a Reference object from a resource or ID.

Example usage:
```typescript
import { formatFhirDateTime, getExtensionValue, createReference } from '@medplum/core';

// Format a date
const formattedDate = formatFhirDateTime(new Date());

// Get extension value
const extension = getExtensionValue(patient, 'http://example.org/custom-extension');

// Create a reference
const reference = createReference(patient);
```

## Conclusion

Medplum v4.0.0 represents a significant step forward in functionality, performance, and developer experience. By adopting the new patterns and features outlined in this document, you can make the most of these improvements in your EHR Frontend application. 