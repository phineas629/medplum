import { MantineProvider } from '@mantine/core';
import { MockClient } from '@medplum/mock';
import { MedplumProvider } from '@medplum/react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import { Router } from '../Router';

// Manual mocks for ESM compatibility
vi.mock('../pages/HomePage', () => ({
  HomePage: () => <div data-testid="home-page">Home Page</div>,
}));

vi.mock('../components/ChartApp', () => ({
  ChartWrapper: () => <div data-testid="chart-app">Chart App</div>,
}));

vi.mock('../pages/MessageTablePage', () => ({
  MessageTable: () => <div data-testid="message-table">Message Table</div>,
}));

vi.mock('../pages/health-record', () => ({
  HealthRecord: () => <div data-testid="health-record">Health Record</div>,
}));

vi.mock('../pages/care-plan', () => ({
  CarePlanPage: () => <div data-testid="care-plan">Care Plan</div>,
}));

describe('Router', () => {
  const medplum = new MockClient();

  function setup(initialEntries: string[] = ['/']) {
    return render(
      <MemoryRouter initialEntries={initialEntries}>
        <MedplumProvider medplum={medplum}>
          <MantineProvider>
            <Router />
          </MantineProvider>
        </MedplumProvider>
      </MemoryRouter>
    );
  }

  test('renders home page at /', () => {
    setup(['/']);
    expect(screen.getByTestId('home-page')).toBeInTheDocument();
  });

  test('renders chart app at /chart', () => {
    setup(['/chart']);
    expect(screen.getByTestId('chart-app')).toBeInTheDocument();
  });

  test('renders message table at /messages', () => {
    setup(['/messages']);
    expect(screen.getByTestId('message-table')).toBeInTheDocument();
  });

  test('renders health record at /health-record', () => {
    setup(['/health-record']);
    expect(screen.getByTestId('health-record')).toBeInTheDocument();
  });

  test('renders care plan at /care-plan', () => {
    setup(['/care-plan']);
    expect(screen.getByTestId('care-plan')).toBeInTheDocument();
  });
}); 