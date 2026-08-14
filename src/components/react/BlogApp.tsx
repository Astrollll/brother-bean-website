import React, { useMemo, useState } from "react";
import { marked } from "marked";
import DOMPurify from "dompurify";
import { useBlogPosts } from "../../lib/supabaseContent";
import { DEFAULT_BLOG_POSTS, type BlogPost } from "../../lib/defaults";
import Skeleton from "./Skeleton";

function formatDate(iso?: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

export default function BlogApp() {
  const { data, loading } = useBlogPosts(DEFAULT_BLOG_POSTS);
  const [selected, setSelected] = useState<BlogPost | null>(null);

  const posts = useMemo(
    () => data.filter((p) => p.is_active !== false),
    [data],
  );

  const html = useMemo(() => {
    if (!selected) return "";
    const raw = marked.parse(selected.body_markdown || "", { async: false }) as string;
    return DOMPurify.sanitize(raw);
  }, [selected]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-2xl" />
        ))}
      </div>
    );
  }

  if (selected) {
    return (
      <article>
        <div className="max-w-3xl mx-auto">
          <time className="text-sm text-brand-gold font-medium" dateTime={selected.published_at || undefined}>
            {formatDate(selected.published_at)}
          </time>
          <h1 className="font-serif text-3xl lg:text-4xl font-bold text-brand-brown mt-2 mb-8">
            {selected.title}
          </h1>
          <div
            className="prose prose-brown max-w-none text-gray-500 leading-relaxed [&_h1]:font-serif [&_h2]:font-serif [&_h2]:text-brand-brown [&_h3]:font-serif [&_h3]:text-brand-brown [&_strong]:text-brand-brown"
            dangerouslySetInnerHTML={{ __html: html }}
          />
          <div className="mt-14 pt-8 decorative-line">
            <button
              onClick={() => setSelected(null)}
              className="inline-flex items-center gap-2 text-brand-brown font-semibold hover:text-brand-gold hover:gap-3 transition-all duration-300 mt-6 cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m12 19-7-7 7-7"></path>
                <path d="M19 12H5"></path>
              </svg>
              Back to Blog
            </button>
          </div>
        </div>
      </article>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="max-w-md mx-auto text-center py-16">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#6B4423"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mx-auto mb-4 opacity-30"
        >
          <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
        </svg>
        <p className="text-gray-400">No posts yet. Check back soon!</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {posts.map((post, i) => (
        <button
          key={post.id || post.slug}
          onClick={() => {
            setSelected(post);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="block w-full text-left card-lift bg-white rounded-2xl p-6 border border-brand-cream-dark hover:shadow-xl tilt-card cursor-pointer"
          style={{ animationDelay: `${i * 0.1}s` }}
        >
          <div className="tilt-card-shine" />
          <div className="relative">
            <div className="text-sm text-brand-gold mb-1.5 font-medium">
              {formatDate(post.published_at)}
            </div>
            <h2 className="font-serif text-xl font-bold text-brand-brown mb-2 hover:text-brand-gold transition-colors">
              {post.title}
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed">{post.description}</p>
          </div>
        </button>
      ))}
    </div>
  );
}
