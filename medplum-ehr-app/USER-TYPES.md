# Medplum EHR Application - User Types & Personas

This document outlines the different user types, detailed personas, and user-specific requirements for the Medplum EHR application. Understanding these user types is critical for designing appropriate interfaces, workflows, and access controls.

## User Type Overview

| User Type | Primary Goals | Key Features | Access Level |
|-----------|--------------|--------------|--------------|
| Patients | Manage health, communicate with providers, access records | Patient portal, messaging, appointment scheduling | Limited to own data |
| Providers (Physicians) | Diagnose, treat, document care | Clinical documentation, ordering, results review | Full clinical access for assigned patients |
| Nurses | Patient care, care coordination, documentation | Medication administration, vital signs, care plans | Clinical access for assigned patients |
| Medical Assistants | Patient intake, basic clinical tasks | Intake forms, vital signs entry, scheduling | Limited clinical access |
| Front Desk Staff | Registration, scheduling, billing | Check-in/out, appointment scheduling, insurance verification | Administrative access, limited clinical |
| Care Coordinators | Manage care plans, coordinate services | Care plan tools, referral management, task tracking | Clinical/administrative hybrid access |
| Billing Staff | Claim submission, payment processing | Coding, claim management, payment posting | Financial access, limited clinical |
| Practice Administrators | Oversight, operations management | Reports, configuration, user management | Full system administration |
| IT Staff | System management, technical support | Configuration, troubleshooting, integration management | Technical administration |

## Detailed User Personas

### Patient Personas

#### 1. Tech-Savvy Patient
- **Name:** Alex, 35
- **Characteristics:** Comfortable with technology, prefers digital communication
- **Goals:** 
  - Self-manage health through digital tools
  - Quick access to results and records
  - Minimal in-person visits when virtual options exist
- **Frustrations:**
  - Delayed responses
  - Paper-based processes
  - Redundant data entry
- **Key Features:**
  - Mobile app access
  - Self-scheduling
  - Secure messaging
  - Digital forms

#### 2. Chronic Condition Patient
- **Name:** Maria, 58
- **Characteristics:** Multiple health conditions, frequent interactions with healthcare system
- **Goals:**
  - Coordinate care across multiple providers
  - Track medications and appointments
  - Monitor health metrics over time
- **Frustrations:**
  - Fragmented care
  - Information discrepancies between providers
  - Difficulty tracking complex care plans
- **Key Features:**
  - Comprehensive health summary
  - Medication management tools
  - Care plan tracking
  - Health monitoring graphs

#### 3. Elderly Patient with Caregiver Support
- **Name:** Robert, 82 (with daughter Susan as caregiver)
- **Characteristics:** Limited technology experience, relies on family for support
- **Goals:**
  - Maintain independence while getting support
  - Share appropriate information with caregivers
  - Simple interface for basic tasks
- **Frustrations:**
  - Complex interfaces
  - Small text and controls
  - Multiple login requirements
- **Key Features:**
  - Proxy access for caregivers
  - Accessibility features
  - Simplified views
  - Print-friendly options

#### 4. Parent Managing Child's Health
- **Name:** Jennifer, 42 (parent of 10-year-old)
- **Characteristics:** Managing own health and child's health, time-constrained
- **Goals:**
  - Efficiently manage family appointments
  - Track immunizations and growth
  - Communicate with pediatrician
- **Frustrations:**
  - Juggling multiple accounts
  - Scheduling conflicts
  - Remembering developmental milestones
- **Key Features:**
  - Family account management
  - Growth and development tracking
  - Immunization records
  - School/camp form generation

### Provider Personas

#### 1. Primary Care Physician
- **Name:** Dr. Thomas, 45
- **Characteristics:** High patient volume, broad scope of care
- **Goals:**
  - Efficient documentation
  - Comprehensive patient view
  - Effective care coordination
- **Frustrations:**
  - Documentation burden
  - Information overload
  - Interruptions to workflow
- **Key Features:**
  - Quick documentation templates
  - Prioritized patient information
  - Task management
  - Clinical decision support

#### 2. Specialist Physician
- **Name:** Dr. Chen, 52
- **Characteristics:** Focused scope, consultative role
- **Goals:**
  - Access to relevant prior workup
  - Specialty-specific workflows
  - Communication with referring providers
- **Frustrations:**
  - Incomplete referral information
  - Generic workflows not suited to specialty
  - Poor integration with specialty equipment
- **Key Features:**
  - Specialty-specific templates
  - Integrated diagnostic viewing
  - Referral management
  - Standardized communication tools

#### 3. Advanced Practice Provider (NP/PA)
- **Name:** Sarah, NP, 38
- **Characteristics:** Functions both independently and collaboratively
- **Goals:**
  - Practice at top of license
  - Easy consultation with collaborating physicians
  - Efficient documentation
- **Frustrations:**
  - Workflows designed only for physicians
  - Unnecessary approval steps
  - Limited clinical decision support
- **Key Features:**
  - Customizable workflows
  - Collaboration tools
  - Protocol-based ordering
  - Co-signature management

#### 4. Behavioral Health Provider
- **Name:** Dr. Jackson, 41
- **Characteristics:** Highly sensitive documentation, different workflow needs
- **Goals:**
  - Maintain confidentiality
  - Document therapeutic interactions
  - Track treatment plans
- **Frustrations:**
  - Inappropriate sharing of sensitive information
  - Lack of screening tools
  - Templates designed for physical not mental health
- **Key Features:**
  - Enhanced privacy controls
  - Therapeutic note templates
  - Outcome measurement tools
  - Safety assessment tools

### Clinical Support Personas

#### 1. Registered Nurse
- **Name:** Miguel, RN, 36
- **Characteristics:** Direct patient care, care coordination
- **Goals:**
  - Efficient medication administration
  - Patient education
  - Care plan management
- **Frustrations:**
  - Redundant documentation
  - Poor task prioritization
  - Communication gaps with providers
- **Key Features:**
  - Medication workflow optimization
  - Care plan tools
  - Task management
  - Team communication

#### 2. Medical Assistant
- **Name:** Tanya, MA, 29
- **Characteristics:** Patient intake, basic clinical procedures
- **Goals:**
  - Streamline patient check-in
  - Efficient vital signs collection
  - Clear task assignment
- **Frustrations:**
  - Unclear task ownership
  - Inefficient room/patient status tracking
  - Multiple systems for related tasks
- **Key Features:**
  - Intake workflow optimization
  - Vitals collection tools
  - Patient flow tracking
  - Provider communication

#### 3. Care Coordinator
- **Name:** James, 34
- **Characteristics:** Works across clinical and administrative domains
- **Goals:**
  - Track patients through care journey
  - Manage resources and referrals
  - Identify care gaps
- **Frustrations:**
  - Limited visibility into external care
  - Manual tracking processes
  - Communication breakdowns
- **Key Features:**
  - Care journey tracking
  - Referral management
  - Risk stratification tools
  - Population health dashboards

### Administrative Personas

#### 1. Front Desk Staff
- **Name:** Daniela, 32
- **Characteristics:** Patient-facing, multitasking
- **Goals:**
  - Efficient check-in/check-out
  - Schedule management
  - Insurance verification
- **Frustrations:**
  - Phone interruptions
  - Patient wait time management
  - Manual insurance processes
- **Key Features:**
  - Queue management
  - Scheduling optimization
  - Insurance verification automation
  - Patient communication tools

#### 2. Billing Specialist
- **Name:** Marcus, 47
- **Characteristics:** Revenue cycle focus, compliance-oriented
- **Goals:**
  - Clean claim submission
  - Denial management
  - Revenue optimization
- **Frustrations:**
  - Missing documentation
  - Delayed charge capture
  - Manual claim reconciliation
- **Key Features:**
  - Coding assistance
  - Claim scrubbing tools
  - Denial workflow management
  - Revenue analytics

#### 3. Practice Manager
- **Name:** Lisa, 51
- **Characteristics:** Operational oversight, performance management
- **Goals:**
  - Staff productivity tracking
  - Financial performance
  - Compliance management
  - Patient satisfaction
- **Frustrations:**
  - Fragmented reporting
  - Manual data collection
  - Limited operational visibility
- **Key Features:**
  - Performance dashboards
  - Staff scheduling tools
  - Compliance tracking
  - Patient feedback management

#### 4. IT Administrator
- **Name:** Raj, 39
- **Characteristics:** System configuration, technical support
- **Goals:**
  - System reliability
  - Security management
  - User provisioning
  - Integration management
- **Frustrations:**
  - Limited configuration options
  - Poor error reporting
  - Difficult troubleshooting
- **Key Features:**
  - Admin console
  - User management
  - Audit logging
  - Integration monitoring

## User-Specific Requirements

### Authentication & Access Control
- [ ] **Role-Based Access Control**
  - Define permission sets for each user type
  - Implement hierarchical access model
  - Support for temporary access delegation
  - Context-sensitive permission enforcement

- [ ] **User Provisioning Workflows**
  - Provider credentialing process
  - Staff onboarding workflow
  - Patient account creation
  - Role assignment approval process

- [ ] **Patient-Specific Access Controls**
  - Proxy access management for caregivers
  - Age-based access transitions for minors
  - Sensitive information compartmentalization
  - Break-glass emergency access

### User Interface Requirements
- [ ] **Provider-Focused Interfaces**
  - Optimized clinical documentation
  - Decision support integration
  - Information density appropriate for power users
  - Quick action shortcuts

- [ ] **Patient-Focused Interfaces**
  - Simplified health information presentation
  - Education-focused design
  - Mobile-first approach
  - Accessibility optimizations

- [ ] **Administrative Interfaces**
  - Batch processing capabilities
  - Reporting and analytics focus
  - Workflow automation tools
  - Compliance verification

### Workflow Specialization
- [ ] **Clinical Specialty Customization**
  - Specialty-specific templates
  - Custom clinical decision support
  - Specialty equipment integration
  - Condition-specific workflows

- [ ] **Role-Based Task Management**
  - Task assignment by role capabilities
  - Role-specific task queues
  - Licensure-based task routing
  - Team-based task collaboration

- [ ] **Department-Specific Configurations**
  - Department-level settings
  - Custom departmental dashboards
  - Department-specific form libraries
  - Resource management by department

## User Research & Testing

### Research Plan
- [ ] **User Interviews**
  - Schedule sessions with representatives of each user type
  - Document pain points in current workflows
  - Identify feature priorities by user type
  - Validate persona assumptions

- [ ] **Workflow Analysis**
  - Shadow users in real work environments
  - Map current workflows by user type
  - Identify inefficiencies and opportunities
  - Document cross-role interactions

- [ ] **Usability Testing Plan**
  - Define testing protocols for each user type
  - Create scenario-based test scripts
  - Establish usability metrics
  - Schedule regular testing throughout development

### User Onboarding
- [ ] **Role-Based Training Materials**
  - Create user guides for each role
  - Develop video tutorials for key workflows
  - Build interactive training modules
  - Establish certification requirements

- [ ] **Contextual Help System**
  - Implement role-aware help content
  - Create workflow-specific guidance
  - Develop tooltips and coach marks
  - Build searchable knowledge base

- [ ] **User Adoption Tracking**
  - Implement feature usage analytics
  - Create user adoption dashboards
  - Establish user satisfaction surveys
  - Build feature request management system 