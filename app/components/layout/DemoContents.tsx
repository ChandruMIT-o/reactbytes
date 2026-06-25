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

  // Helper wrapper to handle background interaction and centering
  const BaseWrapper = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
    <motion.div 
      variants={containerVariants} 
      initial="hidden" 
      animate="visible"
      className="absolute inset-0 z-10 flex items-center justify-center p-6 md:p-12 pointer-events-none select-none overflow-hidden"
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
        <motion.div variants={itemVariants} className="px-3 py-1 rounded-full bg-white/10 border border-white/20 text-sm md:text-base font-medium text-white/80 mb-2 md:mb-6">
          Your next adventure awaits.
        </motion.div>
        
        {/* Headline: Scaled down for mobile to prevent cut-off */}
        <motion.h1 variants={itemVariants} className="text-3xl md:text-7xl font-bold tracking-tight text-white mb-2 md:mb-6 leading-tight text-center">
          Explore the world’s <br /> hidden gems.
        </motion.h1>
        
        {/* Paragraph: Reduced margins on mobile */}
        <motion.p variants={itemVariants} className="text-xs md:text-lg text-white/50 mb-4 md:mb-10 max-w-[280px] md:max-w-2xl text-center">
          From the fjords of Norway to the temples of Kyoto, we provide curated travel experiences for the curious soul.
        </motion.p>
        
        {/* Buttons: Re-enabled pointer events for clicking */}
        <motion.div variants={itemVariants} className="flex flex-row justify-center gap-2 md:gap-4 pointer-events-auto">
          <button className="px-4 py-2 md:px-8 md:py-3 bg-white text-black/70 text-xs md:text-base font-semibold rounded-full hover:bg-white/90 transition-colors">
            Find a Trip
          </button>
          <button className="px-4 py-2 md:px-8 md:py-3 bg-white text-black/70 text-xs md:text-base font-semibold rounded-full border border-white/10 hover:bg-white/10 transition-colors">
            View Plans
          </button>
        </motion.div>
      </BaseWrapper>
    );
  }

  if (variant === "card") {
    return (
      <BaseWrapper>
        <div className="w-full max-w-[340px] md:max-w-[400px] p-6 md:p-8 rounded-2xl md:rounded-3xl bg-rb-neutral-2/50 backdrop-blur-xl border border-white/10 shadow-2xl pointer-events-auto">
          <motion.div variants={itemVariants} className="w-10 h-10 md:w-12 md:h-12 bg-rb-accent-1 rounded-xl mb-4 md:mb-6 flex items-center justify-center">
            <div className="w-5 h-5 md:w-6 md:h-6 border-2 border-rb-neutral-1 rounded-sm rotate-45" />
          </motion.div>
          <motion.h3 variants={itemVariants} className="text-xl md:text-2xl font-bold text-white mb-1 md:mb-2 leading-tight">Elevate your aesthetic</motion.h3>
          <motion.p variants={itemVariants} className="text-xs md:text-base text-white/50 mb-4 md:mb-8 leading-relaxed">Join now to get early access to our curated layout systems and motion templates.</motion.p>
          <motion.div variants={itemVariants} className="space-y-3 md:space-y-4">
            <input type="email" placeholder="Email address" className="w-full px-4 py-2 md:py-3 rounded-xl bg-white/5 border border-white/10 text-white text-xs md:text-sm focus:outline-none focus:border-rb-accent-1 transition-colors" />
            <button className="w-full py-2 md:py-3 bg-rb-accent-1 text-rb-neutral-1 font-bold rounded-xl hover:opacity-90 transition-opacity text-xs md:text-base">Request Access</button>
          </motion.div>
        </div>
      </BaseWrapper>
    );
  }

  if (variant === "text") {
    return (
      <BaseWrapper>
        <motion.h2 variants={itemVariants} className="text-3xl md:text-6xl font-black italic tracking-tighter text-white uppercase leading-none text-center">
          <span className="block">COUTURE '26</span>
        </motion.h2>
        <motion.p variants={itemVariants} className="mt-3 text-base md:text-lg text-white/90 text-center max-w-[240px] md:max-w-md">
          NEW COLLECTION • MILAN • PARIS • TOKYO
        </motion.p>
      </BaseWrapper>
    );
  }

  return ( // Minimal
    <motion.div 
      variants={containerVariants} initial="hidden" animate="visible"
      className="absolute inset-0 z-10 p-8 md:p-12 flex flex-col justify-between pointer-events-none"
    >
      <motion.div variants={itemVariants} className="text-xl md:text-2xl font-bold tracking-tighter text-white pointer-events-auto">ReactBytes</motion.div>
      <motion.div variants={itemVariants} className="max-w-[260px] md:max-w-sm pointer-events-auto">
        <p className="text-[10px] md:text-sm text-white/40 uppercase tracking-widest font-bold mb-1">Featured Project</p>
        <h4 className="text-sm md:text-xl font-medium text-white italic leading-snug">"The future of web experiences starts with immersive backgrounds."</h4>
      </motion.div>
    </motion.div>
  );
};