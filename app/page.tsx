'use client';

import React, { useState } from 'react';
import Header from '@/components/dashboard/Header';
import Sidebar from '@/components/dashboard/Sidebar';
import CollectionStatus from '@/components/dashboard/CollectionStatus';
import StatsCards from '@/components/dashboard/StatsCards';
import RecentArticlesTable from '@/components/dashboard/RecentArticlesTable';
import SourcesView from '@/components/sources/SourcesView';
import ArticlesView from '@/components/articles/ArticlesView';
import {
  mockArticles,
  mockDashboardStats,
  mockSources,
} from '@/lib/mock-data';
import { Article, NavigationTab, Source } from '@/lib/types';

export default function HomePage() {
  const [currentTab, setCurrentTab] = useState<NavigationTab>('dashboard');
  const [stats, setStats] = useState(mockDashboardStats);
  const [sources, setSources] = useState<Source[]>(mockSources);
  const [articles, setArticles] = useState<Article[]>(mockArticles);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Toggle active state of a source
  const handleToggleActive = (id: string) => {
    setSources((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          const newState = !s.isActive;
          showToast(`منبع «${s.name}» ${newState ? 'فعال' : 'غیرفعال'} شد.`);
          return { ...s, isActive: newState };
        }
        return s;
      })
    );
  };

  // Add source handler
  const handleAddSource = (newSourceData: Partial<Source>) => {
    const newSrc: Source = {
      id: newSourceData.id || `src-${Date.now()}`,
      name: newSourceData.name || 'منبع جدید',
      slug: newSourceData.slug || 'new-source',
      baseUrl: newSourceData.baseUrl || 'https://example.com',
      feedUrl: newSourceData.feedUrl,
      discoveryType: newSourceData.discoveryType || 'rss',
      pollingIntervalMinutes: newSourceData.pollingIntervalMinutes || 15,
      isActive: true,
      healthStatus: 'healthy',
      consecutiveFailures: 0,
      extractionRulesJson: newSourceData.extractionRulesJson,
      lastCrawledAt: 'هنوز اجرا نشده',
      articlesCount: 0,
      createdAt: 'امروز',
    };

    setSources((prev) => [newSrc, ...prev]);
    setStats((prev) => ({
      ...prev,
      totalSourcesCount: prev.totalSourcesCount + 1,
      activeSourcesCount: prev.activeSourcesCount + (newSrc.isActive ? 1 : 0),
    }));
    showToast(`منبع «${newSrc.name}» با موفقیت اضافه شد.`);
  };

  // Update source handler
  const handleUpdateSource = (id: string, updated: Partial<Source>) => {
    setSources((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          const newSource = { ...s, ...updated };
          showToast(`منبع «${newSource.name}» با موفقیت به‌روزرسانی شد.`);
          return newSource;
        }
        return s;
      })
    );
  };

  // Manual Trigger for a specific source
  const handleTriggerSource = (id: string) => {
    const targetSource = sources.find((s) => s.id === id);
    if (!targetSource) return;

    showToast(`درخواست جمع‌آوری برای منبع «${targetSource.name}» آغاز شد...`);

    setTimeout(() => {
      // Update the source's crawl time and articles count
      setSources((prev) =>
        prev.map((s) => {
          if (s.id === id) {
            return {
              ...s,
              lastCrawledAt: 'هم‌اکنون',
              articlesCount: s.articlesCount + 1,
            };
          }
          return s;
        })
      );

      // Create a new article under this source
      const newArticle: Article = {
        id: `art-${Date.now().toString().slice(-4)}`,
        sourceId: targetSource.id,
        sourceName: targetSource.name,
        sourceSlug: targetSource.slug,
        url: `${targetSource.baseUrl}/news/${Date.now().toString().slice(-6)}`,
        normalizedUrl: `${targetSource.baseUrl}/news/${Date.now().toString().slice(-6)}`,
        originalTitle: `گزارش خبری جدید و اختصاصی از ${targetSource.name}`,
        cleanedTitle: `گزارش تحلیلی و پایش رویدادها — ${targetSource.name}`,
        publishedAt: 'هم‌اکنون',
        discoveredAt: 'هم‌اکنون',
        language: 'fa',
        processingStatus: 'ready_for_processor',
        retryCount: 0,
        hasFullContent: true,
        content: {
          articleId: `art-${Date.now().toString().slice(-4)}`,
          plainText: `متن کامل گزارش خبری استخراج‌شده از ${targetSource.name}. این مقاله در خزش دستی دریافت و جهت پردازش‌های بعدی در جدول مقالات Cloudflare D1 با موفقیت ذخیره گردید.`,
          cleanedContentHtml: `<p>متن کامل گزارش خبری استخراج‌شده از ${targetSource.name}. این مقاله در خزش دستی دریافت و جهت پردازش‌های بعدی در جدول مقالات Cloudflare D1 با موفقیت ذخیره گردید.</p>`,
          summary: `چکیده گزارش استخراج‌شده از ${targetSource.name}.`,
          wordCount: 420,
          readingTimeMinutes: 2,
          contentHash: `hash-${Date.now()}`,
        },
      };

      setArticles((prev) => [newArticle, ...prev]);

      // Update dashboard stats
      setStats((prev) => ({
        ...prev,
        todayArticlesCount: prev.todayArticlesCount + 1,
        totalArticlesCount: prev.totalArticlesCount + 1,
        lastRunTime: 'هم‌اکنون',
      }));

      showToast(`جمع‌آوری «${targetSource.name}» تکمیل شد و مقاله جدید در D1 ذخیره گردید.`);
    }, 1200);
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
                    سامانه پایش منابع و ذخیره‌سازی محتوای کامل مقالات در Cloudflare D1
                  </p>
                </div>
                <div className="text-xs text-slate-400 font-mono">
                  نسخه ۱.۰.۰ — پایگاه داده Cloudflare D1
                </div>
              </div>

              {/* کارتهای آماری */}
              <StatsCards stats={stats} />

              {/* بخش وضعیت جمع‌آوری */}
              <CollectionStatus stats={stats} />

              {/* بخش آخرین مقالات */}
              <RecentArticlesTable
                articles={articles}
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
              onTriggerSource={handleTriggerSource}
            />
          )}

          {/* TAB 3: ARTICLES */}
          {currentTab === 'articles' && (
            <ArticlesView
              articles={articles}
              selectedArticle={selectedArticle}
              onSelectArticle={setSelectedArticle}
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
