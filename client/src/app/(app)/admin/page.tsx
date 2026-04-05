'use client';
import { useEffect, useState } from 'react';
import { Users, TrendingUp, Activity, Settings, Download, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if user is admin
    const user = localStorage.getItem('user');
    if (!user) {
      router.push('/login');
      return;
    }
    try {
      const userData = JSON.parse(user);
      if (userData.role !== 'admin') {
        router.push('/dashboard');
        return;
      }
    } catch (e) {
      router.push('/login');
      return;
    }
    loadDashboard();
  }, [router]);

  const loadDashboard = async () => {
    try {
      const data = await api.adminDashboard();
      setStats(data);
    } catch (err: any) {
      setError(err?.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading admin dashboard...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;
  if (!stats) return <div className="p-8">No data available</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-slate-400">System overview and management</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {[
            { label: 'Total Users', value: stats.stats.totalUsers, icon: Users, color: 'blue' },
            { label: 'Active Users', value: stats.stats.activeUsers, icon: Activity, color: 'green' },
            { label: 'Total Goals', value: stats.stats.totalGoals, icon: TrendingUp, color: 'purple' },
            { label: 'Total Habits', value: stats.stats.totalHabits, icon: Activity, color: 'orange' },
            { label: 'Assessments', value: stats.stats.totalAssessments, icon: TrendingUp, color: 'red' },
          ].map((stat, i) => (
            <div key={i} className="bg-slate-800 border border-slate-700 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-white">{stat.value}</p>
                </div>
                <stat.icon className={`text-${stat.color}-500 opacity-50`} size={32} />
              </div>
            </div>
          ))}
        </div>

        {/* Management Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {[
            {
              title: 'User Management',
              description: 'Manage users, roles, and permissions',
              href: '/admin/users',
              icon: Users,
            },
            {
              title: 'Activity Logs',
              description: 'View system logs and user activity',
              href: '/admin/logs',
              icon: Activity,
            },
            {
              title: 'Content Moderation',
              description: 'Review and moderate content',
              href: '/admin/content',
              icon: AlertCircle,
            },
            {
              title: 'Settings',
              description: 'System settings and configuration',
              href: '/admin/settings',
              icon: Settings,
            },
          ].map((item, i) => (
            <Link key={i} href={item.href}>
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 hover:border-slate-600 transition cursor-pointer">
                <div className="flex items-start justify-between mb-4">
                  <item.icon className="text-brand-500" size={28} />
                  <span className="text-slate-500">→</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-slate-400 text-sm">{item.description}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Recent Users */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-6">Recent Users</h2>
          <div className="space-y-4">
            {stats.recentUsers && stats.recentUsers.map((user: any) => (
              <div key={user.id} className="flex items-center justify-between p-4 bg-slate-700 rounded-lg">
                <div>
                  <p className="text-white font-medium">{user.email}</p>
                  <p className="text-slate-400 text-sm">Joined {new Date(user.created_at).toLocaleDateString()}</p>
                </div>
                <Link href={`/admin/users/${user.id}`} className="text-brand-500 hover:text-brand-400">
                  View →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
