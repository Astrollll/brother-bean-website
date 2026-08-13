import { useState, type FormEvent } from "react";
import { useEntity } from "../lib/useEntity";
import type { BlogPost } from "../lib/types";
import { Alert, Modal, Spinner, Toggle } from "../components/ui";

const emptyForm = { title: "", description: "", body_markdown: "", published_at: "" };

function slugify(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function Blog() {
  const { rows, loading, error, insert, update, remove } = useEntity<BlogPost>("blog_posts", "published_at");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  function openAdd() {
    setEditing(null);
    setForm({ ...emptyForm, published_at: new Date().toISOString().slice(0, 10) });
    setFormError(null);
    setModalOpen(true);
  }

  function openEdit(item: BlogPost) {
    setEditing(item);
    setForm({
      title: item.title,
      description: item.description,
      body_markdown: item.body_markdown,
      published_at: item.published_at ? item.published_at.slice(0, 10) : "",
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
      const slug = editing?.slug || slugify(form.title);
      const payload = {
        title: form.title.trim(),
        slug,
        description: form.description.trim(),
        body_markdown: form.body_markdown,
        published_at: form.published_at ? new Date(form.published_at + "T00:00:00").toISOString() : null,
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

  async function toggleActive(item: BlogPost) {
    try {
      await update(item.id!, { is_active: !item.is_active });
    } catch {
      // ignore
    }
  }

  async function onDelete(item: BlogPost) {
    if (!item.id) return;
    if (!confirm(`Delete post "${item.title}"?`)) return;
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
          <h1 className="font-serif text-3xl font-bold text-brand-brown">Blog</h1>
          <p className="text-gray-500 text-sm mt-1">{rows.length} posts.</p>
        </div>
        <button className="btn-primary" onClick={openAdd}>+ New Post</button>
      </header>

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wider text-gray-400 border-b border-brand-cream-dark">
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3 hidden md:table-cell">Published</th>
              <th className="px-4 py-3 hidden lg:table-cell">Slug</th>
              <th className="px-4 py-3">Active</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((item) => (
              <tr key={item.id} className="border-b border-brand-cream/60 last:border-0 hover:bg-brand-cream/30">
                <td className="px-4 py-3 font-medium text-brand-brown">{item.title}</td>
                <td className="px-4 py-3 text-gray-500 hidden md:table-cell">
                  {item.published_at ? new Date(item.published_at).toLocaleDateString() : "—"}
                </td>
                <td className="px-4 py-3 text-gray-400 hidden lg:table-cell">/{item.slug}</td>
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
                <td colSpan={5} className="px-4 py-10 text-center text-gray-400">No posts yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal open={modalOpen} title={editing ? "Edit Post" : "New Post"} onClose={() => setModalOpen(false)}>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="field-label">Title</label>
            <input className="field-input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="field-label">Publish date</label>
              <input type="date" className="field-input" value={form.published_at} onChange={(e) => setForm({ ...form, published_at: e.target.value })} />
            </div>
            <div className="flex items-end pb-1">
              {!editing && (
                <p className="text-xs text-gray-400">Slug: /{slugify(form.title) || "…"}</p>
              )}
            </div>
          </div>
          <div>
            <label className="field-label">Short description</label>
            <textarea className="field-input min-h-[70px]" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div>
            <label className="field-label">Body (Markdown)</label>
            <textarea className="field-input font-mono text-xs min-h-[220px]" value={form.body_markdown} onChange={(e) => setForm({ ...form, body_markdown: e.target.value })} />
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
