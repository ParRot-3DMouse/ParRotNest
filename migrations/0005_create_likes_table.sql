-- Migration number: 0005 	 2025-01-25T05:31:38.071Z
CREATE TABLE likes (
  share_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (share_id) REFERENCES keymaps_to_share(share_id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(user_id),
  PRIMARY KEY (share_id, user_id)
);