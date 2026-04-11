'use client';

import { useState, useEffect } from 'react';
import { getApiUrl } from '@/lib/api';

interface WellnessData {
  id: string;
  date: string;
  stress_level: number;
  sleep_hours: number;
  exercise_minutes: number;
  water_intake: number;
  meditation_minutes: number;
  energy_level: number;
  mood_score: number;
  notes: string;
}

export default function WellnessTracker() {
  const [todayData, setTodayData] = useState<WellnessData | null>(null);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    stress_level: 5,
    sleep_hours: 7.0,
    exercise_minutes: 0,
    water_intake: 0,
    meditation_minutes: 0,
    energy_level: 5,
    mood_score: 5,
    notes: '',
  });

  useEffect(() => {
    fetchWellnessData();
    fetchAnalytics();
  }, []);

  const fetchWellnessData = async () => {
    try {
      const token = localStorage.getItem('pf_token');
      const apiUrl = getApiUrl();
      const response = await fetch(`${apiUrl}/api/wellness/today`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const result = await response.json();
        if (result.data) {
          setTodayData(result.data);
          setFormData({
            stress_level: result.data.stress_level,
            sleep_hours: result.data.sleep_hours,
            exercise_minutes: result.data.exercise_minutes,
            water_intake: result.data.water_intake,
            meditation_minutes: result.data.meditation_minutes,
            energy_level: result.data.energy_level,
            mood_score: result.data.mood_score,
            notes: result.data.notes,
          });
        }
      }
    } catch (error) {
      console.error('Failed to fetch wellness data:', error);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem('pf_token');
      const apiUrl = getApiUrl();
      const response = await fetch(`${apiUrl}/api/wellness/analytics`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const result = await response.json();
        setAnalytics(result.data);
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('pf_token');
      const apiUrl = getApiUrl();
      const response = await fetch(`${apiUrl}/api/wellness`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();
        setTodayData(result.data);
        alert('✅ Wellness data updated successfully!');
        fetchAnalytics();
      }
    } catch (error) {
      console.error('Failed to save wellness data:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'sleep_hours' ? parseFloat(value) : parseInt(value, 10),
    });
  };

  const getMoodEmoji = (score: number) => {
    if (score <= 2) return '😢';
    if (score <= 4) return '😐';
    if (score <= 6) return '🙂';
    if (score <= 8) return '😊';
    return '😄';
  };

  const getStressColor = (level: number) => {
    if (level <= 3) return 'bg-green-500';
    if (level <= 6) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  if (loading) {
    return <div className="text-center py-12">Loading wellness data...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Today's Entry Form */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-4">📊 Today's Wellness Check-in</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Stress Level */}
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-2">
              Stress Level (1-10) {getMoodEmoji(formData.stress_level)}
            </label>
            <input
              type="range"
              name="stress_level"
              min="1"
              max="10"
              value={formData.stress_level}
              onChange={handleChange}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <p className="text-xs text-gray-600 mt-1">{formData.stress_level}/10</p>
          </div>

          {/* Sleep Hours */}
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-2">Sleep Hours 😴</label>
            <input
              type="number"
              name="sleep_hours"
              min="0"
              max="24"
              step="0.5"
              value={formData.sleep_hours}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Exercise Minutes */}
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-2">Exercise (minutes) 🏃</label>
            <input
              type="number"
              name="exercise_minutes"
              min="0"
              max="600"
              value={formData.exercise_minutes}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Water Intake */}
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-2">Water Intake (glasses) 💧</label>
            <input
              type="number"
              name="water_intake"
              min="0"
              max="20"
              value={formData.water_intake}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Meditation */}
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-2">Meditation (minutes) 🧘</label>
            <input
              type="number"
              name="meditation_minutes"
              min="0"
              max="120"
              value={formData.meditation_minutes}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Energy Level */}
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-2">Energy Level (1-10) ⚡</label>
            <input
              type="range"
              name="energy_level"
              min="1"
              max="10"
              value={formData.energy_level}
              onChange={handleChange}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Mood Score */}
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-2">Mood Score (1-10) {getMoodEmoji(formData.mood_score)}</label>
            <input
              type="range"
              name="mood_score"
              min="1"
              max="10"
              value={formData.mood_score}
              onChange={handleChange}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Notes */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-800 mb-2">Notes 📝</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Any additional notes about your wellness today?"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg h-20 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <button
            type="submit"
            className="md:col-span-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            ✅ Save Wellness Data
          </button>
        </form>
      </div>

      {/* Analytics Overview */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <h3 className="font-semibold text-sm text-blue-900">Average Sleep</h3>
            <p className="text-2xl font-bold text-blue-600">{(analytics.analytics.avg_sleep || 0).toFixed(1)}h</p>
            <p className="text-xs text-blue-700 mt-1">Last 30 days</p>
          </div>

          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <h3 className="font-semibold text-sm text-green-900">Avg. Exercise</h3>
            <p className="text-2xl font-bold text-green-600">{(analytics.analytics.avg_exercise || 0).toFixed(0)}m</p>
            <p className="text-xs text-green-700 mt-1">Per day</p>
          </div>

          <div className={`${getStressColor(analytics.analytics.avg_stress || 5)} bg-opacity-20 rounded-lg p-4 border`}>
            <h3 className="font-semibold text-sm">Avg. Stress</h3>
            <p className="text-2xl font-bold">{(analytics.analytics.avg_stress || 0).toFixed(1)}/10</p>
            <p className="text-xs mt-1">Last 30 days</p>
          </div>

          <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
            <h3 className="font-semibold text-sm text-purple-900">Avg. Energy</h3>
            <p className="text-2xl font-bold text-purple-600">{(analytics.analytics.avg_energy || 0).toFixed(1)}/10</p>
            <p className="text-xs text-purple-700 mt-1">Vitality level</p>
          </div>

          <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
            <h3 className="font-semibold text-sm text-orange-900">Avg. Mood</h3>
            <p className="text-2xl font-bold text-orange-600">{getMoodEmoji(analytics.analytics.avg_mood || 5)}</p>
            <p className="text-xs text-orange-700 mt-1">{(analytics.analytics.avg_mood || 0).toFixed(1)}/10</p>
          </div>

          <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
            <h3 className="font-semibold text-sm text-indigo-900">Meditation</h3>
            <p className="text-2xl font-bold text-indigo-600">{(analytics.analytics.avg_meditation || 0).toFixed(0)}m</p>
            <p className="text-xs text-indigo-700 mt-1">Average daily</p>
          </div>
        </div>
      )}

      {/* Wellness Tips */}
      <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border border-blue-200 p-6">
        <h3 className="font-bold text-lg mb-3">💡 Wellness Tips</h3>
        <ul className="space-y-2 text-sm">
          <li>✅ Aim for 7-9 hours of sleep each night</li>
          <li>✅ Exercise for at least 30 minutes daily</li>
          <li>✅ Drink 8-10 glasses of water per day</li>
          <li>✅ Meditate for 10-15 minutes to reduce stress</li>
          <li>✅ Keep track of your wellness metrics consistently</li>
        </ul>
      </div>
    </div>
  );
}
