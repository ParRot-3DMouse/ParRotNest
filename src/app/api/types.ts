export interface User {
  user_id: string;
  user_email: string;
  user_name: string;
  created_at: string;
  update_at: string;
}

export interface Keymap {
  keymap_id: string;
  keymap_name: string;
  keymap_json: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface KeymapToShare {
  share_id: string;
  keymap_name: string;
  keymap_json: string;
  author_id: string;
  created_at: string;
  updated_at: string;
}
