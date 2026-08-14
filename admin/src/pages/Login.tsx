import { useEffect, useState, type FormEvent, type MouseEvent } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../lib/auth";
import { supabase } from "../lib/supabase";
import { Alert } from "../components/ui";

const SITE_URL = import.meta.env.DEV ? "http://localhost:4321/" : "/";

const ICON_PROPS = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  className: "w-5 h-5",
};

const MegaphoneIcon = () => (
  <svg {...ICON_PROPS}>
    <path d="m3 11 18-5v12L3 14v-3z" />
    <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
  </svg>
);

const CoffeeIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg {...ICON_PROPS} className={className}>
    <path d="M10 2v2" />
    <path d="M14 2v2" />
    <path d="M16 8a1 1 0 0 1 1 1v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h14a4 4 0 1 1 0 8h-1" />
    <path d="M6 2v2" />
  </svg>
);

const ImageIcon = () => (
  <svg {...ICON_PROPS}>
    <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
    <circle cx="9" cy="9" r="2" />
    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
  </svg>
);

const PenIcon = () => (
  <svg {...ICON_PROPS}>
    <path d="M12 20h9" />
    <path d="M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635a2 2 0 0 1-.855.506l-2.872.838a.5.5 0 0 1-.62-.62l.838-2.872a2 2 0 0 1 .506-.854z" />
  </svg>
);

const FEATURES = [
  { icon: <MegaphoneIcon />, title: "Announcements", desc: "Update the homepage banner in seconds" },
  { icon: <CoffeeIcon />, title: "Menu & Pricing", desc: "Edit drinks, food, and prices anytime" },
  { icon: <ImageIcon />, title: "Gallery", desc: "Upload fresh photos of the shop" },
  { icon: <PenIcon />, title: "Blog & Events", desc: "Share stories and upcoming happenings" },
];

type Bean = { left: string; size: number; duration: string; delay: string; opacity: number };

const LEFT_BEANS: Bean[] = [
  { left: "12%", size: 14, duration: "22s", delay: "0s", opacity: 0.14 },
  { left: "34%", size: 18, duration: "28s", delay: "-9s", opacity: 0.1 },
  { left: "58%", size: 12, duration: "20s", delay: "-4s", opacity: 0.16 },
  { left: "78%", size: 16, duration: "26s", delay: "-14s", opacity: 0.11 },
  { left: "90%", size: 10, duration: "18s", delay: "-7s", opacity: 0.18 },
];

const RIGHT_BEANS: Bean[] = [
  { left: "8%", size: 13, duration: "18s", delay: "0s", opacity: 0.22 },
  { left: "22%", size: 17, duration: "24s", delay: "-6s", opacity: 0.26 },
  { left: "38%", size: 11, duration: "16s", delay: "-11s", opacity: 0.18 },
  { left: "55%", size: 15, duration: "22s", delay: "-3s", opacity: 0.24 },
  { left: "70%", size: 12, duration: "19s", delay: "-9s", opacity: 0.17 },
  { left: "84%", size: 16, duration: "26s", delay: "-15s", opacity: 0.26 },
];

function BeanSvg({ style }: { style: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className="bean-shape animate-float-up" style={style}>
      <path
        d="M16 1.5C23.5 4.5 27 11 27 18c0 6.2-4 10.8-11 12.5C9 28.8 5 24.2 5 18 5 11 8.5 4.5 16 1.5Z"
        fill="#a8732f"
        stroke="rgba(70,40,15,0.55)"
        strokeWidth="1"
      />
      <path
        d="M16 1.5C23.5 4.5 27 11 27 18c0 6.2-4 10.8-11 12.5C9 28.8 5 24.2 5 18 5 11 8.5 4.5 16 1.5Z"
        fill="#d8ab52"
        fillOpacity="0.75"
      />
      <path
        d="M10.5 4C15 8.5 17 13 16 18s-2.5 8-6.5 9.8"
        stroke="rgba(58,30,10,0.55)"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <ellipse cx="13.5" cy="13" rx="3.4" ry="5.4" fill="rgba(255,245,220,0.28)" transform="rotate(18 13.5 13)" />
    </svg>
  );
}

function Beans({ beans }: { beans: Bean[] }) {
  return (
    <>
      {beans.map((b, i) => (
        <BeanSvg
          key={i}
          style={
            {
              left: b.left,
              width: b.size,
              height: Math.round(b.size * 1.5),
              animationDuration: b.duration,
              animationDelay: b.delay,
              "--bean-opacity": b.opacity,
            } as React.CSSProperties
          }
        />
      ))}
    </>
  );
}

const EMAIL_KEY = "bb.admin.email";

export default function Login() {
  const { signIn, sessionUser, profileLoading, isAdmin } = useAuth();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resetting, setResetting] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(EMAIL_KEY);
    if (saved) {
      setEmail(saved);
      setRemember(true);
    }
  }, []);

  const from = (location.state as { from?: { pathname?: string } })?.from?.pathname || "/dashboard";

  if (sessionUser && profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-cream">
        <span className="w-8 h-8 border-[3px] border-brand-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (sessionUser && isAdmin) {
    return <Navigate to={from} replace />;
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setNotice(null);
    setLoading(true);
    try {
      await signIn(email, password);
      if (remember) localStorage.setItem(EMAIL_KEY, email);
      else localStorage.removeItem(EMAIL_KEY);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign in failed");
    } finally {
      setLoading(false);
    }
  }

  async function onForgot(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    if (!email) {
      setError("Enter your email first so we know where to send the reset link.");
      return;
    }
    setResetting(true);
    setError(null);
    setNotice(null);
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    setResetting(false);
    if (error) {
      setError(error.message);
      return;
    }
    setNotice("If an account exists for that email, a password reset link has been sent.");
  }

  const inputIcon = "w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none";

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-2 bg-brand-cream">
        <div className="relative hidden lg:flex flex-col justify-between overflow-hidden bg-gradient-to-br from-brand-brown-darker via-brand-brown to-brand-brown-dark p-12 text-white">
          <div className="absolute inset-0" aria-hidden="true">
            <div className="absolute -top-28 -right-28 w-[26rem] h-[26rem] rounded-full bg-brand-gold/20 blur-3xl animate-aurora-a" />
            <div className="absolute bottom-0 left-1/4 w-80 h-80 rounded-full bg-brand-gold/10 blur-3xl animate-aurora-b" />
            <Beans beans={LEFT_BEANS} />
          </div>
          <div className="absolute top-1/2 right-16 -translate-y-1/2 w-72 h-72 text-brand-gold-light opacity-[0.06] select-none animate-float-slow">
            <CoffeeIcon className="w-full h-full" />
          </div>

        <div className="relative flex items-center gap-3">
          <img
            src={`${import.meta.env.BASE_URL}brother-bean-logo.jpg`}
            alt="Brother Bean"
            className="w-12 h-12 rounded-2xl object-cover ring-1 ring-white/20"
          />
          <div>
            <p className="font-serif text-xl font-bold leading-tight">Brother Bean</p>
            <p className="text-[11px] uppercase tracking-[0.25em] text-brand-gold-light">
              Coffee House
            </p>
          </div>
        </div>

        <div className="relative max-w-md">
          <h1 className="font-serif text-4xl xl:text-5xl font-bold tracking-tight leading-[1.12]">
            Welcome to your{" "}
            <span className="italic bg-gradient-to-r from-brand-gold to-brand-gold-light bg-clip-text text-transparent">
              control room
            </span>
          </h1>
          <p className="mt-5 max-w-sm text-white/65 leading-relaxed">
            Everything you need to run the Brother Bean website — announcements, menu, photos,
            events, and more — in one cozy dashboard.
          </p>
          <div className="mt-10 space-y-5">
            {FEATURES.map((f) => (
              <div key={f.title} className="flex items-start gap-4">
                <div className="w-10 h-10 shrink-0 rounded-xl bg-white/10 backdrop-blur flex items-center justify-center text-brand-gold-light ring-1 ring-white/10">
                  {f.icon}
                </div>
                <div>
                  <p className="font-serif font-semibold tracking-tight text-white/90">{f.title}</p>
                  <p className="mt-0.5 text-sm text-white/55">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative flex items-center gap-2 text-sm text-white/40">
          <span className="inline-block w-2 h-2 rounded-full bg-brand-gold animate-pulse" />
          Crafted for Brother Bean Coffee House
        </div>
      </div>

      <div className="relative min-h-dvh flex flex-col bg-gradient-to-b from-brand-cream to-white">
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          <div className="absolute -top-24 -right-20 w-[28rem] h-[28rem] rounded-full bg-brand-gold/25 blur-3xl animate-aurora-a" />
          <div className="absolute -bottom-28 -left-20 w-96 h-96 rounded-full bg-brand-gold/20 blur-3xl animate-aurora-b" />
          <div className="absolute top-1/3 left-1/2 w-56 h-56 rounded-full bg-white/80 blur-3xl animate-sheen" />
          <div className="absolute bottom-1/4 right-1/4 w-40 h-40 rounded-full bg-brand-gold-dark/15 blur-3xl animate-aurora-b" />
          <Beans beans={RIGHT_BEANS} />
        </div>

        <header className="relative lg:hidden flex flex-col items-center px-4 pt-10 sm:pt-12">
          <div className="flex items-center gap-4">
            <img
              src={`${import.meta.env.BASE_URL}brother-bean-logo.jpg`}
              alt="Brother Bean"
              className="w-11 h-11 rounded-2xl object-cover shadow-lg shadow-brand-brown/20 ring-1 ring-white"
            />
            <div className="text-left">
              <p className="font-serif text-xl font-bold leading-tight text-brand-brown">Brother Bean</p>
              <p className="text-[10px] uppercase tracking-[0.3em] text-brand-gold-dark">Coffee House</p>
            </div>
          </div>
          <div className="mt-6 w-16 h-px bg-gradient-to-r from-transparent via-brand-gold/60 to-transparent" />
        </header>

        <main className="relative flex-1 flex items-center justify-center w-full px-4 pt-12 pb-10 sm:px-6 sm:pt-14 sm:pb-12">
          <div className="w-full max-w-md animate-fade-in-up bg-white/40 backdrop-blur-3xl rounded-2xl sm:rounded-3xl border border-white/60 shadow-xl shadow-brand-brown/15 shadow-[inset_0_1px_0_rgba(255,255,255,0.55)] p-6 sm:p-8 lg:p-10">
            <div className="mb-6 sm:mb-8">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-brand-brown">Welcome back</h2>
              <p className="text-sm text-gray-500 mt-1.5">Sign in to manage your website</p>
            </div>

            {error && <Alert type="error" message={error} />}
            {notice && <Alert type="success" message={notice} />}

            <form onSubmit={onSubmit} className="space-y-4 sm:space-y-5">
              <div>
                <label className="field-label" htmlFor="email">
                  Email
                </label>
                <div className="relative">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={inputIcon}
                  >
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="m22 7-10 5L2 7" />
                  </svg>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    className="field-input !pl-11 !bg-white/50 !backdrop-blur-sm"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@brotherbean.ph"
                  />
                </div>
              </div>

              <div>
                <label className="field-label" htmlFor="password">
                  Password
                </label>
                <div className="relative">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={inputIcon}
                  >
                    <rect x="3" y="11" width="18" height="11" rx="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    autoComplete="current-password"
                    className="field-input !pl-11 !pr-12 !bg-white/50 !backdrop-blur-sm"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-gray-400 hover:text-brand-gold-dark hover:bg-brand-cream transition-all"
                  >
                    {showPassword ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-4 h-4"
                      >
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                        <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
                        <line x1="2" x2="22" y1="2" y2="22" />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-4 h-4"
                      >
                        <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-2 sm:justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer text-gray-500 hover:text-brand-brown transition-colors">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="w-4 h-4 rounded border-brand-cream-dark accent-brand-gold cursor-pointer"
                  />
                  Remember me
                </label>
                <button
                  type="button"
                  onClick={onForgot}
                  disabled={resetting}
                  className="text-brand-gold-dark font-medium hover:text-brand-brown transition-colors disabled:opacity-50"
                >
                  {resetting ? "Sending..." : "Forgot password?"}
                </button>
              </div>

              <button type="submit" className="btn-primary w-full py-3 text-base" disabled={loading}>
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-brand-brown-darker border-t-transparent rounded-full animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign in to dashboard"
                )}
              </button>
            </form>

            <div className="flex items-center gap-3 my-6">
              <div className="h-px flex-1 bg-brand-cream-dark" />
              <span className="text-[11px] text-gray-400 uppercase tracking-wider">or</span>
              <div className="h-px flex-1 bg-brand-cream-dark" />
            </div>

            <a
              href={SITE_URL}
              className="flex items-center justify-center gap-1.5 text-sm text-gray-400 hover:text-brand-gold-dark transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4"
              >
                <line x1="19" x2="5" y1="12" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
              Back to website
            </a>
          </div>
        </main>

        <footer className="relative lg:hidden flex items-center justify-center gap-2 pb-8 sm:pb-10 px-4 text-xs text-gray-400">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-brand-gold animate-pulse" />
          Crafted for Brother Bean Coffee House
        </footer>
      </div>
    </div>
  );
}
