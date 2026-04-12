'use client';

import React, { useEffect, useState } from 'react';
import { AlertCircle, Save } from 'lucide-react';
import AdminSidebar from '@/components/AdminSidebar';
import { api } from '@/lib/api';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/admin/settings');
      setSettings(response.data.settings || {});
    } catch (err) {
      setError(err.message || 'Failed to fetch settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSetting = async (key, value) => {
    try {
      setMessage('');
      await api.put('/api/admin/settings', { key, value });
      setMessage('Setting saved successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError('Error saving setting: ' + err.message);
    }
  };

  const commonSettings = [
    { key: 'maintenance_mode', label: 'Maintenance Mode', type: 'boolean', description: 'Enable to put the system in maintenance mode' },
    { key: 'max_file_size', label: 'Max File Size (MB)', type: 'number', description: 'Maximum file upload size in megabytes' },
    { key: 'session_timeout', label: 'Session Timeout (minutes)', type: 'number', description: 'User session timeout duration' },
    { key: 'password_min_length', label: 'Minimum Password Length', type: 'number', description: 'Minimum characters required for passwords' },
    { key: 'api_rate_limit', label: 'API Rate Limit', type: 'number', description: 'Requests per minute per user' },
    { key: 'notification_email', label: 'Notification Email', type: 'text', description: 'Email for system notifications' },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />

      <main className="flex-1 ml-64 pt-20">
        <div className="max-w-4xl mx-auto p-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900">System Settings</h1>
            <p className="text-gray-600 mt-2">Configure system behavior and preferences</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {message && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-700">{message}</p>
            </div>
          )}

          {loading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
              <p className="text-gray-600 mt-4">Loading settings...</p>
            </div>
          )}

          {!loading && (
            <div className="space-y-6">
              {commonSettings.map((setting) => (
                <div key={setting.key} className="bg-white rounded-lg shadow p-6">
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    {setting.label}
                  </label>
                  <p className="text-sm text-gray-600 mb-4">{setting.description}</p>

                  <div className="flex items-center gap-3">
                    {setting.type === 'boolean' ? (
                      <input
                        type="checkbox"
                        checked={settings[setting.key] === 'true' || settings[setting.key] === true}
                        onChange={(e) =>
                          handleSetting(setting.key, e.target.checked ? 'true' : 'false')
                        }
                        className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <div className="flex gap-2 w-full">
                        <input
                          type={setting.type}
                          value={settings[setting.key] || ''}
                          onChange={(e) =>
                            setSettings({
                              ...settings,
                              [setting.key]: e.target.value,
                            })
                          }
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                          onClick={() =>
                            handleSetting(setting.key, settings[setting.key])
                          }
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                        >
                          <Save className="w-4 h-4" />
                          Save
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="font-bold text-blue-900 mb-2">Settings Information</h3>
                <p className="text-blue-800 text-sm">
                  Changes to these settings take effect immediately for new requests. Existing sessions may need to refresh to see some changes.
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
