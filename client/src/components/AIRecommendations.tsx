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
