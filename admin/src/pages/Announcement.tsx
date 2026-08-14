import { useEffect, useState, type FormEvent } from "react";
import { useSiteContent } from "../lib/useSiteContent";
import { Alert, PageHeader, Spinner, Toggle } from "../components/ui";

export default function Announcement() {
  const { row, loading, error, save } = useSiteContent("announcement");
  const [message, setMessage] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (!row) return;
    const current = row.data as { message?: string; is_active?: boolean };
    setMessage(current.message ?? "");
    setIsActive(current.is_active ?? true);
  }, [row]);

  if (loading) return <Spinner />;

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setFormError(null);
    setSaved(false);
    try {
      await save({ message, is_active: isActive });
      setSaved(true);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-2xl animate-fade-in-up">
      <PageHeader
        title="Announcement"
        subtitle="The banner shown at the very top of the homepage."
      />

      {error && <Alert type="error" message={error} />}
      {saved && <Alert type="success" message="Announcement saved." />}

      <form onSubmit={onSubmit} className="card p-6 sm:p-8 space-y-5">
        <div>
          <label className="field-label" htmlFor="message">Announcement message</label>
          <textarea
            id="message"
            className="field-input min-h-[120px]"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Latte lovers, welcome! Sip your love for coffee with our delicious hot and iced flavored lattes."
          />
        </div>
        <div className="flex items-center justify-between rounded-xl bg-brand-cream/50 border border-brand-cream-dark px-4 py-3.5">
          <div>
            <p className="text-sm font-semibold text-brand-brown">Show announcement</p>
            <p className="text-xs text-gray-400">Turn off to hide the banner.</p>
          </div>
          <Toggle checked={isActive} onChange={setIsActive} />
        </div>
        {formError && <Alert type="error" message={formError} />}
        <div className="flex justify-end">
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? "Saving..." : "Save Announcement"}
          </button>
        </div>
      </form>
    </div>
  );
}
