import React from "react";
import { useEvents } from "../../lib/supabaseContent";
import { DEFAULT_EVENTS, type EventItem } from "../../lib/defaults";
import Skeleton from "./Skeleton";

const dayColors: Record<string, string> = {
  SAT: "from-amber-800/20 to-amber-600/10",
  FRI: "from-violet-800/20 to-violet-600/10",
  SUN: "from-emerald-800/20 to-emerald-600/10",
};

export default function EventsSection({ initialEvents }: { initialEvents?: EventItem[] }) {
  const { data, loading } = useEvents(
    initialEvents && initialEvents.length ? initialEvents : DEFAULT_EVENTS,
  );

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-2xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {data.map((event, i) => {
        const color = dayColors[event.day] || "from-brand-brown/10 to-brand-brown/5";
        const number = String(i + 1).padStart(2, "0");
        return (
          <article
            key={event.id || `${event.day}-${i}`}
            className="card-lift bg-white rounded-2xl border border-brand-cream-dark overflow-hidden tilt-card"
            style={{ animationDelay: `${i * 0.15}s` }}
          >
            <div className="tilt-card-shine" />
            <div className="flex flex-col sm:flex-row relative">
              <div className="sm:w-24 sm:min-w-[96px] bg-gradient-to-b from-brand-brown to-brand-brown-dark text-white flex sm:flex-col items-center justify-center py-4 sm:py-6 gap-2 relative overflow-hidden">
                <div className="absolute inset-0 bg-noise opacity-[0.08]" />
                <span className="relative text-xs font-semibold uppercase tracking-wider opacity-60">
                  {event.day}
                </span>
                <span className="relative text-2xl font-serif font-bold">{number}</span>
              </div>
              <div className="flex-1 p-6">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                  <h2 className="font-serif text-xl font-bold text-brand-brown">{event.title}</h2>
                  <span className="text-xs font-semibold whitespace-nowrap px-3 py-1.5 rounded-full bg-brand-gold/10 text-brand-gold">
                    {event.price}
                  </span>
                </div>
                <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-gray-400 mb-3">
                  <span className="flex items-center gap-1.5">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-brand-gold/70"
                    >
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" x2="16" y1="2" y2="6" />
                      <line x1="8" x2="8" y1="2" y2="6" />
                      <line x1="3" x2="21" y1="10" y2="10" />
                    </svg>
                    {event.date}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-brand-gold/70"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                    {event.time}
                  </span>
                </div>
                <p className="text-gray-500 text-sm leading-relaxed">{event.description}</p>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
