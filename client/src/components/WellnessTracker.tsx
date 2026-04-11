'use client';

import { useState, useEffect, useRef } from 'react';
import { getApiUrl } from '@/lib/api';
import { Download, AlertCircle, CheckCircle } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

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
  const [history, setHistory] = useState<WellnessData[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const tableRef = useRef<HTMLDivElement>(null);
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

  // Clear messages after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [success]);

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
            notes: result.data.notes || '',
          });
        }
      }
    } catch (err) {
      console.error('Failed to fetch wellness data:', err);
      setError('Failed to load today\'s wellness data');
    }
  };

  const fetchHistory = async () => {
    try {
      const token = localStorage.getItem('pf_token');
      const apiUrl = getApiUrl();
      const response = await fetch(`${apiUrl}/api/wellness`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const result = await response.json();
        setHistory(result.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch history:', err);
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
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      const token = localStorage.getItem('pf_token');
      if (!token) {
        setError('Not authenticated. Please log in again.');
        return;
      }

      const apiUrl = getApiUrl();
      const response = await fetch(`${apiUrl}/api/wellness`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save wellness data');
      }

      const result = await response.json();
      setTodayData(result.data);
      setSuccess('✅ Wellness data saved successfully!');
      fetchHistory();
      fetchAnalytics();
    } catch (err: any) {
      console.error('Error saving wellness data:', err);
      setError(err.message || 'Failed to save wellness data. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'sleep_hours' ? parseFloat(value) || 0 : parseInt(value, 10) || 0,
    });
  };

  const downloadPDF = async () => {
    if (!tableRef.current) return;

    try {
      const canvas = await html2canvas(tableRef.current, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('l', 'mm', 'a4');
      const imgWidth = 300;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
      pdf.save('wellness-records.pdf');
      setSuccess('📥 PDF downloaded successfully!');
    } catch (err) {
      console.error('Error generating PDF:', err);
      setError('Failed to generate PDF. Please try again.');
    }
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

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return <div className="text-center py-12 text-gray-600 dark:text-gray-400">Loading wellness data...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Error Message */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="text-red-600 dark:text-red-400 mt-0.5" size={20} />
          <p className="text-red-800 dark:text-red-300">{error}</p>
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 flex items-start gap-3">
          <CheckCircle className="text-green-600 dark:text-green-400 mt-0.5" size={20} />
          <p className="text-green-800 dark:text-green-300">{success}</p>
        </div>
      )}
      {/* Today's Entry Form */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">📊 Today's Wellness Check-in</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Stress Level */}
          <div>
            <label className="block text-sm font-medium text-gray-800 dark:text-gray-100 mb-2">
              Stress Level (1-10) {getMoodEmoji(formData.stress_level)}
            </label>
            <input
              type="range"
              name="stress_level"
              min="1"
              max="10"
              value={formData.stress_level}
              onChange={handleChange}
              className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer"
            />
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{formData.stress_level}/10</p>
          </div>

          {/* Sleep Hours */}
          <div>
            <label className="block text-sm font-medium text-gray-800 dark:text-gray-100 mb-2">Sleep Hours 😴</label>
            <input
              type="number"
              name="sleep_hours"
              min="0"
              max="24"
              step="0.5"
              value={formData.sleep_hours}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Exercise Minutes */}
          <div>
            <label className="block text-sm font-medium text-gray-800 dark:text-gray-100 mb-2">Exercise (minutes) 🏃</label>
            <input
              type="number"
              name="exercise_minutes"
              min="0"
              max="600"
              value={formData.exercise_minutes}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Water Intake */}
          <div>
            <label className="block text-sm font-medium text-gray-800 dark:text-gray-100 mb-2">Water Intake (glasses) 💧</label>
            <input
              type="number"
              name="water_intake"
              min="0"
              max="20"
              value={formData.water_intake}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Meditation */}
          <div>
            <label className="block text-sm font-medium text-gray-800 dark:text-gray-100 mb-2">Meditation (minutes) 🧘</label>
            <input
              type="number"
              name="meditation_minutes"
              min="0"
              max="120"
              value={formData.meditation_minutes}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Energy Level */}
          <div>
            <label className="block text-sm font-medium text-gray-800 dark:text-gray-100 mb-2">Energy Level (1-10) ⚡</label>
            <input
              type="range"
              name="energy_level"
              min="1"
              max="10"
              value={formData.energy_level}
              onChange={handleChange}
              className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer"
            />
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{formData.energy_level}/10</p>
          </div>

          {/* Mood Score */}
          <div>
            <label className="block text-sm font-medium text-gray-800 dark:text-gray-100 mb-2">Mood Score (1-10) {getMoodEmoji(formData.mood_score)}</label>
            <input
              type="range"
              name="mood_score"
              min="1"
              max="10"
              value={formData.mood_score}
              onChange={handleChange}
              className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer"
            />
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{formData.mood_score}/10</p>
          </div>

          {/* Notes */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-800 dark:text-gray-100 mb-2">Notes 📝</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Any additional notes about your wellness today?"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg h-20 text-gray-900 dark:text-white bg-white dark:bg-gray-700 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="md:col-span-2 bg-blue-600 disabled:bg-blue-400 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            {saving ? '⏳ Saving...' : '✅ Save Wellness Data'}
          </button>
        </form>
      </div>

      {/* Analytics Overview */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
            <h3 className="font-semibold text-sm text-blue-900 dark:text-blue-300">Average Sleep</h3>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{(analytics.analytics.avg_sleep || 0).toFixed(1)}h</p>
            <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">Last 30 days</p>
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
            <h3 className="font-semibold text-sm text-green-900 dark:text-green-300">Avg. Exercise</h3>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">{(analytics.analytics.avg_exercise || 0).toFixed(0)}m</p>
            <p className="text-xs text-green-700 dark:text-green-300 mt-1">Per day</p>
          </div>

          <div className={`${getStressColor(analytics.analytics.avg_stress || 5)} bg-opacity-20 rounded-lg p-4 border`}>
            <h3 className="font-semibold text-sm">Avg. Stress</h3>
            <p className="text-2xl font-bold">{(analytics.analytics.avg_stress || 0).toFixed(1)}/10</p>
            <p className="text-xs mt-1">Last 30 days</p>
          </div>

          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
            <h3 className="font-semibold text-sm text-purple-900 dark:text-purple-300">Avg. Energy</h3>
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{(analytics.analytics.avg_energy || 0).toFixed(1)}/10</p>
            <p className="text-xs text-purple-700 dark:text-purple-300 mt-1">Vitality level</p>
          </div>

          <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4 border border-orange-200 dark:border-orange-800">
            <h3 className="font-semibold text-sm text-orange-900 dark:text-orange-300">Avg. Mood</h3>
            <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{getMoodEmoji(analytics.analytics.avg_mood || 5)}</p>
            <p className="text-xs text-orange-700 dark:text-orange-300 mt-1">{(analytics.analytics.avg_mood || 0).toFixed(1)}/10</p>
          </div>

          <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-4 border border-indigo-200 dark:border-indigo-800">
            <h3 className="font-semibold text-sm text-indigo-900 dark:text-indigo-300">Meditation</h3>
            <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{(analytics.analytics.avg_meditation || 0).toFixed(0)}m</p>
            <p className="text-xs text-indigo-700 dark:text-indigo-300 mt-1">Average daily</p>
          </div>
        </div>
      )}

      {/* Wellness History Table */}
      {history.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">📋 Wellness History</h2>
            <button
              onClick={downloadPDF}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition"
            >
              <Download size={18} />
              Download PDF
            </button>
          </div>

          <div ref={tableRef} className="overflow-x-auto">
            <table className="w-full text-sm text-gray-900 dark:text-white">
              <thead className="border-b-2 border-gray-300 dark:border-gray-600">
                <tr className="bg-gray-50 dark:bg-gray-700">
                  <th className="px-4 py-3 text-left font-semibold">Date</th>
                  <th className="px-4 py-3 text-center font-semibold">Stress</th>
                  <th className="px-4 py-3 text-center font-semibold">Sleep (h)</th>
                  <th className="px-4 py-3 text-center font-semibold">Exercise (m)</th>
                  <th className="px-4 py-3 text-center font-semibold">Water</th>
                  <th className="px-4 py-3 text-center font-semibold">Meditation (m)</th>
                  <th className="px-4 py-3 text-center font-semibold">Energy</th>
                  <th className="px-4 py-3 text-center font-semibold">Mood</th>
                </tr>
              </thead>
              <tbody>
                {history.map((record, idx) => (
                  <tr key={record.id} className={`border-b border-gray-200 dark:border-gray-700 ${idx % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-700/50'}`}>
                    <td className="px-4 py-3 font-medium">{formatDate(record.date)}</td>
                    <td className="px-4 py-3 text-center">{record.stress_level}/10</td>
                    <td className="px-4 py-3 text-center">{record.sleep_hours.toFixed(1)}</td>
                    <td className="px-4 py-3 text-center">{record.exercise_minutes}</td>
                    <td className="px-4 py-3 text-center">{record.water_intake}</td>
                    <td className="px-4 py-3 text-center">{record.meditation_minutes}</td>
                    <td className="px-4 py-3 text-center">{record.energy_level}/10</td>
                    <td className="px-4 py-3 text-center">{getMoodEmoji(record.mood_score)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Wellness Tips */}
      <div className="bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 rounded-lg border border-blue-200 dark:border-blue-800 p-6">
        <h3 className="font-bold text-lg mb-3 text-gray-900 dark:text-white">💡 Wellness Tips</h3>
        <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
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
