# Deployment Guide

## Vercel Setup - CRITICAL

To fix the "Unauthorized" error on Vercel, you **MUST** set the `NEXT_PUBLIC_API_URL` environment variable:

### Steps:

1. **Go to Vercel Dashboard**
   - Visit https://vercel.com/dashboard
   - Select your PersonaForge project

2. **Add Environment Variable**
   - Go to Settings → Environment Variables
   - Click "Add New"
   - Set the variable:
     ```
     Name: NEXT_PUBLIC_API_URL
     Value: https://desirable-embrace-production-464b.up.railway.app
     ```
   - Make sure it's set for "Production"

3. **Redeploy**
   - Go to Deployments
   - Click on the latest deployment
   - Click "Redeploy" → "Confirm Redeploy"

## Local Development Setup

1. **Clone Repository**
   ```bash
   git clone https://github.com/dipro20debnath/personaforge.git
   cd personaforge
   ```

2. **Setup Backend**
   ```bash
   cd server
   npm install
   npm start
   # Server will run on http://localhost:5000
   ```

3. **Setup Frontend** (in a new terminal)
   ```bash
   cd client
   npm install
   npm run dev
   # Frontend will run on http://localhost:3000
   ```

4. **Environment File**
   - The `.env.local` file is already configured for local development
   - The API URL is set to `http://localhost:5000`

## Test Login Credentials

### Admin Account
- **Email:** dipro@gmail.com
- **Password:** Ak472002#@
- **Role:** Admin (full access to admin panel)

### Demo Account
- **Email:** demo@personaforge.com
- **Password:** Demo@123
- **Role:** User (regular user access)

## Troubleshooting

### Still Getting "Unauthorized" After Setting Env Variable?

1. **Clear Browser Cache**
   - Ctrl+Shift+Delete → Clear all cookies and cached images
   - Reload the page

2. **Wait for Deployment**
   - Vercel deployments can take 1-2 minutes
   - Check Deployments tab to verify deployment completed

3. **Check API Connection**
   - Open Browser Console (F12)
   - Go to login page and try logging in
   - Check the Network tab for API requests
   - Ensure requests are going to the correct API URL

4. **Verify Backend is Running**
   - Visit https://desirable-embrace-production-464b.up.railway.app/health
   - Should return a response (if health endpoint exists)

### "Failed to Fetch" Error?

This usually means the API URL is incorrect. Double-check:
1. The `NEXT_PUBLIC_API_URL` is set correctly in Vercel
2. Railway backend is running
3. No network/firewall issues blocking the connection

### Admin Panel Not Showing?

1. Make sure you're logged in with admin account
2. Check browser console for errors
3. The admin panel link should appear in the sidebar as "⚙️ Administration"

## Backend API URL

- **Local Development:** http://localhost:5000
- **Production (Railway):** https://desirable-embrace-production-464b.up.railway.app

## Database

- **Local Development:** Uses `personaforge.db` (SQL.js file-based)
- **Production:** Uses PostgreSQL on Railway

### Default Admin Account (Local)

The admin setup script already created:
- Email: dipro@gmail.com
- Password: Ak472002#@
- Role: admin

If you need to recreate it:
```bash
cd server
node setup-admin.js
```

## Production Deployment Status

- ✅ Frontend: https://personaforge-forco9w2-dipro20debnath5-projects.vercel.app
- ✅ Backend: https://desirable-embrace-production-464b.up.railway.app
- ✅ Database: PostgreSQL on Railway
- ✅ Admin System: Fully functional
