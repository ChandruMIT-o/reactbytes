"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface BlueprintHUDProps {
  activeSection: string;
}

interface NarrativeStep {
  id: string;
  sysName: string;
  narrativeTitle: string;
  narrativeText: string;
  color: string;
}

const NARRATIVE_STEPS: Record<string, NarrativeStep> = {
  hero: {
    id: "hero",
    sysName: "COM_INIT.EXE",
    narrativeTitle: "System Synthesis",
    narrativeText: "GPU liquid backdrop calibrated. Shader parameters initialized at base frequencies. Interface engines ready for exploration.",
    color: "#c0dedd",
  },
  features: {
    id: "features",
    sysName: "ARCH_SYNC.SYS",
    narrativeTitle: "Hardware Acceleration",
    narrativeText: "Direct rendering via client-side WebGL compilation yields buttery 60 FPS viewport animations. Eliminating bloated bundle overhead.",
    color: "#e6dff1",
  },
  marquee: {
    id: "marquee",
    sysName: "DECK_EXP.DLL",
    narrativeTitle: "Component Stack",
    narrativeText: "Interactive carousel overlays and 3D card coordinate matrices mounted. Gesture engines and tracking vectors fully operational.",
    color: "#c0dedd",
  },
  "shader-playground": {
    id: "shader-playground",
    sysName: "CALIB_LIVE.RAW",
    narrativeTitle: "Simulation Console",
    narrativeText: "Interactive vector field inputs enabled. Trackpad and mouse pointer vectors distort the fluid space coordinates in real-time.",
    color: "#e6dff1",
  },
  specs: {
    id: "specs",
    sysName: "METRIC_LOCK.LOG",
    narrativeTitle: "Hardware Benchmarks",
    narrativeText: "Calibrating final latency limits. Execution complete. Performance thresholds verified at sub-millisecond drawing speeds.",
    color: "#c0dedd",
  },
};

export const BlueprintHUD: React.FC<BlueprintHUDProps> = ({ activeSection }) => {
  const step = NARRATIVE_STEPS[activeSection] || NARRATIVE_STEPS.hero;

  const renderSVG = () => {
    switch (activeSection) {
      case "hero":
        return (
          <motion.svg
            key="hero-svg"
            width="100"
            height="100"
            viewBox="0 0 100 100"
            fill="none"
            stroke={step.color}
            strokeWidth="0.8"
            className="opacity-70"
          >
            {/* Crosshair target design */}
            <motion.circle
              cx="50"
              cy="50"
              r="35"
              strokeDasharray="4 4"
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            />
            <motion.circle
              cx="50"
              cy="50"
              r="10"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1 }}
            />
            <motion.path
              d="M50 5 v90 M5 50 h90"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            />
            <motion.rect
              x="42"
              y="42"
              width="16"
              height="16"
              strokeDasharray="2 2"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.2, 0.6, 0.2] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
          </motion.svg>
        );
      case "features":
        return (
          <motion.svg
            key="features-svg"
            width="100"
            height="100"
            viewBox="0 0 100 100"
            fill="none"
            stroke={step.color}
            strokeWidth="0.8"
            className="opacity-70"
          >
            {/* Isometric 3D module box */}
            <motion.path
              d="M50 15 L85 32.5 L85 67.5 L50 85 L15 67.5 L15 32.5 Z"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.2 }}
            />
            <motion.path
              d="M50 15 L50 85"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1 }}
            />
            <motion.path
              d="M15 32.5 L50 50 L85 32.5"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
            />
            <motion.path
              d="M15 67.5 L50 50 L85 67.5"
              strokeDasharray="2 2"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            />
          </motion.svg>
        );
      case "marquee":
        return (
          <motion.svg
            key="marquee-svg"
            width="100"
            height="100"
            viewBox="0 0 100 100"
            fill="none"
            stroke={step.color}
            strokeWidth="0.8"
            className="opacity-70"
          >
            {/* Stacked card grids */}
            <motion.rect
              x="15"
              y="15"
              width="50"
              height="50"
              rx="4"
              initial={{ pathLength: 0, y: 15 }}
              animate={{ pathLength: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            />
            <motion.rect
              x="25"
              y="25"
              width="50"
              height="50"
              rx="4"
              className="opacity-60"
              initial={{ pathLength: 0, y: 15 }}
              animate={{ pathLength: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            />
            <motion.rect
              x="35"
              y="35"
              width="50"
              height="50"
              rx="4"
              className="opacity-30"
              initial={{ pathLength: 0, y: 15 }}
              animate={{ pathLength: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            />
            <motion.path
              d="M15 15 L35 35 M65 15 L85 35 M15 65 L35 85 M65 65 L85 85"
              strokeDasharray="2 2"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            />
          </motion.svg>
        );
      case "shader-playground":
        return (
          <motion.svg
            key="playground-svg"
            width="100"
            height="100"
            viewBox="0 0 100 100"
            fill="none"
            stroke={step.color}
            strokeWidth="0.8"
            className="opacity-70"
          >
            {/* Sine wave with tuner knob */}
            <motion.path
              d="M5 50 Q 20 20, 35 50 T 65 50 T 95 50"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.2 }}
            />
            <motion.circle
              cx="50"
              cy="50"
              r="22"
              strokeDasharray="2 2"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            />
            <motion.line
              x1="50"
              y1="50"
              x2="50"
              y2="34"
              strokeWidth="1.5"
              initial={{ rotate: -45 }}
              animate={{ rotate: 135 }}
              style={{ originX: "50px", originY: "50px" }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            />
          </motion.svg>
        );
      case "specs":
        return (
          <motion.svg
            key="specs-svg"
            width="100"
            height="100"
            viewBox="0 0 100 100"
            fill="none"
            stroke={step.color}
            strokeWidth="0.8"
            className="opacity-70"
          >
            {/* Speedometer radial gauge */}
            <motion.circle
              cx="50"
              cy="50"
              r="38"
              strokeDasharray="3 3"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.8 }}
            />
            <motion.path
              d="M50 12 A 38 38 0 1 1 12 50"
              strokeWidth="2"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 0.82 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            />
            <motion.line
              x1="50"
              y1="50"
              x2="70"
              y2="30"
              strokeWidth="1.5"
              initial={{ rotate: -90 }}
              animate={{ rotate: 60 }}
              style={{ originX: "50px", originY: "50px" }}
              transition={{ duration: 1.4, ease: "easeOut" }}
            />
            <motion.rect
              x="38"
              y="60"
              width="24"
              height="12"
              rx="2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
              transition={{ delay: 0.5 }}
            />
          </motion.svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed left-8 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col gap-6 w-[260px] font-mono select-none pointer-events-none">
      
      {/* Decorative Crosshair HUD Bracket */}
      <div className="flex flex-col gap-1 border-l border-t border-white/10 p-4 relative bg-[#060010]/35 backdrop-blur-[2px]">
        {/* Glowing node at corner */}
        <div className="absolute -left-[3px] -top-[3px] h-[5px] w-[5px] rounded-full bg-[#c0dedd] shadow-[0_0_8px_#c0dedd]" />
        
        {/* Terminal Header */}
        <div className="flex items-center justify-between text-[9px] text-white/20 mb-2">
          <span>NARRATIVE_LOG v1.0</span>
          <span className="animate-pulse">● ONLINE</span>
        </div>

        {/* Dynamic Vector Drawing Frame */}
        <div className="h-[120px] w-full flex items-center justify-center border border-white/5 bg-[#181a1e]/15 rounded-lg mb-4">
          <AnimatePresence mode="wait">
            {renderSVG()}
          </AnimatePresence>
        </div>

        {/* Narrative Metrics Feed */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col gap-2"
          >
            <div className="flex justify-between items-center text-[10px]">
              <span className="font-semibold tracking-wider uppercase" style={{ color: step.color }}>
                {step.sysName}
              </span>
              <span className="text-white/20">VAL.100</span>
            </div>
            
            <h4 className="text-xs font-semibold text-white uppercase tracking-tight">
              {step.narrativeTitle}
            </h4>
            
            <p className="text-[9px] text-[#e6dff1]/55 leading-relaxed font-sans normal-case">
              {step.narrativeText}
            </p>
          </motion.div>
        </AnimatePresence>

        <div className="absolute right-2 bottom-2 text-[8px] text-white/5 font-mono">
          REACTBYTES_OS
        </div>
      </div>
      
      {/* Mini coordinates helper */}
      <div className="flex items-center justify-between px-2 text-[8px] text-white/10 tracking-[0.1em]">
        <span>SYS_STATUS: READY</span>
        <span>LAT: OK</span>
      </div>

    </div>
  );
};

export default BlueprintHUD;
