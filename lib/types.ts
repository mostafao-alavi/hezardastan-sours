export type DiscoveryType = 'rss' | 'sitemap' | 'listing' | 'api';

export type SourceHealth = 'healthy' | 'degraded' | 'failing';

export type ArticleProcessingStatus =
  | 'discovered'
  | 'queued'
  | 'fetched'
  | 'parsed'
  | 'ready_for_processor'
  | 'failed';

export type JobStatus = 'pending' | 'running' | 'completed' | 'failed';

export type TriggerType = 'cron' | 'manual' | 'retry';

export interface Source {
  id: string;
  name: string;
  slug: string;
  baseUrl: string;
  feedUrl?: string;
  discoveryType: DiscoveryType;
  pollingIntervalMinutes: number;
  isActive: boolean;
  healthStatus: SourceHealth;
  consecutiveFailures: number;
  extractionRulesJson?: string;
  lastCrawledAt: string;
  articlesCount: number;
  createdAt: string;
}

export interface ArticleContent {
  articleId: string;
  rawContentHtml?: string;
  cleanedContentHtml: string;
  plainText: string;
  summary: string;
  wordCount: number;
  readingTimeMinutes: number;
  contentHash: string;
}

export interface ArticleSeo {
  articleId: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string[];
  canonicalUrl: string;
  metaRobots: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  ogType: string;
  twitterCard: string;
  schemaType?: string;
}

export interface ArticleImage {
  id: string;
  articleId: string;
  imageUrl: string;
  altText: string;
  titleText?: string;
  caption?: string;
  credit?: string;
  isFeatured: boolean;
  sortOrder: number;
  width?: number;
  height?: number;
}

export interface Article {
  id: string;
  sourceId: string;
  sourceName: string;
  sourceSlug: string;
  url: string;
  normalizedUrl: string;
  originalTitle: string;
  cleanedTitle: string;
  author?: string;
  publishedAt: string;
  discoveredAt: string;
  language: string;
  processingStatus: ArticleProcessingStatus;
  retryCount: number;
  lastError?: string;
  hasFullContent: boolean;
  canonicalUrl?: string;
  content?: ArticleContent;
  seo?: ArticleSeo;
  images?: ArticleImage[];
}

export interface CrawlJob {
  id: string;
  triggerType: TriggerType;
  sourceId?: string;
  sourceName?: string;
  articleUrl?: string;
  articleTitle?: string;
  status: JobStatus;
  startedAt: string;
  completedAt?: string;
  retryCount: number;
  errorMessage?: string;
  durationMs?: number;
  details?: string;
}

export interface DashboardStats {
  activeSourcesCount: number;
  totalSourcesCount: number;
  totalArticlesCount: number;
  todayArticlesCount: number;
  processingJobsCount: number;
  failedJobsCount: number;
  lastRunTime: string;
  nextRunTime: string;
  sourcesCheckedCount: number;
  newArticlesCount: number;
  errorsCount: number;
  fullContentSuccessRate: number;
}

export type NavigationTab = 'dashboard' | 'sources' | 'articles';
