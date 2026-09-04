-- Migration number: 0001 	 2026-09-04T02:29:23.185Z
CREATE TABLE IF NOT EXISTS sources (
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
);

CREATE INDEX IF NOT EXISTS idx_sources_slug ON sources(slug);
CREATE INDEX IF NOT EXISTS idx_sources_is_active ON sources(is_active);

CREATE TABLE IF NOT EXISTS articles (
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
);

CREATE INDEX IF NOT EXISTS idx_articles_source_id ON articles(source_id);
CREATE INDEX IF NOT EXISTS idx_articles_url ON articles(url);
CREATE INDEX IF NOT EXISTS idx_articles_processing_status ON articles(processing_status);
CREATE INDEX IF NOT EXISTS idx_articles_discovered_at ON articles(discovered_at DESC);
