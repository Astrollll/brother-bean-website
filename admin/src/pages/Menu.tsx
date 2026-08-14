import { useMemo, useState, type FormEvent } from "react";
import { useEntity } from "../lib/useEntity";
import type { MenuItem } from "../lib/types";
import { Alert, EmptyState, Modal, PageHeader, Spinner, Toggle } from "../components/ui";
import { Icon } from "../components/icons";

const emptyForm = { name: "", description: "", price: "", category: "Coffee" };

export default function Menu() {
  const { rows, loading, error, insert, update, remove } = useEntity<MenuItem>("menu_items");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<MenuItem | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const categories = useMemo(
    () => [...new Set(rows.map((r) => r.category))].sort(),
    [rows],
  );

  const grouped = useMemo(
    () => categories.map((cat) => ({ cat, items: rows.filter((r) => r.category === cat) })),
    [rows, categories],
  );

  function openAdd() {
    setEditing(null);
    setForm({ ...emptyForm, category: categories[0] || "Coffee" });
    setFormError(null);
    setModalOpen(true);
  }

  function openEdit(item: MenuItem) {
    setEditing(item);
    setForm({ name: item.name, description: item.description, price: item.price, category: item.category });
    setFormError(null);
    setModalOpen(true);
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.price.trim()) {
      setFormError("Name and price are required.");
      return;
    }
    setSaving(true);
    setFormError(null);
    try {
      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        price: form.price.trim(),
        category: form.category.trim() || "Other",
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

  async function toggleActive(item: MenuItem) {
    try {
      await update(item.id!, { is_active: !item.is_active });
    } catch {
      // ignore
    }
  }

  async function onDelete(item: MenuItem) {
    if (!item.id) return;
    if (!confirm(`Delete "${item.name}"?`)) return;
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
        title="Menu"
        subtitle={`${rows.length} items across ${categories.length} categories.`}
        actions={
          <button className="btn-primary" onClick={openAdd}>
            <Icon name="plus" className="w-4 h-4" />
            Add Menu Item
          </button>
        }
      />

      <div className="space-y-8">
        {grouped.map(({ cat, items }) => (
          <section key={cat}>
            <h2 className="font-serif text-lg font-bold text-brand-brown mb-3 flex items-center gap-3">
              <span className="w-6 h-1 bg-gradient-to-r from-brand-gold to-brand-gold-light rounded-full" />
              {cat}
              <span className="text-xs text-gray-400 font-sans font-normal">({items.length})</span>
            </h2>
            <div className="card overflow-hidden">
              {items.length === 0 ? (
                <EmptyState icon="coffee" title={`No items in ${cat}`} hint="Add your first menu item." />
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-brand-cream-dark table-head">
                      <th>Name</th>
                      <th className="hidden sm:table-cell">Description</th>
                      <th>Price</th>
                      <th>Active</th>
                      <th className="text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="table-body">
                    {items.map((item) => (
                      <tr key={item.id}>
                        <td className="font-medium text-brand-brown">{item.name}</td>
                        <td className="text-gray-500 hidden sm:table-cell max-w-[260px] truncate">
                          {item.description}
                        </td>
                        <td className="text-brand-gold-dark font-semibold whitespace-nowrap">{item.price}</td>
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
          </section>
        ))}
      </div>

      <Modal open={modalOpen} title={editing ? "Edit Menu Item" : "Add Menu Item"} onClose={() => setModalOpen(false)}>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="field-label">Name</label>
            <input className="field-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <label className="field-label">Price</label>
            <input className="field-input" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="₱99" />
          </div>
          <div>
            <label className="field-label">Category</label>
            <input
              className="field-input"
              list="category-options"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            />
            <datalist id="category-options">
              {categories.map((cat) => (
                <option key={cat} value={cat} />
              ))}
            </datalist>
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
