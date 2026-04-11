// Determine API URL with smart detection
const getApiUrl = () => {
  // First priority: environment variable
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }

  // Second priority: detect environment from window location
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    
    // If on Vercel production
    if (hostname.includes('vercel.app') || hostname.includes('personaforge')) {
      return 'https://desirable-embrace-production-464b.up.railway.app';
    }
    
    // If on localhost
    if (hostname.includes('localhost') || hostname === '127.0.0.1') {
      return 'http://localhost:5000';
    }
  }

  // Fallback: assume production
  return 'https://desirable-embrace-production-464b.up.railway.app';
};

const API = getApiUrl();

// Log current API URL in development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  console.log('🔗 PersonaForge API URL:', API);
}

async function request(path: string, options: RequestInit = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('pf_token') : null;
  const url = `${API}/api${path}`;
  
  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers || {}),
      },
    });
    
    if (res.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('pf_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
      throw new Error('Unauthorized');
    }
    
    let data;
    const contentType = res.headers.get('content-type');
    if (contentType?.includes('application/json')) {
      data = await res.json();
    } else {
      const text = await res.text();
      data = { error: text || 'Request failed' };
    }
    
    if (!res.ok) {
      throw new Error(data.error || `HTTP ${res.status}: ${res.statusText}`);
    }
    
    return data;
  } catch (error: any) {
    console.error(`❌ API Error [${path}]:`, error.message);
    throw error;
  }
}

const api = {
  // Auth
  register: (body: any) => request('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login: (body: any) => request('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  // Profile
  getProfile: () => request('/profile'),
  updateProfile: (body: any) => request('/profile', { method: 'PUT', body: JSON.stringify(body) }),
  // Dashboard
  getDashboard: () => request('/dashboard'),
  // Assessment
  getQuestions: () => request('/assessment/questions'),
  submitAssessment: (responses: any) => request('/assessment/submit', { method: 'POST', body: JSON.stringify({ responses }) }),
  getLatestAssessment: () => request('/assessment/latest'),
  getAssessmentHistory: () => request('/assessment/history'),
  // Skills
  getSkills: () => request('/skills'),
  addSkill: (body: any) => request('/skills', { method: 'POST', body: JSON.stringify(body) }),
  updateSkill: (id: string, body: any) => request(`/skills/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteSkill: (id: string) => request(`/skills/${id}`, { method: 'DELETE' }),
  // Admin
  adminDashboard: () => request('/admin/dashboard'),
  adminUsers: () => request('/admin/users'),
  adminDeleteUser: (id: string) => request(`/admin/users/${id}`, { method: 'DELETE' }),
  adminLogs: () => request('/admin/logs'),
  adminContent: () => request('/admin/content'),
  adminSettings: () => request('/admin/settings'),
  adminBackup: () => request('/admin/backup/users', { method: 'POST' }),
  adminStats: () => request('/admin/stats/overview'),
  // Goals
  getGoals: () => request('/goals'),
  addGoal: (body: any) => request('/goals', { method: 'POST', body: JSON.stringify(body) }),
  updateGoal: (id: string, body: any) => request(`/goals/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteGoal: (id: string) => request(`/goals/${id}`, { method: 'DELETE' }),
  toggleMilestone: (id: string, done: boolean) => request(`/goals/milestone/${id}`, { method: 'PUT', body: JSON.stringify({ done }) }),
  // Habits
  getHabits: () => request('/habits'),
  addHabit: (body: any) => request('/habits', { method: 'POST', body: JSON.stringify(body) }),
  checkinHabit: (id: string, note?: string) => request(`/habits/${id}/checkin`, { method: 'POST', body: JSON.stringify({ note }) }),
  deleteHabit: (id: string) => request(`/habits/${id}`, { method: 'DELETE' }),
  // Journal
  getJournal: (params?: any) => { const q = params ? '?' + new URLSearchParams(params).toString() : ''; return request(`/journal${q}`); },
  getPrompt: () => request('/journal/prompt'),
  addJournalEntry: (body: any) => request('/journal', { method: 'POST', body: JSON.stringify(body) }),
  deleteJournalEntry: (id: string) => request(`/journal/${id}`, { method: 'DELETE' }),
  // Learning
  getLearningPaths: () => request('/learning/paths'),
  enrollPath: (id: string) => request(`/learning/enroll/${id}`, { method: 'POST' }),
  updateProgress: (id: string, progress: number) => request(`/learning/progress/${id}`, { method: 'PUT', body: JSON.stringify({ progress }) }),
  // Notifications
  getNotifications: () => request('/notifications'),
  markRead: (id: string) => request(`/notifications/read/${id}`, { method: 'PUT' }),
  markAllRead: () => request('/notifications/read-all', { method: 'PUT' }),
  // Privacy
  getConsents: () => request('/privacy/consents'),
  updateConsent: (purpose: string, granted: boolean) => request('/privacy/consent', { method: 'POST', body: JSON.stringify({ purpose, granted }) }),
  exportData: () => request('/privacy/export'),
  deleteAccount: () => request('/privacy/delete-account', { method: 'DELETE' }),
  // Daily Routine
  getDailyRoutine: () => request('/daily-routine'),
  saveDailyRoutine: (body: any) => request('/daily-routine', { method: 'POST', body: JSON.stringify(body) }),
  // 100-Day Challenge
  get100DayChallenge: () => request('/motivation/challenge'),
  complete100DayChallenge: (body: any) => request('/motivation/challenge/complete', { method: 'POST', body: JSON.stringify(body) }),
  getDailyQuote: (day: number) => request(`/motivation/quote/${day}`),
  // Money Management
  getMoneyManagement: () => request('/money-management'),
  addMoneyEntry: (body: any) => request('/money-management/entry', { method: 'POST', body: JSON.stringify(body) }),
  deleteMoneyEntry: (body: any) => request('/money-management/entry', { method: 'DELETE', body: JSON.stringify(body) }),
  // Voice Assistant
  saveVoiceCommand: (body: any) => request('/voice-assistant/save-command', { method: 'POST', body: JSON.stringify(body) }),
  getVoiceHistory: (limit?: number) => request(`/voice-assistant/history${limit ? '?limit=' + limit : ''}`),
  getVoiceStats: () => request('/voice-assistant/stats'),
  getVoiceSuggestions: () => request('/voice-assistant/suggestions'),
  addVoiceGoal: (body: any) => request('/voice-assistant/commands/add-goal', { method: 'POST', body: JSON.stringify(body) }),
  addVoiceHabit: (body: any) => request('/voice-assistant/commands/add-habit', { method: 'POST', body: JSON.stringify(body) }),
  addVoiceJournal: (body: any) => request('/voice-assistant/commands/journal', { method: 'POST', body: JSON.stringify(body) }),
  addVoiceMoneyEntry: (body: any) => request('/voice-assistant/commands/money-entry', { method: 'POST', body: JSON.stringify(body) }),
  getVoiceFeatures: () => request('/voice-assistant/features'),
  // Abroad Goals
  createAbroadGoal: (body: any) => request('/abroad-goals/create', { method: 'POST', body: JSON.stringify(body) }),
  getAbroadGoals: () => request('/abroad-goals'),
  getAbroadGoalDetail: (goalId: string) => request(`/abroad-goals/${goalId}`),
  updateAbroadGoal: (goalId: string, body: any) => request(`/abroad-goals/${goalId}`, { method: 'PUT', body: JSON.stringify(body) }),
  getDestinations: () => request('/abroad-goals/destinations/list/all'),
  addRequirement: (body: any) => request('/abroad-goals/requirements/add', { method: 'POST', body: JSON.stringify(body) }),
  completeRequirement: (reqId: string) => request(`/abroad-goals/requirements/${reqId}/complete`, { method: 'PUT' }),
  addDocument: (body: any) => request('/abroad-goals/documents/add', { method: 'POST', body: JSON.stringify(body) }),
  getDocuments: (goalId: string) => request(`/abroad-goals/documents/${goalId}`),
  updateDocumentStatus: (docId: string, status: string) => request(`/abroad-goals/documents/${docId}/status`, { method: 'PUT', body: JSON.stringify({ status }) }),
  addSkillToGoal: (body: any) => request('/abroad-goals/skills/add', { method: 'POST', body: JSON.stringify(body) }),
  getGoalSkills: (goalId: string) => request(`/abroad-goals/skills/${goalId}`),
  updateSkillProgress: (skillId: string, body: any) => request(`/abroad-goals/skills/${skillId}/progress`, { method: 'PUT', body: JSON.stringify(body) }),
  addTimeline: (body: any) => request('/abroad-goals/timeline/add', { method: 'POST', body: JSON.stringify(body) }),
  getTimeline: (goalId: string) => request(`/abroad-goals/timeline/${goalId}`),
  completeTimeline: (timelineId: string) => request(`/abroad-goals/timeline/${timelineId}/complete`, { method: 'PUT' }),
  addExpense: (body: any) => request('/abroad-goals/expenses/add', { method: 'POST', body: JSON.stringify(body) }),
  getExpenses: (goalId: string) => request(`/abroad-goals/expenses/${goalId}`),
  addMentorNote: (body: any) => request('/abroad-goals/mentor-notes/add', { method: 'POST', body: JSON.stringify(body) }),
  getMentorNotes: (goalId: string) => request(`/abroad-goals/mentor-notes/${goalId}`),
  getAbroadAnalytics: (goalId: string) => request(`/abroad-goals/analytics/${goalId}`),
  // Abroad Goals - Advanced Methods
  createAbroadRequirement: (goalId: string, body: any) => request(`/abroad-goals/requirements/add`, { method: 'POST', body: JSON.stringify({ goalId, ...body }) }),
  updateAbroadRequirement: (reqId: string, status: string) => request(`/abroad-goals/requirements/${reqId}/complete`, { method: 'PUT', body: JSON.stringify({ status }) }),
  createAbroadDocument: (goalId: string, body: any) => request(`/abroad-goals/documents/add`, { method: 'POST', body: JSON.stringify({ goalId, ...body }) }),
  updateAbroadDocumentStatus: (docId: string, status: string) => request(`/abroad-goals/documents/${docId}/status`, { method: 'PUT', body: JSON.stringify({ status }) }),
  createAbroadSkill: (goalId: string, body: any) => request(`/abroad-goals/skills/add`, { method: 'POST', body: JSON.stringify({ goalId, ...body }) }),
  updateAbroadSkillProgress: (skillId: string, progressLevel: number) => request(`/abroad-goals/skills/${skillId}/progress`, { method: 'PUT', body: JSON.stringify({ progressLevel }) }),
  createAbroadMilestone: (goalId: string, body: any) => request(`/abroad-goals/timeline/add`, { method: 'POST', body: JSON.stringify({ goalId, ...body }) }),
  completeMilestone: (milestoneId: string) => request(`/abroad-goals/timeline/${milestoneId}/complete`, { method: 'PUT' }),
  createAbroadExpense: (goalId: string, body: any) => request(`/abroad-goals/expenses/add`, { method: 'POST', body: JSON.stringify({ goalId, ...body }) }),
  createAbroadNote: (goalId: string, body: any) => request(`/abroad-goals/mentor-notes/add`, { method: 'POST', body: JSON.stringify({ goalId, ...body }) }),

  // AI Recommendations
  getGoalRecommendations: (userProfile: any) => request('/ai/goal-recommendations', { method: 'POST', body: JSON.stringify(userProfile) }),
  getJournalInsights: (entries: any[]) => request('/ai/journal-insights', { method: 'POST', body: JSON.stringify({ entries }) }),
  getHabitSuggestions: (currentHabits: any[]) => request('/ai/habit-suggestions', { method: 'POST', body: JSON.stringify({ currentHabits }) }),
  getLearningPath: (goal: string, currentSkills: string[]) => request('/ai/learning-path', { method: 'POST', body: JSON.stringify({ goal, currentSkills }) }),
  analyzeSkillGaps: (currentSkills: string[], targetRole: string) => request('/ai/skill-gaps', { method: 'POST', body: JSON.stringify({ currentSkills, targetRole }) }),
  getMotivationalInsights: (userProgress: any) => request('/ai/motivation', { method: 'POST', body: JSON.stringify(userProgress) }),
};

export { getApiUrl, api };
