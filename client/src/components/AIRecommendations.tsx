'use client';

import { useState, useEffect } from 'react';
import { getApiUrl } from '@/lib/api';

interface Recommendation {
  id: string;
  type: string;
  category: string;
  title: string;
  description: string;
  recommendation: string;
  reason: string;
  skill_name?: string;
  goal_title?: string;
  learning_path_title?: string;
}

interface AIRecommendationsProps {
  userProfile?: any;
  currentHabits?: any[];
  userProgress?: any;
}

export function AIRecommendations({
  userProfile,
  currentHabits = [],
  userProgress,
}: AIRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    try {
      const token = localStorage.getItem('pf_token');
      const apiUrl = getApiUrl();
      const response = await fetch(`${apiUrl}/api/recommendations`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const result = await response.json();
        setRecommendations(result.data);
      }
    } catch (error) {
      console.error('Failed to fetch recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPersonalityRecommendations = async () => {
    try {
      const token = localStorage.getItem('pf_token');
      const apiUrl = getApiUrl();
      const response = await fetch(`${apiUrl}/api/recommendations/personality`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const result = await response.json();
        setRecommendations(result.data);
      }
    } catch (error) {
      console.error('Failed to fetch personality recommendations:', error);
    }
  };

  const fetchSkillGaps = async () => {
    try {
      const token = localStorage.getItem('pf_token');
      const apiUrl = getApiUrl();
      const response = await fetch(`${apiUrl}/api/recommendations/skills/gaps`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const result = await response.json();
        setRecommendations(result.data);
      }
    } catch (error) {
      console.error('Failed to fetch skill gaps:', error);
    }
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      personality: '🧠',
      skill: '🎯',
      goal: '🎪',
      learning: '📚',
      wellness: '💪',
      growth: '🌱',
      skill_gap: '📈',
      general: '✨',
    };
    return icons[category] || '💡';
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      personality: 'bg-blue-100 text-blue-800',
      skill_gap: 'bg-orange-100 text-orange-800',
      skill: 'bg-green-100 text-green-800',
      goal: 'bg-purple-100 text-purple-800',
      learning: 'bg-indigo-100 text-indigo-800',
      wellness: 'bg-red-100 text-red-800',
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const filteredRecommendations =
    activeCategory === 'all' ? recommendations : recommendations.filter((r) => r.category === activeCategory);

  const categories = ['all', ...new Set(recommendations.map((r) => r.category))];

  if (loading) {
    return <div className="text-center py-12">Loading AI recommendations...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header with Action Buttons */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-lg shadow-lg p-6 text-white">
        <h2 className="text-3xl font-bold mb-2">🤖 AI-Powered Recommendations</h2>
        <p className="text-indigo-100 mb-4">Personalized insights based on your personality, skills, and goals</p>

        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={fetchPersonalityRecommendations}
            className="bg-white text-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-50 font-semibold text-sm"
          >
            🧠 Personality Insights
          </button>
          <button
            onClick={fetchSkillGaps}
            className="bg-white text-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-50 font-semibold text-sm"
          >
            📈 Skill Gaps
          </button>
          <button
            onClick={fetchRecommendations}
            className="bg-white text-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-50 font-semibold text-sm"
          >
            🔄 All Recommendations
          </button>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
              activeCategory === cat
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {getCategoryIcon(cat === 'all' ? 'general' : cat)} {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {/* Recommendations Grid */}
      {filteredRecommendations.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600 text-lg">
            No recommendations available yet. Complete your assessment to get personalized recommendations!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredRecommendations.map((rec) => (
            <div
              key={rec.id}
              className="bg-white border-2 border-gray-200 rounded-lg p-6 hover:shadow-lg transition"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    <span className="text-2xl">{getCategoryIcon(rec.category)}</span>
                    {rec.title}
                  </h3>
                  <p className="text-xs text-gray-600 mt-1">{rec.description}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${getTypeColor(rec.type)}`}>
                  {rec.type.replace('_', ' ')}
                </span>
              </div>

              {/* Main Recommendation */}
              <div className="bg-blue-50 border-l-4 border-blue-500 rounded p-3 mb-3">
                <p className="text-sm font-semibold text-blue-900 mb-1">💡 Recommendation:</p>
                <p className="text-sm text-blue-800">{rec.recommendation}</p>
              </div>

              {/* Why This Recommendation */}
              <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded mb-3">
                <span className="font-semibold">Why:</span> {rec.reason}
              </div>

              {/* Related Items */}
              {(rec.skill_name || rec.goal_title || rec.learning_path_title) && (
                <div className="text-xs text-gray-700">
                  {rec.skill_name && <p>📌 Skill: <span className="font-semibold">{rec.skill_name}</span></p>}
                  {rec.goal_title && <p>🎯 Goal: <span className="font-semibold">{rec.goal_title}</span></p>}
                  {rec.learning_path_title && <p>📚 Learning Path: <span className="font-semibold">{rec.learning_path_title}</span></p>}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2 mt-4">
                <button className="flex-1 bg-indigo-600 text-white text-xs py-2 px-3 rounded hover:bg-indigo-700 font-semibold">
                  ✅ Start Action
                </button>
                <button className="flex-1 bg-gray-200 text-gray-700 text-xs py-2 px-3 rounded hover:bg-gray-300 font-semibold">
                  💾 Save
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* No Assessment Notice */}
      {recommendations.length === 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-800">
            <span className="font-semibold">📋 Next Step:</span> Complete your personality assessment to unlock personalized AI recommendations!
          </p>
        </div>
      )}
    </div>
  );
}

    <div className="card-hover space-y-0 overflow-hidden" style={{ animation: 'slideInUp 0.6s ease-out 200ms both' }}>
      {/* Premium Header */}
      <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-500/5 dark:to-purple-500/5 p-6 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl text-white shadow-lg">
              <Sparkles size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold gradient-text">AI-Powered Insights</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">Personalized recommendations for your growth</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-amber-100 dark:bg-amber-900/30 rounded-full">
            <Sparkles size={16} className="text-amber-600 dark:text-amber-400" />
            <span className="text-xs font-semibold text-amber-700 dark:text-amber-300">Powered by AI</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="mx-6 mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-300 dark:border-red-800 text-red-700 dark:text-red-300 rounded-lg text-sm animate-slideInDown">
          <p className="font-semibold">Error</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      )}

      {/* Tabs */}
      <div className="px-6 pt-6">
        <div className="flex gap-2 border-b border-slate-200 dark:border-slate-800">
          {[
            { id: 'goals', label: '🎯 Goal Recommendations', icon: Target },
            { id: 'habits', label: '💪 Habit Suggestions', icon: TrendingUp },
            { id: 'motivation', label: '✨ Motivation', icon: Lightbulb },
          ].map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              className={`px-4 py-3 text-sm font-semibold border-b-2 transition-all duration-200 ${
                activeTab === id
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4" style={{ animation: 'fadeIn 0.3s ease-out' }}>
        {/* Goal Recommendations */}
        {activeTab === 'goals' && (
          <div className="space-y-4 animate-fadeIn">
            <button
              onClick={handleGetGoals}
              disabled={goalsLoading}
              className="btn btn-primary w-full group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
              <span className="relative">
                {goalsLoading ? (
                  <>
                    <span className="inline-block animate-spin mr-2">⏳</span>
                    Generating Goals...
                  </>
                ) : (
                  <>
                    <span className="mr-2">🎯</span>
                    Get Goal Recommendations
                  </>
                )}
              </span>
            </button>

            {goalsData?.recommendations && (
              <div className="space-y-3 mt-6">
                {goalsData.recommendations.map((goal: any, idx: number) => (
                  <div 
                    key={idx} 
                    className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 rounded-xl border border-blue-200 dark:border-blue-800 hover:shadow-lg transition-all group cursor-pointer"
                    style={{ animation: `slideInUp 0.3s ease-out ${idx * 50}ms both` }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-blue-900 dark:text-blue-300 group-hover:text-blue-700 dark:group-hover:text-blue-200 transition-colors">{goal.title}</h3>
                        <p className="text-sm text-blue-700 dark:text-blue-400 mt-1">{goal.description}</p>
                        <div className="flex gap-2 mt-3 flex-wrap">
                          <span className="badge badge-blue text-xs">{goal.category}</span>
                          <span className="badge badge-blue text-xs">⏱️ {goal.timeframe}</span>
                          {goal.priority && <span className="badge badge-orange text-xs">📌 {goal.priority}</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Habit Suggestions */}
        {activeTab === 'habits' && (
          <div className="space-y-4 animate-fadeIn">
            <button
              onClick={handleGetHabits}
              disabled={habitsLoading}
              className="btn btn-success w-full group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
              <span className="relative">
                {habitsLoading ? (
                  <>
                    <span className="inline-block animate-spin mr-2">⏳</span>
                    Generating Habits...
                  </>
                ) : (
                  <>
                    <span className="mr-2">💪</span>
                    Get Habit Suggestions
                  </>
                )}
              </span>
            </button>

            {habitsData?.suggestions && (
              <div className="space-y-3 mt-6">
                {habitsData.suggestions.map((habit: any, idx: number) => (
                  <div 
                    key={idx} 
                    className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 rounded-xl border border-green-200 dark:border-green-800 hover:shadow-lg transition-all group cursor-pointer"
                    style={{ animation: `slideInUp 0.3s ease-out ${idx * 50}ms both` }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-green-900 dark:text-green-300 group-hover:text-green-700 dark:group-hover:text-green-200 transition-colors">{habit.habit}</h3>
                        <p className="text-sm text-green-700 dark:text-green-400 mt-1">{habit.description}</p>
                        <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                          <div className="p-2 bg-white/50 dark:bg-black/20 rounded">
                            <span className="text-gray-600 dark:text-gray-400">📅 Frequency</span>
                            <p className="font-semibold text-green-900 dark:text-green-300">{habit.frequency}</p>
                          </div>
                          <div className="p-2 bg-white/50 dark:bg-black/20 rounded">
                            <span className="text-gray-600 dark:text-gray-400">⚡ Difficulty</span>
                            <p className="font-semibold text-green-900 dark:text-green-300">{habit.difficulty}</p>
                          </div>
                        </div>
                        {habit.expectedBenefits && (
                          <div className="mt-3 p-2 bg-white/50 dark:bg-black/20 rounded">
                            <span className="text-xs text-gray-600 dark:text-gray-400">🌟 Benefits: </span>
                            <p className="text-xs font-semibold text-green-900 dark:text-green-300">{habit.expectedBenefits.join(', ')}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Motivation */}
        {activeTab === 'motivation' && (
          <div className="space-y-4 animate-fadeIn">
            <button
              onClick={handleGetMotivation}
              disabled={motivationLoading}
              className="btn btn-primary w-full group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
              <span className="relative">
                {motivationLoading ? (
                  <>
                    <span className="inline-block animate-spin mr-2">⏳</span>
                    Generating Motivation...
                  </>
                ) : (
                  <>
                    <span className="mr-2">✨</span>
                    Get Motivation
                  </>
                )}
              </span>
            </button>

            {motivationData?.insights && (
              <div 
                className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 rounded-xl border border-purple-200 dark:border-purple-800"
                style={{ animation: 'slideInUp 0.3s ease-out both' }}
              >
                <div className="space-y-6">
                  {/* Main Message */}
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-purple-900 dark:text-purple-300">
                      {motivationData.insights.mainMessage}
                    </h3>
                    <p className="text-sm text-purple-700 dark:text-purple-400">
                      {motivationData.insights.encouragement}
                    </p>
                  </div>

                  {/* Achievements */}
                  {motivationData.insights.achievements?.length > 0 && (
                    <div className="pt-4 border-t border-purple-200 dark:border-purple-800">
                      <h4 className="font-semibold text-purple-900 dark:text-purple-300 mb-3">🏆 Your Achievements:</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {motivationData.insights.achievements.map((achievement: string, idx: number) => (
                          <div key={idx} className="flex items-start gap-2 p-2 bg-white/50 dark:bg-black/20 rounded">
                            <span className="text-green-500 flex-shrink-0">✓</span>
                            <span className="text-sm text-purple-800 dark:text-purple-300">{achievement}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Tips */}
                  {motivationData.insights.motivationalTips?.length > 0 && (
                    <div className="pt-4 border-t border-purple-200 dark:border-purple-800">
                      <h4 className="font-semibold text-purple-900 dark:text-purple-300 mb-3">💡 Tips for Success:</h4>
                      <ul className="space-y-2">
                        {motivationData.insights.motivationalTips.map((tip: string, idx: number) => (
                          <li key={idx} className="flex items-start gap-2 p-2 bg-white/50 dark:bg-black/20 rounded text-sm text-purple-800 dark:text-purple-300">
                            <span className="text-yellow-500 flex-shrink-0 font-bold">→</span>
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
