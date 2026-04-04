'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { UserPlus } from 'lucide-react';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      const data = await api.register({ name, email, password });
      login(data.token);
      router.push('/dashboard');
    } catch (err: any) { setError(err.message); }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-950 dark:to-gray-900 p-4">
      <div className="card w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-brand-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">P</div>
          <h1 className="text-2xl font-bold">Create Account</h1>
          <p className="text-gray-500 mt-1">Start your personal growth journey</p>
        </div>
        {error && <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-xl text-sm mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" className="input" placeholder="Full Name" value={name} onChange={e=>setName(e.target.value)} required />
          <input type="email" className="input" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required />
          <input type="password" className="input" placeholder="Password (min 6 chars)" value={password} onChange={e=>setPassword(e.target.value)} required />
          <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2" disabled={loading}>
            <UserPlus size={18}/> {loading ? 'Creating...' : 'Create Account'}
          </button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account? <Link href="/login" className="text-brand-600 font-medium hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
}
