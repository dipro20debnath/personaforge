# 📋 PersonaForge - COMPLETE DEPLOYMENT CHECKLIST

**Last Updated**: April 4, 2026
**Status**: ✅ Ready for Vercel Deployment

---

## ✅ PRE-DEPLOYMENT (Do Before Deploying)

### Code Quality
- [x] All TypeScript errors fixed
- [x] Frontend builds successfully
- [x] Backend code verified
- [x] All dependencies installed
- [x] No security vulnerabilities (npm audit)
- [x] Tests pass (if applicable)

### Files Created
- [x] `server/.env.local` - Backend environment variables
- [x] `client/.env.local.example` - Frontend example env
- [x] `client/vercel.json` - Vercel configuration
- [x] `server/railway.json` - Railway configuration
- [x] `DEPLOYMENT_GUIDE_VERCEL.md` - Complete guide
- [x] `QUICK_DEPLOY_VERCEL.md` - Quick start guide
- [x] `DEPLOYMENT_GUIDE_RENDER.md` - Alternative guide
- [x] `setup-deployment.mjs` - Setup helper script

### API Client
- [x] Updated to use `NEXT_PUBLIC_API_URL` environment variable
- [x] Falls back to `http://localhost:5000` for development
- [x] Handles both absolute and relative URLs

### Environment Variables
- [x] `server/.env.local` created with default values
- [x] `JWT_SECRET` placeholder ready for change
- [x] `CORS_ORIGIN` set for development
- [x] `AI_API_KEY` set to demo mode
- [x] All critical variables documented

### Security
- [x] `.env.local` in `.gitignore` (won't be committed)
- [x] Default secrets are placeholders
- [x] JWT_SECRET must be changed before production
- [x] API secure headers (Helmet) configured
- [x] Rate limiting enabled
- [x] Input validation enabled

---

## ✅ DEPLOYMENT STEPS (In This Order)

### STEP 1: GitHub Setup
- [ ] Initialize git repository
- [ ] Create GitHub account (if needed)
- [ ] Push personaforge code to GitHub
  ```bash
  git add .
  git commit -m "PersonaForge ready for deployment"
  git push
  ```

### STEP 2: Deploy Backend to Railway
- [ ] Create Railway.app account (https://railway.app)
- [ ] Create new project
- [ ] Connect GitHub repository
- [ ] Set root directory: `personaforge/server`
- [ ] Add all environment variables (from .env.local)
- [ ] Deploy and get URL (e.g., personaforge-prod.railway.app)
- [ ] Save URL for next step

### STEP 3: Deploy Frontend to Vercel
- [ ] Create Vercel account (https://vercel.com)
- [ ] Import GitHub repository
- [ ] Set root directory: `client`
- [ ] Set environment variable:
  - `NEXT_PUBLIC_API_URL=<your-railway-url>`
- [ ] Deploy

### STEP 4: Verify Deployment
- [ ] Frontend loads: https://personaforge.vercel.app
- [ ] Backend health: `GET https://your-railway-url/api/health`
- [ ] API responds with: `{"status":"ok","name":"PersonaForge API"}`
- [ ] Login works with: `demo@personaforge.com / Demo@123`
- [ ] Dashboard loads without errors
- [ ] Can view 100-Day Challenge (Day 79)

---

## ⚠️ CRITICAL CHANGES BEFORE PRODUCTION

### 1. Change JWT_SECRET
**Location**: Railway Dashboard → Variables

```bash
# OLD (development):
JWT_SECRET=personaforge-prod-jwt-secret-key-min-32-characters-change-this

# NEW (generate strong secret):
# Use: https://1password.com/password-generator/
# Or: https://www.lastpass.com/password-generator
JWT_SECRET=<your-strong-random-string-32+-chars>
```

Update and redeploy Railway backend after changing.

### 2. Update CORS_ORIGIN
**Location**: Railway Dashboard → Variables

```bash
# OLD: http://localhost:3000
# NEW: Your actual Vercel URL
CORS_ORIGIN=https://personaforge.vercel.app
```

Redeploy after changing.

### 3. Verify AI Configuration
- [ ] If using demo mode: `AI_API_KEY=sk-demo-key` (recommendations show demo data)
- [ ] If using real OpenAI:
  - Get key from: https://platform.openai.com/api-keys
  - Update `AI_API_KEY` in Railway
  - Redeploy

### 4. Verify NEXT_PUBLIC_API_URL
**Location**: Vercel Dashboard → Settings → Environment Variables

```
NEXT_PUBLIC_API_URL=https://your-railway-backend-url.railway.app
```

Redeploy frontend if changed.

---

## 🧪 TESTING CHECKLIST

### Server Connectivity
- [ ] Backend API responds to requests
- [ ] CORS headers are correct (check Network tab in DevTools)
- [ ] Authentication token works

### User Flows
- [ ] Can register new account
- [ ] Can login with demo account
- [ ] Can logout
- [ ] Dashboard loads all data
- [ ] Can navigate to all pages

### Features
- [ ] Personality assessment works
- [ ] Skills section accessible
- [ ] Goals can be created/viewed
- [ ] Habits can be tracked
- [ ] Journal entries can be created
- [ ] Motivation page shows Day 79 challenge
- [ ] AI recommendations generate (demo or real)
- [ ] Dark mode toggle works
- [ ] Mobile responsive

### Error Handling
- [ ] API errors show user-friendly messages
- [ ] Network errors handled gracefully
- [ ] Authentication errors redirect to login

---

## 📊 POST-DEPLOYMENT MONITORING

### Daily Checks
- [ ] Monitor Railway dashboard for errors
- [ ] Check Vercel deployment logs
- [ ] Verify no spike in error rates

### Set Up Alerts
- [ ] Railway: Enable notifications for deployment failures
- [ ] Vercel: Enable Slack/email notifications
- [ ] Optional: Set up Sentry for error tracking

### Regular Maintenance
- [ ] Weekly: Check dependency updates
- [ ] Monthly: Review logs for suspicious activity
- [ ] Monthly: Backup database
- [ ] Quarterly: Update dependencies

---

## 🗂️ IMPORTANT LINKS

| Service | Link |
|---------|------|
| **GitHub Repo** | https://github.com/your-username/personaforge |
| **Frontend (Vercel)** | https://personaforge.vercel.app |
| **Backend (Railway)** | https://personaforge-prod.railway.app |
| **Vercel Dashboard** | https://vercel.com/dashboard |
| **Railway Dashboard** | https://railway.app/dashboard |

---

## 📚 DOCUMENTATION

All in the `personaforge/` directory:
- `QUICK_DEPLOY_VERCEL.md` - 5-minute deployment guide
- `DEPLOYMENT_GUIDE_VERCEL.md` - Complete step-by-step guide
- `DEPLOYMENT_GUIDE_RENDER.md` - Alternative (Render instead of Railway)
- `README.md` - Project overview

---

## 🆘 TROUBLESHOOTING

### Issue: Frontend 502 Error
**Solution**: 
- Verify NEXT_PUBLIC_API_URL is set in Vercel
- Check Railway backend is running
- Look at Vercel logs

### Issue: CORS Error
**Solution**: 
- Update Railway `CORS_ORIGIN` to Vercel URL
- Redeploy Railway
- Check Network tab in DevTools for actual error

### Issue: Login Fails
**Solution**: 
- Check JWT_SECRET is set in Railway
- Verify database is accessible
- Check browser console for detailed error

### Issue: API 502 Error
**Solution**: 
- Check Railway deployment logs
- Verify environment variables
- Restart Railway service

---

## ✨ DEPLOYMENT COMPLETE!

Once all checkboxes above are completed:

✅ Your PersonaForge app is live!
✅ Share: https://personaforge.vercel.app
✅ Monitor logs regularly
✅ Update features as needed

---

**Need help?** See the detailed guides:
- Quick start: `QUICK_DEPLOY_VERCEL.md`
- Complete guide: `DEPLOYMENT_GUIDE_VERCEL.md`
- Troubleshooting: See included documentation
