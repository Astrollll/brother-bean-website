import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../lib/auth";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: "🏠" },
  { to: "/announcement", label: "Announcement", icon: "📢" },
  { to: "/menu", label: "Menu", icon: "☕" },
  { to: "/events", label: "Events", icon: "📅" },
  { to: "/gallery", label: "Gallery", icon: "🖼️" },
  { to: "/blog", label: "Blog", icon: "✍️" },
  { to: "/site-info", label: "Site Info", icon: "📍" },
  { to: "/page-copy", label: "Page Copy", icon: "📝" },
];

export default function Layout() {
  const { profile, isOwner, signOut } = useAuth();

  const nav = isOwner ? [...navItems, { to: "/admins", label: "Admins", icon: "👥" }] : navItems;

  return (
    <div className="min-h-screen flex">
      <aside className="w-64 shrink-0 bg-gradient-to-b from-brand-brown to-brand-brown-darker text-white flex flex-col">
        <div className="px-6 py-6 border-b border-white/10">
          <h1 className="font-serif text-xl font-bold text-brand-gold">Brother Bean</h1>
          <p className="text-white/40 text-xs uppercase tracking-wider mt-1">Admin Dashboard</p>
        </div>
        <nav className="flex-1 py-4 px-3 space-y-1">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? "bg-brand-gold text-brand-brown-darker"
                    : "text-white/60 hover:bg-white/5 hover:text-white"
                }`
              }
            >
              <span>{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="px-6 py-5 border-t border-white/10">
          <div className="text-sm text-white/70 mb-1">
            {profile?.email || "Unknown"}
            <span className="ml-2 text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-brand-gold/20 text-brand-gold-light">
              {profile?.role}
            </span>
          </div>
          <button
            onClick={signOut}
            className="text-xs text-white/40 hover:text-brand-gold-light transition-colors"
          >
            Sign out
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto p-6 lg:p-10">
        <Outlet />
      </main>
    </div>
  );
}
