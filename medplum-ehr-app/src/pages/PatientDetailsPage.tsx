import { Button, Container, Group, Tabs, Title } from '@mantine/core';
import { Patient } from '@medplum/fhirtypes';
import { Document, Loading, ResourceBadge, useMedplum } from '@medplum/react';
import { IconArrowLeft } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { PatientPreferences } from '../components/PatientPreferences';
import { PersonalizedCarePlan } from '../components/PersonalizedCarePlan';
import { SharedDecisionMaking } from '../components/SharedDecisionMaking';

export function PatientDetailsPage(): JSX.Element {
  const medplum = useMedplum();
  const { id } = useParams<{ id: string }>();
  const [patient, setPatient] = useState<Patient | undefined>();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (id) {
      medplum
        .readResource('Patient', id)
        .then((result) => {
          setPatient(result);
          setLoading(false);
        })
        .catch((err) => {
          console.error('Error loading patient:', err);
          setLoading(false);
        });
    }
  }, [medplum, id]);

  if (loading) {
    return <Loading />;
  }

  if (!patient) {
    return <Document>Patient not found</Document>;
  }

  return (
    <Container size="xl">
      <Group mb="md">
        <Button component={Link} to="/patients" leftSection={<IconArrowLeft size={16} />} variant="subtle">
          Back to Patients
        </Button>
      </Group>

      <Group mb="lg">
        <ResourceBadge value={patient} />
        <Title order={2}>
          {patient.name?.[0]?.given?.join(' ')} {patient.name?.[0]?.family}
        </Title>
      </Group>

      <Tabs defaultValue="summary">
        <Tabs.List>
          <Tabs.Tab value="summary">Summary</Tabs.Tab>
          <Tabs.Tab value="careplan">Care Plan</Tabs.Tab>
          <Tabs.Tab value="preferences">Preferences & Goals</Tabs.Tab>
          <Tabs.Tab value="decisions">Shared Decisions</Tabs.Tab>
          <Tabs.Tab value="encounters">Encounters</Tabs.Tab>
          <Tabs.Tab value="observations">Observations</Tabs.Tab>
          <Tabs.Tab value="medications">Medications</Tabs.Tab>
          <Tabs.Tab value="documents">Documents</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="summary" pt="md">
          <PatientSummary patient={patient} />
        </Tabs.Panel>
        
        <Tabs.Panel value="careplan" pt="md">
          <PersonalizedCarePlan patient={patient} />
        </Tabs.Panel>
        
        <Tabs.Panel value="preferences" pt="md">
          <PatientPreferences patient={patient} />
        </Tabs.Panel>
        
        <Tabs.Panel value="decisions" pt="md">
          <SharedDecisionMaking patient={patient} />
        </Tabs.Panel>
        
        <Tabs.Panel value="encounters" pt="md">
          Encounters content
        </Tabs.Panel>
        
        <Tabs.Panel value="observations" pt="md">
          Observations content
        </Tabs.Panel>
        
        <Tabs.Panel value="medications" pt="md">
          Medications content
        </Tabs.Panel>
        
        <Tabs.Panel value="documents" pt="md">
          Documents content
        </Tabs.Panel>
      </Tabs>
    </Container>
  );
}

interface PatientSummaryProps {
  patient: Patient;
}

function PatientSummary({ patient }: PatientSummaryProps): JSX.Element {
  return (
    <div>
      <Group>
        <div>
          <strong>Date of Birth:</strong> {patient.birthDate}
        </div>
        <div>
          <strong>Gender:</strong> {patient.gender}
        </div>
      </Group>
      <Group mt="md">
        <div>
          <strong>Phone:</strong>{' '}
          {patient.telecom?.find((t) => t.system === 'phone')?.value || 'No phone on file'}
        </div>
        <div>
          <strong>Email:</strong>{' '}
          {patient.telecom?.find((t) => t.system === 'email')?.value || 'No email on file'}
        </div>
      </Group>
      <div style={{ marginTop: '1rem' }}>
        <strong>Address:</strong>{' '}
        {patient.address?.[0]
          ? `${patient.address[0].line?.[0] || ''}, ${patient.address[0].city || ''}, ${
              patient.address[0].state || ''
            } ${patient.address[0].postalCode || ''}`
          : 'No address on file'}
      </div>
    </div>
  );
} 