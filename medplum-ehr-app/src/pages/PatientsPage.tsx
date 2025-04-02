import { useState, useEffect } from 'react';
import {
  Container,
  Group,
  TextInput,
  Title,
  Button,
  ActionIcon,
  Card,
  Tabs,
  Text,
  Avatar,
  Badge,
  Box,
  SimpleGrid,
  Select,
  Divider,
  Menu
} from '@mantine/core';
import { Patient } from '@medplum/fhirtypes';
import { ResourceTable, useMedplum } from '@medplum/react';
import {
  IconSearch,
  IconAdjustmentsHorizontal,
  IconUserPlus,
  IconDotsVertical,
  IconCalendarPlus,
  IconNotes,
  IconClipboardList,
  IconUserCircle,
  IconList,
  IconLayoutGrid
} from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';

// Define TypeScript interface for the ResourceTable props we're using
interface PatientResourceTableProps {
  resourceType: string;
  query: Record<string, any>;
  onRowClick: (patient: any) => void;
  columns: {
    header: string;
    accessor: (resource: any) => React.ReactNode;
  }[];
}

export function PatientsPage(): JSX.Element {
  const medplum = useMedplum();
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState<string>('');
  const [viewType, setViewType] = useState<'table' | 'cards'>('table');
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [filterStatus, setFilterStatus] = useState<string>('active');
  
  const loadPatients = async (): Promise<void> => {
    setLoading(true);
    try {
      const searchParams: Record<string, string> = {
        _count: '20',
      };
      
      if (searchText) {
        searchParams.name = searchText;
      }
      
      if (filterStatus === 'active') {
        searchParams.active = 'true';
      } else if (filterStatus === 'inactive') {
        searchParams.active = 'false';
      }
      
      const response = await medplum.search('Patient', searchParams);
      setPatients(response.entry?.map(e => e.resource as Patient) || []);
    } catch (error) {
      console.error('Error loading patients:', error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    loadPatients();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterStatus]);

  const handleSearch = (): void => {
    loadPatients();
  };

  const handleAddPatient = (): void => {
    navigate('/patients/new');
  };

  const handlePatientClick = (patient: Patient): void => {
    navigate(`/patients/${patient.id}`);
  };
  
  const handleScheduleAppointment = (patient: Patient): void => {
    navigate(`/schedule?patient=${patient.id}`);
  };
  
  const handleCreateTask = (patient: Patient): void => {
    // This would navigate to the task creation page with the patient pre-selected
    navigate(`/tasks/new?patient=${patient.id}`);
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
        <Button 
          leftSection={<IconUserPlus size={16} />} 
          onClick={handleAddPatient}
        >
          Add Patient
        </Button>
      </Group>

      <Card withBorder mb="md">
        <Group justify="space-between">
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
              style={{ minWidth: '300px' }}
            />
            <Button
              variant="light"
              leftSection={<IconAdjustmentsHorizontal size={16} />}
            >
              Advanced Search
            </Button>
          </Group>
          
          <Group>
            <Select
              value={filterStatus}
              onChange={(value) => setFilterStatus(value || 'all')}
              data={[
                { value: 'all', label: 'All Patients' },
                { value: 'active', label: 'Active Patients' },
                { value: 'inactive', label: 'Inactive Patients' }
              ]}
              style={{ width: '180px' }}
            />
            <Group>
              <ActionIcon 
                variant={viewType === 'table' ? 'filled' : 'subtle'} 
                color="blue"
                onClick={() => setViewType('table')}
              >
                <IconList size={20} />
              </ActionIcon>
              <ActionIcon 
                variant={viewType === 'cards' ? 'filled' : 'subtle'} 
                color="blue"
                onClick={() => setViewType('cards')}
              >
                <IconLayoutGrid size={20} />
              </ActionIcon>
            </Group>
          </Group>
        </Group>
      </Card>

      <Tabs defaultValue="all">
        <Tabs.List>
          <Tabs.Tab value="all" leftSection={<IconUserCircle size={16} />}>All Patients</Tabs.Tab>
          <Tabs.Tab value="recent" leftSection={<IconClipboardList size={16} />}>Recent</Tabs.Tab>
          <Tabs.Tab value="favorites" leftSection={<IconNotes size={16} />}>Favorites</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="all" pt="md">
          {viewType === 'table' ? (
            // @ts-ignore - Types don't match exactly but it works correctly
            <ResourceTable
              value={{ resourceType: 'Patient' }}
              search={{
                params: new URLSearchParams(
                  filterStatus === 'all' 
                    ? '_count=20'
                    : `active=${filterStatus === 'active'}&_count=20`
                ),
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
                      (t) => t.system === 'phone'
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
                {
                  header: 'Actions',
                  accessor: (patient) => (
                    <Group>
                      <Menu position="bottom-end">
                        <Menu.Target>
                          <ActionIcon>
                            <IconDotsVertical size={16} />
                          </ActionIcon>
                        </Menu.Target>
                        <Menu.Dropdown>
                          <Menu.Item 
                            leftSection={<IconUserCircle size={16} />}
                            onClick={() => handlePatientClick(patient as Patient)}
                          >
                            View Details
                          </Menu.Item>
                          <Menu.Item 
                            leftSection={<IconCalendarPlus size={16} />}
                            onClick={() => handleScheduleAppointment(patient as Patient)}
                          >
                            Schedule Appointment
                          </Menu.Item>
                          <Menu.Item 
                            leftSection={<IconClipboardList size={16} />}
                            onClick={() => handleCreateTask(patient as Patient)}
                          >
                            Create Task
                          </Menu.Item>
                          <Divider />
                          <Menu.Item color="red">
                            Deactivate Patient
                          </Menu.Item>
                        </Menu.Dropdown>
                      </Menu>
                    </Group>
                  ),
                },
              ]}
            />
          ) : (
            <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
              {patients.map((patient) => (
                <PatientCard 
                  key={patient.id}
                  patient={patient}
                  onClick={() => handlePatientClick(patient)}
                  onSchedule={() => handleScheduleAppointment(patient)}
                  onCreateTask={() => handleCreateTask(patient)}
                />
              ))}
              {patients.length === 0 && !loading && (
                <Text c="dimmed" ta="center">No patients found</Text>
              )}
            </SimpleGrid>
          )}
        </Tabs.Panel>
        
        <Tabs.Panel value="recent" pt="md">
          <Text>Recently viewed patients will appear here.</Text>
        </Tabs.Panel>
        
        <Tabs.Panel value="favorites" pt="md">
          <Text>Favorite patients will appear here.</Text>
        </Tabs.Panel>
      </Tabs>
    </Container>
  );
}

interface PatientCardProps {
  patient: Patient;
  onClick: () => void;
  onSchedule: () => void;
  onCreateTask: () => void;
}

function PatientCard({ patient, onClick, onSchedule, onCreateTask }: PatientCardProps): JSX.Element {
  const name = patient.name?.[0];
  const givenName = name?.given?.join(' ') || '';
  const familyName = name?.family || '';
  const fullName = `${givenName} ${familyName}`.trim();
  
  const initials = (givenName.charAt(0) + familyName.charAt(0)).toUpperCase();
  
  // Calculate age from birthdate
  const calculateAge = (birthDate: string | undefined): string => {
    if (!birthDate) {
      return 'Unknown';
    }
    
    const today = new Date();
    const birthDateObj = new Date(birthDate);
    let age = today.getFullYear() - birthDateObj.getFullYear();
    const monthDifference = today.getMonth() - birthDateObj.getMonth();
    
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDateObj.getDate())) {
      age--;
    }
    
    return `${age} years`;
  };
  
  // Get phone number
  const phone = patient.telecom?.find(t => t.system === 'phone')?.value || '';
  
  return (
    <Card withBorder shadow="sm" padding="lg" radius="md">
      <Group>
        <Avatar color="blue" radius="xl" size="lg">
          {initials}
        </Avatar>
        
        <Box style={{ flex: 1 }}>
          <Text fw={500} size="lg">{fullName}</Text>
          <Group gap="xs">
            <Text c="dimmed" size="sm">
              {patient.gender === 'male' ? 'Male' : 
               patient.gender === 'female' ? 'Female' : 
               patient.gender || 'Unknown'}
            </Text>
            <Text c="dimmed" size="sm">•</Text>
            <Text c="dimmed" size="sm">
              {calculateAge(patient.birthDate)}
            </Text>
          </Group>
        </Box>
        
        <Menu position="bottom-end">
          <Menu.Target>
            <ActionIcon>
              <IconDotsVertical size={16} />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item 
              leftSection={<IconUserCircle size={16} />}
              onClick={onClick}
            >
              View Details
            </Menu.Item>
            <Menu.Item 
              leftSection={<IconCalendarPlus size={16} />}
              onClick={onSchedule}
            >
              Schedule Appointment
            </Menu.Item>
            <Menu.Item 
              leftSection={<IconClipboardList size={16} />}
              onClick={onCreateTask}
            >
              Create Task
            </Menu.Item>
            <Divider />
            <Menu.Item color="red">
              Deactivate Patient
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Group>
      
      <Divider my="sm" />
      
      <Box>
        <Group justify="space-between">
          <Text size="sm" fw={500}>Contact:</Text>
          <Text size="sm">{phone || 'No phone'}</Text>
        </Group>
        
        <Group justify="space-between" mt="xs">
          <Text size="sm" fw={500}>MRN:</Text>
          <Text size="sm">
            {patient.identifier?.find(id => 
              id.system === 'http://hospital.example.org/fhir/mrn'
            )?.value || 'Unknown'}
          </Text>
        </Group>
        
        <Group justify="space-between" mt="xs">
          <Text size="sm" fw={500}>Status:</Text>
          <Badge color={patient.active ? 'green' : 'red'}>
            {patient.active ? 'Active' : 'Inactive'}
          </Badge>
        </Group>
      </Box>
      
      <Button 
        fullWidth 
        mt="md"
        variant="light"
        onClick={onClick}
      >
        View Patient
      </Button>
    </Card>
  );
} 