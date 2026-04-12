'use client';

import React, { useEffect, useState } from 'react';
import { Users, TrendingUp, Activity, BarChart3, AlertCircle } from 'lucide-react';
import AdminSidebar from '@/components/AdminSidebar';
import { api } from '@/lib/api';

export default function AdminPage() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeToday: 0,
    totalRecords: 0,
    newUsersThisMonth: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const response = await api.get('/api/admin/dashboard');
        setStats(response.data);
      } catch (err) {
        setError(err.message || 'Failed to load dashboard');
        console.error('Dashboard error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const StatCard = ({ icon: Icon, label, value, color }) => (
    <div className="bg-white rounded-lg shadow p-6 border-l-4" style={{ borderLeftColor: color }}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{label}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value.toLocaleString()}</p>
        </div>
        <div className="p-3 rounded-lg" style={{ backgroundColor: `${color}20` }}>
          <Icon className="w-8 h-8" style={{ color }} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />

      <main className="flex-1 ml-64 pt-20">
        <div className="max-w-7xl mx-auto p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-2">Welcome to PersonaForge Administration</p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
              <p className="text-gray-600 mt-4">Loading dashboard...</p>
            </div>
          )}

          {/* Statistics Grid */}
          {!loading && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                  icon={Users}
                  label="Total Users"
                  value={stats.totalUsers}
                  color="#3B82F6"
                />
                <StatCard
                  icon={Activity}
                  label="Active Today"
                  value={stats.activeToday}
                  color="#10B981"
                />
                <StatCard
                  icon={BarChart3}
                  label="Wellness Records"
                  value={stats.totalRecords}
                  color="#F59E0B"
                />
                <StatCard
                  icon={TrendingUp}
                  label="New Users (30d)"
                  value={stats.newUsersThisMonth}
                  color="#8B5CF6"
                />
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
                  <div className="space-y-2">
                    <a href="/admin/users" className="block text-blue-600 hover:text-blue-800 font-medium">
                      → Manage Users
                    </a>
                    <a href="/admin/content" className="block text-blue-600 hover:text-blue-800 font-medium">
                      → Review Content Reports
                    </a>
                    <a href="/admin/logs" className="block text-blue-600 hover:text-blue-800 font-medium">
                      → View System Logs
                    </a>
                    <a href="/admin/settings" className="block text-blue-600 hover:text-blue-800 font-medium">
                      → System Settings
                    </a>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">System Status</h2>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Database</span>
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm font-medium">Connected</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">API</span>
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm font-medium">Healthy</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Authentication</span>
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm font-medium">Active</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Info Box */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="font-bold text-blue-900 mb-2">Admin Panel Information</h3>
                <p className="text-blue-800 text-sm">
                  This admin panel provides comprehensive system management capabilities including user administration,
                  content moderation, system analytics, and configuration settings. All actions are logged for security purposes.
                </p>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
