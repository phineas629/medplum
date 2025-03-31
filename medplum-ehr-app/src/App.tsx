import { AppShell, ErrorBoundary, Loading, Logo, useMedplum, useMedplumProfile } from '@medplum/react';
import {
  IconCalendarEvent,
  IconChartLine,
  IconClipboardList,
  IconDashboard,
  IconSettings,
  IconUsers,
} from '@tabler/icons-react';
import { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';

// Import pages
import { DashboardPage } from './pages/DashboardPage';
import { LandingPage } from './pages/LandingPage';
import { PatientDetailsPage } from './pages/PatientDetailsPage';
import { PatientsPage } from './pages/PatientsPage';
import { ReportsPage } from './pages/ReportsPage';
import { SchedulePage } from './pages/SchedulePage';
import { SignInPage } from './pages/SignInPage';
import { TasksPage } from './pages/TasksPage';
import { UserSettingsPage } from './pages/UserSettingsPage';

export function App(): JSX.Element | null {
  const medplum = useMedplum();
  const profile = useMedplumProfile();

  if (medplum.isLoading()) {
    return null;
  }

  return (
    <>
      {/* Render the custom header outside of AppShell */}
      {profile && (
        <div style={{ position: 'sticky', top: 0, zIndex: 100 }}>
          {/* We'll add back PatientPortalHeader when we fix the imports */}
        </div>
      )}
      
      <AppShell
        logo={<Logo size={32} />}
        menus={[
          {
            title: 'EHR Menu',
            links: [
              { icon: <IconDashboard size={18} />, label: 'Dashboard', href: '/' },
              { icon: <IconUsers size={18} />, label: 'Patients', href: '/patients' },
              { icon: <IconCalendarEvent size={18} />, label: 'Schedule', href: '/schedule' },
              { icon: <IconClipboardList size={18} />, label: 'Tasks', href: '/tasks' },
              { icon: <IconChartLine size={18} />, label: 'Reports', href: '/reports' },
              { icon: <IconSettings size={18} />, label: 'Settings', href: '/settings' },
            ],
          },
        ]}
      >
        <ErrorBoundary>
          <Suspense fallback={<Loading />}>
            <Routes>
              <Route path="/" element={profile ? <DashboardPage /> : <LandingPage />} />
              <Route path="/signin" element={<SignInPage />} />
              <Route path="/patients" element={<PatientsPage />} />
              <Route path="/patients/:id" element={<PatientDetailsPage />} />
              <Route path="/schedule" element={<SchedulePage />} />
              <Route path="/tasks" element={<TasksPage />} />
              <Route path="/reports" element={<ReportsPage />} />
              <Route path="/settings" element={<UserSettingsPage />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </AppShell>
    </>
  );
} 