import { MedplumProvider } from '@medplum/react';
import { useMedplum } from '@medplum/react';
import { App as ChartApp } from '../../../chart/src/App';

export function ChartWrapper(): JSX.Element {
  const coreMedplum = useMedplum();

  return (
    <MedplumProvider medplum={coreMedplum}>
      <ChartApp />
    </MedplumProvider>
  );
}