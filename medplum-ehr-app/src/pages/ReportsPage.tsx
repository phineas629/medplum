import { Card, Container, Grid, SimpleGrid, Title, Text, Group } from '@mantine/core';
import { IconUserPlus, IconStethoscope, IconReportMedical, IconCalendarStats } from '@tabler/icons-react';

export function ReportsPage(): JSX.Element {
  return (
    <Container size="xl">
      <Title order={2} mb="lg">Reports & Analytics</Title>
      
      <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg" mb="xl">
        <StatsCard
          title="New Patients"
          value="24"
          description="Last 30 days"
          icon={<IconUserPlus size={28} />}
          color="blue"
          change={12}
        />
        <StatsCard
          title="Appointments"
          value="168"
          description="Last 30 days"
          icon={<IconCalendarStats size={28} />}
          color="green"
          change={-3}
        />
        <StatsCard
          title="Encounters"
          value="142"
          description="Last 30 days"
          icon={<IconStethoscope size={28} />}
          color="violet"
          change={8}
        />
        <StatsCard
          title="Lab Orders"
          value="97"
          description="Last 30 days"
          icon={<IconReportMedical size={28} />}
          color="orange"
          change={15}
        />
      </SimpleGrid>
      
      <Grid gutter="lg">
        <Grid.Col span={{ base: 12, md: 8 }}>
          <Card withBorder p="lg">
            <Title order={3} mb="md">Patient Demographics</Title>
            <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Text c="dimmed">Chart would be displayed here</Text>
            </div>
          </Card>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Card withBorder p="lg">
            <Title order={3} mb="md">Top Diagnoses</Title>
            <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Text c="dimmed">Chart would be displayed here</Text>
            </div>
          </Card>
        </Grid.Col>
      </Grid>
    </Container>
  );
}

interface StatsCardProps {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  change: number;
}

function StatsCard({ title, value, description, icon, color, change }: StatsCardProps): JSX.Element {
  return (
    <Card withBorder p="lg">
      <Group justify="space-between" align="flex-start">
        <div>
          <Text fz="sm" c="dimmed" fw={500}>{title}</Text>
          <Title order={3} mt="xs">{value}</Title>
          <Text fz="xs" c="dimmed" mt={4}>{description}</Text>
        </div>
        
        <div style={{ color }}>
          {icon}
        </div>
      </Group>
      
      <Group mt="md" align="center">
        <Text fz="sm" c={change > 0 ? 'teal' : 'red'} fw={500}>
          {change > 0 ? `+${change}%` : `${change}%`}
        </Text>
        <Text fz="xs" c="dimmed">compared to previous period</Text>
      </Group>
    </Card>
  );
} 