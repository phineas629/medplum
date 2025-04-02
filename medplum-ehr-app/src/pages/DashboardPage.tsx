import { useState, useEffect } from 'react';
import { SimpleGrid, Card, Text, Title, Container, Group, RingProgress, Stack, Tabs, Table } from '@mantine/core';
import { useMedplumProfile, useMedplum } from '@medplum/react';
import { Resource } from '@medplum/fhirtypes';
import { TestConnection } from '../components/TestConnection';
import { IconCalendarEvent, IconUsers, IconClipboardList, IconNotes } from '@tabler/icons-react';

export function DashboardPage(): JSX.Element {
  const profile = useMedplumProfile() as Resource;
  const medplum = useMedplum();
  const [tasks, setTasks] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  
  useEffect(() => {
    // Load tasks
    medplum.search('Task', { status: 'requested,accepted,in-progress', _count: 5 })
      .then(bundle => {
        setTasks(bundle.entry?.map(e => e.resource) || []);
      })
      .catch(err => console.error('Error loading tasks:', err));
    
    // Load appointments
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    medplum.search('Appointment', { date: `ge${todayStr}`, _count: 5 })
      .then(bundle => {
        setAppointments(bundle.entry?.map(e => e.resource) || []);
      })
      .catch(err => console.error('Error loading appointments:', err));
    
    // Load patients
    medplum.search('Patient', { _count: 5 })
      .then(bundle => {
        setPatients(bundle.entry?.map(e => e.resource) || []);
      })
      .catch(err => console.error('Error loading patients:', err));
  }, [medplum]);
  
  return (
    <Container size="xl" pt="md">
      <Title order={2} mb="md">Dashboard</Title>
      
      <Text mb="lg">Welcome, {getProfileName(profile) || 'User'}</Text>
      
      <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="md" mb="xl">
        <StatsCard 
          title="Appointments Today" 
          value={appointments.filter(a => {
            const appDate = new Date(a.start).toISOString().split('T')[0];
            const today = new Date().toISOString().split('T')[0];
            return appDate === today;
          }).length.toString()} 
          color="blue" 
          icon={<IconCalendarEvent size={24} />}
          percent={65}
        />
        <StatsCard 
          title="Patients" 
          value={patients.length.toString()}
          color="teal" 
          icon={<IconUsers size={24} />}
          percent={80}
        />
        <StatsCard 
          title="Open Tasks" 
          value={tasks.length.toString()}
          color="orange" 
          icon={<IconClipboardList size={24} />}
          percent={45}
        />
        <StatsCard 
          title="Documents" 
          value="12" 
          color="violet" 
          icon={<IconNotes size={24} />}
          percent={30}
        />
      </SimpleGrid>
      
      <Tabs defaultValue="tasks">
        <Tabs.List>
          <Tabs.Tab value="tasks" leftSection={<IconClipboardList size={16} />}>Tasks</Tabs.Tab>
          <Tabs.Tab value="appointments" leftSection={<IconCalendarEvent size={16} />}>Upcoming Appointments</Tabs.Tab>
          <Tabs.Tab value="recent-patients" leftSection={<IconUsers size={16} />}>Recent Patients</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="tasks" pt="md">
          <ResourceTable
            resources={tasks}
            columns={[
              { key: 'id', header: 'ID' },
              { key: 'description', header: 'Description' },
              { key: 'status', header: 'Status' },
              { key: 'lastModified', header: 'Last Updated' },
            ]}
          />
        </Tabs.Panel>
        
        <Tabs.Panel value="appointments" pt="md">
          <ResourceTable
            resources={appointments}
            columns={[
              { key: 'start', header: 'Date', render: (value) => new Date(value).toLocaleString() },
              { key: 'status', header: 'Status' },
              { key: 'participant.0.actor.display', header: 'Patient' },
              { key: 'appointmentType.text', header: 'Type' },
            ]}
          />
        </Tabs.Panel>
        
        <Tabs.Panel value="recent-patients" pt="md">
          <ResourceTable
            resources={patients}
            columns={[
              { key: 'name.0.given', header: 'First Name', render: (value) => Array.isArray(value) ? value.join(' ') : value },
              { key: 'name.0.family', header: 'Last Name' },
              { key: 'gender', header: 'Gender' },
              { key: 'birthDate', header: 'DOB' },
            ]}
          />
        </Tabs.Panel>
      </Tabs>
      
      <TestConnection />
    </Container>
  );
}

function getProfileName(profile: Resource | undefined): string {
  if (!profile) {
    return '';
  }
  
  if ('name' in profile && Array.isArray(profile.name) && profile.name.length > 0) {
    const name = profile.name[0];
    if (typeof name === 'object' && name !== null) {
      const given = 'given' in name ? (name.given || []).join(' ') : '';
      const family = 'family' in name ? name.family || '' : '';
      return `${given} ${family}`.trim();
    }
  }
  
  return '';
}

interface StatsCardProps {
  title: string;
  value: string;
  color: string;
  icon: React.ReactNode;
  percent: number;
}

function StatsCard({ title, value, color, icon, percent }: StatsCardProps): JSX.Element {
  return (
    <Card withBorder p="md" radius="md">
      <Group justify="space-between" align="flex-start">
        <Stack gap={0}>
          <Text fz="sm" c="dimmed" fw={500}>
            {title}
          </Text>
          <Title order={3}>{value}</Title>
        </Stack>
        <Group>
          <div style={{ color }}>{icon}</div>
          <RingProgress 
            size={80}
            thickness={8}
            roundCaps
            sections={[{ value: percent, color }]}
            label={
              <Text ta="center" fz="xs" c="dimmed">
                {percent}%
              </Text>
            }
          />
        </Group>
      </Group>
    </Card>
  );
}

interface ResourceTableProps {
  resources: any[];
  columns: {
    key: string;
    header: string;
    render?: (value: any) => React.ReactNode;
  }[];
}

function ResourceTable({ resources, columns }: ResourceTableProps): JSX.Element {
  const getValueByPath = (obj: any, path: string): any => {
    if (!obj) {
      return '';
    }
    const parts = path.split('.');
    let current = obj;
    
    for (const part of parts) {
      if (!current) {
        return '';
      }
      // Handle array indices
      if (/^\d+$/.test(part)) {
        current = current[parseInt(part, 10)];
      } else {
        current = current[part];
      }
    }
    
    return current;
  };

  return (
    <Table striped highlightOnHover withTableBorder>
      <Table.Thead>
        <Table.Tr>
          {columns.map((col) => (
            <Table.Th key={col.key}>{col.header}</Table.Th>
          ))}
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {resources.length === 0 ? (
          <Table.Tr>
            <Table.Td colSpan={columns.length} style={{ textAlign: 'center' }}>
              No data available
            </Table.Td>
          </Table.Tr>
        ) : (
          resources.map((resource) => (
            <Table.Tr key={resource.id} style={{ cursor: 'pointer' }}>
              {columns.map((col) => {
                const value = getValueByPath(resource, col.key);
                return (
                  <Table.Td key={col.key}>
                    {col.render ? col.render(value) : value}
                  </Table.Td>
                );
              })}
            </Table.Tr>
          ))
        )}
      </Table.Tbody>
    </Table>
  );
} 