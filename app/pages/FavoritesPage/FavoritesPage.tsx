"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Bookmark, ArrowRight, Search } from "lucide-react";
import HeaderText from "../../components/textfields/HeaderText";
import ParagraphText from "../../components/textfields/ParagraphText";
import DefaultComboBox from "../../components/combobox/DefaultComboBox";
import {
  ComponentDatabase,
  ComponentConfig,
} from "@/app/registry/ComponentDatabase";
import { ComponentMap } from "@/app/registry/ComponentMap";
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

const ALL_FILTER = { id: "all", label: "All Categories" };

// ─── Card ─────────────────────────────────────────────────────────────────────
interface FavoriteCardProps {
  component: ComponentConfig;
  onRemove: () => void;
  onClick: () => void;
}

function FavoriteCard({ component, onRemove, onClick }: FavoriteCardProps) {
  const [hovered, setHovered] = useState(false);
  const [hoverKey, setHoverKey] = useState(0);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setIsTouchDevice(window.matchMedia("(hover: none)").matches);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const Component = ComponentMap[component.slug];

  const defaultProps = useMemo(() => {
    const props: Record<string, any> = {};
    component.props.forEach((p) => {
      props[p.name] = p.default;
    });
    return props;
  }, [component.props]);

  const isBackground = component.category === "background";

  const handleMouseEnter = () => {
    if (isTouchDevice) return;
    setHovered(true);
    timerRef.current = setTimeout(() => setHoverKey((k) => k + 1), 100);
  };

  const handleMouseLeave = () => {
    if (isTouchDevice) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    setHovered(false);
  };

  const handleClick = () => {
    if (isTouchDevice) {
      if (!hovered) {
        setHovered(true);
        setHoverKey((k) => k + 1);
        return;
      }
      setHovered(false);
    }
    onClick();
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRemove();
  };

  const baseOpacity = isTouchDevice
    ? isBackground
      ? 0.4
      : 0.5
    : isBackground
      ? 0.25
      : 0.35;

  const activeOpacity = isBackground ? 0.5 : 0.6;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.25 }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      className="group relative flex flex-col rounded-2xl border border-rb-neutral-4/40 bg-rb-neutral-3/30 hover:bg-rb-neutral-3/60 cursor-pointer transition-colors duration-200 overflow-hidden"
    >
      {/* Preview area */}
      <div className="relative w-full h-40 overflow-hidden bg-rb-neutral-2 border-b border-rb-neutral-4/30 flex-shrink-0">
        {/* Live component render */}
        <div
          className="absolute inset-0 pointer-events-none select-none"
          style={{
            transform: isBackground ? "scale(1)" : "scale(0.6)",
            transformOrigin: "center center",
            filter: isBackground ? "blur(0px)" : "blur(1.5px)",
            opacity: hovered ? activeOpacity : baseOpacity,
            transition: "opacity 0.4s ease",
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={hoverKey}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              {Component && (
                <Component
                  {...defaultProps}
                  {...(component.staticProps || {})}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Vignette */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 20%, var(--rb-neutral-2, #111) 80%)",
            opacity: hovered ? 0.4 : isTouchDevice ? 0.6 : 1,
            transition: "opacity 0.4s ease",
          }}
        />

        {/* Tap to preview hint — mobile only */}
        {isTouchDevice && !hovered && (
          <div className="absolute inset-0 flex items-end justify-center pb-3 pointer-events-none">
            <span className="text-[9px] uppercase tracking-widest text-rb-accent-2/30 font-medium">
              tap to preview
            </span>
          </div>
        )}

        {/* Remove button */}
        <button
          type="button"
          onClick={handleRemove}
          title="Remove from favorites"
          className="absolute top-2 left-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200 p-1.5 rounded-lg bg-black/50 backdrop-blur-sm text-white/60 hover:text-white hover:bg-black/70 z-10"
        >
          <Bookmark size={13} fill="currentColor" />
        </button>
      </div>

      {/* Card body */}
      <div className="flex flex-col gap-2 p-4">
        <span
          className={`self-start text-[10px] font-semibold px-2 py-0.5 rounded-full border uppercase tracking-wider ${
            CATEGORY_COLORS[component.category] ??
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
        <span className="text-[11px] text-rb-accent-2/20 font-mono">
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
      <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-rb-neutral-3 border border-white/6">
        <Bookmark size={22} className="text-rb-accent-2/20" />
      </div>
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
          <p className="text-[12px] text-rb-accent-2/25 uppercase tracking-widest font-medium whitespace-nowrap">
            {filtered.length}{" "}
            {filtered.length === 1 ? "component" : "components"}
          </p>
          <div className="w-52">
            <DefaultComboBox
              label="Category"
              options={categoryOptions}
              value={activeCategory}
              onChange={setActiveCategory}
              dynamicWidth={false}
            />
          </div>
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
