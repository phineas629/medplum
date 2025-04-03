# Phase 6: Production Deployment Plan

## Overview
This document outlines the plan for deploying the Medplum v4.0.0 migration to production. The deployment will follow a staged approach to minimize risk and ensure a smooth transition for users.

## Prerequisites
- Successful completion of Phase 5 Testing and Verification
- All tests passing in the CI/CD pipeline
- Required system dependencies in place:
  - Node.js v20+
  - npm v10+
  - PostgreSQL v13+ (if self-hosting)
  - Redis v6+ (if self-hosting)

## 1. Deployment Planning

### 1.1 Maintenance Window
- **Duration**: 4-hour window recommended
- **Timing**: Schedule during off-peak hours (e.g., weekend or evening)
- **Notification Period**: Notify users at least 5 days in advance
- **Communication Channels**: Email, in-app notification, status page

### 1.2 Stakeholder Notification
- **Message Template**: `ehr-frontend/deployment/notification-template.md`
- **Stakeholders to Notify**:
  - System administrators
  - Clinical staff
  - Technical support teams
  - Integration partners

### 1.3 Rollback Procedures
- **Trigger Conditions**:
  - Critical functionality failure
  - Performance degradation beyond acceptable thresholds
  - Data integrity issues
  - Security vulnerabilities
- **Rollback Method**: 
  - Revert to previous version using stored Docker images/deployment artifacts
  - Restore database from pre-migration snapshot (if schema changes were made)
- **Maximum Decision Time**: 30 minutes into deployment to decide whether to proceed or rollback

## 2. Staged Rollout

### 2.1 Stage 1: Canary Deployment (Day 1)
- **Target**: 10% of production environment
- **Duration**: 24 hours minimum
- **Monitoring Focus**:
  - API response times
  - Error rates
  - Resource utilization
  - User-reported issues

### 2.2 Stage 2: Expanded Deployment (Day 2-3)
- **Target**: 50% of production environment
- **Duration**: 48 hours
- **Monitoring Focus**:
  - System stability under increased load
  - Integration points with external systems
  - Database performance

### 2.3 Stage 3: Full Deployment (Day 4-5)
- **Target**: 100% of production environment
- **Validation Criteria**:
  - All monitoring metrics within expected ranges
  - No critical issues reported
  - All integration tests passing in production environment

## 3. Deployment Steps

### 3.1 Pre-Deployment
```bash
# 1. Run final verification tests
./ehr-frontend/phase5-test-runner.sh

# 2. Create database backup (if self-hosting)
pg_dump -U postgres -d medplum > medplum_pre_v4_backup.sql

# 3. Build production artifacts
cd ehr-frontend
npm run build

# 4. Verify build artifacts
ls -la dist/
```

### 3.2 Deployment Execution
```bash
# 1. Deploy updated infrastructure (if using AWS CDK)
cd packages/cdk
npm run deploy -- --stage={environment}

# 2. Deploy frontend application
./deploy-frontend.sh --env=production

# 3. Run database migrations (if required)
npm run migrate
```

### 3.3 Post-Deployment Verification
```bash
# 1. Run smoke tests against production
npm run test:smoke -- --env=production

# 2. Verify API endpoints
curl -s https://api.example.com/healthcheck | grep "status"

# 3. Check logs for any errors
tail -f /var/log/ehr-frontend/application.log
```

## 4. Post-Deployment Monitoring

### 4.1 Health Metrics to Monitor
- **System Health**:
  - Server CPU/Memory usage
  - Database connection pool utilization
  - API response times
  - Error rates by endpoint

- **Application Health**:
  - Login success rate
  - Key workflow completion rates
  - Client-side errors
  - Page load times

### 4.2 Monitoring Schedule
- **First 6 Hours**: Continuous monitoring with 30-minute team check-ins
- **First Week**: Daily review of metrics and logs
- **First Month**: Weekly review of performance trends

### 4.3 Issue Response Protocol
- **Critical Issues**: Immediate response, consider rollback if within window
- **Major Issues**: Assess impact, fix forward if possible with priority patches
- **Minor Issues**: Document and schedule fixes in upcoming sprints

## 5. Communication Plan

### 5.1 Internal Communications
- **Deployment Team**: Real-time communication via dedicated Slack channel
- **Management**: Status updates at key milestones (start, each stage completion, end)
- **Support Team**: Detailed briefing before, during, and after deployment

### 5.2 External Communications
- **Pre-Deployment**: Scheduled maintenance notification (5 days prior)
- **During Deployment**: Status page updates at each stage
- **Post-Deployment**: Success notification with highlights of improvements

## 6. Success Criteria

The deployment will be considered successful when:
1. All production environments are running Medplum v4.0.0
2. All monitoring metrics are within expected ranges for 72 hours
3. No critical or major issues reported for 72 hours
4. All integration points verified and functioning correctly

## 7. Documentation Updates

The following documentation should be updated upon successful deployment:
- API reference documentation
- Developer guides
- Administrator guides
- Release notes

## 8. Deployment Schedule Template

| Time | Activity | Owner | Status |
|------|----------|-------|--------|
| T-5d | Send maintenance notification | Communications Team | Not Started |
| T-2d | Final testing verification | QA Team | Not Started |
| T-1d | Prepare rollback resources | DevOps Team | Not Started |
| T+0h | Begin maintenance window | Deployment Team | Not Started |
| T+1h | Deploy to 10% (Stage 1) | Deployment Team | Not Started |
| T+2h | Verify Stage 1 metrics | Monitoring Team | Not Started |
| T+24h | Deploy to 50% (Stage 2) | Deployment Team | Not Started |
| T+26h | Verify Stage 2 metrics | Monitoring Team | Not Started |
| T+72h | Deploy to 100% (Stage 3) | Deployment Team | Not Started |
| T+74h | Verify final deployment | Monitoring Team | Not Started |
| T+76h | Declare deployment complete | Project Lead | Not Started |
| T+1w | Post-deployment review | All Teams | Not Started |

## 9. Contacts and Responsibilities

| Role | Name | Contact | Responsibilities |
|------|------|---------|------------------|
| Deployment Lead | TBD | TBD | Overall coordination |
| Database Admin | TBD | TBD | Database operations and monitoring |
| Frontend Lead | TBD | TBD | Frontend deployment and verification |
| Backend Lead | TBD | TBD | API and server deployment |
| QA Lead | TBD | TBD | Testing verification and user acceptance |
| Support Lead | TBD | TBD | User communication and issue tracking | 