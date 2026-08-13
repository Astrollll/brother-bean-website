import { useEffect, useState } from "react";
import { supabase } from "./supabase";
import type { Profile } from "./types";

export function useProfile(userId: string | undefined) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }
    let active = true;
    supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single()
      .then(({ data, error }) => {
        if (!active) return;
        if (!error && data) setProfile(data as Profile);
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [userId]);

  const refresh = async () => {
    if (!userId) return;
    const { data } = await supabase.from("profiles").select("*").eq("id", userId).single();
    if (data) setProfile(data as Profile);
  };

  return { profile, loading, refresh };
}
