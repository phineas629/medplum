# Medplum EHR Application

A modern Electronic Health Record (EHR) application built using [Medplum](https://www.medplum.com/) version 4.0 and React.

## Features

- Patient management
- Appointment scheduling
- Task tracking
- Analytics and reports
- Modern, responsive UI
- FHIR-compliant data model
- Person-centered care approach
- Multi-factor authentication (MFA) support
  - TOTP (authenticator app) support
  - Phone number verification (SMS)

## Prerequisites

- Node.js 20.x or higher
- npm 9.x or higher

## Getting Started

1. Clone the repository:

```bash
git clone <repository-url>
cd medplum-ehr-app
```

2. Install dependencies:

```bash
npm install
```

3. Configure your Medplum server:

Open `src/main.tsx` and update the `baseUrl` in the MedplumClient configuration.

4. Start the development server:

```bash
npm run dev
```

This will start the application on http://localhost:3000.

## Building for Production

To build the application for production:

```bash
npm run build
```

The built application will be in the `dist` directory.

## Security Features

### Multi-Factor Authentication

This application supports Multi-Factor Authentication (MFA) for enhanced security:

- **MFA at Login**: After entering username and password, users may need to complete a second verification step.
- **MFA Setup**: Users can enable MFA from the Settings page by scanning a QR code with their authenticator app or entering a verification code.
- **TOTP Support**: Time-based One-Time Password authentication is fully integrated.
- **SMS Verification**: Phone number verification (demonstration included, requires backend implementation).

## Customization

### Authentication

This application uses Medplum for authentication. You can configure Google Sign-In in the `SignInPage.tsx` file.

### FHIR Resources

The application is designed to work with standard FHIR resources like Patient, Practitioner, Appointment, etc.

## License

MIT 