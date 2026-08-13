import React from "react";
import { useGallery } from "../../lib/supabaseContent";
import { DEFAULT_GALLERY, type GalleryImage } from "../../lib/defaults";

export default function GallerySection({ initialImages }: { initialImages?: GalleryImage[] }) {
  const { data } = useGallery(initialImages && initialImages.length ? initialImages : DEFAULT_GALLERY);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {data.map((img, i) => (
        <div
          key={img.id || `${img.image_url}-${i}`}
          className="group relative overflow-hidden rounded-2xl bg-white border border-brand-cream-dark card-lift cursor-pointer tilt-card"
          style={{ animationDelay: `${i * 0.12}s` }}
        >
          <div className="tilt-card-shine" />
          <div className="aspect-[4/3] overflow-hidden">
            {img.image_url ? (
              <img
                src={img.image_url}
                alt={img.alt_text}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700 ease-out"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-brand-cream to-brand-cream-dark flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="64"
                  height="64"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-brand-brown-light/20 group-hover:scale-110 group-hover:text-brand-brown-light/40 transition-all duration-700 ease-out"
                >
                  <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                  <circle cx="9" cy="9" r="2" />
                  <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                </svg>
              </div>
            )}
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400">
            <div className="absolute bottom-0 left-0 right-0 p-6">
              {img.caption && (
                <p className="text-white font-medium transform translate-y-4 group-hover:translate-y-0 transition-transform duration-400">
                  {img.caption}
                </p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
