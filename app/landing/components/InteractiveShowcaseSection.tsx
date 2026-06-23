"use client";

import React from "react";
import { Sparkles, LayoutGrid } from "lucide-react";
import StackedCarousel from "../../meta/carousel/StackedCarousel/StackedCarousel";

const showcaseCards = [
  {
    id: 1,
    title: "Fractal Background",
    image: "/landing/Fractal.png",
    content: "A premium, GPU-accelerated WebGL fractal canvas with real-time iteration controls, parallax mouse tracking, and smooth noise overlays.",
  },
  {
    id: 2,
    title: "Interlocking Marquee",
    image: "/landing/Marquee.png",
    content: "An interactive jigsaw marquee scrolling component supporting curvy, hex, wave, and classic interlocking shapes with customizable timing.",
  },
  {
    id: 3,
    title: "Ripple Background",
    image: "/landing/Ripple.png",
    content: "WebGL-based interactive water ripples that distort with cursor movement and generate high-impact shockwaves on click.",
  },
  {
    id: 4,
    title: "SuperMesh Sphere",
    image: "/landing/SuperMesh.png",
    content: "A 3D wireframe lattice sphere built on Three.js featuring animated vertex displacement waves and orbit control camera views.",
  },
  {
    id: 5,
    title: "Standard Accordion",
    image: "/landing/Accordion.png",
    content: "A smooth, spring-physics-driven React accordion with layout morphing, hover scale effects, and custom SVG icons.",
  },
];

export const InteractiveShowcaseSection: React.FC = () => {
  return (
    <section
      id="marquee"
      className="relative w-full py-28 bg-[#030008] border-t border-b border-white/5 overflow-hidden flex flex-col items-center justify-center"
    >
      {/* Blueprint decorations */}
      <div className="absolute inset-y-0 left-10 w-[1px] bg-white/[0.01] pointer-events-none" />
      <div className="absolute inset-y-0 right-10 w-[1px] bg-white/[0.01] pointer-events-none" />
      <div className="absolute top-10 left-10 font-mono text-[9px] text-[#e6dff1]/10 select-none pointer-events-none">
        GRID.SEC_02
      </div>
      <div className="absolute top-10 right-10 font-mono text-[9px] text-[#e6dff1]/10 select-none pointer-events-none">
        SHOWCASE.ACTIVE
      </div>

      {/* Header */}
      <div className="max-w-6xl mx-auto px-6 md:px-16 pb-16 flex flex-col items-center text-center gap-4 relative z-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-white/5 bg-white/5 font-mono text-[10px] uppercase tracking-widest text-[#e6dff1]/70">
          <Sparkles size={11} className="text-[#c0dedd]" /> Showcase Deck
        </div>
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white font-mono uppercase">
          Stacked Highlights
        </h2>
        <p className="text-sm text-[#e6dff1]/50 max-w-lg font-light leading-relaxed font-sans">
          Click the card deck to rotate. Checkout each component in the documentation.
        </p>
      </div>

      {/* Stacked Carousel Container */}
      <div className="w-full max-w-5xl mx-auto px-6 md:px-16 relative z-10 flex items-center justify-center">
        <StackedCarousel 
          items={showcaseCards}
          cardBgColor="#0a0712"
          cardBorderColor="rgba(192, 222, 221, 0.15)"
          liquidColor="rgba(192, 222, 221, 0.35)"
          activeDotColor="#c0dedd"
          inactiveDotColor="rgba(192, 222, 221, 0.15)"
        />
      </div>

      {/* Stats bar */}
      <div className="max-w-6xl mx-auto w-full px-6 md:px-16 pt-12 flex justify-between items-center text-[9px] font-mono text-[#e6dff1]/20">
        <div className="flex items-center gap-2">
          <LayoutGrid size={10} />
          <span>DECK_V2.0 STACKED</span>
        </div>
        <span>COMP.DECK_ROTARY</span>
      </div>
    </section>
  );
};

export default React.memo(InteractiveShowcaseSection);
