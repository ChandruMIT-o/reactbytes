"use client";
import React from "react";
import { motion } from "framer-motion";

export type DemoVariant = "hero" | "card" | "text" | "minimal";

interface DemoContentProps {
  variant: DemoVariant;
}

export const DemoContent: React.FC<DemoContentProps> = ({ variant }) => {
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  const BaseWrapper = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      // Added @container here in case you want to switch to Tailwind Container Queries later
      className="absolute inset-0 z-10 flex items-center justify-center p-4 sm:p-8 lg:p-12 pointer-events-none select-none overflow-hidden @container"
    >
      <div className={`flex flex-col items-center justify-center w-full max-h-full ${className}`}>
        {children}
      </div>
    </motion.div>
  );

  if (variant === "hero") {
    return (
      <BaseWrapper>
        {/* Top text badge */}
        <motion.div variants={itemVariants} className="px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs sm:text-sm font-medium text-white/80 mb-3 sm:mb-6">
          Your next adventure awaits.
        </motion.div>

        {/* Headline: Dropped base to text-3xl, tightened line-height, hid <br> on mobile */}
        <motion.h1 variants={itemVariants} className="text-3xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-white mb-3 sm:mb-6 leading-[1.1] sm:leading-tight text-center text-balance">
          Explore the world’s <br className="hidden sm:block" /> hidden gems.
        </motion.h1>

        {/* Paragraph: Tightened max-width for scaled containers */}
        <motion.p variants={itemVariants} className="text-xs sm:text-base lg:text-lg text-white/50 mb-6 lg:mb-10 max-w-[260px] sm:max-w-md lg:max-w-2xl text-center text-pretty">
          From the fjords of Norway to the temples of Kyoto, we provide curated travel experiences for the curious soul.
        </motion.p>

        {/* Buttons: Ensured they stack perfectly in narrow scaled views */}
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-4 pointer-events-auto w-full max-w-[200px] sm:max-w-none">
          <button className="px-6 py-2.5 sm:px-8 sm:py-3 bg-white text-black/80 text-xs sm:text-sm lg:text-base font-semibold rounded-full hover:bg-white/90 transition-colors w-full sm:w-auto">
            Find a Trip
          </button>
          <button className="px-6 py-2.5 sm:px-8 sm:py-3 bg-white/5 backdrop-blur-md text-white text-xs sm:text-sm lg:text-base font-semibold rounded-full border border-white/20 hover:bg-white/10 transition-colors w-full sm:w-auto">
            View Plans
          </button>
        </motion.div>
      </BaseWrapper>
    );
  }

  if (variant === "card") {
    return (
      <BaseWrapper>
        <div className="w-full max-w-[280px] sm:max-w-[380px] lg:max-w-[420px] p-5 sm:p-8 rounded-2xl lg:rounded-3xl bg-rb-neutral-2/50 backdrop-blur-xl border border-white/10 shadow-2xl pointer-events-auto">
          <motion.div variants={itemVariants} className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-rb-accent-1 rounded-xl mb-4 flex items-center justify-center">
            <div className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 border-2 border-rb-neutral-1 rounded-sm rotate-45" />
          </motion.div>
          <motion.h3 variants={itemVariants} className="text-lg sm:text-2xl font-bold text-white mb-2 leading-tight">
            Elevate your aesthetic
          </motion.h3>
          <motion.p variants={itemVariants} className="text-xs sm:text-sm lg:text-base text-white/50 mb-5 sm:mb-8 leading-relaxed">
            Join now to get early access to our curated layout systems and motion templates.
          </motion.p>
          <motion.div variants={itemVariants} className="space-y-3">
            <input type="email" placeholder="Email address" className="w-full px-4 py-2.5 sm:py-3 rounded-xl bg-white/5 border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-rb-accent-1 transition-colors" />
            <button className="w-full py-2.5 sm:py-3 bg-rb-accent-1 text-rb-neutral-1 font-bold rounded-xl hover:opacity-90 transition-opacity text-xs sm:text-sm lg:text-base">
              Request Access
            </button>
          </motion.div>
        </div>
      </BaseWrapper>
    );
  }

  if (variant === "text") {
    return (
      <BaseWrapper>
        <motion.h2 variants={itemVariants} className="text-3xl sm:text-6xl lg:text-8xl font-black italic tracking-tighter text-white uppercase leading-none text-center">
          <span className="block">COUTURE '26</span>
        </motion.h2>
        <motion.p variants={itemVariants} className="mt-2 sm:mt-4 text-[10px] sm:text-sm lg:text-lg text-white/90 text-center max-w-[220px] sm:max-w-md lg:max-w-xl tracking-widest">
          NEW COLLECTION • MILAN • PARIS • TOKYO
        </motion.p>
      </BaseWrapper>
    );
  }

  return ( // Minimal
    <motion.div
      variants={containerVariants} initial="hidden" animate="visible"
      className="absolute inset-0 z-10 p-5 sm:p-8 lg:p-12 flex flex-col justify-between pointer-events-none"
    >
      <motion.div variants={itemVariants} className="text-base sm:text-xl lg:text-2xl font-bold tracking-tighter text-white pointer-events-auto">
        ReactBytes
      </motion.div>
      <motion.div variants={itemVariants} className="max-w-[240px] sm:max-w-[320px] lg:max-w-md pointer-events-auto">
        <p className="text-[9px] sm:text-[10px] sm:text-xs text-white/40 uppercase tracking-widest font-bold mb-1.5 sm:mb-2">
          Featured Project
        </p>
        <h4 className="text-sm sm:text-lg lg:text-xl font-medium text-white italic leading-snug">
          "The future of web experiences starts with immersive backgrounds."
        </h4>
      </motion.div>
    </motion.div>
  );
};