"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import HeaderText from "../components/textfields/HeaderText";
import { ComponentDatabase } from "../registry/ComponentDatabase";
import { 
  Search, 
  Layers, 
  ExternalLink, 
  Package, 
  ToggleLeft, 
  ToggleRight, 
  Puzzle, 
  Grid,
  Filter,
  AlertCircle
} from "lucide-react";

export default function DependenciesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [onlyShowWithDeps, setOnlyShowWithDeps] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Filtering Logic
  const filteredComponents = useMemo(() => {
    return ComponentDatabase.filter((comp) => {
      // 1. Search Query Match
      const nameMatch = comp.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        comp.slug.toLowerCase().includes(searchQuery.toLowerCase());
      
      const hasDeps = (comp.dependencies && Object.keys(comp.dependencies).length > 0) || 
        (comp.peerDependencies && Object.keys(comp.peerDependencies).length > 0);
      
      const depMatch = !searchQuery || hasDeps && (
        Object.keys(comp.dependencies || {}).some(dep => dep.toLowerCase().includes(searchQuery.toLowerCase())) ||
        Object.keys(comp.peerDependencies || {}).some(dep => dep.toLowerCase().includes(searchQuery.toLowerCase()))
      );

      const matchesSearch = nameMatch || depMatch;

      // 2. Dependency Toggle Match
      const matchesDepsFilter = !onlyShowWithDeps || hasDeps;

      // 3. Category Match
      const matchesCategory = selectedCategory === "all" || comp.category === selectedCategory;

      return matchesSearch && matchesDepsFilter && matchesCategory;
    });
  }, [searchQuery, onlyShowWithDeps, selectedCategory]);

  // Unique Categories list
  const categories = useMemo(() => {
    const cats = new Set(ComponentDatabase.map(c => c.category));
    return ["all", ...Array.from(cats)];
  }, []);

  return (
    <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto px-1 sm:px-4 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <HeaderText text="Component Dependencies" option={3} />
          <p className="text-sm text-rb-font-secondary mt-1">
            System registry list of third-party libraries and peer dependencies per component
          </p>
        </div>
      </div>

      {/* Control Panel */}
      <div className="flex flex-col gap-4 bg-rb-neutral-3/20 border border-white/5 p-5 rounded-2xl">
        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
          {/* Search bar */}
          <div className="relative flex-1 max-w-md">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-rb-font-secondary/50" />
            <input
              type="text"
              placeholder="Search components or libraries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-rb-neutral-3/60 border border-white/5 rounded-xl text-rb-accent-1 placeholder-rb-font-secondary/40 focus:border-rb-accent-2/40 focus:ring-1 focus:ring-rb-accent-2/20 outline-none text-sm transition-all"
            />
          </div>

          {/* Toggle Button */}
          <button
            onClick={() => setOnlyShowWithDeps(!onlyShowWithDeps)}
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-rb-neutral-3/50 border border-white/5 hover:bg-rb-neutral-4 text-rb-accent-2 text-sm transition-all select-none cursor-pointer self-start md:self-auto"
          >
            {onlyShowWithDeps ? (
              <ToggleRight size={24} className="text-rb-accent-1" />
            ) : (
              <ToggleLeft size={24} className="text-rb-font-secondary/60" />
            )}
            <span className="font-semibold text-rb-font-primary">Only Show with Dependencies</span>
          </button>
        </div>

        {/* Categories scroll row */}
        <div className="flex flex-wrap items-center gap-2 border-t border-white/5 pt-4 overflow-x-auto scrollbar-none">
          <span className="text-xs text-rb-font-secondary uppercase font-bold tracking-wider mr-2 flex items-center gap-1.5">
            <Filter size={12} />
            Category:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap cursor-pointer transition-all duration-300 border ${
                selectedCategory === cat
                  ? "bg-rb-accent-1 border-rb-accent-1 text-rb-neutral-2 hover:opacity-95"
                  : "bg-transparent border-white/5 text-rb-font-secondary hover:text-rb-accent-1"
              }`}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Components Grid */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-rb-font-secondary flex items-center gap-2">
            <Grid size={16} />
            Showing {filteredComponents.length} components
          </h3>
        </div>

        <AnimatePresence mode="popLayout">
          {filteredComponents.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-20 bg-rb-neutral-3/10 border border-white/5 rounded-2xl text-center"
            >
              <AlertCircle size={40} className="text-rb-accent-2/30 mb-3" />
              <h4 className="text-rb-accent-2 font-semibold">No Components Found</h4>
              <p className="text-xs text-rb-font-secondary mt-1">
                Try clearing search terms or toggling the dependencies filter.
              </p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="overflow-x-auto w-full bg-rb-neutral-3/20 border border-white/5 rounded-2xl shadow-xl scrollbar-none"
            >
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="border-b border-white/10 bg-white/[0.02]">
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-rb-font-secondary select-none">Component</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-rb-font-secondary select-none">Category</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-rb-font-secondary select-none">Dependencies</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-rb-font-secondary select-none">Peer Dependencies</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredComponents.map((comp) => {
                    const hasDeps = comp.dependencies && Object.keys(comp.dependencies).length > 0;
                    const hasPeers = comp.peerDependencies && Object.keys(comp.peerDependencies).length > 0;

                    return (
                      <tr 
                        key={comp.slug} 
                        className="border-b border-white/5 hover:bg-white/[0.02] transition-colors duration-200"
                      >
                        {/* Name Column */}
                        <td className="px-6 py-4 font-semibold text-rb-accent-1 align-top whitespace-nowrap">
                          <Link 
                            href={`/${comp.slug}`}
                            className="group/link inline-flex items-center gap-1.5 hover:text-rb-accent-2 transition-colors"
                          >
                            {comp.name}
                            <ExternalLink size={12} className="opacity-0 group-hover/link:opacity-100 transition-opacity text-rb-accent-2" />
                          </Link>
                        </td>

                        {/* Category Column */}
                        <td className="px-6 py-4 align-top">
                          <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border border-white/10 bg-rb-neutral-4 text-rb-font-secondary font-semibold select-none">
                            {comp.category}
                          </span>
                        </td>

                        {/* Dependencies Column */}
                        <td className="px-6 py-4 align-top">
                          {hasDeps ? (
                            <div className="flex flex-wrap gap-1.5 max-w-xs sm:max-w-sm md:max-w-md">
                              {Object.entries(comp.dependencies || {}).map(([name, ver]) => (
                                <div 
                                  key={name}
                                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-white/5 rounded-lg border border-white/5 text-[11px] font-mono text-rb-accent-1"
                                >
                                  <span className="text-rb-font-primary">{name}</span>
                                  <span className="opacity-45">{ver}</span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <span className="text-xs text-rb-font-secondary/30 italic select-none">None</span>
                          )}
                        </td>

                        {/* Peer Dependencies Column */}
                        <td className="px-6 py-4 align-top">
                          {hasPeers ? (
                            <div className="flex flex-wrap gap-1.5 max-w-xs sm:max-w-sm md:max-w-md">
                              {Object.entries(comp.peerDependencies || {}).map(([name, ver]) => (
                                <div 
                                  key={name}
                                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-white/5 rounded-lg border border-white/5 text-[11px] font-mono text-emerald-400"
                                >
                                  <span className="text-rb-font-primary">{name}</span>
                                  <span className="opacity-45">{ver}</span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <span className="text-xs text-rb-font-secondary/30 italic select-none">None</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
