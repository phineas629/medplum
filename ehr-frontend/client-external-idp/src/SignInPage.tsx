import { Button, Stack, Title, Loader } from '@mantine/core';
import { useMedplum, Document, useMedplumNavigate } from '@medplum/react';
import { useCallback, useEffect, useState } from 'react';

interface Config {
  EXTERNAL_AUTHORIZE_URL: string;
  EXTERNAL_CLIENT_ID: string;
  EXTERNAL_REDIRECT_URI: string;
  MEDPLUM_PROJECT_ID: string;
  MEDPLUM_CLIENT_ID: string;
  WEB_APP_REDIRECT_URI: string;
}

export function SignInPage(): JSX.Element {
  const medplum = useMedplum();
  const navigate = useMedplumNavigate();
  const [config, setConfig] = useState<Config | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchConfig(): Promise<void> {
      try {
        setIsLoading(true);
        // Fetch configuration from environment variables
        const fetchedConfig: Config = {
          EXTERNAL_AUTHORIZE_URL: import.meta.env.VITE_EXTERNAL_AUTHORIZE_URL,
          EXTERNAL_CLIENT_ID: import.meta.env.VITE_EXTERNAL_CLIENT_ID,
          EXTERNAL_REDIRECT_URI: import.meta.env.VITE_EXTERNAL_REDIRECT_URI,
          MEDPLUM_PROJECT_ID: import.meta.env.VITE_MEDPLUM_PROJECT_ID,
          MEDPLUM_CLIENT_ID: import.meta.env.VITE_MEDPLUM_CLIENT_ID,
          WEB_APP_REDIRECT_URI: import.meta.env.VITE_WEB_APP_REDIRECT_URI,
        };
        setConfig(fetchedConfig);
      } catch {
        // Do not expose any error messages
        setError('Failed to load configuration. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    }

    fetchConfig().catch(() => {
      // Handle any errors that may occur during the fetchConfig call
      setError('Failed to load configuration. Please try again later.');
    });
  }, []);

  const code = new URLSearchParams(window.location.search).get('code');

  useEffect(() => {
    if (code && config) {
      medplum
        .processCode(code)
        .then(() => {
          navigate('/');
        })
        .catch(() => {
          setError('Failed to process authentication code. Please try again.');
        });
    }
  }, [medplum, navigate, code, config]);

  const handleClick = useCallback(() => {
    if (config) {
      medplum
        .signInWithExternalAuth(
          config.EXTERNAL_AUTHORIZE_URL,
          config.EXTERNAL_CLIENT_ID,
          config.EXTERNAL_REDIRECT_URI,
          {
            projectId: config.MEDPLUM_PROJECT_ID,
            clientId: config.MEDPLUM_CLIENT_ID,
            redirectUri: config.WEB_APP_REDIRECT_URI,
          },
          false
        )
        .catch(() => {
          setError('Failed to initiate sign-in. Please try again.');
        });
    } else {
      setError('Configuration not loaded. Please try again later.');
    }
  }, [medplum, config]);

  if (isLoading) {
    return (
      <Document width={500}>
        <Stack align="center">
          <Loader />
          <Title order={2}>Loading...</Title>
        </Stack>
      </Document>
    );
  }

  if (error) {
    return (
      <Document width={500}>
        <Stack align="center">
          <Title order={2}>Error</Title>
          <p>{error}</p>
          <Button onClick={() => window.location.reload()} aria-label="Retry">
            Retry
          </Button>
        </Stack>
      </Document>
    );
  }

  return (
    <Document width={500}>
      <Stack align="center">
        <Title order={2}>Welcome!</Title>
        <Button onClick={handleClick} aria-label="Sign In">
          Sign In
        </Button>
      </Stack>
    </Document>
  );
}