import { useState } from 'react';
import { TextInput, PasswordInput, Button, Paper, Title, Container, Text, Alert, Group, Space } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { environment } from '../config/environment';

export function RegisterPage(): JSX.Element {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [debugData, setDebugData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setDebugData(null);
    setIsLoading(true);

    // Validate password complexity
    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      setIsLoading(false);
      return;
    }

    try {
      console.log('Attempting user registration with:', { email, firstName, lastName });
      
      // Using the proxy configured in vite.config.ts
      const response = await fetch(`${environment.medplum.proxyPath}/auth/newuser`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          password,
          recaptchaToken: 'local',
          // Additional fields that might be required for local setup
          projectName: 'New Project',
          acceptTerms: true,
        }),
        credentials: 'include',
      });

      // Capture full response for debugging
      const responseData = await response.json();
      console.log('Registration response:', JSON.stringify(responseData, null, 2));
      setDebugData(responseData);

      if (!response.ok) {
        const errorMessage = responseData.issue?.[0]?.details?.text || 
                            responseData.message || 
                            'Registration failed';
        throw new Error(errorMessage);
      }

      // After successful registration, try to log in
      setSuccess('Account created successfully! Attempting to log in...');
      
      const loginResponse = await fetch(`${environment.medplum.proxyPath}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          remember: true,
          scope: 'openid profile',
          recaptchaToken: 'local',
        }),
        credentials: 'include',
      });

      const loginData = await loginResponse.json();
      console.log('Login response after registration:', JSON.stringify(loginData, null, 2));

      if (!loginResponse.ok) {
        setSuccess('Account created but login failed. Please try logging in manually.');
        return;
      }

      navigate('/');
    } catch (err) {
      console.error('Registration failed:', err);
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Create the test account specifically mentioned in the documentation
  const createTestAccount = async (): Promise<void> => {
    setError('');
    setSuccess('');
    setDebugData(null);
    setIsLoading(true);

    try {
      console.log('Creating test account...');
      
      // Using the proxy configured in vite.config.ts - try with more required fields
      const response = await fetch(`${environment.medplum.proxyPath}/auth/newuser`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: 'Test',
          lastName: 'User',
          email: 'test@example.com',
          password: 'X4s9L2p7Q!rZ8tW3',
          recaptchaToken: 'local',
          projectName: 'Test Project',
          acceptTerms: true,
        }),
        credentials: 'include',
      });

      const responseData = await response.json();
      console.log('Test account creation response:', JSON.stringify(responseData, null, 2));
      setDebugData(responseData);

      if (!response.ok) {
        if (responseData.issue?.[0]?.details?.text?.includes('already exists')) {
          setSuccess('Test account already exists. You can now log in with test@example.com / X4s9L2p7Q!rZ8tW3');
        } else {
          throw new Error(responseData.issue?.[0]?.details?.text || 'Failed to create test account');
        }
      } else {
        setSuccess('Test account created successfully! You can now log in with test@example.com / X4s9L2p7Q!rZ8tW3');
      }
    } catch (err) {
      console.error('Error creating test account:', err);
      setError(err instanceof Error ? err.message : 'Failed to create test account');
    } finally {
      setIsLoading(false);
    }
  };

  // Try the simplest possible direct project and user creation endpoint
  const createProjectAndUser = async (): Promise<void> => {
    setError('');
    setSuccess('');
    setDebugData(null);
    setIsLoading(true);

    try {
      console.log('Creating project and admin user via /auth/register...');
      
      // Try the /auth/register endpoint which is designed for initial setup
      const response = await fetch(`${environment.medplum.proxyPath}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: 'Admin',
          lastName: 'User',
          email: 'admin@example.com',
          password: 'X4s9L2p7Q!rZ8tW3',
          recaptchaToken: 'local',
          projectName: 'Medplum Project',
        }),
        credentials: 'include',
      });

      const responseData = await response.json();
      console.log('Project creation response:', JSON.stringify(responseData, null, 2));
      setDebugData(responseData);

      if (!response.ok) {
        throw new Error(responseData.issue?.[0]?.details?.text || 'Failed to create project');
      } else {
        setSuccess('Project and admin user created successfully! You can now log in with admin@example.com / X4s9L2p7Q!rZ8tW3');
      }
    } catch (err) {
      console.error('Error creating project:', err);
      setError(err instanceof Error ? err.message : 'Failed to create project');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container size={500} my={40}>
      <Title ta="center" order={1} fw={900}>
        Create Account
      </Title>
      <Text c="dimmed" size="sm" ta="center" mt={5}>
        Register a new account for local development
      </Text>

      <Group mt="md">
        <Button
          fullWidth
          color="teal"
          onClick={createTestAccount}
          loading={isLoading}
        >
          Create Test Account
        </Button>
        
        <Button
          fullWidth
          color="blue"
          onClick={createProjectAndUser}
          loading={isLoading}
        >
          Create Project & Admin
        </Button>
      </Group>
      
      {success && (
        <Alert color="green" mt="md">
          {success}
        </Alert>
      )}

      {error && (
        <Alert color="red" mt="md">
          {error}
        </Alert>
      )}

      {debugData && (
        <Alert title="Debug Info" color="gray" mt="md">
          <pre style={{ whiteSpace: 'pre-wrap', fontSize: '0.8rem', maxHeight: '150px', overflow: 'auto' }}>
            {JSON.stringify(debugData, null, 2)}
          </pre>
        </Alert>
      )}

      <Space h="md" />

      <Paper withBorder shadow="md" p={30} mt={10} radius="md">
        <form onSubmit={handleSubmit}>
          <TextInput
            label="First Name"
            placeholder="John"
            required
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <TextInput
            label="Last Name"
            placeholder="Doe"
            required
            mt="md"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
          <TextInput
            label="Email"
            placeholder="your@example.com"
            required
            mt="md"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <PasswordInput
            label="Password"
            placeholder="8+ characters, complex pattern"
            description="Must be 8+ characters and complex (e.g., X4s9L2p7Q!rZ8tW3)"
            required
            mt="md"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          
          <Button fullWidth mt="xl" type="submit" loading={isLoading}>
            Register
          </Button>
          <Button
            fullWidth
            mt="sm"
            variant="subtle"
            onClick={() => navigate('/login')}
            disabled={isLoading}
          >
            Already have an account? Sign in
          </Button>
          <Text size="xs" mt="md" ta="center">
            Test account: test@example.com / X4s9L2p7Q!rZ8tW3
          </Text>
        </form>
      </Paper>
    </Container>
  );
} 