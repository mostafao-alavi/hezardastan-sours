import { getCloudflareContext } from '@opennextjs/cloudflare';
import { mockArticles, mockSources } from './mock-data';
import { Article, Source } from './types';

export interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement;
  first<T = Record<string, unknown>>(colName?: string): Promise<T | null>;
  all<T = Record<string, unknown>>(): Promise<{ results: T[]; success: boolean; meta?: unknown }>;
  run(): Promise<{ success: boolean; meta?: unknown }>;
}

export interface D1Database {
  prepare(query: string): D1PreparedStatement;
  batch<T = unknown>(statements: D1PreparedStatement[]): Promise<{ results?: T[]; success: boolean }[]>;
  exec(query: string): Promise<{ count: number; duration: number }>;
}

export interface CloudflareEnv {
  DB?: D1Database;
  [key: string]: unknown;
}

export const SCHEMA_STATEMENTS = [
  `CREATE TABLE IF NOT EXISTS sources (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    base_url TEXT NOT NULL,
    feed_url TEXT,
    discovery_type TEXT NOT NULL DEFAULT 'rss',
    polling_interval_minutes INTEGER NOT NULL DEFAULT 15,
    is_active INTEGER NOT NULL DEFAULT 1,
    health_status TEXT NOT NULL DEFAULT 'healthy',
    consecutive_failures INTEGER NOT NULL DEFAULT 0,
    extraction_rules_json TEXT,
    last_crawled_at TEXT,
    articles_count INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  )`,
  `CREATE INDEX IF NOT EXISTS idx_sources_slug ON sources(slug)`,
  `CREATE INDEX IF NOT EXISTS idx_sources_is_active ON sources(is_active)`,
  `CREATE TABLE IF NOT EXISTS articles (
    id TEXT PRIMARY KEY,
    source_id TEXT NOT NULL,
    source_name TEXT NOT NULL,
    source_slug TEXT NOT NULL,
    url TEXT NOT NULL UNIQUE,
    normalized_url TEXT NOT NULL,
    original_title TEXT NOT NULL,
    cleaned_title TEXT NOT NULL,
    author TEXT,
    published_at TEXT NOT NULL,
    discovered_at TEXT NOT NULL DEFAULT (datetime('now')),
    language TEXT NOT NULL DEFAULT 'fa',
    processing_status TEXT NOT NULL DEFAULT 'discovered',
    retry_count INTEGER NOT NULL DEFAULT 0,
    last_error TEXT,
    has_full_content INTEGER NOT NULL DEFAULT 0,
    canonical_url TEXT,
    content_json TEXT,
    seo_json TEXT,
    images_json TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (source_id) REFERENCES sources(id) ON DELETE CASCADE
  )`,
  `CREATE INDEX IF NOT EXISTS idx_articles_source_id ON articles(source_id)`,
  `CREATE INDEX IF NOT EXISTS idx_articles_url ON articles(url)`,
  `CREATE INDEX IF NOT EXISTS idx_articles_processing_status ON articles(processing_status)`,
  `CREATE INDEX IF NOT EXISTS idx_articles_discovered_at ON articles(discovered_at DESC)`
];

let isSchemaEnsured = false;

export async function ensureSchema(db: D1Database): Promise<void> {
  if (isSchemaEnsured) return;
  try {
    for (const sql of SCHEMA_STATEMENTS) {
      try {
        await db.prepare(sql).run();
      } catch {
        await db.exec(sql);
      }
    }
    isSchemaEnsured = true;
  } catch (error) {
    console.error('Failed to ensure D1 database schema:', error);
  }
}

export async function getD1Database(): Promise<D1Database | null> {
  try {
    const ctx = await getCloudflareContext({ async: true });
    if (ctx?.env && (ctx.env as CloudflareEnv).DB) {
      const db = (ctx.env as CloudflareEnv).DB!;
      await ensureSchema(db);
      return db;
    }
  } catch {
    // Falls back gracefully if running in standard Node.js development server
  }
  return null;
}

export interface SourceRow {
  id: string;
  name: string;
  slug: string;
  base_url: string;
  feed_url: string | null;
  discovery_type: string;
  polling_interval_minutes: number;
  is_active: number;
  health_status: string;
  consecutive_failures: number;
  extraction_rules_json: string | null;
  last_crawled_at: string | null;
  articles_count: number;
  created_at: string;
  updated_at: string;
}

export interface ArticleRow {
  id: string;
  source_id: string;
  source_name: string;
  source_slug: string;
  url: string;
  normalized_url: string;
  original_title: string;
  cleaned_title: string;
  author: string | null;
  published_at: string;
  discovered_at: string;
  language: string;
  processing_status: string;
  retry_count: number;
  last_error: string | null;
  has_full_content: number;
  canonical_url: string | null;
  content_json: string | null;
  seo_json: string | null;
  images_json: string | null;
  created_at: string;
  updated_at: string;
}

export function mapSourceRow(row: SourceRow): Source {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    baseUrl: row.base_url,
    feedUrl: row.feed_url || undefined,
    discoveryType: (row.discovery_type as Source['discoveryType']) || 'rss',
    pollingIntervalMinutes: row.polling_interval_minutes,
    isActive: Boolean(row.is_active),
    healthStatus: (row.health_status as Source['healthStatus']) || 'healthy',
    consecutiveFailures: row.consecutive_failures,
    extractionRulesJson: row.extraction_rules_json || undefined,
    lastCrawledAt: row.last_crawled_at || row.created_at,
    articlesCount: row.articles_count,
    createdAt: row.created_at,
  };
}

export function mapArticleRow(row: ArticleRow): Article {
  let content = undefined;
  if (row.content_json) {
    try {
      content = JSON.parse(row.content_json);
    } catch {
      // Ignore JSON parse error
    }
  }

  let seo = undefined;
  if (row.seo_json) {
    try {
      seo = JSON.parse(row.seo_json);
    } catch {
      // Ignore JSON parse error
    }
  }

  let images = undefined;
  if (row.images_json) {
    try {
      images = JSON.parse(row.images_json);
    } catch {
      // Ignore JSON parse error
    }
  }

  return {
    id: row.id,
    sourceId: row.source_id,
    sourceName: row.source_name,
    sourceSlug: row.source_slug,
    url: row.url,
    normalizedUrl: row.normalized_url,
    originalTitle: row.original_title,
    cleanedTitle: row.cleaned_title,
    author: row.author || undefined,
    publishedAt: row.published_at,
    discoveredAt: row.discovered_at,
    language: row.language,
    processingStatus: (row.processing_status as Article['processingStatus']) || 'discovered',
    retryCount: row.retry_count,
    lastError: row.last_error || undefined,
    hasFullContent: Boolean(row.has_full_content),
    canonicalUrl: row.canonical_url || undefined,
    content,
    seo,
    images,
  };
}

export async function fetchSources(db: D1Database | null): Promise<Source[]> {
  if (!db) {
    return process.env.NODE_ENV === 'production' ? [] : mockSources;
  }

  const querySources = async () => {
    const { results } = await db
      .prepare('SELECT * FROM sources ORDER BY created_at DESC')
      .all<SourceRow>();
    return (results || []).map(mapSourceRow);
  };

  try {
    return await querySources();
  } catch (error) {
    console.warn('Sources query failed, ensuring schema and retrying:', error);
    try {
      await ensureSchema(db);
      return await querySources();
    } catch (retryError) {
      console.error('Failed to fetch sources from D1 after schema ensure:', retryError);
      return [];
    }
  }
}

export async function insertSource(
  db: D1Database | null,
  data: Partial<Source> & { name: string; baseUrl: string }
): Promise<Source> {
  const now = new Date().toISOString();
  const id = data.id || `src-${Date.now().toString(36)}`;

  let slug = data.slug?.trim();
  if (!slug) {
    const transliterated = data.name
      .trim()
      .toLowerCase()
      .replace(/[\s_]+/g, '-')
      .replace(/[^\p{L}\p{N}-]/gu, '');
    slug = transliterated ? `${transliterated}-${Date.now().toString(36).slice(-4)}` : `src-${Date.now().toString(36)}`;
  }

  const discoveryType = data.discoveryType || 'rss';
  const pollingIntervalMinutes = data.pollingIntervalMinutes || 15;
  const isActive = data.isActive !== undefined ? (data.isActive ? 1 : 0) : 1;
  const healthStatus = data.healthStatus || 'healthy';
  const consecutiveFailures = data.consecutiveFailures || 0;
  const articlesCount = data.articlesCount || 0;

  if (db) {
    await db
      .prepare(
        `INSERT INTO sources (
          id, name, slug, base_url, feed_url, discovery_type,
          polling_interval_minutes, is_active, health_status,
          consecutive_failures, extraction_rules_json, last_crawled_at,
          articles_count, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .bind(
        id,
        data.name,
        slug,
        data.baseUrl,
        data.feedUrl || null,
        discoveryType,
        pollingIntervalMinutes,
        isActive,
        healthStatus,
        consecutiveFailures,
        data.extractionRulesJson || null,
        data.lastCrawledAt || now,
        articlesCount,
        now,
        now
      )
      .run();

    const inserted = await db
      .prepare('SELECT * FROM sources WHERE id = ?')
      .bind(id)
      .first<SourceRow>();

    if (inserted) {
      return mapSourceRow(inserted);
    }
  }

  return {
    id,
    name: data.name,
    slug,
    baseUrl: data.baseUrl,
    feedUrl: data.feedUrl,
    discoveryType,
    pollingIntervalMinutes,
    isActive: Boolean(isActive),
    healthStatus,
    consecutiveFailures,
    extractionRulesJson: data.extractionRulesJson,
    lastCrawledAt: data.lastCrawledAt || now,
    articlesCount,
    createdAt: now,
  };
}

export async function updateSourceById(
  db: D1Database | null,
  id: string,
  updates: Partial<Source>
): Promise<Source | null> {
  const now = new Date().toISOString();

  if (db) {
    const existing = await db
      .prepare('SELECT * FROM sources WHERE id = ?')
      .bind(id)
      .first<SourceRow>();

    if (!existing) {
      return null;
    }

    const fields: string[] = ['updated_at = ?'];
    const values: unknown[] = [now];

    if (updates.name !== undefined) {
      fields.push('name = ?');
      values.push(updates.name);
    }
    if (updates.slug !== undefined) {
      fields.push('slug = ?');
      values.push(updates.slug);
    }
    if (updates.baseUrl !== undefined) {
      fields.push('base_url = ?');
      values.push(updates.baseUrl);
    }
    if (updates.feedUrl !== undefined) {
      fields.push('feed_url = ?');
      values.push(updates.feedUrl);
    }
    if (updates.discoveryType !== undefined) {
      fields.push('discovery_type = ?');
      values.push(updates.discoveryType);
    }
    if (updates.pollingIntervalMinutes !== undefined) {
      fields.push('polling_interval_minutes = ?');
      values.push(updates.pollingIntervalMinutes);
    }
    if (updates.isActive !== undefined) {
      fields.push('is_active = ?');
      values.push(updates.isActive ? 1 : 0);
    }
    if (updates.healthStatus !== undefined) {
      fields.push('health_status = ?');
      values.push(updates.healthStatus);
    }
    if (updates.consecutiveFailures !== undefined) {
      fields.push('consecutive_failures = ?');
      values.push(updates.consecutiveFailures);
    }
    if (updates.extractionRulesJson !== undefined) {
      fields.push('extraction_rules_json = ?');
      values.push(updates.extractionRulesJson);
    }
    if (updates.lastCrawledAt !== undefined) {
      fields.push('last_crawled_at = ?');
      values.push(updates.lastCrawledAt);
    }
    if (updates.articlesCount !== undefined) {
      fields.push('articles_count = ?');
      values.push(updates.articlesCount);
    }

    values.push(id);

    await db
      .prepare(`UPDATE sources SET ${fields.join(', ')} WHERE id = ?`)
      .bind(...values)
      .run();

    const updated = await db
      .prepare('SELECT * FROM sources WHERE id = ?')
      .bind(id)
      .first<SourceRow>();

    return updated ? mapSourceRow(updated) : null;
  }

  // Mock fallback
  const index = mockSources.findIndex((s) => s.id === id);
  if (index === -1) return null;
  const updatedMock = { ...mockSources[index], ...updates };
  mockSources[index] = updatedMock;
  return updatedMock;
}

export async function fetchArticles(
  db: D1Database | null,
  options?: { sourceId?: string; limit?: number; offset?: number }
): Promise<Article[]> {
  if (!db) {
    if (process.env.NODE_ENV === 'production') return [];
    if (options?.sourceId) {
      return mockArticles.filter((a) => a.sourceId === options.sourceId);
    }
    return mockArticles;
  }

  const limit = options?.limit || 50;
  const offset = options?.offset || 0;

  const queryArticles = async () => {
    if (options?.sourceId) {
      const { results } = await db
        .prepare('SELECT * FROM articles WHERE source_id = ? ORDER BY published_at DESC LIMIT ? OFFSET ?')
        .bind(options.sourceId, limit, offset)
        .all<ArticleRow>();

      return (results || []).map(mapArticleRow);
    }

    const { results } = await db
      .prepare('SELECT * FROM articles ORDER BY published_at DESC LIMIT ? OFFSET ?')
      .bind(limit, offset)
      .all<ArticleRow>();

    return (results || []).map(mapArticleRow);
  };

  try {
    return await queryArticles();
  } catch (error) {
    console.warn('Articles query failed, ensuring schema and retrying:', error);
    try {
      await ensureSchema(db);
      return await queryArticles();
    } catch (retryError) {
      console.error('Failed to fetch articles from D1 after schema ensure:', retryError);
      return [];
    }
  }
}
