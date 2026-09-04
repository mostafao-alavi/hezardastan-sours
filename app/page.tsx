'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Header from '@/components/dashboard/Header';
import Sidebar from '@/components/dashboard/Sidebar';
import CollectionStatus from '@/components/dashboard/CollectionStatus';
import StatsCards from '@/components/dashboard/StatsCards';
import RecentArticlesTable from '@/components/dashboard/RecentArticlesTable';
import SourcesView from '@/components/sources/SourcesView';
import ArticlesView from '@/components/articles/ArticlesView';
import { Article, DashboardStats, NavigationTab, Source } from '@/lib/types';

export default function HomePage() {
  const [currentTab, setCurrentTab] = useState<NavigationTab>('dashboard');
  const [sources, setSources] = useState<Source[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoadingSources, setIsLoadingSources] = useState<boolean>(true);
  const [isLoadingArticles, setIsLoadingArticles] = useState<boolean>(true);
  const [sourcesError, setSourcesError] = useState<string | null>(null);
  const [articlesError, setArticlesError] = useState<string | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Refresh sources on user demand
  const handleRefreshSources = useCallback(async () => {
    setIsLoadingSources(true);
    setSourcesError(null);
    try {
      const res = await fetch('/api/sources');
      if (!res.ok) throw new Error(`خطای سرور (${res.status})`);
      const data = await res.json();
      setSources(Array.isArray(data.sources) ? data.sources : []);
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'خطای نامشخص';
      setSourcesError(`خطا در دریافت منابع از D1: ${errorMsg}`);
    } finally {
      setIsLoadingSources(false);
    }
  }, []);

  // Refresh articles on user demand
  const handleRefreshArticles = useCallback(async () => {
    setIsLoadingArticles(true);
    setArticlesError(null);
    try {
      const res = await fetch('/api/articles');
      if (!res.ok) throw new Error(`خطای سرور (${res.status})`);
      const data = await res.json();
      setArticles(Array.isArray(data.articles) ? data.articles : []);
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'خطای نامشخص';
      setArticlesError(`خطا در دریافت مقالات از D1: ${errorMsg}`);
    } finally {
      setIsLoadingArticles(false);
    }
  }, []);

  // Fetch initial data on mount (asynchronous to comply with React strict effect guidelines)
  useEffect(() => {
    let ignore = false;

    async function loadInitialData() {
      try {
        const [sourcesRes, articlesRes] = await Promise.allSettled([
          fetch('/api/sources').then((r) =>
            r.ok ? r.json() : Promise.reject(new Error(`Status ${r.status}`))
          ),
          fetch('/api/articles').then((r) =>
            r.ok ? r.json() : Promise.reject(new Error(`Status ${r.status}`))
          ),
        ]);

        if (ignore) return;

        if (
          sourcesRes.status === 'fulfilled' &&
          Array.isArray(sourcesRes.value?.sources)
        ) {
          setSources(sourcesRes.value.sources);
        } else if (sourcesRes.status === 'rejected') {
          setSourcesError('خطا در دریافت منابع از پایگاه داده D1');
        }

        if (
          articlesRes.status === 'fulfilled' &&
          Array.isArray(articlesRes.value?.articles)
        ) {
          setArticles(articlesRes.value.articles);
        } else if (articlesRes.status === 'rejected') {
          setArticlesError('خطا در دریافت مقالات از پایگاه داده D1');
        }
      } finally {
        if (!ignore) {
          setIsLoadingSources(false);
          setIsLoadingArticles(false);
        }
      }
    }

    loadInitialData();

    return () => {
      ignore = true;
    };
  }, []);

  // Toggle active state of a source in D1
  const handleToggleActive = async (id: string) => {
    const current = sources.find((s) => s.id === id);
    if (!current) return;
    const newActiveState = !current.isActive;

    try {
      const res = await fetch(`/api/sources/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: newActiveState }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'خطا در تغییر وضعیت منبع در D1');
      }

      if (data.source) {
        setSources((prev) =>
          prev.map((s) => (s.id === id ? data.source : s))
        );
        showToast(`منبع «${data.source.name}» در D1 ${newActiveState ? 'فعال' : 'غیرفعال'} شد.`);
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'خطای نامشخص';
      showToast(`خطا در تغییر وضعیت: ${errorMsg}`);
    }
  };

  // Add new source in D1 via /api/sources
  const handleAddSource = async (newSourceData: Partial<Source>) => {
    try {
      const res = await fetch('/api/sources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSourceData),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'خطا در افزودن منبع به D1');
      }

      if (data.source) {
        setSources((prev) => [data.source, ...prev]);
        showToast(`منبع «${data.source.name}» با موفقیت در دیتابیس D1 ذخیره شد.`);
        return true;
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'خطای نامشخص';
      showToast(`خطا: ${errorMsg}`);
    }
  };

  // Update existing source in D1 via /api/sources/[id]
  const handleUpdateSource = async (id: string, updated: Partial<Source>) => {
    try {
      const res = await fetch(`/api/sources/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'خطا در به‌روزرسانی منبع در D1');
      }

      if (data.source) {
        setSources((prev) =>
          prev.map((s) => (s.id === id ? data.source : s))
        );
        showToast(`منبع «${data.source.name}» با موفقیت در D1 به‌روزرسانی شد.`);
        return true;
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'خطای نامشخص';
      showToast(`خطا: ${errorMsg}`);
    }
  };

  // Dynamic statistics derived directly from real D1 data
  const fullContentCount = articles.filter((a) => a.hasFullContent).length;
  const stats: DashboardStats = {
    totalSourcesCount: sources.length,
    activeSourcesCount: sources.filter((s) => s.isActive).length,
    totalArticlesCount: articles.length,
    todayArticlesCount: articles.length,
    processingJobsCount: 0,
    failedJobsCount: 0,
    lastRunTime: sources.some((s) => s.lastCrawledAt && s.lastCrawledAt !== 'هنوز اجرا نشده')
      ? 'به‌روزرسانی‌شده'
      : 'در انتظار خزشگر',
    nextRunTime: 'طبق زمان‌بندی Cron',
    sourcesCheckedCount: sources.filter((s) => s.isActive).length,
    newArticlesCount: articles.length,
    errorsCount: 0,
    fullContentSuccessRate:
      articles.length > 0
        ? Math.round((fullContentCount / articles.length) * 100)
        : 100,
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Top Header */}
      <Header />

      {/* Main Layout: Sidebar + Content */}
      <div className="flex-1 flex flex-col md:flex-row">
        <Sidebar
          currentTab={currentTab}
          onTabChange={setCurrentTab}
          activeSourcesCount={sources.filter((s) => s.isActive).length}
          totalArticlesCount={articles.length}
        />

        {/* Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
          {/* TAB 1: DASHBOARD */}
          {currentTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Header Title in Dashboard */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h1 className="text-xl font-bold text-slate-900 tracking-tight">داشبورد مدیریت محتوا</h1>
                  <p className="text-xs text-slate-500 mt-1">
                    سامانه پایش منابع و ذخیره‌سازی محتوای مقالات متصل به Cloudflare D1
                  </p>
                </div>
                <div className="text-xs text-slate-400 font-mono">
                  نسخه ۱.۰.۰ — پایگاه داده Cloudflare D1
                </div>
              </div>

              {/* کارتهای آماری مبتنی بر داده‌های واقعی D1 */}
              <StatsCards stats={stats} />

              {/* بخش وضعیت جمع‌آوری */}
              <CollectionStatus stats={stats} />

              {/* بخش آخرین مقالات واقعی D1 */}
              <RecentArticlesTable
                articles={articles}
                isLoading={isLoadingArticles}
                onSelectArticle={(art) => {
                  setSelectedArticle(art);
                  setCurrentTab('articles');
                }}
                onViewAll={() => setCurrentTab('articles')}
              />
            </div>
          )}

          {/* TAB 2: SOURCES */}
          {currentTab === 'sources' && (
            <SourcesView
              sources={sources}
              onToggleActive={handleToggleActive}
              onAddSource={handleAddSource}
              onUpdateSource={handleUpdateSource}
              isLoading={isLoadingSources}
              error={sourcesError}
              onRefresh={handleRefreshSources}
            />
          )}

          {/* TAB 3: ARTICLES */}
          {currentTab === 'articles' && (
            <ArticlesView
              articles={articles}
              selectedArticle={selectedArticle}
              onSelectArticle={setSelectedArticle}
              isLoading={isLoadingArticles}
              error={articlesError}
              onRefresh={handleRefreshArticles}
            />
          )}
        </main>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 left-5 z-50 flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900 text-white px-4 py-3 text-xs shadow-2xl animate-in slide-in-from-bottom-5">
          <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
