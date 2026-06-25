"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Bookmark, ArrowRight, Search } from "lucide-react";
import HeaderText from "../../components/textfields/HeaderText";
import ParagraphText from "../../components/textfields/ParagraphText";
import DefaultComboBox from "../../components/combobox/DefaultComboBox";
import {
  ComponentDatabase,
  ComponentConfig,
} from "@/app/registry/ComponentDatabase";
import { useFavoritesContext } from "@/app/components/context/FavoritesContext";

const CATEGORY_COLORS: Record<string, string> = {
  text: "bg-rb-accent-1/10 text-rb-accent-1/70 border-rb-accent-1/20",
  background: "bg-purple-500/10 text-purple-400/70 border-purple-500/20",
  carousel: "bg-blue-500/10 text-blue-400/70 border-blue-500/20",
  miscellaneous: "bg-emerald-500/10 text-emerald-400/70 border-emerald-500/20",
  cursor: "bg-orange-500/10 text-orange-400/70 border-orange-500/20",
};

const CATEGORY_LABEL: Record<string, string> = {
  text: "Text",
  background: "Background",
  carousel: "Carousel",
  miscellaneous: "Misc",
  cursor: "Cursor",
};

const CATEGORY_GRADIENT: Record<string, string> = {
  text: "var(--rb-accent-1, #799996)",
  background: "#a855f7",
  carousel: "#3b82f6",
  miscellaneous: "#10b981",
  cursor: "#f97316",
};

const ALL_FILTER = { id: "all", label: "All Categories" };

// ─── Test gif map ────────────────────────────────────────────────────────────
const PREVIEW_GIFS: Record<string, string> = {
  "blur-text":
    "https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExemp0ZTM1czdyaDdmc2M1aTFqcDh3ZGpvYXpvcTh3YjVvbmYzNzdmZyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/XEEJjydi2u5VhVO4f8/giphy.gif",
  "void-orb":
    "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExZ2lwdDlkNmludGEwdDNzeWtuczJ6MTRybnd2cGJhZWt5eWJsazEyaiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/1ZjLRSrAyikUzypJfa/giphy.gif",
};

// ─── Static placeholder (Only used if NO gif asset exists at all) ────────────
function CategoryPlaceholder({
  category,
  name,
}: {
  category: string;
  name: string;
}) {
  const color = CATEGORY_GRADIENT[category] ?? "#799996";

  return (
    <div className="w-full h-full relative overflow-hidden flex items-center justify-center bg-rb-neutral-1">
      <svg
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="none"
        viewBox="0 0 300 160"
      >
        <defs>
          <radialGradient id={`glow-${category}`} cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor={color} stopOpacity="0.2" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </radialGradient>
        </defs>
        <ellipse
          cx="230"
          cy="40"
          rx="160"
          ry="120"
          fill={`url(#glow-${category})`}
        />
      </svg>

      <Image
        src="/logo.svg"
        alt={`${name} preview`}
        width={18}
        height={26}
        className="opacity-50 relative z-10 select-none pointer-events-none"
      />
    </div>
  );
}

// ─── Card ─────────────────────────────────────────────────────────────────────
interface FavoriteCardProps {
  component: ComponentConfig;
  onRemove: () => void;
  onClick: () => void;
}

function FavoriteCard({ component, onRemove, onClick }: FavoriteCardProps) {
  const [hovered, setHovered] = useState(false);
  const [tapped, setTapped] = useState(false);

  const gifSrc = PREVIEW_GIFS[component.slug] ?? null;
  const showGif = gifSrc && (hovered || tapped);

  // Automatically derive Giphy's static frame URL if it's a giphy link
  const staticSrc = useMemo(() => {
    if (!gifSrc) return null;
    if (gifSrc.includes("giphy.com")) {
      return gifSrc.replace("/giphy.gif", "/giphy_s.gif");
    }
    return gifSrc;
  }, [gifSrc]);

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRemove();
  };

  const handleTapPreview = (e: React.MouseEvent) => {
    e.stopPropagation();
    setTapped((prev) => !prev);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.25 }}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        setTapped(false);
      }}
      className="group relative flex flex-col rounded-2xl border border-rb-neutral-3 bg-rb-neutral-3 hover:bg-rb-neutral-4 cursor-pointer transition-colors duration-200 overflow-hidden"
    >
      {/* Preview area */}
      <div className="relative w-full h-40 overflow-hidden bg-rb-neutral-1 border-b border-rb-neutral-4/30 flex-shrink-0">

        {/* 1. Base Fallback: Only shows if NO gif track exists */}
        {!gifSrc && (
          <div className="absolute inset-0">
            <CategoryPlaceholder
              category={component.category}
              name={component.name}
            />
          </div>
        )}

        {/* 2. Static GIF Preview Frame (Zero Stretch, Fills zone completely) */}
        {gifSrc && staticSrc && (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={staticSrc}
            alt={`${component.name} preview still`}
            className="absolute inset-0 block w-full h-full object-cover z-0"
            loading="lazy"
          />
        )}

        {/* 3. Animated GIF Track (Zero Stretch, Cross-fades cleanly on hover) */}
        <AnimatePresence>
          {showGif && (
            <motion.img
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              src={gifSrc}
              alt={`${component.name} playing preview`}
              className="absolute inset-0 block w-full h-full object-cover pointer-events-none z-10"
            />
          )}
        </AnimatePresence>

        {/* Subtle Darkening Overlay Layer */}
        <div className="absolute inset-0 bg-black/5 pointer-events-none z-20" />

        {/* Mobile tap-to-preview button */}
        {gifSrc && !tapped && (
          <button
            type="button"
            onClick={handleTapPreview}
            className="absolute bottom-2 right-2 z-30 sm:hidden flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium tracking-wide backdrop-blur-sm border transition-all duration-200 bg-black/50 border-white/10 text-white/60"
          >
            Tap to preview
          </button>
        )}

        {/* Remove button */}
        <button
          type="button"
          onClick={handleRemove}
          title="Remove from favorites"
          className="absolute top-2 left-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200 p-1.5 rounded-lg bg-black/50 backdrop-blur-sm text-white/60 hover:text-white hover:bg-black/70 z-30"
        >
          <Bookmark size={13} fill="currentColor" />
        </button>
      </div>

      {/* Card body */}
      <div className="flex flex-col gap-2 p-4">
        <span
          className={`self-start text-[10px] font-semibold px-2 py-0.5 rounded-full border uppercase tracking-wider ${CATEGORY_COLORS[component.category] ??
            "bg-white/5 text-rb-accent-2/40 border-white/8"
            }`}
        >
          {CATEGORY_LABEL[component.category] ?? component.category}
        </span>
        <div className="flex items-center justify-between gap-2">
          <span className="text-[15px] font-medium tracking-tight text-rb-accent-1 leading-snug">
            {component.name}
          </span>
          <ArrowRight
            size={15}
            className="text-rb-accent-2/20 group-hover:text-rb-accent-1/60 group-hover:translate-x-0.5 transition-all duration-200 flex-shrink-0"
          />
        </div>
        <span className="text-[13px] text-rb-accent-2/40 font-mono">
          /{component.slug}
        </span>
      </div>
    </motion.div>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────
function EmptyState({ filtered }: { filtered: boolean }) {
  const router = useRouter();
  return (
    <motion.div
      key="empty"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center gap-5 py-24 text-center"
    >
      <Bookmark size={22} className="text-rb-accent-2/20" />
      <div className="flex flex-col gap-1.5">
        <p className="text-rb-accent-2/50 text-[15px] font-medium tracking-tight">
          {filtered ? "No components in this category" : "No favorites yet"}
        </p>
        <p className="text-rb-accent-2/25 text-[13px] max-w-xs leading-relaxed">
          {filtered
            ? "Try a different category or bookmark more components."
            : "Browse components and click the bookmark icon to save them here."}
        </p>
      </div>
      {!filtered && (
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-rb-neutral-3 border border-white/6 text-rb-accent-2/50 hover:text-rb-accent-1 hover:border-rb-accent-1/20 hover:bg-rb-neutral-4 text-[13px] font-medium transition-all duration-200"
        >
          <Search size={13} />
          Browse components
        </button>
      )}
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export const FavoritesPage = () => {
  const { favorites, toggle } = useFavoritesContext();
  const [mounted, setMounted] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const favoriteComponents = useMemo(
    () =>
      [...ComponentDatabase.filter((c) => favorites.includes(c.slug))].sort(
        (a, b) => favorites.indexOf(b.slug) - favorites.indexOf(a.slug),
      ),
    [favorites],
  );

  const categoryOptions = useMemo(() => {
    const cats = Array.from(new Set(favoriteComponents.map((c) => c.category)));
    return [
      ALL_FILTER,
      ...cats.map((cat) => ({ id: cat, label: CATEGORY_LABEL[cat] ?? cat })),
    ];
  }, [favoriteComponents]);

  const filtered = useMemo(
    () =>
      activeCategory === "all"
        ? favoriteComponents
        : favoriteComponents.filter((c) => c.category === activeCategory),
    [favoriteComponents, activeCategory],
  );

  useEffect(() => {
    const valid = categoryOptions.some((o) => o.id === activeCategory);
    if (!valid) setActiveCategory("all");
  }, [categoryOptions, activeCategory]);

  if (!mounted) return null;

  return (
    <div className="flex flex-col gap-10 pb-20 font-sans">
      {/* Header */}
      <section
        id="favorites-header"
        className="relative flex flex-col items-center justify-center text-center"
      >
        <motion.div
          initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
          className="max-w-3xl px-6 flex flex-col items-center"
        >
          <HeaderText text="Favorites" option={3} />
          <div className="mt-4">
            <ParagraphText
              text="Components you've bookmarked. Click the bookmark icon on any component page to save it here."
              option={4}
              className="text-center"
            />
          </div>
        </motion.div>
      </section>

      {/* Controls */}
      {favoriteComponents.length > 0 && (
        <section
          id="favorites-filters"
          className="flex items-center justify-between gap-4 px-1"
        >
          <p className="text-xs text-rb-accent-2/30 uppercase tracking-widest font-medium whitespace-nowrap">
            <span className="font-bold text-rb-accent-1 mr-1">{filtered.length}</span>
            {filtered.length === 1 ? "component" : "components"}
          </p>
          <DefaultComboBox
            label="Category"
            options={categoryOptions}
            value={activeCategory}
            onChange={setActiveCategory}
            dynamicWidth={true}
          />
        </section>
      )}

      {/* Grid */}
      <section id="favorites-grid" className="w-full">
        <AnimatePresence mode="popLayout">
          {filtered.length === 0 ? (
            <EmptyState filtered={activeCategory !== "all"} />
          ) : (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              <AnimatePresence mode="popLayout">
                {filtered.map((comp) => (
                  <FavoriteCard
                    key={comp.slug}
                    component={comp}
                    onRemove={() => toggle(comp.slug)}
                    onClick={() => router.push(`/${comp.slug}`)}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </div>
  );
};

export default FavoritesPage;