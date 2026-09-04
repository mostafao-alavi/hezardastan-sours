'use client';

import React from 'react';
import {
  FileText,
  Globe2,
  LayoutDashboard,
} from 'lucide-react';
import { NavigationTab } from '@/lib/types';

interface SidebarProps {
  currentTab: NavigationTab;
  onTabChange: (tab: NavigationTab) => void;
  activeSourcesCount: number;
  totalArticlesCount: number;
}

export default function Sidebar({
  currentTab,
  onTabChange,
  activeSourcesCount,
  totalArticlesCount,
}: SidebarProps) {
  const menuItems: {
    id: NavigationTab;
    label: string;
    icon: React.ElementType;
    badge?: number | string;
    badgeColor?: string;
  }[] = [
    {
      id: 'dashboard',
      label: 'داشبورد',
      icon: LayoutDashboard,
    },
    {
      id: 'sources',
      label: 'منابع',
      icon: Globe2,
      badge: activeSourcesCount,
      badgeColor: 'bg-indigo-100 text-indigo-700',
    },
    {
      id: 'articles',
      label: 'مقالات',
      icon: FileText,
      badge: totalArticlesCount,
      badgeColor: 'bg-emerald-100 text-emerald-700',
    },
  ];

  return (
    <aside className="w-full md:w-64 shrink-0 border-b md:border-b-0 md:border-l border-slate-200 bg-white flex flex-col justify-between py-5 px-3">
      <div>
        {/* Navigation Menu */}
        <div className="text-[11px] font-semibold text-slate-400 px-3 mb-2 uppercase tracking-wider">
          بخش‌های اصلی
        </div>
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                      isActive ? 'bg-indigo-500 text-white' : item.badgeColor || 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Info */}
      <div className="pt-4 border-t border-slate-100 px-3">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>پایگاه داده:</span>
          <span className="font-mono text-[11px] text-slate-700 font-medium">Cloudflare D1</span>
        </div>
        <div className="flex items-center justify-between text-xs text-slate-500 mt-1.5">
          <span>وضعیت پایش:</span>
          <span className="font-medium text-[11px] text-emerald-600">فعال (پایش دوره‌ای)</span>
        </div>
      </div>
    </aside>
  );
}
