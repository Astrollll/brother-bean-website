import { useState, type FormEvent } from "react";
import { useEntity } from "../lib/useEntity";
import type { EventItem } from "../lib/types";
import { Alert, Modal, Spinner, Toggle } from "../components/ui";

const emptyForm = { title: "", date: "", time: "", description: "", price: "", day: "SAT" };

export default function Events() {
  const { rows, loading, error, insert, update, remove } = useEntity<EventItem>("events");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<EventItem | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  function openAdd() {
    setEditing(null);
    setForm(emptyForm);
    setFormError(null);
    setModalOpen(true);
  }

  function openEdit(item: EventItem) {
    setEditing(item);
    setForm({
      title: item.title,
      date: item.date,
      time: item.time,
      description: item.description,
      price: item.price,
      day: item.day,
    });
    setFormError(null);
    setModalOpen(true);
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) {
      setFormError("Title is required.");
      return;
    }
    setSaving(true);
    setFormError(null);
    try {
      const payload = {
        title: form.title.trim(),
        date: form.date.trim(),
        time: form.time.trim(),
        description: form.description.trim(),
        price: form.price.trim(),
        day: form.day.trim() || "SAT",
        display_order: editing ? editing.display_order : rows.length,
      };
      if (editing?.id) {
        await update(editing.id, payload);
      } else {
        await insert({ ...payload, is_active: true });
      }
      setModalOpen(false);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function toggleActive(item: EventItem) {
    try {
      await update(item.id!, { is_active: !item.is_active });
    } catch {
      // ignore
    }
  }

  async function onDelete(item: EventItem) {
    if (!item.id) return;
    if (!confirm(`Delete event "${item.title}"?`)) return;
    try {
      await remove(item.id);
    } catch {
      // ignore
    }
  }

  if (loading) return <Spinner />;
  if (error) return <Alert type="error" message={error} />;

  return (
    <div>
      <header className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-serif text-3xl font-bold text-brand-brown">Events</h1>
          <p className="text-gray-500 text-sm mt-1">{rows.length} events.</p>
        </div>
        <button className="btn-primary" onClick={openAdd}>+ Add Event</button>
      </header>

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wider text-gray-400 border-b border-brand-cream-dark">
              <th className="px-4 py-3">Day</th>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3 hidden md:table-cell">When</th>
              <th className="px-4 py-3 hidden lg:table-cell">Price</th>
              <th className="px-4 py-3">Active</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((item) => (
              <tr key={item.id} className="border-b border-brand-cream/60 last:border-0 hover:bg-brand-cream/30">
                <td className="px-4 py-3">
                  <span className="px-2 py-1 rounded-full bg-brand-gold/10 text-brand-gold-dark text-xs font-semibold">
                    {item.day}
                  </span>
                </td>
                <td className="px-4 py-3 font-medium text-brand-brown">{item.title}</td>
                <td className="px-4 py-3 text-gray-500 hidden md:table-cell">
                  {item.date}
                  {item.time ? ` · ${item.time}` : ""}
                </td>
                <td className="px-4 py-3 text-gray-500 hidden lg:table-cell">{item.price}</td>
                <td className="px-4 py-3">
                  <Toggle checked={item.is_active} onChange={() => toggleActive(item)} />
                </td>
                <td className="px-4 py-3 text-right whitespace-nowrap">
                  <button onClick={() => openEdit(item)} className="text-brand-gold-dark font-medium mr-3">Edit</button>
                  <button onClick={() => onDelete(item)} className="text-red-500 hover:text-red-700 font-medium">Delete</button>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-gray-400">No events yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal open={modalOpen} title={editing ? "Edit Event" : "Add Event"} onClose={() => setModalOpen(false)}>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="field-label">Title</label>
            <input className="field-input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="field-label">Day badge</label>
              <input className="field-input" value={form.day} onChange={(e) => setForm({ ...form, day: e.target.value })} placeholder="SAT" maxLength={3} />
            </div>
            <div className="col-span-2">
              <label className="field-label">Date / schedule</label>
              <input className="field-input" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} placeholder="Every Saturday" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="field-label">Time</label>
              <input className="field-input" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} placeholder="10:00 AM – 11:30 AM" />
            </div>
            <div>
              <label className="field-label">Price / note</label>
              <input className="field-input" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="Free with any purchase" />
            </div>
          </div>
          <div>
            <label className="field-label">Description</label>
            <textarea className="field-input min-h-[100px]" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          {formError && <Alert type="error" message={formError} />}
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" className="btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={saving}>{saving ? "Saving..." : "Save"}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
