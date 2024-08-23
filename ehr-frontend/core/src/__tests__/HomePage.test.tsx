import { MantineProvider } from '@mantine/core';
import { MockClient } from '@medplum/mock';
import { MedplumProvider } from '@medplum/react';
import { act, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { HomePage } from '../pages/HomePage';

describe('HomePage', () => {
  test('renders HomePage', async () => {
    const medplum = new MockClient();
    await act(async () => {
      render(
        <MemoryRouter>
          <MedplumProvider medplum={medplum}>
            <MantineProvider>
              <HomePage />
            </MantineProvider>
          </MedplumProvider>
        </MemoryRouter>
      );
    });

    expect(screen.getByText("we're here to help")).toBeInTheDocument();
    expect(screen.getByText('Get Care')).toBeInTheDocument();
    expect(screen.getByText('Health Record')).toBeInTheDocument();
    expect(screen.getByText('Request Prescription Renewal')).toBeInTheDocument();
    expect(screen.getByText('Primary Care Provider')).toBeInTheDocument();
  });
});