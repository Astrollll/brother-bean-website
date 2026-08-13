import type { ReactNode } from "react";

export function Spinner({ label = "Loading..." }: { label?: string }) {
  return (
    <div className="flex items-center justify-center py-16 text-brand-brown">
      <div className="w-8 h-8 border-2 border-brand-gold border-t-transparent rounded-full animate-spin mr-3"></div>
      <span className="text-sm">{label}</span>
    </div>
  );
}

export function Alert({ type, message }: { type: "error" | "success"; message: string }) {
  const cls =
    type === "error"
      ? "bg-red-50 border-red-200 text-red-700"
      : "bg-emerald-50 border-emerald-200 text-emerald-700";
  return <div className={`px-4 py-3 rounded-xl border text-sm mb-4 ${cls}`}>{message}</div>;
}

export function Modal({
  open,
  title,
  onClose,
  children,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-brand-cream-dark">
          <h3 className="font-serif text-xl font-bold text-brand-brown">{title}</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-brand-cream text-brand-brown hover:bg-red-100 hover:text-red-600 transition-all"
            aria-label="Close"
          >
            &times;
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

export function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative w-11 h-6 rounded-full transition-colors ${checked ? "bg-brand-gold" : "bg-gray-300"}`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${checked ? "translate-x-5" : ""}`}
      ></span>
    </button>
  );
}
