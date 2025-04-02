import { MedplumClient } from '@medplum/core';
import { environment } from '../config/environment';

// Create a custom storage implementation for development bypass
class CustomStorage {
  private readonly localStorage: Storage;
  private mockResourceCache: Record<string, any> = {};

  constructor(localStorage: Storage) {
    this.localStorage = localStorage;
    this.setupMockResourceCache();
  }

  // Set up cache of mock resources for development
  private setupMockResourceCache(): void {
    try {
      const devAuthData = this.localStorage.getItem('medplum.auth.dev');
      if (devAuthData) {
        const parsed = JSON.parse(devAuthData);
        if (parsed.mockResources) {
          // Add mock patients to cache
          if (parsed.mockResources.patients) {
            parsed.mockResources.patients.forEach((patient: any) => {
              this.mockResourceCache[`Patient/${patient.id}`] = patient;
            });
          }
        }
        console.log('[DEV] Mock resources initialized:', Object.keys(this.mockResourceCache));
      }
    } catch (err) {
      console.error('Error setting up mock resource cache:', err);
    }
  }

  getString(key: string): string | undefined {
    // For development bypass, return the dev auth data for profile lookup
    if (key === 'medplum.profile' && this.localStorage.getItem('medplum.auth.dev')) {
      return JSON.parse(this.localStorage.getItem('medplum.auth.dev') || '{}').profile?.id;
    }
    return this.localStorage.getItem(key) || undefined;
  }

  setString(key: string, value: string): void {
    this.localStorage.setItem(key, value);
  }

  getObject<T>(key: string): T | undefined {
    // For development bypass, intercept profile requests
    if (key === 'medplum.profile' && this.localStorage.getItem('medplum.auth.dev')) {
      return JSON.parse(this.localStorage.getItem('medplum.auth.dev') || '{}').profile as T;
    }
    
    // For project requests in dev mode
    if (key === 'medplum.project' && this.localStorage.getItem('medplum.auth.dev')) {
      return JSON.parse(this.localStorage.getItem('medplum.auth.dev') || '{}').project as T;
    }

    // Check for mock resource requests (format like Patient/id)
    if (key.includes('/') && this.mockResourceCache[key]) {
      return this.mockResourceCache[key] as T;
    }
    
    const value = this.localStorage.getItem(key);
    return value ? JSON.parse(value) : undefined;
  }

  setObject<T>(key: string, value: T): void {
    this.localStorage.setItem(key, JSON.stringify(value));
    
    // If this appears to be adding a resource, cache it for our mock system
    if (typeof value === 'object' && value !== null && 'resourceType' in value && 'id' in value) {
      const resourceType = (value as any).resourceType;
      const id = (value as any).id;
      if (resourceType && id) {
        this.mockResourceCache[`${resourceType}/${id}`] = value;
      }
    }
  }

  clear(): void {
    this.localStorage.clear();
    this.mockResourceCache = {};
  }
}

// Create a singleton instance with custom storage for development
const customStorage = new CustomStorage(localStorage);

export const medplumClient = new MedplumClient({
  baseUrl: environment.medplum.baseUrl,
  // For debugging purposes, disable validation to see if it helps with login
  fhirUrlPath: '/fhir/R4', // Explicitly set the FHIR URL path
  storage: customStorage,
  // Use development settings
  ...environment.medplum.development,
});

console.log('MedplumClient initialized with:', {
  baseUrl: environment.medplum.baseUrl,
  fhirUrlPath: '/fhir/R4',
  devMode: !!localStorage.getItem('medplum.auth.dev')
});

// NOTE: When making direct fetch calls to the Medplum API, always include
// credentials: 'include' in the fetch options to support cookies for authentication
// Example:
// fetch(`${medplumClient.getBaseUrl()}/some-endpoint`, {
//   credentials: 'include',
//   // other options...
// })

// Define FHIR resource types
export interface Patient {
  resourceType: 'Patient';
  id?: string;
  name?: {
    given: string[];
    family: string;
  }[];
  gender?: 'male' | 'female' | 'other' | 'unknown';
  birthDate?: string;
  address?: {
    line: string[];
    city: string;
    state: string;
    postalCode: string;
    country: string;
  }[];
  telecom?: {
    system: 'phone' | 'email' | 'fax' | 'pager' | 'sms' | 'other';
    value: string;
  }[];
}

export interface Appointment {
  resourceType: 'Appointment';
  id?: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'no-show';
  start: string;
  end: string;
  participant: {
    actor: {
      reference: string;
    };
    status: 'accepted' | 'declined' | 'tentative' | 'needs-action';
  }[];
}

export interface CarePlan {
  resourceType: 'CarePlan';
  id?: string;
  status: 'draft' | 'active' | 'completed' | 'cancelled';
  subject: {
    reference: string;
  };
  activity: {
    detail: {
      code: {
        coding: {
          system: string;
          code: string;
          display: string;
        }[];
      };
      status: 'not-started' | 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
    };
  }[];
}

interface Bundle<T> {
  resourceType: 'Bundle';
  entry?: {
    resource: T;
  }[];
}

// Helper methods for common operations
export const medplumService = {
  async getPatient(id: string): Promise<Patient> {
    // In development mode, check the mock storage first
    if (localStorage.getItem('medplum.auth.dev')) {
      const mockKey = `Patient/${id}`;
      const mockPatient = customStorage.getObject<Patient>(mockKey);
      if (mockPatient) {
        console.log(`[DEV] Returning mock patient for ${id}`);
        return mockPatient;
      }
    }
    
    return medplumClient.readResource('Patient', id) as Promise<Patient>;
  },

  async searchPatients(query: string): Promise<Patient[]> {
    const result = await medplumClient.search('Patient', {
      _text: query,
    }) as Bundle<Patient>;
    return result.entry?.map((entry: { resource: Patient }) => entry.resource) || [];
  },

  async getAppointments(patientId: string): Promise<Appointment[]> {
    const result = await medplumClient.search('Appointment', {
      patient: patientId,
    }) as Bundle<Appointment>;
    return result.entry?.map((entry: { resource: Appointment }) => entry.resource) || [];
  },

  async getCarePlan(patientId: string): Promise<CarePlan[]> {
    const result = await medplumClient.search('CarePlan', {
      patient: patientId,
    }) as Bundle<CarePlan>;
    return result.entry?.map((entry: { resource: CarePlan }) => entry.resource) || [];
  },

  // Add development helper methods
  async createTestPatient(): Promise<Patient> {
    return medplumClient.createResource({
      resourceType: 'Patient',
      name: [{
        given: ['Test'],
        family: 'Patient',
      }],
      gender: 'other',
      birthDate: '1990-01-01',
    }) as Promise<Patient>;
  },

  async createTestAppointment(patientId: string): Promise<Appointment> {
    return medplumClient.createResource({
      resourceType: 'Appointment',
      status: 'pending',
      start: new Date().toISOString(),
      end: new Date(Date.now() + 3600000).toISOString(),
      participant: [{
        actor: {
          reference: `Patient/${patientId}`,
        },
        status: 'needs-action',
      }],
    }) as Promise<Appointment>;
  },
}; 