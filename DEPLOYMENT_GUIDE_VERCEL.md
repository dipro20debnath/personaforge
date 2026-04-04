# PersonaForge - Vercel Deployment Guide (Complete)

## 🚀 Deployment Overview

PersonaForge is a full-stack application:
- **Frontend**: Next.js 14 → Deploy to **Vercel**
- **Backend**: Express.js → Deploy to **Railway.app** (recommended) or **Render.com**
- **Database**: SQL.js file-based → **Railway Postgres** (for production)

---

## 📋 Pre-Deployment Checklist

### 1. **GitHub Repository Setup** ✅
```bash
# Initialize git and push to GitHub
git init
git add .
git commit -m "PersonaForge - Ready for deployment"
git branch -M main
git remote add origin https://github.com/your-username/personaforge.git
git push -u origin main
```

### 2. **Create Required Accounts**
- [ ] Vercel account (free tier available)
- [ ] Railway.app account (for backend)
- [ ] GitHub connected to both services

### 3. **Environment Variables Ready**
Check that these files exist:
- [ ] `server/.env.local` ✅ (Created)
- [ ] `client/.env.local.example` ✅ (Created)
- [ ] `server/personaforge.db` (exists in repo)

---

## 🎯 Step 1: Deploy Backend to Railway.app

### A. Create Railway Account & Project
1. Go to https://railway.app
2. Sign up with GitHub
3. Create new project
4. Select "Deploy from GitHub repo"

### B. Configure Backend Environment Variables in Railway
In Railway Dashboard → Variables:

```
Node Environment Variables:
NODE_ENV=production
PORT=5000
JWT_SECRET=your-super-secret-key-min-32-chars-CHANGE-THIS
CORS_ORIGIN=https://personaforge.vercel.app
AI_API_KEY=sk-demo-key
AI_API_URL=https://api.openai.com/v1
AI_MODEL=gpt-4-turbo-preview
DEBUG_SECURITY=false
DEBUG_AI=false
```

### C. Connect GitHub Repository
1. Select your personaforge repo
2. Select the `main` branch
3. Set:
   - **Root Directory**: `personaforge/server`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

### D. Deploy
1. Click "Deploy"
2. Wait for build to complete
3. Get your railway backend URL (e.g., `https://personaforge-backend.railway.app`)

**Save this URL** - you'll need it for frontend!

---

## 🎨 Step 2: Deploy Frontend to Vercel

### A. Connect GitHub Repository
1. Go to https://vercel.com
2. Click "Add New..." → "Project"
3. Select your `personaforge` repository
4. Import it

### B. Configure Build Settings
- **Framework Preset**: Next.js
- **Build Command**: `cd client && npm run build`
- **Output Directory**: `client/.next`
- **Install Command**: `cd client && npm install`
- **Project Root Directory**: (leave blank or set to `client/`)

### C. Set Environment Variables in Vercel

Click on Settings → Environment Variables and add:

```
NEXT_PUBLIC_API_URL=https://your-railway-backend-url.railway.app
```

Example: `NEXT_PUBLIC_API_URL=https://personaforge-prod.railway.app`

### D. Deploy
1. Click "Deploy"
2. Wait for deployment to complete
3. Get your Vercel URL (e.g., `https://personaforge.vercel.app`)

---

## 🔄 Step 3: Update Backend CORS for Vercel Frontend

After deploying to Vercel, update Backend environment variables:

In Railway Dashboard → Variables:
```
CORS_ORIGIN=https://personaforge.vercel.app
```

Then redeploy the backend.

---

## 🗄️ Step 4: Database Migration (Optional but Recommended)

### Current Setup (Development)
- Uses **SQL.js** with file-based DB: `server/personaforge.db`
- Works for small deployments but not ideal for production

### Recommended for Production
Switch to **PostgreSQL** with Railway:

1. In Railway dashboard, add a new service:
   - Select "Create New" → "Database" → "PostgreSQL"
   
2. Copy connection string:
   - Format: `postgresql://user:password@host:port/db`

3. Update backend `.env.local`:
   ```
   DATABASE_URL=postgresql://user:password@host:port/personaforge
   ```

4. Modify `server/src/db.js` to use PostgreSQL instead of SQL.js (requires code changes)

---

## 🔑 Important: Change Default Credentials

### Before Deploying to Production:

1. **Change JWT_SECRET** in `server/.env.local`:
   ```
   # OLD (in file):
   JWT_SECRET=personaforge-prod-jwt-secret-key-min-32-characters-change-this
   
   # NEW: Generate a strong random string
   # Use: https://1password.com/password-generator/
   JWT_SECRET=aB3$xK9@mL2#pQ7&vF8$tR1@mJ5#yQ4$uP9&sK2#
   ```

2. **Change AI_API_KEY** if using real OpenAI:
   ```
   AI_API_KEY=sk-your-actual-openai-key-here
   ```

3. **Update CORS_ORIGIN** to your actual domain

---

## ✅ Verification Checklist - After Deployment

- [ ] Frontend loads at https://personaforge.vercel.app
- [ ] Backend API responds: `GET https://your-backend-url/api/health`
- [ ] Login works with demo account: `demo@personaforge.com / Demo@123`
- [ ] Dashboard loads without errors
- [ ] AI recommendations work (or show demo data)
- [ ] 100-Day Challenge displays Day 79 correctly
- [ ] Can create new account and login
- [ ] Dark mode toggle works
- [ ] Responsive design works on mobile

---

## 🔧 Troubleshooting Deployment Issues

### **Frontend 502 Error**
- Check NEXT_PUBLIC_API_URL is correct
- Verify backend service is running on Railway
- Check CORS_ORIGIN matches frontend URL

### **CORS Error in Browser Console**
```
Access to XMLHttpRequest at 'https://...' from origin 'https://...' 
has been blocked by CORS policy
```
**Fix**: Update `CORS_ORIGIN` in Railway dashboard to match your Vercel URL

### **AI Recommendations Not Working**
- If using demo key (`sk-demo-key`): Normal, shows demo responses
- Add your OpenAI API key: Update `AI_API_KEY` in Railway
- OpenAI rate limit hit: Wait 1 minute or check API usage

### **Database Errors**
- Current setup uses file-based DB copied at deploy time
- Data persists only in memory during Railway runtime
- **Solution**: Migrate to PostgreSQL on Railway

### **Build Fails on Vercel**
- Check build logs: Deployments → select build → Logs
- Ensure TypeScript types are correct
- Run locally: `cd client && npm run build`

---

## 📊 Monitoring & Maintenance

### Railway Dashboard
- View logs: Deployments → Logs
- Check resource usage: CPU, Memory
- Set up alerts for failures

### Vercel Dashboard
- View deployment history
- Check function logs
- Performance analytics

### Regular Maintenance
```bash
# Update dependencies
cd personaforge/client
npm update

cd ../server
npm update

# Test locally
npm run dev  # Each directory

# Push changes
git add .
git commit -m "Update dependencies"
git push
```

---

## 💡 Pro Tips

1. **Environment Variables**: Never commit `.env.local` to git (add to `.gitignore`)
2. **Secrets**: Use GitHub Secrets + Railway/Vercel encrypted variables
3. **Backups**: Regularly backup your database
4. **Monitoring**: Enable Sentry for error tracking
5. **SSL**: Both Railway and Vercel provide automatic HTTPS

---

## 🚨 Important: Before Going Live

1. ✅ Change ALL default secrets
2. ✅ Test full user flow (signup → login → features)
3. ✅ Verify email/notifications (if enabled)
4. ✅ Test on different browsers and devices
5. ✅ Load test with multiple concurrent users
6. ✅ Set up database backups
7. ✅ Document deployment process for team

---

## 📞 Support & Troubleshooting

- **Vercel Docs**: https://vercel.com/docs
- **Railway Docs**: https://docs.railway.app
- **Next.js Docs**: https://nextjs.org/docs
- **Express Docs**: https://expressjs.com

---

## 🎉 Congratulations!

Your PersonaForge application is now deployed and accessible to the world!

**Next Steps:**
1. Share the link: https://personaforge.vercel.app
2. Monitor logs for any issues
3. Gather user feedback
4. Plan feature updates

---

**Deployment Date**: April 4, 2026
**Status**: ✅ Ready for Production
