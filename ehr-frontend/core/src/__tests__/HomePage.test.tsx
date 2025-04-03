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

    // Only check for elements that definitely exist and have exact text matches
    expect(screen.getByText('Get Care')).toBeInTheDocument();
    expect(screen.getByText('Send Message')).toBeInTheDocument();
    expect(screen.getByText('Put calls to action here')).toBeInTheDocument();
    expect(screen.getByText('Better rest, better health')).toBeInTheDocument();
    expect(screen.getByText('Primary Care Provider')).toBeInTheDocument();
  });
});