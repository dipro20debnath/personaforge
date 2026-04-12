'use client';

import React, { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import AdminSidebar from '@/components/AdminSidebar';
import { api } from '@/lib/api';

export default function AdminContentPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchReports();
  }, [page]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/admin/reports', {
        params: { page, limit: 10 },
      });
      setReports(response.data.reports);
    } catch (err) {
      setError(err.message || 'Failed to fetch reports');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (reportId, newStatus) => {
    try {
      await api.put(`/api/admin/reports/${reportId}`, {
        status: newStatus,
        action: newStatus === 'resolved' ? 'Content removed' : null,
      });
      await fetchReports();
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />

      <main className="flex-1 ml-64 pt-20">
        <div className="max-w-7xl mx-auto p-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900">Content Moderation</h1>
            <p className="text-gray-600 mt-2">Review and manage flagged content reports</p>
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
              <p className="text-gray-600 mt-4">Loading reports...</p>
            </div>
          )}

          {!loading && (
            <div className="space-y-4">
              {reports.length === 0 ? (
                <div className="bg-white rounded-lg shadow p-8 text-center">
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                  <p className="text-gray-600">No pending reports</p>
                </div>
              ) : (
                reports.map((report) => (
                  <div key={report.id} className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${
                              report.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : report.status === 'resolved'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {report.status}
                          </span>
                          <span className="text-gray-600 text-sm">Report #{report.id}</span>
                        </div>
                        <p className="text-gray-900 font-medium">Reason: {report.reason}</p>
                        <p className="text-gray-600 text-sm mt-2">Reported by User #{report.user_id}</p>
                        <p className="text-gray-600 text-sm">Content ID: {report.content_id}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleUpdateStatus(report.id, 'reviewed')}
                          className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm font-medium hover:bg-blue-200"
                        >
                          Review
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(report.id, 'resolved')}
                          className="px-3 py-1 bg-green-100 text-green-700 rounded text-sm font-medium hover:bg-green-200"
                        >
                          Resolve
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(report.id, 'dismissed')}
                          className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm font-medium hover:bg-gray-200"
                        >
                          Dismiss
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
