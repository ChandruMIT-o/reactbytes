"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import TectonicTrackText from "../../meta/text/TectonicTrackText/TectonicTrackText";
import BlurIn from "../../meta/text/TextEnter/BlurIn";
import VoidOrb from "../../meta/background/space/VoidOrb";

export const HeroSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // Calculate dynamic scale and rotation based on scroll progress
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.45]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 90]);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden pt-20"
    >

      {/* Background Void Orb with overflow margins to prevent rotation clipping */}
      <motion.div 
        style={{ 
          scale, 
          rotate,
          top: "-20%",
          bottom: "-20%",
          left: "-20%",
          right: "-20%"
        }}
        className="absolute z-0 origin-center"
      >
        <VoidOrb
          primaryColor="#c0dedd"
          secondaryColor="#e6dff1"
          accentColor="#060010"
          fractalScale={0.4}
          lightCount={3}
          lightIntensity={1.4}
          lightSpeed={0.8}
        />
      </motion.div>

      {/* --- BLUEPRINT DESIGN RAILS & DECORATIONS --- */}
      {/* Corner crosshair anchors */}
      <div className="absolute top-24 left-10 text-white/10 font-mono text-xs select-none pointer-events-none">+ SEC_01_HERO</div>
      <div className="absolute top-24 right-10 text-white/10 font-mono text-xs select-none pointer-events-none">+ COORD.REF_82X</div>
      <div className="absolute bottom-10 left-10 text-white/10 font-mono text-xs select-none pointer-events-none">+ BASELINE_RULE</div>
      <div className="absolute bottom-10 right-10 text-white/10 font-mono text-xs select-none pointer-events-none">+ ENGINE_OK</div>

      {/* Blueprint Grid Lines (Hairline) */}
      <div className="absolute inset-y-0 left-1/4 w-[1px] bg-white/[0.02] pointer-events-none" />
      <div className="absolute inset-y-0 left-2/4 w-[1px] bg-white/[0.02] pointer-events-none" />
      <div className="absolute inset-y-0 left-3/4 w-[1px] bg-white/[0.02] pointer-events-none" />
      <div className="absolute inset-x-0 top-1/3 h-[1px] bg-white/[0.02] pointer-events-none" />
      <div className="absolute inset-x-0 top-2/3 h-[1px] bg-white/[0.02] pointer-events-none" />

      {/* Decorative vertical blueprint ticks */}
      <div className="absolute left-6 top-1/2 -translate-y-1/2 flex flex-col gap-3 opacity-20 pointer-events-none">
        <div className="w-1.5 h-1.5 rounded-full bg-white" />
        <div className="w-3 h-[1px] bg-white" />
        <div className="w-1.5 h-1.5 rounded-full bg-white" />
      </div>

      <div className="relative z-10 max-w-4xl px-6 text-center flex flex-col items-center gap-6">

        {/* Animated Badge */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#c0dedd]/20 bg-[#181a1e]/60 backdrop-blur-md"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#c0dedd] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#c0dedd]" />
          </span>
          <span className="text-[10px] font-mono tracking-widest text-[#c0dedd] uppercase font-semibold">
            Free Component Library
          </span>
        </motion.div>

        {/* Tectonic elastic text element */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.0, delay: 0.2 }}
          className="w-full max-w-[95vw] md:max-w-3xl overflow-hidden py-6 select-none"
        >
          <TectonicTrackText
            text="REACTBYTES"
            fontSize={85}
            color="#f2eee9"
            lineColor="rgba(255, 255, 255, 0.08)"
            maxTrackingExpansion={45}
            maxScaleX={1.35}
            influenceRadius={150}
          />
        </motion.div>

        {/* Subtitle statement */}
        <BlurIn
          text="An open-source collection of meticulously designed, highly interactive, aesthetic front React components. Highly customisable with clean code."
          color="rgba(230, 223, 241, 0.8)"
          duration={0.5}
          stagger={0.008}
          initialBlur={10}
          textClassName="text-base md:text-lg max-w-2xl leading-relaxed font-light font-sans"
          containerClassName="flex justify-center"
        />

        {/* Clickable portals */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row items-center gap-4 mt-4"
        >
          <Link
            href="/"
            className="group relative flex items-center gap-2.5 px-8 py-4 rounded-full bg-gradient-to-r from-[#c0dedd] to-[#e6dff1] text-[#060010] font-semibold tracking-tight shadow-xl hover:shadow-[0_0_30px_rgba(192,222,221,0.4)] transition-all duration-300 cursor-pointer"
          >
            Explore Library
            <ArrowRight size={16} className="group-hover:translate-x-1.5 transition-transform duration-300" />
          </Link>

          <a
            href="https://github.com/ChandruMIT-o/reactbytes"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-8 py-4 rounded-full border border-white/10 hover:border-white/20 bg-white/5 backdrop-blur-sm text-[#f2eee9] font-medium tracking-tight transition-all duration-300 cursor-pointer"
          >
            Star on GitHub
            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-github"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path><path d="M9 18c-4.51 2-5-2-7-2"></path></svg>
          </a>
        </motion.div>
      </div>

      {/* Floating Blueprint Coordinates overlay */}
      <div className="absolute left-10 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-6 text-[8px] font-mono text-white/10 tracking-[0.25em]">
        <span>MATR.X_REV</span>
        <span>GAUSS.T_0.75</span>
        <span>DAMP.PH_0.08</span>
        <span>STIFF.PH_0.74</span>
      </div>

    </section>
  );
};

export default HeroSection;
