'use client';

import React from 'react';
import {
  Clock,
  FileText,
  Globe2,
  TrendingUp,
} from 'lucide-react';
import { DashboardStats } from '@/lib/types';

interface StatsCardsProps {
  stats: DashboardStats;
}

export default function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      title: 'تعداد منابع فعال',
      value: stats.activeSourcesCount.toLocaleString('fa-IR'),
      subtitle: `از مجموع ${stats.totalSourcesCount.toLocaleString('fa-IR')} منبع تعریف‌شده`,
      icon: Globe2,
      bgLight: 'bg-blue-50',
      textAccent: 'text-blue-700',
    },
    {
      title: 'تعداد کل مقالات',
      value: stats.totalArticlesCount.toLocaleString('fa-IR'),
      subtitle: 'ذخیره‌شده در Cloudflare D1',
      icon: FileText,
      bgLight: 'bg-emerald-50',
      textAccent: 'text-emerald-700',
    },
    {
      title: 'تعداد مقالات جمع‌آوری‌شده امروز',
      value: stats.todayArticlesCount.toLocaleString('fa-IR'),
      subtitle: 'خزش و استخراج ۲۴ ساعت اخیر',
      icon: TrendingUp,
      bgLight: 'bg-indigo-50',
      textAccent: 'text-indigo-700',
    },
    {
      title: 'آخرین زمان اجرای جمع‌آوری',
      value: stats.lastRunTime || '۱۰ دقیقه پیش',
      subtitle: 'زمان اجرای دوره قبلی',
      icon: Clock,
      bgLight: 'bg-slate-100',
      textAccent: 'text-slate-700',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition hover:border-slate-300"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500">{card.title}</p>
                <h3 className="mt-2 text-2xl font-bold text-slate-900 tracking-tight">
                  {card.value}
                </h3>
              </div>
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${card.bgLight} ${card.textAccent}`}>
                <Icon className="h-5 w-5" />
              </div>
            </div>

            <div className="mt-3 border-t border-slate-100 pt-3 text-xs text-slate-400">
              {card.subtitle}
            </div>
          </div>
        );
      })}
    </div>
  );
}
