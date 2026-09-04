'use client';

import React, { useState } from 'react';
import {
  CheckCircle2,
  ExternalLink,
  Globe,
  Pencil,
  Play,
  Plus,
  Power,
  RefreshCw,
  Search,
  SlidersHorizontal,
  X,
  XCircle,
} from 'lucide-react';
import { DiscoveryType, Source } from '@/lib/types';

interface SourcesViewProps {
  sources: Source[];
  onToggleActive: (id: string) => void;
  onAddSource: (newSource: Partial<Source>) => void;
  onUpdateSource?: (id: string, updated: Partial<Source>) => void;
  onTriggerSource?: (id: string) => void;
}

export default function SourcesView({
  sources,
  onToggleActive,
  onAddSource,
  onUpdateSource,
  onTriggerSource,
}: SourcesViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSource, setEditingSource] = useState<Source | null>(null);
  const [runningSourceId, setRunningSourceId] = useState<string | null>(null);

  // Form State (strictly MVP fields)
  const [formName, setFormName] = useState('');
  const [formBaseUrl, setFormBaseUrl] = useState('');
  const [formFeedUrl, setFormFeedUrl] = useState('');
  const [formDiscoveryType, setFormDiscoveryType] = useState<DiscoveryType>('rss');
  const [formIsActive, setFormIsActive] = useState<boolean>(true);

  // Filter sources
  const filteredSources = sources.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.baseUrl.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.feedUrl && s.feedUrl.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesType =
      filterType === 'all' || s.discoveryType === filterType;

    return matchesSearch && matchesType;
  });

  // Open Add Modal
  const handleOpenAddModal = () => {
    setEditingSource(null);
    setFormName('');
    setFormBaseUrl('');
    setFormFeedUrl('');
    setFormDiscoveryType('rss');
    setFormIsActive(true);
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (source: Source) => {
    setEditingSource(source);
    setFormName(source.name);
    setFormBaseUrl(source.baseUrl);
    setFormFeedUrl(source.feedUrl || '');
    setFormDiscoveryType(
      source.discoveryType === 'api' ? 'rss' : source.discoveryType
    );
    setFormIsActive(source.isActive);
    setIsModalOpen(true);
  };

  // Save (Add or Update)
  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formBaseUrl.trim()) return;

    if (editingSource) {
      // Update existing
      if (onUpdateSource) {
        onUpdateSource(editingSource.id, {
          name: formName.trim(),
          baseUrl: formBaseUrl.trim(),
          feedUrl: formFeedUrl.trim() || undefined,
          discoveryType: formDiscoveryType,
          isActive: formIsActive,
        });
      }
    } else {
      // Add new
      onAddSource({
        name: formName.trim(),
        baseUrl: formBaseUrl.trim(),
        feedUrl: formFeedUrl.trim() || undefined,
        discoveryType: formDiscoveryType,
        isActive: formIsActive,
      });
    }

    setIsModalOpen(false);
  };

  // Manual Trigger for a single source
  const handleTrigger = (id: string) => {
    if (runningSourceId) return;
    setRunningSourceId(id);
    if (onTriggerSource) {
      onTriggerSource(id);
    }
    setTimeout(() => {
      setRunningSourceId(null);
    }, 1500);
  };

  // Helper badge for discovery type
  const getDiscoveryBadge = (type: DiscoveryType) => {
    switch (type) {
      case 'rss':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            RSS
          </span>
        );
      case 'sitemap':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            Sitemap
          </span>
        );
      case 'listing':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-purple-50 text-purple-700 border border-purple-200">
            Listing Page
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
            {type}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">مدیریت منابع</h1>
          <p className="text-xs text-slate-500 mt-1">
            سایت‌ها و فیدهای خبری هدف برای جمع‌آوری و استخراج خودکار مقالات
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm shadow-indigo-200 hover:bg-indigo-700 transition active:scale-98"
        >
          <Plus className="h-4 w-4" />
          افزودن منبع
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between rounded-2xl border border-slate-200 bg-white p-3 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="absolute right-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="جستجو در نام، آدرس سایت یا فید..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pr-9 pl-3 text-xs text-slate-800 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-slate-500 flex items-center gap-1">
            <SlidersHorizontal className="h-3.5 w-3.5 text-slate-400" />
            نوع کشف:
          </span>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-700 focus:outline-none"
          >
            <option value="all">همه انواع ({sources.length.toLocaleString('fa-IR')})</option>
            <option value="rss">RSS</option>
            <option value="sitemap">Sitemap</option>
            <option value="listing">Listing Page</option>
          </select>
        </div>
      </div>

      {/* Sources Table */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-50/80 text-slate-500 border-b border-slate-200/80 font-medium">
              <tr>
                <th className="py-3 px-4">نام منبع</th>
                <th className="py-3 px-4">آدرس اصلی سایت</th>
                <th className="py-3 px-4">آدرس RSS یا Sitemap</th>
                <th className="py-3 px-4">نوع کشف محتوا</th>
                <th className="py-3 px-4">وضعیت</th>
                <th className="py-3 px-4 text-center">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredSources.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400 text-xs">
                    منبعی با مشخصات جستجو شده یافت نشد.
                  </td>
                </tr>
              ) : (
                filteredSources.map((source) => {
                  const isRunning = runningSourceId === source.id;

                  return (
                    <tr
                      key={source.id}
                      className={`hover:bg-slate-50/70 transition ${
                        !source.isActive ? 'bg-slate-50/40 opacity-75' : ''
                      }`}
                    >
                      {/* نام منبع */}
                      <td className="py-3.5 px-4 font-semibold text-slate-900 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 text-indigo-700">
                            <Globe className="h-4 w-4" />
                          </div>
                          <span>{source.name}</span>
                        </div>
                      </td>

                      {/* آدرس اصلی سایت */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <a
                          href={source.baseUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-slate-600 hover:text-indigo-600 inline-flex items-center gap-1 font-mono text-[11px]"
                          dir="ltr"
                        >
                          {source.baseUrl}
                          <ExternalLink className="h-3 w-3 text-slate-400" />
                        </a>
                      </td>

                      {/* آدرس RSS یا Sitemap */}
                      <td className="py-3.5 px-4 max-w-xs">
                        {source.feedUrl ? (
                          <a
                            href={source.feedUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-indigo-600 hover:underline truncate block font-mono text-[11px]"
                            dir="ltr"
                            title={source.feedUrl}
                          >
                            {source.feedUrl}
                          </a>
                        ) : (
                          <span className="text-slate-400 text-[11px]">—</span>
                        )}
                      </td>

                      {/* نوع کشف محتوا */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {getDiscoveryBadge(source.discoveryType)}
                      </td>

                      {/* وضعیت فعال یا غیرفعال */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <button
                          onClick={() => onToggleActive(source.id)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition cursor-pointer ${
                            source.isActive
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                              : 'bg-slate-100 text-slate-500 border border-slate-200 hover:bg-slate-200'
                          }`}
                          title="کلیک برای تغییر وضعیت فعال/غیرفعال"
                        >
                          <span
                            className={`h-2 w-2 rounded-full ${
                              source.isActive ? 'bg-emerald-500' : 'bg-slate-400'
                            }`}
                          ></span>
                          {source.isActive ? 'فعال' : 'غیرفعال'}
                        </button>
                      </td>

                      {/* عملیات: اجرای دستی جمع‌آوری + ویرایش + تغییر وضعیت */}
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* اجرای دستی جمع‌آوری */}
                          <button
                            onClick={() => handleTrigger(source.id)}
                            disabled={!source.isActive || isRunning}
                            className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition ${
                              isRunning
                                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                : source.isActive
                                ? 'bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100'
                                : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                            }`}
                            title={
                              source.isActive
                                ? 'اجرای دستی جمع‌آوری برای این منبع'
                                : 'منبع غیرفعال است'
                            }
                          >
                            <RefreshCw
                              className={`h-3.5 w-3.5 ${isRunning ? 'animate-spin' : ''}`}
                            />
                            {isRunning ? 'در حال اجرا...' : 'اجرای جمع‌آوری'}
                          </button>

                          {/* ویرایش منبع */}
                          <button
                            onClick={() => handleOpenEditModal(source)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 text-xs font-medium transition"
                            title="ویرایش اطلاعات منبع"
                          >
                            <Pencil className="h-3.5 w-3.5 text-slate-500" />
                            ویرایش
                          </button>

                          {/* فعال / غیرفعال کردن سریع */}
                          <button
                            onClick={() => onToggleActive(source.id)}
                            className={`p-1.5 rounded-lg border transition ${
                              source.isActive
                                ? 'border-slate-200 bg-white text-slate-500 hover:text-rose-600 hover:border-rose-200'
                                : 'border-slate-200 bg-white text-slate-400 hover:text-emerald-600 hover:border-emerald-200'
                            }`}
                            title={source.isActive ? 'غیرفعال‌سازی' : 'فعال‌سازی'}
                          >
                            <Power className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: افزودن یا ویرایش منبع */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl animate-in zoom-in-95">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-700">
                  <Globe className="h-4 w-4" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">
                  {editingSource ? 'ویرایش منبع' : 'افزودن منبع جدید'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmitForm} className="space-y-4 mt-4 text-xs">
              {/* نام منبع */}
              <div>
                <label className="block text-slate-700 font-medium mb-1">
                  نام منبع *
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثال: خبرگزاری ایرنا"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-indigo-500 focus:outline-none"
                />
              </div>

              {/* آدرس اصلی سایت */}
              <div>
                <label className="block text-slate-700 font-medium mb-1">
                  آدرس اصلی سایت *
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://example.com"
                  value={formBaseUrl}
                  onChange={(e) => setFormBaseUrl(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs font-mono focus:border-indigo-500 focus:outline-none"
                  dir="ltr"
                />
              </div>

              {/* نوع کشف محتوا */}
              <div>
                <label className="block text-slate-700 font-medium mb-1">
                  نوع کشف محتوا *
                </label>
                <select
                  value={formDiscoveryType}
                  onChange={(e) =>
                    setFormDiscoveryType(e.target.value as DiscoveryType)
                  }
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs focus:border-indigo-500 focus:outline-none"
                >
                  <option value="rss">RSS (فید اخبار)</option>
                  <option value="sitemap">Sitemap (نقشه سایت XML)</option>
                  <option value="listing">Listing Page (صفحات فهرست آرشیو)</option>
                </select>
              </div>

              {/* آدرس RSS یا Sitemap */}
              <div>
                <label className="block text-slate-700 font-medium mb-1">
                  آدرس RSS یا Sitemap
                </label>
                <input
                  type="url"
                  placeholder={
                    formDiscoveryType === 'rss'
                      ? 'https://example.com/rss'
                      : formDiscoveryType === 'sitemap'
                      ? 'https://example.com/sitemap.xml'
                      : 'https://example.com/archive'
                  }
                  value={formFeedUrl}
                  onChange={(e) => setFormFeedUrl(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs font-mono focus:border-indigo-500 focus:outline-none"
                  dir="ltr"
                />
                <p className="mt-1 text-[11px] text-slate-400">
                  {formDiscoveryType === 'listing'
                    ? 'اختیاری: آدرس صفحه آرشیو مقالات'
                    : 'آدرس مستقیم فایل RSS یا نقشه سایت'}
                </p>
              </div>

              {/* وضعیت فعال یا غیرفعال */}
              <div className="pt-2 border-t border-slate-100">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={formIsActive}
                    onChange={(e) => setFormIsActive(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-slate-800 font-medium">منبع فعال باشد</span>
                  <span className="text-slate-400 text-[11px]">
                    (در دوره‌های جمع‌آوری خودکار بررسی می‌شود)
                  </span>
                </label>
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700 transition"
                >
                  {editingSource ? 'ذخیره تغییرات' : 'افزودن منبع'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
