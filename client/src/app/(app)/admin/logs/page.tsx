'use client';
import { useEffect, useState } from 'react';
import { Trash2, RefreshCw } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';

export default function ActivityLogs() {
  const router = useRouter();
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [logType, setLogType] = useState('all');

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
    loadLogs();
  }, [logType, router]);

  const loadLogs = async () => {
    try {
      const data = await api.adminLogs();
      setLogs(data.logs || []);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteLog = async (logId: string) => {
    try {
      await api.adminLogs();
      loadLogs();
    } catch (err) {
      alert('Error deleting log');
    }
  };

  if (loading) return <div className="p-8">Loading logs...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-white">Activity Logs</h1>
          <div className="flex items-center gap-4">
            <button
              onClick={loadLogs}
              className="px-3 py-2 bg-brand-600 text-white rounded hover:bg-brand-700 flex items-center gap-2"
            >
              <RefreshCw size={18} />
              Refresh
            </button>
            <Link href="/admin" className="text-brand-500 hover:text-brand-400">
              ← Back
            </Link>
          </div>
        </div>

        <div className="mb-6">
          <select
            value={logType}
            onChange={(e) => setLogType(e.target.value)}
            className="px-4 py-2 bg-slate-700 text-white rounded border border-slate-600"
          >
            <option value="all">All Logs</option>
            <option value="auth">Authentication</option>
            <option value="user">User Activity</option>
            <option value="system">System</option>
            <option value="error">Errors</option>
          </select>
        </div>

        <div className="space-y-4">
          {logs.length === 0 ? (
            <div className="text-center p-8 text-slate-400">No logs found</div>
          ) : (
            logs.map((log, i) => (
              <div key={i} className="bg-slate-800 border border-slate-700 rounded-lg p-4 flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      log.type === 'error' ? 'bg-red-900 text-red-300' :
                      log.type === 'auth' ? 'bg-blue-900 text-blue-300' :
                      'bg-slate-700 text-slate-300'
                    }`}>
                      {log.type}
                    </span>
                    <span className="text-slate-400 text-sm">
                      {new Date(log.created_at).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-white">{log.message}</p>
                  {log.details && (
                    <pre className="mt-2 p-2 bg-slate-700 rounded text-xs text-slate-300 overflow-auto">
                      {typeof log.details === 'string' ? log.details : JSON.stringify(log.details, null, 2)}
                    </pre>
                  )}
                </div>
                <button
                  onClick={() => deleteLog(log.id)}
                  className="p-2 hover:bg-red-900 rounded text-red-400 ml-4"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
