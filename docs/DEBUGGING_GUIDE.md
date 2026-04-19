# 🔍 Debugging & Monitoring Guide

Complete guide to observing your PersonaForge application in real-time.

---

## 📦 What's Included

### 1. **DebugLogger** (`lib/debugLogger.ts`)
Centralized logging system with color-coded console output and log storage.

**Features:**
- Timestamped logs with millisecond precision
- Color-coded by log level
- Separates network, state, render, and performance logs
- Stores up to 500 logs in memory
- Export logs as JSON

### 2. **Debug Hooks** (`lib/debugHooks.ts`)
Custom React hooks for monitoring components.

**Available Hooks:**
- `useDebugRender()` - Track component re-renders
- `useDebugState()` - Monitor state changes with before/after values
- `useDebugAsync()` - Measure async operation performance
- `useDebugEffect()` - Track effect execution and cleanup
- `useDebugTiming()` - Measure function execution time
- `useDebugProps()` - Monitor prop changes
- `useMemoryMonitor()` - Track memory usage
- `useApiDebug()` - Log API calls with timing

### 3. **Network Interceptor** (`lib/networkInterceptor.ts`)
Automatic interception of all fetch requests/responses.

**Features:**
- Captures all HTTP requests automatically
- Logs request/response with timing
- Calculates data transfer size
- Tracks success/failure rates
- Performance metrics

### 4. **Debug Panel UI** (`components/DebugPanel.tsx`)
Visual dashboard showing real-time debugging information.

**Tabs:**
- 📋 **Logs** - All application logs
- 🌐 **Network** - HTTP requests and responses
- ⚡ **Performance** - Operation timing

---

## 🚀 Setup & Integration

### Step 1: Add Debug Panel to Layout

Edit `client/src/app/layout.tsx`:

```typescript
import { DebugPanel } from '@/components/DebugPanel';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        {children}
        <DebugPanel /> {/* Add this line */}
      </body>
    </html>
  );
}
```

### Step 2: Initialize Network Interceptor

The network interceptor auto-initializes in development mode. No additional setup needed!

### Step 3: Use Debug Hooks in Components

Edit your components to use debug hooks:

```typescript
'use client';
import { useDebugRender, useDebugState, useDebugAsync, useDebugTiming } from '@/lib/debugHooks';
import { DebugLogger } from '@/lib/debugLogger';

export function MyComponent() {
  // Track renders
  useDebugRender('MyComponent');

  // Track state with before/after values
  const [count, setCount] = useDebugState(0, 'count', 'MyComponent');

  // Track async operations
  const { data, loading } = useDebugAsync(
    async () => fetchData(),
    [],
    'Fetch Data Operation'
  );

  // Time function execution
  const timedFunction = useDebugTiming(async () => {
    // Do something
  }, 'myAsyncFunction');

  return <div>{count}</div>;
}
```

---

## 🎯 Usage Examples

### Example 1: Debug Goals Page

Edit `client/src/app/(app)/goals/page.tsx`:

```typescript
'use client';
import { useEffect, useState } from 'react';
import { useDebugRender, useDebugState, useDebugAsync } from '@/lib/debugHooks';
import { DebugLogger } from '@/lib/debugLogger';
import { api } from '@/lib/api';

export default function GoalsPage() {
  // Track renders
  useDebugRender('GoalsPage');

  // Track state
  const [goals, setGoals] = useDebugState([], 'goals', 'GoalsPage');
  const [showAdd, setShowAdd] = useDebugState(false, 'showAdd', 'GoalsPage');

  // Track async data loading
  const { data: loadedGoals, loading } = useDebugAsync(
    async () => {
      DebugLogger.info('Loading goals...');
      return await api.getGoals();
    },
    [],
    'Load Goals'
  );

  useEffect(() => {
    if (loadedGoals) {
      setGoals(loadedGoals);
    }
  }, [loadedGoals, setGoals]);

  const addGoal = async (goal: any) => {
    try {
      DebugLogger.info('Adding goal', goal);
      await api.addGoal(goal);
      DebugLogger.info('Goal added successfully');
      // Reload goals
      const updated = await api.getGoals();
      setGoals(updated);
    } catch (error) {
      DebugLogger.error('Failed to add goal', error);
    }
  };

  return (
    <div>
      {/* Your component JSX */}
    </div>
  );
}
```

---

## 🔧 Console Commands (Browser DevTools)

Once loaded, access debugging directly from browser console:

### DebugLogger Commands
```javascript
// View all logs
window.__debugLogger.getLogs()

// View only network logs
window.__debugLogger.getLogs(LogLevel.NETWORK)

// Print logs as table
window.__debugLogger.printLogs()

// Export logs as JSON
const json = window.__debugLogger.exportLogs()

// Get performance summary
window.__debugLogger.getPerformanceSummary()

// Clear logs
window.__debugLogger.clear()
```

### Network Interceptor Commands
```javascript
// View all network metrics
window.__networkInterceptor.getMetrics()

// Filter by method
window.__networkInterceptor.getMetrics({ method: 'GET' })

// Filter by endpoint
window.__networkInterceptor.getMetrics({ endpoint: '/goals' })

// Print as table
window.__networkInterceptor.printMetrics()

// Get summary
window.__networkInterceptor.getSummary()

// Print summary
window.__networkInterceptor.printSummary()

// Export metrics
const json = window.__networkInterceptor.export()

// Clear metrics
window.__networkInterceptor.clear()
```

---

## 📊 What You Can Observe

### 1. Network Requests
- ✅ HTTP method (GET, POST, PUT, DELETE)
- ✅ Endpoint path
- ✅ Request/response size
- ✅ Status code
- ✅ Response time
- ✅ Request/response body

### 2. Component Re-renders
- ✅ Component name
- ✅ Render count
- ✅ Reason for re-render
- ✅ Props changes
- ✅ State updates

### 3. State Updates
- ✅ Previous value
- ✅ New value
- ✅ Timestamp
- ✅ Component name
- ✅ State name

### 4. API Response Time
- ✅ Total duration
- ✅ Request/response sizes
- ✅ Success/failure status
- ✅ Average response time
- ✅ Slowest/fastest requests

### 5. Error Handling
- ✅ Error messages
- ✅ Stack traces
- ✅ When errors occurred
- ✅ Related request/component

### 6. Performance Metrics
- ✅ Function execution time
- ✅ Async operation duration
- ✅ Component render time
- ✅ Effect cleanup time
- ✅ Memory usage

---

## 🎨 Debug Panel Features

### Real-time Monitoring
- Auto-refreshes every 1 second
- Shows last 20 logs/requests
- Color-coded by status/level

### Export Data
- Download logs as JSON
- Download network metrics
- Share with team

### Filtering
- Filter by log type
- Filter by method/endpoint
- Clear individual sections

### Performance Insights
- Slowest operations highlighted
- Success rate percentage
- Total data transferred
- Average response time

---

## 📋 Example Scenarios

### Scenario 1: Slow Goal Loading

1. Open Debug Panel
2. Click "Network" tab
3. Look for `/api/goals` request
4. Check response time
5. If > 500ms, check server performance

### Scenario 2: Unexpected Re-renders

1. Open Console
2. Run: `window.__debugLogger.getLogs(LogLevel.RENDER)`
3. Look for excessive renders
4. Check if props are changing unnecessarily
5. Optimize with useMemo/useCallback

### Scenario 3: State Management Issues

1. Click "Logs" in Debug Panel
2. Filter for "STATE" logs
3. Observe before/after values
4. Check if state updates are as expected

### Scenario 4: API Request Failures

1. Check Network tab
2. Look for red status codes (5xx)
3. Check error messages
4. Review request payload
5. Check server logs

---

## 🔍 Console Output Examples

### Network Request Log
```
[12:34:56.789] 🌐 NETWORK GET /api/goals
Data: { userId: 123 }

[12:34:56.890] 🌐 NETWORK ✅ GET /api/goals (200)
Data: { status: 200, data: [...] }
Duration: (101.25ms)
```

### State Update Log
```
[12:34:57.100] 📊 STATE GoalsPage → goals updated
Old: []
New: [{ id: 1, title: "Learn React" }, ...]
```

### Component Render Log
```
[12:34:57.150] 🎨 RENDER GoalsPage rendered (render #1)
[12:34:57.200] 🎨 RENDER GoalsPage rendered (render #2 (state updated))
```

### Performance Log
```
[12:34:57.300] ⚡ PERFORMANCE Load Goals
Duration: (105.50ms)
Details: { resultType: "object" }
```

---

## 📈 Performance Optimization Tips

### Based on Debug Observations:

1. **Slow API Responses**
   - Check network metrics
   - If > 500ms, optimize server queries
   - Add database indexes

2. **Excessive Re-renders**
   - Monitor render logs
   - Use React DevTools Profiler
   - Memoize expensive components

3. **Memory Leaks**
   - Check memory monitor
   - Ensure effects clean up
   - Verify event listeners removed

4. **Large Payloads**
   - Check response sizes
   - Implement pagination
   - Use compression

5. **Slow Functions**
   - Use useDebugTiming hook
   - Profile with DevTools
   - Optimize algorithms

---

## 🛠️ Advanced Usage

### Custom Performance Tracking

```typescript
import { DebugLogger } from '@/lib/debugLogger';

async function importantOperation() {
  const startTime = performance.now();
  
  try {
    // Do something
    const result = await expensiveOperation();
    
    const duration = performance.now() - startTime;
    DebugLogger.performance('Important Operation', duration, {
      itemsProcessed: result.length,
    });
    
    return result;
  } catch (error) {
    const duration = performance.now() - startTime;
    DebugLogger.error('Operation failed', error);
    DebugLogger.performance('Important Operation (failed)', duration);
    throw error;
  }
}
```

### Custom Network Logging

```typescript
import { DebugLogger } from '@/lib/debugLogger';

async function customApiCall(endpoint: string, data: any) {
  const startTime = performance.now();
  
  DebugLogger.network('POST', endpoint, data);
  
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    
    const duration = performance.now() - startTime;
    const result = await response.json();
    
    DebugLogger.networkResponse('POST', endpoint, response.status, duration, result);
    return result;
  } catch (error) {
    const duration = performance.now() - startTime;
    DebugLogger.error(`POST ${endpoint} failed`, error);
    throw error;
  }
}
```

---

## 🎯 Best Practices

1. **Use in Development Only**
   - All debugging disabled in production
   - No performance impact

2. **Clear Logs Regularly**
   - 500 log limit to prevent memory issues
   - Manually clear when needed

3. **Export Before Debugging**
   - Save metrics for analysis
   - Share with team for troubleshooting

4. **Monitor Key Operations**
   - Focus on user-impacting operations
   - Don't over-log everything

5. **Combine with DevTools**
   - Use browser DevTools in parallel
   - React DevTools for component profiling
   - Chrome DevTools for network inspection

---

## 🚀 Next Steps

1. ✅ Add DebugPanel to layout
2. ✅ Open in browser (development mode)
3. ✅ Observe network requests
4. ✅ Track component re-renders
5. ✅ Monitor state updates
6. ✅ Measure API performance
7. ✅ Optimize based on insights

---

## 📞 Troubleshooting

### Debug Panel Not Showing
- Ensure you're in development mode
- Check browser console for errors
- Verify DebugPanel imported correctly

### No Network Requests Logged
- Network interceptor auto-starts in dev
- Check if requests are using fetch
- Verify browser DevTools isn't blocking

### Performance Data Not Showing
- Use useDebugTiming hook in components
- Call DebugLogger.performance() manually
- Check browser performance API is available

---

**Happy Debugging! 🔍**
