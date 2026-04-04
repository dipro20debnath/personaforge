# PersonaForge AI Integration Guide

## Overview

PersonaForge now includes advanced AI-powered features that provide personalized recommendations, insights, and guidance across multiple areas of personal development.

## Features

### 1. **Goal Recommendations** 📊
Generate SMART goals based on user profile and interests.
- **Endpoint**: `POST /api/ai/goal-recommendations`
- **Rate Limit**: 10 requests/minute
- **Response**: Array of recommended goals with title, description, category, and timeframe

### 2. **Journal Insights** 📝
Analyze journal entries to provide emotional insights and suggestions.
- **Endpoint**: `POST /api/ai/journal-insights`
- **Rate Limit**: 10 requests/minute
- **Response**: Emotional tone, themes, insights, wellness score

### 3. **Habit Suggestions** 🎯
Get personalized habit recommendations to complement existing habits.
- **Endpoint**: `POST /api/ai/habit-suggestions`
- **Rate Limit**: 10 requests/minute
- **Response**: Array of habits with implementation strategies

### 4. **Learning Path Generator** 📚
Create structured learning paths for skill development.
- **Endpoint**: `POST /api/ai/learning-path`
- **Rate Limit**: 10 requests/minute
- **Response**: Milestones, resources, timeline, estimated hours

### 5. **Skill Gap Analysis** 💼
Identify skill gaps for career transitions.
- **Endpoint**: `POST /api/ai/skill-gaps`
- **Rate Limit**: 10 requests/minute
- **Response**: Gap analysis, recommendations, action plan

### 6. **Motivational Insights** 💪
Generate personalized motivation based on user progress.
- **Endpoint**: `POST /api/ai/motivation`
- **Rate Limit**: 10 requests/minute
- **Response**: Achievements, encouragement, next steps, tips

## Setup Instructions

### Backend Setup

1. **Install Dependencies**
```bash
cd server
npm install
```

2. **Configure Environment Variables**
```bash
# Copy the example file
cp .env.example .env.local

# Edit .env.local with your settings
```

3. **OpenAI API Configuration**
- Get your API key from: https://platform.openai.com/api-keys
- Add to `.env.local`:
```
AI_API_KEY=sk-your-actual-key-here
AI_API_URL=https://api.openai.com/v1
AI_MODEL=gpt-4-turbo-preview
```

4. **Start the Server**
```bash
npm run dev
```

### Frontend Setup

1. **AI Features are Already Integrated**
The client package already includes `socket.io-client` for real-time features.

2. **Use AI Hooks in Components**
```typescript
import { useGoalRecommendations } from '@/hooks/useAI';

function MyComponent() {
  const { loading, recommendations, getRecommendations } = useGoalRecommendations();

  return (
    <button onClick={() => getRecommendations({ interests: ['tech', 'fitness'] })}>
      Get Recommendations
    </button>
  );
}
```

## API Usage Examples

### Goal Recommendations
```bash
curl -X POST http://localhost:5000/api/ai/goal-recommendations \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John",
    "currentRole": "Software Engineer",
    "interests": ["AI", "Leadership"],
    "timeframe": "6 months"
  }'
```

### Journal Insights
```bash
curl -X POST http://localhost:5000/api/ai/journal-insights \
  -H "Content-Type: application/json" \
  -d '{
    "entries": [
      {
        "id": "1",
        "content": "Had a great productive day today...",
        "date": "2024-01-15"
      }
    ]
  }'
```

### Learning Path
```bash
curl -X POST http://localhost:5000/api/ai/learning-path \
  -H "Content-Type: application/json" \
  -d '{
    "goal": "Master Machine Learning",
    "currentSkills": ["Python", "Basic Statistics"],
    "timeframe": "6 months"
  }'
```

## Demo Mode

If you don't have an OpenAI API key configured, the system runs in **demo mode** automatically:

1. Set `AI_API_KEY=sk-demo-key` in `.env.local`
2. All AI endpoints return realistic demo responses
3. Perfect for development and testing

## Security Features

### Rate Limiting
- **General endpoints**: 100 requests/15 min
- **AI endpoints**: 10 requests/min (to prevent abuse and manage API costs)
- **Auth endpoints**: 5 attempts/15 min
- **Strict operations**: 20 requests/min

### Input Validation
- Email validation for all user endpoints
- Password strength requirements
- Content length limits
- Data type validation with express-validator

### Security Headers
- Helmet.js for HTTP security headers
- Content Security Policy (CSP) enabled
- HSTS (HTTP Strict Transport Security)
- XSS Protection enabled
- CORS whitelisting

### Error Handling
- Secure error responses (no stack traces in production)
- Proper HTTP status codes
- Environment-aware error details

## Performance Optimization

### Caching Opportunities
```typescript
// Cache AI responses for repeated requests
const cache = new Map();
const cacheKey = `${type}:${JSON.stringify(payload)}`;

if (cache.has(cacheKey)) {
  return cache.get(cacheKey);
}

const result = await fetchAI();
cache.set(cacheKey, result);
```

### Batch Processing
Consider batching requests when fetching multiple AI insights:
```typescript
// Instead of:
const goals = await api.getGoalRecommendations(profile);
const habits = await api.getHabitSuggestions(habits);

// Consider parallel requests:
const [goals, habits] = await Promise.all([
  api.getGoalRecommendations(profile),
  api.getHabitSuggestions(habits)
]);
```

## Component Integration

### Adding AI Features to Existing Pages

1. **Goals Page Enhancement**
```typescript
import { AIRecommendations } from '@/components/AIRecommendations';

export default function GoalsPage() {
  return (
    <div>
      <h1>Your Goals</h1>
      <AIRecommendations userProfile={userProfile} />
      {/* Existing goals list */}
    </div>
  );
}
```

2. **Dashboard Integration**
```typescript
import { AIRecommendations } from '@/components/AIRecommendations';

export default function Dashboard() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <AIRecommendations 
          userProfile={userProfile}
          currentHabits={habits}
          userProgress={progress}
        />
      </div>
      {/* Other dashboard content */}
    </div>
  );
}
```

## Troubleshooting

### AI endpoints returning 401
- Check that your API key is valid
- Ensure auth token is included in request headers
- Verify token hasn't expired

### Rate limit exceeded errors
- Implement request queuing in frontend
- Cache responses when possible
- Increase rate limits in production if needed

### Demo responses not appearing
- Verify `AI_API_KEY` is set to `sk-demo-key`
- Check server console for errors
- Ensure .env.local is being read

### CORS errors
- Verify frontend URL is in CORS whitelist
- Check `corsOptions` in security middleware
- Add frontend URL to whitelist if needed

## Production Deployment

### Before Going Live

1. **Security Checklist**
- [ ] Change JWT_SECRET to a strong random string
- [ ] Set NODE_ENV=production
- [ ] Verify CORS whitelist is correct
- [ ] Update password requirements
- [ ] Enable HTTPS/TLS

2. **Performance**
- [ ] Set up caching (Redis optional)
- [ ] Monitor AI API usage and costs
- [ ] Set appropriate rate limits
- [ ] Consider CDN for static assets

3. **Monitoring**
- [ ] Set up error tracking (Sentry, etc.)
- [ ] Monitor API response times
- [ ] Track failed AI requests
- [ ] Log security events

### Scaling Considerations

1. **API Rate Limiting**
```javascript
// Increase limits based on capacity
export const limiters = {
  ai: rateLimit({
    windowMs: 60 * 1000,
    max: 50, // Increase for production
    skipFailedRequests: true,
  }),
};
```

2. **Database Connection Pooling**
- Implement connection pooling for better performance
- Use query caching where applicable

3. **Load Balancing**
- Distribute requests across multiple server instances
- Use sticky sessions if needed

## Future Enhancements

### Planned Features
- [ ] Real-time notifications for AI insights
- [ ] Custom AI model fine-tuning
- [ ] Multi-language support
- [ ] Advanced analytics dashboard
- [ ] Integration with external data sources
- [ ] Predictive analytics
- [ ] Community-driven recommendations

### API Roadmap
- v2.0: Batch processing endpoint
- v2.1: WebSocket streaming responses
- v2.2: Custom model training
- v3.0: Advanced analytics engine

## Support

For issues or questions:
1. Check the Troubleshooting section above
2. Review API logs: `server/logs/`
3. Check browser console for client-side errors
4. Look for detailed errors in server console with `DEBUG_AI=true`

## Resources

- [OpenAI API Documentation](https://platform.openai.com/docs)
- [PersonaForge Project Repository](.)
- [Security Best Practices](./SECURITY.md)
- [Architecture Overview](./ARCHITECTURE.md)
