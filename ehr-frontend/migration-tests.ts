import { MedplumClient } from '@medplum/core';
import { createTestMedplumClient, testMedplumClientCore } from './test-setup';

/**
 * Runs a comprehensive set of tests on Medplum functionality
 * to verify compatibility before and after migration.
 */
async function runMigrationTests(): Promise<void> {
  console.log('Starting migration tests...');

  // Create test client
  const client = createTestMedplumClient();
  
  // Test basic FHIR operations
  console.log('Testing core FHIR operations...');
  const coreTestsPassed = await testMedplumClientCore(client);
  console.log('Core FHIR operations:', coreTestsPassed ? 'PASSED' : 'FAILED');

  // Test search filtering
  console.log('Testing search filtering...');
  const searchFilterPassed = await testSearchFiltering(client);
  console.log('Search filtering:', searchFilterPassed ? 'PASSED' : 'FAILED');

  // Test reference handling
  console.log('Testing reference handling...');
  const referenceHandlingPassed = await testReferenceHandling(client);
  console.log('Reference handling:', referenceHandlingPassed ? 'PASSED' : 'FAILED');

  // Test overall status
  const allPassed = coreTestsPassed && searchFilterPassed && referenceHandlingPassed;
  console.log('------------------------');
  console.log('All migration tests:', allPassed ? 'PASSED' : 'FAILED');
}

/**
 * Tests search and filtering functionality.
 * Important to test as v4.0.0 changes behavior of the eq operator.
 */
async function testSearchFiltering(client: MedplumClient): Promise<boolean> {
  try {
    // Create a few test patients
    await client.createResource({
      resourceType: 'Patient',
      name: [{ given: ['John'], family: 'Doe' }],
      gender: 'male',
    });
    
    await client.createResource({
      resourceType: 'Patient',
      name: [{ given: ['Jane'], family: 'Doe' }],
      gender: 'female',
    });

    // Test basic search
    const searchResult = await client.search('Patient', 'family=Doe');
    if (searchResult.entry?.length !== 2) {
      console.error('Search test failed: expected 2 results, got', searchResult.entry?.length);
      return false;
    }

    // Test with filter
    const filterResult = await client.search('Patient', new URLSearchParams({
      _filter: 'gender eq male'
    }));
    if (filterResult.entry?.length !== 1) {
      console.error('Filter test failed: expected 1 result, got', filterResult.entry?.length);
      return false;
    }
    
    return true;
  } catch (err) {
    console.error('Search filtering test failed:', err);
    return false;
  }
}

/**
 * Tests reference handling which is important to verify as
 * getReferenceString behavior changed in v4.0.0
 */
async function testReferenceHandling(client: MedplumClient): Promise<boolean> {
  try {
    // Create a practitioner
    const practitioner = await client.createResource({
      resourceType: 'Practitioner',
      name: [{ given: ['Test'], family: 'Doctor' }],
    });
    
    // Create an organization
    const organization = await client.createResource({
      resourceType: 'Organization',
      name: 'Test Hospital',
    });
    
    // Create practitioner role with references
    const practitionerRole = await client.createResource({
      resourceType: 'PractitionerRole',
      practitioner: {
        reference: `Practitioner/${practitioner.id}`
      },
      organization: {
        reference: `Organization/${organization.id}`
      }
    });
    
    // Verify we can read the references properly
    const retrievedRole = await client.readResource('PractitionerRole', practitionerRole.id as string);
    if (!retrievedRole.practitioner || !retrievedRole.organization) {
      console.error('Reference handling test failed: missing references');
      return false;
    }

    return true;
  } catch (err) {
    console.error('Reference handling test failed:', err);
    return false;
  }
}

// Run tests if executed directly
if (require.main === module) {
  runMigrationTests().catch(console.error);
}

export { runMigrationTests }; 