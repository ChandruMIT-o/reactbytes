"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

const STORAGE_KEY = "rb-favorites";
const FAVORITES_EVENT = "rb-favorites-changed";

function readFavorites(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

interface FavoritesContextValue {
  favorites: string[];
  toggle: (slug: string) => void;
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

export const FavoritesProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
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

  return (
    <FavoritesContext.Provider value={{ favorites, toggle }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavoritesContext = (): FavoritesContextValue => {
  const ctx = useContext(FavoritesContext);
  if (!ctx)
    throw new Error(
      "useFavoritesContext must be used inside FavoritesProvider",
    );
  return ctx;
};
