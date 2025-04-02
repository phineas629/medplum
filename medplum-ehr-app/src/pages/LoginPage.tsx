import { useState } from 'react';
import { TextInput, PasswordInput, Button, Paper, Title, Container, Text, Alert, Divider } from '@mantine/core';
import { useMedplum } from '@medplum/react';
import { useNavigate } from 'react-router-dom';
import { environment } from '../config/environment';

export function LoginPage(): JSX.Element {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [debugData, setDebugData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const medplum = useMedplum();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setError('');
    setDebugData(null);
    setIsLoading(true);

    try {
      console.log('Attempting login with:', { email });
      
      // Direct login attempt with detailed debugging
      const response = await fetch(`${environment.medplum.proxyPath}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          remember: true,
          recaptchaToken: 'local',
        }),
        credentials: 'include',
      });

      console.log('Login response status:', response.status);
      
      let responseData;
      try {
        responseData = await response.json();
        console.log('Login response:', JSON.stringify(responseData, null, 2));
        setDebugData(responseData);
      } catch (e) {
        console.error('Failed to parse response:', e);
      }

      if (!response.ok) {
        throw new Error(
          responseData?.issue?.[0]?.details?.text || 
          responseData?.message || 
          'Login failed'
        );
      }

      // If login successful, try to get the profile
      await medplum.getProfile();
      navigate('/');
      
    } catch (err) {
      console.error('Login error:', err);
      setError(err instanceof Error ? err.message : 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  // Development bypass - only for testing
  const bypassLogin = (): void => {
    console.log('Bypassing login for development');
    
    // Create a mock patient for testing
    const mockPatient = {
      resourceType: 'Patient',
      id: 'test-patient-id',
      name: [{
        given: ['John'],
        family: 'Doe'
      }],
      birthDate: '1970-01-01',
      gender: 'male',
      telecom: [
        {
          system: 'phone',
          value: '555-555-5555'
        },
        {
          system: 'email',
          value: 'john.doe@example.com'
        }
      ],
      address: [
        {
          line: ['123 Main St'],
          city: 'Anytown',
          state: 'CA',
          postalCode: '12345'
        }
      ]
    };
    
    // Setting localStorage to make it appear as if logged in
    localStorage.setItem('medplum.auth.dev', JSON.stringify({
      profile: {
        id: 'dev-practitioner',
        resourceType: 'Practitioner',
        name: [{
          given: ['Development'],
          family: 'User'
        }],
        identifier: [
          {
            system: 'http://example.org/fhir/identifier/mrn',
            value: 'DEV12345'
          }
        ]
      },
      project: {
        id: 'dev-project',
        name: 'Development Project',
        description: 'Local development project'
      },
      // Mock resources for testing
      mockResources: {
        patients: [mockPatient]
      }
    }));
    
    navigate('/');
  };

  // Helper function to auto-fill test credentials
  const fillTestCredentials = (): void => {
    setEmail('test@example.com');
    setPassword('X4s9L2p7Q!rZ8tW3');
  };

  return (
    <Container size={420} my={40}>
      <Title ta="center" order={1} fw={900}>
        Welcome to Medplum EHR
      </Title>
      <Text c="dimmed" size="sm" ta="center" mt={5}>
        Sign in to your account
      </Text>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form onSubmit={handleSubmit}>
          <TextInput
            label="Email"
            placeholder="your@example.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <PasswordInput
            label="Password"
            placeholder="Your password"
            required
            mt="md"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && (
            <Text c="red" mt="sm">
              {error}
            </Text>
          )}
          {debugData && (
            <Alert title="Debug Info" color="gray" mt="md">
              <pre style={{ whiteSpace: 'pre-wrap', fontSize: '0.8rem', maxHeight: '150px', overflow: 'auto' }}>
                {JSON.stringify(debugData, null, 2)}
              </pre>
            </Alert>
          )}
          <Button fullWidth mt="xl" type="submit" loading={isLoading}>
            Sign in
          </Button>
          <Button
            fullWidth
            mt="sm"
            variant="subtle"
            onClick={() => navigate('/register')}
            disabled={isLoading}
          >
            Don't have an account? Register
          </Button>
          <Button
            fullWidth
            mt="sm"
            variant="light"
            color="grape"
            onClick={fillTestCredentials}
            disabled={isLoading}
          >
            Use Test Account
          </Button>
          
          <Divider my="md" label="Development Options" labelPosition="center" />
          
          <Button
            fullWidth
            variant="outline"
            color="orange"
            onClick={bypassLogin}
          >
            Bypass Login for Development
          </Button>
          
          <Text size="xs" mt="md" ta="center">
            Test account: test@example.com / X4s9L2p7Q!rZ8tW3
          </Text>
        </form>
      </Paper>
    </Container>
  );
} 