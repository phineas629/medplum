import { AppShell, ErrorBoundary, Loading, Logo, useMedplum, useMedplumProfile } from '@medplum/react';
import {
  IconArrowBack,
  IconClipboardHeart,
  IconClipboardList,
  IconDatabaseImport,
  IconHealthRecognition,
  IconQuestionMark,
  IconRobot,
  IconUser,
} from '@tabler/icons-react';
import { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { EncounterPage } from './pages/EncounterPage';
import { PatientPage } from './pages/PatientPage';
import { ResourcePage } from './pages/ResourcePage';
import { SearchPage } from './pages/SearchPage';
import { SignInPage } from './pages/SignInPage';
import { UploadDataPage } from './pages/UploadDataPage';

export function App(): JSX.Element | null {
  const profile = useMedplumProfile();

  return (
    <AppShell
      logo={<Logo size={24} />}
      menus={[
        {
          title: 'Navigation',
          links: [
            {
              icon: <IconArrowBack />,
              label: 'Back to Core',
              href: '/',
            },
          ],
        },
        {
          title: 'Charts',
          links: [{ icon: <IconUser />, label: 'Patients', href: '/Patient' }],
        },
        {
          title: 'Encounters',
          links: [
            { icon: <IconClipboardList />, label: 'All Encounters', href: '/Encounter' },
            {
              icon: <IconClipboardHeart />,
              label: 'My Encounters',
              href: `/Encounter?participant=Practitioner/${profile?.id}`,
            },
          ],
        },
        {
          title: 'Upload Data',
          links: [
            { icon: <IconDatabaseImport />, label: 'Upload Core ValueSets', href: '/upload/core' },
            { icon: <IconQuestionMark />, label: 'Upload Questionnaires', href: '/upload/questionnaire' },
            { icon: <IconRobot />, label: 'Upload Example Bots', href: '/upload/bots' },
            { icon: <IconHealthRecognition />, label: 'Upload Example Patient Data', href: '/upload/example' },
          ],
        },
      ]}
    >
      <ErrorBoundary>
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/signin" element={<SignInPage />} />
            <Route path="/Patient/:id/*" element={<PatientPage />} />
            <Route path="/:resourceType/:id/*" element={<ResourcePage />} />
            <Route path="/:resourceType" element={<SearchPage />} />
            <Route path="/Encounter/:id/*" element={<EncounterPage />} />
            <Route path="/upload/:dataType" element={<UploadDataPage />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </AppShell>
  );
}