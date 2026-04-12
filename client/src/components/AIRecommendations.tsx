'use client';

import { useState, useEffect } from 'react';
import { getApiUrl } from '@/lib/api';
import { Sparkles, Brain, TrendingUp, BookOpen, Zap, Target } from 'lucide-react';

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
    const icons: Record<string, React.ReactNode> = {
      personality: <Brain size={18} />,
      skill: <Zap size={18} />,
      goal: <Target size={18} />,
      learning: <BookOpen size={18} />,
      wellness: <Sparkles size={18} />,
      growth: <TrendingUp size={18} />,
      skill_gap: <TrendingUp size={18} />,
      general: <Sparkles size={18} />,
    };
    return icons[category] || <Sparkles size={18} />;
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      personality: 'from-blue-500 to-cyan-500',
      skill_gap: 'from-orange-500 to-amber-500',
      skill: 'from-green-500 to-emerald-500',
      goal: 'from-purple-500 to-violet-500',
      learning: 'from-indigo-500 to-blue-500',
      wellness: 'from-rose-500 to-pink-500',
    };
    return colors[type] || 'from-gray-500 to-slate-500';
  };

  const filteredRecommendations =
    activeCategory === 'all' ? recommendations : recommendations.filter((r) => r.category === activeCategory);

  const categories = ['all', ...new Set(recommendations.map((r) => r.category))];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block animate-spin mb-4">
            <Sparkles size={32} className="text-purple-500" />
          </div>
          <p className="text-gray-600 font-semibold">Loading AI recommendations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header with Gradient Background */}
      <div className="relative overflow-hidden rounded-2xl shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 opacity-90"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        
        {/* Animated background elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-48 -mt-48"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -ml-48 -mb-48"></div>
        
        <div className="relative p-8 md:p-12 text-white z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-white/20 backdrop-blur rounded-lg">
              <Sparkles size={28} className="text-white" />
            </div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight">AI-Powered Recommendations</h2>
          </div>
          <p className="text-lg text-cyan-100 mb-8 font-light">Personalized insights based on your personality, skills, and goals</p>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={fetchPersonalityRecommendations}
              className="group px-6 py-3 bg-white/20 backdrop-blur hover:bg-white/30 rounded-xl font-bold text-sm transition-all duration-300 border border-white/30 hover:border-white/60 flex items-center gap-2"
            >
              <Brain size={18} className="group-hover:rotate-12 transition-transform" />
              Personality Insights
            </button>
            <button
              onClick={fetchSkillGaps}
              className="group px-6 py-3 bg-white/20 backdrop-blur hover:bg-white/30 rounded-xl font-bold text-sm transition-all duration-300 border border-white/30 hover:border-white/60 flex items-center gap-2"
            >
              <TrendingUp size={18} className="group-hover:scale-110 transition-transform" />
              Skill Gaps
            </button>
            <button
              onClick={fetchRecommendations}
              className="group px-6 py-3 bg-white/20 backdrop-blur hover:bg-white/30 rounded-xl font-bold text-sm transition-all duration-300 border border-white/30 hover:border-white/60 flex items-center gap-2"
            >
              <Zap size={18} className="group-hover:animate-pulse" />
              All Recommendations
            </button>
          </div>
        </div>
      </div>

      {/* Category Filter with enhanced styling */}
      {recommendations.length > 0 && (
        <div className="flex flex-wrap gap-2 pb-4">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 flex items-center gap-2 transform hover:scale-105 ${
                activeCategory === cat
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/50'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {getCategoryIcon(cat === 'all' ? 'general' : cat)}
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
      )}

      {/* Recommendations Grid */}
      {filteredRecommendations.length === 0 ? (
        <div className="relative overflow-hidden rounded-2xl p-12">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 dark:from-purple-950/30 dark:via-blue-950/30 dark:to-cyan-950/30"></div>
          <div className="relative text-center">
            <div className="mx-auto mb-6 w-20 h-20 p-5 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl text-white shadow-lg">
              <Sparkles size={40} />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">No recommendations yet</h3>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
              Complete your personality assessment to unlock personalized recommendations powered by AI!
            </p>
            <div className="inline-block p-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl">
              <button className="px-8 py-3 bg-white dark:bg-gray-900 rounded-lg font-bold text-purple-600 dark:text-purple-400 hover:scale-105 transition-transform">
                Start Assessment
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredRecommendations.map((rec, idx) => (
            <div
              key={rec.id}
              className="group relative overflow-hidden rounded-2xl transition-all duration-500 hover:shadow-2xl transform hover:scale-105 hover:-translate-y-1"
              style={{
                animation: `fadeInUp 0.5s ease-out ${idx * 0.1}s both`,
              }}
            >
              {/* Gradient Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${getTypeColor(rec.type)} opacity-90 group-hover:opacity-100 transition-opacity`}></div>
              
              {/* Animated Background Blob */}
              <div className="absolute -right-20 -top-20 w-40 h-40 bg-white/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
              
              <div className="relative p-6 text-white h-full flex flex-col">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-2 bg-white/20 rounded-lg backdrop-blur">
                        {getCategoryIcon(rec.category)}
                      </div>
                      <span className="text-xs font-bold opacity-90 uppercase tracking-wide">
                        {rec.type.replace('_', ' ')}
                      </span>
                    </div>
                    <h3 className="text-xl font-black leading-tight mb-1">{rec.title}</h3>
                    <p className="text-sm opacity-90 font-light">{rec.description}</p>
                  </div>
                </div>

                {/* Main Recommendation */}
                <div className="bg-white/15 backdrop-blur rounded-xl p-4 mb-4 border border-white/20 group-hover:border-white/40 transition-colors">
                  <p className="text-xs font-bold uppercase tracking-wide opacity-80 mb-2">💡 Recommendation</p>
                  <p className="text-sm leading-relaxed font-medium">{rec.recommendation}</p>
                </div>

                {/* Why This Recommendation */}
                <div className="text-xs opacity-80 mb-4 bg-white/10 px-3 py-2 rounded-lg backdrop-blur">
                  <span className="font-bold">✨ Why:</span> {rec.reason}
                </div>

                {/* Related Items */}
                {(rec.skill_name || rec.goal_title || rec.learning_path_title) && (
                  <div className="text-xs space-y-1 mb-4 opacity-90">
                    {rec.skill_name && <p>🎯 Skill: <span className="font-bold">{rec.skill_name}</span></p>}
                    {rec.goal_title && <p>🚀 Goal: <span className="font-bold">{rec.goal_title}</span></p>}
                    {rec.learning_path_title && <p>📚 Learning: <span className="font-bold">{rec.learning_path_title}</span></p>}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 mt-auto pt-4">
                  <button className="flex-1 px-4 py-2 bg-white text-transparent bg-clip-text font-bold rounded-lg hover:bg-white/20 backdrop-blur border border-white/30 transition-all duration-300 hover:scale-105">
                    Start Action →
                  </button>
                  <button className="px-4 py-2 bg-white/20 backdrop-blur rounded-lg font-bold hover:bg-white/30 transition-all duration-300 border border-white/30">
                    Save ❤️
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
