import { useState, type FormEvent } from "react";
import { useEntity } from "../lib/useEntity";
import type { EventItem } from "../lib/types";
import { Alert, EmptyState, Modal, PageHeader, Spinner, Toggle } from "../components/ui";
import { Icon } from "../components/icons";

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
    <div className="animate-fade-in-up">
      <PageHeader
        title="Events"
        subtitle={`${rows.length} events.`}
        actions={
          <button className="btn-primary" onClick={openAdd}>
            <Icon name="plus" className="w-4 h-4" />
            Add Event
          </button>
        }
      />

      <div className="card overflow-hidden">
        {rows.length === 0 ? (
          <EmptyState icon="calendar" title="No events yet" hint="Create your first event to get started." />
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-brand-cream-dark table-head">
                <th>Day</th>
                <th>Title</th>
                <th className="hidden md:table-cell">When</th>
                <th className="hidden lg:table-cell">Price</th>
                <th>Active</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="table-body">
              {rows.map((item) => (
                <tr key={item.id}>
                  <td>
                    <span className="badge badge-gold">{item.day}</span>
                  </td>
                  <td className="font-medium text-brand-brown">{item.title}</td>
                  <td className="text-gray-500 hidden md:table-cell">
                    {item.date}
                    {item.time ? ` · ${item.time}` : ""}
                  </td>
                  <td className="text-gray-500 hidden lg:table-cell">{item.price}</td>
                  <td>
                    <Toggle checked={item.is_active} onChange={() => toggleActive(item)} />
                  </td>
                  <td className="text-right whitespace-nowrap">
                    <div className="inline-flex items-center gap-2">
                      <button onClick={() => openEdit(item)} className="btn-ghost">
                        <Icon name="edit" className="w-3.5 h-3.5" />
                        Edit
                      </button>
                      <button onClick={() => onDelete(item)} className="btn-ghost-danger">
                        <Icon name="trash" className="w-3.5 h-3.5" />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
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
