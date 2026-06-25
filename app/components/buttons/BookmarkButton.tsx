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

const FAVORITES_EVENT = "rb-favorites-changed";

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    setFavorites(readFavorites());

    const onUpdate = () => setFavorites(readFavorites());

    window.addEventListener(FAVORITES_EVENT, onUpdate);
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
    window.dispatchEvent(new CustomEvent(FAVORITES_EVENT));
  };

  return { favorites, toggle };
}

interface BookmarkButtonProps {
  slug: string;
}

// Cinematic particle map for the click explosion
const PARTICLES = [
  { x: "0px", y: "-36px", delay: "0ms" },
  { x: "30px", y: "-20px", delay: "40ms" },
  { x: "30px", y: "20px", delay: "0ms" },
  { x: "0px", y: "36px", delay: "80ms" },
  { x: "-30px", y: "20px", delay: "40ms" },
  { x: "-30px", y: "-20px", delay: "0ms" },
];

export const BookmarkButton: React.FC<BookmarkButtonProps> = ({ slug }) => {
  const { favorites, toggle } = useFavorites();
  const [mounted, setMounted] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isBookmarked = mounted && favorites.includes(slug);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Structural feedback
    const wasBookmarked = favorites.includes(slug);
    toggle(slug);

    // Trigger explosive visual sequence only when checking the box active
    if (!wasBookmarked) {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 600);
    }
  };

  return (
    <>
      {/* Dynamic Keyframes Injected Safely to Prevent Tailwind Config Bloat */}
      <style>{`
        @keyframes rb-bounce {
          0%, 100% { transform: scale(1); }
          30% { transform: scale(1.35); }
          60% { transform: scale(0.85); }
          80% { transform: scale(1.1); }
        }
        @keyframes rb-shockwave {
          0% { transform: scale(0.7); opacity: 1; border-width: 3px; }
          100% { transform: scale(1.7); opacity: 0; border-width: 0.5px; }
        }
        @keyframes rb-particle {
          0% { transform: translate(-50%, -50%) translate(0, 0) scale(1); opacity: 1; }
          100% { transform: translate(-50%, -50%) translate(var(--ptx), var(--pty)) scale(0); opacity: 0; }
        }
      `}</style>

      <button
        onClick={handleClick}
        title={isBookmarked ? "Remove from Favorites" : "Add to Favorites"}
        className={`
            group relative p-2 rounded-full border
            transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]
            active:scale-90 active:duration-75
            outline-none focus:outline-none focus-visible:outline-none
            ${isBookmarked
            ? "bg-rb-accent-1/10 border-rb-accent-1/40 text-rb-accent-1 shadow-rb-accent-1/5"
            : "bg-rb-neutral-3 border-rb-neutral-4 text-rb-accent-1/40 hover:text-rb-accent-1 hover:border-rb-accent-1/30 hover:shadow-md hover:-translate-y-0.5"
          }
          `}
        style={{ outline: "none" }}
      >
        {/* Kinetic Icon Wrapper */}
        <div
          style={
            isAnimating
              ? { animation: "rb-bounce 550ms cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards" }
              : undefined
          }
          className="relative z-10 flex items-center justify-center"
        >
          <Bookmark
            size={18}
            className="transition-all duration-300 group-hover:scale-105"
            fill={isBookmarked ? "currentColor" : "none"}
            strokeWidth={isBookmarked ? 2.5 : 2}
          />
        </div>

        {/* Expanding Ring Shockwave */}
        {isAnimating && (
          <span
            className="absolute inset-0 rounded-full border-rb-accent-1 pointer-events-none z-0"
            style={{
              animation: "rb-shockwave 450ms cubic-bezier(0.16, 1, 0.3, 1) forwards",
            }}
          />
        )}

        {/* Particle Burst Stars */}
        {isAnimating &&
          PARTICLES.map((particle, idx) => (
            <span
              key={idx}
              className="absolute top-1/2 left-1/2 w-1.5 h-1.5 rounded-full bg-rb-accent-1 pointer-events-none z-0"
              style={
                {
                  "--ptx": particle.x,
                  "--pty": particle.y,
                  animation: `rb-particle 550ms cubic-bezier(0.16, 1, 0.3, 1) ${particle.delay} forwards`,
                } as React.CSSProperties
              }
            />
          ))}
      </button>
    </>
  );
};