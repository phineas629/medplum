import { MantineProvider, createTheme } from '@mantine/core';
import '@mantine/core/styles.css';
import { MedplumProvider } from '@medplum/react';
import '@medplum/react/styles.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { medplumClient } from './services/medplum';

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
    <MedplumProvider medplum={medplumClient}>
      <MantineProvider theme={theme}>
        <App />
      </MantineProvider>
    </MedplumProvider>
  </StrictMode>
); 