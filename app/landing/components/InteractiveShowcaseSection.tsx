"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sparkles, LayoutGrid } from "lucide-react";
import StackedCarousel, { StackedCarouselCard } from "@/app/meta/carousel/StackedCarousel/StackedCarousel";

const carouselItems: StackedCarouselCard[] = [
  {
    id: 1,
    title: "AxialShearText",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop",
    content: "Splits and shears characters vertically along structural guidelines on hover. Complete with real-time displacement metrics.",
  },
  {
    id: 2,
    title: "StripeFlow Background",
    image: "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=2670&auto=format&fit=crop",
    content: "Wavy, animated colored stripes designed to flow dynamically under custom palette variables. Fully responsive and GPU-accelerated.",
  },
  {
    id: 3,
    title: "FbmNoise Shader",
    image: "https://images.unsplash.com/photo-1635776062127-d379bfcba9f8?q=80&w=2532&auto=format&fit=crop",
    content: "A WebGL-powered fractional Brownian motion noise simulation, supporting live uniform changes, color morphs, and interactive cursor coordinates.",
  },
  {
    id: 4,
    title: "TectonicTrackText",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2670&auto=format&fit=crop",
    content: "Elastic accordion-style character expansion that stretches letter scales and margins smoothly relative to mouse approach speeds.",
  }
];

export const InteractiveShowcaseSection: React.FC = () => {
  return (
    <section 
      id="marquee" 
      className="relative w-full py-28 bg-[#030008] border-t border-b border-white/5 flex flex-col gap-12 overflow-hidden"
    >
      {/* Blueprint Grid Lines */}
      <div className="absolute inset-y-0 left-10 w-[1px] bg-white/[0.01] pointer-events-none" />
      <div className="absolute inset-y-0 right-10 w-[1px] bg-white/[0.01] pointer-events-none" />

      {/* Decorative Blueprint Corner Markings */}
      <div className="absolute top-10 left-10 font-mono text-[9px] text-[#e6dff1]/10 select-none pointer-events-none">
        GRID.SEC_02
      </div>
      <div className="absolute top-10 right-10 font-mono text-[9px] text-[#e6dff1]/10 select-none pointer-events-none">
        SHOWCASE.ACTIVE
      </div>

      <div className="max-w-6xl mx-auto px-6 text-center flex flex-col items-center gap-4 relative z-10">
        
        {/* Section Header Badge */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-white/5 bg-white/5 font-mono text-[10px] uppercase tracking-widest text-[#e6dff1]/70"
        >
          <Sparkles size={11} className="text-[#c0dedd]" /> Component Deck
        </motion.div>
        
        {/* Title */}
        <motion.h2 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-2xl md:text-3.5xl font-bold tracking-tight text-white font-mono uppercase"
        >
          Signature Highlights
        </motion.h2>
        
        {/* Description */}
        <motion.p 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-sm text-[#e6dff1]/50 max-w-lg font-light leading-relaxed font-sans"
        >
          Glide through our custom layout highlights using the <span className="text-[#c0dedd] font-semibold">StackedCarousel</span> presentation interface. Click the cards to cycle the active index.
        </motion.p>
      </div>

      {/* Stacked Carousel Frame */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-[100vw] flex items-center justify-center"
      >
        <StackedCarousel items={carouselItems} />
      </motion.div>

      {/* Showcase stats/metric rules */}
      <div className="max-w-6xl mx-auto w-full px-6 flex justify-between items-center text-[9px] font-mono text-[#e6dff1]/20">
        <div className="flex items-center gap-2">
          <LayoutGrid size={10} />
          <span>{carouselItems.length} COMPONENTS SHOWN</span>
        </div>
        <span>COMP.DECK_V1</span>
      </div>

    </section>
  );
};

export default InteractiveShowcaseSection;
