import { Center, Container, Paper, Stack, Title } from '@mantine/core';
import { SignInForm, useMedplum } from '@medplum/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MfaVerification } from '../components/MfaVerification';

export function SignInPage(): JSX.Element {
  const navigate = useNavigate();
  const medplum = useMedplum();
  const [mfaParams, setMfaParams] = useState<any>(null);

  const handleSignInSuccess = (): void => {
    navigate('/');
  };

  // Note: In a real implementation, you'd need to check if your Medplum version
  // has this callback. This is a provisional implementation.
  const handleMfaRequired = (params: any): void => {
    console.log('MFA required', params);
    setMfaParams(params);
  };

  const handleMfaSuccess = (): void => {
    // MFA verification was successful, navigate to the dashboard
    navigate('/');
  };

  const handleMfaCancel = (): void => {
    // User canceled MFA, reset the state
    setMfaParams(null);
  };

  return (
    <Container size="sm" my="xl">
      <Center>
        <Paper withBorder p="xl" radius="md" shadow="md" w={450}>
          <Stack gap="md">
            {!mfaParams ? (
              <>
                <Title order={2} ta="center">
                  Sign in to Medplum EHR
                </Title>
                <SignInForm
                  onSuccess={handleSignInSuccess}
                  // Add onMfaRequired as a custom prop
                  // This is a provisional implementation and may need 
                  // adjustment based on your Medplum version
                  {...{ onMfaRequired: handleMfaRequired } as any}
                  googleClientId="YOUR_GOOGLE_CLIENT_ID" // Optional - replace with your Google client ID
                />
              </>
            ) : (
              <MfaVerification
                medplum={medplum}
                mfaParams={mfaParams}
                onSuccess={handleMfaSuccess}
                onCancel={handleMfaCancel}
              />
            )}
          </Stack>
        </Paper>
      </Center>
    </Container>
  );
} 