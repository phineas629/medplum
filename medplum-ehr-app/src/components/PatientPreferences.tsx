import { Accordion, Badge, Button, Group, Paper, Stack, Text, Textarea, TextInput, Title } from '@mantine/core';
import { Patient } from '@medplum/fhirtypes';
import { IconPencil, IconPlus } from '@tabler/icons-react';
import { useState } from 'react';

interface PatientPreferencesProps {
  patient: Patient;
}

export function PatientPreferences({ patient: _patient }: PatientPreferencesProps): JSX.Element {
  const [isEditingGoals, setIsEditingGoals] = useState(false);
  const [isEditingPreferences, setIsEditingPreferences] = useState(false);
  
  // In a real app, these would be stored in FHIR resources and loaded from the server
  const [patientGoals, setPatientGoals] = useState([
    { id: '1', title: 'Improve mobility', description: 'Be able to walk for 30 minutes without pain' },
    { id: '2', title: 'Manage medication side effects', description: 'Reduce nausea from new medication' },
  ]);
  
  const [patientPreferences, setPatientPreferences] = useState({
    communicationPreference: 'Email',
    careTeamPreferences: 'Prefers female providers when possible',
    dietaryRestrictions: 'Vegetarian, no dairy',
    culturalConsiderations: 'Observes religious holidays, may need schedule accommodations',
  });

  return (
    <Paper p="md" withBorder>
      <Stack>
        <Group justify="space-between">
          <Title order={3}>Personal Goals & Preferences</Title>
          <Text size="sm" c="dimmed">Last updated: 2 weeks ago</Text>
        </Group>

        <Accordion>
          <Accordion.Item value="goals">
            <Accordion.Control>
              <Group>
                <Text fw={500}>Personal Goals</Text>
                <Badge color="blue">{patientGoals.length}</Badge>
              </Group>
            </Accordion.Control>
            <Accordion.Panel>
              {!isEditingGoals ? (
                <>
                  <Stack gap="xs">
                    {patientGoals.map((goal) => (
                      <Paper key={goal.id} p="sm" withBorder>
                        <Title order={5}>{goal.title}</Title>
                        <Text size="sm">{goal.description}</Text>
                      </Paper>
                    ))}
                  </Stack>
                  <Group mt="md">
                    <Button 
                      leftSection={<IconPencil size={16} />} 
                      variant="subtle" 
                      onClick={() => setIsEditingGoals(true)}
                    >
                      Edit Goals
                    </Button>
                    <Button 
                      leftSection={<IconPlus size={16} />} 
                      variant="subtle"
                    >
                      Add Goal
                    </Button>
                  </Group>
                </>
              ) : (
                <Stack gap="md">
                  {patientGoals.map((goal, index) => (
                    <Stack key={goal.id} gap="xs">
                      <TextInput
                        label="Goal Title"
                        value={goal.title}
                        onChange={(e) => {
                          const updatedGoals = [...patientGoals];
                          updatedGoals[index] = { ...goal, title: e.target.value };
                          setPatientGoals(updatedGoals);
                        }}
                      />
                      <Textarea
                        label="Description"
                        value={goal.description}
                        onChange={(e) => {
                          const updatedGoals = [...patientGoals];
                          updatedGoals[index] = { ...goal, description: e.target.value };
                          setPatientGoals(updatedGoals);
                        }}
                      />
                    </Stack>
                  ))}
                  <Group>
                    <Button onClick={() => setIsEditingGoals(false)}>Save</Button>
                    <Button variant="subtle" onClick={() => setIsEditingGoals(false)}>Cancel</Button>
                  </Group>
                </Stack>
              )}
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="preferences">
            <Accordion.Control>
              <Text fw={500}>Care Preferences</Text>
            </Accordion.Control>
            <Accordion.Panel>
              {!isEditingPreferences ? (
                <>
                  <Stack gap="md">
                    <Group>
                      <Text fw={500} w={200}>Communication Preference:</Text>
                      <Text>{patientPreferences.communicationPreference}</Text>
                    </Group>
                    <Group>
                      <Text fw={500} w={200}>Care Team Preferences:</Text>
                      <Text>{patientPreferences.careTeamPreferences}</Text>
                    </Group>
                    <Group>
                      <Text fw={500} w={200}>Dietary Restrictions:</Text>
                      <Text>{patientPreferences.dietaryRestrictions}</Text>
                    </Group>
                    <Group>
                      <Text fw={500} w={200}>Cultural Considerations:</Text>
                      <Text>{patientPreferences.culturalConsiderations}</Text>
                    </Group>
                  </Stack>
                  <Button 
                    leftSection={<IconPencil size={16} />} 
                    variant="subtle" 
                    onClick={() => setIsEditingPreferences(true)}
                    mt="md"
                  >
                    Edit Preferences
                  </Button>
                </>
              ) : (
                <Stack gap="md">
                  <TextInput
                    label="Communication Preference"
                    value={patientPreferences.communicationPreference}
                    onChange={(e) => setPatientPreferences({
                      ...patientPreferences,
                      communicationPreference: e.target.value
                    })}
                  />
                  <Textarea
                    label="Care Team Preferences"
                    value={patientPreferences.careTeamPreferences}
                    onChange={(e) => setPatientPreferences({
                      ...patientPreferences,
                      careTeamPreferences: e.target.value
                    })}
                  />
                  <TextInput
                    label="Dietary Restrictions"
                    value={patientPreferences.dietaryRestrictions}
                    onChange={(e) => setPatientPreferences({
                      ...patientPreferences,
                      dietaryRestrictions: e.target.value
                    })}
                  />
                  <Textarea
                    label="Cultural Considerations"
                    value={patientPreferences.culturalConsiderations}
                    onChange={(e) => setPatientPreferences({
                      ...patientPreferences,
                      culturalConsiderations: e.target.value
                    })}
                  />
                  <Group>
                    <Button onClick={() => setIsEditingPreferences(false)}>Save</Button>
                    <Button variant="subtle" onClick={() => setIsEditingPreferences(false)}>Cancel</Button>
                  </Group>
                </Stack>
              )}
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      </Stack>
    </Paper>
  );
} 