-- Migration number: 0001 	 2025-01-20T13:14:57.135Z
CREATE TABLE IF NOT EXISTS users (
  user_id TEXT PRIMARY KEY,
  user_email TEXT UNIQUE,
  user_name TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);