import React, { useMemo } from "react";
import { useMenu } from "../../lib/supabaseContent";
import type { MenuItem } from "../../lib/defaults";

const categoryColors: Record<string, string> = {
  Coffee: "from-amber-800/20 to-amber-600/10 border-amber-800/20",
  "Non-Coffee": "from-emerald-800/20 to-emerald-600/10 border-emerald-800/20",
  Pastries: "from-orange-800/20 to-orange-600/10 border-orange-800/20",
  Food: "from-red-800/20 to-red-600/10 border-red-800/20",
};

const dotColor = (category: string) =>
  category === "Coffee"
    ? "bg-amber-500"
    : category === "Non-Coffee"
      ? "bg-emerald-500"
      : category === "Pastries"
        ? "bg-orange-500"
        : "bg-red-500";

export default function MenuSection({ initialMenu }: { initialMenu: MenuItem[] }) {
  const { data } = useMenu(initialMenu);

  const categories = useMemo(() => [...new Set(data.map((item) => item.category))], [data]);

  let globalIndex = 0;

  return (
    <>
      <div className="flex flex-wrap gap-3 justify-center mb-14">
        {categories.map((cat, i) => (
          <span
            key={cat}
            className="px-5 py-2.5 rounded-full text-sm font-medium bg-white border border-brand-cream-dark text-brand-brown hover:border-brand-gold/40 hover:bg-brand-gold/5 hover:scale-105 transition-all duration-300 cursor-default"
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            {cat}
          </span>
        ))}
      </div>

      {categories.map((cat, catIdx) => (
        <div key={cat} className="mb-14">
          <h2 className="font-serif text-2xl font-bold text-brand-brown mb-6 flex items-center gap-3">
            <span className="w-8 h-1 bg-gradient-to-r from-brand-gold to-brand-gold-light rounded-full" />
            {cat}
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {data
              .filter((item) => item.category === cat)
              .map((item) => {
                const idx = globalIndex;
                globalIndex++;
                return (
                  <div
                    key={`${cat}-${idx}`}
                    className="card-lift group relative bg-white rounded-2xl p-6 border border-brand-cream-dark overflow-hidden tilt-card"
                    style={{ animationDelay: `${idx * 0.05}s` }}
                  >
                    <div className="tilt-card-shine"></div>
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${categoryColors[item.category] || "from-brand-brown/10 to-brand-brown/5"} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                    ></div>
                    <div className="relative tilt-card-inner">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-serif font-bold text-lg text-brand-brown group-hover:text-brand-brown-darker transition-colors duration-300">
                          {item.name}
                        </h3>
                        <span className="font-bold text-brand-gold whitespace-nowrap ml-3 text-lg">
                          {item.price}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mb-3">
                        <span
                          className={`inline-block w-2 h-2 rounded-full ${dotColor(item.category)} animate-pulse-soft`}
                        ></span>
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {item.category}
                        </span>
                      </div>
                      {item.description && (
                        <p className="text-sm text-gray-500 leading-relaxed">{item.description}</p>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      ))}
    </>
  );
}
