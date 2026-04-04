'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Save, User } from 'lucide-react';

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => { api.getProfile().then(setProfile).catch(console.error); }, []);

  const save = async () => {
    setSaving(true);
    try {
      const updated = await api.updateProfile(profile);
      setProfile(updated);
      setMsg('Profile saved!');
      setTimeout(() => setMsg(''), 3000);
    } catch(e: any) { setMsg(e.message); }
    setSaving(false);
  };

  if (!profile) return <div className="flex items-center justify-center h-64"><div className="animate-spin w-8 h-8 border-4 border-brand-600 border-t-transparent rounded-full"/></div>;

  const fields = [
    { key: 'display_name', label: 'Display Name', type: 'text' },
    { key: 'bio', label: 'Bio', type: 'textarea' },
    { key: 'country', label: 'Country', type: 'text' },
    { key: 'timezone', label: 'Timezone', type: 'text' },
    { key: 'dob', label: 'Date of Birth', type: 'date' },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2 flex items-center gap-2"><User size={28}/> Profile</h1>
      <p className="text-gray-500 mb-8">Manage your personal information</p>
      <div className="card max-w-2xl">
        <div className="flex items-center gap-4 mb-6 pb-6 border-b dark:border-gray-800">
          <div className="w-20 h-20 bg-brand-100 dark:bg-brand-900/30 rounded-2xl flex items-center justify-center text-3xl font-bold text-brand-600">
            {(profile.display_name || 'U')[0].toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-bold">{profile.display_name}</h2>
            <p className="text-sm text-gray-500">{profile.email}</p>
            <div className="flex gap-2 mt-1">
              <span className="badge bg-brand-100 dark:bg-brand-900/30 text-brand-700">Level {Math.floor((profile.xp||0)/100)+1}</span>
              <span className="badge bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700">{profile.xp||0} XP</span>
            </div>
          </div>
        </div>
        <div className="space-y-4">
          {fields.map(f => (
            <div key={f.key}>
              <label className="block text-sm font-medium mb-1">{f.label}</label>
              {f.type === 'textarea' ? (
                <textarea className="input h-24 resize-none" value={profile[f.key]||''} onChange={e=>setProfile({...profile,[f.key]:e.target.value})}/>
              ) : (
                <input type={f.type} className="input" value={profile[f.key]||''} onChange={e=>setProfile({...profile,[f.key]:e.target.value})}/>
              )}
            </div>
          ))}
        </div>
        {msg && <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 text-green-600 rounded-xl text-sm">{msg}</div>}
        <button onClick={save} className="btn-primary mt-6 flex items-center gap-2" disabled={saving}>
          <Save size={18}/> {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}
