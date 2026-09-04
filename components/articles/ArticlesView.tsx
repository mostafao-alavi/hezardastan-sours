'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  CheckCircle,
  Clock,
  Copy,
  ExternalLink,
  Eye,
  FileText,
  Globe,
  Image as ImageIcon,
  Info,
  Link2,
  RefreshCw,
  Search,
  User,
  X,
  XCircle,
} from 'lucide-react';
import { Article, ArticleProcessingStatus } from '@/lib/types';
import { getStatusBadge } from '../dashboard/RecentArticlesTable';

interface ArticlesViewProps {
  articles: Article[];
  selectedArticle: Article | null;
  onSelectArticle: (article: Article | null) => void;
  isLoading?: boolean;
  error?: string | null;
  onRefresh?: () => void;
}

export default function ArticlesView({
  articles,
  selectedArticle,
  onSelectArticle,
  isLoading = false,
  error = null,
  onRefresh,
}: ArticlesViewProps) {
  // Simple Filters
  const [searchTitle, setSearchTitle] = useState('');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modal active tab (strictly 3 tabs)
  const [modalTab, setModalTab] = useState<'content' | 'info' | 'images'>('content');
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 1500);
  };

  // Distinct source names
  const sourceOptions = Array.from(new Set(articles.map((a) => a.sourceName)));

  // Filter articles
  const filteredArticles = articles.filter((a) => {
    // جست‌وجو بر اساس عنوان
    const matchesTitle =
      !searchTitle.trim() ||
      a.cleanedTitle.toLowerCase().includes(searchTitle.toLowerCase()) ||
      a.originalTitle.toLowerCase().includes(searchTitle.toLowerCase());

    // فیلتر بر اساس منبع
    const matchesSource =
      sourceFilter === 'all' || a.sourceName === sourceFilter;

    // فیلتر بر اساس وضعیت
    const matchesStatus =
      statusFilter === 'all' || a.processingStatus === statusFilter;

    return matchesTitle && matchesSource && matchesStatus;
  });

  const handleOpenArticle = (art: Article) => {
    onSelectArticle(art);
    setModalTab('content'); // Default to Tab 1
  };

  return (
    <div className="space-y-6">
      {/* Top Title & Overview */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">صفحه مقالات</h1>
          <p className="text-xs text-slate-500 mt-1">
            فهرست مقالات ذخیره‌شده در پایگاه داده Cloudflare D1
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={isLoading}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 font-semibold text-slate-700 hover:bg-slate-50 transition shadow-2xs disabled:opacity-60 cursor-pointer"
              title="بارگذاری مجدد مقالات از D1"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin text-indigo-600' : 'text-slate-500'}`} />
              <span>تازه‌سازی D1</span>
            </button>
          )}
          <span className="rounded-lg bg-emerald-50 px-3 py-1.5 font-semibold text-emerald-700 border border-emerald-200">
            {articles.filter((a) => a.hasFullContent).length.toLocaleString('fa-IR')} مقاله با متن کامل
          </span>
          <span className="rounded-lg bg-slate-100 px-3 py-1.5 font-semibold text-slate-600">
            مجموع: {articles.length.toLocaleString('fa-IR')} مقاله
          </span>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="flex items-center justify-between gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs text-rose-800">
          <div className="flex items-center gap-2">
            <XCircle className="h-4 w-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="rounded-lg bg-rose-600 px-3 py-1 text-xs font-medium text-white hover:bg-rose-700 transition cursor-pointer"
            >
              تلاش مجدد
            </button>
          )}
        </div>
      )}

      {/* فیلترهای ساده (عنوان، منبع، وضعیت) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 rounded-2xl border border-slate-200 bg-white p-3.5 shadow-xs">
        {/* ۱. جست‌وجو بر اساس عنوان */}
        <div className="relative">
          <label className="block text-[11px] font-medium text-slate-500 mb-1">
            جست‌وجو بر اساس عنوان:
          </label>
          <div className="relative">
            <Search className="absolute right-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="کلمه‌ای از عنوان مقاله..."
              value={searchTitle}
              onChange={(e) => setSearchTitle(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pr-8 pl-3 text-xs text-slate-800 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none"
            />
          </div>
        </div>

        {/* ۲. فیلتر بر اساس منبع */}
        <div>
          <label className="block text-[11px] font-medium text-slate-500 mb-1">
            فیلتر بر اساس منبع:
          </label>
          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700 focus:border-indigo-500 focus:bg-white focus:outline-none"
          >
            <option value="all">همه منابع ({sourceOptions.length.toLocaleString('fa-IR')})</option>
            {sourceOptions.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* ۳. فیلتر بر اساس وضعیت */}
        <div>
          <label className="block text-[11px] font-medium text-slate-500 mb-1">
            فیلتر بر اساس وضعیت:
          </label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700 focus:border-indigo-500 focus:bg-white focus:outline-none"
          >
            <option value="all">همه وضعیت‌ها</option>
            <option value="ready_for_processor">ذخیره‌شده در D1</option>
            <option value="parsed">استخراج‌شده</option>
            <option value="queued">در صف</option>
            <option value="failed">خطا در دریافت</option>
          </select>
        </div>
      </div>

      {/* ستون‌های جدول: عنوان | منبع | تاریخ انتشار | تاریخ جمع‌آوری | وضعیت | مشاهده */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-50/80 text-slate-500 border-b border-slate-200/80 font-medium">
              <tr>
                <th className="py-3 px-4">عنوان</th>
                <th className="py-3 px-4">منبع</th>
                <th className="py-3 px-4">تاریخ انتشار</th>
                <th className="py-3 px-4">تاریخ جمع‌آوری</th>
                <th className="py-3 px-4">وضعیت</th>
                <th className="py-3 px-4 text-center">مشاهده</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    <div className="flex items-center justify-center gap-2">
                      <RefreshCw className="h-4 w-4 animate-spin text-indigo-600" />
                      <span>در حال دریافت مقالات از پایگاه داده Cloudflare D1...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredArticles.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    {articles.length === 0 ? (
                      <div className="flex flex-col items-center justify-center gap-1.5 py-4">
                        <FileText className="h-8 w-8 text-slate-300" />
                        <p className="text-xs font-semibold text-slate-700">
                          هنوز هیچ مقاله‌ای در پایگاه داده D1 ثبت نشده است.
                        </p>
                        <p className="text-[11px] text-slate-400">
                          پس از فعال‌سازی خزشگر در فاز بعدی، مقالات استخراج‌شده در اینجا ذخیره و نمایش داده خواهند شد.
                        </p>
                      </div>
                    ) : (
                      <span>مقاله‌ای با فیلترهای مشخص‌شده یافت نشد.</span>
                    )}
                  </td>
                </tr>
              ) : (
                filteredArticles.map((art) => (
                  <tr key={art.id} className="hover:bg-slate-50/70 transition">
                    {/* ستون ۱: عنوان */}
                    <td className="py-3.5 px-4 font-medium max-w-sm">
                      <div
                        className="font-semibold text-slate-900 leading-snug cursor-pointer hover:text-indigo-600 transition line-clamp-2"
                        title={art.originalTitle}
                        onClick={() => handleOpenArticle(art)}
                      >
                        {art.cleanedTitle}
                      </div>
                      <div className="text-[11px] text-slate-400 truncate max-w-[280px] mt-0.5" dir="ltr">
                        {art.normalizedUrl}
                      </div>
                    </td>

                    {/* ستون ۲: نام منبع */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="inline-block px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 font-medium">
                        {art.sourceName}
                      </span>
                    </td>

                    {/* ستون ۳: تاریخ انتشار */}
                    <td className="py-3.5 px-4 whitespace-nowrap text-slate-600">
                      {art.publishedAt}
                    </td>

                    {/* ستون ۴: تاریخ جمع‌آوری */}
                    <td className="py-3.5 px-4 whitespace-nowrap text-slate-500">
                      {art.discoveredAt}
                    </td>

                    {/* ستون ۵: وضعیت */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {getStatusBadge(art.processingStatus)}
                    </td>

                    {/* ستون ۶: مشاهده */}
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <button
                        onClick={() => handleOpenArticle(art)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 transition shadow-2xs cursor-pointer"
                      >
                        <Eye className="h-3.5 w-3.5 text-indigo-600" />
                        مشاهده
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal مشاهده مقاله (فقط ۳ تب: متن کامل | اطلاعات مقاله | تصاویر) */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-3xl max-h-[90vh] flex flex-col rounded-2xl border border-slate-200 bg-white shadow-2xl overflow-hidden animate-in zoom-in-95">
            {/* Modal Header */}
            <div className="flex items-start justify-between p-5 border-b border-slate-100 bg-slate-50/70">
              <div className="pr-1 max-w-xl">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="rounded-md bg-indigo-100 px-2 py-0.5 text-[11px] font-semibold text-indigo-800">
                    {selectedArticle.sourceName}
                  </span>
                  {getStatusBadge(selectedArticle.processingStatus)}
                </div>
                <h2 className="text-sm sm:text-base font-bold text-slate-900 leading-snug line-clamp-2">
                  {selectedArticle.cleanedTitle}
                </h2>
              </div>

              <button
                onClick={() => onSelectArticle(null)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-200 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Tabs Navigation (Strictly 3 Tabs) */}
            <div className="flex border-b border-slate-200 bg-white px-5 text-xs font-semibold">
              {/* تب اول: متن کامل */}
              <button
                onClick={() => setModalTab('content')}
                className={`flex items-center gap-2 py-3 px-4 border-b-2 transition ${
                  modalTab === 'content'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <FileText className="h-4 w-4" />
                تب اول: متن کامل
              </button>

              {/* تب دوم: اطلاعات مقاله */}
              <button
                onClick={() => setModalTab('info')}
                className={`flex items-center gap-2 py-3 px-4 border-b-2 transition ${
                  modalTab === 'info'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Info className="h-4 w-4" />
                تب دوم: اطلاعات مقاله
              </button>

              {/* تب سوم: تصاویر */}
              <button
                onClick={() => setModalTab('images')}
                className={`flex items-center gap-2 py-3 px-4 border-b-2 transition ${
                  modalTab === 'images'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <ImageIcon className="h-4 w-4" />
                تب سوم: تصاویر
                {selectedArticle.images && selectedArticle.images.length > 0 && (
                  <span className="rounded-full bg-slate-100 px-1.5 py-0.2 text-[10px] text-slate-600">
                    {selectedArticle.images.length}
                  </span>
                )}
              </button>
            </div>

            {/* Modal Content Body */}
            <div className="p-6 overflow-y-auto space-y-4 text-xs flex-1">
              {/* ===================== TAB 1: متن کامل ===================== */}
              {modalTab === 'content' && (
                <div className="space-y-4">
                  {/* ۱. عنوان */}
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide block mb-1">
                      عنوان مقاله:
                    </span>
                    <h3 className="text-base font-bold text-slate-900 leading-relaxed">
                      {selectedArticle.cleanedTitle}
                    </h3>
                  </div>

                  {/* ۲. خلاصه کوتاه در صورت وجود */}
                  {selectedArticle.content?.summary ? (
                    <div className="rounded-xl border border-indigo-100 bg-indigo-50/50 p-4">
                      <span className="text-[11px] font-bold text-indigo-900 block mb-1">
                        خلاصه کوتاه:
                      </span>
                      <p className="text-indigo-950 leading-relaxed text-xs">
                        {selectedArticle.content.summary}
                      </p>
                    </div>
                  ) : (
                    <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 text-[11px] text-slate-400">
                      خلاصه کوتاهی برای این مقاله ثبت نشده است.
                    </div>
                  )}

                  {/* ۳. متن کامل مقاله */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-bold text-slate-600">
                        متن کامل مقاله:
                      </span>
                      {selectedArticle.content?.wordCount && (
                        <span className="text-[11px] text-slate-400">
                          {selectedArticle.content.wordCount.toLocaleString('fa-IR')} کلمه • زمان مطالعه: حدود {selectedArticle.content.readingTimeMinutes || 2} دقیقه
                        </span>
                      )}
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-slate-50/40 p-5 leading-relaxed text-slate-800 whitespace-pre-line text-sm font-normal">
                      {selectedArticle.content?.plainText ||
                        'متن کامل مقاله استخراج نشده یا هنوز در صف پردازش قرار دارد.'}
                    </div>
                  </div>

                  {/* ۴. آدرس اصلی مقاله */}
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5">
                    <span className="text-[11px] font-bold text-slate-600 block mb-1">
                      آدرس اصلی مقاله:
                    </span>
                    <div className="flex items-center justify-between gap-2">
                      <a
                        href={selectedArticle.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-indigo-600 hover:underline truncate font-mono"
                        dir="ltr"
                      >
                        {selectedArticle.url}
                      </a>
                      <a
                        href={selectedArticle.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-medium text-slate-700 hover:bg-slate-100 shrink-0"
                      >
                        <ExternalLink className="h-3 w-3 text-slate-500" />
                        باز کردن لینک
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {/* ===================== TAB 2: اطلاعات مقاله ===================== */}
              {modalTab === 'info' && (
                <div className="space-y-3">
                  <div className="rounded-xl border border-slate-200 bg-white divide-y divide-slate-100 overflow-hidden">
                    {/* نویسنده */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 gap-2">
                      <div className="flex items-center gap-2 text-slate-500">
                        <User className="h-4 w-4 text-slate-400" />
                        <span className="font-medium">نویسنده:</span>
                      </div>
                      <span className="font-semibold text-slate-800">
                        {selectedArticle.author || 'ذکر نشده در منبع'}
                      </span>
                    </div>

                    {/* تاریخ انتشار */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 gap-2">
                      <div className="flex items-center gap-2 text-slate-500">
                        <Clock className="h-4 w-4 text-slate-400" />
                        <span className="font-medium">تاریخ انتشار:</span>
                      </div>
                      <span className="font-semibold text-slate-800">
                        {selectedArticle.publishedAt}
                      </span>
                    </div>

                    {/* تاریخ جمع‌آوری */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 gap-2">
                      <div className="flex items-center gap-2 text-slate-500">
                        <Clock className="h-4 w-4 text-slate-400" />
                        <span className="font-medium">تاریخ جمع‌آوری:</span>
                      </div>
                      <span className="font-semibold text-slate-800">
                        {selectedArticle.discoveredAt}
                      </span>
                    </div>

                    {/* نام منبع */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 gap-2">
                      <div className="flex items-center gap-2 text-slate-500">
                        <Globe className="h-4 w-4 text-slate-400" />
                        <span className="font-medium">نام منبع:</span>
                      </div>
                      <span className="font-semibold text-slate-800">
                        {selectedArticle.sourceName}
                      </span>
                    </div>

                    {/* URL اصلی */}
                    <div className="p-3.5 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-slate-500">URL اصلی:</span>
                        <button
                          onClick={() => handleCopy(selectedArticle.url, 'url')}
                          className="inline-flex items-center gap-1 text-[11px] text-slate-500 hover:text-indigo-600"
                        >
                          <Copy className="h-3 w-3" />
                          {copiedText === 'url' ? 'کپی شد' : 'کپی آدرس'}
                        </button>
                      </div>
                      <a
                        href={selectedArticle.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-indigo-600 hover:underline break-all font-mono block"
                        dir="ltr"
                      >
                        {selectedArticle.url}
                      </a>
                    </div>

                    {/* Canonical URL */}
                    <div className="p-3.5 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-slate-500">Canonical URL:</span>
                        <button
                          onClick={() =>
                            handleCopy(
                              selectedArticle.canonicalUrl ||
                                selectedArticle.seo?.canonicalUrl ||
                                selectedArticle.normalizedUrl,
                              'canonical'
                            )
                          }
                          className="inline-flex items-center gap-1 text-[11px] text-slate-500 hover:text-indigo-600"
                        >
                          <Copy className="h-3 w-3" />
                          {copiedText === 'canonical' ? 'کپی شد' : 'کپی آدرس'}
                        </button>
                      </div>
                      <a
                        href={
                          selectedArticle.canonicalUrl ||
                          selectedArticle.seo?.canonicalUrl ||
                          selectedArticle.normalizedUrl
                        }
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-indigo-600 hover:underline break-all font-mono block"
                        dir="ltr"
                      >
                        {selectedArticle.canonicalUrl ||
                          selectedArticle.seo?.canonicalUrl ||
                          selectedArticle.normalizedUrl}
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {/* ===================== TAB 3: تصاویر ===================== */}
              {modalTab === 'images' && (
                <div className="space-y-4">
                  {/* Notice: No uploads, pure URL metadata */}
                  <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-3 text-[11px] text-blue-900 leading-relaxed">
                    <span className="font-bold">قانون معماری ذخیره‌سازی: </span>
                    در این سیستم، هیچ فایل تصویری آپلود نشده و در Cloudflare R2 ذخیره نمی‌شود.
                    فقط متادیتای ساختاریافته و URLهای تصاویر از منبع اصلی استخراج و در دیتابیس D1 نگهداری می‌شوند.
                  </div>

                  {selectedArticle.images && selectedArticle.images.length > 0 ? (
                    <div className="space-y-4">
                      {selectedArticle.images.map((img, idx) => (
                        <div
                          key={img.id || idx}
                          className="rounded-xl border border-slate-200 bg-white p-4 space-y-3"
                        >
                          {/* Top Header of the image info */}
                          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                            <span className="font-bold text-slate-800">
                              تصویر شماره {(idx + 1).toLocaleString('fa-IR')}
                            </span>
                            {img.isFeatured && (
                              <span className="rounded-md bg-amber-50 border border-amber-200 px-2 py-0.5 text-[10px] font-bold text-amber-700">
                                تصویر شاخص (Featured)
                              </span>
                            )}
                          </div>

                          {/* Image Preview & URL Info */}
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
                            <div className="relative h-28 md:h-28 w-full rounded-lg overflow-hidden border border-slate-200 bg-slate-100">
                              <Image
                                src={img.imageUrl}
                                alt={img.altText || 'تصویر مقاله'}
                                fill
                                sizes="(max-width: 768px) 100vw, 200px"
                                referrerPolicy="no-referrer"
                                className="object-cover"
                              />
                            </div>

                            <div className="md:col-span-3 space-y-2">
                              {/* ۱. URL تصویر */}
                              <div>
                                <span className="text-[11px] font-bold text-slate-500 block mb-0.5">
                                  URL تصویر:
                                </span>
                                <div className="flex items-center gap-2">
                                  <a
                                    href={img.imageUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-[11px] text-indigo-600 hover:underline truncate font-mono block max-w-sm"
                                    dir="ltr"
                                  >
                                    {img.imageUrl}
                                  </a>
                                  <button
                                    onClick={() => handleCopy(img.imageUrl, `img-${idx}`)}
                                    className="inline-flex items-center gap-1 text-[10px] text-slate-400 hover:text-slate-600 shrink-0"
                                  >
                                    <Copy className="h-3 w-3" />
                                    {copiedText === `img-${idx}` ? 'کپی شد' : 'کپی'}
                                  </button>
                                </div>
                              </div>

                              {/* ۲. Alt & ۳. Title */}
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 border-t border-slate-100">
                                <div>
                                  <span className="text-[11px] font-medium text-slate-500 block">
                                    Alt (متن جایگزین):
                                  </span>
                                  <span className="text-slate-800 font-semibold">
                                    {img.altText || 'ندارد'}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-[11px] font-medium text-slate-500 block">
                                    Title (عنوان تصویر):
                                  </span>
                                  <span className="text-slate-800 font-semibold">
                                    {img.titleText || 'ندارد'}
                                  </span>
                                </div>
                              </div>

                              {/* ۴. Caption */}
                              <div className="pt-1 border-t border-slate-100">
                                <span className="text-[11px] font-medium text-slate-500 block">
                                  Caption (توضیحات):
                                </span>
                                <span className="text-slate-700">
                                  {img.caption || 'ندارد'}
                                </span>
                              </div>

                              {/* ۵. Width & ۶. Height */}
                              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100">
                                <div>
                                  <span className="text-[11px] font-medium text-slate-500 block">
                                    Width (عرض):
                                  </span>
                                  <span className="text-slate-800 font-semibold font-mono">
                                    {img.width ? `${img.width} px` : 'ثبت‌نشده'}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-[11px] font-medium text-slate-500 block">
                                    Height (ارتفاع):
                                  </span>
                                  <span className="text-slate-800 font-semibold font-mono">
                                    {img.height ? `${img.height} px` : 'ثبت‌نشده'}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 rounded-xl border border-dashed border-slate-200 text-slate-400">
                      هیچ اطلاعات تصویری برای این مقاله استخراج نشده است.
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between p-4 border-t border-slate-100 bg-slate-50 text-xs">
              <span className="text-[11px] text-slate-500">
                شناسه در D1: <code className="font-mono text-slate-700">{selectedArticle.id}</code>
              </span>
              <button
                onClick={() => onSelectArticle(null)}
                className="rounded-lg bg-slate-800 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-900 transition cursor-pointer"
              >
                بستن
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
