# PersonaForge Admin Panel - Complete Implementation Guide

## Overview

A comprehensive admin panel has been implemented for PersonaForge with complete frontend and backend integration. The admin panel provides system administrators with tools to manage users, view analytics, moderate content, access system logs, and configure settings.

## ✅ What's Been Implemented

### Backend (Express.js)
- **Admin Middleware** (`server/src/middleware/auth.js`)
  - `adminOnly` - Restricts access to admin/moderator roles
  - `moderatorOnly` - Restricts access to moderator roles
  - Enhanced JWT token validation with role information

- **Admin Routes** (`server/src/routes/admin.js`)
  - **Dashboard** - System statistics and metrics
  - **User Management** - List, search, filter, edit, delete users
  - **System Logs** - Activity tracking and audit logs
  - **Analytics** - User growth and wellness check-in trends
  - **Settings** - System configuration management
  - **Content Moderation** - Review and manage flagged content reports

### Frontend (Next.js)
- **Admin Layout** (`client/src/components/AdminSidebar.tsx`)
  - Professional sidebar navigation
  - Dark-themed admin interface
  - Quick access to all admin features

- **Admin Pages**
  - `/admin` - Dashboard with key metrics
  - `/admin/users` - User management with search and filters
  - `/admin/analytics` - Growth charts and trends
  - `/admin/content` - Content moderation reports
  - `/admin/logs` - System activity logs
  - `/admin/settings` - System configuration

## 🔌 Backend API Endpoints

All endpoints require authentication and admin/moderator role.

### Dashboard
```
GET /api/admin/dashboard
Response: {
  totalUsers: number,
  activeToday: number,
  totalRecords: number,
  newUsersThisMonth: number,
  timestamp: ISO8601
}
```

### User Management
```
GET /api/admin/users?page=1&search=email&limit=10
GET /api/admin/users/:id
PUT /api/admin/users/:id/role { role: 'user'|'moderator'|'admin' }
PUT /api/admin/users/:id/status { status: 'active'|'suspended'|'banned' }
DELETE /api/admin/users/:id
```

### Analytics
```
GET /api/admin/analytics/users
GET /api/admin/analytics/wellness
```

### System Logs
```
GET /api/admin/logs?page=1&type=action&limit=20
```

### Settings
```
GET /api/admin/settings
PUT /api/admin/settings { key: string, value: string }
```

### Content Moderation
```
GET /api/admin/reports?page=1&status=pending&limit=10
PUT /api/admin/reports/:id { status: 'pending'|'reviewed'|'resolved'|'dismissed', action?: string }
```

## 🔐 Role-Based Access Control

Three user roles with different permissions:

| Role | Permissions |
|------|-------------|
| `user` | Regular user access only |
| `moderator` | Can moderate content, view logs, access analytics |
| `admin` | Full system access including user management and settings |

## 🚀 How to Access Admin Panel

### Prerequisites
1. User account must have `role = 'admin'` or `role = 'moderator'`
2. Valid JWT token (obtained from login)

### Accessing Admin Features
1. Login at `/login`
2. If admin/moderator, navigate to `/admin`
3. Use the sidebar to access different sections

### Making a User Admin (Database)
```sql
UPDATE users SET role = 'admin' WHERE email = 'user@example.com';
```

## 📊 Admin Dashboard Features

### Dashboard Page (`/admin`)
- **Statistics Cards**
  - Total Users
  - Active Users Today
  - Total Wellness Records
  - New Users (30 days)
- **Quick Actions** - Links to main admin features
- **System Status** - Database, API, Authentication health

### User Management (`/admin/users`)
- **Search & Filter** - Find users by email or name
- **Pagination** - View users in batches
- **User Details**
  - Email, Name, Role, Status
  - Account creation date
  - Last login timestamp
- **Actions**
  - Edit user role (user/moderator/admin)
  - Update status (active/suspended/banned)
  - Delete user account

### Analytics (`/admin/analytics`)
- **User Growth Chart** - 30-day trend of new users
- **Wellness Check-ins Chart** - Daily wellness submissions
- Interactive charts with Recharts library

### Content Moderation (`/admin/content`)
- **Report Management**
  - View flagged content reports
  - Filter by status (pending/reviewed/resolved)
  - Review report details
- **Actions**
  - Review report
  - Resolve and remove content
  - Dismiss report

### System Logs (`/admin/logs`)
- **Activity Tracking**
  - User ID who performed action
  - Action type (create, update, delete, etc.)
  - Resource type affected
  - Timestamp
  - Additional details

### Settings (`/admin/settings`)
- **Common Configurations**
  - Maintenance mode toggle
  - Max file size
  - Session timeout
  - Password requirements
  - API rate limiting
  - Notification email
- Real-time setting updates

## 🔗 Frontend-Backend Connection

### Authentication Flow
1. **Login** → User provides credentials
2. **Token Generation** → Backend generates JWT with user role
3. **Token Storage** → Frontend stores in localStorage
4. **Admin Verification** → Middleware checks role before allowing admin access
5. **Request Authorization** → Bearer token sent with every admin request

### API Client Setup (`client/src/lib/api.ts`)
```typescript
// Automatically includes Authorization header with JWT
const response = await api.get('/api/admin/users');

// Admin-only endpoint will return 403 if user lacks permissions
```

### Error Handling
- **401 Unauthorized** - No token or invalid token
- **403 Forbidden** - User lacks required admin role
- **404 Not Found** - Resource doesn't exist
- **500 Server Error** - Backend error

## 🛠 Configuration & Deployment

### Environment Variables
```bash
# .env (Backend)
PORT=5000
DATABASE_URL=postgres://...
JWT_SECRET=personaforge-secret-key-change-in-production

# Frontend connects automatically to /api/admin routes
```

### Database Requirements
The following tables are required:
- `users` (with `role` and `status` columns)
- `wellness_records`
- `admin_logs` (for audit trail)
- `system_settings` (for configuration)
- `content_reports` (for moderation)

### Running Locally
```bash
# Backend
cd server
npm install
npm run dev  # Starts at http://localhost:5000

# Frontend
cd client
npm install
npm run dev  # Starts at http://localhost:3000
```

## 🔄 Database Migration

If tables don't exist, create them:

```sql
-- Admin logs table
CREATE TABLE admin_logs (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  action VARCHAR(50),
  resource_type VARCHAR(50),
  details TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- System settings table
CREATE TABLE system_settings (
  key VARCHAR(100) PRIMARY KEY,
  value TEXT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Content reports table
CREATE TABLE content_reports (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  content_id INTEGER,
  reason VARCHAR(255),
  status VARCHAR(50) DEFAULT 'pending',
  action_taken TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Update users table if needed
ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(50) DEFAULT 'user';
ALTER TABLE users ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'active';
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login TIMESTAMP;
```

## 🧪 Testing Admin Features

### Test User Creation
```bash
# Create a test admin user (via API or database)
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@test.com",
    "password": "SecurePass123!"
  }'

# Then update role in database:
# UPDATE users SET role = 'admin' WHERE email = 'admin@test.com';
```

### Testing Admin Endpoints
```bash
# Get token from login
TOKEN=$(curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"SecurePass123!"}' \
  | jq -r '.token')

# Test admin dashboard
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:5000/api/admin/dashboard
```

## 📈 Scaling Considerations

### Performance
- Implement pagination for large datasets (done)
- Add database indexes on frequently queried fields
- Cache analytics data (5-minute TTL recommended)
- Rate limiting on admin endpoints (500 req/min)

### Security
- Admin logs all actions for compliance
- Role-based access control enforced
- Sensitive operations require confirmation
- IP whitelisting (optional)

## 🐛 Troubleshooting

### Admin Panel Not Loading
- ✅ Check user has `admin` or `moderator` role
- ✅ Verify JWT token is valid and not expired
- ✅ Check browser console for API errors

### API Returns 403 Forbidden
- Ensure user role is set correctly in database
- Verify token payload includes role information
- Check middleware is enforcing role verification

### Settings Not Saving
- Verify `system_settings` table exists
- Check database connection
- Review server logs for SQL errors

## 📚 Additional Resources

- **Backend Routes**: `server/src/routes/admin.js`
- **Auth Middleware**: `server/src/middleware/auth.js`
- **Admin Components**: `client/src/components/AdminSidebar.tsx`
- **Admin Pages**: `client/src/app/admin/*`

## 🎉 What's Next

1. **User Onboarding** - Create test admin account and verify access
2. **Monitoring** - Set up alerts for system logs
3. **Automation** - Implement scheduled cleanup tasks
4. **Integration** - Connect with email service for notifications
5. **Analytics** - Add more detailed metrics and reporting

---

**Commit**: `7a7d289` - Complete admin panel implementation with frontend-backend integration ✅
