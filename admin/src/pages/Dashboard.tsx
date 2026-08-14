import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useAuth } from "../lib/auth";
import { PageHeader } from "../components/ui";
import { Icon, type IconName } from "../components/icons";

interface Counts {
  menu: number;
  events: number;
  gallery: number;
  blog: number;
}

const cardMeta: { key: keyof Counts; label: string; to: string; icon: IconName }[] = [
  { key: "menu", label: "Menu Items", to: "/menu", icon: "coffee" },
  { key: "events", label: "Events", to: "/events", icon: "calendar" },
  { key: "gallery", label: "Gallery Photos", to: "/gallery", icon: "image" },
  { key: "blog", label: "Blog Posts", to: "/blog", icon: "pen" },
];

export default function Dashboard() {
  const { profile } = useAuth();
  const [counts, setCounts] = useState<Counts>({ menu: 0, events: 0, gallery: 0, blog: 0 });
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      supabase.from("menu_items").select("id", { count: "exact", head: true }),
      supabase.from("events").select("id", { count: "exact", head: true }),
      supabase.from("gallery_images").select("id", { count: "exact", head: true }),
      supabase.from("blog_posts").select("id", { count: "exact", head: true }),
    ]).then(([m, e, g, b]) => {
      setCounts({
        menu: m.count ?? 0,
        events: e.count ?? 0,
        gallery: g.count ?? 0,
        blog: b.count ?? 0,
      });
    });
    supabase
      .from("site_content")
      .select("updated_at")
      .eq("key", "announcement")
      .single()
      .then(({ data }) => setUpdatedAt(data?.updated_at ?? null));
  }, []);

  const name = profile?.email ? profile.email.split("@")[0].replace(/[._-]/g, " ") : "there";

  return (
    <div className="max-w-5xl animate-fade-in-up">
      <PageHeader
        title="Dashboard"
        subtitle={`Welcome back, ${name}. Here's what's live on the Brother Bean site.`}
      />

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cardMeta.map((card) => (
          <Link
            key={card.to}
            to={card.to}
            className="card group relative overflow-hidden p-5 hover:shadow-lg hover:border-brand-gold/40 transition-all"
          >
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-brand-gold/10 transition-transform group-hover:scale-125" />
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-cream text-brand-gold-dark ring-1 ring-brand-cream-dark mb-4">
              <Icon name={card.icon} className="w-5 h-5" />
            </div>
            <div className="font-serif text-3xl font-bold text-brand-brown group-hover:text-brand-gold-dark transition-colors">
              {counts[card.key]}
            </div>
            <div className="text-xs text-gray-500 uppercase tracking-wider mt-1 flex items-center gap-1">
              {card.label}
              <Icon name="arrowRight" className="w-3.5 h-3.5 opacity-0 -ml-1 transition-all group-hover:opacity-100 group-hover:ml-0" />
            </div>
          </Link>
        ))}
      </div>

      <div className="card p-6 sm:p-8">
        <h2 className="font-serif text-lg font-bold text-brand-brown mb-1">Quick Actions</h2>
        <p className="text-sm text-gray-500">
          Announcement last updated{" "}
          <span className="text-brand-brown font-medium">
            {updatedAt ? new Date(updatedAt).toLocaleString() : "—"}
          </span>
          .
        </p>
        <div className="flex flex-wrap gap-3 mt-5">
          <Link to="/announcement" className="btn-primary">
            Edit Announcement
          </Link>
          <Link to="/site-info" className="btn-secondary">
            Edit Site Info
          </Link>
          <Link to="/page-copy" className="btn-secondary">
            Edit Page Copy
          </Link>
        </div>
      </div>
    </div>
  );
}
