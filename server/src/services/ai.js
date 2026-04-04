import fetch from 'node-fetch';

const AI_API_KEY = process.env.AI_API_KEY || 'sk-demo-key';
const AI_API_URL = process.env.AI_API_URL || 'https://api.openai.com/v1';
const AI_MODEL = process.env.AI_MODEL || 'gpt-4-turbo-preview';

// Helper function to call OpenAI API
async function callAI(messages) {
  if (AI_API_KEY === 'sk-demo-key') {
    return null; // Use demo mode
  }

  try {
    const response = await fetch(`${AI_API_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AI_API_KEY}`,
      },
      body: JSON.stringify({
        model: AI_MODEL,
        messages,
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      throw new Error(`AI API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('AI API call failed:', error);
    return null;
  }
}

// Generate personalized goal recommendations
export async function generateGoalRecommendations(userProfile) {
  const messages = [
    {
      role: 'system',
      content: 'You are a personal development coach. Generate SMART goals based on user profile. Return a JSON array with 3-5 goals.',
    },
    {
      role: 'user',
      content: `Based on this profile, suggest goals: ${JSON.stringify(userProfile)}. Return JSON array with fields: title, description, category, timeframe.`,
    },
  ];

  const result = await callAI(messages);
  
  if (result) {
    try {
      return JSON.parse(result);
    } catch {
      return generateGoalRecommendationsDemo(userProfile);
    }
  }

  return generateGoalRecommendationsDemo(userProfile);
}

function generateGoalRecommendationsDemo(userProfile) {
  const categories = ['Career', 'Health', 'Learning', 'Personal', 'Financial'];
  return [
    {
      title: 'Complete Online Certification',
      description: 'Earn a professional certification in your field to boost career prospects',
      category: 'Career',
      timeframe: '3 months',
      priority: 'High',
    },
    {
      title: 'Build Regular Exercise Habit',
      description: 'Exercise 4 times per week for better health and energy levels',
      category: 'Health',
      timeframe: '1 month',
      priority: 'High',
    },
    {
      title: 'Read 12 Books',
      description: 'Read one book per month to expand knowledge and improve focus',
      category: 'Learning',
      timeframe: '12 months',
      priority: 'Medium',
    },
    {
      title: 'Save Emergency Fund',
      description: 'Build an emergency fund with 6 months of expenses',
      category: 'Financial',
      timeframe: '6 months',
      priority: 'High',
    },
  ];
}

// Analyze journal entries for insights
export async function analyzeJournalInsights(entries) {
  const entriesText = entries.map(e => e.content).join('\n\n');
  
  const messages = [
    {
      role: 'system',
      content: 'You are an empathetic journal analyst. Analyze the journal entries and provide emotional insights, themes, and suggestions. Return JSON with: emotionalTone, themes (array), insights (array of suggestions).',
    },
    {
      role: 'user',
      content: `Analyze these recent journal entries:\n\n${entriesText}\n\nProvide analysis in JSON format.`,
    },
  ];

  const result = await callAI(messages);
  
  if (result) {
    try {
      return JSON.parse(result);
    } catch {
      return analyzeJournalInsightsDemo(entries);
    }
  }

  return analyzeJournalInsightsDemo(entries);
}

function analyzeJournalInsightsDemo(entries) {
  return {
    emotionalTone: 'Positive with occasional stress',
    themes: ['Work-life balance', 'Personal growth', 'Relationships', 'Health awareness'],
    insights: [
      'You show strong motivation for personal development',
      'Consider dedicating more time to relaxation and self-care',
      'Your recent accomplishments deserve celebration',
      'Focus on consistency in your daily habits',
    ],
    sentiment: 'Optimistic',
    wellnessScore: 7.5,
  };
}

// Generate habit suggestions
export async function generateHabitSuggestions(currentHabits) {
  const habitsText = currentHabits.map(h => `${h.name} (${h.frequency})`).join(', ');
  
  const messages = [
    {
      role: 'system',
      content: 'You are a habit formation expert. Suggest new habits or improvements. Return JSON with array of suggestions, each with: habit, description, frequency, difficulty, expectedBenefits (array).',
    },
    {
      role: 'user',
      content: `Current habits: ${habitsText}\n\nSuggest 3-4 new or improved habits that would complement these.`,
    },
  ];

  const result = await callAI(messages);
  
  if (result) {
    try {
      return JSON.parse(result);
    } catch {
      return generateHabitSuggestionsDemo();
    }
  }

  return generateHabitSuggestionsDemo();
}

function generateHabitSuggestionsDemo() {
  return [
    {
      habit: 'Morning Meditation',
      description: '10-15 minute meditation to start your day with clarity and focus',
      frequency: 'Daily',
      difficulty: 'Medium',
      expectedBenefits: ['Stress reduction', 'Better focus', 'Emotional clarity'],
      implementation: 'Use a meditation app, start with 5 minutes',
    },
    {
      habit: 'Weekly Reflection',
      description: 'Review your week and plan for the next one',
      frequency: 'Weekly (Sunday evening)',
      difficulty: 'Easy',
      expectedBenefits: ['Better planning', 'Progress tracking', 'Goal alignment'],
      implementation: 'Dedicate 30 minutes every Sunday',
    },
    {
      habit: 'Hydration Reminder',
      description: 'Drink 8 glasses of water throughout the day',
      frequency: 'Daily',
      difficulty: 'Easy',
      expectedBenefits: ['Better health', 'Increased energy', 'Improved focus'],
      implementation: 'Set phone reminders every 2 hours',
    },
  ];
}

// Generate personalized learning path
export async function generateLearningPath(learningGoal, currentSkills) {
  const messages = [
    {
      role: 'system',
      content: 'You are a learning path architect. Create a detailed learning plan. Return JSON with: title, duration, milestones (array with month and description), resources (array), timeline.',
    },
    {
      role: 'user',
      content: `Create a learning path for: "${learningGoal}". Current skills: ${currentSkills.join(', ')}. Structure as a 6-month plan with monthly milestones.`,
    },
  ];

  const result = await callAI(messages);
  
  if (result) {
    try {
      return JSON.parse(result);
    } catch {
      return generateLearningPathDemo(learningGoal);
    }
  }

  return generateLearningPathDemo(learningGoal);
}

function generateLearningPathDemo(goal) {
  return {
    title: `Mastering ${goal}`,
    duration: '6 months',
    totalHours: 120,
    difficulty: 'Intermediate',
    milestones: [
      { month: 1, title: 'Foundations', description: 'Learn core concepts and theory' },
      { month: 2, title: 'Basics Mastery', description: 'Practice fundamental techniques' },
      { month: 3, title: 'Real-world Projects', description: 'Apply learning to actual projects' },
      { month: 4, title: 'Advanced Topics', description: 'Explore advanced concepts' },
      { month: 5, title: 'Specialization', description: 'Focus on specific areas of interest' },
      { month: 6, title: 'Mastery & Teaching', description: 'Share knowledge with others' },
    ],
    resources: [
      { type: 'Course', title: 'Online Courses', count: 3 },
      { type: 'Books', title: 'Recommended Reading', count: 5 },
      { type: 'Projects', title: 'Hands-on Practice', count: 8 },
      { type: 'Community', title: 'Learning Groups', description: 'Join like-minded learners' },
    ],
    estimatedHoursPerWeek: 5,
  };
}

// Analyze skill gaps for career transition
export async function analyzeSkillGaps(currentSkills, targetRole) {
  const skillsText = currentSkills.join(', ');
  
  const messages = [
    {
      role: 'system',
      content: 'You are a career transition coach. Analyze skill gaps and create an action plan. Return JSON with: gapAnalysis (array), recommendations (array), timeline, actionPlan.',
    },
    {
      role: 'user',
      content: `Current skills: ${skillsText}\n\nTarget role: ${targetRole}\n\nWhat skills are missing and how to acquire them?`,
    },
  ];

  const result = await callAI(messages);
  
  if (result) {
    try {
      return JSON.parse(result);
    } catch {
      return analyzeSkillGapsDemo(targetRole);
    }
  }

  return analyzeSkillGapsDemo(targetRole);
}

function analyzeSkillGapsDemo(targetRole) {
  return {
    targetRole,
    currentLevel: 'Intermediate',
    targetLevel: 'Advanced',
    gapAnalysis: [
      { skill: 'Advanced Technical Skills', priority: 'High', timeToLearn: '3 months' },
      { skill: 'Leadership', priority: 'High', timeToLearn: '6 months' },
      { skill: 'Project Management', priority: 'Medium', timeToLearn: '2 months' },
    ],
    recommendations: [
      'Complete advanced certifications',
      'Seek mentorship in target role',
      'Take on leadership projects',
      'Build portfolio in target domain',
    ],
    timeline: '6-12 months',
    resources: [
      'Professional development courses',
      'Networking events',
      'Online certifications',
      'Mentorship programs',
    ],
  };
}

// Generate motivational insights
export async function generateMotivationalInsights(userProgress) {
  const messages = [
    {
      role: 'system',
      content: 'You are an encouraging personal development coach. Generate motivational insights based on progress. Return JSON with: achievements, encouragement, nextSteps, motivationalTips (array).',
    },
    {
      role: 'user',
      content: `Based on this progress: ${JSON.stringify(userProgress)}, provide encouragement and next steps to maintain momentum.`,
    },
  ];

  const result = await callAI(messages);
  
  if (result) {
    try {
      return JSON.parse(result);
    } catch {
      return generateMotivationalInsightsDemo(userProgress);
    }
  }

  return generateMotivationalInsightsDemo(userProgress);
}

function generateMotivationalInsightsDemo(progress) {
  return {
    mainMessage: '🌟 You\'re doing amazing! Keep up the momentum!',
    achievements: [
      'Maintained consistency in your goals',
      'Completed multiple milestones',
      'Showing continuous improvement',
      'Building strong habits',
    ],
    encouragement: 'Every step forward counts. Your dedication shows real commitment to personal growth. Remember, progress over perfection!',
    nextSteps: [
      'Celebrate your wins so far',
      'Set new, slightly more challenging goals',
      'Share your journey with others',
      'Keep the habits that work for you',
    ],
    motivationalTips: [
      'Focus on progress, not perfection',
      'Small consistent actions beat big sporadic efforts',
      'Setbacks are setups for comebacks',
      'Your future self will thank you today\'s effort',
      'Community and accountability boost success',
    ],
    nextMilestone: 'Keep going! Your next achievement is 3 steps away',
  };
}

export default {
  generateGoalRecommendations,
  analyzeJournalInsights,
  generateHabitSuggestions,
  generateLearningPath,
  analyzeSkillGaps,
  generateMotivationalInsights,
};
