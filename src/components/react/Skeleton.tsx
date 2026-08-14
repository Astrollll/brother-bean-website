export default function Skeleton({ className }: { className?: string }) {
  return <div className={`skeleton rounded-2xl ${className ?? ""}`} aria-hidden="true" />;
}
