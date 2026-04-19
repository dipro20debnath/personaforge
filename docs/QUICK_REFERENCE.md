# ⚡ PERSONAFORGE - Quick Reference Guide

## 🚀 Quick Start Commands

### One-Time Setup
```bash
# Navigate to project
cd d:\Software\personaforge\personaforge

# Install all dependencies
npm install
cd server && npm install && cd ..
cd client && npm install && cd ..
```

### Run Locally (Every Session)

**Terminal 1 - Backend:**
```bash
cd d:\Software\personaforge\personaforge\server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd d:\Software\personaforge\personaforge\client
npm run dev
```

**Then Open:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Backend test: http://localhost:5000/health (or similar health endpoint)

---

## 📁 File Locations Quick Map

### Frontend Pages (All locations: `client/src/app/(app)/`)
```
/dashboard              → Main dashboard with AI components
/goals                  → Goal management with AI wizard
/skills                 → Skills tracking
/habits                 → Habit management
/journal                → Journal entries
/assessment             → Personality assessment (IPIP)
/learning               → Learning paths
/career-map             → Career roadmap
/mental-health          → Mental health tracking
/cv-builder             → CV/Resume builder
/profile                → User profile
/privacy                → Privacy settings
/notification           → Notifications
(Plus 4 more routes)
```

### Frontend Components
```
client/src/components/AIRecommendations.tsx      → Beautiful recommendation cards
client/src/components/AIPersonalCoach.tsx        → Floating chat widget
client/src/components/AISmartInsights.tsx        → Dashboard sidebar insights
client/src/components/AIProgressAnalytics.tsx    → Charts and metrics
client/src/components/AIQuickSuggestions.tsx     → Suggestion carousel
client/src/components/AIGoalWizard.tsx           → AI goal generation
client/src/components/Sidebar.tsx                → Navigation sidebar
client/src/components/index.ts                   → Component barrel exports
```

### Frontend Config & Utilities
```
client/src/lib/api.ts                   → API client with all endpoints
client/src/context/AuthContext.tsx      → Authentication state
client/src/hooks/useAI.ts               → AI feature hooks
client/src/app/(app)/layout.tsx         → Main app layout (has AI Coach)
client/tailwind.config.ts               → Tailwind styling config
client/tsconfig.json                    → TypeScript config
```

### Backend Routes (All locations: `server/src/routes/`)
```
auth.js                 → Login, Register, Logout
goals.js                → CRUD goals
skills.js               → CRUD skills
habits.js               → CRUD habits
journal.js              → CRUD journal entries
learning.js             → CRUD learning paths
assessment.js           → Personality test endpoints
dashboard.js            → Get dashboard summary data
profile.js              → User profile endpoints
notifications.js        → Notification endpoints
privacy.js              → Privacy settings
ai-recommendations.js   → 🤖 AI feature endpoints
```

### Backend Services & Config
```
server/src/index.js                → Main Express server entry
server/src/db.js                   → Database connection config
server/src/services/ai.js          → 🤖 AI logic & OpenAI calls
server/src/middleware/auth.js      → JWT token verification
server/src/data/ipip-questions.js  → Personality test questions
```

### Documentation
```
docs/README.md                      → Project overview
docs/LEARNING_ROADMAP.md           → Complete learning guide (you are here)
docs/AI_FEATURES_GUIDE.md          → AI features explanation
docs/AI_INTEGRATION_MAP.md         → Architecture diagrams
docs/HOW_TO_USE_AI_FEATURES.md     → User guide for AI features
docs/SRS.md                        → Software requirements
```

---

## 🔌 API Endpoints Reference

### Authentication
```
POST /api/auth/register          → Create new user
POST /api/auth/login             → Login user, get JWT token
POST /api/auth/logout            → Logout
GET  /api/auth/me                → Get current user info
```

### Goals
```
GET  /api/goals                  → List all goals
POST /api/goals                  → Create goal
GET  /api/goals/:id              → Get single goal
PUT  /api/goals/:id              → Update goal
DELETE /api/goals/:id            → Delete goal
```

### Skills
```
GET  /api/skills                 → List all skills
POST /api/skills                 → Add skill
PUT  /api/skills/:id             → Update skill
DELETE /api/skills/:id           → Delete skill
```

### Habits
```
GET  /api/habits                 → List all habits
POST /api/habits                 → Create habit
PUT  /api/habits/:id             → Update habit
DELETE /api/habits/:id           → Delete habit
```

### Journal
```
GET  /api/journal                → List entries
POST /api/journal                → Create entry
GET  /api/journal/:id            → Get entry
PUT  /api/journal/:id            → Update entry
DELETE /api/journal/:id          → Delete entry
```

### Learning
```
GET  /api/learning               → List paths
POST /api/learning               → Create path
PUT  /api/learning/:id           → Update path
```

### Dashboard
```
GET  /api/dashboard              → Get all dashboard data
```

### 🤖 AI Features (All in `/api/ai/*`)
```
POST /api/ai/chat                        → Chat with coach
POST /api/ai/goal-recommendations       → Generate goals
POST /api/ai/journal-insights           → Analyze journal
POST /api/ai/habit-suggestions          → Suggest habits
POST /api/ai/learning-path              → Create learning path
POST /api/ai/skill-gaps                 → Analyze skill gaps
POST /api/ai/motivation                 → Get motivation boost
```

---

## 🎨 Component Prop Types

### AIPersonalCoach
```typescript
// No props needed, it's self-contained
<AIPersonalCoach />

// Used in: client/src/app/(app)/layout.tsx
```

### AIRecommendations
```typescript
interface Props {
  // Usually called without props
  // Fetches recommendations from API internally
}
<AIRecommendations />
```

### AISmartInsights
```typescript
interface Props {
  // Usually called without props
  // Displays fixed insight types
}
<AISmartInsights />
```

### AIGoalWizard
```typescript
interface Props {
  onClose?: () => void;      // Callback when wizard closes
  onGoalCreated?: () => void; // Callback after goal created
}
<AIGoalWizard onClose={() => setOpen(false)} />
```

### AIProgressAnalytics
```typescript
interface Props {
  // Usually called without props
  // Gets data from backend
}
<AIProgressAnalytics />
```

### AIQuickSuggestions
```typescript
interface Props {
  context: 'goals' | 'skills' | 'habits' | 'learning' | 'dashboard' | string;
}
<AIQuickSuggestions context="dashboard" />
```

---

## 🔑 Key Environment Variables

### Backend (Check: `server/.env` or system variables)
```bash
API_PORT=5000                           # Express server port
DATABASE_URL=...                        # Database connection
JWT_SECRET=your_jwt_secret              # Token signing key
OPENAI_API_KEY=sk-...                   # OpenAI API key (sk-demo-key for demo)
OPENAI_API_URL=https://api.openai.com/v1
OPENAI_MODEL=gpt-4-turbo-preview
OPENAI_MAX_TOKENS=1000
OPENAI_TEMPERATURE=0.7
```

### Frontend (Check: `client/.env.local` or built-in)
```bash
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_APP_NAME=PersonaForge
```

---

## 🧪 Testing API Endpoints

### Using curl (PowerShell)
```powershell
# Test health
Invoke-WebRequest -Uri "http://localhost:5000/health"

# Get all goals (with token)
$headers = @{"Authorization" = "Bearer YOUR_JWT_TOKEN"}
Invoke-WebRequest -Uri "http://localhost:5000/api/goals" -Headers $headers

# Create goal
$body = @{
    title = "Learn TypeScript"
    description = "Master TypeScript in 3 months"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:5000/api/goals" `
    -Method POST `
    -Headers $headers `
    -Body $body `
    -ContentType "application/json"
```

### Using Postman
1. Open Postman
2. Create request: `GET http://localhost:5000/api/goals`
3. Go to Headers tab → Add `Authorization: Bearer {token}`
4. Send request

---

## 🔍 Debugging Tips

### Check if servers are running
```powershell
# Check port 5000 (backend)
netstat -ano | findstr :5000

# Check port 3000 (frontend)
netstat -ano | findstr :3000
```

### View backend logs
- Check terminal where `npm run dev` runs
- Look for error messages
- Check timestamps for request timing

### View frontend logs
- Open browser DevTools (F12)
- Go to Console tab
- Look for errors or network issues

### Check network requests
- DevTools → Network tab
- Look for failed requests (red)
- Check request/response payloads

### Find AI responses
- Network tab → Filter "ai"
- Look for `/api/ai/*` requests
- Check Response tab for actual AI text

---

## 💾 Database Queries (If Needed)

### Check if connected
```bash
# In server/src/db.js, see connection string
# Usually: sqlite:// or postgresql://
```

### Common data checks
```sql
-- Check users count
SELECT COUNT(*) FROM users;

-- Check recent goals
SELECT * FROM goals LIMIT 10;

-- Check personality assessment answers
SELECT * FROM assessment_responses LIMIT 10;
```

---

## 🎯 Common Tasks

### Add New Page
1. Create folder: `client/src/app/(app)/newpage/`
2. Create file: `page.tsx`
3. Route automatically available at `/newpage`

### Add New API Endpoint
1. Create file: `server/src/routes/newfeature.js`
2. Export Express router
3. Import in `server/src/index.js`
4. Call in frontend via `api.ts`

### Call AI Feature
1. Frontend: `api.sendChatMessage(message, context)`
2. Backend: Add handler in `ai-recommendations.js`
3. Service: Add function in `ai.js`
4. Return data to frontend

### Add New Component
1. Create: `client/src/components/NewComponent.tsx`
2. Add props interface
3. Add export to `components/index.ts`
4. Import in pages
5. Use: `<NewComponent />`

---

## 📚 TypeScript Files to Understand

### Page Component Structure
```typescript
// client/src/app/(app)/dashboard/page.tsx
'use client';  // Client-side rendering

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      // Call API
      // Set state
    };
    fetchData();
  }, []);

  return (
    <div>
      {/* JSX here */}
    </div>
  );
}
```

### Component Structure
```typescript
// client/src/components/AIPersonalCoach.tsx
'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
}

export function AIPersonalCoach() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  // Component logic
  
  return (
    <div className="fixed bottom-4 right-4">
      {/* JSX */}
    </div>
  );
}
```

### API Client Pattern
```typescript
// client/src/lib/api.ts
const baseUrl = process.env.NEXT_PUBLIC_API_URL;

const request = async (endpoint: string, options?: any) => {
  const response = await fetch(`${baseUrl}${endpoint}`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('pf_token')}`,
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });
  return response.json();
};

export const api = {
  loginUser: (email, password) => 
    request('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  
  getGoals: () => 
    request('/api/goals'),
  
  sendChatMessage: (message, context) =>
    request('/api/ai/chat', { method: 'POST', body: JSON.stringify({ message, context }) }),
};
```

---

## 🎓 Study Checklist

Use this to track your progress:

- [ ] Backend starts on port 5000
- [ ] Frontend starts on port 3000
- [ ] Can see login page
- [ ] Can register/login
- [ ] Dashboard shows AI components
- [ ] AI Coach opens and displays
- [ ] Can send message to AI
- [ ] Understand Goals API flow
- [ ] Understand AI Goal Wizard flow
- [ ] Can trace API call in DevTools
- [ ] Understand JWT authentication
- [ ] Can modify component and see changes
- [ ] Understand Tailwind styling
- [ ] Know all 6 AI components
- [ ] Can explain architecture

---

## 🚨 Common Issues & Fixes

### Frontend won't connect to backend
```
Error: Failed to fetch from /api/...

Fix:
1. Check backend is running: Terminal should show "Server running on :5000"
2. Check CORS settings in server/src/index.js
3. Check NEXT_PUBLIC_API_URL is correct
4. Try: curl http://localhost:5000/health from PowerShell
```

### Port already in use
```
Error: EADDRINUSE: address already in use :::5000

Fix:
1. Kill process: netstat -ano | findstr :5000
2. Then: taskkill /PID {PID} /F
3. Or change port in server/src/index.js
```

### Module not found error
```
Error: Cannot find module 'express'

Fix:
1. Go to directory: cd server (or cd client)
2. Install: npm install
3. Delete node_modules: rm -r node_modules
4. Reinstall: npm install
```

### JWT token not working
```
Error: Unauthorized

Fix:
1. Check token is in localStorage: DevTools → Application → Storage
2. Check token format: Should be "Bearer {token}" in header
3. Check JWT_SECRET matches between login and API calls
4. Try logging in again
```

### AI responses are empty
```
Error: AI returns empty response

Fix:
1. Check OPENAI_API_KEY is set (not 'sk-demo-key' for prod)
2. Check rate limiting not exceeded
3. Check API call in Network tab → Response
4. Try demo mode: Set key to 'sk-demo-key' temporarily
```

---

## 🎯 Next Steps After Setup

1. **Understand the flow:** Run locally and watch network tab
2. **Read the code:** Start with LEARNING_ROADMAP.md
3. **Experiment:** Try modifying a component
4. **Debug:** Use DevTools to trace API calls
5. **Document:** Add comments to files you understand
6. **Deep dive:** Study each feature area

---

**Good luck with your PersonaForge learning journey!** 🚀
