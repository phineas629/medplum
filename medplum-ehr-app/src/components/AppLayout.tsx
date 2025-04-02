import { ReactNode } from 'react';
import { AppShell, Burger, Group, NavLink, Text, Title, UnstyledButton, rem } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useNavigate, useLocation } from 'react-router-dom';
import { useMedplum, useMedplumProfile } from '@medplum/react';
import { Resource } from '@medplum/fhirtypes';

// Icons from https://tabler-icons.io/ (import them properly in a real app)
const DashboardIcon = (): JSX.Element => <div>📊</div>;
const PatientsIcon = (): JSX.Element => <div>👤</div>;
const ScheduleIcon = (): JSX.Element => <div>📅</div>;
const TasksIcon = (): JSX.Element => <div>📋</div>;
const ReportsIcon = (): JSX.Element => <div>📈</div>;
const LogoutIcon = (): JSX.Element => <div>🚪</div>;

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps): JSX.Element {
  const [opened, { toggle }] = useDisclosure();
  const navigate = useNavigate();
  const location = useLocation();
  const medplum = useMedplum();
  const profile = useMedplumProfile() as Resource;
  
  const handleLogout = async (): Promise<void> => {
    // For dev mode
    localStorage.removeItem('medplum.auth.dev');
    // Real logout
    await medplum.signOut();
    navigate('/login');
  };
  
  const navItems = [
    { icon: <DashboardIcon />, label: 'Dashboard', to: '/' },
    { icon: <PatientsIcon />, label: 'Patients', to: '/patients' },
    { icon: <ScheduleIcon />, label: 'Schedule', to: '/schedule' },
    { icon: <TasksIcon />, label: 'Tasks', to: '/tasks' },
    { icon: <ReportsIcon />, label: 'Reports', to: '/reports' },
  ];

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ 
        width: 250, 
        breakpoint: 'sm', 
        collapsed: { mobile: !opened } 
      }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group>
            <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
            <Title order={3}>Medplum EHR</Title>
          </Group>
          
          <Group>
            <Text fw={500}>
              {getProfileName(profile) || 'User'}
            </Text>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <AppShell.Section grow>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              label={item.label}
              leftSection={item.icon}
              active={location.pathname === item.to}
              onClick={() => navigate(item.to)}
              fw={500}
            />
          ))}
        </AppShell.Section>
        
        <AppShell.Section>
          <UnstyledButton
            onClick={handleLogout}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              width: '100%', 
              padding: rem(8),
              borderRadius: rem(4),
              color: 'red'
            }}
          >
            <div style={{ marginRight: rem(12) }}>
              <LogoutIcon />
            </div>
            <Text fw={500}>Logout</Text>
          </UnstyledButton>
        </AppShell.Section>
      </AppShell.Navbar>

      <AppShell.Main>
        {children}
      </AppShell.Main>
    </AppShell>
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