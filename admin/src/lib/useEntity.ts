import { useCallback, useEffect, useState } from "react";
import { supabase } from "./supabase";

export interface EntityState<T> {
  rows: T[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  insert: (row: Omit<T, "id">) => Promise<void>;
  update: (id: string, patch: Partial<T>) => Promise<void>;
  remove: (id: string) => Promise<void>;
}

export function useEntity<T extends { id?: string }>(
  table: string,
  orderBy: string = "display_order",
): EntityState<T> {
  const [rows, setRows] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    const { data, error } = await supabase
      .from(table)
      .select("*")
      .order(orderBy);
    if (error) setError(error.message);
    else setRows((data as T[]) || []);
    setLoading(false);
  }, [table, orderBy]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const insert = async (row: Omit<T, "id">) => {
    const { error } = await supabase.from(table).insert(row as Record<string, unknown>);
    if (error) throw new Error(error.message);
    await refresh();
  };

  const update = async (id: string, patch: Partial<T>) => {
    const { error } = await supabase.from(table).update(patch as Record<string, unknown>).eq("id", id);
    if (error) throw new Error(error.message);
    await refresh();
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from(table).delete().eq("id", id);
    if (error) throw new Error(error.message);
    await refresh();
  };

  return { rows, loading, error, refresh, insert, update, remove };
}
