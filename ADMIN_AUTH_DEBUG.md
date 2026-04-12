# Admin Authentication - Deployment Guide

## Issue
Railway production server is not picking up latest code changes with the `/api/auth/admin-login` endpoint, likely due to deployment caching or GitHub integration issues.

## Verification - Test Locally

### Step 1: Start Local Backend Server
```bash
cd server
npm install
npm run dev
```
Backend should run on `http://localhost:5000`

### Step 2: Start Local Frontend
```bash
cd client
npm install
npm run dev
```
Frontend should run on `http://localhost:3000`

### Step 3: Test Admin Login  
1. Open `http://localhost:3000/login`
2. Click "Admin Sign In" button
3. Enter credentials:
   - Email: `dipro@gmail.com`
   - Password: `Ak472002#@`
4. Should see "Logging in..." then redirect to `/admin` with full admin dashboard

## Production Workaround

If the above works locally but fails on production, apply this quick fix:

## Files with Admin Login Endpoint
- **Backend**: `server/src/routes/auth.js` - Contains `/admin-login` POST endpoint
- **Frontend**: `client/src/app/login/page.tsx` - Admin login UI form
- **Admin Pages**: `client/src/app/(app)/admin/[pages].tsx` - Protected admin routes

## Admin Credentials
```
Email: dipro@gmail.com
Password: Ak472002#@
```

## Endpoints
- Login (user): `POST /api/auth/login`
- Admin Login: `POST /api/auth/admin-login`
- Admin Routes: `GET /api/admin/*` (protected by `adminMiddleware`)

## Testing Endpoint with curl
```bash
curl -X POST https://desirable-embrace-production-464b.up.railway.app/api/auth/admin-login \
  -H "Content-Type: application/json" \
  -d '{"email":"dipro@gmail.com","password":"Ak472002#@"}'
```

Expected response (should return JWT token):
```json
{
  "token": "eyJhbGc...",
  "user": {
    "id": "admin-1712973657000",
    "email": "dipro@gmail.com",
    "role": "admin",
    "name": "Administrator"
  }
}
```

## Last Working Commit
- SHA: `d2e376e`
- Message: "Fix admin authentication: clean up test files and ensure admin-login endpoint in auth.js is deployed"
- Status: ✅ Committed & Pushed to GitHub
- Deployment Status: 🟡 Pending - Railway may need manual restart/redeploy

## Next Steps if Production Still Not Working
1. Manually restart Railway service from Railway dashboard
2. Or force a rebuild by modifying Railway configuration
3. Or contact Railway support about deployment caching
