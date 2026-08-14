// Client-side hooks for the public site. Each hook fetches from Supabase
// with the provided defaults as instant fallback (and error fallback).

import { useEffect, useState } from "react";
import { supabase } from "./supabase";
import type {
  Announcement,
  BlogPost,
  EventItem,
  GalleryImage,
  MenuItem,
  PageCopy,
  SiteInfo,
} from "./defaults";

type QueryState<T> = { data: T; loading: boolean };

function useSupabaseQuery<T>(query: () => Promise<T | null>, initial: T): QueryState<T> {
  const [data, setData] = useState<T>(initial);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }
    let active = true;
    query()
      .then((result) => {
        if (active) setData(result as T);
      })
      .catch(() => {
        if (active) setData(initial);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return { data, loading };
}

export function useAnnouncement(initial: Announcement): QueryState<Announcement> {
  return useSupabaseQuery(async () => {
    const { data, error } = await supabase!
      .from("site_content")
      .select("data")
      .eq("key", "announcement")
      .maybeSingle();
    if (error) throw error;
    const announcement = data?.data as Announcement | undefined;
    if (!announcement || announcement.is_active === false) return null;
    return announcement;
  }, initial);
}

export function useSiteInfo(initial: SiteInfo): QueryState<SiteInfo> {
  return useSupabaseQuery(async () => {
    const { data, error } = await supabase!
      .from("site_content")
      .select("data")
      .eq("key", "site_info")
      .maybeSingle();
    if (error) throw error;
    const info = data?.data as SiteInfo | undefined;
    if (!info) return null;
    return { ...initial, ...info };
  }, initial);
}

export function usePageCopy(initial: PageCopy): QueryState<PageCopy> {
  return useSupabaseQuery(async () => {
    const { data, error } = await supabase!
      .from("site_content")
      .select("data")
      .eq("key", "page_copy")
      .maybeSingle();
    if (error) throw error;
    const copy = data?.data as PageCopy | undefined;
    if (!copy) return null;
    return { ...initial, ...copy };
  }, initial);
}

export function useMenu(initial: MenuItem[]): QueryState<MenuItem[]> {
  return useSupabaseQuery(async () => {
    const { data, error } = await supabase!
      .from("menu_items")
      .select("*")
      .eq("is_active", true)
      .order("display_order");
    if (error) throw error;
    return data as MenuItem[];
  }, initial);
}

export function useEvents(initial: EventItem[]): QueryState<EventItem[]> {
  return useSupabaseQuery(async () => {
    const { data, error } = await supabase!
      .from("events")
      .select("*")
      .eq("is_active", true)
      .order("display_order");
    if (error) throw error;
    return data as EventItem[];
  }, initial);
}

export function useGallery(initial: GalleryImage[]): QueryState<GalleryImage[]> {
  return useSupabaseQuery(async () => {
    const { data, error } = await supabase!
      .from("gallery_images")
      .select("*")
      .eq("is_active", true)
      .order("display_order");
    if (error) throw error;
    return data as GalleryImage[];
  }, initial);
}

export function useBlogPosts(initial: BlogPost[]): QueryState<BlogPost[]> {
  return useSupabaseQuery(async () => {
    const { data, error } = await supabase!
      .from("blog_posts")
      .select("*")
      .eq("is_active", true)
      .order("published_at", { ascending: false });
    if (error) throw error;
    return data as BlogPost[];
  }, initial);
}
