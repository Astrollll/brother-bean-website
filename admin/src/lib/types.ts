export interface Profile {
  id: string;
  email: string | null;
  role: "owner" | "staff";
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface SiteContentRow {
  key: string;
  data: Record<string, unknown>;
  updated_at?: string;
}

export interface EventItem {
  id?: string;
  title: string;
  date: string;
  time: string;
  description: string;
  price: string;
  day: string;
  display_order: number;
  is_active: boolean;
}

export interface GalleryImage {
  id?: string;
  image_url: string;
  storage_path?: string | null;
  alt_text: string;
  caption: string;
  display_order: number;
  is_active: boolean;
}

export interface MenuItem {
  id?: string;
  name: string;
  description: string;
  price: string;
  category: string;
  display_order: number;
  is_active: boolean;
}

export interface BlogPost {
  id?: string;
  slug: string;
  title: string;
  description: string;
  body_markdown: string;
  published_at: string | null;
  is_active: boolean;
}
