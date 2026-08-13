import { useEffect, useState, type FormEvent } from "react";
import { supabase } from "../lib/supabase";
import type { Profile } from "../lib/types";
import { Alert, Modal, Spinner, Toggle } from "../components/ui";

async function callFn(body: Record<string, unknown>) {
  const { data, error } = await supabase.functions.invoke("admin-users", { body });
  if (error) throw new Error(error.message);
  if (data?.error) throw new Error(data.error);
  return data;
}

export default function Admins() {
  const [rows, setRows] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ email: "", password: "", role: "staff" });
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const load = async () => {
    const { data, error } = await supabase.from("profiles").select("*").order("created_at");
    if (error) setError(error.message);
    else setRows((data as Profile[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form.email.trim() || !form.password) {
      setFormError("Email and password are required.");
      return;
    }
    setSaving(true);
    setFormError(null);
    try {
      await callFn({ action: "create", email: form.email.trim(), password: form.password, role: form.role });
      setModalOpen(false);
      setForm({ email: "", password: "", role: "staff" });
      await load();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Create failed");
    } finally {
      setSaving(false);
    }
  }

  async function changeRole(profile: Profile, role: "owner" | "staff") {
    try {
      await callFn({ action: "update-role", userId: profile.id, role });
      await load();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update role");
    }
  }

  async function toggleActive(profile: Profile) {
    try {
      await callFn({ action: "update-status", userId: profile.id, isActive: !profile.is_active });
      await load();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update status");
    }
  }

  async function onDelete(profile: Profile) {
    if (!confirm(`Delete admin ${profile.email}? This cannot be undone.`)) return;
    try {
      await callFn({ action: "delete", userId: profile.id });
      await load();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Delete failed");
    }
  }

  if (loading) return <Spinner />;

  return (
    <div>
      <header className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-serif text-3xl font-bold text-brand-brown">Admin Accounts</h1>
          <p className="text-gray-500 text-sm mt-1">Owner only — manage who can access this dashboard.</p>
        </div>
        <button className="btn-primary" onClick={() => { setForm({ email: "", password: "", role: "staff" }); setFormError(null); setModalOpen(true); }}>
          + Add Admin
        </button>
      </header>

      {error && <Alert type="error" message={error} />}

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wider text-gray-400 border-b border-brand-cream-dark">
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Active</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((profile) => (
              <tr key={profile.id} className="border-b border-brand-cream/60 last:border-0 hover:bg-brand-cream/30">
                <td className="px-4 py-3 font-medium text-brand-brown">{profile.email}</td>
                <td className="px-4 py-3">
                  <select
                    value={profile.role}
                    disabled={profile.role === "owner"}
                    onChange={(e) => changeRole(profile, e.target.value as "owner" | "staff")}
                    className="field-input !w-auto !py-1.5 text-xs disabled:opacity-60"
                  >
                    <option value="staff">staff</option>
                    <option value="owner">owner</option>
                  </select>
                </td>
                <td className="px-4 py-3">
                  <Toggle checked={profile.is_active} onChange={() => toggleActive(profile)} />
                </td>
                <td className="px-4 py-3 text-right">
                  {profile.role !== "owner" && (
                    <button onClick={() => onDelete(profile)} className="text-red-500 hover:text-red-700 font-medium">
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={modalOpen} title="Add Admin" onClose={() => setModalOpen(false)}>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="field-label">Email</label>
            <input type="email" className="field-input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div>
            <label className="field-label">Temporary password</label>
            <input type="text" className="field-input" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Set a password for the new admin" />
          </div>
          <div>
            <label className="field-label">Role</label>
            <select className="field-input" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
              <option value="staff">staff</option>
              <option value="owner">owner</option>
            </select>
          </div>
          {formError && <Alert type="error" message={formError} />}
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" className="btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={saving}>{saving ? "Creating..." : "Create Admin"}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
