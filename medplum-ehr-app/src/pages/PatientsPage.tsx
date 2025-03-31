import { Container, Group, TextInput, Title, Button, ActionIcon } from '@mantine/core';
import { Patient } from '@medplum/fhirtypes';
import { ResourceTable, useMedplum } from '@medplum/react';
import { IconPlus, IconSearch } from '@tabler/icons-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function PatientsPage(): JSX.Element {
  const medplum = useMedplum();
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState<string>('');

  const handleSearch = (): void => {
    // This would normally update the search parameters for the ResourceTable
    console.log('Searching for:', searchText);
  };

  const handleAddPatient = (): void => {
    // In a real application, you would open a dialog or navigate to a form
    alert('Add patient functionality would be implemented here');
  };

  const handlePatientClick = (patient: Patient): void => {
    navigate(`/patients/${patient.id}`);
  };

  // Function to format human name
  const formatPatientName = (patient: Patient): string => {
    const name = patient.name?.[0];
    if (!name) {
      return '';
    }
    
    const given = name.given || [];
    const family = name.family || '';
    return `${given.join(' ')} ${family}`.trim();
  };

  return (
    <Container size="xl">
      <Group justify="space-between" mb="md">
        <Title order={2}>Patients</Title>
        <Group>
          <TextInput
            placeholder="Search patients..."
            value={searchText}
            onChange={(e) => setSearchText(e.currentTarget.value)}
            rightSection={
              <ActionIcon onClick={handleSearch} variant="subtle">
                <IconSearch size={16} />
              </ActionIcon>
            }
          />
          <Button leftSection={<IconPlus size={16} />} onClick={handleAddPatient}>
            Add Patient
          </Button>
        </Group>
      </Group>

      <ResourceTable
        value={{ resourceType: 'Patient' }}
        search={{
          // Default search for active patients
          params: new URLSearchParams('active=true&_count=20'),
        }}
        onRowClick={(patient) => handlePatientClick(patient as Patient)}
        columns={[
          {
            header: 'Name',
            accessor: (patient) => formatPatientName(patient as Patient),
          },
          {
            header: 'Gender',
            accessor: (patient) => (patient as Patient).gender || '',
          },
          {
            header: 'Birth Date',
            accessor: (patient) => (patient as Patient).birthDate || '',
          },
          {
            header: 'Phone',
            accessor: (patient) => {
              const p = patient as Patient;
              const phone = p.telecom?.find(
                (t) => t.system === 'phone' && t.use === 'home'
              );
              return phone?.value || '';
            },
          },
          {
            header: 'Email',
            accessor: (patient) => {
              const p = patient as Patient;
              const email = p.telecom?.find((t) => t.system === 'email');
              return email?.value || '';
            },
          },
        ]}
      />
    </Container>
  );
} 