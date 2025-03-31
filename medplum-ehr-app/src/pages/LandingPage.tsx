import { Button, Container, Grid, Group, List, Stack, Text, ThemeIcon, Title } from '@mantine/core';
import { IconCheck, IconHeartHandshake, IconUser, IconUsersGroup } from '@tabler/icons-react';
import { Link } from 'react-router-dom';

export function LandingPage(): JSX.Element {
  return (
    <Container size="xl" py="xl">
      <Grid gutter="xl">
        <Grid.Col span={{ base: 12, md: 7 }}>
          <Stack gap="lg">
            <Title>Your Health Journey, Personalized</Title>
            <Text size="lg">
              A modern electronic health record that puts you at the center of your care.
              Collaborate with your healthcare team, track your progress, and make informed decisions.
            </Text>
            <Group>
              <Button component={Link} to="/signin" size="lg">
                Sign In
              </Button>
              <Button component={Link} to="/signin" variant="outline" size="lg">
                Sign Up
              </Button>
            </Group>
            
            <Title order={3} mt="xl">People-Centered Healthcare</Title>
            <List
              spacing="md"
              size="lg"
              center
              icon={
                <ThemeIcon color="teal" size={24} radius="xl">
                  <IconCheck size={16} />
                </ThemeIcon>
              }
            >
              <List.Item>
                <Text fw={500}>Personalized Care Plans</Text>
                <Text size="sm" c="dimmed">
                  Care plans tailored to your unique health needs and personal goals.
                </Text>
              </List.Item>
              <List.Item>
                <Text fw={500}>Shared Decision Making</Text>
                <Text size="sm" c="dimmed">
                  Make healthcare decisions together with your care team, based on your values and preferences.
                </Text>
              </List.Item>
              <List.Item>
                <Text fw={500}>Holistic Approach</Text>
                <Text size="sm" c="dimmed">
                  Address your physical, mental, and social wellbeing, not just medical conditions.
                </Text>
              </List.Item>
              <List.Item>
                <Text fw={500}>Accessible Information</Text>
                <Text size="sm" c="dimmed">
                  Access your health information in plain language you can understand.
                </Text>
              </List.Item>
            </List>
          </Stack>
        </Grid.Col>
        
        <Grid.Col span={{ base: 12, md: 5 }}>
          <div style={{ padding: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <Stack gap="xl" align="center">
              <div style={{ maxWidth: '300px', margin: '0 auto' }}>
                {/* In a real app you'd use an actual image */}
                <div style={{ 
                  borderRadius: '50%', 
                  background: 'linear-gradient(45deg, #228be6, #40c057)',
                  width: '250px',
                  height: '250px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto'
                }}>
                  <IconHeartHandshake size={100} color="white" />
                </div>
              </div>
              
              <Stack gap="md">
                <Group gap="xs" justify="center">
                  <IconUser size={24} />
                  <Text fw={500}>5,000+ Patients</Text>
                </Group>
                <Group gap="xs" justify="center">
                  <IconUsersGroup size={24} />
                  <Text fw={500}>200+ Care Providers</Text>
                </Group>
              </Stack>
            </Stack>
          </div>
        </Grid.Col>
      </Grid>
    </Container>
  );
} 