import { useMedplum } from 'workspace:workspace:@medplum/react';
import { useEffect } from 'react';

export function SignOutPage(): null {
  const medplum = useMedplum();

  useEffect(() => {
    medplum
      .signOut()
      .then(() => {
        window.location.href = '/';
      })
      .catch(console.error);
  }, [medplum]);

  return null;
}
