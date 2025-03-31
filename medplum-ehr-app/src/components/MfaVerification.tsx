import { Button, Card, Group, PinInput, Stack, Text, Title } from '@mantine/core';
import { MedplumClient } from '@medplum/core';
import { useCallback, useState } from 'react';

interface MfaVerificationProps {
  medplum: MedplumClient;
  mfaParams: {
    mfaRequired: boolean;
    memberId: string;
    login: string;
    expiresAt: string;
    totpRequired?: boolean;
    smsRequired?: boolean;
    phoneNumber?: string;
  };
  onSuccess: () => void;
  onCancel: () => void;
}

export function MfaVerification({ medplum, mfaParams, onSuccess, onCancel }: MfaVerificationProps): JSX.Element {
  const [code, setCode] = useState<string>('');
  const [error, setError] = useState<string | undefined>();
  const [loading, setLoading] = useState<boolean>(false);

  const handleVerify = useCallback(async () => {
    if (code.length !== 6) {
      setError('Please enter a 6-digit code');
      return;
    }

    setLoading(true);
    setError(undefined);
    
    try {
      // Submit the verification code to Medplum
      // Note: Using any type here since submitMfaCode might not be directly exposed in types
      // In a real implementation, you'd use the proper Medplum API for MFA verification
      await (medplum as any).post('auth/mfa/verify', {
        loginId: mfaParams.login,
        memberId: mfaParams.memberId,
        code,
      });
      
      onSuccess();
    } catch (err: any) {
      console.error('MFA verification error:', err);
      setError(err.message || 'Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [code, medplum, mfaParams, onSuccess]);

  // Create message based on verification type
  let verificationMessage = 'Enter your verification code.';
  if (mfaParams.totpRequired) {
    verificationMessage = 'Enter the 6-digit code from your authenticator app.';
  } else if (mfaParams.smsRequired && mfaParams.phoneNumber) {
    verificationMessage = `Enter the 6-digit code sent to ${maskPhoneNumber(mfaParams.phoneNumber)}.`;
  }

  return (
    <Card withBorder shadow="md" p="xl" radius="md">
      <Stack gap="md">
        <Title order={3}>Two-Factor Authentication</Title>
        
        <Text>
          {verificationMessage}
        </Text>
        
        <PinInput
          length={6}
          type="number"
          size="xl"
          value={code}
          onChange={setCode}
          placeholder=""
          aria-label="Verification code"
        />
        
        {error && (
          <Text color="red" size="sm">{error}</Text>
        )}
        
        <Group justify="space-between" mt="md">
          <Button variant="subtle" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleVerify} loading={loading}>
            Verify
          </Button>
        </Group>
      </Stack>
    </Card>
  );
}

function maskPhoneNumber(phone: string): string {
  // Simple masking function that shows only the last 4 digits
  if (!phone) {
    return '***-***-****';
  }
  
  const digits = phone.replace(/\D/g, '');
  if (digits.length < 4) {
    return phone;
  }
  
  const lastFour = digits.slice(-4);
  return `***-***-${lastFour}`;
} 