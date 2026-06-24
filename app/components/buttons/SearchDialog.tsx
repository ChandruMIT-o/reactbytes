"use client";
import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import {
  Search,
  X,
  Hash,
  Layers,
  Type,
  Image,
  SlidersHorizontal,
  MousePointer2,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ComponentDatabase,
  ComponentConfig,
} from "@/app/registry/ComponentDatabase";

// ─── Category icon map ────────────────────────────────────────────────────────
const CategoryIcon: React.FC<{
  category: ComponentConfig["category"];
  className?: string;
}> = ({ category, className = "w-3.5 h-3.5" }) => {
  switch (category) {
    case "text":
      return <Type className={className} />;
    case "background":
      return <Image className={className} />;
    case "carousel":
      return <SlidersHorizontal className={className} />;
    case "cursor":
      return <MousePointer2 className={className} />;
    default:
      return <Layers className={className} />;
  }
};

const categoryLabel: Record<ComponentConfig["category"], string> = {
  text: "Text",
  background: "Background",
  carousel: "Carousel",
  miscellaneous: "Miscellaneous",
  cursor: "Cursor",
};

// ─── Search logic ─────────────────────────────────────────────────────────────
interface SearchResult {
  component: ComponentConfig;
  matchType: "name" | "category" | "tag";
  matchedTag?: string;
}

function searchComponents(query: string): SearchResult[] {
  if (!query.trim()) return [];
  const q = query.toLowerCase().trim();

  const nameMatches: SearchResult[] = [];
  const categoryMatches: SearchResult[] = [];
  const tagMatches: SearchResult[] = [];

  for (const component of ComponentDatabase) {
    const nameMatch = component.name.toLowerCase().includes(q);
    if (nameMatch) {
      nameMatches.push({ component, matchType: "name" });
      continue;
    }

    const catMatch = categoryLabel[component.category]
      .toLowerCase()
      .includes(q);
    if (catMatch) {
      categoryMatches.push({ component, matchType: "category" });
      continue;
    }

    if (component.tags) {
      const matchedTag = component.tags.find((t) =>
        t.toLowerCase().includes(q),
      );
      if (matchedTag) {
        tagMatches.push({ component, matchType: "tag", matchedTag });
      }
    }
  }

  return [...nameMatches, ...categoryMatches, ...tagMatches].slice(0, 12);
}

// ─── Highlight matched text ───────────────────────────────────────────────────
function Highlight({ text, query }: { text: string; query: string }) {
  if (!query.trim()) return <>{text}</>;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <span className="text-rb-accent-1 font-semibold">
        {text.slice(idx, idx + query.length)}
      </span>
      {text.slice(idx + query.length)}
    </>
  );
}

// ─── Skeleton row (loading placeholder) ───────────────────────────────────────
function SkeletonRow({ index }: { index: number }) {
  const nameWidth = 55 + ((index * 13) % 35);
  const tagWidth = 30 + ((index * 9) % 25);
  return (
    <li className="flex items-center gap-3 mx-2 px-3 py-2.5 rounded-xl">
      <span className="flex-shrink-0 w-7 h-7 rounded-lg bg-rb-neutral-3 animate-pulse" />
      <div className="flex-1 min-w-0 space-y-1.5">
        <div
          className="h-3 rounded bg-rb-neutral-3 animate-pulse"
          style={{ width: `${nameWidth}%` }}
        />
        <div
          className="h-2.5 rounded bg-rb-neutral-3/60 animate-pulse"
          style={{ width: `${tagWidth}%` }}
        />
      </div>
    </li>
  );
}

// ─── Main dialog ──────────────────────────────────────────────────────────────
const MIN_LOADING_MS = 450; // guarantees the loading state is always perceivable
const DEBOUNCE_MS = 150;

export const SearchDialog: React.FC = () => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const minDelayRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Alphabetical list shown before the user types anything ──
  const alphabetical = useMemo<SearchResult[]>(
    () =>
      [...ComponentDatabase]
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((component) => ({ component, matchType: "name" as const })),
    [],
  );

  // ── Mount guard (document is unavailable during SSR) ──
  useEffect(() => {
    setMounted(true);
  }, []);

  // ── Keyboard shortcut ⌘K / Ctrl+K ──
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // ── Focus input when dialog opens ──
  useEffect(() => {
    if (open) {
      setQuery("");
      setResults([]);
      setActiveIndex(0);
      setIsSearching(false);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (minDelayRef.current) clearTimeout(minDelayRef.current);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  // ── Debounced search with an enforced minimum loading duration ──
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (minDelayRef.current) clearTimeout(minDelayRef.current);

    if (!query.trim()) {
      setResults([]);
      setIsSearching(false);
      setActiveIndex(0);
      return;
    }

    setIsSearching(true);
    const startedAt = Date.now();

    debounceRef.current = setTimeout(() => {
      const r = searchComponents(query);
      const elapsed = Date.now() - startedAt;
      const remaining = Math.max(MIN_LOADING_MS - elapsed, 0);

      minDelayRef.current = setTimeout(() => {
        setResults(r);
        setActiveIndex(0);
        setIsSearching(false);
      }, remaining);
    }, DEBOUNCE_MS);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (minDelayRef.current) clearTimeout(minDelayRef.current);
    };
  }, [query]);

  // ── Navigate to component ──
  const navigate = useCallback(
    (slug: string) => {
      setOpen(false);
      router.push(`/${slug}`);
    },
    [router],
  );

  // ── What's currently on screen: typed results, or the default A–Z browse list ──
  const displayList = query.trim() ? results : alphabetical;

  // ── Keyboard navigation in results ──
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!displayList.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, displayList.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (displayList[activeIndex])
        navigate(displayList[activeIndex].component.slug);
    }
  };

  // ── Scroll active item into view ──
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const active = list.children[activeIndex] as HTMLElement | undefined;
    active?.scrollIntoView({ block: "nearest" });
  }, [activeIndex, displayList]);

  const showEmpty =
    !isSearching && query.trim().length > 0 && results.length === 0;

  return (
    <>
      {/* ── Trigger button (replaces SearchInput) ── */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open search"
        className="flex items-center w-fit px-2.5 py-2.5 md:px-3 md:py-[7px] rounded-full bg-rb-neutral-3 transition-all duration-300 hover:bg-rb-neutral-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-rb-accent-1/30 gap-2"
      >
        <Search
          className="w-4 h-4 text-rb-accent-2 shrink-0"
          strokeWidth={2.5}
        />
        <span className="hidden md:block w-28 text-rb-accent-2/40 text-[16px] font-medium tracking-tight text-left select-none">
          Search
        </span>
        <div
          className="hidden md:flex items-center gap-1 text-rb-accent-2/20 shrink-0 font-medium text-[13px]"
          aria-hidden="true"
        >
          <kbd className="font-sans">⌘</kbd>
          <kbd className="font-sans">K</kbd>
        </div>
      </button>

      {/* ── Dialog overlay — portaled to <body> so no ancestor transform/overflow can clip or mis-position it ── */}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {open && (
              <>
                {/* Backdrop */}
                <motion.div
                  key="backdrop"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
                  onClick={() => setOpen(false)}
                />

                {/* Panel */}
                <motion.div
                  key="panel"
                  initial={{ opacity: 0, scale: 0.97, y: -8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.97, y: -8 }}
                  transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                  className="fixed left-1/2 top-[12vh] z-[101] w-full max-w-[520px] -translate-x-1/2 rounded-2xl border border-white/8 bg-rb-neutral-2 shadow-2xl overflow-hidden"
                  role="dialog"
                  aria-modal="true"
                  aria-label="Component search"
                >
                  {/* Search input row */}
                  <div className="relative flex items-center gap-3 px-4 py-3.5 border-b border-white/5 overflow-hidden">
                    <Search
                      className="w-4 h-4 text-rb-accent-2/50 shrink-0"
                      strokeWidth={2.5}
                    />
                    <input
                      ref={inputRef}
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Search components…"
                      className="flex-1 bg-transparent border-none outline-none text-rb-accent-2 placeholder:text-rb-accent-2/30 text-[15px] font-medium tracking-tight"
                      autoComplete="off"
                      spellCheck={false}
                    />
                    {query && (
                      <button
                        type="button"
                        onClick={() => setQuery("")}
                        className="text-rb-accent-2/30 hover:text-rb-accent-2/70 transition-colors"
                        aria-label="Clear search"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                    <kbd className="hidden sm:flex items-center px-1.5 py-0.5 rounded-md border border-white/10 text-rb-accent-2/20 text-[12px] font-sans">
                      esc
                    </kbd>

                    {/* Scan-line loading indicator */}
                    {isSearching && (
                      <motion.div
                        className="absolute bottom-0 left-0 h-[2px] w-1/3 bg-gradient-to-r from-transparent via-rb-accent-1 to-transparent"
                        initial={{ x: "-100%" }}
                        animate={{ x: "300%" }}
                        transition={{
                          duration: 0.9,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      />
                    )}
                  </div>

                  {/* Results — thin scrollbar via Tailwind arbitrary variants (no plugin needed) */}
                  <div
                    className="max-h-[min(60vh,380px)] overflow-y-auto
                      [&::-webkit-scrollbar]:w-1.5
                      [&::-webkit-scrollbar-track]:bg-transparent
                      [&::-webkit-scrollbar-thumb]:bg-rb-neutral-4
                      [&::-webkit-scrollbar-thumb]:rounded-full
                      [&::-webkit-scrollbar-thumb:hover]:bg-rb-accent-2/30"
                    style={{ scrollbarWidth: "thin" }}
                  >
                    {isSearching && query.trim() && (
                      <ul className="py-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <SkeletonRow key={i} index={i} />
                        ))}
                      </ul>
                    )}

                    {showEmpty && (
                      <div className="px-4 py-10 text-center">
                        <div className="text-rb-accent-2/40 text-sm tracking-wide">
                          No components match{" "}
                          <span className="text-rb-accent-2/50 font-medium">
                            "{query}"
                          </span>
                        </div>
                      </div>
                    )}

                    {!isSearching && displayList.length > 0 && (
                      <>
                        {!query.trim() && (
                          <div className="px-4 pt-3 pb-1 text-rb-accent-2/25 text-[11px] font-semibold uppercase tracking-wider">
                            All components
                          </div>
                        )}
                        <ul ref={listRef} role="listbox" className="py-2">
                          {displayList.map((result, i) => (
                            <li
                              key={result.component.slug}
                              role="option"
                              aria-selected={i === activeIndex}
                              onMouseEnter={() => setActiveIndex(i)}
                              onClick={() => navigate(result.component.slug)}
                              className={`flex items-center gap-3 mx-2 px-3 py-2.5 rounded-xl cursor-pointer transition-colors duration-100 ${i === activeIndex
                                ? "bg-rb-neutral-4"
                                : "hover:bg-rb-neutral-3"
                                }`}
                            >
                              {/* Category icon badge */}
                              <span
                                className={`flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-lg border transition-colors ${i === activeIndex
                                  ? "bg-rb-accent-1/15 border-rb-accent-1/25 text-rb-accent-1"
                                  : "bg-rb-neutral-3 border-white/5 text-rb-accent-2/40"
                                  }`}
                              >
                                <CategoryIcon
                                  category={result.component.category}
                                />
                              </span>

                              {/* Name + match context */}
                              <div className="flex-1 min-w-0">
                                <div className="text-rb-accent-2 text-[14px] font-medium tracking-tight truncate">
                                  <Highlight
                                    text={result.component.name}
                                    query={query}
                                  />
                                </div>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                  <span className="text-rb-accent-2/50 text-[12px]">
                                    {categoryLabel[result.component.category]}
                                  </span>
                                  {result.matchType === "tag" &&
                                    result.matchedTag && (
                                      <>
                                        <span className="text-rb-accent-2/15 text-[11px]">
                                          ·
                                        </span>
                                        <span className="flex items-center gap-1 text-rb-accent-2/30 text-[12px]">
                                          <Hash className="w-2.5 h-2.5" />
                                          <Highlight
                                            text={result.matchedTag}
                                            query={query}
                                          />
                                        </span>
                                      </>
                                    )}
                                </div>
                              </div>

                              {/* Enter hint on active */}
                              {i === activeIndex && (
                                <kbd className="hidden sm:block text-[11px] text-rb-accent-2/20 font-sans border border-white/8 rounded px-1 py-0.5 flex-shrink-0">
                                  ↵
                                </kbd>
                              )}
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                  </div>

                  {/* Footer hint */}
                  <div className="flex items-center justify-between px-4 py-2.5 border-t border-white/5 text-rb-accent-2/60 text-[11px] font-sans gap-4">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <kbd>↑</kbd>
                        <kbd>↓</kbd> navigate
                      </span>
                      <span className="flex items-center gap-1">
                        <kbd>↵</kbd> open
                      </span>
                      <span className="flex items-center gap-1">
                        <kbd>esc</kbd> close
                      </span>
                    </div>
                    <span className="text-rb-accent-2">
                      {isSearching
                        ? "Searching…"
                        : query.trim()
                          ? `${results.length} result${results.length === 1 ? "" : "s"}`
                          : `${ComponentDatabase.length} components`}
                    </span>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
};

export default SearchDialog;
