import { SimpleGrid, Card, Text, Title, Container, Group, RingProgress, Stack } from '@mantine/core';
import { useMedplumProfile } from '@medplum/react';
import { Resource } from '@medplum/fhirtypes';

export function DashboardPage(): JSX.Element {
  const profile = useMedplumProfile() as Resource;
  
  return (
    <Container size="xl" pt="md">
      <Title order={2} mb="md">Dashboard</Title>
      
      <Text mb="lg">Welcome, {getProfileName(profile) || 'User'}</Text>
      
      <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="md">
        <StatsCard title="Appointments Today" value="12" color="blue" />
        <StatsCard title="Patients" value="248" color="teal" />
        <StatsCard title="Open Tasks" value="8" color="orange" />
        <StatsCard title="Pending Orders" value="5" color="red" />
      </SimpleGrid>
      
      {/* Add more dashboard content here */}
    </Container>
  );
}

function getProfileName(profile: Resource | undefined): string {
  if (!profile) {
    return '';
  }
  
  if ('display' in profile && typeof profile.display === 'string') {
    return profile.display;
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
}

function StatsCard({ title, value, color }: StatsCardProps): JSX.Element {
  return (
    <Card withBorder p="md" radius="md">
      <Group justify="space-between" align="flex-start">
        <Stack gap={0}>
          <Text fz="sm" c="dimmed" fw={500}>
            {title}
          </Text>
          <Title order={3}>{value}</Title>
        </Stack>
        <RingProgress 
          size={80}
          thickness={8}
          roundCaps
          sections={[{ value: 65, color }]}
          label={
            <Text ta="center" fz="xs" c="dimmed">
              +6%
            </Text>
          }
        />
      </Group>
    </Card>
  );
} 