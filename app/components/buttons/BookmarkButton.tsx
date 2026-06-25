"use client";

import React, { useEffect, useState } from "react";
import { Bookmark } from "lucide-react";

const STORAGE_KEY = "rb-favorites";

function readFavorites(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

// Custom event to sync within the same tab
const FAVORITES_EVENT = "rb-favorites-changed";

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);

  // Hydrate on mount — avoids SSR mismatch
  useEffect(() => {
    setFavorites(readFavorites());

    const onUpdate = () => setFavorites(readFavorites());

    // Same-tab sync
    window.addEventListener(FAVORITES_EVENT, onUpdate);
    // Cross-tab sync
    window.addEventListener("storage", onUpdate);

    return () => {
      window.removeEventListener(FAVORITES_EVENT, onUpdate);
      window.removeEventListener("storage", onUpdate);
    };
  }, []);

  const toggle = (slug: string) => {
    const current = readFavorites();
    const next = current.includes(slug)
      ? current.filter((s) => s !== slug)
      : [...current, slug];

    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));

    // Notify all listeners in this tab
    window.dispatchEvent(new CustomEvent(FAVORITES_EVENT));
  };

  return { favorites, toggle };
}

interface BookmarkButtonProps {
  slug: string;
}

export const BookmarkButton: React.FC<BookmarkButtonProps> = ({ slug }) => {
  const { favorites, toggle } = useFavorites();
  const [mounted, setMounted] = useState(false);
  const [pop, setPop] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isBookmarked = mounted && favorites.includes(slug);

  const handleClick = () => {
    const wasBookmarked = favorites.includes(slug);
    toggle(slug);
    if (!wasBookmarked) {
      setPop(true);
      setTimeout(() => setPop(false), 400);
    }
  };

  return (
    <button
      onClick={handleClick}
      title={isBookmarked ? "Remove from Favorites" : "Add to Favorites"}
      style={{
        transition:
          "transform 0.2s cubic-bezier(0.34,1.56,0.64,1), background 0.3s, color 0.3s, border-color 0.3s",
        transform: pop ? "scale(1.25)" : "scale(1)",
      }}
      className={`
        group relative p-2.5 rounded-full border
        ${
          isBookmarked
            ? "bg-rb-accent-1/10 border-rb-accent-1/40 text-rb-accent-1 hover:bg-rb-accent-1/20"
            : "bg-rb-neutral-3 border-rb-neutral-4 text-rb-accent-1/40 hover:text-rb-accent-1 hover:border-rb-accent-1/30"
        }
      `}
    >
      <Bookmark
        size={16}
        className="transition-all duration-300"
        fill={isBookmarked ? "currentColor" : "none"}
        strokeWidth={2}
      />

      {pop && (
        <span className="absolute inset-0 rounded-full animate-ping bg-rb-accent-1/20 pointer-events-none" />
      )}
    </button>
  );
};
