-- Migration number: 0003 	 2025-01-23T07:29:59.278Z
CREATE TABLE IF NOT EXISTS keymaps_to_share (
  share_id TEXT PRIMARY KEY,
  keymap_id TEXT NOT NULL,
  keymap_name TEXT NOT NULL,
  keymap_json TEXT NOT NULL,
  author_id TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  update_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (keymap_id) REFERENCES keymaps(keymap_id),
  FOREIGN KEY (author_id) REFERENCES users(user_id)
);