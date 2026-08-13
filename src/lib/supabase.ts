// Shared Supabase client for the public site (client-side reads).
// Configure via VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY (set in
// .env or Cloudflare Pages build settings). The anon key is safe to expose.

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const hasSupabase = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = hasSupabase ? createClient(supabaseUrl!, supabaseAnonKey!) : null;
