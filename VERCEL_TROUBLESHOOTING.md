# Vercel Troubleshooting Guide

## Current Status ✅

- ✅ Backend API running: https://desirable-embrace-production-464b.up.railway.app
- ✅ Frontend on Vercel: https://personaforge-forco9w2-dipro20debnath5-projects.vercel.app

## Quick Fix - What We Just Did

1. **Improved API Detection** - The frontend now automatically detects when running on Vercel and uses the Railway backend
2. **Fixed User Registration** - Now properly stores user data after signup
3. **Added Debug Logging** - Check browser console for connection status

## If Still Having Issues:

### Step 1: Open Browser Developer Tools
- Press **F12**
- Go to **Console** tab
- You should see logs like:
  ```
  🔗 PersonaForge API URL: https://desirable-embrace-production-464b.up.railway.app
  ```

### Step 2: Try Logging In
1. Go to https://personaforge-forco9w2-dipro20debnath5-projects.vercel.app
2. Click "Use Demo Credentials" button
3. Watch the console for any errors

### Step 3: Check Network Tab
- In Developer Tools, go to **Network** tab
- Try logging in again
- Look for the login request (should be `POST /api/auth/login`)
- Click on it and check:
  - **Status**: Should be 200 (not 401 or 500)
  - **Response**: Should show `token` and `user` data

### Step 4: Common Error Messages

**"Cannot POST /api/auth/login"**
- API URL is wrong or backend isn't running
- Solution: Clear browser cache and hard refresh (Ctrl+F5)

**"Unauthorized"**
- JWT token is invalid or expired
- Solution: Clear cookies/cache, try logging in again

**"Failed to fetch"**
- CORS error or network issue
- Solution: Check if backend is accessible from: https://desirable-embrace-production-464b.up.railway.app/api/health

**"Network timeout"**
- Backend is down or very slow
- Solution: Try accessing the backend directly

## Test the Backend Directly

Open a new tab and visit:
```
https://desirable-embrace-production-464b.up.railway.app/api/health
```

You should see:
```json
{"status":"ok","name":"PersonaForge API"}
```

If you see an error, the backend might be down. Check Railway dashboard.

## Test Login API Endpoint

In Browser Console, run:
```javascript
fetch('https://desirable-embrace-production-464b.up.railway.app/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    email: 'demo@personaforge.com',
    password: 'Demo@123'
  })
})
.then(r => r.json())
.then(d => console.log('Login Response:', d))
.catch(e => console.error('Error:', e))
```

You should see a successful response with a token.

## Clear Cache and Try Again

1. **Browser Cache**: Ctrl+Shift+Delete → Clear all
2. **Hard Refresh**: Ctrl+F5
3. **Incognito Mode**: Try in private/incognito window
4. **Different Browser**: Try Chrome, Firefox, or Edge

## If Nothing Works:

### Option A: Deploy to Production
Make sure Vercel has redeployed:
1. Go to Vercel Dashboard
2. Project → Deployments
3. Click latest deployment → "Redeploy"
4. Wait 3-5 minutes for deployment

### Option B: Test Locally
Run everything locally to confirm it works:

```bash
# Terminal 1 - Backend
cd personaforge/server
npm start

# Terminal 2 - Frontend
cd personaforge/client
npm run dev

# Visit http://localhost:3000
```

If this works locally, then it's a Vercel-specific issue.

### Option C: Check Railway Backend Status
1. Go to https://railway.app
2. Log in with your account
3. Check PersonaForge project logs
4. Look for any database connection errors

### Option D: Verify Credentials
Make sure you have the right demo account:
- Email: `demo@personaforge.com`
- Password: `Demo@123` (case sensitive!)

Or use admin account:
- Email: `dipro@gmail.com`
- Password: `Ak472002#@`

## Success Signs ✅

After logging in, you should see:
1. Dashboard loads with statistics
2. Sidebar appears on left or top (mobile)
3. For admin account: "⚙️ Administration" option appears in sidebar
4. No red errors in console

## Getting Help

1. **Check Console Errors** - Press F12, go to Console tab
2. **Share the Error Message** - All error messages help identify the issue
3. **Verify Network** - Ensure you have internet connection
4. **Contact Support** - If stuck, provide:
   - The exact error message
   - Account you're using (demo or admin)
   - Screenshots of console errors
