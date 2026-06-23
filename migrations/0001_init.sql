CREATE TABLE IF NOT EXISTS entries (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  prompt TEXT NOT NULL,
  category TEXT NOT NULL,
  tags_json TEXT NOT NULL DEFAULT '[]',
  cover_image_key TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  is_public INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS entry_images (
  id TEXT PRIMARY KEY,
  entry_id TEXT NOT NULL REFERENCES entries(id) ON DELETE CASCADE,
  image_key TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_entries_public_created_at
  ON entries(is_public, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_entries_category
  ON entries(category);

CREATE INDEX IF NOT EXISTS idx_entry_images_entry_id
  ON entry_images(entry_id, sort_order);
