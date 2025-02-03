-- Migration number: 0002 	 2025-01-21T01:18:47.084Z
CREATE TABLE IF NOT EXISTS keymaps (
  keymap_id TEXT PRIMARY KEY,
  keymap_name TEXT NOT NULL,
  keymap_json TEXT NOT NULL,
  user_id TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  update_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);