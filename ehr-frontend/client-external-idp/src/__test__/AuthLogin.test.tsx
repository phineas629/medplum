import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, expect as viExpect, test, expect, beforeEach, vi } from 'vitest';
import { SignInPage } from '../SignInPage';
import { MedplumProvider } from '@medplum/react';
import { useNavigate } from 'react-router-dom';
import matchers from '@testing-library/jest-dom/matchers';

// Add the custom matchers
viExpect.extend(matchers);

// Mock the MedplumClient
const mockMedplumClient = {
  signInWithExternalAuth: vi.fn(),
  processCode: vi.fn(),
  // Add the required properties to the mock
  options: {},
  fetch: vi.fn(),
  storage: {},
  requestCache: {},
  cacheTime: 0,
  baseUrl: '',
  fhirBaseUrl: '',
  authorizeUrl: '',
  // Add other properties as needed
};

// Mock the useMedplumNavigate hook
vi.mock('@medplum/react', async () => {
  const actual = await vi.importActual('@medplum/react');
  return {
    ...actual,
    useMedplumNavigate: () => vi.fn(),
  };
});

// Mock the react-router-dom module
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

describe('SignInPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders sign in button', () => {
    render(
      <MedplumProvider medplum={mockMedplumClient as any}>
        <SignInPage />
      </MedplumProvider>
    );
    expect(screen.getByText('Sign In')).toHaveBeenLastCalledWith(); // This should now work
  });

  test('handles successful sign in', async () => {
    mockMedplumClient.signInWithExternalAuth.mockResolvedValue({});

    render(
      <MedplumProvider medplum={mockMedplumClient as any}>
        <SignInPage />
      </MedplumProvider>
    );

    fireEvent.click(screen.getByText('Sign In'));

    await waitFor(() => {
      expect(mockMedplumClient.signInWithExternalAuth).toHaveBeenCalledTimes(1);
    });
  });

  test('handles sign in failure', async () => {
    mockMedplumClient.signInWithExternalAuth.mockRejectedValue(new Error('Auth failed'));

    render(
      <MedplumProvider medplum={mockMedplumClient as any}>
        <SignInPage />
      </MedplumProvider>
    );

    fireEvent.click(screen.getByText('Sign In'));

    await waitFor(() => {
      expect(mockMedplumClient.signInWithExternalAuth).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledWith('Error during sign-in:', expect.any(Error));
    });
  });

  test('processes code on mount if present', async () => {
    const mockCode = 'testcode123';
    const mockNavigate = vi.fn();
    vi.spyOn(URLSearchParams.prototype, 'get').mockReturnValue(mockCode);
    vi.mocked(useNavigate).mockReturnValue(mockNavigate);

    mockMedplumClient.processCode.mockResolvedValue({});

    render(
      <MedplumProvider medplum={mockMedplumClient as any}>
        <SignInPage />
      </MedplumProvider>
    );

    await waitFor(() => {
      expect(mockMedplumClient.processCode).toHaveBeenCalledWith(mockCode);
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  test('handles code processing failure', async () => {
    const mockCode = 'testcode123';
    vi.spyOn(URLSearchParams.prototype, 'get').mockReturnValue(mockCode);

    mockMedplumClient.processCode.mockRejectedValue(new Error('Code processing failed'));

    render(
      <MedplumProvider medplum={mockMedplumClient as any}>
        <SignInPage />
      </MedplumProvider>
    );

    await waitFor(() => {
      expect(mockMedplumClient.processCode).toHaveBeenCalledWith(mockCode);
      expect(console.error).toHaveBeenCalledWith('Error processing code:', expect.any(Error));
    });
  });
});