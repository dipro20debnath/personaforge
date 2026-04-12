'use client';

import React, { useEffect, useState } from 'react';
import { AlertCircle, Clock } from 'lucide-react';
import AdminSidebar from '@/components/AdminSidebar';
import { api } from '@/lib/api';

export default function AdminLogsPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchLogs();
  }, [page]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/admin/logs', {
        params: { page, limit: 20 },
      });
      setLogs(response.data.logs);
    } catch (err) {
      setError(err.message || 'Failed to fetch logs');
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
            <h1 className="text-4xl font-bold text-gray-900">System Logs</h1>
            <p className="text-gray-600 mt-2">View system activity and administrative actions</p>
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
              <p className="text-gray-600 mt-4">Loading logs...</p>
            </div>
          )}

          {!loading && (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-100 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Time</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">User ID</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Action</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Resource</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Details</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-8 text-center text-gray-600">
                        No logs available
                      </td>
                    </tr>
                  ) : (
                    logs.map((log) => (
                      <tr key={log.id} className="border-b hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-900 flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gray-400" />
                          {new Date(log.created_at).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{log.user_id || 'System'}</td>
                        <td className="px-6 py-4 text-sm">
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                            {log.action}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{log.resource_type}</td>
                        <td className="px-6 py-4 text-sm text-gray-600 truncate max-w-md">
                          {log.details || '-'}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
