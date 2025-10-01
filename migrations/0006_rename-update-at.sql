-- Migration number: 0006 	 2025-10-01T04:19:51.107Z

ALTER TABLE keymaps RENAME COLUMN update_at TO updated_at;

ALTER TABLE keymaps_to_share RENAME COLUMN update_at TO updated_at;
