'use client';
import { useState } from 'react';
import { api } from '@/lib/api';
import { Shield, Download, Trash2, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function PrivacyPage() {
  const [showDelete, setShowDelete] = useState(false);
  const { logout } = useAuth();

  const exportData = async () => {
    const data = await api.exportData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'personaforge-data-export.json'; a.click();
    URL.revokeObjectURL(url);
  };

  const deleteAccount = async () => {
    if (!confirm('Are you absolutely sure? This will permanently delete ALL your data. This cannot be undone.')) return;
    await api.deleteAccount();
    logout();
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2 flex items-center gap-2"><Shield size={28}/> Privacy Center</h1>
      <p className="text-gray-500 mb-8">Your data, your control. Full transparency.</p>

      <div className="max-w-2xl space-y-6">
        <div className="card">
          <h2 className="text-lg font-semibold mb-2">📋 Your Rights</h2>
          <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
            <li>✅ <strong>Access</strong> — View all data we store about you</li>
            <li>✅ <strong>Export</strong> — Download all your data in JSON format</li>
            <li>✅ <strong>Delete</strong> — Permanently delete your account and all data</li>
            <li>✅ <strong>Consent</strong> — Control what features can use your data</li>
          </ul>
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold mb-4">📦 Export Your Data</h2>
          <p className="text-sm text-gray-500 mb-4">Download all your PersonaForge data including profile, assessments, skills, goals, habits, and journal entries.</p>
          <button onClick={exportData} className="btn-primary flex items-center gap-2"><Download size={18}/> Export All Data (JSON)</button>
        </div>

        <div className="card border-red-200 dark:border-red-800">
          <h2 className="text-lg font-semibold mb-4 text-red-600 flex items-center gap-2"><AlertTriangle size={20}/> Danger Zone</h2>
          <p className="text-sm text-gray-500 mb-4">Permanently delete your account and all associated data. This action <strong>cannot be undone</strong>.</p>
          {!showDelete ? (
            <button onClick={()=>setShowDelete(true)} className="btn-danger flex items-center gap-2"><Trash2 size={18}/> Delete My Account</button>
          ) : (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl">
              <p className="text-sm text-red-600 mb-4">⚠️ This will permanently delete ALL your data including profile, assessments, skills, goals, habits, and journal entries.</p>
              <div className="flex gap-3">
                <button onClick={deleteAccount} className="btn-danger">Yes, Delete Everything</button>
                <button onClick={()=>setShowDelete(false)} className="btn-secondary">Cancel</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
