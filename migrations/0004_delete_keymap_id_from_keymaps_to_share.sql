-- Migration number: 0004 	 2025-01-23T07:49:17.191Z
DROP TABLE keymaps_to_share;

CREATE TABLE IF NOT EXISTS keymaps_to_share (
  share_id TEXT PRIMARY KEY,
  keymap_name TEXT NOT NULL,
  keymap_json TEXT NOT NULL,
  author_id INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  update_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (author_id) REFERENCES users(user_id)
);