# 🤖 PersonaForge AI Features - Complete Guide

## Overview

PersonaForge now comes with 6 powerful AI-powered features that make personal development actionable and engaging:

## 🎯 Features Guide

### 1. **AI Personal Coach** (Floating Widget)
**Component**: `AIPersonalCoach`

A conversational AI coach that's always available as a floating widget in the bottom-right corner.

**Features:**
- 💬 Real-time chat conversations
- 🎯 Contextual advice based on your goals
- 📱 Minimize/maximize widget for better UX
- ✨ Auto-generated greeting based on your progress

**Usage:**
```tsx
import { AIPersonalCoach } from '@/components';

export default function Layout() {
  return (
    <>
      {/* Your layout */}
      <AIPersonalCoach />
    </>
  );
}
```

**Backend Endpoint:**
```
POST /api/ai/chat
Body: { message: string, context?: string }
Response: { response: string, timestamp: string }
```

---

### 2. **Smart Insights Cards**
**Component**: `AISmartInsights`

Displays real-time actionable insights based on user behavior.

**Features:**
- 🎯 Achievement celebrations
- ⚠️ Warning alerts
- 💡 Growth opportunities
- 🎪 Milestone notifications
- Dismissable notifications

**Usage:**
```tsx
import { AISmartInsights } from '@/components';

export default function Dashboard() {
  return (
    <div className="sidebar">
      <AISmartInsights />
    </div>
  );
}
```

**Example Insights:**
- "7-Day Streak! Best time to add a new habit"
- "Skill Gap Opportunity: Consider adding Leadership skills"
- "67% toward your next goal milestone"
- "Low Activity This Week - Let's get back on track!"

---

### 3. **Quick Suggestions**
**Component**: `AIQuickSuggestions`

Context-aware suggestions that help users make better decisions.

**Features:**
- 🌍 Context-aware (goals, skills, habits, learning, dashboard)
- 🔄 Carousel navigation between suggestions
- ⭐ Priority-based color coding
- ⚡ One-click actions

**Usage:**
```tsx
import { AIQuickSuggestions } from '@/components';

export default function GoalsPage() {
  return (
    <div>
      <AIQuickSuggestions context="goals" />
      {/* Goals list */}
    </div>
  );
}
```

**Available Contexts:**
- `goals`: Goal-setting advice
- `skills`: Skill development tips
- `habits`: Habit formation strategies
- `learning`: Learning methodology tips
- `dashboard`: General productivity tips

---

### 4. **AI Goal Wizard**
**Component**: `AIGoalWizard`

An interactive multi-step wizard for generating personalized goals.

**Features:**
- 📋 Select multiple interests
- ⏰ Choose timeframe
- 🎯 AI-generated goal recommendations
- ✅ Create goals with one click
- 📊 Shows goal details and categories

**Usage:**
```tsx
import { AIGoalWizard } from '@/components';
import { useState } from 'react';

export default function GoalsPage() {
  const [wizardOpen, setWizardOpen] = useState(false);

  return (
    <>
      <button onClick={() => setWizardOpen(true)}>
        ✨ Generate Goals with AI
      </button>
      
      <AIGoalWizard 
        isOpen={wizardOpen}
        onClose={() => setWizardOpen(false)}
        onGoalCreated={(goal) => {
          console.log('Goal created:', goal);
          setWizardOpen(false);
        }}
      />
    </>
  );
}
```

**Available Interests:**
- Career Growth
- Health & Fitness
- Learning & Skills
- Personal Finance
- Relationships
- Creative Writing
- Mental Wellness
- Travel
- Entrepreneurship
- Reading

---

### 5. **Progress Analytics Dashboard**
**Component**: `AIProgressAnalytics`

Comprehensive analytics showing user progress and AI-powered insights.

**Features:**
- 📈 Weekly activity chart
- 📊 6 key performance metrics
- 💡 AI-generated insights for each metric
- 🎯 Performance summary
- 🏆 Ranking and streak tracking

**Metrics Tracked:**
1. Overall Health Score
2. Habit Consistency
3. Goal Progress
4. Learning Velocity
5. Skill Growth
6. Productivity Index

**Usage:**
```tsx
import { AIProgressAnalytics } from '@/components';

export default function DashboardPage() {
  return (
    <div className="dashboard">
      <AIProgressAnalytics />
    </div>
  );
}
```

---

### 6. **AI Recommendations Component** (Enhanced)
**Component**: `AIRecommendations`

Beautifully displayed recommendations with gradients, animations, and actionable buttons.

**Features:**
- ✨ Stunning gradient backgrounds
- 🎯 Category filtering
- 💡 Personalized recommendations
- 🔄 Real-time updates
- 📱 Responsive design
- 🎨 Smooth animations

**Usage:**
```tsx
import { AIRecommendations } from '@/components';

export default function RecommendationsPage() {
  const userProfile = {
    name: 'John',
    currentRole: 'Software Engineer',
    interests: ['AI', 'Leadership']
  };

  return (
    <AIRecommendations 
      userProfile={userProfile}
      currentHabits={habits}
      userProgress={progress}
    />
  );
}
```

---

## 🔌 Backend Integration

All AI features connect to the following endpoints:

### Chat Endpoint
```
POST /api/ai/chat
Rate Limit: 10 requests/minute

Request:
{
  "message": "How do I stay motivated?",
  "context": "general|career|health|learning|personal"
}

Response:
{
  "success": true,
  "response": "That's a great question...",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### Other Endpoints
- `POST /api/ai/goal-recommendations` - Generate goals
- `POST /api/ai/journal-insights` - Analyze journal entries
- `POST /api/ai/habit-suggestions` - Get habit recommendations
- `POST /api/ai/learning-path` - Create learning path
- `POST /api/ai/skill-gaps` - Analyze skill gaps
- `POST /api/ai/motivation` - Get motivation boost

---

## 🎨 Dashboard Integration Examples

### Complete AI-Powered Dashboard
```tsx
import { 
  AIPersonalCoach, 
  AISmartInsights, 
  AIProgressAnalytics, 
  AIQuickSuggestions 
} from '@/components';

export default function Dashboard() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Sidebar */}
      <aside className="lg:col-span-1">
        <AISmartInsights />
      </aside>

      {/* Main Content */}
      <main className="lg:col-span-3 space-y-8">
        <AIQuickSuggestions context="dashboard" />
        <AIProgressAnalytics />
      </main>

      {/* Floating Coach */}
      <AIPersonalCoach />
    </div>
  );
}
```

### Goals Page with AI
```tsx
import { AIGoalWizard, AIQuickSuggestions } from '@/components';
import { useState } from 'react';

export default function GoalsPage() {
  const [wizardOpen, setWizardOpen] = useState(false);
  const [goals, setGoals] = useState([]);

  const handleGoalCreated = (goal) => {
    setGoals([...goals, goal]);
    setWizardOpen(false);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1>My Goals</h1>
        <button 
          onClick={() => setWizardOpen(true)}
          className="px-6 py-3 bg-purple-600 text-white rounded-lg font-bold"
        >
          ✨ Generate Goal with AI
        </button>
      </div>

      <AIQuickSuggestions context="goals" />

      <AIGoalWizard 
        isOpen={wizardOpen}
        onClose={() => setWizardOpen(false)}
        onGoalCreated={handleGoalCreated}
      />

      {/* Goals list */}
      <div className="grid gap-4">
        {goals.map(goal => (
          <div key={goal.title} className="p-4 border rounded-lg">
            <h3 className="font-bold">{goal.title}</h3>
            <p className="text-sm text-gray-600">{goal.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

## 🚀 Making AI Features Valuable

### Best Practices

1. **Show Smart Insights Prominently**
   - Place on dashboard sidebar
   - Update real-time based on user actions
   - Celebrate achievements

2. **Use Context-Aware Suggestions**
   - Show relevant suggestions on each page
   - Match suggestion context to page content
   - Provide one-click actions

3. **Leverage Analytics**
   - Help users see their progress
   - Build motivation through metrics
   - Celebrate milestones

4. **Personalize Chat**
   - Greet users by name
   - Remember context from previous messages
   - Offer actionable advice, not just words

5. **Guide with Wizards**
   - Make goal creation easy 3-step process
   - Show progress visually
   - Celebrate goal creation

---

## 💡 Advanced Implementation

### Caching AI Responses
```typescript
const responseCache = new Map();

export function useCachedAIResponse(key: string, fetcher: () => Promise<any>) {
  const [data, setData] = useState(null);

  useEffect(() => {
    if (responseCache.has(key)) {
      setData(responseCache.get(key));
    } else {
      fetcher().then(result => {
        responseCache.set(key, result);
        setData(result);
      });
    }
  }, [key, fetcher]);

  return data;
}
```

### Real-Time Updates
```typescript
// Update insights when user takes action
useEffect(() => {
  const interval = setInterval(() => {
    fetchSmartInsights(); // Refresh insights every 5 minutes
  }, 5 * 60 * 1000);

  return () => clearInterval(interval);
}, []);
```

---

## 🔐 Security & Rate Limiting

All AI endpoints have rate limiting:
- **General endpoints**: 100 requests/15 min
- **AI Chat**: 10 requests/minute
- **AI Generation**: 10 requests/minute

This ensures:
- Fair usage across all users
- Protection against abuse
- Manageable API costs

---

## 📊 Demo Mode

All AI features work in demo mode when no OpenAI API key is configured:

```bash
# Set in .env.local
AI_API_KEY=sk-demo-key
```

Demo mode provides:
- Realistic sample responses
- Perfect for development
- No API costs
- Full feature testing

---

## 🎯 Next Steps

1. **Integrate AI Coach globally** in main layout
2. **Add Smart Insights to dashboard** sidebar
3. **Add Goal Wizard to goals page**
4. **Show Progress Analytics on dashboard**
5. **Add context-aware suggestions to all pages**
6. **Monitor AI feature usage** and iterate

---

## 📞 Support

For issues or questions:
- Check demo responses are working
- Verify API key configuration
- Check rate limiting settings
- Review error logs
