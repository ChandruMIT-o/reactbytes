"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Bookmark, ArrowRight, Search, LayoutGrid, Grid3X3, RotateCcw } from "lucide-react";
import HeaderText from "../../components/textfields/HeaderText";
import ParagraphText from "../../components/textfields/ParagraphText";
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

const CATEGORY_FULL_LABEL: Record<string, string> = {
  text: "Text Effects",
  background: "Backgrounds",
  carousel: "Carousels",
  miscellaneous: "Miscellaneous",
  cursor: "Cursors",
};

const CATEGORY_GRADIENT: Record<string, string> = {
  text: "var(--rb-accent-1, #799996)",
  background: "#a855f7",
  carousel: "#3b82f6",
  miscellaneous: "#10b981",
  cursor: "#f97316",
};

const CATEGORIES = [
  { id: "all", label: "All Components" },
  { id: "text", label: "Text Effects" },
  { id: "background", label: "Backgrounds" },
  { id: "carousel", label: "Carousels" },
  { id: "miscellaneous", label: "Miscellaneous" },
  { id: "cursor", label: "Cursors" },
];

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

interface ComponentCardProps {
  component: ComponentConfig;
  isBookmarked: boolean;
  onBookmarkToggle: () => void;
  onClick: () => void;
}

function ComponentCard({ component, isBookmarked, onBookmarkToggle, onClick }: ComponentCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);
  const [isNearScreen, setIsNearScreen] = useState(false);
  const [videoError, setVideoError] = useState(false);

  const videoSrc = `/previews/videos/${component.slug}.mp4`;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const nearObserver = new IntersectionObserver(
      ([entry]) => {
        setIsNearScreen(entry.isIntersecting);
      },
      { rootMargin: "300px" }
    );

    const viewObserver = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    nearObserver.observe(el);
    viewObserver.observe(el);

    return () => {
      nearObserver.disconnect();
      viewObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || videoError) return;

    if (isInView) {
      video.play().catch((err) => {
        console.warn(`Autoplay failed for ${component.slug}:`, err);
      });
    } else {
      video.pause();
    }
  }, [isInView, component.slug, videoError]);

  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    onBookmarkToggle();
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.25 }}
      onClick={onClick}
      className="group relative flex flex-col rounded-2xl border border-rb-neutral-3 bg-rb-neutral-3 hover:bg-rb-neutral-4 cursor-pointer transition-colors duration-200 overflow-hidden"
    >
      {/* Preview area */}
      <div
        ref={containerRef}
        className="relative w-full h-40 overflow-hidden bg-rb-neutral-1 border-b border-rb-neutral-4/30 flex-shrink-0 flex items-center justify-center"
      >
        {videoError || !isNearScreen ? (
          <div className="absolute inset-0">
            <CategoryPlaceholder
              category={component.category}
              name={component.name}
            />
          </div>
        ) : (
          <video
            ref={videoRef}
            src={videoSrc}
            muted
            loop
            playsInline
            preload="auto"
            onError={() => setVideoError(true)}
            className="w-full h-full object-cover z-10"
            style={{ display: videoError ? "none" : "block" }}
          />
        )}

        {/* Subtle Darkening Overlay Layer */}
        <div className="absolute inset-0 bg-black/5 pointer-events-none z-20" />

        {/* Bookmark toggle button */}
        <button
          type="button"
          onClick={handleBookmark}
          title={isBookmarked ? "Remove from favorites" : "Add to favorites"}
          className="absolute top-2 left-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200 p-1.5 rounded-lg bg-black/50 backdrop-blur-sm text-white/60 hover:text-white hover:bg-black/70 z-30"
        >
          <Bookmark size={13} fill={isBookmarked ? "currentColor" : "none"} />
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
        {component.description && (
          <p className="text-[12px] text-rb-font-secondary/70 line-clamp-1 mb-0.5">
            {component.description}
          </p>
        )}
        <span className="text-[11px] text-rb-accent-2/45 font-mono">
          /{component.slug}
        </span>
      </div>
    </motion.div>
  );
}

export const ComponentsPage = () => {
  const { favorites, toggle } = useFavoritesContext();
  const [mounted, setMounted] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grouped" | "flat">("grouped");
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Filtered components list
  const filteredComponents = useMemo(() => {
    return ComponentDatabase.filter((component) => {
      // 1. Category check
      const matchesCategory =
        activeCategory === "all" || component.category === activeCategory;

      // 2. Search check
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !query ||
        component.name.toLowerCase().includes(query) ||
        component.slug.toLowerCase().includes(query) ||
        (component.description && component.description.toLowerCase().includes(query));

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  // Grouped filtered components
  const groupedComponents = useMemo(() => {
    const groups: Record<string, ComponentConfig[]> = {};
    filteredComponents.forEach((comp) => {
      if (!groups[comp.category]) {
        groups[comp.category] = [];
      }
      groups[comp.category].push(comp);
    });
    return groups;
  }, [filteredComponents]);

  const handleClearFilters = () => {
    setActiveCategory("all");
    setSearchQuery("");
  };

  if (!mounted) return null;

  return (
    <div className="flex flex-col gap-8 pb-20 font-sans">
      {/* Header */}
      <section
        id="components-header"
        className="relative flex flex-col items-center justify-center text-center"
      >
        <motion.div
          initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
          className="max-w-3xl px-6 flex flex-col items-center"
        >
          <HeaderText text="Components" option={3} />
          <div className="mt-4">
            <ParagraphText
              text="Explore, preview, and reuse a collection of premium, interactive React animations and UI effects."
              option={4}
              className="text-center"
            />
          </div>
        </motion.div>
      </section>

      {/* Controls: Search, Tabs & Toggle */}
      <section id="components-controls" className="flex flex-col gap-5 px-1">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Search bar */}
          <div className="relative flex-1 max-w-md group">
            <Search
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-rb-accent-2/30 group-focus-within:text-rb-accent-1/60 transition-colors"
            />
            <input
              type="text"
              placeholder="Search components, categories, or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 rounded-full border border-white/5 bg-rb-neutral-3/70 text-rb-accent-1 placeholder-rb-accent-2/30 focus:outline-none focus:border-rb-accent-1/20 focus:bg-rb-neutral-4 text-[14px] transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-rb-accent-2/30 hover:text-rb-accent-1 text-xs"
              >
                Clear
              </button>
            )}
          </div>

          {/* Segmented View Mode Toggle */}
          <div className="flex self-start md:self-auto items-center gap-1 p-1 rounded-full bg-rb-neutral-3 border border-white/5">
            <button
              onClick={() => setViewMode("grouped")}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                viewMode === "grouped"
                  ? "bg-rb-accent-1 text-rb-neutral-2 shadow-md"
                  : "text-rb-accent-2/50 hover:text-rb-accent-1"
              }`}
            >
              <LayoutGrid size={13} />
              Grouped
            </button>
            <button
              onClick={() => setViewMode("flat")}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                viewMode === "flat"
                  ? "bg-rb-accent-1 text-rb-neutral-2 shadow-md"
                  : "text-rb-accent-2/50 hover:text-rb-accent-1"
              }`}
            >
              <Grid3X3 size={13} />
              Flat Grid
            </button>
          </div>
        </div>

        {/* Horizontal scrollable category filters */}
        <div className="flex items-center w-full overflow-x-auto scrollbar-none py-1 gap-2 border-b border-white/5">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className="relative px-4 py-2 text-xs font-medium tracking-tight whitespace-nowrap transition-colors outline-none cursor-pointer"
              >
                <span
                  className={`relative z-10 transition-colors duration-250 ${
                    isActive ? "text-rb-accent-1" : "text-rb-accent-2/50 hover:text-rb-accent-1/80"
                  }`}
                >
                  {cat.label}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="active-category-pill"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    className="absolute inset-x-0 bottom-0 h-0.5 bg-rb-accent-1"
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Component Count */}
        <div className="text-[12px] text-rb-accent-2/30 uppercase tracking-widest font-medium">
          Found <span className="font-bold text-rb-accent-1">{filteredComponents.length}</span>{" "}
          {filteredComponents.length === 1 ? "component" : "components"}
        </div>
      </section>

      {/* Grid Content */}
      <section id="components-grid" className="w-full min-h-[400px]">
        <AnimatePresence mode="wait">
          {filteredComponents.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center gap-5 py-24 text-center"
            >
              <Search size={22} className="text-rb-accent-2/20" />
              <div className="flex flex-col gap-1.5">
                <p className="text-rb-accent-2/50 text-[15px] font-medium tracking-tight">
                  No components match your search
                </p>
                <p className="text-rb-accent-2/25 text-[13px] max-w-xs leading-relaxed">
                  Try checking your spelling, clear the search, or choose a different category.
                </p>
              </div>
              <button
                onClick={handleClearFilters}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-rb-neutral-3 border border-white/6 text-rb-accent-2/50 hover:text-rb-accent-1 hover:border-rb-accent-1/20 hover:bg-rb-neutral-4 text-[13px] font-medium transition-all duration-200"
              >
                <RotateCcw size={13} />
                Clear Filters
              </button>
            </motion.div>
          ) : viewMode === "grouped" && activeCategory === "all" ? (
            <motion.div
              key="grouped-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col gap-12"
            >
              {Object.entries(groupedComponents).map(([catId, items]) => (
                <div key={catId} className="flex flex-col gap-4">
                  <h3 className="text-sm font-semibold tracking-wider text-rb-accent-2/40 uppercase border-l-2 border-rb-accent-1 pl-3">
                    {CATEGORY_FULL_LABEL[catId] ?? catId}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {items.map((comp) => (
                      <ComponentCard
                        key={comp.slug}
                        component={comp}
                        isBookmarked={favorites.includes(comp.slug)}
                        onBookmarkToggle={() => toggle(comp.slug)}
                        onClick={() => router.push(`/${comp.slug}`)}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="flat-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {filteredComponents.map((comp) => (
                <ComponentCard
                  key={comp.slug}
                  component={comp}
                  isBookmarked={favorites.includes(comp.slug)}
                  onBookmarkToggle={() => toggle(comp.slug)}
                  onClick={() => router.push(`/${comp.slug}`)}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </div>
  );
};

export default ComponentsPage;
