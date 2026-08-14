import { useEffect, useState, type FormEvent } from "react";
import { useSiteContent } from "../lib/useSiteContent";
import { Alert, PageHeader, Spinner } from "../components/ui";

export default function PageCopy() {
  const { row, loading, error, save } = useSiteContent("page_copy");
  const [json, setJson] = useState("{}");
  const [valid, setValid] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (!row) return;
    setJson(JSON.stringify(row.data, null, 2));
  }, [row]);

  function onEdit(value: string) {
    setJson(value);
    try {
      JSON.parse(value);
      setValid(true);
    } catch {
      setValid(false);
    }
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    let parsed: Record<string, unknown>;
    try {
      parsed = JSON.parse(json);
    } catch {
      setFormError("Invalid JSON — fix the errors above before saving.");
      setValid(false);
      return;
    }
    setSaving(true);
    setFormError(null);
    setSaved(false);
    try {
      await save(parsed);
      setSaved(true);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <Spinner />;

  return (
    <div className="max-w-3xl animate-fade-in-up">
      <PageHeader
        title="Page Copy"
        subtitle="Text for the homepage (hero, offers, stats, story, call-to-action) and the about page."
      />

      {error && <Alert type="error" message={error} />}
      {saved && <Alert type="success" message="Page copy saved." />}

      <form onSubmit={onSubmit} className="card p-6 sm:p-8">
        <div className="mb-2 flex items-center justify-between">
          <label className="field-label mb-0">page_copy (JSON)</label>
          {!valid && <span className="text-xs text-red-500 font-medium">Invalid JSON</span>}
        </div>
        <textarea
          className={`field-input font-mono text-xs min-h-[480px] ${valid ? "" : "border-red-300 bg-red-50"}`}
          value={json}
          onChange={(e) => onEdit(e.target.value)}
          spellCheck={false}
        />
        {formError && <Alert type="error" message={formError} />}
        <div className="flex justify-end pt-4">
          <button type="submit" className="btn-primary" disabled={saving || !valid}>
            {saving ? "Saving..." : "Save Page Copy"}
          </button>
        </div>
      </form>
    </div>
  );
}
