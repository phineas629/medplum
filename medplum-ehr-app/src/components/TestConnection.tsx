import { useState } from 'react';
import { Button, Text, Paper, Stack } from '@mantine/core';
import { medplumService } from '../services/medplum';

export function TestConnection(): JSX.Element {
  const [status, setStatus] = useState<string>('');
  const [error, setError] = useState<string>('');

  const testConnection = async (): Promise<void> => {
    try {
      setStatus('Creating test patient...');
      const patient = await medplumService.createTestPatient();
      if (!patient.id) {
        throw new Error('Patient ID is required');
      }
      setStatus(`Created patient: ${patient.id}`);

      setStatus('Creating test appointment...');
      const appointment = await medplumService.createTestAppointment(patient.id);
      setStatus(`Created appointment: ${appointment.id}`);

      setStatus('Searching for patients...');
      const patients = await medplumService.searchPatients('Test');
      setStatus(`Found ${patients.length} patients`);

      setStatus('Connection test completed successfully!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setStatus('Connection test failed');
    }
  };

  return (
    <Paper p="md" withBorder>
      <Stack>
        <Text size="lg" fw={500}>Test Medplum Connection</Text>
        <Button onClick={testConnection}>Run Test</Button>
        {status && <Text>{status}</Text>}
        {error && <Text c="red">{error}</Text>}
      </Stack>
    </Paper>
  );
} 