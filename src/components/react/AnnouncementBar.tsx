import React, { useState } from "react";
import { useAnnouncement } from "../../lib/supabaseContent";
import { DEFAULT_ANNOUNCEMENT } from "../../lib/defaults";

const STORAGE_KEY = "bb-announcement-dismissed";

export default function AnnouncementBar() {
  const { data, loading } = useAnnouncement(DEFAULT_ANNOUNCEMENT);

  const [dismissed, setDismissed] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch {
      return null;
    }
  });

  if (loading) return null;
  if (!data || data.is_active === false) return null;
  if (dismissed === data.message) return null;

  const dismiss = () => {
    try {
      localStorage.setItem(STORAGE_KEY, data.message);
    } catch {
      /* storage unavailable — just hide for this session */
    }
    setDismissed(data.message);
  };

  return (
    <div className="relative z-50 bg-gradient-to-r from-brand-gold-dark via-brand-gold to-brand-gold-dark text-brand-brown-darker text-center text-sm font-medium pl-4 pr-12 py-2.5">
      <span>{data.message}</span>
      <button
        type="button"
        onClick={dismiss}
        aria-label="Dismiss announcement"
        className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-brand-brown-darker/60 hover:text-brand-brown-darker hover:bg-black/10 transition-colors duration-200 cursor-pointer"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M18 6 6 18"></path>
          <path d="m6 6 12 12"></path>
        </svg>
      </button>
    </div>
  );
}
