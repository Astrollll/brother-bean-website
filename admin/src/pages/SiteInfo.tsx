import { useEffect, useState, type FormEvent } from "react";
import { useSiteContent } from "../lib/useSiteContent";
import { Alert, Spinner } from "../components/ui";

interface SiteInfoData {
  address_line1: string;
  address_line2: string;
  phone: string;
  email: string;
  hours: string;
  hours_short: string;
  hours_schedule: string;
  facebook: string;
  instagram: string;
  maps_embed: string;
}

const fields: { key: keyof SiteInfoData; label: string; placeholder?: string }[] = [
  { key: "address_line1", label: "Address line 1", placeholder: "N. Guevarra St. Brgy. Zone 1" },
  { key: "address_line2", label: "Address line 2", placeholder: "Dasmariñas, Cavite, Philippines 4114" },
  { key: "phone", label: "Phone", placeholder: "0917 172 8458" },
  { key: "email", label: "Email", placeholder: "yourbrotherbean@gmail.com" },
  { key: "hours", label: "Hours (footer)", placeholder: "Daily: 9:00 AM – 7:00 PM" },
  { key: "hours_short", label: "Hours (short)", placeholder: "Open Daily 9:00 AM – 7:00 PM" },
  { key: "hours_schedule", label: "Hours (schedule)", placeholder: "9:00 AM – 7:00 PM" },
  { key: "facebook", label: "Facebook URL", placeholder: "https://www.facebook.com/BrotherBean" },
  { key: "instagram", label: "Instagram URL", placeholder: "https://www.instagram.com/brotherbean.coffeehouse/" },
  { key: "maps_embed", label: "Google Maps embed URL", placeholder: "https://www.google.com/maps?q=...&output=embed" },
];

const defaults: SiteInfoData = {
  address_line1: "",
  address_line2: "",
  phone: "",
  email: "",
  hours: "",
  hours_short: "",
  hours_schedule: "",
  facebook: "",
  instagram: "",
  maps_embed: "",
};

export default function SiteInfo() {
  const { row, loading, error, save } = useSiteContent("site_info");
  const [form, setForm] = useState<SiteInfoData>(defaults);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (!row) return;
    setForm({ ...defaults, ...(row.data as Partial<SiteInfoData>) });
  }, [row]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setFormError(null);
    setSaved(false);
    try {
      await save({ ...form });
      setSaved(true);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <Spinner />;

  return (
    <div className="max-w-2xl">
      <header className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-brand-brown">Site Info</h1>
        <p className="text-gray-500 text-sm mt-1">
          Contact details, hours, and social links used across the site (footer, location, contact).
        </p>
      </header>

      {error && <Alert type="error" message={error} />}
      {saved && <Alert type="success" message="Site info saved." />}

      <form onSubmit={onSubmit} className="card p-6 space-y-4">
        {fields.map((field) => (
          <div key={field.key}>
            <label className="field-label">{field.label}</label>
            <input
              className="field-input"
              value={form[field.key]}
              placeholder={field.placeholder}
              onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
            />
          </div>
        ))}
        {formError && <Alert type="error" message={formError} />}
        <div className="flex justify-end pt-2">
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? "Saving..." : "Save Site Info"}
          </button>
        </div>
      </form>
    </div>
  );
}
