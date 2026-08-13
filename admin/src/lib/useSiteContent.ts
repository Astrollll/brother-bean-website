import { useCallback, useEffect, useState } from "react";
import { supabase } from "./supabase";
import type { SiteContentRow } from "./types";

export function useSiteContent(key: string) {
  const [row, setRow] = useState<SiteContentRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("site_content")
      .select("*")
      .eq("key", key)
      .single();
    if (error && error.code !== "PGRST116") {
      setError(error.message);
    } else {
      setRow((data as SiteContentRow) || { key, data: {} });
      setError(null);
    }
    setLoading(false);
  }, [key]);

  useEffect(() => {
    load();
  }, [load]);

  const save = async (data: Record<string, unknown>) => {
    const { error } = await supabase
      .from("site_content")
      .upsert({ key, data }, { onConflict: "key" });
    if (error) throw new Error(error.message);
    await load();
  };

  return { row, loading, error, save };
}
