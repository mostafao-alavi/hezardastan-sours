'use client';

import React from 'react';
import {
  CheckCircle,
  Clock,
  Eye,
  FileCheck,
  XCircle,
} from 'lucide-react';
import { Article, ArticleProcessingStatus } from '@/lib/types';

interface RecentArticlesTableProps {
  articles: Article[];
  onSelectArticle: (article: Article) => void;
  onViewAll: () => void;
  isLoading?: boolean;
}

export function getStatusBadge(status: ArticleProcessingStatus) {
  switch (status) {
    case 'ready_for_processor':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <CheckCircle className="h-3 w-3" />
          ذخیره‌شده در D1
        </span>
      );
    case 'parsed':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
          <FileCheck className="h-3 w-3" />
          استخراج‌شده
        </span>
      );
    case 'queued':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
          <Clock className="h-3 w-3" />
          در صف
        </span>
      );
    case 'failed':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
          <XCircle className="h-3 w-3" />
          ناموفق
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
          {status}
        </span>
      );
  }
}

export default function RecentArticlesTable({
  articles,
  onSelectArticle,
  onViewAll,
  isLoading = false,
}: RecentArticlesTableProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
        <div>
          <h2 className="text-sm font-bold text-slate-800">آخرین مقالات</h2>
          <p className="text-xs text-slate-500">فهرست مقالات ذخیره‌شده در Cloudflare D1</p>
        </div>
        <button
          onClick={onViewAll}
          className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 hover:underline transition cursor-pointer"
        >
          مشاهده تمام مقالات ({articles.length.toLocaleString('fa-IR')})
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-right text-xs">
          <thead className="bg-slate-50 text-slate-600 border-b border-slate-100 font-semibold">
            <tr>
              <th className="py-3 px-4">عنوان مقاله</th>
              <th className="py-3 px-4">منبع</th>
              <th className="py-3 px-4">تاریخ انتشار</th>
              <th className="py-3 px-4">وضعیت</th>
              <th className="py-3 px-4 text-center">مشاهده</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {isLoading ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-slate-400">
                  در حال دریافت مقالات از D1...
                </td>
              </tr>
            ) : articles.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-slate-400">
                  هنوز مقاله‌ای در پایگاه داده D1 ذخیره نشده است (در انتظار اجرای خزشگر).
                </td>
              </tr>
            ) : (
              articles.slice(0, 6).map((art) => (
                <tr key={art.id} className="hover:bg-slate-50/70 transition">
                  <td className="py-3.5 px-4 font-medium max-w-sm">
                    <div className="truncate font-semibold text-slate-900" title={art.cleanedTitle}>
                      {art.cleanedTitle}
                    </div>
                    <div className="text-[11px] text-slate-400 truncate max-w-[260px] mt-0.5" dir="ltr">
                      {art.normalizedUrl}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="inline-block px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 font-medium">
                      {art.sourceName}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                    {art.publishedAt}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {getStatusBadge(art.processingStatus)}
                  </td>
                  <td className="py-3.5 px-4 text-center whitespace-nowrap">
                    <button
                      onClick={() => onSelectArticle(art)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 transition shadow-2xs cursor-pointer"
                    >
                      <Eye className="h-3.5 w-3.5" />
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
  );
}
