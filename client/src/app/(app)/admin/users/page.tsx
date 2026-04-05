'use client';
import { useEffect, useState } from 'react';
import { Trash2, Edit, Eye } from 'lucide-react';
import Link from 'next/link';

export default function UsersManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    loadUsers();
  }, [page]);

  const loadUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/admin/users?page=${page}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await response.json();
      setUsers(data.users);
      setPagination(data.pagination);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (userId) => {
    if (!confirm('Delete this user? This cannot be undone.')) return;
    try {
      const token = localStorage.getItem('token');
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/admin/users/${userId}`,
        { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } }
      );
      loadUsers();
    } catch (err) {
      alert('Error deleting user: ' + err.message);
    }
  };

  if (loading) return <div className="p-8">Loading users...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">User Management</h1>
            <p className="text-slate-400">Total: {pagination?.total} users</p>
          </div>
          <Link href="/admin" className="text-brand-500 hover:text-brand-400">
            ← Back
          </Link>
        </div>

        <div className="grid gap-4">
          {users.map((user) => (
            <div key={user.id} className="bg-slate-800 border border-slate-700 rounded-lg p-6 flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-white font-semibold">{user.display_name || user.email}</h3>
                <p className="text-slate-400 text-sm">{user.email}</p>
                <div className="flex items-center gap-4 mt-2">
                  <span className="text-xs bg-slate-700 px-2 py-1 rounded text-slate-300">
                    Role: {user.role || 'user'}
                  </span>
                  <span className="text-xs text-slate-400">
                    Joined {new Date(user.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Link href={`/admin/users/${user.id}`}>
                  <button className="p-2 hover:bg-slate-700 rounded text-slate-400">
                    <Eye size={20} />
                  </button>
                </Link>
                <button
                  onClick={() => deleteUser(user.id)}
                  className="p-2 hover:bg-red-900 rounded text-red-400"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
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
