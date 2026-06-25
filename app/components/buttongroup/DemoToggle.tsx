"use client";
import React from "react";

interface DemoToggleProps {
  checked: boolean;
  onChange: (val: boolean) => void;
}

export const DemoToggle: React.FC<DemoToggleProps> = ({ checked, onChange }) => {
  return (
    <div 
      className="flex items-center gap-3 px-4 py-2 bg-rb-neutral-3/90 backdrop-blur-md rounded-full border border-rb-neutral-4 shadow-sm cursor-pointer select-none group transition-colors hover:border-rb-accent-1/30"
      onClick={() => onChange(!checked)}
    >
      <span className="text-xs font-bold uppercase tracking-wider text-rb-accent-2/60 group-hover:text-rb-accent-2 transition-colors">
        Demo Content
      </span>
      {/* The Pill: Changed to a constant grey background (white/10) */}
      <div className="relative w-9 h-5 rounded-full bg-white/10 border border-white/5 transition-colors duration-200">
        <div 
          className={`absolute top-1 left-1 w-3 h-3 rounded-full transition-all duration-200 shadow-sm 
            ${checked 
              ? 'translate-x-4 bg-rb-accent-1' // Active state: slides and turns accent color
              : 'translate-x-0 bg-white/40'   // Inactive state: stays left and turns dim white
            }`}
        />
      </div>
    </div>
  );
};