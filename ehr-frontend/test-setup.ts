import { MedplumClient } from '@medplum/core';
import { MockClient } from '@medplum/mock';

/**
 * Returns a mock Medplum client that can be used for testing.
 * @returns A mock Medplum client.
 */
export function createTestMedplumClient(): MedplumClient {
  return new MockClient();
}

/**
 * Test utility to verify Medplum client operations.
 * Used to test critical functionality before/after migrations.
 * @param client The MedplumClient to test
 */
export async function testMedplumClientCore(client: MedplumClient): Promise<boolean> {
  try {
    // Test basic FHIR operations
    const patient = await client.createResource({
      resourceType: 'Patient',
      name: [{ given: ['Test'], family: 'Patient' }],
    });
    
    const readResult = await client.readResource('Patient', patient.id as string);
    if (readResult.id !== patient.id) {
      return false;
    }
    
    // Test search
    const searchResult = await client.search('Patient', 'name=Test');
    if (searchResult.entry?.length !== 1) {
      return false;
    }
    
    return true;
  } catch (err) {
    console.error('Medplum client test failed:', err);
    return false;
  }
} 