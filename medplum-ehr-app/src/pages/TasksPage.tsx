import { Button, Container, Group, Tabs, Title } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';

export function TasksPage(): JSX.Element {
  return (
    <Container size="xl">
      <Group justify="space-between" mb="md">
        <Title order={2}>Tasks</Title>
        <Button leftSection={<IconPlus size={16} />}>Create Task</Button>
      </Group>

      <Tabs defaultValue="pending">
        <Tabs.List>
          <Tabs.Tab value="pending">Pending</Tabs.Tab>
          <Tabs.Tab value="completed">Completed</Tabs.Tab>
          <Tabs.Tab value="all">All Tasks</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="pending" pt="md">
          <div style={{ padding: '2rem', textAlign: 'center', border: '1px dashed #ccc', borderRadius: '4px' }}>
            Pending tasks would be displayed here
          </div>
        </Tabs.Panel>
        <Tabs.Panel value="completed" pt="md">
          <div style={{ padding: '2rem', textAlign: 'center', border: '1px dashed #ccc', borderRadius: '4px' }}>
            Completed tasks would be displayed here
          </div>
        </Tabs.Panel>
        <Tabs.Panel value="all" pt="md">
          <div style={{ padding: '2rem', textAlign: 'center', border: '1px dashed #ccc', borderRadius: '4px' }}>
            All tasks would be displayed here
          </div>
        </Tabs.Panel>
      </Tabs>
    </Container>
  );
} 