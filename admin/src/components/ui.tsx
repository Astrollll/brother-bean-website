import { useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { Icon, type IconName } from "./icons";

export function Spinner({ label = "Loading..." }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-brand-brown">
      <div className="w-10 h-10 border-[3px] border-brand-gold/30 border-t-brand-gold rounded-full animate-spin" />
      <span className="text-sm text-gray-500 mt-4">{label}</span>
    </div>
  );
}

export function Alert({ type, message }: { type: "error" | "success"; message: string }) {
  const isError = type === "error";
  return (
    <div
      className={`flex items-start gap-3 px-4 py-3 rounded-xl border text-sm mb-4 ${
        isError
          ? "bg-red-50 border-red-200 text-red-700"
          : "bg-emerald-50 border-emerald-200 text-emerald-700"
      }`}
      role="alert"
    >
      <span
        className={`mt-0.5 shrink-0 flex h-5 w-5 items-center justify-center rounded-full ${
          isError ? "bg-red-100 text-red-600" : "bg-emerald-100 text-emerald-600"
        }`}
      >
        {isError ? (
          <Icon name="close" className="w-3 h-3" />
        ) : (
          <Icon name="check" className="w-3 h-3" />
        )}
      </span>
      <span className="leading-relaxed">{message}</span>
    </div>
  );
}

export function PageHeader({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}) {
  return (
    <header className="mb-6 lg:mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="page-eyebrow">Brother Bean Admin</p>
        <h1 className="font-serif text-3xl lg:text-4xl font-bold tracking-tight text-brand-brown">
          {title}
        </h1>
        {subtitle && <p className="text-sm text-gray-500 mt-1.5 max-w-xl">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </header>
  );
}

export function EmptyState({
  icon,
  title,
  hint,
}: {
  icon: IconName;
  title: string;
  hint?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-cream text-brand-gold-dark ring-1 ring-brand-cream-dark">
        <Icon name={icon} className="w-7 h-7" />
      </div>
      <p className="mt-4 font-serif text-lg font-semibold text-brand-brown">{title}</p>
      {hint && <p className="mt-1 text-sm text-gray-400">{hint}</p>}
    </div>
  );
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
  useEffect(() => {
    if (!open) return;
    const docEl = document.documentElement;
    const prevDoc = docEl.style.overflow;
    const prevBody = document.body.style.overflow;
    docEl.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      docEl.style.overflow = prevDoc;
      document.body.style.overflow = prevBody;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-brand-brown-darker/50 backdrop-blur-md p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-brand-cream-dark sticky top-0 bg-white rounded-t-2xl z-10">
          <h3 className="font-serif text-xl font-bold text-brand-brown">{title}</h3>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-cream text-brand-brown hover:bg-red-50 hover:text-red-600 transition-all"
            aria-label="Close"
          >
            <Icon name="close" className="w-4 h-4" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>,
    document.body
  );
}

export function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative w-11 h-6 rounded-full transition-colors ${
        checked ? "bg-brand-gold" : "bg-gray-300"
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
          checked ? "translate-x-5" : ""
        }`}
      />
    </button>
  );
}
