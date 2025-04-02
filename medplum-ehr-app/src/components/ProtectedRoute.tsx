import { ReactNode, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useMedplum } from '@medplum/react';

interface ProtectedRouteProps {
  children: ReactNode;
}

// For local development only - set to true to bypass authentication
// This allows working with the UI without needing a functional backend auth
const BYPASS_AUTH_FOR_DEV = true;

export function ProtectedRoute({ children }: ProtectedRouteProps): JSX.Element {
  const medplum = useMedplum();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Add slight delay to avoid flickering during development
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Either a real profile exists, or we're bypassing auth for development
  if (!medplum.getProfile() && !BYPASS_AUTH_FOR_DEV && !localStorage.getItem('medplum.auth.dev')) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
} 