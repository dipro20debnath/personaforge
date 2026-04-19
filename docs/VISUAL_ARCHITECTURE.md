# 🎨 PERSONAFORGE - Visual Architecture Guide

## Understanding Component Relationships & Data Flow Visually

---

## 📊 1. Complete System Architecture

```
┌──────────────────────────────────────────────────────────────────────┐
│                        USER IN BROWSER                              │
│                   (http://localhost:3000)                           │
└────────────────────────────┬─────────────────────────────────────────┘
                             │
                             ↓ (HTTP)
┌──────────────────────────────────────────────────────────────────────┐
│                      FRONTEND (Next.js)                             │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │ client/src/                                                │    │
│  │ ├─ app/                                                    │    │
│  │ │  ├─ (app)/layout.tsx ← AIPersonalCoach added here      │    │
│  │ │  └─ (app)/dashboard/page.tsx ← ALL AI components      │    │
│  │ ├─ components/                                            │    │
│  │ │  ├─ AIPersonalCoach.tsx         (Floating chat)       │    │
│  │ │  ├─ AIRecommendations.tsx       (Beautiful cards)     │    │
│  │ │  ├─ AISmartInsights.tsx         (Sidebar insights)    │    │
│  │ │  ├─ AIProgressAnalytics.tsx     (Charts + metrics)    │    │
│  │ │  ├─ AIQuickSuggestions.tsx      (Carousel)            │    │
│  │ │  ├─ AIGoalWizard.tsx            (3-step form)         │    │
│  │ │  └─ Sidebar.tsx                 (Navigation)          │    │
│  │ ├─ hooks/                                                 │    │
│  │ │  └─ useAI.ts                    (AI logic)            │    │
│  │ ├─ context/                                               │    │
│  │ │  └─ AuthContext.tsx             (Auth state)          │    │
│  │ └─ lib/                                                   │    │
│  │    └─ api.ts                      (API client)           │    │
│  └────────────────────────────────────────────────────────────┘    │
│                                                                      │
│  Port: 3000 | Tech: React, Next.js, TypeScript, Tailwind           │
└────────────────────────────┬─────────────────────────────────────────┘
                             │
                             ↓ (HTTP)
┌──────────────────────────────────────────────────────────────────────┐
│                     BACKEND (Express)                               │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │ server/src/                                                │    │
│  │ ├─ index.js                      (Server entry)           │    │
│  │ ├─ db.js                         (Database config)        │    │
│  │ ├─ routes/                                                │    │
│  │ │  ├─ auth.js                    (Login/Register)        │    │
│  │ │  ├─ goals.js                   (Goals CRUD)            │    │
│  │ │  ├─ skills.js                  (Skills CRUD)           │    │
│  │ │  ├─ habits.js                  (Habits CRUD)           │    │
│  │ │  ├─ dashboard.js               (Dashboard data)        │    │
│  │ │  ├─ ai-recommendations.js      (AI endpoints)          │    │
│  │ │  └─ ... (more routes)                                  │    │
│  │ ├─ services/                                              │    │
│  │ │  └─ ai.js                      (AI logic)              │    │
│  │ ├─ middleware/                                            │    │
│  │ │  └─ auth.js                    (JWT verification)      │    │
│  │ └─ data/                                                  │    │
│  │    └─ ipip-questions.js          (Sample data)           │    │
│  └────────────────────────────────────────────────────────────┘    │
│                                                                      │
│  Port: 5000 | Tech: Express, Node.js, JavaScript                   │
└────────────────────────────┬─────────────────────────────────────────┘
                             │
                             ↓
┌──────────────────────────────────────────────────────────────────────┐
│                        DATABASE                                     │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │ Tables:                                                    │    │
│  │ - users                 (User accounts)                    │    │
│  │ - goals                 (User goals)                       │    │
│  │ - skills                (User skills)                      │    │
│  │ - habits                (Habit tracking)                   │    │
│  │ - journal_entries       (Journal entries)                  │    │
│  │ - assessment_responses  (Personality test)                │    │
│  │ - learning_paths        (Learning content)                │    │
│  │ - ... (more tables)                                        │    │
│  └────────────────────────────────────────────────────────────┘    │
│                                                                      │
│  Type: SQLite/PostgreSQL | Location: server/db/                    │
└──────────────────────────────────────────────────────────────────────┘

            ↕ (Database calls from backend)
                     
┌──────────────────────────────────────────────────────────────────────┐
│                     EXTERNAL AI (Optional)                          │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │ OpenAI API                                                 │    │
│  │ - Model: gpt-4-turbo-preview                              │    │
│  │ - Key: sk-... (stored in .env)                            │    │
│  │ - Demo mode: sk-demo-key (no API calls)                   │    │
│  └────────────────────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────────────────────┘
```

---

## 🔄 2. Page Hierarchy & Navigation

```
App Root (client/src/app/layout.tsx)
│
├─ <AIPersonalCoach /> ← Appears on ALL pages
│
└─ (app)/ [Protected Routes - Need auth]
   │
   ├─ layout.tsx
   │
   ├─ /dashboard
   │  └─ Shows: Stats, AI Coach, Quick Suggestions, 
   │            Progress Analytics, Recommendations,
   │            Smart Insights
   │
   ├─ /goals
   │  └─ Shows: Goal list, Create button, AI Wizard
   │
   ├─ /skills
   │  └─ Shows: Skill tracker
   │
   ├─ /habits
   │  └─ Shows: Habit tracker
   │
   ├─ /journal
   │  └─ Shows: Journal entries
   │
   ├─ /learning
   │  └─ Shows: Learning paths
   │
   ├─ /career-map
   │  └─ Shows: Career roadmap
   │
   ├─ /assessment
   │  └─ Shows: Personality test (IPIP)
   │
   ├─ /mental-health
   │  └─ Shows: Mental health tracking
   │
   ├─ /cv-builder
   │  └─ Shows: CV builder
   │
   ├─ /profile
   │  └─ Shows: User profile
   │
   ├─ /privacy
   │  └─ Shows: Privacy settings
   │
   └─ ... (more pages)

│
├─ /login [Public Routes - No auth needed]
│  └─ Shows: Login form
│
└─ /register [Public Routes]
   └─ Shows: Registration form
```

---

## 🎯 3. Dashboard Component Relationships

```
┌─────────────────────────────────────────────────────────────────┐
│  DASHBOARD PAGE: client/src/app/(app)/dashboard/page.tsx        │
│                                                                 │
│  Renders with 3-column layout                                  │
└─────────────────────────────────────────────────────────────────┘
          │
          ├─ Header Section (Full width)
          │  ├─ 🏷️  Page title
          │  └─ 📊 Quick stats (Level, XP, Skills count, etc.)
          │
          ├─ Main Content (2 columns)
          │  │
          │  ├─ Col 1-2: Main Area (Takes 2/3 width)
          │  │  ├─ ┌──────────────────────────────────────────┐
          │  │  │  │ <AIQuickSuggestions context="dashboard" /> │
          │  │  │  │ (Shows contextual tips as carousel)      │
          │  │  │  └──────────────────────────────────────────┘
          │  │  │
          │  │  ├─ ┌──────────────────────────────────────────┐
          │  │  │  │ <AIProgressAnalytics />                   │
          │  │  │  │ (Shows weekly chart + 6 metrics)         │
          │  │  │  └──────────────────────────────────────────┘
          │  │  │
          │  │  └─ ┌──────────────────────────────────────────┐
          │  │     │ <AIRecommendations />                     │
          │  │     │ (Shows beautiful recommendation cards)   │
          │  │     │ (With category filters)                  │
          │  │     └──────────────────────────────────────────┘
          │  │
          │  └─ Col 3: Sidebar (Takes 1/3 width, sticky)
          │     └─ ┌──────────────────────────────────────────┐
          │        │ <AISmartInsights />                       │
          │        │ (Achievement, Opportunity, Warning,      │
          │        │  Milestone cards)                        │
          │        └──────────────────────────────────────────┘
          │
          └─ Global Floating (Bottom-right, on all pages)
             └─ <AIPersonalCoach /> [In layout.tsx, not here]
                (Floating chat widget)
```

---

## 🎨 4. Data Flow for Each Component

### 4.1 AIPersonalCoach Data Flow

```
User clicks floating button (bottom-right)
        ↓
Component opens (isOpen = true)
        ↓
useEffect triggers → generateGreeting()
        ↓
api.sendChatMessage('Say hello...', 'general')
        ↓
Frontend calls: POST /api/ai/chat
        ↓
Backend route: ai-recommendations.js
        ↓
Backend service: ai.js → generateChatResponse()
        ↓
OpenAI API (or demo response)
        ↓
AI response: "Hello, how can I help?"
        ↓
Backend returns response
        ↓
Frontend: setMessages([greeting])
        ↓
Chat widget shows greeting ✅
        ↓
User types message
        ↓
handleSendMessage()
        ↓
api.sendChatMessage(userMessage, 'personal')
        ↓
[Repeat from Backend calls...]
        ↓
New message appears in chat ✅
```

### 4.2 AIRecommendations Data Flow

```
Dashboard page loads
        ↓
<AIRecommendations /> component mounts
        ↓
useEffect runs → api.getRecommendations()
        ↓
Frontend calls: GET /api/ai/recommendations
        ↓
Backend: ai-recommendations.js
        ↓
Backend: Generate recommendations from user profile
        ↓
Returns: [
  { type: 'personality', title: '...', icon: '...' },
  { type: 'skill_gap', title: '...', icon: '...' },
  ...
]
        ↓
Frontend: setRecommendations(data)
        ↓
Component renders cards with:
  - Category filter buttons
  - Gradient backgrounds (by type)
  - Icons
  - Descriptions
  - Action buttons
        ↓
User clicks category filter
        ↓
filteredRecommendations = computeFiltered()
        ↓
Cards re-render with selected category ✅
```

### 4.3 AIGoalWizard Data Flow

```
User clicks "✨ Generate Goal with AI"
        ↓
AIGoalWizard modal opens
        ↓
STEP 1/3: Select Interests
  - Shows 10 interest categories
  - User clicks to select 3-4
  - User clicks [Next]
        ↓
STEP 2/3: Set Timeframe
  - Shows 4 options: 1/3/6/12 months
  - User selects one
  - User clicks [Generate]
        ↓
handleGenerate()
        ↓
setLoading(true) → show spinner
        ↓
api.generateGoalRecommendations(
  interests: ["Career", "Learning"],
  timeframe: "3 months"
)
        ↓
Frontend calls: POST /api/ai/goal-recommendations
        ↓
Backend: ai.js → generateGoalRecommendations()
        ↓
callAI(systemPrompt + interests + timeframe)
        ↓
OpenAI returns 3 goals or demo goals
        ↓
Return to frontend:
{
  recommendations: [
    { title: "Master TypeScript", description: "...", ... },
    { title: "Lead a Project", description: "...", ... },
    { title: "Build Portfolio", description: "...", ... }
  ]
}
        ↓
Frontend: setRecommendations(data), setStep(3)
        ↓
STEP 3/3: Select Goal
  - Shows 3 goal cards
  - User clicks one
  - User clicks [Create Goal]
        ↓
handleSelectGoal(goal)
        ↓
api.createGoal(goal)
        ↓
Frontend calls: POST /api/goals
        ↓
Backend: goals.js route
        ↓
Validates & saves to database
        ↓
Returns: { success: true, goal: {...} }
        ↓
Frontend: setOpen(false), onGoalCreated()
        ↓
Modal closes
        ↓
Goals list refreshes
        ↓
NEW GOAL APPEARS ✅
```

### 4.4 AIProgressAnalytics Data Flow

```
Dashboard loads
        ↓
<AIProgressAnalytics /> mounts
        ↓
useEffect → api.getProgressAnalytics()
        ↓
Frontend calls: GET /api/dashboard (includes analytics)
        ↓
Backend: dashboard.js route
        ↓
Calculates:
  - Weekly activity (Mon-Sun completion rates)
  - 6 metrics:
    * 📈 Overall Progress
    * 🎯 Consistency
    * 🧠 Learning Hours
    * ✅ Goals Completed
    * 🔥 Current Streak
    * 🏆 Achievements
        ↓
Returns: {
  weekly: [65, 75, 80, 90, 70, 85, 95],
  metrics: {
    progress: 72,
    consistency: 85,
    learningHours: 12,
    goalsCompleted: 5,
    streak: 7,
    achievements: 3
  }
}
        ↓
Frontend: setData(data)
        ↓
Component renders:
  - BarChart with Recharts library
  - 6 metric cards with icons
  - Performance summary
        ↓
User can hover for details
        ↓
Displays metrics with AI insights ✅
```

---

## 🔗 5. Component Import Graph

```
client/src/components/index.ts
│
├─ exports AIPersonalCoach
│  ├─ used in: client/src/app/(app)/layout.tsx (Global)
│  └─ used in: Most pages
│
├─ exports AIRecommendations
│  ├─ used in: client/src/app/(app)/dashboard/page.tsx
│  └─ size: ~280 lines
│
├─ exports AISmartInsights
│  ├─ used in: client/src/app/(app)/dashboard/page.tsx
│  └─ size: ~80 lines
│
├─ exports AIProgressAnalytics
│  ├─ used in: client/src/app/(app)/dashboard/page.tsx
│  └─ imports: recharts library
│
├─ exports AIQuickSuggestions
│  ├─ used in: client/src/app/(app)/dashboard/page.tsx
│  └─ context-aware
│
└─ exports AIGoalWizard
   ├─ used in: client/src/app/(app)/goals/page.tsx
   └─ modal-based
```

---

## 🛣️ 6. Request-Response Cycle

```
┌─────────────────────────────────────────────────────────────────┐
│                    FRONTEND (React Component)                   │
│                                                                 │
│  Event triggered (button click, useEffect, etc.)               │
│        ↓                                                        │
│  Component calls: api.someFunction(data)                       │
│        ↓                                                        │
│  client/src/lib/api.ts processes                               │
│    - Adds Authorization header with JWT token                  │
│    - Serializes body to JSON                                   │
│    - Adds Content-Type header                                  │
│        ↓                                                        │
│  Calls: fetch(url, options)                                    │
│        ↓                                                        │
│  HTTP Request sent over network                                │
│                                                                 │
└───────────────────────┬──────────────────────────────────────┬──┘
                        │ (HTTP)                               │
                        ↓                                       ↓
        ┌──────────────────────────┐          ┌────────────────────────┐
        │    REQUEST HEADERS       │          │  REQUEST BODY (JSON)   │
        ├──────────────────────────┤          ├────────────────────────┤
        │ Authorization:           │          │ {                      │
        │   Bearer eyJhbGc...      │          │   "message": "...",    │
        │ Content-Type:            │          │   "context": "..."     │
        │   application/json       │          │ }                      │
        │ Host:                    │          └────────────────────────┘
        │   localhost:5000         │
        │ Method: POST/GET         │
        │ Path: /api/ai/chat       │
        └──────────────────────────┘
                        │
                        ↓
┌─────────────────────────────────────────────────────────────────┐
│                    BACKEND (Express)                            │
│                                                                 │
│  Receives HTTP request                                         │
│        ↓                                                        │
│  Express routing middleware matches: /api/ai/chat              │
│        ↓                                                        │
│  authMiddleware:
│    - Extract token from header                                 │
│    - Verify JWT signature                                      │
│    - Set req.user = decoded token data                         │
│    ✓ Token valid → Continue                                    │
│    ✗ Token invalid → Return 401 Unauthorized                   │
│        ↓                                                        │
│  limiter.ai:
│    - Check rate limit (10 requests/min)                        │
│    ✓ Within limit → Continue                                   │
│    ✗ Exceeded limit → Return 429 Too Many Requests             │
│        ↓                                                        │
│  Validation:
│    - Check message is not empty                                │
│    - Check context is provided                                 │
│    ✓ Valid → Continue                                          │
│    ✗ Invalid → Return 400 Bad Request                          │
│        ↓                                                        │
│  Route handler:                                                │
│    - Extract: { message, context } from body                   │
│    - Get: userId from req.user.id                              │
│    - Call: aiService.generateChatResponse(...)                 │
│        ↓                                                        │
│  AI Service:                                                   │
│    - Create system prompt for context                          │
│    - Check: Is API_KEY === 'sk-demo-key'?                      │
│      ✓ Yes → Return demo response                              │
│      ✗ No → Call OpenAI API                                    │
│        ↓                                                        │
│  Response generated                                            │
│        ↓                                                        │
│  res.json({ success: true, message: "AI response" })           │
│        ↓                                                        │
│  HTTP Response sent over network                               │
│                                                                 │
└───────────────────────┬──────────────────────────────────────┬──┘
                        │ (HTTP)                               │
                        ↓                                       ↓
        ┌──────────────────────────┐          ┌────────────────────────┐
        │   RESPONSE HEADERS       │          │  RESPONSE BODY (JSON)  │
        ├──────────────────────────┤          ├────────────────────────┤
        │ Content-Type:            │          │ {                      │
        │   application/json       │          │   "success": true,     │
        │ Content-Length: 245      │          │   "message": "AI resp" │
        │ Date: ...                │          │   "timestamp": "..."   │
        │ Status: 200 OK           │          │ }                      │
        └──────────────────────────┘          └────────────────────────┘
                        │
                        ↓
┌─────────────────────────────────────────────────────────────────┐
│                    FRONTEND (React Component)                   │
│                                                                 │
│  receive() resolves with response data                         │
│        ↓                                                        │
│  response.json() parses the JSON                               │
│        ↓                                                        │
│  data = { success: true, message: "AI response" }              │
│        ↓                                                        │
│  Component updates state: setState(data)                       │
│        ↓                                                        │
│  Component re-renders with new data                            │
│        ↓                                                        │
│  User sees updated UI ✅                                        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📊 7. State Management Flow

```
┌──────────────────────────────────────────────────────────┐
│         REACT COMPONENT WITH HOOKS                       │
│                                                          │
│  const [isOpen, setIsOpen] = useState(false)            │
│  const [messages, setMessages] = useState([])           │
│  const [loading, setLoading] = useState(false)          │
│                                                          │
│  State variables:                                       │
│    isOpen: Boolean - Is widget open?                    │
│    messages: Array - Chat messages                      │
│    loading: Boolean - Is loading?                       │
│                                                          │
│  Initial render with default state                      │
│    isOpen = false  → Show button only                   │
│    messages = []   → No messages yet                    │
│    loading = false → No spinner                         │
│                                                          │
└────────────────────┬─────────────────────────────────────┘
                     │
        ┌────────────┼────────────┐
        ↓            ↓            ↓
    USER CLICKS   API CALL     STATE UPDATE
    BUTTON        RETURNS      TRIGGERED
        │            │            │
        ↓            ↓            ↓
  setIsOpen(true)  response    setState(newValue)
        │            │            │
        ↓            ↓            ↓
  isOpen=true     API data    State changed
        │            │            │
        ↓            ↓            ↓
  ┌─────────────────────────────┐
  │ Component RE-RENDERS         │
  └─────────────────────────────┘
        │
        ↓
  ┌─────────────────────────────┐
  │ RETURN NEW JSX              │
  │ Based on updated state       │
  └─────────────────────────────┘
        │
        ↓
  ┌─────────────────────────────┐
  │ BROWSER RENDERS UI          │
  │ User sees new state ✅       │
  └─────────────────────────────┘
```

---

## 🗄️ 8. Database Schema Relationships

```
┌─────────────────────────────────────────────────────┐
│                    Database Tables                  │
└─────────────────────────────────────────────────────┘

USERS
├─ id (Primary Key)
├─ email (Unique)
├─ password_hash
├─ name
├─ created_at
└─ updated_at
   │
   ├────→ GOALS
   │      ├─ id
   │      ├─ user_id (Foreign Key)
   │      ├─ title
   │      ├─ description
   │      ├─ category
   │      ├─ status
   │      └─ created_at
   │
   ├────→ SKILLS
   │      ├─ id
   │      ├─ user_id (Foreign Key)
   │      ├─ name
   │      ├─ level
   │      └─ proficiency
   │
   ├────→ HABITS
   │      ├─ id
   │      ├─ user_id (Foreign Key)
   │      ├─ title
   │      ├─ frequency
   │      ├─ streak_count
   │      └─ last_completed_at
   │
   ├────→ JOURNAL_ENTRIES
   │      ├─ id
   │      ├─ user_id (Foreign Key)
   │      ├─ title
   │      ├─ content
   │      ├─ mood
   │      └─ created_at
   │
   ├────→ ASSESSMENT_RESPONSES
   │      ├─ id
   │      ├─ user_id (Foreign Key)
   │      ├─ question_id
   │      ├─ response
   │      └─ test_date
   │
   └────→ LEARNING_PATHS
          ├─ id
          ├─ user_id (Foreign Key)
          ├─ title
          ├─ description
          ├─ progress
          └─ created_at
```

---

## 🎓 9. What Happens During Each Major Flow

### When User Logs In:
```
1. User enters email + password
2. Frontend: api.loginUser(email, password)
3. Backend: POST /api/auth/login
4. Backend verifies password against hash in DB
5. Backend generates JWT token
6. Frontend receives token
7. Frontend stores in localStorage
8. Frontend redirects to /dashboard
9. Dashboard page mounts
10. useEffect checks localStorage for token
11. Token exists → Show dashboard
12. Dashboard fetches data with token
13. Backend verifies token via authMiddleware
14. Backend returns user's data
15. Dashboard displays ✅
```

### When User Creates Goal with AI:
```
1. User clicks "Generate Goal"
2. AIGoalWizard opens (Step 1/3)
3. User selects interests + timeframe
4. User clicks [Generate]
5. Frontend: api.generateGoalRecommendations(...)
6. Backend: POST /api/ai/goal-recommendations
7. Backend calls AI service
8. AI service calls OpenAI (or returns demo)
9. OpenAI returns 3 goal suggestions
10. Frontend receives suggestions
11. Component shows 3 goal cards (Step 3/3)
12. User selects one
13. User clicks [Create Goal]
14. Frontend: api.createGoal(selectedGoal)
15. Backend: POST /api/goals
16. Backend validates & saves to DB
17. Backend returns created goal
18. Frontend closes modal
19. Frontend refreshes goals list
20. New goal appears ✅
```

---

## 🎯 10. Testing the Flow Visually

### Using Browser DevTools

**Step 1: Open DevTools (F12)**
```
Tabs to use:
├─ Network     → See all HTTP requests
├─ Console     → See errors & logs
├─ Application → See localStorage & cookies
└─ Elements    → See DOM & styling
```

**Step 2: Network Tab Flow**
```
Network tab shows:
├─ GET /api/dashboard          ← Loading page data
├─ POST /api/ai/chat           ← Sending message
├─ POST /api/goals             ← Creating goal
├─ GET /api/goals              ← Fetching goals list
└─ (Watch headers & responses)
```

**Step 3: Console Tab**
```
You'll see logs like:
├─ "Fetching dashboard data..."
├─ "Response received: {...}"
├─ Any errors that occurred
└─ Component lifecycle logs
```

**Step 4: Application Tab**
```
localStorage contains:
├─ pf_token: "eyJhbGc..." (JWT token)
└─ other app data
```

---

## 📝 Summary of Visuals

Now you understand:
- ✅ Complete system architecture (frontend → backend → DB)
- ✅ Component relationships and hierarchy
- ✅ Data flow for each major component
- ✅ Request/response cycle with headers & body
- ✅ State management and re-rendering
- ✅ Database schema relationships
- ✅ What happens during major user flows
- ✅ How to visually test with DevTools

**Next steps:**
1. Open your project in VS Code
2. Open DevTools in browser (F12)
3. Perform an action (login, create goal, send message)
4. Watch the Network tab
5. See the request/response cycle happen in real-time!

---

**You're now ready to visually understand PersonaForge!** 🎨✨
