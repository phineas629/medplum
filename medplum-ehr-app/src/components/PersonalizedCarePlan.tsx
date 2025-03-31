import { ActionIcon, Badge, Card, Group, Paper, Progress, SimpleGrid, Stack, Tabs, Text, Title } from '@mantine/core';
import { Patient } from '@medplum/fhirtypes';
import { IconActivity, IconCalendarEvent, IconChartLine, IconCircleCheck, IconHeartbeat, IconLifebuoy, IconMoodSmile, IconPill } from '@tabler/icons-react';

interface PersonalizedCarePlanProps {
  patient: Patient;
}

export function PersonalizedCarePlan({ patient: _patient }: PersonalizedCarePlanProps): JSX.Element {
  // In a real app, these would be loaded from FHIR resources
  const medications = [
    { id: '1', name: 'Atorvastatin', dosage: '10mg', frequency: 'Once daily', timeOfDay: 'Evening' },
    { id: '2', name: 'Metformin', dosage: '500mg', frequency: 'Twice daily', timeOfDay: 'Morning and evening' },
  ];
  
  const exercises = [
    { id: '1', name: 'Walking', frequency: '5 days/week', duration: '30 minutes', completed: 3, target: 5 },
    { id: '2', name: 'Strength training', frequency: '3 days/week', duration: '20 minutes', completed: 2, target: 3 },
  ];
  
  const nutritionGoals = [
    { id: '1', name: 'Reduce sodium intake', target: 'Less than 2300mg daily', status: 'On track' },
    { id: '2', name: 'Increase vegetable servings', target: '5 servings daily', status: 'Needs attention' },
  ];
  
  const appointments = [
    { id: '1', type: 'Primary Care Follow-up', provider: 'Dr. Jane Smith', date: '2023-12-15', time: '10:00 AM' },
    { id: '2', type: 'Nutritionist Consultation', provider: 'Susan Johnson, RD', date: '2023-12-22', time: '2:00 PM' },
  ];

  return (
    <Paper p="md" withBorder>
      <Stack>
        <Group justify="space-between">
          <Title order={3}>Your Personalized Care Plan</Title>
          <Badge size="lg" radius="sm" color="teal">Active</Badge>
        </Group>
        
        <Tabs defaultValue="overview">
          <Tabs.List>
            <Tabs.Tab value="overview" leftSection={<IconHeartbeat size={16} />}>Overview</Tabs.Tab>
            <Tabs.Tab value="medications" leftSection={<IconPill size={16} />}>Medications</Tabs.Tab>
            <Tabs.Tab value="wellness" leftSection={<IconMoodSmile size={16} />}>Wellness</Tabs.Tab>
            <Tabs.Tab value="appointments" leftSection={<IconCalendarEvent size={16} />}>Appointments</Tabs.Tab>
          </Tabs.List>
          
          <Tabs.Panel value="overview" pt="md">
            <Text mb="md">
              This personalized care plan addresses your specific health needs and goals, 
              focusing on both medical treatment and overall wellness.
            </Text>
            
            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg">
              <WellnessCard 
                title="Physical Activity" 
                icon={<IconActivity size={22} color="#228be6" />}
                progress={60} 
                description="3 of 5 activity goals completed this week"
              />
              <WellnessCard 
                title="Medication Adherence" 
                icon={<IconPill size={22} color="#40c057" />}
                progress={90} 
                description="Taking medications as prescribed"
              />
              <WellnessCard 
                title="Nutrition Goals" 
                icon={<IconLifebuoy size={22} color="#fa5252" />}
                progress={70} 
                description="Most nutrition targets being met"
              />
              <WellnessCard 
                title="Vital Signs" 
                icon={<IconChartLine size={22} color="#be4bdb" />}
                progress={85} 
                description="Blood pressure and glucose in target range"
              />
            </SimpleGrid>
          </Tabs.Panel>
          
          <Tabs.Panel value="medications" pt="md">
            <Stack gap="md">
              {medications.map(med => (
                <Card key={med.id} withBorder p="sm">
                  <Group justify="space-between">
                    <div>
                      <Text fw={500}>{med.name}</Text>
                      <Text size="sm" c="dimmed">{med.dosage} - {med.frequency}</Text>
                      <Text size="sm">Take during: {med.timeOfDay}</Text>
                    </div>
                    <ActionIcon variant="subtle" color="blue">
                      <IconCircleCheck size={20} />
                    </ActionIcon>
                  </Group>
                </Card>
              ))}
            </Stack>
          </Tabs.Panel>
          
          <Tabs.Panel value="wellness" pt="md">
            <Tabs defaultValue="exercise">
              <Tabs.List>
                <Tabs.Tab value="exercise">Exercise</Tabs.Tab>
                <Tabs.Tab value="nutrition">Nutrition</Tabs.Tab>
                <Tabs.Tab value="stress">Stress Management</Tabs.Tab>
              </Tabs.List>
              
              <Tabs.Panel value="exercise" pt="md">
                <Stack gap="md">
                  {exercises.map(exercise => (
                    <Card key={exercise.id} withBorder p="sm">
                      <Title order={5}>{exercise.name}</Title>
                      <Text size="sm">Goal: {exercise.frequency}, {exercise.duration}</Text>
                      <Group mt="xs" align="center">
                        <Text size="sm" w={100}>Progress:</Text>
                        <div style={{ flex: 1 }}>
                          <Progress 
                            value={(exercise.completed / exercise.target) * 100} 
                            color="blue"
                            size="sm"
                          />
                        </div>
                        <Text size="sm" fw={500}>
                          {exercise.completed}/{exercise.target} days
                        </Text>
                      </Group>
                    </Card>
                  ))}
                </Stack>
              </Tabs.Panel>
              
              <Tabs.Panel value="nutrition" pt="md">
                <Stack gap="md">
                  {nutritionGoals.map(goal => (
                    <Card key={goal.id} withBorder p="sm">
                      <Group>
                        <div style={{ flex: 1 }}>
                          <Title order={5}>{goal.name}</Title>
                          <Text size="sm">Target: {goal.target}</Text>
                        </div>
                        <Badge 
                          color={goal.status === 'On track' ? 'green' : 'orange'}
                        >
                          {goal.status}
                        </Badge>
                      </Group>
                    </Card>
                  ))}
                </Stack>
              </Tabs.Panel>
              
              <Tabs.Panel value="stress" pt="md">
                <Card withBorder p="md">
                  <Stack>
                    <Title order={5}>Stress Management Techniques</Title>
                    <Text size="sm">
                      Based on your preferences, we recommend the following stress management techniques:
                    </Text>
                    <ul>
                      <li>10 minutes of guided meditation daily</li>
                      <li>Deep breathing exercises when feeling stressed</li>
                      <li>Regular outdoor walks in nature</li>
                      <li>Limiting screen time before bed</li>
                    </ul>
                    <Text size="sm" mt="xs">
                      Track your stress levels and the effectiveness of these techniques in your wellness journal.
                    </Text>
                  </Stack>
                </Card>
              </Tabs.Panel>
            </Tabs>
          </Tabs.Panel>
          
          <Tabs.Panel value="appointments" pt="md">
            <Stack gap="md">
              {appointments.map(appt => (
                <Card key={appt.id} withBorder p="sm">
                  <Group>
                    <IconCalendarEvent size={24} style={{ color: '#228be6' }} />
                    <div style={{ flex: 1 }}>
                      <Text fw={500}>{appt.type}</Text>
                      <Text size="sm">With: {appt.provider}</Text>
                      <Text size="sm" c="dimmed">
                        {new Date(appt.date).toLocaleDateString()} at {appt.time}
                      </Text>
                    </div>
                  </Group>
                </Card>
              ))}
            </Stack>
          </Tabs.Panel>
        </Tabs>
      </Stack>
    </Paper>
  );
}

interface WellnessCardProps {
  title: string;
  icon: React.ReactNode;
  progress: number;
  description: string;
}

function WellnessCard({ title, icon, progress, description }: WellnessCardProps): JSX.Element {
  return (
    <Card withBorder radius="md" p="md">
      <Group>
        {icon}
        <Text fw={500}>{title}</Text>
      </Group>
      
      <Progress value={progress} mt="md" size="lg" radius="sm" />
      
      <Group mt="md" justify="space-between">
        <Text size="sm" c="dimmed">{description}</Text>
        <Text size="sm" fw={700}>{progress}%</Text>
      </Group>
    </Card>
  );
} 