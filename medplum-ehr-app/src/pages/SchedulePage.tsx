import { Button, Container, Group, Title } from '@mantine/core';
import { IconCalendarPlus } from '@tabler/icons-react';

export function SchedulePage(): JSX.Element {
  return (
    <Container size="xl">
      <Group justify="space-between" mb="lg">
        <Title order={2}>Schedule</Title>
        <Button leftSection={<IconCalendarPlus size={16} />}>Add Appointment</Button>
      </Group>
      
      <div>
        {/* Schedule calendar would go here */}
        <div style={{ padding: '2rem', textAlign: 'center', border: '1px dashed #ccc', borderRadius: '4px' }}>
          Calendar component would be integrated here
        </div>
      </div>
    </Container>
  );
} 