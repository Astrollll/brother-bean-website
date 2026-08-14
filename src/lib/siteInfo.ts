// Hydrates static page elements from Supabase site content.
// Mark elements with data-sf="path.to.field" (from the site_content row's
// `data` object) and optionally data-sf-attr to set an attribute instead of
// text content. Loaded on every page via the site Layout.

import { supabase } from "./supabase";
import type { SiteInfo } from "./defaults";
import { DEFAULT_SITE_INFO } from "./defaults";

export interface SFData {
  announcement?: Record<string, unknown>;
  site_info?: SiteInfo;
  page_copy?: Record<string, unknown>;
  home_sections?: Record<string, unknown>;
}

function getPath(obj: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>((acc, key) => {
    if (acc === null || acc === undefined) return undefined;
    return (acc as Record<string, unknown>)[key];
  }, obj);
}

export async function applySiteContent(rows: SFData): Promise<void> {
  const elements = Array.from(document.querySelectorAll<HTMLElement>("[data-sf]"));
  if (!elements.length) return;

  for (const el of elements) {
    const path = el.dataset.sf || "";
    const attr = el.dataset.sfAttr;
    const value = getPath(rows, path);

    if (value === undefined || value === null) continue;

    if (attr) {
      const isUrl = typeof value === "string" && value.startsWith("http");
      if (attr === "href" && isUrl) el.setAttribute(attr, value);
      else if (attr === "src" && typeof value === "string") el.setAttribute(attr, value);
      else el.setAttribute(attr, String(value));
    } else {
      el.textContent = String(value);
    }
  }
}

export async function hydrateSiteContent(): Promise<void> {
  if (!supabase) return;

  const elements = Array.from(document.querySelectorAll<HTMLElement>("[data-sf]"));
  if (!elements.length) return;
  elements.forEach((el) => el.classList.add("sf-loading"));

  try {
    const { data } = await supabase.from("site_content").select("key,data");

    if (!data || !data.length) return;

    const rows: SFData = {};
    for (const row of data) {
      rows[row.key as keyof SFData] = row.data;
    }
    await applySiteContent(rows);
  } finally {
    elements.forEach((el) => el.classList.remove("sf-loading"));
  }
}

export { DEFAULT_SITE_INFO };
