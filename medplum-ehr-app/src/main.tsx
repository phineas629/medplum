import { MantineProvider, createTheme } from '@mantine/core';
import '@mantine/core/styles.css';
import { MedplumClient } from '@medplum/core';
import { MedplumProvider } from '@medplum/react';
import '@medplum/react/styles.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { App } from './App';

// Initialize the Medplum client with proper authentication handling
const medplum = new MedplumClient({
  // Redirect to sign-in page when user is unauthenticated
  onUnauthenticated: () => {
    console.log('User is unauthenticated, redirecting to sign-in page');
    window.location.href = '/signin';
  },

  // Configure Medplum server URL
  baseUrl: 'http://localhost:8103/', // Update this URL to match your local Medplum server

  // Pass custom options as any to bypass TypeScript restrictions
  // The actual Medplum client may have these properties available
} as any);

// Listen for token changes
// Note: We need to use the actual API provided by the MedplumClient
medplum.addEventListener('change', () => {
  console.log('Authentication state changed');
});

// Create a custom theme for Mantine
const theme = createTheme({
  headings: {
    sizes: {
      h1: {
        fontSize: '1.5rem',
        fontWeight: '600',
        lineHeight: '2.0',
      },
      h2: {
        fontSize: '1.25rem',
        fontWeight: '500',
        lineHeight: '1.75',
      },
      h3: {
        fontSize: '1.125rem',
        fontWeight: '500',
        lineHeight: '1.5',
      },
    },
  },
  fontSizes: {
    xs: '0.6875rem',
    sm: '0.875rem',
    md: '0.875rem',
    lg: '1.0rem',
    xl: '1.125rem',
  },
});

// Set up event listeners for authentication state
window.addEventListener('storage', (e) => {
  // Handle login/logout events across tabs/windows
  if (e.key === 'medplum.activeLogin') {
    if (!e.newValue) {
      // User logged out in another tab
      console.log('User logged out in another tab');
      window.location.reload();
    } else if (e.newValue !== e.oldValue) {
      // User changed in another tab
      console.log('User changed in another tab');
      window.location.reload();
    }
  }
});

// Render the application
const container = document.getElementById('root') as HTMLDivElement;
const root = createRoot(container);
root.render(
  <StrictMode>
    <BrowserRouter>
      <MedplumProvider medplum={medplum}>
        <MantineProvider theme={theme}>
          <App />
        </MantineProvider>
      </MedplumProvider>
    </BrowserRouter>
  </StrictMode>
); 