import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../lib/auth";
import { Icon, type IconName } from "./icons";

interface NavItem {
  to: string;
  label: string;
  icon: IconName;
}

const navItems: NavItem[] = [
  { to: "/dashboard", label: "Dashboard", icon: "dashboard" },
  { to: "/announcement", label: "Announcement", icon: "megaphone" },
  { to: "/menu", label: "Menu", icon: "coffee" },
  { to: "/events", label: "Events", icon: "calendar" },
  { to: "/gallery", label: "Gallery", icon: "image" },
  { to: "/blog", label: "Blog", icon: "pen" },
  { to: "/site-info", label: "Site Info", icon: "pin" },
  { to: "/page-copy", label: "Page Copy", icon: "file" },
];

export default function Layout() {
  const { profile, isOwner, signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const nav = isOwner ? [...navItems, { to: "/admins", label: "Admins", icon: "users" as IconName }] : navItems;
  const initials = (profile?.email?.[0] || "A").toUpperCase();

  const sidebar = (
    <aside className="flex h-full w-72 flex-col bg-gradient-to-b from-brand-brown-darker via-brand-brown to-brand-brown-dark text-white">
      <div className="flex items-center gap-3 px-6 py-6 border-b border-white/10">
        <img
          src={`${import.meta.env.BASE_URL}brother-bean-logo.jpg`}
          alt="Brother Bean"
          className="w-11 h-11 rounded-xl object-cover ring-1 ring-white/20"
        />
        <div className="min-w-0">
          <h1 className="font-serif text-lg font-bold leading-tight">Brother Bean</h1>
          <p className="text-[10px] uppercase tracking-[0.25em] text-brand-gold-light">Admin</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-5 space-y-1">
        {nav.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              `group flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? "bg-brand-gold text-brand-brown-darker shadow-lg shadow-black/10"
                  : "text-white/60 hover:bg-white/5 hover:text-white"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon
                  name={item.icon}
                  className={`w-[18px] h-[18px] shrink-0 ${
                    isActive ? "text-brand-brown-darker" : "text-brand-gold-light/70 group-hover:text-brand-gold-light"
                  }`}
                />
                {item.label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="px-3 py-4 border-t border-white/10 space-y-3">
        <div className="flex items-center gap-3 rounded-xl bg-white/5 ring-1 ring-white/10 px-3 py-2.5">
          <div className="w-9 h-9 shrink-0 rounded-lg bg-brand-gold text-brand-brown-darker flex items-center justify-center font-serif font-bold">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium truncate text-white/90">{profile?.email || "Unknown"}</p>
            <p className="text-[10px] uppercase tracking-wider text-white/40">{profile?.role}</p>
          </div>
        </div>
        <button
          onClick={signOut}
          className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl border border-white/15 text-white/70 text-sm font-semibold hover:bg-red-500/15 hover:border-red-400/40 hover:text-red-300 transition-all"
        >
          <Icon name="logout" className="w-4 h-4" />
          Sign out
        </button>
      </div>
    </aside>
  );

  return (
    <div className="min-h-dvh bg-brand-cream/50 lg:flex">
      <div className="hidden lg:block fixed inset-y-0 left-0 z-30 w-72 shrink-0">
        {sidebar}
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-brand-brown-darker/50 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-72 shadow-2xl">{sidebar}</div>
        </div>
      )}

      <div className="flex min-h-dvh flex-1 flex-col min-w-0 lg:pl-72">
        <header className="sticky top-0 z-40 flex items-center justify-between gap-3 border-b border-brand-cream-dark bg-white/85 backdrop-blur-xl px-4 py-3 lg:hidden">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-brand-cream-dark bg-white text-brand-brown hover:border-brand-gold/50 hover:text-brand-gold-dark transition-all"
            >
              <Icon name="menu" className="w-5 h-5" />
            </button>
            <img
              src={`${import.meta.env.BASE_URL}brother-bean-logo.jpg`}
              alt="Brother Bean"
              className="h-8 w-8 rounded-lg object-cover ring-1 ring-brand-cream-dark"
            />
            <span className="font-serif font-bold text-brand-brown">Brother Bean</span>
          </div>
          <button
            onClick={signOut}
            aria-label="Sign out"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-brand-cream-dark bg-white text-brand-brown hover:border-red-300 hover:text-red-600 transition-all"
          >
            <Icon name="logout" className="w-[18px] h-[18px]" />
          </button>
        </header>

        <main className="flex-1 w-full max-w-6xl mx-auto p-4 sm:p-6 lg:p-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
