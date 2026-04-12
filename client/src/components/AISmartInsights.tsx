'use client';

import { useState, useEffect } from 'react';
import { getApiUrl } from '@/lib/api';
import { CheckCircle, AlertCircle, TrendingUp, Calendar, Zap, Award } from 'lucide-react';

interface SmartInsight {
  type: 'achievement' | 'warning' | 'opportunity' | 'milestone';
  title: string;
  description: string;
  action?: string;
  icon: any;
  color: string;
}

export function AISmartInsights() {
  const [insights, setInsights] = useState<SmartInsight[]>([]);
  const [loading, setLoading] = useState(true);
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchSmartInsights();
  }, []);

  const fetchSmartInsights = async () => {
    try {
      const token = localStorage.getItem('pf_token');
      const apiUrl = getApiUrl();

      // Mock insights - in production, these would come from AI analysis
      const mockInsights: SmartInsight[] = [
        {
          type: 'achievement',
          title: '🎉 7-Day Streak!',
          description: 'You\'ve been consistent with your habits for a whole week! This is the best time to add a new habit.',
          action: 'Add New Habit',
          icon: CheckCircle,
          color: 'from-green-500 to-emerald-500'
        },
        {
          type: 'opportunity',
          title: '💡 Skill Gap Opportunity',
          description: 'Your goal mentions "Leadership" but no leadership skills are tracked. Consider adding related skills.',
          action: 'Add Skills',
          icon: Zap,
          color: 'from-yellow-500 to-orange-500'
        },
        {
          type: 'milestone',
          title: '🎯 Next Goal Milestone',
          description: 'You\'re 67% toward your next goal! Complete this week\'s tasks to hit the milestone.',
          action: 'View Goal',
          icon: TrendingUp,
          color: 'from-blue-500 to-cyan-500'
        },
        {
          type: 'warning',
          title: '⚠️ Low Activity This Week',
          description: 'Your goal tracking is down 30% compared to last week. Let\'s get back on track!',
          action: 'Log Activity',
          icon: AlertCircle,
          color: 'from-red-500 to-rose-500'
        }
      ];

      setInsights(mockInsights);
    } catch (error) {
      console.error('Failed to fetch smart insights:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDismiss = (index: number) => {
    const newDismissed = new Set(dismissedIds);
    newDismissed.add(index.toString());
    setDismissedIds(newDismissed);
  };

  const visibleInsights = insights.filter((_, idx) => !dismissedIds.has(idx.toString()));

  if (loading) {
    return <div className="text-center py-8">Loading insights...</div>;
  }

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-bold flex items-center gap-2">
        <Award size={24} className="text-purple-600" />
        Smart Insights
      </h3>
      {visibleInsights.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>Great job! No new insights right now.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {visibleInsights.map((insight, idx) => (
            <div
              key={idx}
              className={`bg-gradient-to-r ${insight.color} rounded-xl p-4 text-white shadow-lg hover:shadow-xl transition-all relative overflow-hidden group`}
            >
              {/* Background animation */}
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="relative flex items-start justify-between">
                <div className="flex gap-3 flex-1">
                  <div className="mt-1">
                    {<insight.icon size={20} />}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-sm mb-1">{insight.title}</h4>
                    <p className="text-xs opacity-90">{insight.description}</p>
                    {insight.action && (
                      <button className="mt-2 text-xs bg-white/30 hover:bg-white/50 px-3 py-1 rounded-lg font-bold transition-colors">
                        {insight.action} →
                      </button>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => handleDismiss(idx)}
                  className="ml-2 text-white/70 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
