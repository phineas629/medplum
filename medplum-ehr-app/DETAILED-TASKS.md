# Medplum EHR Application - Detailed Page Tasks

This document provides a detailed list of all web pages to be implemented in the Medplum EHR application, organized by functional area.

## Authentication & User Management

### Sign-In Pages
- [ ] **Standard Login Page**
  - Username/password form
  - "Remember me" option
  - Password reset link
  - OAuth provider buttons

- [ ] **MFA Verification Page**
  - TOTP code entry
  - Trusted device option
  - SMS verification option
  - Backup code entry

- [ ] **Password Reset Pages**
  - Email entry form
  - Reset code verification
  - New password form
  - Success confirmation

### User Settings
- [ ] **Profile Management Page**
  - Personal information editor
  - Contact details manager
  - Professional credentials
  - Profile image uploader

- [ ] **Security Settings Page**
  - Password change form
  - MFA setup wizard
  - Recovery options management
  - Session management

- [ ] **Notification Preferences**
  - Email notification toggles
  - SMS notification toggles
  - In-app notification settings
  - Urgent alert configurations

## Patient Management

### Patient Search & Directory
- [ ] **Patient Search Page**
  - Advanced search filters
  - Results list with pagination
  - Quick action buttons
  - Recently viewed patients

- [ ] **Patient Create/Edit Form**
  - Demographics editor
  - Contact information form
  - Insurance information uploader
  - Patient photo capture

### Patient Profile
- [ ] **Patient Summary Dashboard**
  - Demographics summary
  - Key clinical indicators
  - Recent encounters list
  - Action buttons panel

- [ ] **Patient Timeline**
  - Chronological event display
  - Filterable by event type
  - Detail expansion cards
  - Timeline navigation controls

- [ ] **Patient Demographics Tab**
  - Full demographic details
  - Contact information
  - Insurance details
  - Emergency contacts

- [ ] **Patient Preferences Center**
  - Communication preferences
  - Cultural preferences
  - Care goals settings
  - Privacy preferences

### Patient Portal Pages
- [ ] **Patient Portal Home**
  - Upcoming appointments
  - Active tasks
  - Message notifications
  - Health summary

- [ ] **Health Record Access**
  - Lab results viewer
  - Medication list
  - Problem list
  - Visit history

- [ ] **Portal Settings Page**
  - Account settings
  - Access management
  - Privacy preferences
  - Communication options

## Clinical Workflows

### Scheduling
- [ ] **Provider Calendar View**
  - Day/week/month views
  - Resource allocation grid
  - Appointment detail popover
  - Drag-and-drop scheduling

- [ ] **Appointment Booking Form**
  - Patient selector
  - Visit type selection
  - Duration configurator
  - Recurring options

- [ ] **Patient Self-Scheduling**
  - Available time slots browser
  - Provider selection
  - Appointment confirmation
  - Insurance verification

- [ ] **Schedule Management Dashboard**
  - Provider availability overview
  - Room scheduling grid
  - Equipment allocation
  - Optimization suggestions

### Clinical Documentation
- [ ] **Chart Summary View**
  - Problem list
  - Medication list
  - Allergy list
  - Recent results summary

- [ ] **Note Editor**
  - Template selector
  - Rich text editing
  - Auto-text expansion
  - Structured data capture

- [ ] **Problem List Manager**
  - Add/edit problems
  - Status tracking
  - Chronological view
  - Related goals linking

- [ ] **History Collection Forms**
  - Medical history
  - Surgical history
  - Family history
  - Social history

### Medication Management
- [ ] **Medication List View**
  - Current medications
  - Medication history
  - Adherence tracking
  - Interaction checker

- [ ] **Prescription Writer**
  - Medication search
  - Dosing calculator
  - SIG builder
  - ePrescribe workflow

- [ ] **Medication Reconciliation Tool**
  - Import external medications
  - Compare medication lists
  - Resolve discrepancies
  - Document decisions

### Results & Reports
- [ ] **Lab Results Viewer**
  - Tabular results display
  - Trending graphs
  - Abnormal highlighting
  - Result annotation

- [ ] **Diagnostic Image Viewer**
  - DICOM image display
  - Measurement tools
  - Series navigation
  - Report integration

- [ ] **Flowsheet Builder**
  - Parameter selection
  - Time range settings
  - Custom flowsheet templates
  - Data visualization options

## Task Management

### Task Planning
- [ ] **Task Dashboard**
  - Kanban board view
  - List view option
  - Filter and search
  - Task statistics

- [ ] **Task Creation Form**
  - Task type selector
  - Assignee selection
  - Due date picker
  - Priority settings

- [ ] **Task Detail Page**
  - Task description
  - Status updater
  - Comment thread
  - Related item links

### Care Planning
- [ ] **Care Plan Builder**
  - Goal setting interface
  - Intervention selection
  - Progress metrics definition
  - Team role assignment

- [ ] **Care Plan Viewer**
  - Goal progress tracking
  - Intervention status
  - Team member directory
  - Revision history

- [ ] **Shared Decision Making Tools**
  - Option comparison matrix
  - Risk calculator
  - Value clarification exercises
  - Decision documentation

## Messaging & Communication

### Secure Messaging
- [ ] **Message Inbox**
  - Threaded conversation view
  - Message filters
  - Search functionality
  - Unread indicators

- [ ] **Message Composition**
  - Rich text editor
  - Recipient selector
  - Template insertion
  - Attachment handling

- [ ] **Chat Interface**
  - Real-time messaging
  - Typing indicators
  - Media sharing
  - Presence indicators

### Notifications
- [ ] **Notification Center**
  - Alert categorization
  - Read/unread tracking
  - Priority indicators
  - Action buttons

- [ ] **Alert Configuration**
  - Alert type selection
  - Delivery method settings
  - Schedule preferences
  - Escalation rules

## Insurance & Financial

### Insurance Management
- [ ] **Eligibility Verification**
  - Insurance search
  - Coverage detail display
  - Benefit explanation
  - Co-pay/deductible calculator

- [ ] **Prior Authorization**
  - Authorization request form
  - Documentation uploader
  - Status tracker
  - Appeal workflow

- [ ] **Claims Management**
  - Claim creation form
  - Claim status tracker
  - Denial management
  - Resubmission workflow

### Billing
- [ ] **Charge Capture**
  - Service code selection
  - Modifier application
  - Fee schedule display
  - Documentation linkage

- [ ] **Patient Billing Portal**
  - Statement viewer
  - Payment processing
  - Payment plan setup
  - Financial assistance application

- [ ] **Revenue Cycle Dashboard**
  - AR aging reports
  - Collection rate metrics
  - Denial tracking
  - Revenue forecasting

## Administrative Functions

### Employee Management
- [ ] **Staff Directory**
  - Provider profiles
  - Role/specialty filtering
  - Contact information
  - Availability indicators

- [ ] **Provider Scheduling**
  - Template schedule creation
  - Time-off management
  - Room/resource assignment
  - Coverage planning

- [ ] **Credentialing Management**
  - License tracking
  - Certification monitoring
  - Expiration alerts
  - Documentation repository

### Practice Management
- [ ] **Practice Settings**
  - Location management
  - Hours of operation
  - Service configuration
  - Branding settings

- [ ] **Resource Management**
  - Room scheduling
  - Equipment tracking
  - Inventory management
  - Maintenance scheduling

- [ ] **User Access Control**
  - Role definition
  - Permission assignment
  - Access auditing
  - Temporary access management

## Analytics & Reporting

### Clinical Analytics
- [ ] **Quality Measures Dashboard**
  - Measure performance display
  - Trending analysis
  - Benchmark comparisons
  - Improvement recommendations

- [ ] **Population Health**
  - Risk stratification view
  - Care gap identification
  - Outreach tracking
  - Intervention effectiveness

- [ ] **Provider Performance**
  - Quality scores
  - Productivity metrics
  - Patient satisfaction
  - Clinical outcomes

### Operational Analytics
- [ ] **Operational Dashboard**
  - Visit volume tracking
  - Wait time analysis
  - Resource utilization
  - Staff productivity

- [ ] **Financial Analytics**
  - Revenue analysis
  - Cost tracking
  - Payer mix visualization
  - Service line profitability

- [ ] **Custom Report Builder**
  - Measure selection
  - Filtering options
  - Visualization choices
  - Export capabilities

## Patient Engagement

### Patient Acquisition
- [ ] **Public Patient Portal**
  - Practice information
  - Provider directory
  - Service descriptions
  - Registration form

- [ ] **Patient Onboarding Flow**
  - Step-by-step registration
  - Documentation upload
  - Insurance verification
  - Appointment scheduling

- [ ] **Referral Management**
  - Referral request form
  - Referral tracking
  - Document exchange
  - Closed-loop communication

### Marketing & Outreach
- [ ] **Campaign Management**
  - Campaign creation wizard
  - Target audience selection
  - Message template editor
  - Results tracking

- [ ] **Patient Outreach**
  - Recall notification manager
  - Health maintenance alerts
  - Preventive care reminders
  - Educational content delivery

- [ ] **Survey Management**
  - Survey builder
  - Distribution settings
  - Response analytics
  - Feedback action planner

## Integration & Interoperability

### External Connectivity
- [ ] **Integration Dashboard**
  - Connection status monitor
  - Error/exception display
  - Transaction volume metrics
  - Configuration access

- [ ] **SMART on FHIR Apps**
  - App gallery
  - Launch configuration
  - Authorization management
  - Context settings

- [ ] **API Management**
  - API key management
  - Usage monitoring
  - Rate limiting configuration
  - Documentation access

### Data Exchange
- [ ] **Import/Export Tools**
  - File format selection
  - Mapping configuration
  - Validation settings
  - Processing status

- [ ] **Healthcare Information Exchange**
  - Patient matching
  - Document query
  - Data reconciliation
  - Consent management

- [ ] **Device Integration**
  - Device pairing interface
  - Data validation
  - Calibration verification
  - Reading visualization

## Mobile & Remote Access

### Mobile Experience
- [ ] **Mobile Dashboard**
  - Touch-optimized navigation
  - Essential information display
  - Quick action buttons
  - Offline indicator

- [ ] **Mobile Documentation**
  - Simplified note templates
  - Voice dictation
  - Photo/media capture
  - Offline documentation queue

- [ ] **Mobile Patient View**
  - Compact patient summary
  - Key clinical indicators
  - Communication shortcuts
  - Visit preparation

### Telemedicine
- [ ] **Virtual Waiting Room**
  - Patient queue
  - Pre-visit questionnaire
  - Technical readiness check
  - Provider notification

- [ ] **Video Consultation Interface**
  - Video controls
  - Screen sharing
  - Chat sidebar
  - Documentation panel

- [ ] **Remote Monitoring Dashboard**
  - Patient device readings
  - Threshold alerts
  - Trending visualization
  - Intervention documentation

## Person-Centered Enhancements

### Patient Goals & Preferences
- [ ] **Patient Goal Setting**
  - Goal creation wizard
  - Progress tracking
  - Milestone celebration
  - Care team sharing

- [ ] **Preference Documentation**
  - Communication preferences
  - Visit preferences
  - Cultural considerations
  - Learning style assessment

- [ ] **Advanced Care Planning**
  - Directive documentation
  - Healthcare proxy assignment
  - Values exploration
  - Document repository

### Social Determinants of Health
- [ ] **SDOH Assessment**
  - Screening questionnaire
  - Risk visualization
  - Historical comparison
  - Referral suggestions

- [ ] **Resource Directory**
  - Community resource search
  - Category filtering
  - Referral initiation
  - Follow-up tracking

- [ ] **Care Coordination Dashboard**
  - Multi-provider view
  - Social service integration
  - Care transition tracking
  - Coordination task management

### Accessibility Features
- [ ] **Accessibility Controls**
  - Font size adjustment
  - Contrast mode selection
  - Screen reader optimization
  - Input method adaptation

- [ ] **Language & Comprehension**
  - Language selection
  - Medical terminology simplification
  - Education level adaptation
  - Translation services 