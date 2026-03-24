CREATE TABLE IF NOT EXISTS agents (
  id          TEXT PRIMARY KEY,
  name        TEXT NOT NULL,
  provider    TEXT NOT NULL DEFAULT 'anthropic',
  model       TEXT NOT NULL,
  system_prompt TEXT NOT NULL DEFAULT '',
  color       TEXT NOT NULL DEFAULT '#6366f1',
  status      TEXT NOT NULL DEFAULT 'idle'
                CHECK(status IN ('idle','running','approval_required','completed','error','paused')),
  current_output TEXT,
  token_count INTEGER NOT NULL DEFAULT 0,
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS workflows (
  id          TEXT PRIMARY KEY,
  name        TEXT NOT NULL,
  graph       TEXT NOT NULL DEFAULT '{"nodes":[],"edges":[]}',
  is_active   INTEGER NOT NULL DEFAULT 0,
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS agent_logs (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  agent_id    TEXT NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
  level       TEXT NOT NULL DEFAULT 'info' CHECK(level IN ('info','warn','error')),
  message     TEXT NOT NULL,
  payload     TEXT,
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS app_settings (
  key         TEXT PRIMARY KEY,
  value       TEXT NOT NULL,
  updated_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT OR IGNORE INTO app_settings(key, value) VALUES
  ('ui_mode', 'menubar'),
  ('float_window_x', '100'),
  ('float_window_y', '100'),
  ('float_opacity', '100'),
  ('context_strategy', 'last_only');
