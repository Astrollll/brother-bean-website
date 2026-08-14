import { useRef, useState, type FormEvent } from "react";
import { useEntity } from "../lib/useEntity";
import { supabase } from "../lib/supabase";
import type { GalleryImage } from "../lib/types";
import { Alert, EmptyState, Modal, PageHeader, Spinner, Toggle } from "../components/ui";
import { Icon } from "../components/icons";

const emptyForm = { alt_text: "", caption: "" };

export default function Gallery() {
  const { rows, loading, error, insert, update, remove } = useEntity<GalleryImage>("gallery_images");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<GalleryImage | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const fileRef = useRef<HTMLInputElement>(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  function openAdd() {
    setEditing(null);
    setForm(emptyForm);
    setFile(null);
    setPreview("");
    setFormError(null);
    setModalOpen(true);
  }

  function openEdit(item: GalleryImage) {
    setEditing(item);
    setForm({ alt_text: item.alt_text, caption: item.caption });
    setFile(null);
    setPreview(item.image_url);
    setFormError(null);
    setModalOpen(true);
  }

  function onFileChange(f: File | null) {
    setFile(f);
    if (f) setPreview(URL.createObjectURL(f));
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!file && !editing) {
      setFormError("Please choose an image.");
      return;
    }
    setSaving(true);
    setFormError(null);
    try {
      let imageUrl = editing?.image_url || "";
      let storagePath: string | null = editing?.storage_path || null;

      if (file) {
        const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
        const path = `uploads/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from("site-images")
          .upload(path, file, { upsert: false });
        if (uploadError) throw new Error(uploadError.message);

        if (editing?.storage_path) {
          await supabase.storage.from("site-images").remove([editing.storage_path]).catch(() => {});
        }
        const { data: pub } = supabase.storage.from("site-images").getPublicUrl(path);
        imageUrl = pub.publicUrl;
        storagePath = path;
      }

      const payload = {
        image_url: imageUrl,
        storage_path: storagePath,
        alt_text: form.alt_text.trim(),
        caption: form.caption.trim(),
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

  async function toggleActive(item: GalleryImage) {
    try {
      await update(item.id!, { is_active: !item.is_active });
    } catch {
      // ignore
    }
  }

  async function onDelete(item: GalleryImage) {
    if (!item.id) return;
    if (!confirm(`Delete this photo?`)) return;
    try {
      if (item.storage_path) {
        await supabase.storage.from("site-images").remove([item.storage_path]).catch(() => {});
      }
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
        title="Gallery"
        subtitle={`${rows.length} photos.`}
        actions={
          <button className="btn-primary" onClick={openAdd}>
            <Icon name="upload" className="w-4 h-4" />
            Upload Photo
          </button>
        }
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {rows.map((item) => (
          <div
            key={item.id}
            className={`card group overflow-hidden transition-all hover:shadow-lg ${item.is_active ? "" : "opacity-50"}`}
          >
            <div className="aspect-[4/3] overflow-hidden bg-brand-cream">
              {item.image_url ? (
                <img src={item.image_url} alt={item.alt_text} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-brand-gold/60">
                  <Icon name="image" className="w-8 h-8" />
                </div>
              )}
            </div>
            <div className="p-3.5">
              <p className="text-sm font-medium text-brand-brown truncate">{item.caption || item.alt_text || "Untitled"}</p>
              <div className="flex items-center justify-between mt-2.5">
                <Toggle checked={item.is_active} onChange={() => toggleActive(item)} />
                <div className="inline-flex items-center gap-2">
                  <button onClick={() => openEdit(item)} className="btn-ghost !px-2.5 !py-1.5">
                    <Icon name="edit" className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => onDelete(item)} className="btn-ghost-danger !px-2.5 !py-1.5">
                    <Icon name="trash" className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {rows.length === 0 && (
        <div className="card mt-4">
          <EmptyState icon="image" title="No photos yet" hint="Upload your first photo of the shop." />
        </div>
      )}

      <Modal open={modalOpen} title={editing ? "Edit Photo" : "Upload Photo"} onClose={() => setModalOpen(false)}>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="field-label">Image</label>
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={(e) => onFileChange(e.target.files?.[0] ?? null)}
              className="block w-full text-sm text-gray-500 file:mr-3 file:px-4 file:py-2 file:rounded-xl file:border-0 file:bg-brand-cream file:text-brand-brown file:font-semibold hover:file:bg-brand-gold hover:file:text-white transition-all cursor-pointer"
            />
            {preview && (
              <img src={preview} alt="Preview" className="mt-3 w-full h-40 object-cover rounded-xl border border-brand-cream-dark" />
            )}
          </div>
          <div>
            <label className="field-label">Caption</label>
            <input className="field-input" value={form.caption} onChange={(e) => setForm({ ...form, caption: e.target.value })} placeholder="Cozy interior" />
          </div>
          <div>
            <label className="field-label">Alt text</label>
            <input className="field-input" value={form.alt_text} onChange={(e) => setForm({ ...form, alt_text: e.target.value })} placeholder="Interior of Brother Bean Coffee Shop" />
          </div>
          {formError && <Alert type="error" message={formError} />}
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" className="btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? "Uploading..." : editing ? "Save Changes" : "Upload"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
