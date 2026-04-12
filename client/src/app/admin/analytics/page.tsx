'use client';

import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { AlertCircle } from 'lucide-react';
import AdminSidebar from '@/components/AdminSidebar';
import { api } from '@/lib/api';

export default function AdminAnalyticsPage() {
  const [userGrowth, setUserGrowth] = useState([]);
  const [wellnessData, setWellnessData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const [userRes, wellnessRes] = await Promise.all([
        api.get('/api/admin/analytics/users'),
        api.get('/api/admin/analytics/wellness'),
      ]);
      setUserGrowth(userRes.data.data || []);
      setWellnessData(wellnessRes.data.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />

      <main className="flex-1 ml-64 pt-20">
        <div className="max-w-7xl mx-auto p-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900">Analytics</h1>
            <p className="text-gray-600 mt-2">System-wide growth and activity trends</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {loading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
              <p className="text-gray-600 mt-4">Loading analytics...</p>
            </div>
          )}

          {!loading && (
            <div className="space-y-6">
              {/* User Growth Chart */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">User Growth (30 Days)</h2>
                {userGrowth.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={userGrowth}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="count"
                        stroke="#3B82F6"
                        strokeWidth={2}
                        dot={{ fill: '#3B82F6' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-gray-600">No data available</p>
                )}
              </div>

              {/* Wellness Check-ins Chart */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Wellness Check-ins (30 Days)</h2>
                {wellnessData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={wellnessData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="count"
                        stroke="#10B981"
                        strokeWidth={2}
                        dot={{ fill: '#10B981' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-gray-600">No data available</p>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
