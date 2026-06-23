"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface TimelineSection {
  id: string;
  label: string;
}

interface ScrollTimelineProps {
  sections: TimelineSection[];
  activeSection: string;
}

export const ScrollTimeline: React.FC<ScrollTimelineProps> = ({
  sections,
  activeSection,
}) => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setScrollProgress(window.scrollY / totalHeight);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNodeClick = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="fixed right-6 md:right-10 top-1/2 -translate-y-1/2 z-40 hidden sm:flex flex-col items-center gap-6 font-mono select-none">
      
      {/* Scroll Metric Badge */}
      <div className="flex flex-col items-center mb-2">
        <span className="text-[10px] text-[#e6dff1]/30 uppercase tracking-widest font-mono">Progress</span>
        <span className="text-xs font-semibold text-[#c0dedd] mt-1">
          {Math.round(scrollProgress * 100)}%
        </span>
      </div>

      <div className="relative flex flex-col items-center h-[260px] w-8">
        
        {/* Background track line */}
        <div className="absolute top-0 bottom-0 w-[1px] bg-white/5" />

        {/* Active glowing gauge line */}
        <motion.div 
          className="absolute top-0 w-[1px] bg-gradient-to-b from-[#c0dedd] to-[#e6dff1]"
          style={{ 
            height: `${scrollProgress * 100}%`,
            boxShadow: "0 0 10px rgba(192,222,221,0.5)"
          }}
        />

        {/* Section Interactive Nodes */}
        <div className="absolute top-0 bottom-0 flex flex-col justify-between items-center w-full py-1">
          {sections.map((sec, idx) => {
            const isActive = activeSection === sec.id;
            
            return (
              <div 
                key={sec.id}
                onClick={() => handleNodeClick(sec.id)}
                className="group relative flex items-center justify-center cursor-pointer h-5 w-5"
              >
                {/* Section Index Marker */}
                <span className="absolute right-7 opacity-0 group-hover:opacity-100 bg-[#181a1e]/90 border border-white/10 text-[9px] uppercase tracking-widest px-2 py-1 rounded text-white whitespace-nowrap transition-all duration-300 font-mono scale-95 group-hover:scale-100 pointer-events-none">
                  {idx + 1} // {sec.label}
                </span>

                {/* Node Core Dot */}
                <div className={`relative h-2 w-2 rounded-full transition-all duration-500 ${
                  isActive 
                    ? "bg-[#c0dedd] scale-125 shadow-[0_0_12px_rgba(192,222,221,0.8)]" 
                    : "bg-white/10 group-hover:bg-white/30"
                }`}>
                  {isActive && (
                    <span className="absolute inset-[-4px] border border-[#c0dedd]/40 rounded-full animate-ping opacity-60" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Metric coordinates labels */}
      <div className="flex flex-col items-center mt-2 gap-1 text-[8px] text-[#e6dff1]/20 uppercase tracking-widest">
        <span>SYS.OK</span>
        <span>LAT.60MS</span>
      </div>
      
    </div>
  );
};

export default React.memo(ScrollTimeline);
