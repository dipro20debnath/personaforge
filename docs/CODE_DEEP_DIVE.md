# 🔬 PERSONAFORGE - Code Deep Dive Guide

## Understanding the Actual Code in Your Project

This guide shows REAL code from your project with explanations.

---

## 📍 PART 1: How Backend Starts

### File: `server/src/index.js`

**What to look for:**
```javascript
// This is where Express server starts
const express = require('express');
const app = express();

// Listen on port
app.listen(5000, () => {
  console.log('Server running on port 5000');
});
```

**What this means:**
- `express()` creates a web server
- `app.listen(5000)` starts listening for requests
- When you see "Server running on port 5000" → Backend is ready ✅

**Questions to answer:**
1. Open `server/src/index.js`
2. Find the `app.listen()` line - what port?
3. Find where routes are imported - how many?
4. Find CORS setup - what origins allowed?

---

## 📍 PART 2: How Frontend Loads

### File: `client/src/app/layout.tsx`

**What to look for:**
```typescript
// Root layout for entire app
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
```

**What this means:**
- This wraps EVERY page in the app
- `{children}` is replaced with actual page content
- Any component here appears on ALL pages

**Check in your project:**
1. Open `client/src/app/layout.tsx`
2. Find: `<AIPersonalCoach />` - is it here?
3. This means AI Coach appears everywhere ✅

---

## 📍 PART 3: API Configuration

### File: `client/src/lib/api.ts`

**What to look for:**
```typescript
// This is the API client - how frontend talks to backend

const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Helper function for all requests
const request = async (endpoint: string, options?: any) => {
  const token = localStorage.getItem('pf_token');
  
  const response = await fetch(`${baseUrl}${endpoint}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }

  return response.json();
};

// Example endpoint
export const api = {
  // Login user
  loginUser: (email: string, password: string) =>
    request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  // Get all goals
  getGoals: () => request('/api/goals'),

  // Send chat message
  sendChatMessage: (message: string, context: string) =>
    request('/api/ai/chat', {
      method: 'POST',
      body: JSON.stringify({ message, context }),
    }),
};
```

**What this means:**
- `baseUrl` is where API requests go: `http://localhost:5000`
- `request()` function adds auth token to every request
- Every API call goes through this pattern
- Token from localStorage is sent in Authorization header

**Flow when frontend calls API:**
```
Frontend code: api.loginUser(email, password)
  ↓
Creates fetch request to: http://localhost:5000/api/auth/login
  ↓
Adds header: Authorization: Bearer {token}
  ↓
Adds body: { email, password }
  ↓
Sends POST request
  ↓
Waits for response
  ↓
Parses JSON
  ↓
Returns data to component
```

**Questions to answer:**
1. What's the baseUrl in your project?
2. How many endpoints are defined in `api` object?
3. Where does token come from?
4. What header carries the token?

---

## 📍 PART 4: Dashboard Page Structure

### File: `client/src/app/(app)/dashboard/page.tsx`

**Simplified structure:**
```typescript
'use client'; // This runs in browser, not server

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import {
  AIRecommendations,
  AIPersonalCoach,
  AISmartInsights,
  AIProgressAnalytics,
  AIQuickSuggestions,
} from '@/components';

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // This runs when page loads
  useEffect(() => {
    const fetchData = async () => {
      try {
        const dashboardData = await api.getDashboard();
        setData(dashboardData);
      } catch (error) {
        console.error('Failed to load dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Empty array = run once on mount

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-6">
      {/* Header Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-500 text-white p-4 rounded">
          <div className="text-2xl font-bold">{data?.stats?.level}</div>
          <div>Level</div>
        </div>
        {/* More stat cards... */}
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-3 gap-6">
        {/* Main Content - Left (Takes 2 columns) */}
        <div className="col-span-2 space-y-6">
          <AIQuickSuggestions context="dashboard" />
          <AIProgressAnalytics />
          <AIRecommendations />
        </div>

        {/* Sidebar - Right (Takes 1 column) */}
        <div className="bg-gray-50 p-4 rounded">
          <AISmartInsights />
        </div>
      </div>
    </div>
  );
}
```

**Visual Layout:**
```
┌─────────────────────────────────────────────────┐
│   Stats: Level | XP | Skills | etc              │
├─────────────────────────────────────────────────┤
│                                                 │
│  Main Content (2 cols)    │  Sidebar (1 col)   │
│  ┌─────────────────────┐  │  ┌──────────────┐  │
│  │ Quick Suggestions   │  │  │ Smart        │  │
│  └─────────────────────┘  │  │ Insights     │  │
│  ┌─────────────────────┐  │  └──────────────┘  │
│  │ Progress Analytics  │  │                    │
│  │ (Chart + Metrics)   │  │                    │
│  └─────────────────────┘  │                    │
│  ┌─────────────────────┐  │                    │
│  │ Recommendations     │  │                    │
│  │ (Filtered cards)    │  │                    │
│  └─────────────────────┘  │                    │
│                                                 │
└─────────────────────────────────────────────────┘
```

**Step-by-step what happens:**
1. Page loads → `useEffect` runs
2. Calls `api.getDashboard()`
3. Backend returns all dashboard data
4. `setData()` updates state → component re-renders
5. Components display with data
6. User sees dashboard ✅

**Questions to answer:**
1. What does `'use client'` do?
2. Why is `useEffect` used?
3. What's in the empty array `[]`?
4. Which components use main content?
5. Which components use sidebar?

---

## 📍 PART 5: AI Component Example

### File: `client/src/components/AIPersonalCoach.tsx`

**Simplified actual code:**
```typescript
'use client';

import { useState, useEffect } from 'react';
import { MessageCircle, Send, X, Sparkles } from 'lucide-react';
import { api } from '@/lib/api';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export function AIPersonalCoach() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  // Generate greeting when component loads
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      generateGreeting();
    }
  }, [isOpen]);

  // Generate AI greeting
  const generateGreeting = async () => {
    try {
      const response = await api.sendChatMessage('Say hello and ask how I can help', 'general');
      setMessages([
        {
          role: 'assistant',
          content: response.message || 'Hello! How can I help you today?',
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    } catch (error) {
      console.error('Error generating greeting:', error);
    }
  };

  // Send user message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message to chat
    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date().toLocaleTimeString(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    // Get AI response
    setLoading(true);
    try {
      const response = await api.sendChatMessage(input, 'personal');
      const aiMessage: Message = {
        role: 'assistant',
        content: response.message || 'I understand.',
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-4 right-4 w-14 h-14 bg-gradient-to-r from-purple-600 to-pink-600 
                     rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center"
        >
          <MessageCircle className="text-white" size={24} />
        </button>
      )}

      {/* Chat Widget */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 w-80 h-96 bg-white rounded-lg shadow-2xl 
                        flex flex-col border border-purple-100">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 rounded-t-lg 
                          flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles size={18} />
              <span>AI Coach</span>
            </div>
            <button onClick={() => setIsOpen(false)}>
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg ${
                    msg.role === 'user'
                      ? 'bg-purple-600 text-white rounded-br-none'
                      : 'bg-gray-100 text-gray-800 rounded-bl-none'
                  }`}
                >
                  <p>{msg.content}</p>
                  <span className="text-xs opacity-70 mt-1">{msg.timestamp}</span>
                </div>
              </div>
            ))}
            {loading && <div className="text-center text-gray-500">AI thinking...</div>}
          </div>

          {/* Input */}
          <form onSubmit={handleSendMessage} className="p-4 border-t flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type message..."
              className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:border-purple-600"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-purple-600 text-white p-2 rounded-lg hover:bg-purple-700 disabled:opacity-50"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
```

**State Flow:**
```
Component starts
  ↓
[isOpen = false]
  ↓
User sees purple button (not open)
  ↓
User clicks button
  ↓
[isOpen = true]
  ↓
useEffect triggers → generateGreeting()
  ↓
calls: api.sendChatMessage('Say hello...', 'general')
  ↓
API returns greeting message
  ↓
setMessages([greeting])
  ↓
Chat widget opens with greeting message ✅
  ↓
User types message
  ↓
handleSendMessage() executes
  ↓
[loading = true] → show "AI thinking..."
  ↓
api.sendChatMessage(userMessage, 'personal')
  ↓
AI response arrives
  ↓
setMessages([...previous, userMessage, aiResponse])
  ↓
[loading = false]
  ↓
Chat updates with new messages ✅
```

**Key React concepts here:**
- `useState`: Manages component state
- `useEffect`: Runs code when component mounts
- `setMessages`: Updates state, triggers re-render
- JSX: `{messages.map(...)}` renders list
- Event handlers: `onClick`, `onSubmit`

**Questions to answer:**
1. Where does greeting come from?
2. How are messages displayed?
3. What's the user vs assistant message color?
4. How does loading state work?
5. What happens when user sends message?

---

## 📍 PART 6: Backend API Endpoint

### File: `server/src/routes/ai-recommendations.js`

**Simplified actual code:**
```javascript
// Express route handler for AI endpoints
const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { authMiddleware } = require('../middleware/auth');
const aiService = require('../services/ai');
const { limiters } = require('../middleware/rateLimiter');

// POST /api/ai/chat
router.post(
  '/chat',
  authMiddleware, // Check user is authenticated
  limiters.ai, // Rate limit: 10 requests/min
  body('message').notEmpty().withMessage('Message required'),
  body('context').optional(),
  async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { message, context } = req.body;
    const userId = req.user.id; // From authMiddleware

    try {
      // Call AI service
      const aiResponse = await aiService.generateChatResponse(
        message,
        context,
        userId
      );

      // Return response
      res.json({
        success: true,
        message: aiResponse,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('AI chat error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to generate response',
      });
    }
  }
);

// POST /api/ai/goal-recommendations
router.post(
  '/goal-recommendations',
  authMiddleware,
  limiters.ai,
  body('interests').isArray(),
  body('timeframe').notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { interests, timeframe } = req.body;
    const userId = req.user.id;

    try {
      const recommendations = await aiService.generateGoalRecommendations(
        interests,
        timeframe,
        userId
      );

      res.json({
        success: true,
        recommendations,
      });
    } catch (error) {
      console.error('Goal recommendations error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to generate recommendations',
      });
    }
  }
);

module.exports = router;
```

**Request/Response Flow:**
```
Frontend sends:
  POST /api/ai/chat
  Headers: { Authorization: "Bearer {token}" }
  Body: {
    message: "Tell me about productivity",
    context: "personal"
  }

↓ Server receives

Express checks: authMiddleware
  → Extracts token from header
  → Verifies JWT
  → Sets req.user with user info
  ✓ User authenticated

Express checks: limiters.ai
  → 10 requests/min limit
  ✓ Not exceeded

Express checks: validation
  → message must not be empty
  ✓ Valid

↓ Handler executes

aiService.generateChatResponse(message, context, userId)
  (See next section)

↓ Response generated

res.json({
  success: true,
  message: "AI response text here...",
  timestamp: "2026-04-19T..."
})

↓ Frontend receives

{
  success: true,
  message: "AI response text...",
  timestamp: "..."
}

↓ Frontend displays in chat
```

**Key middleware concepts:**
- `authMiddleware`: Verifies JWT token
- `limiters.ai`: Rate limiting (10/min)
- `validationResult`: Input validation
- `async/await`: Handle asynchronous operations

**Questions to answer:**
1. What endpoints are in this file?
2. What's required for authentication?
3. What happens if rate limit exceeded?
4. What validation is done?
5. What errors can occur?

---

## 📍 PART 7: AI Service

### File: `server/src/services/ai.js`

**Simplified actual code:**
```javascript
// AI business logic
const fetch = require('node-fetch');

const API_KEY = process.env.OPENAI_API_KEY || 'sk-demo-key';
const API_URL = process.env.OPENAI_API_URL || 'https://api.openai.com/v1';
const MODEL = process.env.OPENAI_MODEL || 'gpt-4-turbo-preview';

// Main AI call function
async function callAI(messages, temperature = 0.7) {
  // Demo mode - return fake data
  if (API_KEY === 'sk-demo-key') {
    return generateDemoResponse(messages);
  }

  // Production mode - call OpenAI
  try {
    const response = await fetch(`${API_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: MODEL,
        messages: messages,
        temperature: temperature,
        max_tokens: 500,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'OpenAI API error');
    }

    return data.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI API error:', error);
    return generateDemoResponse(messages);
  }
}

// Generate chat response
async function generateChatResponse(userMessage, context = 'general', userId) {
  const systemPrompts = {
    personal: 'You are a personal development coach...',
    career: 'You are a career counselor...',
    health: 'You are a wellness advisor...',
    learning: 'You are a learning coach...',
    general: 'You are a helpful assistant...',
  };

  const systemPrompt = systemPrompts[context] || systemPrompts.general;

  const messages = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userMessage },
  ];

  return await callAI(messages);
}

// Generate goal recommendations
async function generateGoalRecommendations(interests, timeframe, userId) {
  const systemPrompt = `You are an expert goal-setting coach. Generate 3 SMART goals 
    based on these interests: ${interests.join(', ')} and timeframe: ${timeframe}.
    Return JSON array of goals with title, description, category, priority.`;

  const messages = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: 'Generate goal recommendations' },
  ];

  const response = await callAI(messages);
  
  try {
    return JSON.parse(response);
  } catch {
    return generateDemoGoalRecommendations();
  }
}

// Demo data generator
function generateDemoResponse(messages) {
  const lastMessage = messages[messages.length - 1].content.toLowerCase();

  if (lastMessage.includes('productivity')) {
    return 'Great question! Productivity is about focusing on high-impact tasks...';
  } else if (lastMessage.includes('goal')) {
    return 'Goals work best when they are SMART: Specific, Measurable, Achievable...';
  }

  return 'That\'s a great question! Let me help you with that...';
}

function generateDemoGoalRecommendations() {
  return [
    {
      title: 'Master a New Skill',
      description: 'Learn a valuable professional skill',
      category: 'Learning',
      priority: 'High',
    },
    {
      title: 'Build a Side Project',
      description: 'Create something practical and useful',
      category: 'Career',
      priority: 'Medium',
    },
    {
      title: 'Improve Health Habits',
      description: 'Exercise 3x/week and improve sleep',
      category: 'Health',
      priority: 'High',
    },
  ];
}

module.exports = {
  callAI,
  generateChatResponse,
  generateGoalRecommendations,
  // ... other functions
};
```

**How it works:**

```
generateChatResponse('Hello', 'personal', userId)
  ↓
Find system prompt for 'personal' context
  ↓
Create messages array:
  [
    { role: 'system', content: 'You are a personal development coach...' },
    { role: 'user', content: 'Hello' }
  ]
  ↓
callAI(messages)
  ↓
Check: Is API_KEY === 'sk-demo-key'?
  ↓ Yes (Demo mode)
Return generateDemoResponse()
  ↓ No (Production)
fetch to https://api.openai.com/v1/chat/completions
  with headers and body
  ↓
Response:
  {
    choices: [
      { message: { content: "AI response..." } }
    ]
  }
  ↓
Return: data.choices[0].message.content
```

**Key concepts:**
- Demo vs Production mode
- System prompts (how AI behaves)
- Temperature (creativity level)
- JSON parsing (for structured responses)
- Error handling (fallback to demo)

---

## 📍 PART 8: Frontend to Backend Flow (Complete)

**Complete example: User creates goal with AI**

### Step 1: Frontend Component
```typescript
// client/src/components/AIGoalWizard.tsx
const handleGenerate = async () => {
  setLoading(true);
  try {
    // Call API with selected interests + timeframe
    const response = await api.generateGoalRecommendations(
      selectedInterests,
      selectedTimeframe
    );
    setRecommendations(response.recommendations);
    setStep(3);
  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
};
```

### Step 2: Frontend API Call
```typescript
// client/src/lib/api.ts
generateGoalRecommendations: (interests, timeframe) =>
  request('/api/ai/goal-recommendations', {
    method: 'POST',
    body: JSON.stringify({ interests, timeframe }),
  }),

// Expands to:
fetch('http://localhost:5000/api/ai/goal-recommendations', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer eyJhbGc...',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    interests: ['Career Growth', 'Learning'],
    timeframe: '3 months'
  }),
})
```

### Step 3: Network Request
```
POST http://localhost:5000/api/ai/goal-recommendations

Headers:
  Authorization: Bearer eyJhbGc...
  Content-Type: application/json

Body:
  {
    "interests": ["Career Growth", "Learning"],
    "timeframe": "3 months"
  }
```

### Step 4: Backend Processing
```javascript
// server/src/routes/ai-recommendations.js
router.post('/goal-recommendations', 
  authMiddleware,        // ✓ Check token
  limiters.ai,          // ✓ Check rate limit
  body('interests').isArray(), // ✓ Validate interests
  body('timeframe').notEmpty(), // ✓ Validate timeframe
  async (req, res) => {
    const { interests, timeframe } = req.body;
    const userId = req.user.id; // From token
    
    // Call service
    const recommendations = await aiService
      .generateGoalRecommendations(interests, timeframe, userId);
    
    res.json({
      success: true,
      recommendations
    });
  }
);
```

### Step 5: AI Service Processing
```javascript
// server/src/services/ai.js
async generateGoalRecommendations(interests, timeframe, userId) {
  const systemPrompt = `Generate 3 SMART goals...`;
  
  const messages = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: `Interests: ${interests}, Timeframe: ${timeframe}` }
  ];
  
  const response = await callAI(messages);
  return JSON.parse(response);
}

// If demo mode (API_KEY === 'sk-demo-key'):
// Returns hardcoded goals

// If production mode:
// Calls OpenAI API → Gets response → Parses JSON
```

### Step 6: Backend Response
```json
{
  "success": true,
  "recommendations": [
    {
      "title": "Master TypeScript",
      "description": "Learn advanced TypeScript concepts...",
      "category": "Learning",
      "priority": "High",
      "timeframe": "3 months"
    },
    {
      "title": "Lead a Project",
      "description": "Lead a team project...",
      "category": "Career",
      "priority": "High",
      "timeframe": "3 months"
    },
    // ... more goals
  ]
}
```

### Step 7: Frontend Receives
```typescript
// client/src/components/AIGoalWizard.tsx
const response = await api.generateGoalRecommendations(...)

// response is:
{
  success: true,
  recommendations: [...]
}

// Update state:
setRecommendations(response.recommendations);
setStep(3); // Show goal selection
```

### Step 8: Frontend Renders
```typescript
// Now show 3 goal cards for user to select

<div className="grid grid-cols-3 gap-4">
  {recommendations.map((goal, i) => (
    <div key={i} className="border rounded p-4 cursor-pointer hover:shadow-lg">
      <h3>{goal.title}</h3>
      <p>{goal.description}</p>
      <span className="text-sm text-gray-500">{goal.timeframe}</span>
      <button onClick={() => handleSelectGoal(goal)}>
        Select This Goal
      </button>
    </div>
  ))}
</div>
```

### Step 9: User Selects Goal
```typescript
// User clicks "Select" on one goal
const handleSelectGoal = async (goal) => {
  setLoading(true);
  try {
    // Create goal in database
    await api.createGoal(goal);
    // Close wizard
    setOpen(false);
    // Refresh goals list
    onGoalCreated?.();
  } finally {
    setLoading(false);
  }
};
```

### Step 10: Create in Database
```javascript
// server/src/routes/goals.js
router.post('/goals',
  authMiddleware,
  async (req, res) => {
    const { title, description, category, timeframe } = req.body;
    const userId = req.user.id;

    // Save to database
    const goal = await db.query(
      'INSERT INTO goals (user_id, title, description, category, timeframe) VALUES (?, ?, ?, ?, ?)',
      [userId, title, description, category, timeframe]
    );

    res.json({
      success: true,
      goal: { id: goal.id, ...req.body }
    });
  }
);
```

### Step 11: Backend Returns Goal
```json
{
  "success": true,
  "goal": {
    "id": 42,
    "title": "Master TypeScript",
    "description": "Learn advanced TypeScript concepts...",
    "category": "Learning",
    "timeframe": "3 months",
    "created_at": "2026-04-19T10:30:00Z"
  }
}
```

### Step 12: Frontend Updates UI
```typescript
// Goal created!
setOpen(false); // Close wizard
onGoalCreated?.(); // Callback to refresh list

// Goals page now shows new goal ✅
```

---

## 🎯 Complete Flow Diagram

```
┌─ FRONTEND ────────────────────────────────────────┐
│ User clicks "Generate Goal"                       │
│ ↓                                                  │
│ AIGoalWizard component opens                      │
│ Select interests + timeframe                      │
│ ↓                                                  │
│ handleGenerate()                                  │
│ ↓                                                  │
│ api.generateGoalRecommendations(...)              │
│ ↓                                                  │
│ fetch('/api/ai/goal-recommendations', ...)        │
└─────────────────────────────────────────────────┬─┘
                                                   │
                                          POST Request
                                                   │
┌─ BACKEND ────────────────────────────────────────┼──┐
│                                                   │  │
│ Express router receives request                  │  │
│ ↓                                                │  │
│ authMiddleware checks token ✓                    │  │
│ limiter checks rate limit ✓                      │  │
│ validator checks data ✓                          │  │
│ ↓                                                │  │
│ aiService.generateGoalRecommendations()          │  │
│ ↓                                                │  │
│ callAI(messages)                                 │  │
│ ├─ Demo mode? Return hardcoded goals ✓           │  │
│ └─ Production? Call OpenAI API                   │  │
│ ↓                                                │  │
│ Parse response → JSON goals                      │  │
│ ↓                                                │  │
│ res.json({ success: true, recommendations })    │  │
└─────────────────────────────────────────────────┼──┘
                                                   │
                                          JSON Response
                                                   │
┌─ FRONTEND ────────────────────────────────────────┼──┐
│                                                   ↓  │
│ receive({ recommendations: [...] })              │  │
│ ↓                                                │  │
│ setRecommendations(data)                         │  │
│ setStep(3)                                       │  │
│ ↓                                                │  │
│ Component re-renders with 3 goal cards           │  │
│ ↓                                                │  │
│ User selects one goal                            │  │
│ ↓                                                │  │
│ handleSelectGoal(goal)                           │  │
│ ↓                                                │  │
│ api.createGoal(goal)                             │  │
│ ↓                                                │  │
│ fetch('/api/goals', POST with goal data)         │  │
└─────────────────────────────────────────────────┬──┘
                                                   │
                                          POST Request
                                                   │
┌─ BACKEND ────────────────────────────────────────┼──┐
│                                                   ↓  │
│ POST /api/goals handler                          │  │
│ ↓                                                │  │
│ Save to database                                 │  │
│ INSERT INTO goals (...)                          │  │
│ ↓                                                │  │
│ Return created goal with ID                      │  │
└─────────────────────────────────────────────────┼──┘
                                                   │
                                          JSON Response
                                                   │
┌─ FRONTEND ────────────────────────────────────────┼──┐
│                                                   ↓  │
│ Receive created goal                             │  │
│ ↓                                                │  │
│ Close wizard                                     │  │
│ Refresh goals list                               │  │
│ ↓                                                │  │
│ NEW GOAL APPEARS IN LIST ✅                      │  │
└────────────────────────────────────────────────────┘
```

---

## 📝 Summary

Now you understand:
1. **How backend starts** - Express server on port 5000
2. **How frontend loads** - Next.js pages and layout
3. **How API works** - Frontend calls, backend responds
4. **How components work** - React hooks and state
5. **How AI works** - OpenAI calls or demo responses
6. **Complete flow** - From button click to database

**Next steps:**
- Read your actual code with these patterns in mind
- Trace a real button click through DevTools
- Understand where data comes from
- Modify a component to see hot-reload
- Add a console.log and watch it appear

Good luck! 🚀
