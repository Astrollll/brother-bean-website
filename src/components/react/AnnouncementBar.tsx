import React from "react";
import { useAnnouncement } from "../../lib/supabaseContent";
import { DEFAULT_ANNOUNCEMENT } from "../../lib/defaults";

export default function AnnouncementBar() {
  const { data } = useAnnouncement(DEFAULT_ANNOUNCEMENT);

  if (!data || data.is_active === false) return null;

  return (
    <div className="relative z-50 bg-gradient-to-r from-brand-gold-dark via-brand-gold to-brand-gold-dark text-brand-brown-darker text-center text-sm font-medium px-4 py-2.5">
      {data.message}
    </div>
  );
}
