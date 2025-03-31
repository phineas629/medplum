import { ActionIcon, Avatar, Group, Menu, Text, UnstyledButton } from '@mantine/core';
import { Patient, Practitioner } from '@medplum/fhirtypes';
import { useMedplumProfile } from '@medplum/react';
import { IconBell, IconChevronDown, IconLogout, IconSettings, IconUser, IconUserCircle } from '@tabler/icons-react';
import { useState } from 'react';

export function PatientPortalHeader(): JSX.Element {
  const profile = useMedplumProfile();
  const [notifications] = useState([
    { id: '1', message: 'Your lab results are ready', time: '10 min ago' },
    { id: '2', message: 'Upcoming appointment tomorrow', time: '1 hour ago' },
  ]);

  const isPatient = profile?.resourceType === 'Patient';

  // In a real app, this would use the actual FHIR resource type
  const displayName = getProfileName(profile);
  
  return (
    <Group justify="space-between" p="md" style={{ borderBottom: '1px solid #eee' }}>
      <div></div> {/* Placeholder for logo if needed */}
      
      <Group>
        <Menu width={300} position="bottom-end" shadow="md">
          <Menu.Target>
            <ActionIcon size="lg" radius="xl" variant="light" color="blue">
              <IconBell size={20} />
              {notifications.length > 0 && (
                <div style={{
                  position: 'absolute',
                  top: -5,
                  right: -5,
                  backgroundColor: 'red',
                  color: 'white',
                  borderRadius: '50%',
                  width: 16,
                  height: 16,
                  fontSize: 10,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {notifications.length}
                </div>
              )}
            </ActionIcon>
          </Menu.Target>
          
          <Menu.Dropdown>
            <Menu.Label>Notifications</Menu.Label>
            {notifications.map(notification => (
              <Menu.Item key={notification.id}>
                <div>
                  <Text fw={500}>{notification.message}</Text>
                  <Text size="xs" c="dimmed">{notification.time}</Text>
                </div>
              </Menu.Item>
            ))}
            <Menu.Divider />
            <Menu.Item>View all notifications</Menu.Item>
          </Menu.Dropdown>
        </Menu>
        
        <Menu width={200} position="bottom-end" shadow="md">
          <Menu.Target>
            <UnstyledButton>
              <Group gap="xs">
                <Avatar 
                  color={isPatient ? "blue" : "teal"} 
                  radius="xl"
                >
                  {isPatient ? <IconUser size={24} /> : <IconUserCircle size={24} />}
                </Avatar>
                <div style={{ flex: 1 }}>
                  <Text size="sm" fw={500}>
                    {displayName || 'User'}
                  </Text>
                  <Text c="dimmed" size="xs">
                    {profile?.resourceType || 'User'}
                  </Text>
                </div>
                <IconChevronDown size={16} />
              </Group>
            </UnstyledButton>
          </Menu.Target>
          
          <Menu.Dropdown>
            <Menu.Label>Account</Menu.Label>
            <Menu.Item leftSection={<IconUser size={14} />}>Profile</Menu.Item>
            <Menu.Item leftSection={<IconSettings size={14} />}>Settings</Menu.Item>
            <Menu.Divider />
            <Menu.Item leftSection={<IconLogout size={14} />} color="red">Sign out</Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Group>
    </Group>
  );
}

function getProfileName(profile: any): string {
  if (!profile) {
    return '';
  }
  
  if ('display' in profile && typeof profile.display === 'string') {
    return profile.display;
  }
  
  if (profile.resourceType === 'Patient') {
    const patient = profile as Patient;
    if (patient.name && patient.name.length > 0) {
      const name = patient.name[0];
      const given = name.given || [];
      const family = name.family || '';
      return `${given.join(' ')} ${family}`.trim();
    }
  }
  
  if (profile.resourceType === 'Practitioner') {
    const practitioner = profile as Practitioner;
    if (practitioner.name && practitioner.name.length > 0) {
      const name = practitioner.name[0];
      const given = name.given || [];
      const family = name.family || '';
      return `Dr. ${given[0] || ''} ${family}`.trim();
    }
  }
  
  return 'User';
} 