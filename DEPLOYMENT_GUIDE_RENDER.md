# PersonaForge - Render.com Backend Deployment Guide (Alternative)

If you prefer Render.com over Railway, follow this guide:

## 1. Create Render Account
- Go to https://render.com
- Sign up with GitHub

## 2. Create Web Service
1. Click "New +" → "Web Service"
2. Connect GitHub repo: `personaforge`
3. Select `main` branch

## 3. Configure Service

**Basic Settings:**
- Name: `personaforge-backend`
- Runtime: `Node`
- Root Directory: `personaforge/server`
- Build Command: `npm install`
- Start Command: `npm start`

## 4. Set Environment Variables

Under "Environment":
```
NODE_ENV=production
PORT=5000
JWT_SECRET=your-super-secret-key-change-this
CORS_ORIGIN=https://personaforge.vercel.app
AI_API_KEY=sk-demo-key
AI_API_URL=https://api.openai.com/v1
AI_MODEL=gpt-4-turbo-preview
DEBUG_SECURITY=false
DEBUG_AI=false
```

## 5. Choose Plan
- **Free Plan**: For testing (goes to sleep after inactivity)
- **Paid Plan**: Always running ($7+/month)

## 6. Create Service
1. Click "Create Web Service"
2. Wait for deployment (5-10 minutes)
3. Get your URL: `https://personaforge-backend.onrender.com`

## 7. Update Vercel Frontend

Set `NEXT_PUBLIC_API_URL` to:
```
https://personaforge-backend.onrender.com
```

---

## Note: Database Persistence

Like Railway, Render doesn't persist files between restarts. The SQL.js database file will reset.

**Recommendation**: Migrate to PostgreSQL on Render:
1. Add PostgreSQL database in Render
2. Update backend code to use PostgreSQL
3. Update DATABASE_URL in env vars

---

For more: https://render.com/docs
