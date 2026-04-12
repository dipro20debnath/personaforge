'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  BarChart3, 
  Users, 
  FileText, 
  Settings, 
  AlertCircle, 
  TrendingUp,
  ChevronRight
} from 'lucide-react';

export default function AdminSidebar() {
  const pathname = usePathname();

  const adminMenuItems = [
    {
      label: 'Dashboard',
      href: '/admin',
      icon: BarChart3,
    },
    {
      label: 'Users',
      href: '/admin/users',
      icon: Users,
    },
    {
      label: 'Analytics',
      href: '/admin/analytics',
      icon: TrendingUp,
    },
    {
      label: 'Content',
      href: '/admin/content',
      icon: FileText,
    },
    {
      label: 'Logs',
      href: '/admin/logs',
      icon: AlertCircle,
    },
    {
      label: 'Settings',
      href: '/admin/settings',
      icon: Settings,
    },
  ];

  const isActive = (href) => {
    return pathname === href || pathname.startsWith(href + '/');
  };

  return (
    <aside className="fixed left-0 top-16 bottom-0 w-64 bg-gradient-to-b from-slate-900 to-slate-800 text-white overflow-y-auto shadow-2xl">
      <nav className="p-4 space-y-2">
        {adminMenuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                active
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
              {active && <ChevronRight className="w-4 h-4 ml-auto" />}
            </Link>
          );
        })}
      </nav>

      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-700">
        <div className="bg-slate-700 rounded-lg p-3">
          <p className="text-xs text-slate-300">Admin Panel</p>
          <p className="text-sm font-semibold text-white">PersonaForge</p>
        </div>
      </div>
    </aside>
  );
}
