'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { LogIn, Copy, Check, Sparkles } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState<'email' | 'password' | null>(null);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await api.login({ email, password });
      login(data.token);
      router.push('/dashboard');
    } catch (err: any) { setError(err.message); }
    setLoading(false);
  };

  const copyToClipboard = (text: string, type: 'email' | 'password') => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  const useDemoCredentials = () => {
    setEmail('demo@personaforge.com');
    setPassword('Demo@123');
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden p-4">
      {/* Animated Content */}
      <div className="card w-full max-w-md relative z-10 shadow-2xl border-0">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-400 via-brand-600 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-3xl shadow-lg" style={{animation: 'pulseGlow 2s ease-in-out infinite'}}>
              P
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-brand-600 to-purple-600 bg-clip-text text-transparent">Welcome Back</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-3 text-sm font-medium">Shape your future with PersonaForge</p>
        </div>

        {/* Demo Account Section */}
        <div className="bg-gradient-to-br from-blue-50/80 to-purple-50/80 dark:from-blue-900/30 dark:to-purple-900/30 border border-blue-200 dark:border-blue-700/50 rounded-xl p-5 mb-7 backdrop-blur-md hover:shadow-lg transition-all duration-300">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles size={16} className="text-blue-600 dark:text-blue-400" />
            <p className="text-sm font-bold text-blue-900 dark:text-blue-300">Demo Account Available (78% Complete)</p>
          </div>
          
          {/* Demo Email */}
          <div className="flex items-center gap-3 p-3 bg-white/60 dark:bg-gray-800/60 rounded-lg mb-3 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-800 transition-colors">
            <div className="flex-1">
              <p className="text-xs text-gray-600 dark:text-gray-400 font-semibold mb-1">Email:</p>
              <p className="text-sm font-mono text-gray-800 dark:text-gray-100 tracking-wide">demo@personaforge.com</p>
            </div>
            <button
              onClick={() => copyToClipboard('demo@personaforge.com', 'email')}
              className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors flex-shrink-0"
              title="Copy email"
            >
              {copied === 'email' ? <Check size={16} className="text-green-500" /> : <Copy size={16} className="text-gray-400" />}
            </button>
          </div>

          {/* Demo Password */}
          <div className="flex items-center gap-3 p-3 bg-white/60 dark:bg-gray-800/60 rounded-lg mb-4 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-800 transition-colors">
            <div className="flex-1">
              <p className="text-xs text-gray-600 dark:text-gray-400 font-semibold mb-1">Password:</p>
              <p className="text-sm font-mono text-gray-800 dark:text-gray-100 tracking-wide">Demo@123</p>
            </div>
            <button
              onClick={() => copyToClipboard('Demo@123', 'password')}
              className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors flex-shrink-0"
              title="Copy password"
            >
              {copied === 'password' ? <Check size={16} className="text-green-500" /> : <Copy size={16} className="text-gray-400" />}
            </button>
          </div>

          <button
            onClick={useDemoCredentials}
            className="w-full px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg transition-all active:scale-95 shadow-md"
          >
            Use Demo Credentials
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm mb-6 backdrop-blur-sm">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input 
              type="email" 
              className="input" 
              placeholder="Email address" 
              value={email} 
              onChange={e=>setEmail(e.target.value)} 
              required 
            />
          </div>
          <div>
            <input 
              type="password" 
              className="input" 
              placeholder="Password" 
              value={password} 
              onChange={e=>setPassword(e.target.value)} 
              required 
            />
          </div>
          <button 
            type="submit" 
            className="btn-primary w-full flex items-center justify-center gap-2 py-3 text-base font-semibold" 
            disabled={loading}
          >
            <LogIn size={20}/> {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        {/* Sign Up Link */}
        <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-7">
          New to PersonaForge?{' '}
          <Link href="/register" className="text-brand-600 dark:text-brand-400 font-semibold hover:underline transition-colors">
            Create your account
          </Link>
        </p>
      </div>
    </div>
  );
}
