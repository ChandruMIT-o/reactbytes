"use client";

import React from "react";
import { motion } from "framer-motion";

interface BlueprintDividerProps {
  step: "features" | "marquee" | "shader-playground" | "specs";
}

interface DividerContent {
  sysName: string;
  title: string;
  text: string;
  color: string;
}

const STEP_CONTENTS: Record<string, DividerContent> = {
  features: {
    sysName: "ARCH_SYNC.SYS // SEC_02",
    title: "System Architecture",
    text: "Direct client-side WebGL compilation yields buttery 60 FPS viewport animations. Eliminating bloated bundle sizes and heavy runtime loops for optimal draw metrics.",
    color: "#e6dff1",
  },
  marquee: {
    sysName: "DECK_EXP.DLL // SEC_03",
    title: "Signature Components",
    text: "Interactive decks and 3D card matrices mounted. Scroll, drag, and tilt gesture variables are calculated dynamically to enrich visual feedback loops.",
    color: "#c0dedd",
  },
  "shader-playground": {
    sysName: "CALIB_LIVE.RAW // SEC_04",
    title: "Simulation Console",
    text: "Interactive vector field inputs enabled. Trackpad and mouse pointer vectors distort liquid space coordinates in real-time. Tune parameters dynamically below.",
    color: "#e6dff1",
  },
  specs: {
    sysName: "METRIC_LOCK.LOG // SEC_05",
    title: "Performance Lock",
    text: "Calibrating final latency limits. Hardware benchmarks verified at sub-millisecond drawing speeds, zero overhead dependencies, and stable frame rates.",
    color: "#c0dedd",
  },
};

export const BlueprintDivider: React.FC<BlueprintDividerProps> = ({ step }) => {
  const content = STEP_CONTENTS[step];
  if (!content) return null;

  const renderSVG = () => {
    switch (step) {
      case "features":
        return (
          <svg width="80" height="80" viewBox="0 0 100 100" fill="none" stroke={content.color} strokeWidth="1" className="opacity-80">
            <motion.path
              d="M50 15 L85 32.5 L85 67.5 L50 85 L15 67.5 L15 32.5 Z"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 1.2 }}
            />
            <motion.path
              d="M50 15 L50 85"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 1, delay: 0.2 }}
            />
            <motion.path
              d="M15 32.5 L50 50 L85 32.5"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 1, delay: 0.4 }}
            />
          </svg>
        );
      case "marquee":
        return (
          <svg width="80" height="80" viewBox="0 0 100 100" fill="none" stroke={content.color} strokeWidth="1" className="opacity-80">
            <motion.rect
              x="15"
              y="15"
              width="50"
              height="50"
              rx="4"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.8 }}
            />
            <motion.rect
              x="30"
              y="30"
              width="50"
              height="50"
              rx="4"
              className="opacity-50"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            />
            <motion.path
              d="M15 15 L30 30 M65 15 L80 30 M15 65 L30 80 M65 65 L80 80"
              strokeDasharray="2 2"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            />
          </svg>
        );
      case "shader-playground":
        return (
          <svg width="80" height="80" viewBox="0 0 100 100" fill="none" stroke={content.color} strokeWidth="1" className="opacity-80">
            <motion.path
              d="M5 50 Q 20 20, 35 50 T 65 50 T 95 50"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 1.2 }}
            />
            <motion.circle
              cx="50"
              cy="50"
              r="20"
              strokeDasharray="2 2"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            />
          </svg>
        );
      case "specs":
        return (
          <svg width="80" height="80" viewBox="0 0 100 100" fill="none" stroke={content.color} strokeWidth="1" className="opacity-80">
            <motion.circle
              cx="50"
              cy="50"
              r="38"
              strokeDasharray="3 3"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.8 }}
            />
            <motion.path
              d="M50 12 A 38 38 0 1 1 12 50"
              strokeWidth="2"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 0.82 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            />
            <motion.line
              x1="50"
              y1="50"
              x2="70"
              y2="30"
              strokeWidth="2"
              initial={{ rotate: -90 }}
              whileInView={{ rotate: 45 }}
              viewport={{ once: true, amount: 0.5 }}
              style={{ originX: "50px", originY: "50px" }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <section className="w-full max-w-4xl mx-auto px-6 py-20 flex flex-col md:flex-row items-center gap-10 md:gap-14 relative z-20 border-t border-b border-white/[0.03] my-10 bg-[#060010]/20 backdrop-blur-[2px]">
      
      {/* Corner crosshairs blueprint markers */}
      <div className="absolute top-2 left-2 text-[8px] font-mono text-white/10 select-none">+ SYS.NARRATIVE</div>
      <div className="absolute bottom-2 right-2 text-[8px] font-mono text-white/10 select-none">OS.VER_1.0 // OK</div>

      {/* SVG drawing slot */}
      <div className="flex-shrink-0 w-24 h-24 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center shadow-inner">
        {renderSVG()}
      </div>

      {/* Narrative contents */}
      <div className="flex-1 flex flex-col gap-3 text-left">
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10" style={{ color: content.color }}>
            {content.sysName}
          </span>
          <div className="h-[1px] flex-1 bg-white/10" />
        </div>
        
        <h3 className="text-lg md:text-xl font-bold font-mono tracking-tight text-white uppercase">
          {content.title}
        </h3>
        
        <p className="text-xs md:text-sm text-[#e6dff1]/60 leading-relaxed font-light font-sans">
          {content.text}
        </p>
      </div>

    </section>
  );
};

export default BlueprintDivider;
