import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { supabase } from "../lib/supabase";
import { useProfile } from "../lib/useProfile";
import type { Profile } from "../lib/types";

interface AuthContextValue {
  sessionUser: { id: string; email: string | undefined } | null;
  profile: Profile | null;
  profileLoading: boolean;
  isAdmin: boolean;
  isOwner: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [sessionUser, setSessionUser] = useState<AuthContextValue["sessionUser"]>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSessionUser(
        data.session
          ? { id: data.session.user.id, email: data.session.user.email ?? undefined }
          : null,
      );
      setReady(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setSessionUser(
        session ? { id: session.user.id, email: session.user.email ?? undefined } : null,
      );
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const { profile, loading: profileLoading, refresh } = useProfile(sessionUser?.id);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error(error.message);
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const isAdmin = Boolean(profile?.is_active && (profile.role === "owner" || profile.role === "staff"));
  const isOwner = profile?.role === "owner" && profile.is_active;

  const value: AuthContextValue = {
    sessionUser,
    profile,
    profileLoading: profileLoading || !ready,
    isAdmin,
    isOwner,
    signIn,
    signOut,
    refreshProfile: refresh,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
