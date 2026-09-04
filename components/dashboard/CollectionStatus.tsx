'use client';

import React, { useState } from 'react';
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Play,
  RefreshCw,
  Zap,
} from 'lucide-react';
import { DashboardStats } from '@/lib/types';

interface CollectionStatusProps {
  stats: DashboardStats;
}

export default function CollectionStatus({ stats }: CollectionStatusProps) {
  // Current runtime state: allows testing the 4 exact states easily
  const [isCollecting, setIsCollecting] = useState(false);
  const [lastRunSuccess, setLastRunSuccess] = useState(true);

  const toggleCollecting = () => {
    setIsCollecting((prev) => !prev);
  };

  const toggleLastRunResult = () => {
    setLastRunSuccess((prev) => !prev);
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-sm font-bold text-slate-800">وضعیت جمع‌آوری</h2>
          <p className="text-xs text-slate-500">وضعیت کارکرد سیستم و نتیجه آخرین اجرای موتور خزش</p>
        </div>

        {/* Quick state toggles for testing */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleCollecting}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              isCollecting
                ? 'bg-amber-50 text-amber-800 border border-amber-200'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <RefreshCw className={`h-3 w-3 ${isCollecting ? 'animate-spin' : ''}`} />
            {isCollecting ? 'تغییر به آماده' : 'شبیه‌سازی «در حال جمع‌آوری»'}
          </button>

          <button
            onClick={toggleLastRunResult}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              lastRunSuccess
                ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}
          >
            {lastRunSuccess ? 'تست وضعیت «ناموفق»' : 'تغییر به «موفق»'}
          </button>
        </div>
      </div>

      {/* 4 Status Indicator Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
        {/* 1. فعال */}
        <div className="flex items-center justify-between p-3.5 rounded-xl border border-emerald-100 bg-emerald-50/50">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
            </span>
            <div>
              <span className="text-xs font-semibold text-emerald-900 block">فعال</span>
              <span className="text-[11px] text-emerald-700">سیستم آماده و در مدار</span>
            </div>
          </div>
          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full">
            آنلاین
          </span>
        </div>

        {/* 2. در حال جمع‌آوری */}
        <div
          className={`flex items-center justify-between p-3.5 rounded-xl border transition ${
            isCollecting
              ? 'border-indigo-200 bg-indigo-50/70'
              : 'border-slate-200 bg-slate-50/60'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div
              className={`flex h-6 w-6 items-center justify-center rounded-md ${
                isCollecting ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-500'
              }`}
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isCollecting ? 'animate-spin' : ''}`} />
            </div>
            <div>
              <span
                className={`text-xs font-semibold block ${
                  isCollecting ? 'text-indigo-900' : 'text-slate-700'
                }`}
              >
                {isCollecting ? 'در حال جمع‌آوری' : 'در انتظار دوره بعدی'}
              </span>
              <span className="text-[11px] text-slate-500">
                {isCollecting ? 'دریافت محتوا از منابع...' : 'فاصله بررسی: ۱۵ دقیقه'}
              </span>
            </div>
          </div>
          <span
            className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
              isCollecting
                ? 'bg-indigo-100 text-indigo-800'
                : 'bg-slate-200 text-slate-600'
            }`}
          >
            {isCollecting ? 'فعال' : 'آماده'}
          </span>
        </div>

        {/* 3. آخرین اجرا موفق */}
        <div
          className={`flex items-center justify-between p-3.5 rounded-xl border transition ${
            lastRunSuccess
              ? 'border-emerald-200 bg-emerald-50/40'
              : 'border-slate-100 bg-slate-50/40 opacity-60'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div
              className={`flex h-6 w-6 items-center justify-center rounded-md ${
                lastRunSuccess ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-400'
              }`}
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
            </div>
            <div>
              <span
                className={`text-xs font-semibold block ${
                  lastRunSuccess ? 'text-emerald-900' : 'text-slate-600'
                }`}
              >
                آخرین اجرا موفق
              </span>
              <span className="text-[11px] text-slate-500">
                {stats.lastRunTime || '۱۰ دقیقه پیش'}
              </span>
            </div>
          </div>
          {lastRunSuccess && (
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
              تأیید شد
            </span>
          )}
        </div>

        {/* 4. آخرین اجرا ناموفق */}
        <div
          className={`flex items-center justify-between p-3.5 rounded-xl border transition ${
            !lastRunSuccess
              ? 'border-rose-200 bg-rose-50/70'
              : 'border-slate-100 bg-slate-50/40 opacity-60'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div
              className={`flex h-6 w-6 items-center justify-center rounded-md ${
                !lastRunSuccess ? 'bg-rose-600 text-white' : 'bg-slate-200 text-slate-400'
              }`}
            >
              <AlertTriangle className="h-3.5 w-3.5" />
            </div>
            <div>
              <span
                className={`text-xs font-semibold block ${
                  !lastRunSuccess ? 'text-rose-900' : 'text-slate-600'
                }`}
              >
                آخرین اجرا ناموفق
              </span>
              <span className="text-[11px] text-slate-500">
                {!lastRunSuccess ? 'خطای شبکه یا پاسخ منبع' : 'هیچ خطایی ثبت نشده'}
              </span>
            </div>
          </div>
          {!lastRunSuccess && (
            <span className="text-[11px] font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full">
              نیازمند بررسی
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
