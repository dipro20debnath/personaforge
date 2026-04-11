# Software Requirements Specification
## for PersonaForge
Version 1.0

---

## Table of Contents
1. Introduction
2. Overall Description
3. System Features
4. External Interface Requirements
5. Other Nonfunctional Requirements
6. Other Requirements
7. Appendices

---

## 1. Introduction

### 1.1 Purpose

This Software Requirements Specification (SRS) document specifies the functional and non-functional requirements for **PersonaForge** - a comprehensive web-based personal growth and personality management platform. PersonaForge enables users to:
- Complete scientifically-validated personality assessments
- Track personal skills and development goals
- Manage daily habits and challenges
- Build personalized learning paths
- Maintain a reflective journal with mood tracking
- Monitor progress toward life goals and abroad education plans
- Manage finances and wellness metrics
- Access real-time AI-powered recommendations

This document covers the complete system including user-facing features, administrative capabilities, and technical infrastructure deployed on Vercel (frontend) and Railway (backend).

### 1.2 Document Conventions

- **MUST**: Mandatory requirement - system shall implement
- **SHOULD**: Recommended requirement - system should implement
- **MAY**: Optional requirement - system may implement
- **HIGH Priority**: Critical for MVP launch
- **MEDIUM Priority**: Important but not blocking
- **LOW Priority**: Nice-to-have enhancements
- Code examples are shown in monospace font
- User-facing features are marked with 👤
- Admin features are marked with ⚙️
- API endpoints are marked with 🔌

### 1.3 Intended Audience and Reading Suggestions

- **Developers**: Read Sections 3, 4, and technical appendices for implementation details
- **Product Managers**: Read Sections 1, 2, and 3 for feature overview and priorities
- **QA/Testers**: Read Sections 3, 4, 5 for comprehensive requirements and edge cases
- **Stakeholders**: Read Sections 1, 2 for project scope and business objectives
- **DevOps/Infrastructure**: Read Sections 4, 5, and infrastructure appendices

### 1.4 Project Scope

PersonaForge is a production web application designed to help users (ages 16+) systematically develop their personality, skills, and personal growth. The system includes:

**Included in Scope:**
- User authentication and profile management
- Assessment modules (personality, skills, goals)
- Dashboard with real-time statistics
- Goal and habit tracking with progress visualization
- Journal entries with AI analysis
- Learning path recommendations
- Administrative panel with user management
- Real-time notifications
- Mobile-responsive interface
- AI-powered insights and recommendations
- Export and privacy controls

**Out of Scope (Future Releases):**
- Video tutorials and courses
- Community features and social networking
- Advanced data analytics and reporting
- Offline functionality
- Native mobile applications (currently web-only)

### 1.5 References

- OpenAI GPT API Documentation
- JWT Authentication Standards (RFC 7519)
- IPIP-50 Personality Assessment Protocol
- Express.js Security Best Practices
- Next.js Best Practices Documentation
- PostgreSQL Documentation
- Railway Platform Documentation
- Vercel Deployment Documentation

---

## 2. Overall Description

### 2.1 Product Perspective

PersonaForge is a self-contained web application built as a complete system with three main components:

1. **Frontend (Client)**: Next.js 14 React application with TypeScript
2. **Backend (Server)**: Express.js REST API with Node.js
3. **Database**: PostgreSQL on Railway (production) / SQL.js (development)

The system is deployed on:
- **Frontend**: Vercel (Cloud hosting)
- **Backend**: Railway (Cloud hosting)
- **Database**: Railway PostgreSQL (Managed database)

### 2.2 Product Features

**Core User Features:**
- ✅ User Authentication (Sign up, Login, Password reset)
- ✅ Personality Assessment (IPIP-50 Big Five personality traits)
- ✅ Skill Tracking (Self-assessment with world benchmarks)
- ✅ Goal Management (SMART goals with milestones)
- ✅ Habit Tracking (Daily, weekly, monthly cadence with streaks)
- ✅ Journal Entries (Mood tracking and reflections)
- ✅ Learning Paths (AI-recommended growth resources)
- ✅ 100-Day Challenge (Calendar-based daily challenges)
- ✅ Money Management (Income/expense tracking)
- ✅ Mental Health Monitoring (Wellness metrics)
- ✅ Abroad Education Planning (Visa tracking for international students)
- ✅ Daily Routines (Customizable daily schedule)
- ✅ Voice Commands (Voice-input support)
- ✅ Notifications (Real-time system alerts)
- ✅ Profile Management (Public profile with avatar, bio)
- ✅ CV Builder (Resume generation tool)

**Administrative Features (⚙️):**
- ✅ Admin Dashboard (System statistics and overview)
- ✅ User Management (View, edit, delete users)
- ✅ Activity Logs (Track user actions)
- ✅ Content Moderation (Approve/flag journal entries)
- ✅ System Settings (Configure application settings)
- ✅ User Analytics (View user engagement metrics)

**AI Features:**
- ✅ Personality-based Recommendations
- ✅ Skill Gap Analysis
- ✅ Learning Path Generation
- ✅ Journal Analysis with mood tracking
- ✅ Goal Success Probability Scoring
- ✅ Real-time AI Insights

### 2.3 User Classes and Characteristics

**User Class 1: Regular Users (Primary Audience)**
- Age: 16-65 years old
- Technical Proficiency: Moderate (can use web apps comfortably)
- Frequency: Daily to weekly usage
- Characteristics: 
  - Self-improvement focused individuals
  - Career changers and students
  - Goal achievers
  - Personal development enthusiasts
- Features Used: All user-facing features except admin

**User Class 2: Administrative Users (Internal)**
- Technical Proficiency: High
- Frequency: Daily for operations
- Characteristics:
  - System administrators
  - Support staff
  - Content moderators
  - Product managers
- Features Used: Admin dashboard, user management, content moderation, logs

**User Class 3: International Students (Secondary Audience)**
- Age: 18-30 years old
- Characteristics:
  - Planning abroad education
  - Visa application tracking
  - Requirement checklist management
  - Timeline monitoring
- Features Used: Abroad goal planning, skill tracking, learning paths

### 2.4 Operating Environment

**Frontend (Client):**
- Supported Browsers: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- Mobile Support: iOS Safari 12+, Android Chrome 90+
- Screen Resolutions: 320px (mobile) to 2560px (4K)
- JavaScript: ES2020+
- Internet Connection: Minimum 2Mbps recommended

**Backend (Server):**
- Runtime: Node.js 18+ LTS
- Platform: Railway (Linux containers)
- Memory: Minimum 512MB RAM
- CPU: Minimum 0.5 CPU cores
- Uptime Target: 99.9% (SLA)

**Database:**
- Engine: PostgreSQL 14+
- Hosting: Railway Managed Database
- Storage: Minimum 1GB initial allocation
- Backup: Daily automated backups
- SSL: Required for all connections

**Development Environment:**
- OS: Windows, macOS, Linux
- Node.js: 18.x or 20.x
- npm: 9.x or higher
- Git: Latest version required

### 2.5 Design and Implementation Constraints

**Technical Constraints:**
- Must use TypeScript for type safety
- Must implement JWT-based authentication
- Must use PostgreSQL for production data
- Must support CORS for cross-origin requests
- Must use bcryptjs for password hashing (minimum 12 rounds)
- Must implement rate limiting on all auth endpoints
- Must use HTTPS for all production communications
- Must follow REST API conventions

**Performance Constraints:**
- Frontend bundle size: <200KB (gzipped)
- API response time: <200ms (p95)
- Database query time: <100ms (p95)
- Page load time: <2 seconds (initial load)
- Time to interactive: <3 seconds

**Security Constraints:**
- Password minimum: 8 characters with uppercase, lowercase, number, special char
- JWT expiration: 7 days
- Session timeout: 30 minutes of inactivity
- Rate limiting: 5 login attempts per 15 minutes
- HTTPS enforcement: Required on all production URLs
- Data encryption: OAuth tokens stored securely

**Regulatory Constraints:**
- GDPR compliance for EU users
- Data privacy policy required
- User consent for data processing
- Right to export/delete personal data

### 2.6 User Documentation

Delivered Documentation:
- User Guide (PDF/Web)
- Admin Panel Guide (Internal wiki)
- API Documentation (OpenAPI/Swagger)
- Getting Started Tutorial (Video)
- FAQ and Troubleshooting Guide
- Video Walkthroughs (YouTube playlist)
- In-app Help and Tooltips

### 2.7 Assumptions and Dependencies

**Assumptions:**
- Users have reliable internet connection
- Users understand personal growth concepts
- Users will complete initial profile setup
- Admin users have training documentation
- OpenAI API remains available and stable
- Railway infrastructure will maintain 99.9% uptime
- Vercel CDN performance is consistent globally

**Dependencies:**
- OpenAI API for AI features (can fallback to basic recommendations)
- PostgreSQL 14+ DBMS (managed by Railway)
- Node.js 18+ runtime environment
- Express.js web framework (v4.21+)
- Next.js framework (v14.2+)
- External email service for password resets
- External storage for file uploads (future)

---

## 3. System Features

### 3.1 User Authentication

#### Description and Priority
**Priority: HIGH** (MVP Critical)

User authentication is the foundation of the system. Users must authenticate before accessing personal data. The system must support:
- Email/password registration
- Login with JWT tokens
- Automatic session expiration
- Password reset functionality

#### Functional Requirements

**REQ-AUTH-1**: Registration Process
- Users MUST provide email and password to register
- Email MUST be validated as unique (case-insensitive)
- Password MUST meet complexity requirements: 8+ chars, uppercase, lowercase, digit
- System SHOULD validate email format (RFC 5322)
- Registration response MUST return JWT token
- User profile MUST be auto-created on registration
- Welcome notification MUST be sent

**REQ-AUTH-2**: Login Process
- Users MUST login with email and password
- Email MUST be case-insensitive during login
- Password comparison MUST use bcryptjs constant-time comparison
- Successful login MUST return JWT token valid for 7 days
- Failed login MUST return generic "Invalid credentials" message
- Rate limiting MUST enforce 5 attempts per 15 minutes per IP

**REQ-AUTH-3**: JWT Token Management
- Tokens MUST be stored in localStorage as 'pf_token'
- Tokens MUST expire after 7 days
- Expired tokens MUST redirect user to login
- Token refresh SHOULD extend expiration by 7 days
- Token validation MUST check signature and expiration

**REQ-AUTH-4**: Session Management
- Sessions MUST timeout after 30 minutes of inactivity
- Users SHOULD be able to logout manually
- Logout MUST clear token from localStorage
- Logout MUST clear user data from localStorage

### 3.2 Personality Assessment

#### Description and Priority
**Priority: HIGH** (Core feature)

The personality assessment module uses the IPIP-50 Big Five assessment to evaluate user personality across five dimensions: Openness, Conscientiousness, Extraversion, Agreeableness, and Neuroticism.

#### Functional Requirements

**REQ-ASSESS-1**: Assessment Delivery
- Assessment MUST contain 50 questions (10 per dimension)
- Questions MUST be presented one per page
- User MUST be able to skip questions and return
- Progress bar MUST show completion percentage
- Questions MUST use 5-point Likert scale (Strongly Disagree to Strongly Agree)

**REQ-ASSESS-2**: Scoring Calculation
- System MUST calculate score for each dimension (0-100 scale)
- Scoring MUST be normalized using z-scores
- Results MUST include percentile rankings
- System MUST compare to world averages (population mean)

**REQ-ASSESS-3**: Results Display
- Results MUST show 5 personality scores with visualizations
- Results MUST include world average comparisons
- Results MUST provide interpretations for each dimension
- Results MUST be saved to user profile
- Assessment history MUST be retrievable

### 3.3 Goal Management

#### Description and Priority
**Priority: HIGH** (Core feature)

Users can set SMART goals with measurable progress tracking and milestone management.

#### Functional Requirements

**REQ-GOAL-1**: Goal Creation
- Users MUST be able to create goals with:
  - Title (required, 3-200 chars)
  - Description (optional)
  - Category (personal, career, health, education, financial, other)
  - Target value (metric-based or binary)
  - Due date (optional)
  - Current progress (initialized at 0)
- Goal MUST be immediately saved to database
- User MUST receive confirmation notification

**REQ-GOAL-2**: Goal Progress Tracking
- Users MUST be able to update progress with numeric value or percentage
- Progress updates MUST be timestamped
- System MUST track progress history
- System SHOULD calculate completion rate
- User SHOULD see progress visualization (progress bar)

**REQ-GOAL-3**: Milestones
- Users MUST be able to add milestones to goals
- Milestones MUST have title and due date
- Milestones MUST be markable as complete (checkbox)
- Milestone completion MUST update goal progress
- Users MUST receive notifications for milestone deadlines

**REQ-GOAL-4**: Goal Status
- Goals MUST have status: active, completed, archived, on-hold
- Users MUST be able to change goal status
- Completed goals MUST show completion date
- System SHOULD analyze goal success rate

### 3.4 Habit Tracking

#### Description and Priority
**Priority: HIGH** (Core feature)

Daily habit tracking with streak management and calendar visualization.

#### Functional Requirements

**REQ-HABIT-1**: Habit Creation
- Users MUST create habits with:
  - Title (required, 2-100 chars)
  - Description (optional)
  - Cadence (daily, weekly, monthly)
  - Icon (emoji selector)
- Habit MUST be tracked from creation date

**REQ-HABIT-2**: Daily Check-in
- Users MUST check in daily for completed habits
- Check-in MUST record date and time
- Users MAY add optional note/reflection
- System MUST update current streak count
- System MUST track best streak (all-time high)

**REQ-HABIT-3**: Streak Calculations
- Current streak MUST reset if missed one day
- Best streak MUST be all-time maximum consecutive days
- System SHOULD show motivation based on streak length
- Users MUST be able to view historical check-ins

**REQ-HABIT-4**: Calendar View
- Users MUST see calendar visualization of habits
- Calendar MUST show completed days in green
- Calendar MUST show missed days in red
- Users MUST be able to navigate between months
- Users SHOULD be able to mark days retroactively

### 3.5 Journal Entries

#### Description and Priority
**Priority: MEDIUM** (Important feature)

Reflective journaling with mood tracking and AI analysis.

#### Functional Requirements

**REQ-JOURNAL-1**: Entry Creation
- Users MUST create journal entries with:
  - Title (optional)
  - Content (required, 1-5000 chars)
  - Mood (optional: happy, sad, angry, anxious, calm, neutral)
  - Tags (optional, comma-separated)
- System MUST timestamp entries
- Users MUST earn 10 XP per entry

**REQ-JOURNAL-2**: Entry Management
- Users MUST be able to view all entries
- Entries MUST be sortable by date (newest first)
- Users MUST be able to edit entries within 24 hours
- Users MUST be able to delete entries
- System MUST track edit history

**REQ-JOURNAL-3**: Mood Analytics
- System MUST display mood trends over time
- System SHOULD show most common mood
- System MUST provide mood history visualization
- System SHOULD detect patterns and anomalies

**REQ-JOURNAL-4**: Entry Privacy
- Entries MUST be private to user account
- Admin SHOULD be able to view entries (with moderation flag)
- Users MUST be able to flag entries as private
- System MUST support soft-delete (archive)

### 3.6 Admin Dashboard

#### Description and Priority
**Priority: HIGH** (Operations Critical)

Administrative interface for system management and user oversight.

#### Functional Requirements

**REQ-ADMIN-1**: Dashboard Overview
- Admin MUST see:
  - Total registered users
  - Active users (logged in last 7 days)
  - Total goals created
  - Total habits tracked
  - Total journal entries
  - System health status
- All statistics MUST refresh in real-time

**REQ-ADMIN-2**: User Management
- Admin MUST view list of all users with:
  - Email address
  - Registration date
  - Last login date
  - Account status (active/inactive/suspended)
  - Role (user/admin/moderator)
- Admin MUST be able to:
  - Search users by email
  - Filter by registration date
  - View user details
  - Delete user accounts (with confirmation)
  - Change user roles

**REQ-ADMIN-3**: Activity Logs
- System MUST log all significant actions:
  - User logins/logouts
  - Goal creation/updates
  - Habit check-ins
  - Journal entries
  - Admin actions
- Admin MUST be able to search logs by:
  - Date range
  - Event type
  - User ID
  - Action status
- Logs MUST be exportable

**REQ-ADMIN-4**: Content Moderation
- Admin MUST view flagged content
- Admin MUST approve or reject flagged journal entries
- Admin MUST add moderation notes
- System MUST track moderation decisions
- Users MUST be notified of moderation outcomes

### 3.7 Real-time Notifications

#### Description and Priority
**Priority: MEDIUM** (UX Enhancement)

Real-time notifications for user actions and system events.

#### Functional Requirements

**REQ-NOTIF-1**: Notification Types
- System MUST support notifications for:
  - Welcome messages (on registration)
  - Goal reminders (approaching deadlines)
  - Habit reminders (daily check-in prompts)
  - Achievement unlocked (streaks, milestones)
  - System announcements
  - Friend activity (future)
- Each notification MUST have type, title, and message

**REQ-NOTIF-2**: Notification Delivery
- Notifications MUST be stored in database
- Notifications MUST display in-app notification center
- Notifications MUST have mark-as-read functionality
- Notifications MUST be sortable by date
- System SHOULD support push notifications (future)

**REQ-NOTIF-3**: User Preferences
- Users MUST be able to enable/disable notification types
- Users MUST be able to control notification frequency
- System MUST respect user preferences

### 3.8 AI Recommendations

#### Description and Priority
**Priority: MEDIUM** (Competitive Feature)

OpenAI-powered recommendations based on user personality and goals.

#### Functional Requirements

**REQ-AI-1**: Personality Recommendations
- System MUST generate skill recommendations based on personality
- System MUST suggest goal categories matching personality
- System MUST recommend learning paths
- Recommendations MUST be generated on first assessment completion

**REQ-AI-2**: Goal Analysis
- System MUST analyze goal descriptions for feasibility
- System MUST suggest success probability (0-100%)
- System MUST recommend milestone structure
- System MUST suggest timeline based on goal complexity

**REQ-AI-3**: Insight Generation
- System SHOULD generate daily insights
- System SHOULD provide encouragement messages
- System SHOULD identify trends in journal entries
- All insights MUST be opt-in via user preferences

**REQ-AI-4**: Rate Limiting
- AI requests MUST be rate-limited (max 10 per hour per user)
- System MUST gracefully handle API failures
- System MUST provide fallback responses
- System SHOULD cache common recommendations

---

## 4. External Interface Requirements

### 4.1 User Interfaces

**Web Application Interface:**

**Navigation Structure:**
- Top-level navigation (desktop)
- Hamburger menu (mobile)
- Sidebar navigation with sections:
  - Dashboard
  - Profile
  - Growth & Development
  - Goals & Progress
  - Daily Life
  - Wellness
  - Content
  - Settings

**Dashboard Page:**
- Statistics cards (users, goals, habits, assessments, challenges)
- Recent activity feed
- Quick action buttons
- Calendar view for habits
- Progress visualizations (charts/graphs)

**Responsive Breakpoints:**
- Mobile: 320px - 640px
- Tablet: 641px - 1024px
- Desktop: 1025px+

**Accessibility Requirements:**
- WCAG 2.1 AA compliance
- Keyboard navigation support
- Screen reader compatibility
- Color contrast ratio: 4.5:1 for text
- Font size: minimum 16px for body text

**UI Components:**
- Buttons with hover/active states
- Form inputs with validation messages
- Modal dialogs for confirmations
- Toast notifications for feedback
- Loading spinners with skeleton screens
- Data tables with sorting/filtering
- Charts using Chart.js or similar

### 4.2 Hardware Interfaces

**Not Applicable** - Web-only application. No direct hardware interfaces required. Mobile devices supported through responsive design.

### 4.3 Software Interfaces

**Backend API Endpoints:**

| Method | Endpoint | Authentication | Purpose |
|--------|----------|-----------------|---------|
| POST | /api/auth/register | None | User registration |
| POST | /api/auth/login | None | User login |
| GET | /api/profile | Required | Get user profile |
| PUT | /api/profile | Required | Update user profile |
| GET | /api/assessment/questions | Required | Get assessment questions |
| POST | /api/assessment/submit | Required | Submit assessment responses |
| GET | /api/assessment/latest | Required | Get latest assessment |
| GET | /api/goals | Required | List user goals |
| POST | /api/goals | Required | Create goal |
| PUT | /api/goals/:id | Required | Update goal |
| DELETE | /api/goals/:id | Required | Delete goal |
| GET | /api/habits | Required | List user habits |
| POST | /api/habits | Required | Create habit |
| POST | /api/habits/:id/checkin | Required | Check in habit |
| GET | /api/journal | Required | List journal entries |
| POST | /api/journal | Required | Create entry |
| DELETE | /api/journal/:id | Required | Delete entry |
| GET | /api/notifications | Required | Get notifications |
| PUT | /api/notifications/read/:id | Required | Mark as read |
| GET | /api/dashboard | Required | Get dashboard stats |
| GET | /api/admin/users | Admin | List all users |
| DELETE | /api/admin/users/:id | Admin | Delete user |
| GET | /api/admin/logs | Admin | Get activity logs |

**Third-party Integrations:**
- OpenAI API (GPT-3.5/4): For AI recommendations and analysis
- Email Service: For password resets and notifications (future)
- OAuth Providers: For single sign-on (future)

### 4.4 Communications Interfaces

**HTTP/HTTPS Protocol:**
- Transport: HTTPS (TLS 1.2+)
- Port: 443 (HTTPS)
- Request Format: JSON
- Response Format: JSON
- All communication MUST be encrypted

**Error Response Format:**
```json
{
  "error": "Error message here",
  "code": "ERROR_CODE",
  "status": 400
}
```

**Success Response Format:**
```json
{
  "data": { /* response data */ },
  "status": 200
}
```

**Rate Limiting Headers:**
- X-RateLimit-Limit: 100
- X-RateLimit-Remaining: 99
- X-RateLimit-Reset: 1626000000

**Authentication Headers:**
- Authorization: Bearer <JWT_TOKEN>
- Content-Type: application/json

---

## 5. Other Nonfunctional Requirements

### 5.1 Performance Requirements

- **Page Load Time**: Initial page load < 2 seconds on 3G network
- **Time to Interactive**: < 3 seconds (Core Web Vitals)
- **API Response Time**: 95th percentile < 200ms
- **Database Query Time**: 99th percentile < 100ms
- **Largest Contentful Paint (LCP)**: < 2.5 seconds
- **First Input Delay (FID)**: < 100ms
- **Cumulative Layout Shift (CLS)**: < 0.1
- **Concurrent Users**: Support 1000+ simultaneous users
- **Request Throughput**: 5000+ requests per second capacity

### 5.2 Safety Requirements

**Data Loss Prevention:**
- Daily automated database backups
- Backup retention: Minimum 30 days
- Recovery Time Objective (RTO): < 1 hour
- Recovery Point Objective (RPO): < 24 hours
- Disaster recovery plan documented

**System Stability:**
- Graceful error handling for all failures
- Circuit breaker pattern for external APIs
- Fallback mechanisms for AI features
- Health monitoring and alerting
- Automatic service restart on failure

### 5.3 Security Requirements

**Authentication & Authorization:**
- JWT-based stateless authentication
- Password hashing: bcryptjs 12+ rounds
- Role-based access control (RBAC): user, admin, moderator
- Session timeout: 30 minutes inactivity
- Rate limiting: 5 failed logins per 15 minutes

**Data Protection:**
- Encryption at rest: AES-256
- Encryption in transit: TLS 1.2+
- Password minimum: 8 chars (uppercase, lowercase, digit, special)
- SQL injection prevention: Parameterized queries
- XSS prevention: Input sanitization, Content Security Policy
- CSRF protection: CSRF tokens on state-changing requests

**Infrastructure Security:**
- Firewall rules restricting access
- No hardcoded credentials in code
- Environment variable protection
- HTTPS enforcement on all URLs
- Security headers (Helmet middleware):
  - Strict-Transport-Security
  - X-Content-Type-Options
  - X-Frame-Options
  - Content-Security-Policy

**Compliance:**
- GDPR compliance: User consent, data export, deletion
- Privacy policy publicly available
- Terms of service published
- Data processing agreements for third-parties
- Audit logging of admin actions

### 5.4 Software Quality Attributes

**Reliability:**
- System uptime: 99.9% SLA
- Mean time between failures: > 720 hours
- Mean time to recovery: < 1 hour
- Zero data loss tolerance

**Maintainability:**
- Code coverage: > 80% for critical paths
- TypeScript for type safety
- Consistent code style (ESLint)
- Comprehensive code documentation
- Modular component architecture

**Usability:**
- Intuitive navigation (3-click rule)
- Clear error messages with actionable guidance
- Consistent UI/UX across all pages
- Mobile-first responsive design
- Accessibility compliance (WCAG 2.1 AA)

**Portability:**
- Docker containerization for deployment
- Database agnostic (PostgreSQL, SQL.js)
- Cloud platform independent
- Cross-browser compatibility (Chrome, Firefox, Safari, Edge)

**Scalability:**
- Horizontal scaling for API servers
- Database connection pooling
- CDN for static assets
- Image optimization and lazy loading
- Caching strategy (browser, server-side)

**Testability:**
- Unit tests for business logic
- Integration tests for API endpoints
- E2E tests for critical user flows
- Automated testing in CI/CD pipeline
- Manual QA for UI/UX

---

## 6. Other Requirements

### 6.1 Database Requirements

**Schema:**
- 20+ tables (users, profiles, goals, habits, journal_entries, assessments, etc.)
- Foreign key constraints enforced
- Indexes on frequently queried fields
- JSONB columns for flexible data (tags, responses, settings)

**Scalability:**
- Connection pooling: max 20 connections
- Query optimization: all queries < 100ms
- Archive old data (> 2 years) automatically
- Data growth projection: 1GB per 100,000 users

### 6.2 Backup & Disaster Recovery

**Backup Strategy:**
- Daily automated backups (00:00 UTC)
- Backup retention: 30 days minimum
- Point-in-time recovery: 7 days
- Backup encryption: AES-256
- Backup location: Geographic redundancy

**Disaster Recovery:**
- RTO: < 1 hour
- RPO: < 24 hours
- Documented recovery procedures
- Regular recovery drills (quarterly)

### 6.3 Internationalization

**Locale Support:**
- English (en-US) - Primary
- Spanish (es-ES) - Secondary
- French (fr-FR) - Planned
- German (de-DE) - Planned
- All text strings externalized to i18n files

**Time Zone Support:**
- User-configurable time zone
- All timestamps in UTC internally
- Local time display in UI
- Scheduled notifications respect time zones

### 6.4 Legal & Regulatory

**Compliance:**
- GDPR (EU users)
- CCPA (California users)
- Data retention policy (automatic deletion after 2 years of inactivity)
- Right to data portability (export all data)
- Right to deletion (GDPR article 17)

**Documentation:**
- Privacy Policy (publicly available)
- Terms of Service (publicly available)
- Data Processing Agreement (for B2B)
- Cookie Policy (for consent)

### 6.5 Deployment & DevOps

**Deployment Stack:**
- Infrastructure: Railway (backend), Vercel (frontend)
- Version Control: GitHub
- CI/CD: GitHub Actions
- Database: Railway PostgreSQL
- Environment: Staging and Production

**Deployment Process:**
- Automatic deployment on main branch merge
- Staging environment for testing
- Blue-green deployment strategy
- Rollback capability (< 5 minutes)
- Smoke tests on deployment

### 6.6 Monitoring & Alerting

**Metrics Tracked:**
- API uptime and response times
- Database performance metrics
- Error rates and error logs
- User activity and engagement
- System resource utilization
- External API (OpenAI) failures

**Alerting Thresholds:**
- API response time: > 500ms
- Error rate: > 1%
- System uptime: < 99%
- Database connections: > 18 (out of 20)
- Memory usage: > 80%

**Logging:**
- Centralized logging
- Log retention: 30 days
- Error tracking: Sentry integration
- Application performance monitoring: New Relic/Datadog

---

## 7. Appendices

### Appendix A: System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                      USER BROWSER                               │
│  (Desktop, Tablet, Mobile - Responsive)                        │
└────────────────┬──────────────────────────────────────────────┘
                 │ HTTPS
                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                    VERCEL CDN (Frontend)                         │
│  Next.js 14 | React 18 | TypeScript | Tailwind CSS             │
│  - Dashboard Page                                               │
│  - Profile Management                                           │
│  - Goal/Habit Tracking                                          │
│  - Admin Panel                                                  │
└────────────────┬──────────────────────────────────────────────┘
                 │ REST API / HTTPS
                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                    RAILWAY (Backend)                             │
│  Express.js | Node.js | REST API                               │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Middleware:                                             │   │
│  │ - Authentication (JWT)                                 │   │
│  │ - Rate Limiting                                        │   │
│  │ - CORS                                                 │   │
│  │ - Security Headers (Helmet)                            │   │
│  │ - Input Validation                                     │   │
│  └─────────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ API Routes:                                             │   │
│  │ - /api/auth/* (authentication)                          │   │
│  │ - /api/profile/* (user profiles)                        │   │
│  │ - /api/assessment/* (personality tests)                 │   │
│  │ - /api/goals/* (goal management)                        │   │
│  │ - /api/habits/* (habit tracking)                        │   │
│  │ - /api/journal/* (journal entries)                      │   │
│  │ - /api/notifications/* (notifications)                 │   │
│  │ - /api/admin/* (admin features) [Protected]             │   │
│  │ - /api/ai/** (AI recommendations)                       │   │
│  └─────────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ External APIs:                                          │   │
│  │ - OpenAI (GPT-3.5/4) for recommendations                │   │
│  │ - Email Service (future notifications)                  │   │
│  └─────────────────────────────────────────────────────────┘   │
└────────────────┬──────────────────────────────────────────────┘
                 │ TCP Connection (SSL)
                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                 RAILWAY PostgreSQL Database                     │
│  - Users & Authentication                                      │
│  - User Profiles                                               │
│  - Personality Assessments                                     │
│  - Goals & Milestones                                          │
│  - Habits & Check-ins                                          │
│  - Journal Entries                                             │
│  - Learning Paths & Enrollments                                │
│  - Notifications                                               │
│  - Admin Logs                                                  │
│  - Settings & Configuration                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Automated Daily Backups (30-day retention)              │  │
│  │ Point-in-Time Recovery (PITR) enabled                  │  │
│  │ SSL/TLS Encryption at rest & in transit                │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

### Appendix B: Data Flow Diagram

**User Registration Flow:**
```
User → Frontend (Register Form) → Backend (/api/auth/register) 
→ Database (INSERT users, profiles) → JWT Token → Frontend 
→ localStorage → Redirect to Dashboard
```

**Goal Creation & Tracking Flow:**
```
User → Frontend (Goal Form) → Backend (/api/goals POST) 
→ Database (INSERT goals) → Notification → Frontend Update
→ Goal Progress Update → Backend (/api/goals/:id PUT) 
→ Database (UPDATE progress) → Analytics
```

**Assessment & Recommendation Flow:**
```
User → Assessment Questions → Submit Responses → Backend 
(POST /api/assessment/submit) → Calculate Scores 
→ Database (INSERT assessments) → OpenAI API (Call recommendations) 
→ Generate Recommendations → Frontend Display
```

### Appendix C: API Response Examples

**Login Response (Success):**
```json
{
  "status": 200,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "user@example.com",
      "role": "user"
    }
  }
}
```

**Error Response:**
```json
{
  "status": 401,
  "error": "Invalid credentials",
  "code": "AUTH_INVALID_CREDENTIALS"
}
```

**Admin Dashboard Response:**
```json
{
  "status": 200,
  "data": {
    "stats": {
      "totalUsers": 1250,
      "activeUsers": 340,
      "totalGoals": 5890,
      "totalHabits": 12340,
      "totalAssessments": 3400
    },
    "recentUsers": [
      {
        "id": "...",
        "email": "new@example.com",
        "createdAt": "2024-04-12T10:30:00Z"
      }
    ]
  }
}
```

### Appendix D: Test Strategy

**Unit Testing:**
- Jest framework
- Target coverage: > 80%
- Tests for: utilities, calculations, validations

**Integration Testing:**
- API endpoint testing
- Database integration
- Auth flow testing
- Target coverage: > 70%

**E2E Testing:**
- Cypress framework
- Critical user journeys:
  - User registration → Login → Assessment → Goal creation
  - Admin login → User management → Content moderation
  - Habit tracking → Streak calculation → Notification

**Performance Testing:**
- Load testing: 1000 concurrent users
- Stress testing: Identify breaking point
- Soak testing: 24-hour endurance test

### Appendix E: Change Log

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2024-04-12 | Initial SRS document |

---

## Document Approval

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Product Manager | Pending | TBD | TBD |
| Tech Lead | Pending | TBD | TBD |
| QA Lead | Pending | TBD | TBD |
