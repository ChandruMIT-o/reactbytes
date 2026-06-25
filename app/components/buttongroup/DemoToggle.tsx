"use client";
import React from "react";
import { motion } from "framer-motion";

interface DemoToggleProps {
  checked: boolean;
  onChange: (val: boolean) => void;
}

export const DemoToggle: React.FC<DemoToggleProps> = ({ checked, onChange }) => {
  return (
    <motion.button
      type="button"
      role="switch"
      aria-checked={checked}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onChange(!checked)}
      className="
        flex items-center gap-3 px-4 py-2 rounded-full select-none outline-none
        bg-rb-neutral-3/80 backdrop-blur-md 
        border border-rb-neutral-4
        transition-colors duration-300 shadow-sm
        focus-visible:ring-2 focus-visible:ring-rb-accent-1/50 focus-visible:ring-offset-2 focus-visible:ring-offset-rb-neutral-1
      "
    >
      {/* Label Text with sleek state mapping */}
      <span
        className={`
          text-[11px] font-bold uppercase tracking-widest transition-colors duration-300
          ${checked ? "text-rb-accent-2" : "text-rb-accent-2/50"}
        `}
      >
        Demo Content
      </span>

      {/* The Track */}
      <div
        className={`
          relative w-9 h-5 rounded-full transition-colors duration-300 border
          ${checked
            ? "bg-rb-accent-1/10 border-rb-accent-1/30"
            : "bg-white/5 border-white/10"
          }
        `}
      >
        {/* The Snappy Knob */}
        <motion.div
          animate={{
            x: checked ? 16 : 0,
            scale: checked ? 1.05 : 1
          }}
          transition={{
            type: "spring",
            stiffness: 600,
            damping: 32
          }}
          className={`
            absolute top-1 left-1 w-3 h-3 rounded-full shadow-sm
            ${checked
              ? "bg-rb-accent-1 shadow-[0_0_10px_rgba(var(--rb-accent-1-rgb),0.5)]"
              : "bg-white/40"
            }
          `}
        />
      </div>
    </motion.button>
  );
};