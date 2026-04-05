'use client';
import { useEffect, useState } from 'react';
import { Trash2, Edit, Eye } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';

export default function UsersManagement() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<any>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if admin
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
    loadUsers();
  }, [page, router]);

  const loadUsers = async () => {
    try {
      const data = await api.adminUsers();
      setUsers(data.users || []);
      setPagination(data.pagination);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (userId: string) => {
    if (!confirm('Delete this user? This cannot be undone.')) return;
    try {
      await api.adminDeleteUser(userId);
      loadUsers();
    } catch (err: any) {
      alert('Error deleting user: ' + err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading users...</p>
        </div>
      </div>
    );
  }
  if (error) return <div className="p-8 text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">User Management</h1>
            <p className="text-gray-600 dark:text-gray-400">Total: {pagination?.total || 0} users</p>
          </div>
          <Link href="/admin" className="text-blue-600 dark:text-blue-400 hover:underline">
            ← Back to Admin
          </Link>
        </div>

        <div className="grid gap-4">
          {users.length === 0 ? (
            <div className="text-center py-8 text-gray-600 dark:text-gray-400">
              No users found
            </div>
          ) : (
            users.map((user: any) => (
              <div key={user.id} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-6 flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-gray-900 dark:text-white font-semibold">{user.display_name || user.email}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">{user.email}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-xs bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded text-gray-700 dark:text-gray-300">
                      Role: {user.role || 'user'}
                    </span>
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      Joined {user.created_at ? new Date(user.created_at).toLocaleDateString() : '-'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => deleteUser(user.id)}
                    className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded text-red-600 dark:text-red-400 transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {pagination && pagination.pages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 bg-slate-700 text-white rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-white">
              Page {page} of {pagination.pages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(pagination.pages, p + 1))}
              disabled={page === pagination.pages}
              className="px-4 py-2 bg-slate-700 text-white rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
