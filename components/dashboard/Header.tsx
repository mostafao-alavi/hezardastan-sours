'use client';

import React, { useState } from 'react';
import {
  Bell,
  Database,
  Wifi,
  X,
} from 'lucide-react';

interface HeaderProps {
  // Clean minimal header
}

export default function Header({}: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'خزش دوره‌ای با موفقیت پایان یافت',
      time: '۱۰ دقیقه پیش',
      type: 'success',
    },
    {
      id: 2,
      title: '۲۳ مقاله جدید در دیتابیس D1 ذخیره شد',
      time: '۱۰ دقیقه پیش',
      type: 'info',
    },
  ]);

  const clearNotification = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur-md sm:px-6">
      {/* Title & Branding */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-800 text-white shadow-sm shadow-indigo-200">
          <Database className="h-5 w-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-slate-900 tracking-tight">هزار دستان</h1>
            <span className="rounded-md border border-indigo-100 bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700">
              موتور جمع‌آوری محتوا
            </span>
          </div>
          <p className="text-xs text-slate-500">پلتفرم جمع‌آوری و مدیریت محتوای کامل وب در Cloudflare D1</p>
        </div>
      </div>

      {/* Center / System Status Pill */}
      <div className="hidden lg:flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-600">
        <div className="flex items-center gap-1.5 font-medium text-emerald-700">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
          </span>
          دیتابیس D1 متصل
        </div>
        <span className="text-slate-300">|</span>
        <span className="flex items-center gap-1 text-slate-500">
          <Wifi className="h-3 w-3" />
          پایش دوره‌ای فعال
        </span>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50"
            aria-label="اعلان‌ها"
          >
            <Bell className="h-4 w-4" />
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white">
                {notifications.length}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute left-0 mt-2 w-80 rounded-xl border border-slate-200 bg-white p-3 shadow-xl z-50">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2">
                <span className="text-xs font-bold text-slate-800">رویدادهای اخیر سیستم</span>
                <span className="text-[10px] text-slate-400">{notifications.length} اعلان</span>
              </div>
              <div className="space-y-2">
                {notifications.length === 0 ? (
                  <p className="text-center py-4 text-xs text-slate-400">اعلان جدیدی وجود ندارد</p>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      className="group flex items-start justify-between rounded-lg p-2 text-xs bg-slate-50 hover:bg-slate-100 transition"
                    >
                      <div>
                        <p className="font-medium text-slate-700 leading-snug">{n.title}</p>
                        <span className="text-[10px] text-slate-400 mt-1 inline-block">{n.time}</span>
                      </div>
                      <button
                        onClick={() => clearNotification(n.id)}
                        className="text-slate-400 hover:text-slate-600 mr-1"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* System Profile Tag */}
        <div className="hidden sm:flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-2.5 py-1">
          <div className="h-6 w-6 rounded-full bg-slate-800 text-white flex items-center justify-center text-[10px] font-bold">
            CF
          </div>
          <div className="text-right">
            <div className="text-[11px] font-semibold text-slate-800">Cloudflare D1</div>
            <div className="text-[9px] text-slate-400">Database Ready</div>
          </div>
        </div>
      </div>
    </header>
  );
}
