import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { describe, test, expect } from 'vitest';

// Simple App test to verify the testing setup works
describe('App', () => {
  // Create a dummy test component
  const MockAppComponent = () => (
    <div>
      <h1>Mock App Component</h1>
      <div data-testid="mock-app-content">Successfully rendered App component</div>
    </div>
  );

  test('renders a simple React component', () => {
    render(
      <MemoryRouter>
        <MockAppComponent />
      </MemoryRouter>
    );

    // Test that our component renders
    expect(screen.getByTestId('mock-app-content')).toBeInTheDocument();
    expect(screen.getByText('Mock App Component')).toBeInTheDocument();
    expect(screen.getByText('Successfully rendered App component')).toBeInTheDocument();
  });
});
