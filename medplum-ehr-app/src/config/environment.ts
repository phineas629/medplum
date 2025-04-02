export const environment = {
  production: false,
  medplum: {
    // Use absolute URLs for the Medplum client (required)
    baseUrl: 'https://claimclock.net',
    storageUrl: 'https://claimclock.net/storage',
    // Proxy path for fetch requests (to avoid CORS)
    proxyPath: '/api',
    // Database connection details for reference
    database: {
      host: 'localhost',
      port: 5432,
      database: 'medplum',
      username: 'medplum',
      password: 'medplum',
    },
    // Development-specific settings
    development: {
      autoBatchTime: 0, // Disable auto-batching in development
      logLevel: 'debug', // Enable debug logging
    },
  },
  // Add other environment-specific configs
}; 