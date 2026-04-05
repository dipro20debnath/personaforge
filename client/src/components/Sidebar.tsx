'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, User, Brain, TrendingUp, Target, CheckSquare, BookOpen, PenLine, FileText, Map, Heart, Shield, Moon, Sun, LogOut, Bell, Menu, X, Sparkles, Clock, Flame, Wallet, Mic, Globe, Settings } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useState, useEffect } from 'react';
import { api } from '@/lib/api';

const links = [
  { href:'/dashboard', icon:LayoutDashboard, label:'Dashboard' },
  { href:'/profile', icon:User, label:'Profile' },
  { section: '🧠 Growth & Development' },
  { href:'/assessment', icon:Brain, label:'Personality' },
  { href:'/skills', icon:TrendingUp, label:'Skills' },
  { href:'/learning', icon:BookOpen, label:'Learning' },
  { section: '🎯 Goals & Progress' },
  { href:'/goals', icon:Target, label:'Goals' },
  { href:'/abroad-goals', icon:Globe, label:'Abroad Goals' },
  { href:'/career-map', icon:Map, label:'Career Map' },
  { section: '🏃 Daily Life' },
  { href:'/habits', icon:CheckSquare, label:'Habits' },
  { href:'/daily-routine', icon:Clock, label:'Daily Routine' },
  { href:'/motivation', icon:Flame, label:'Motivation' },
  { section: '💰 Wellness' },
  { href:'/money-management', icon:Wallet, label:'Money' },
  { href:'/mental-health', icon:Heart, label:'Mental Health' },
  { section: '📚 Content' },
  { href:'/journal', icon:PenLine, label:'Journal' },
  { href:'/voice-assistant', icon:Mic, label:'Voice Assistant' },
  { href:'/cv-builder', icon:FileText, label:'CV Builder' },
  { section: '🔐 Settings' },
  { href:'/privacy', icon:Shield, label:'Privacy' },
];

export default function Sidebar() {
  const path = usePathname();
  const { logout } = useAuth();
  const [dark, setDark] = useState(false);
  const [open, setOpen] = useState(false);
  const [unread, setUnread] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains('dark'));
    api.getNotifications().then(d => setUnread(d.unreadCount)).catch(()=>{});
    
    // Check if user is admin
    const user = localStorage.getItem('user');
    if (user) {
      try {
        const userData = JSON.parse(user);
        setIsAdmin(userData.role === 'admin');
      } catch (e) {}
    }
  }, []);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('pf_theme', next ? 'dark' : 'light');
  };

  const nav = (
    <>
      {/* Header */}
      <div className="px-4 py-6 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg">
            <Sparkles size={22} />
          </div>
          <div>
            <p className="font-bold text-lg">PersonaForge</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Shape Your Future</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-1">
        {isAdmin && (
          <>
            <div className="px-3 py-3 mt-0">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">⚙️ Administration</p>
            </div>
            <Link href="/admin"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                path === '/admin' || path.startsWith('/admin/')
                  ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg' 
                  : 'text-gray-600 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-gray-200'
              }`}>
              <Settings size={18}/> Admin Panel
            </Link>
          </>
        )}
        {links.map((l, idx) => {
          if (l.section) {
            return (
              <div key={idx} className="px-3 py-3 mt-4 first:mt-0">
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{l.section}</p>
              </div>
            );
          }
          const active = path === l.href;
          const Icon = (l as any).icon;
          return (
            <Link key={l.href} href={l.href!} onClick={()=>setOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                active 
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg' 
                  : 'text-gray-600 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-gray-200'
              }`}>
              {Icon && <Icon size={18}/>} {l.label}
              {active && <div className="absolute right-2 w-1.5 h-1.5 bg-white rounded-full"/>}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-slate-200 dark:border-slate-800 px-2 py-4 space-y-1">
        <button 
          onClick={toggleTheme} 
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-slate-800 w-full transition-all duration-200">
          {dark ? <Sun size={18}/> : <Moon size={18}/>} {dark ? 'Light' : 'Dark'}
        </button>
        <button 
          onClick={logout} 
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 w-full transition-all duration-200">
          <LogOut size={18}/> Logout
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 py-3 backdrop-blur-lg bg-white/90 dark:bg-slate-900/90">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white">
            <Sparkles size={20} />
          </div>
          <span className="font-bold text-sm">PersonaForge</span>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/dashboard" className="relative p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all">
            <Bell size={20}/>{unread > 0 && <span className="absolute top-1 right-1 w-3 h-3 bg-red-500 text-white text-[8px] flex items-center justify-center rounded-full animate-pulse">{unread > 9 ? '9+' : unread}</span>}
          </Link>
          <button onClick={()=>setOpen(!open)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all">{open ? <X size={22}/> : <Menu size={22}/>}</button>
        </div>
      </div>

      {/* Mobile sidebar overlay */}
      {open && <div className="lg:hidden fixed inset-0 z-30 bg-black/40 backdrop-blur-sm" onClick={()=>setOpen(false)}/>}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 z-30 h-screen w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col transition-all duration-300 lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'} lg:static lg:z-auto`}>
        {nav}
      </aside>
    </>
  );
}
