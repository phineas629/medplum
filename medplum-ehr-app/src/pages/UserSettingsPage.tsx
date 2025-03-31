import { 
  Alert,
  Button, 
  Card, 
  Container, 
  Divider, 
  Group, 
  Image, 
  Paper, 
  PinInput, 
  Stack, 
  Tabs, 
  Text, 
  TextInput, 
  Title 
} from '@mantine/core';
import { useMedplum } from '@medplum/react';
import { IconAlertCircle, IconDeviceMobile, IconQrcode, IconShieldLock } from '@tabler/icons-react';
import { useCallback, useEffect, useState } from 'react';

export function UserSettingsPage(): JSX.Element {
  const _medplum = useMedplum();
  const [activeTab, setActiveTab] = useState<string | null>('profile');
  const [loading, setLoading] = useState(false);
  const [totpEnabled, setTotpEnabled] = useState(false);
  const [totpQrCode, setTotpQrCode] = useState('');
  const [totpSecret, setTotpSecret] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();

  // Check if user has MFA enabled already
  useEffect(() => {
    const checkMfaStatus = async (): Promise<void> => {
      try {
        setLoading(true);
        // In a real implementation, you'd call your Medplum API to check MFA status
        // For demo purposes, we're just setting a default value
        setTotpEnabled(false);
      } catch (err: any) {
        console.error('Error checking MFA status:', err);
      } finally {
        setLoading(false);
      }
    };

    checkMfaStatus().catch(console.error);
  }, []);

  // Generate new TOTP setup
  const handleSetupTotp = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      setError(undefined);
      setSuccess(undefined);

      // In a real implementation, you'd call your Medplum API to generate TOTP setup
      // For demo purposes, we're creating mock data
      setTimeout(() => {
        // Simulating an API response with QR code and secret
        const mockSecret = 'ABCDEFGHJKLMNOPQRSTUVWXYZ234567';
        const mockQrCode = 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=otpauth://totp/MedplumEHR:user@example.com?secret=' + mockSecret + '&issuer=MedplumEHR';
        
        setTotpSecret(mockSecret);
        setTotpQrCode(mockQrCode);
        setLoading(false);
      }, 1000);
    } catch (err: any) {
      console.error('Error setting up TOTP:', err);
      setError(err.message || 'Failed to set up TOTP authentication');
      setLoading(false);
    }
  }, []);

  // Verify TOTP code
  const handleVerifyTotp = useCallback(async (): Promise<void> => {
    if (verificationCode.length !== 6) {
      setError('Please enter a 6-digit code');
      return;
    }

    try {
      setLoading(true);
      setError(undefined);
      setSuccess(undefined);

      // In a real implementation, you'd call your Medplum API to verify the TOTP code
      // For demo purposes, we'll just simulate success
      setTimeout(() => {
        setTotpEnabled(true);
        setSuccess('Two-factor authentication has been enabled successfully');
        setTotpQrCode('');
        setTotpSecret('');
        setVerificationCode('');
        setLoading(false);
      }, 1000);
    } catch (err: any) {
      console.error('Error verifying TOTP:', err);
      setError(err.message || 'Failed to verify the authentication code');
      setLoading(false);
    }
  }, [verificationCode]);

  return (
    <Container size="md" py="xl">
      <Paper withBorder p="md" radius="md">
        <Title order={2} mb="md">Account Settings</Title>
        
        <Tabs value={activeTab} onChange={setActiveTab}>
          <Tabs.List>
            <Tabs.Tab value="profile">Profile</Tabs.Tab>
            <Tabs.Tab value="security">Security</Tabs.Tab>
            <Tabs.Tab value="notifications">Notifications</Tabs.Tab>
          </Tabs.List>
          
          <Tabs.Panel value="profile" pt="md">
            <Stack>
              <Text>Manage your profile information</Text>
              {/* Profile settings would go here */}
            </Stack>
          </Tabs.Panel>
          
          <Tabs.Panel value="security" pt="md">
            <Stack>
              <Title order={3}>Security Settings</Title>
              
              <Card withBorder p="md">
                <Group align="flex-start">
                  <IconShieldLock size={28} />
                  <div style={{ flex: 1 }}>
                    <Title order={4}>Two-Factor Authentication</Title>
                    <Text size="sm" c="dimmed" mb="md">
                      Add an extra layer of security to your account by requiring more than just a password to sign in.
                    </Text>
                    
                    {totpEnabled ? (
                      <>
                        <Alert color="teal" title="Enabled" icon={<IconAlertCircle size={16} />}>
                          Two-factor authentication is currently enabled for your account.
                        </Alert>
                        <Button 
                          mt="md" 
                          color="red" 
                          variant="outline"
                          disabled={loading}
                          onClick={() => {
                            if (confirm('Are you sure you want to disable two-factor authentication? This will make your account less secure.')) {
                              // Logic to disable TOTP would go here
                              setTotpEnabled(false);
                            }
                          }}
                        >
                          Disable Two-Factor Authentication
                        </Button>
                      </>
                    ) : (
                      <>
                        {!totpQrCode ? (
                          <Button 
                            leftSection={<IconQrcode size={16} />} 
                            onClick={handleSetupTotp}
                            loading={loading}
                          >
                            Set Up Two-Factor Authentication
                          </Button>
                        ) : (
                          <Stack>
                            <Title order={5}>Scan this QR code with your authenticator app</Title>
                            <Group justify="center">
                              <Image src={totpQrCode} width={200} height={200} alt="QR Code" />
                            </Group>
                            
                            <Divider label="OR" labelPosition="center" />
                            
                            <Stack>
                              <Title order={5}>Enter this code manually in your authenticator app</Title>
                              <Text fw={500}>{totpSecret}</Text>
                            </Stack>
                            
                            <Divider my="md" />
                            
                            <Stack>
                              <Title order={5}>Verify Setup</Title>
                              <Text size="sm">
                                Enter the verification code from your authenticator app:
                              </Text>
                              
                              <Group justify="center" mt="xs">
                                <PinInput 
                                  length={6} 
                                  type="number" 
                                  value={verificationCode}
                                  onChange={setVerificationCode}
                                  size="lg"
                                />
                              </Group>
                              
                              {error && (
                                <Text c="red" size="sm" ta="center">{error}</Text>
                              )}
                              
                              <Group justify="center" mt="md">
                                <Button 
                                  variant="outline" 
                                  onClick={() => {
                                    setTotpQrCode('');
                                    setTotpSecret('');
                                    setVerificationCode('');
                                    setError(undefined);
                                  }}
                                  disabled={loading}
                                >
                                  Cancel
                                </Button>
                                <Button 
                                  onClick={handleVerifyTotp}
                                  loading={loading}
                                >
                                  Verify
                                </Button>
                              </Group>
                            </Stack>
                          </Stack>
                        )}
                      </>
                    )}
                    
                    {success && (
                      <Alert color="green" title="Success" mt="md">
                        {success}
                      </Alert>
                    )}
                  </div>
                </Group>
              </Card>
              
              <Card withBorder p="md">
                <Group align="flex-start">
                  <IconDeviceMobile size={28} />
                  <div style={{ flex: 1 }}>
                    <Title order={4}>Phone Number Verification</Title>
                    <Text size="sm" c="dimmed" mb="md">
                      Add your phone number for additional account security and recovery options.
                    </Text>
                    
                    <TextInput
                      label="Phone Number"
                      placeholder="+1 (555) 123-4567"
                    />
                    
                    <Button mt="md">
                      Verify Phone Number
                    </Button>
                  </div>
                </Group>
              </Card>
            </Stack>
          </Tabs.Panel>
          
          <Tabs.Panel value="notifications" pt="md">
            <Stack>
              <Text>Manage your notification preferences</Text>
              {/* Notification settings would go here */}
            </Stack>
          </Tabs.Panel>
        </Tabs>
      </Paper>
    </Container>
  );
} 