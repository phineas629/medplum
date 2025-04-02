import { useMedplum } from '@medplum/react';
import { useNavigate } from 'react-router-dom';
import { environment } from '../config/environment';

interface AuthHook {
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  profile: unknown;
}

export function useMedplumAuth(): AuthHook {
  const medplum = useMedplum();
  const navigate = useNavigate();

  const login = async (email: string, password: string): Promise<void> => {
    try {
      console.log('Attempting login with:', { email, url: `${environment.medplum.proxyPath}/auth/login` });
      
      // Using the proxy configured in vite.config.ts
      const response = await fetch(`${environment.medplum.proxyPath}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          // For the test account, the server might expect specific format
          remember: true,
          scope: 'openid profile',
        }),
        credentials: 'include',
      });

      console.log('Login response status:', response.status);
      
      // Get the response body regardless of status
      let responseData;
      try {
        responseData = await response.json();
        console.log('Login response data:', responseData);
      } catch (e) {
        console.error('Failed to parse response JSON:', e);
      }

      if (!response.ok) {
        throw new Error(responseData?.message || 'Login failed');
      }

      // After successful login, reload the client to get the current user
      console.log('Login successful, getting profile');
      await medplum.getProfile();
      
      // Navigate to home after login
      navigate('/');
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await medplum.signOut();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  };

  const isAuthenticated = medplum.getProfile() !== undefined;

  return {
    login,
    logout,
    isAuthenticated,
    profile: medplum.getProfile(),
  };
} 