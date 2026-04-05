'use client';
import { useEffect, useState } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';

export default function ContentModeration() {
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/admin/content`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await response.json();
      setContent(data.journals);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (contentId, status) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/admin/content/${contentId}/status`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        }
      );
      loadContent();
    } catch (err) {
      alert('Error updating content');
    }
  };

  if (loading) return <div className="p-8">Loading content...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-white">Content Moderation</h1>
          <Link href="/admin" className="text-brand-500 hover:text-brand-400">
            ← Back
          </Link>
        </div>

        <div className="space-y-4">
          {content.length === 0 ? (
            <div className="text-center p-8 text-slate-400">No flagged content</div>
          ) : (
            content.map((item) => (
              <div key={item.id} className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-slate-400 text-sm mb-1">User ID: {item.user_id}</p>
                    <p className="text-slate-400 text-sm">Date: {new Date(item.created_at).toLocaleString()}</p>
                  </div>
                  <span className={`px-3 py-1 rounded text-sm font-medium ${
                    item.flagged ? 'bg-red-900 text-red-300' : 'bg-green-900 text-green-300'
                  }`}>
                    {item.flagged ? 'Flagged' : 'Approved'}
                  </span>
                </div>

                <div className="bg-slate-700 rounded p-4 mb-4">
                  <p className="text-slate-300 line-clamp-4">{item.content}</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateStatus(item.id, 'approved')}
                    className="flex items-center gap-2 px-4 py-2 bg-green-900 text-green-300 rounded hover:bg-green-800"
                  >
                    <CheckCircle size={18} />
                    Approve
                  </button>
                  <button
                    onClick={() => updateStatus(item.id, 'flagged')}
                    className="flex items-center gap-2 px-4 py-2 bg-red-900 text-red-300 rounded hover:bg-red-800"
                  >
                    <XCircle size={18} />
                    Flag
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
