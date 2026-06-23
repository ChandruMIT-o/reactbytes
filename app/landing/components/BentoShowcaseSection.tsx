"use client";

import React, { useRef, useLayoutEffect, useState, useEffect } from "react";
import {
  Cpu,
  Tv,
  CheckCircle,
  Box,
  Terminal,
  Settings
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { GlowCard } from "../../meta/buttons/GlowCard/GlowCard";

gsap.registerPlugin(ScrollTrigger);

// ============================================================================
// 1. LAYER 1: DOWNLOAD PANEL
// ============================================================================
const DownloadPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'cli' | 'npm' | 'mcp'>('cli');

  useEffect(() => {
    const tabs: ('cli' | 'npm' | 'mcp')[] = ['cli', 'npm', 'mcp'];
    let idx = 0;
    const interval = setInterval(() => {
      idx = (idx + 1) % tabs.length;
      setActiveTab(tabs[idx]);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-full flex flex-col justify-between py-3 px-3 relative bg-transparent">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3 text-sm font-mono text-zinc-300">
        <span>04 // FREE_GET_CHANNELS</span>
        <span className="text-[#c0dedd] font-bold text-[11px] uppercase tracking-wider">Free & Open Source</span>
      </div>

      <div className="flex flex-col gap-4 flex-grow justify-center py-4 px-1">
        {/* Simple visual tabs */}
        <div className="flex gap-3 border-b border-zinc-800 pb-3 font-mono text-xs">
          <span className={`px-2.5 py-1 rounded cursor-pointer transition-colors duration-200 ${activeTab === 'cli' ? 'bg-[#c0dedd]/10 text-[#c0dedd]' : 'text-zinc-500'}`}>CLI</span>
          <span className={`px-2.5 py-1 rounded cursor-pointer transition-colors duration-200 ${activeTab === 'npm' ? 'bg-[#c0dedd]/10 text-[#c0dedd]' : 'text-zinc-500'}`}>NPM</span>
          <span className={`px-2.5 py-1 rounded cursor-pointer transition-colors duration-200 ${activeTab === 'mcp' ? 'bg-[#c0dedd]/10 text-[#c0dedd]' : 'text-zinc-500'}`}>MCP</span>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 font-mono text-sm text-zinc-200 h-20 flex items-center justify-between">
          {activeTab === 'cli' && (
            <>
              <span className="text-zinc-400 select-all">npx reactbytes add ripple</span>
              <Terminal size={18} className="text-zinc-500" />
            </>
          )}
          {activeTab === 'npm' && (
            <>
              <span className="text-zinc-400 select-all">npm i @reactbytes/ripple</span>
              <Box size={18} className="text-zinc-500" />
            </>
          )}
          {activeTab === 'mcp' && (
            <>
              <span className="text-zinc-400 select-all">@reactbytes insert ripple</span>
              <Cpu size={18} className="text-zinc-500" />
            </>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between font-mono text-[11px] text-zinc-500 border-t border-zinc-800 pt-3 uppercase">
        <span>No signup required</span>
        <span>MIT License</span>
      </div>
    </div>
  );
};

// ============================================================================
// 2. LAYER 2: CODE TEMPLATE SHEET (Readable Typography)
// ============================================================================
const CodePanel: React.FC = () => {
  return (
    <div className="font-mono text-sm md:text-base leading-loose text-zinc-400 w-full h-full flex flex-col justify-center px-4 overflow-hidden select-text bg-transparent">
      <div>
        <span className="text-blue-400">import</span>{" "}
        <span className="text-zinc-100">React, &#123; useState &#125;</span>{" "}
        <span className="text-blue-400">from</span>{" "}
        <span className="text-emerald-400">&quot;react&quot;</span>;
      </div>
      <div>
        <span className="text-blue-400">import</span>{" "}
        <span className="text-zinc-100">&#123; motion &#125;</span>{" "}
        <span className="text-blue-400">from</span>{" "}
        <span className="text-emerald-400">&quot;framer-motion&quot;</span>;
      </div>
      <div className="mt-4 text-zinc-500">// Solid minimal configuration</div>
      <div>
        <span className="text-blue-400">export default function</span>{" "}
        <span className="text-amber-300">LaunchButton</span>() &#123;
      </div>
      <div>&#125;</div>
    </div>
  );
};

// ============================================================================
// 3. LAYER 3: JSX CODE GENERATOR (Solid Elements)
// ============================================================================
const CopyCodePanel: React.FC = () => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-full flex flex-col justify-between py-3 px-3 bg-transparent">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3 text-sm font-mono text-zinc-300">
        <div className="flex items-center gap-2">
          <Terminal size={16} />
          <span>03 // CODE_GENERATOR</span>
        </div>
        <span className="text-emerald-400 font-bold flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
          {copied ? "COPIED" : "READY"} {copied && <CheckCircle size={12} />}
        </span>
      </div>

      <div className="flex gap-4 items-center flex-grow py-4 px-1">
        <div className="font-mono text-[13px] text-zinc-300 leading-normal w-2/3 flex flex-col gap-2 select-text">
          <div className="text-zinc-500">// Custom styling ready</div>
          <div>
            <span className="text-blue-400">&lt;</span>
            <span className="text-[#c0dedd]">Ripple</span>
          </div>
          <div className="pl-4">
            <span className="text-purple-400">zoom</span>=<span className="text-emerald-400">&#123;1.5&#125;</span>
          </div>
          <div className="pl-4">
            <span className="text-purple-400">speed</span>=<span className="text-emerald-400">&#123;0.25&#125;</span>
          </div>
          <div className="pl-4">
            <span className="text-purple-400">colorBase</span>=<span className="text-emerald-400">&quot;#c0dedd&quot;</span>
          </div>
          <div>
            <span className="text-blue-400">/&gt;</span>
          </div>
        </div>

        <div className="w-1/3 flex flex-col items-center justify-center gap-3 bg-zinc-900 border border-zinc-800 rounded-xl p-4 h-28 relative overflow-hidden">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${copied ? "bg-emerald-500/20 border-emerald-500 text-emerald-400" : "bg-[#c0dedd]/10 border-white/5 text-[#c0dedd] hover:bg-[#c0dedd]/20"} border`}>
            {copied ? <CheckCircle size={20} /> : <Box size={20} />}
          </div>
          <span className="font-mono text-[10px] text-zinc-400 uppercase tracking-widest text-center">
            {copied ? "Copied!" : "Copy Code"}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 text-[11px] font-mono text-zinc-500 border-t border-zinc-800 pt-3 uppercase">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 bg-emerald-500 rounded-full" /> JSX Validated
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 bg-emerald-500 rounded-full" /> Zero Imports
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// 4. LAYER 4: PROP CONTROLLER (Simulating Prop Combination Testing)
// ============================================================================
const TestCombinationsPanel: React.FC = () => {
  const [speed, setSpeed] = useState(2.5);
  const [glow, setGlow] = useState(65);
  const [zoom, setZoom] = useState(2.8);

  useEffect(() => {
    let t = 0;
    const interval = setInterval(() => {
      t += 0.05;
      setSpeed(Number((2.5 + Math.sin(t) * 1.5).toFixed(1)));
      setGlow(Math.floor(50 + Math.cos(t) * 35));
      setZoom(Number((2.8 + Math.sin(t * 1.2) * 1.2).toFixed(1)));
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-full flex flex-col justify-between py-3 px-3 bg-transparent">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3 text-sm font-mono text-zinc-300">
        <div className="flex items-center gap-2">
          <Settings size={16} />
          <span>02 // PROP_CONTROLLER</span>
        </div>
        <span className="text-zinc-100 bg-[#c0dedd]/10 text-[#c0dedd] px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider">Tuning</span>
      </div>

      <div className="flex flex-col justify-center gap-6 flex-grow py-3 px-1">
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between font-mono text-[13px]">
            <span className="text-zinc-400">speed</span>
            <span className="text-white font-bold">{speed}s</span>
          </div>
          <div className="w-full h-2 bg-zinc-850 rounded-full overflow-hidden">
            <div className="h-full bg-[#c0dedd]" style={{ width: `${(speed / 4) * 100}%` }} />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between font-mono text-[13px]">
            <span className="text-zinc-400">glowIntensity</span>
            <span className="text-white font-bold">{glow}%</span>
          </div>
          <div className="w-full h-2 bg-zinc-850 rounded-full overflow-hidden">
            <div className="h-full bg-purple-500" style={{ width: `${glow}%` }} />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between font-mono text-[13px]">
            <span className="text-zinc-400">zoomFactor</span>
            <span className="text-white font-bold">{zoom}x</span>
          </div>
          <div className="w-full h-2 bg-zinc-850 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500" style={{ width: `${(zoom / 5) * 100}%` }} />
          </div>
        </div>
      </div>

      <div className="w-full bg-zinc-900 rounded-lg p-3 border border-zinc-800 font-mono text-xs text-zinc-400 flex justify-between items-center overflow-x-auto whitespace-nowrap">
        <code>{`<Component speed={${speed}} glow={${glow}} zoom={${zoom}} />`}</code>
      </div>
    </div>
  );
};

// ============================================================================
// 5. LAYER 5: LIVE INTERACTIVE PREVIEW
// ============================================================================
const LivePreviewPanel: React.FC = () => {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className="w-full h-full flex flex-col justify-between py-3 px-3 bg-transparent relative overflow-hidden"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3 text-sm font-mono text-zinc-300">
        <span>01 // LIVE_PREVIEW</span>
        <span className="flex items-center gap-2 text-white">
          <div className="w-2.5 h-2.5 bg-[#c0dedd] rounded-full animate-ping" />
          ACTIVE
        </span>
      </div>

      <div className="flex flex-col items-center justify-center flex-grow py-4 relative">
        <div className={`w-36 h-36 rounded-full bg-gradient-to-tr from-[#c0dedd]/20 via-[#e6dff1]/30 to-[#060010] border border-white/10 flex items-center justify-center transition-all duration-700 relative group shadow-[0_0_40px_rgba(192,222,221,0.15)] ${hovered ? "scale-110" : "scale-100"}`}>
          <div className="absolute inset-3 rounded-full border border-dashed border-[#c0dedd]/30 animate-spin" style={{ animationDuration: "12s" }} />
          <div className="absolute inset-8 rounded-full bg-[#0a0712] border border-white/5 flex items-center justify-center">
            <Cpu size={32} className="text-[#c0dedd]" />
          </div>
        </div>
        <span className="mt-4 font-mono text-[10px] text-[#e6dff1]/40 uppercase tracking-widest">Hover to test cursor response</span>
      </div>

      <div className="flex items-center justify-between font-mono text-[11px] text-zinc-500 border-t border-zinc-800 pt-3 uppercase">
        <span>Renderer: WebGL / CSS</span>
        <span>Status: 60fps</span>
      </div>
    </div>
  );
};

// ============================================================================
// MAIN COMPONENT: BENTOSHOWCASESECTION
// ============================================================================
export const BentoShowcaseSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const stackRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const isDesktop = window.matchMedia("(min-width: 768px)").matches;
      if (!isDesktop || !sectionRef.current || !stackRef.current) return;

      const layers = stackRef.current.querySelectorAll(".layer-el");
      const texts = sectionRef.current.querySelectorAll(".scroll-text-el");

      // 1. Cinematic Timeline with extended scroll distance for buttery smoothness
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=4000", // 10x smoother: expanded scroll area
          scrub: 1.5,    // Higher scrub value for fluid interpolation
          pin: true,
          pinSpacing: true,
          invalidateOnRefresh: true,
        }
      });

      if (titleRef.current) {
        const chars = titleRef.current.querySelectorAll(".title-char");
        tl.fromTo(
          chars,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.03,
            ease: "power3.out",
            duration: 1
          },
          0
        );
      }

      tl.to(texts[0], { opacity: 0.03, y: 0, duration: 1.2 }, 0);

      // Step 1: Fan out (Solid clean movements, no tilts)
      // Expanded positioning to accommodate larger cards
      tl.to(layers[0], { x: -340, y: -200, z: -40, scale: 0.9, opacity: 0.4, duration: 2.5, ease: "power3.inOut" }, 0.5);
      tl.to(layers[1], { x: 340, y: -200, z: -30, scale: 0.9, opacity: 0.4, duration: 2.5, ease: "power3.inOut" }, 0.5);
      tl.to(layers[2], { x: -340, y: 200, z: -20, scale: 0.9, opacity: 0.4, duration: 2.5, ease: "power3.inOut" }, 0.5);
      tl.to(layers[3], { x: 340, y: 200, z: -10, scale: 0.9, opacity: 0.4, duration: 2.5, ease: "power3.inOut" }, 0.5);
      tl.to(layers[4], { x: 0, y: 0, z: 0, scale: 1.0, opacity: 1.0, duration: 2.5, ease: "power3.inOut" }, 0.5);

      tl.to(texts[0], { opacity: 0, y: -50, duration: 1.5 }, 2.0);

      // Step 2: Spotlight Card 4
      tl.to(texts[1], { opacity: 0.03, y: 0, duration: 1.5 }, 3.0);
      tl.to(layers, { opacity: 0.15, duration: 1.5 }, 3.0);
      tl.to(layers[3], { x: 0, y: 0, z: 20, scale: 1.05, opacity: 1.0, duration: 2, ease: "power3.inOut" }, 3.0);
      tl.to(layers[4], { x: 340, y: 200, z: -10, scale: 0.9, opacity: 0.15, duration: 2, ease: "power3.inOut" }, 3.0);
      tl.to(texts[1], { opacity: 0, y: -50, duration: 1.5 }, 5.0);

      // Step 3: Spotlight Card 3
      tl.to(texts[2], { opacity: 0.03, y: 0, duration: 1.5 }, 5.5);
      tl.to(layers, { opacity: 0.15, duration: 1.5 }, 5.5);
      tl.to(layers[2], { x: 0, y: 0, z: 20, scale: 1.05, opacity: 1.0, duration: 2, ease: "power3.inOut" }, 5.5);
      tl.to(layers[3], { x: 340, y: 200, z: -10, scale: 0.9, opacity: 0.15, duration: 2, ease: "power3.inOut" }, 5.5);
      tl.to(texts[2], { opacity: 0, y: -50, duration: 1.5 }, 7.5);

      // Step 4: Spotlight Card 1
      tl.to(texts[3], { opacity: 0.03, y: 0, duration: 1.5 }, 8.0);
      tl.to(layers, { opacity: 0.15, duration: 1.5 }, 8.0);
      tl.to(layers[0], { x: 0, y: 0, z: 20, scale: 1.05, opacity: 1.0, duration: 2, ease: "power3.inOut" }, 8.0);
      tl.to(layers[2], { x: -340, y: 200, z: -20, scale: 0.9, opacity: 0.15, duration: 2, ease: "power3.inOut" }, 8.0);
      tl.to(texts[3], { opacity: 0, y: -50, duration: 1.5 }, 10.0);

      // Step 5: Collapse
      tl.to(texts[4], { opacity: 0.03, y: 0, duration: 1.5 }, 10.5);
      tl.to(layers, { x: 0, y: 0, z: 0, scale: 1.0, opacity: 1.0, duration: 2.5, ease: "power3.inOut" }, 10.5);
      tl.to(texts[4], { opacity: 0.06, duration: 1.5 }, 12.0);

      const handleFirstScroll = () => {
        ScrollTrigger.refresh();
        window.removeEventListener("scroll", handleFirstScroll);
      };
      window.addEventListener("scroll", handleFirstScroll);

      const timer = setTimeout(() => ScrollTrigger.refresh(), 1000);

      return () => {
        window.removeEventListener("scroll", handleFirstScroll);
        clearTimeout(timer);
      };
    });

    return () => ctx.revert();
  }, []);

  const titleText = "TEST, COPY & SHIP";

  return (
    <section
      ref={sectionRef}
      id="production-ready"
      className="relative w-full z-20 border-t border-zinc-900 bg-[#0A0A0A] md:h-screen flex flex-col justify-between py-12 md:py-16 px-6 md:px-16 overflow-hidden"
    >
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes scrollDot {
          0% { transform: translateY(0); opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { transform: translateY(12px); opacity: 0; }
        }
        .animate-scroll-dot {
          animation-name: scrollDot;
          animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
          animation-iteration-count: infinite;
        }
      `}} />
      <div className="absolute inset-y-0 left-10 w-[1px] bg-white/[0.02] pointer-events-none" />
      <div className="absolute inset-y-0 right-10 w-[1px] bg-white/[0.02] pointer-events-none" />

      <div className="hidden md:flex flex-col h-full justify-between w-full relative">
        <div className="absolute -top-4 left-0 text-zinc-600 font-mono text-xs select-none pointer-events-none">SYS.PLAYGROUND_01</div>
        <div className="absolute -top-4 right-0 text-zinc-600 font-mono text-xs select-none pointer-events-none">SANDBOX_ACTIVE</div>

        {/* Scaled Header */}
        <div ref={titleRef} className="max-w-2xl z-20 flex flex-col gap-4 relative mt-4 select-none">
          <div className="inline-flex items-center gap-2 text-sm uppercase font-sans font-bold tracking-widest text-[#c0dedd]">
            <Box size={16} /> HOW TO GET OUR COMPONENTS
          </div>
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-white font-sans uppercase">
            {titleText.split("").map((char, i) => (
              <span key={i} className="title-char inline-block">
                {char === " " ? "\u00A0" : char}
              </span>
            ))}
          </h2>
        </div>

        {/* Background Typography */}
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none z-0">
          <div className="scroll-text-el absolute font-sans font-black text-[12vw] tracking-tighter uppercase text-white select-none whitespace-nowrap text-center translate-y-16 opacity-0">
            EXPLORE PLAYGROUND
          </div>
          <div className="scroll-text-el absolute font-sans font-black text-[12vw] tracking-tighter uppercase text-white select-none whitespace-nowrap text-center opacity-0 translate-y-16">
            ADJUST CONTROLS
          </div>
          <div className="scroll-text-el absolute font-sans font-black text-[12vw] tracking-tighter uppercase text-white select-none whitespace-nowrap text-center opacity-0 translate-y-16">
            COPY JSX CODE
          </div>
          <div className="scroll-text-el absolute font-sans font-black text-[12vw] tracking-tighter uppercase text-white select-none whitespace-nowrap text-center opacity-0 translate-y-16">
            FREE DOWNLOAD
          </div>
          <div className="scroll-text-el absolute font-sans font-black text-[12vw] tracking-tighter uppercase text-white select-none whitespace-nowrap text-center opacity-0 translate-y-16">
            IMPORT & SHIP
          </div>
        </div>

        {/* 3D Exploded Layer Stack - Scaled Dimensions */}
        <div className="flex items-center justify-center [perspective:2000px] w-full h-[60vh] relative z-10 my-auto">
          <div
            ref={stackRef}
            className="relative w-[520px] h-[340px] [transform-style:preserve-3d] select-none"
          >
            {/* Layers - Swapped to Solid Backgrounds and will-change for performance */}
            {/* Layer 1: Download Panel */}
            <div className="layer-el absolute inset-0 flex items-center justify-center will-change-transform">
              <GlowCard className="w-full h-full" borderWidth={3} baseColor="#09090b" borderRadius="1rem" padding="0">
                <div className="p-3 flex flex-col justify-between w-full h-full">
                  <DownloadPanel />
                </div>
              </GlowCard>
            </div>

            {/* Layer 2: Clean component code */}
            <div className="layer-el absolute inset-0 flex items-center justify-center will-change-transform">
              <GlowCard className="w-full h-full" borderWidth={3} baseColor="#09090b" borderRadius="1rem" padding="0">
                <div className="p-3 flex flex-col justify-between w-full h-full">
                  <div className="flex items-center justify-between text-sm font-mono text-zinc-300 border-b border-zinc-800 pb-3">
                    <span>05 // TSX_SOURCE_CODE</span>
                    <span className="text-white font-bold text-[11px] uppercase tracking-wider">RAW CODE</span>
                  </div>
                  <div className="flex-grow flex items-center justify-center py-2">
                    <CodePanel />
                  </div>
                </div>
              </GlowCard>
            </div>

            {/* Layer 3: Code Generator / Copy JSX */}
            <div className="layer-el absolute inset-0 flex items-center justify-center will-change-transform">
              <GlowCard className="w-full h-full" borderWidth={3} baseColor="#09090b" borderRadius="1rem" padding="0">
                <div className="p-3 flex flex-col justify-between w-full h-full">
                  <CopyCodePanel />
                </div>
              </GlowCard>
            </div>

            {/* Layer 4: Prop Combinations testing */}
            <div className="layer-el absolute inset-0 flex items-center justify-center will-change-transform">
              <GlowCard className="w-full h-full" borderWidth={3} baseColor="#09090b" borderRadius="1rem" padding="0">
                <div className="p-3 flex flex-col justify-between w-full h-full">
                  <TestCombinationsPanel />
                </div>
              </GlowCard>
            </div>

            {/* Layer 5: Live Interactive Preview */}
            <div className="layer-el absolute inset-0 flex items-center justify-center will-change-transform">
              <GlowCard className="w-full h-full" borderWidth={3} baseColor="#09090b" borderRadius="1rem" padding="0">
                <div className="p-3 flex flex-col justify-between w-full h-full">
                  <LivePreviewPanel />
                </div>
              </GlowCard>
            </div>

            {/* Prominent Center-Aligned Mouse Scroll Indicator (Aligned with Bento Cards) */}
            {/* <div
              className="absolute -bottom-20 left-1/2 -translate-x-1/2 z-30 hidden md:flex flex-col items-center gap-2.5 pointer-events-none transition-all duration-500 ease-out"
              style={{
                opacity: scrollProgress > 0.95 ? 0 : 1,
                transform: `translate(-50%, ${scrollProgress > 0.95 ? "20px" : "0"})`,
              }}
            >
              <div className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center p-1.5 shadow-[0_0_15px_rgba(255,255,255,0.05)] bg-[#09090b]/60 backdrop-blur-sm">
                <div
                  className="w-1.5 h-2.5 bg-[#c0dedd] rounded-full animate-scroll-dot shadow-[0_0_8px_#c0dedd]"
                  style={{
                    animationDuration: `${Math.max(0.5, 1.8 - scrollProgress * 1.65)}s`,
                  }}
                />
              </div>
              <span className="text-[9px] font-mono tracking-widest text-[#e6dff1]/50 uppercase select-none text-center bg-[#09090b]/60 px-2.5 py-0.5 rounded-full backdrop-blur-sm shadow-[0_0_10px_rgba(0,0,0,0.5)]">
                {scrollProgress > 0.85 ? "Release" : "Scroll to explode"}
              </span>
            </div> */}
          </div>
        </div>

        <div className="flex justify-between items-center text-xs font-mono text-zinc-600 relative z-10 uppercase tracking-widest select-none mb-4">
          <div className="flex items-center gap-2">
            <Tv size={14} />
            <span>Interactive Sandbox Exploder // Active</span>
          </div>
          <span>V_2.0.0</span>
        </div>
      </div>

      {/* Mobile Flat Layout - Updated for Readability & Solid styling */}
      <div className="flex md:hidden flex-col gap-12 py-12 relative w-full">
        <div className="flex flex-col gap-4 max-w-xl">
          <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest">How to get our components</span>
          <h2 className="text-3xl font-black tracking-tight text-white font-sans uppercase">Test, Copy & Ship</h2>
          <p className="text-sm text-zinc-400 font-sans leading-relaxed">
            Test components in our sandbox, customize props, copy the JSX, or download the source code for free.
          </p>
        </div>

        <div className="flex flex-col gap-10 w-full">
          <div className="flex flex-col gap-4">
            <span className="font-mono text-xs text-white uppercase tracking-widest">01 // Live Preview</span>
            <GlowCard className="shadow-2xl h-[320px] w-full" borderWidth={1} baseColor="#09090b" borderRadius="3rem" padding="0">
              <div className="p-3 flex flex-col justify-between w-full h-full">
                <LivePreviewPanel />
              </div>
            </GlowCard>
          </div>

          <div className="flex flex-col gap-4">
            <span className="font-mono text-xs text-white uppercase tracking-widest">02 // Props Tuning</span>
            <GlowCard className="shadow-2xl h-[320px] w-full" borderWidth={1} baseColor="#09090b" borderRadius="3rem" padding="0">
              <div className="p-3 flex flex-col justify-between w-full h-full">
                <TestCombinationsPanel />
              </div>
            </GlowCard>
          </div>

          <div className="flex flex-col gap-4">
            <span className="font-mono text-xs text-white uppercase tracking-widest">03 // Code Generator</span>
            <GlowCard className="shadow-2xl h-[320px] w-full" borderWidth={1} baseColor="#09090b" borderRadius="3rem" padding="0">
              <div className="p-3 flex flex-col justify-between w-full h-full">
                <CopyCodePanel />
              </div>
            </GlowCard>
          </div>

          <div className="flex flex-col gap-4">
            <span className="font-mono text-xs text-white uppercase tracking-widest">04 // Download channels</span>
            <GlowCard className="shadow-2xl h-[320px] w-full" borderWidth={1} baseColor="#09090b" borderRadius="3rem" padding="0">
              <div className="p-3 flex flex-col justify-between w-full h-full">
                <DownloadPanel />
              </div>
            </GlowCard>
          </div>

          <div className="flex flex-col gap-4">
            <span className="font-mono text-xs text-white uppercase tracking-widest">05 // Raw Source Code</span>
            <GlowCard className="shadow-2xl h-[320px] w-full" borderWidth={1} baseColor="#09090b" borderRadius="3rem" padding="0">
              <div className="p-3 flex flex-col justify-between w-full h-full">
                <div className="flex items-center justify-between text-sm font-mono text-zinc-300 border-b border-zinc-800 pb-3">
                  <span>05 // TSX_SOURCE_CODE</span>
                  <span className="text-white font-bold text-[11px] uppercase tracking-wider">RAW CODE</span>
                </div>
                <div className="flex-grow flex items-center justify-center py-2">
                  <CodePanel />
                </div>
              </div>
            </GlowCard>
          </div>
        </div>
      </div>
    </section>
  );
};

export default React.memo(BentoShowcaseSection);