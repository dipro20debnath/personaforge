'use client';

import { useState } from 'react';
import { api } from '@/lib/api';
import { Sparkles, Target, TrendingUp, Lightbulb, Brain, BarChart3 } from 'lucide-react';

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
  const [activeTab, setActiveTab] = useState<'goals' | 'habits' | 'motivation'>('goals');
  const [goalsData, setGoalsData] = useState<any>(null);
  const [habitsData, setHabitsData] = useState<any>(null);
  const [motivationData, setMotivationData] = useState<any>(null);
  const [goalsLoading, setGoalsLoading] = useState(false);
  const [habitsLoading, setHabitsLoading] = useState(false);
  const [motivationLoading, setMotivationLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetGoals = async () => {
    setGoalsLoading(true);
    setError(null);
    try {
      const result = await api.getGoalRecommendations(userProfile || {});
      setGoalsData(result);
    } catch (err) {
      setError(`Error getting goals: ${err instanceof Error ? err.message : 'Unknown error'}`);
      console.error('Goals error:', err);
    } finally {
      setGoalsLoading(false);
    }
  };

  const handleGetHabits = async () => {
    setHabitsLoading(true);
    setError(null);
    try {
      const result = await api.getHabitSuggestions(currentHabits || []);
      setHabitsData(result);
    } catch (err) {
      setError(`Error getting habits: ${err instanceof Error ? err.message : 'Unknown error'}`);
      console.error('Habits error:', err);
    } finally {
      setHabitsLoading(false);
    }
  };

  const handleGetMotivation = async () => {
    setMotivationLoading(true);
    setError(null);
    try {
      const result = await api.getMotivationalInsights(userProgress || {});
      setMotivationData(result);
    } catch (err) {
      setError(`Error getting motivation: ${err instanceof Error ? err.message : 'Unknown error'}`);
      console.error('Motivation error:', err);
    } finally {
      setMotivationLoading(false);
    }
  };

  return (
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
