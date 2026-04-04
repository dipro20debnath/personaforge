'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  useEffect(() => {
    if (!localStorage.getItem('pf_token')) router.push('/login');
  }, [router]);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 dark:from-slate-950 dark:via-blue-950 dark:to-slate-950">
      <Sidebar />
      <main className="flex-1 lg:ml-0 mt-14 lg:mt-0 overflow-y-auto">
        <div className="min-h-screen flex flex-col">
          {/* Main Content */}
          <div className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-8">
            {children}
          </div>
          
          {/* Premium Footer */}
          <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 bg-opacity-50 dark:bg-opacity-50 backdrop-blur-md mt-auto">
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                © 2026 PersonaForge — <span className="gradient-text font-semibold">Shape Your Future</span>
              </p>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
}
