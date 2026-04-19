'use client';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { ArrowLeft, Mail, Calendar, Shield, User } from 'lucide-react';

export default function UserDetail() {
  const router = useRouter();
  const params = useParams();
  const userId = params?.id as string;
  
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if admin
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/login');
      return;
    }
    try {
      const parsed = JSON.parse(userData);
      if (parsed.role !== 'admin') {
        router.push('/dashboard');
        return;
      }
    } catch (e) {
      router.push('/login');
      return;
    }
    loadUser();
  }, [userId, router]);

  const loadUser = async () => {
    if (!userId) return;
    try {
      setLoading(true);
      const response = await api.adminGetUser(userId);
      setUser(response.user || response);
      setError('');
    } catch (err: any) {
      setError(err.message || 'Failed to load user');
      console.error('Error loading user:', err);
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async () => {
    if (!confirm('Are you sure you want to delete this user? This cannot be undone.')) {
      return;
    }
    try {
      await api.adminDeleteUser(userId);
      alert('User deleted successfully');
      router.push('/admin/users');
    } catch (err: any) {
      alert('Error deleting user: ' + err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading user details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-8">
        <div className="max-w-2xl mx-auto">
          <Link href="/admin/users" className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline mb-6">
            <ArrowLeft size={18} /> Back to Users
          </Link>
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-red-600 dark:text-red-400">
            <p className="font-semibold">Error</p>
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-8">
        <div className="max-w-2xl mx-auto">
          <Link href="/admin/users" className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline mb-6">
            <ArrowLeft size={18} /> Back to Users
          </Link>
          <div className="text-center text-gray-600 dark:text-gray-400">User not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/admin/users" className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline mb-6">
            <ArrowLeft size={18} /> Back to Users
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">User Details</h1>
        </div>

        {/* User Card */}
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-8 space-y-6">
          {/* Name and Avatar */}
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {(user.display_name || user.email || '?')[0].toUpperCase()}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {user.display_name || user.email}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">User ID: {user.id}</p>
            </div>
          </div>

          {/* Info Grid */}
          <div className="grid gap-4">
            {/* Email */}
            <div className="flex items-start gap-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
              <Mail className="text-blue-600 dark:text-blue-400 mt-1 flex-shrink-0" size={20} />
              <div className="flex-1">
                <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
                <p className="text-gray-900 dark:text-white font-medium">{user.email}</p>
              </div>
            </div>

            {/* Role */}
            <div className="flex items-start gap-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
              <Shield className="text-green-600 dark:text-green-400 mt-1 flex-shrink-0" size={20} />
              <div className="flex-1">
                <p className="text-sm text-gray-600 dark:text-gray-400">Role</p>
                <p className="text-gray-900 dark:text-white font-medium capitalize">{user.role || 'user'}</p>
              </div>
            </div>

            {/* Account Created */}
            <div className="flex items-start gap-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
              <Calendar className="text-purple-600 dark:text-purple-400 mt-1 flex-shrink-0" size={20} />
              <div className="flex-1">
                <p className="text-sm text-gray-600 dark:text-gray-400">Account Created</p>
                <p className="text-gray-900 dark:text-white font-medium">
                  {user.created_at ? new Date(user.created_at).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  }) : 'Unknown'}
                </p>
              </div>
            </div>

            {/* Last Updated */}
            {user.updated_at && (
              <div className="flex items-start gap-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
                <Calendar className="text-gray-600 dark:text-gray-400 mt-1 flex-shrink-0" size={20} />
                <div className="flex-1">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Last Updated</p>
                  <p className="text-gray-900 dark:text-white font-medium">
                    {new Date(user.updated_at).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            )}

            {/* Bio/Description if available */}
            {user.bio && (
              <div className="flex items-start gap-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
                <User className="text-orange-600 dark:text-orange-400 mt-1 flex-shrink-0" size={20} />
                <div className="flex-1">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Bio</p>
                  <p className="text-gray-900 dark:text-white font-medium">{user.bio}</p>
                </div>
              </div>
            )}
          </div>

          {/* Status */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${user.status === 'active' ? 'bg-green-500' : 'bg-gray-400'}`}></div>
              <span className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                {user.status || 'active'}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-6 border-t border-slate-200 dark:border-slate-700 flex gap-3">
            <button
              onClick={() => router.back()}
              className="flex-1 px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg font-medium transition-colors"
            >
              Go Back
            </button>
            <button
              onClick={deleteUser}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
            >
              Delete User
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
