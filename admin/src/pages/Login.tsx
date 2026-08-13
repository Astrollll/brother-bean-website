import { useState, type FormEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../lib/auth";
import { Alert } from "../components/ui";

export default function Login() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const from = (location.state as { from?: { pathname?: string } })?.from?.pathname || "/dashboard";

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await signIn(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign in failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-brown to-brand-brown-darker px-4">
      <div className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-brand-gold to-brand-gold-dark flex items-center justify-center text-3xl">
            ☕
          </div>
          <h1 className="font-serif text-2xl font-bold text-brand-brown">Brother Bean Admin</h1>
          <p className="text-sm text-gray-500 mt-1">Sign in to manage your site</p>
        </div>
        {error && <Alert type="error" message={error} />}
        <form onSubmit={onSubmit} className="space-y-5">
          <div>
            <label className="field-label" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              className="field-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@brotherbean.ph"
            />
          </div>
          <div>
            <label className="field-label" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              className="field-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          <button type="submit" className="btn-primary w-full py-3" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
        <p className="text-center text-xs text-gray-400 mt-6">
          <a href="/" className="hover:text-brand-gold-dark">← Back to website</a>
        </p>
      </div>
    </div>
  );
}
