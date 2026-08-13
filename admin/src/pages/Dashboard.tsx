import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useAuth } from "../lib/auth";

interface Counts {
  menu: number;
  events: number;
  gallery: number;
  blog: number;
}

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

  const cards = [
    { label: "Menu Items", value: counts.menu, to: "/menu", emoji: "☕" },
    { label: "Events", value: counts.events, to: "/events", emoji: "📅" },
    { label: "Gallery Photos", value: counts.gallery, to: "/gallery", emoji: "🖼️" },
    { label: "Blog Posts", value: counts.blog, to: "/blog", emoji: "✍️" },
  ];

  return (
    <div className="max-w-5xl">
      <header className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-brand-brown">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">
          Welcome back{profile?.email ? `, ${profile.email}` : ""}. Manage your content below.
        </p>
      </header>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {cards.map((card) => (
          <Link key={card.to} to={card.to} className="card p-6 hover:shadow-lg hover:border-brand-gold/40 transition-all group">
            <div className="text-2xl mb-3">{card.emoji}</div>
            <div className="font-serif text-3xl font-bold text-brand-brown group-hover:text-brand-gold-dark transition-colors">
              {card.value}
            </div>
            <div className="text-xs text-gray-500 uppercase tracking-wider mt-1">{card.label}</div>
          </Link>
        ))}
      </div>

      <div className="card p-6">
        <h2 className="font-serif text-lg font-bold text-brand-brown mb-2">Quick Actions</h2>
        <p className="text-sm text-gray-500">
          Announcement last updated {updatedAt ? new Date(updatedAt).toLocaleString() : "—"}.
        </p>
        <div className="flex flex-wrap gap-3 mt-4">
          <Link to="/announcement" className="btn-primary">Edit Announcement</Link>
          <Link to="/site-info" className="btn-secondary">Edit Site Info</Link>
          <Link to="/page-copy" className="btn-secondary">Edit Page Copy</Link>
        </div>
      </div>
    </div>
  );
}
