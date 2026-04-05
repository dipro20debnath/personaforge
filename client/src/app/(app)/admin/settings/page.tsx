'use client';
import { useEffect, useState } from 'react';
import { Save } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';

export default function AdminSettings() {
  const router = useRouter();
  const [settings, setSettings] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');
  const [message, setMessage] = useState('');

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
    loadSettings();
  }, [router]);

  const loadSettings = async () => {
    try {
      const data = await api.adminSettings();
      setSettings(data.settings || {});
    } catch (err: any) {
      setMessage('Error loading settings: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = async (key: string, value: any) => {
    try {
      // TODO: Implement update endpoint
      setMessage('Setting updated!');
      loadSettings();
    } catch (err: any) {
      setMessage('Error: ' + err.message);
    }
  };

  const addNewSetting = async () => {
    if (!newKey || !newValue) return;
    await updateSetting(newKey, newValue);
    setNewKey('');
    setNewValue('');
  };

  if (loading) return <div className="p-8">Loading settings...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-white">System Settings</h1>
          <Link href="/admin" className="text-brand-500 hover:text-brand-400">
            ← Back
          </Link>
        </div>

        {message && (
          <div className="mb-4 p-4 bg-green-900 text-green-300 rounded">
            {message}
          </div>
        )}

        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-white mb-4">Current Settings</h2>
          <div className="space-y-4">
            {Object.entries(settings).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between p-4 bg-slate-700 rounded">
                <div>
                  <p className="text-white font-medium">{key}</p>
                  <p className="text-slate-300 text-sm">{String(value)}</p>
                </div>
                <button
                  onClick={() => updateSetting(key, prompt('New value:', String(value)) || value)}
                  className="px-3 py-1 bg-brand-600 text-white rounded text-sm hover:bg-brand-700"
                >
                  Edit
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-4">Add New Setting</h2>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Setting key"
              value={newKey}
              onChange={(e) => setNewKey(e.target.value)}
              className="w-full px-4 py-2 bg-slate-700 text-white rounded border border-slate-600 focus:border-brand-500 outline-none"
            />
            <textarea
              placeholder="Setting value"
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              className="w-full px-4 py-2 bg-slate-700 text-white rounded border border-slate-600 focus:border-brand-500 outline-none min-h-24"
            />
            <button
              onClick={addNewSetting}
              className="w-full px-4 py-2 bg-brand-600 text-white rounded font-medium hover:bg-brand-700 flex items-center justify-center gap-2"
            >
              <Save size={20} />
              Add Setting
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
