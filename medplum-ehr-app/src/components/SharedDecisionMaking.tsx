import { Button, Card, Group, Modal, Paper, Radio, Stack, Text, Textarea, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Patient } from '@medplum/fhirtypes';
import { IconBulb, IconMessages, IconScale } from '@tabler/icons-react';
import { useState } from 'react';

interface SharedDecisionMakingProps {
  patient: Patient;
}

export function SharedDecisionMaking({ patient: _patient }: SharedDecisionMakingProps): JSX.Element {
  const [opened, { open, close }] = useDisclosure(false);
  const [decisionType, setDecisionType] = useState('');
  
  // In a real app, these would come from the backend
  const decisions = [
    {
      id: '1',
      title: 'Pain Management Approach',
      description: 'Discussion about medication vs. physical therapy for chronic back pain',
      options: [
        'Medication-based approach with regular monitoring',
        'Physical therapy with minimal medication',
        'Combined approach with both methods',
      ],
      status: 'In Discussion',
      date: '2023-11-15',
    },
    {
      id: '2',
      title: 'Diabetes Management Plan',
      description: 'Deciding on lifestyle changes vs medication adjustments',
      options: [
        'Increase medication dosage',
        'Intensive diet and exercise program',
        'Maintain current plan with more frequent monitoring',
      ],
      status: 'Decided',
      selectedOption: 'Intensive diet and exercise program',
      date: '2023-10-22',
    },
  ];

  return (
    <>
      <Paper p="md" withBorder>
        <Stack>
          <Group justify="space-between">
            <Title order={3}>Shared Decision Making</Title>
            <Button onClick={open}>New Decision Point</Button>
          </Group>
          
          <Text c="dimmed" size="sm">
            Shared decision making helps you and your care team make important healthcare decisions together,
            taking into account the best clinical evidence as well as your personal values and preferences.
          </Text>
          
          <Stack gap="md" mt="sm">
            {decisions.map((decision) => (
              <DecisionCard key={decision.id} decision={decision} />
            ))}
          </Stack>
        </Stack>
      </Paper>
      
      <Modal opened={opened} onClose={close} title="Create New Decision Point" size="lg">
        <Stack gap="md">
          <Textarea 
            label="What decision needs to be made?" 
            placeholder="E.g., Treatment options for recently diagnosed condition"
            minRows={2}
          />
          
          <Radio.Group
            label="Type of decision"
            value={decisionType}
            onChange={setDecisionType}
          >
            <Stack gap="xs" mt="xs">
              <Radio value="treatment" label="Treatment option" />
              <Radio value="diagnostic" label="Diagnostic procedure" />
              <Radio value="lifestyle" label="Lifestyle change" />
              <Radio value="medication" label="Medication choice" />
            </Stack>
          </Radio.Group>
          
          <Textarea
            label="Available options"
            placeholder="List the available options, one per line"
            minRows={3}
          />
          
          <Textarea
            label="Additional information"
            placeholder="Any details that will help with making this decision"
            minRows={3}
          />
          
          <Group justify="flex-end">
            <Button variant="subtle" onClick={close}>Cancel</Button>
            <Button onClick={close}>Create Decision Point</Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
}

interface DecisionCardProps {
  decision: {
    id: string;
    title: string;
    description: string;
    options: string[];
    status: string;
    selectedOption?: string;
    date: string;
  };
}

function DecisionCard({ decision }: DecisionCardProps): JSX.Element {
  return (
    <Card withBorder radius="md">
      <Group gap="md">
        <div style={{ 
          backgroundColor: decision.status === 'Decided' ? '#E7F5FF' : '#FFF4E6', 
          padding: '12px',
          borderRadius: '50%' 
        }}>
          {decision.status === 'Decided' ? <IconScale size={24} /> : <IconBulb size={24} />}
        </div>
        
        <Stack gap={5} style={{ flex: 1 }}>
          <Group justify="space-between">
            <Title order={4}>{decision.title}</Title>
            <Text size="sm" c="dimmed">{decision.date}</Text>
          </Group>
          <Text>{decision.description}</Text>
          
          <Group mt="xs">
            <Text fw={500} size="sm">Status:</Text>
            <Text 
              size="sm" 
              c={decision.status === 'Decided' ? 'blue' : 'orange'}
              fw={500}
            >
              {decision.status}
            </Text>
          </Group>
          
          {decision.selectedOption && (
            <Group mt="xs">
              <Text fw={500} size="sm">Decision:</Text>
              <Text size="sm">{decision.selectedOption}</Text>
            </Group>
          )}
        </Stack>
      </Group>
      
      <Group mt="md">
        <Button 
          leftSection={<IconMessages size={16} />} 
          variant="light" 
          size="sm"
        >
          Discuss
        </Button>
      </Group>
    </Card>
  );
} 