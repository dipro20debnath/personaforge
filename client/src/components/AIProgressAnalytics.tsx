'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, Activity, Brain, Award, Target, Zap } from 'lucide-react';

interface AnalyticsCard {
  title: string;
  value: string | number;
  change: string;
  icon: any;
  color: string;
  insight: string;
}

export function AIProgressAnalytics() {
  const [analytics, setAnalytics] = useState<AnalyticsCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [weeklyTrend, setWeeklyTrend] = useState<number[]>([]);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    // Simulated analytics data
    const mockAnalytics: AnalyticsCard[] = [
      {
        title: 'Overall Health Score',
        value: '78%',
        change: '+12% from last month',
        icon: Activity,
        color: 'from-green-500 to-emerald-500',
        insight: 'Your consistent habit tracking is paying off! Keep it up.'
      },
      {
        title: 'Habit Consistency',
        value: '86%',
        change: '+5% this week',
        icon: Target,
        color: 'from-blue-500 to-cyan-500',
        insight: 'You\'re in the top 15% of users for consistency!'
      },
      {
        title: 'Goal Progress',
        value: '62%',
        change: '4 of 6 active',
        icon: Award,
        color: 'from-purple-500 to-violet-500',
        insight: 'Perfect time to focus on your remaining 2 goals.'
      },
      {
        title: 'Learning Velocity',
        value: '24 hrs',
        change: '+8 hrs this month',
        icon: Brain,
        color: 'from-orange-500 to-amber-500',
        insight: 'You\'re investing significantly in your growth!'
      },
      {
        title: 'Skill Growth',
        value: '5 skills',
        change: '2 new this month',
        icon: Zap,
        color: 'from-pink-500 to-rose-500',
        insight: 'Diversifying skills is a smart move for career growth.'
      },
      {
        title: 'Productivity Index',
        value: '8.2/10',
        change: '+1.5 from last week',
        icon: TrendingUp,
        color: 'from-indigo-500 to-blue-500',
        insight: 'You\'re hitting a productivity streak! Capitalize on it.'
      }
    ];

    setAnalytics(mockAnalytics);

    // Weekly trend data (percentage engagement)
    const mockTrend = [65, 72, 68, 75, 82, 78, 85];
    setWeeklyTrend(mockTrend);

    setLoading(false);
  };

  if (loading) {
    return <div className="text-center py-8">Loading analytics...</div>;
  }

  const maxTrend = Math.max(...weeklyTrend);
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div className="space-y-8">
      {/* Weekly Trend Chart */}
      <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 rounded-3xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <Activity className="text-purple-600 dark:text-purple-400" size={28} />
              This Week's Activity
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">Your daily engagement level</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
              {(weeklyTrend.reduce((a, b) => a + b) / weeklyTrend.length).toFixed(0)}%
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Weekly Average</p>
          </div>
        </div>

        {/* Chart Bars */}
        <div className="flex items-end justify-between h-48 gap-3 mb-8 bg-gradient-to-b from-purple-50/50 to-transparent dark:from-purple-900/10 dark:to-transparent p-6 rounded-2xl">
          {weeklyTrend.map((value, idx) => (
            <div
              key={idx}
              className="flex-1 flex flex-col items-center group"
            >
              <div className="w-full flex flex-col items-center">
                {/* Tooltip */}
                <div className="mb-2 opacity-0 group-hover:opacity-100 transition-all duration-200 transform group-hover:scale-110">
                  <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs font-bold px-3 py-2 rounded-lg whitespace-nowrap shadow-lg">
                    {value}%
                  </div>
                </div>

                {/* Bar */}
                <div className="w-full relative group cursor-pointer">
                  <div
                    className="w-full bg-gradient-to-t from-purple-600 via-purple-400 to-blue-400 dark:from-purple-500 dark:via-purple-400 dark:to-blue-400 rounded-t-xl transition-all duration-300 group-hover:shadow-xl group-hover:scale-105 origin-bottom"
                    style={{ height: `${(value / maxTrend) * 160}px`, maxHeight: '160px' }}
                  ></div>
                </div>
              </div>
              
              {/* Day Label */}
              <div className="mt-4 flex flex-col items-center">
                <p className="text-sm font-bold text-gray-900 dark:text-white">{days[idx]}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{value}%</p>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
            <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Average</p>
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400 mt-2">
              {(weeklyTrend.reduce((a, b) => a + b) / weeklyTrend.length).toFixed(0)}%
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">Daily average</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
            <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Peak</p>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-2">
              {Math.max(...weeklyTrend)}%
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">Best day</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
            <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Trend</p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-2">
              ↗ +20%
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">Improvement</p>
          </div>
        </div>
      </div>

      {/* Analytics Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {analytics.map((card, idx) => (
          <div
            key={idx}
            className="group bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1"
          >
            {/* Top Accent */}
            <div className={`h-1 bg-gradient-to-r ${card.color}`}></div>

            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="text-sm font-bold text-gray-600 dark:text-gray-400 mb-1">
                    {card.title}
                  </h4>
                  <p className="text-3xl font-black text-gray-900 dark:text-white">
                    {card.value}
                  </p>
                </div>
                <div className={`p-3 bg-gradient-to-br ${card.color} rounded-lg text-white`}>
                  {<card.icon size={24} />}
                </div>
              </div>

              {/* Change */}
              <p className="text-xs text-green-600 dark:text-green-400 font-bold mb-3">
                {card.change}
              </p>

              {/* AI Insight */}
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 p-3 rounded-lg">
                <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
                  <span className="font-bold">💡 AI Insight:</span> {card.insight}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 rounded-2xl p-8 text-white shadow-2xl">
        <h3 className="text-2xl font-bold mb-3">🎯 Your Performance Summary</h3>
        <p className="text-lg opacity-90 mb-6">
          You're making exceptional progress! Based on your metrics, you're 23% more active than your baseline. At this rate, you'll achieve all your major goals by Q2.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            ['Rank', 'Top 12% 🏆'],
            ['Streak', '14 days 🔥'],
            ['Momentum', 'High ↗'],
            ['Next Level', '4 days away 🚀']
          ].map((item, idx) => (
            <div key={idx} className="bg-white/10 backdrop-blur rounded-lg p-3 text-center">
              <p className="text-xs opacity-80 font-bold">{item[0]}</p>
              <p className="text-lg font-black mt-1">{item[1]}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
