"use client";

import React, { useRef, useLayoutEffect, useState, useEffect } from "react";
import {
  Cpu,
  Tv,
  CheckCircle,
  Monitor,
  Tablet,
  Smartphone,
  Box,
  Activity,
  Terminal,
  Settings
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { GlowCard } from "../../meta/buttons/GlowCard/GlowCard";

gsap.registerPlugin(ScrollTrigger);

// ============================================================================
// 1. LAYER 1: GPU WAVEFORM CANVAS (Solid & Scaled)
// ============================================================================
const GPUWaveCanvas: React.FC<{ active: boolean }> = ({ active }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let t = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener("resize", resize);

    const render = () => {
      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;

      ctx.clearRect(0, 0, w, h);

      // Larger, more spaced out nodes
      const rows = 10;
      const cols = 14;
      const xSpacing = w / (cols - 1);
      const ySpacing = h / (rows - 1);

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = c * xSpacing;

          const waveSpeed = active ? 0.04 : 0.015;
          const heightAmp = active ? 24 : 10;
          const y = r * ySpacing + Math.sin(c * 0.5 + r * 0.3 + t * waveSpeed) * heightAmp;

          const alpha = (1 - Math.abs(c - cols / 2) / (cols / 2)) * (1 - Math.abs(r - rows / 2) / (rows / 2));
          // Solid, non-transparent fill for nodes, relying on mathematical alpha for depth
          ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.8})`;
          ctx.beginPath();
          ctx.arc(x, y, 2.5, 0, Math.PI * 2); // Bigger dots
          ctx.fill();
        }
      }

      t += 1;
      animId = requestAnimationFrame(render);
    };

    render();
    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animId);
    };
  }, [active]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />;
};

// ============================================================================
// 2. LAYER 2: CODE TEMPLATE SHEET (Readable Typography)
// ============================================================================
const CodePanel: React.FC = () => {
  return (
    <div className="font-mono text-xs md:text-sm leading-loose text-zinc-400 w-full h-full flex flex-col justify-center px-6 overflow-hidden select-text bg-zinc-950">
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
// 3. LAYER 3: TS STRICT TYPE CHECK PANEL (Solid Elements)
// ============================================================================
const TSValidationPanel: React.FC = () => {
  return (
    <div className="w-full h-full flex flex-col justify-between py-2 bg-zinc-950 px-2">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-4 text-xs font-mono text-zinc-400">
        <div className="flex items-center gap-2">
          <Terminal size={14} />
          <span>STRICT_MODE</span>
        </div>
        <span className="text-emerald-400 font-bold flex items-center gap-1.5">
          VALIDATED <CheckCircle size={14} />
        </span>
      </div>

      <div className="flex gap-6 items-center flex-grow py-4">
        <div className="font-mono text-xs md:text-sm text-zinc-300 leading-loose w-2/3 flex flex-col gap-1 select-text">
          <div>
            <span className="text-blue-400">interface</span>{" "}
            <span className="text-amber-300">ByteProps</span> &#123;
          </div>
          <div className="pl-4">
            <span className="text-zinc-100">theme:</span>{" "}
            <span className="text-emerald-400">&apos;minimal&apos; | &apos;dark&apos;</span>;
          </div>
          <div className="pl-4">
            <span className="text-zinc-100">gpuAccel:</span>{" "}
            <span className="text-blue-400">boolean</span>;
          </div>
          <div className="pl-4">
            <span className="text-zinc-100">fpsLimit:</span>{" "}
            <span className="text-purple-400">60 | 144</span>;
          </div>
          <div>&#125;</div>
        </div>

        <div className="w-1/3 flex flex-col items-center justify-center gap-3 bg-emerald-950 border border-emerald-900 rounded-xl p-4">
          <CheckCircle size={32} className="text-emerald-500" />
          <span className="font-mono text-[10px] text-emerald-400 uppercase tracking-widest text-center font-bold">Safe</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 text-xs font-mono text-zinc-500 border-t border-zinc-800 pt-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-emerald-500 rounded-full" /> NO_IMPLICIT_ANY
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-emerald-500 rounded-full" /> STRICT_NULL
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// 4. LAYER 4: INJECTABLE PROPS PANEL (Linear Bars instead of Dials)
// ============================================================================
const PropsPanel: React.FC = () => {
  return (
    <div className="w-full h-full flex flex-col justify-between py-2 bg-zinc-950 px-2">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-4 text-xs font-mono text-zinc-400">
        <div className="flex items-center gap-2">
          <Settings size={14} />
          <span>INJECTABLE PROPS</span>
        </div>
        <span className="text-zinc-100 bg-zinc-800 px-2 py-1 rounded text-[10px] font-bold">ACTIVE</span>
      </div>

      <div className="flex flex-col justify-center gap-6 flex-grow py-4 px-2">
        {/* Progress Bar 1 */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between font-mono text-xs">
            <span className="text-zinc-400">ANIMATION_SPEED</span>
            <span className="text-white font-bold">2.5s</span>
          </div>
          <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
            <div className="w-[75%] h-full bg-blue-500" />
          </div>
        </div>

        {/* Progress Bar 2 */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between font-mono text-xs">
            <span className="text-zinc-400">CORNER_RADIUS</span>
            <span className="text-white font-bold">12px</span>
          </div>
          <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
            <div className="w-[40%] h-full bg-purple-500" />
          </div>
        </div>
      </div>

      <div className="w-full bg-zinc-900 rounded-lg p-3 border border-zinc-800 font-mono text-xs text-zinc-400 flex justify-between items-center">
        <span>props=&#123;&#123; speed: 2.5, radius: 12 &#125;&#125;</span>
      </div>
    </div>
  );
};

// ============================================================================
// 5. LAYER 5: COMPILED WIDGET PREVIEW (High Contrast Solid)
// ============================================================================
const CompiledOutput: React.FC = () => {
  return (
    <div className="w-full h-full flex flex-col justify-between py-2 bg-zinc-950 px-2 relative">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-4 text-xs font-mono text-zinc-400">
        <span>COMPILED_OUTPUT</span>
        <span className="flex items-center gap-2 text-white">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          LIVE
        </span>
      </div>

      <div className="flex flex-col items-center justify-center flex-grow py-4">
        <button className="px-8 py-4 rounded-xl bg-white text-black font-sans text-sm font-bold tracking-wide flex items-center gap-3 hover:scale-105 transition-transform duration-300 shadow-[0_0_40px_rgba(255,255,255,0.1)]">
          <Cpu size={18} className="animate-spin" style={{ animationDuration: "3s" }} />
          LAUNCH SUITE
        </button>
      </div>

      <div className="flex items-center justify-between font-mono text-[10px] text-zinc-500 border-t border-zinc-800 pt-4 uppercase">
        <span>Bundle: 1.2KB</span>
        <span>A11Y: PASS</span>
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

  const [gpuActive, setGpuActive] = useState(false);

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

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          const progress = self.progress;
          setGpuActive(progress > 0.6 && progress < 0.9);
        }
      });

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

  const titleText = "PRODUCTION STANDARDS";

  return (
    <section
      ref={sectionRef}
      id="production-ready"
      className="relative w-full z-20 border-t border-zinc-900 bg-[#0A0A0A] md:h-screen flex flex-col justify-between py-12 md:py-16 px-6 md:px-16 overflow-hidden"
    >
      <div className="absolute inset-y-0 left-10 w-[1px] bg-white/[0.02] pointer-events-none" />
      <div className="absolute inset-y-0 right-10 w-[1px] bg-white/[0.02] pointer-events-none" />

      <div className="hidden md:flex flex-col h-full justify-between w-full relative">
        <div className="absolute -top-4 left-0 text-zinc-600 font-mono text-xs select-none pointer-events-none">SYS.MINIMAL_01</div>
        <div className="absolute -top-4 right-0 text-zinc-600 font-mono text-xs select-none pointer-events-none">SOLID_STATE_ACTIVE</div>

        {/* Scaled Header */}
        <div ref={titleRef} className="max-w-2xl z-20 flex flex-col gap-4 relative mt-4 select-none">
          <div className="inline-flex items-center gap-2 text-sm uppercase font-sans font-bold tracking-widest text-zinc-400">
            <Box size={16} /> COMPILATION ENGINE
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
            PRODUCTION READY
          </div>
          <div className="scroll-text-el absolute font-sans font-black text-[12vw] tracking-tighter uppercase text-white select-none whitespace-nowrap text-center opacity-0 translate-y-16">
            PROP DRIVEN
          </div>
          <div className="scroll-text-el absolute font-sans font-black text-[12vw] tracking-tighter uppercase text-white select-none whitespace-nowrap text-center opacity-0 translate-y-16">
            TYPE SAFE
          </div>
          <div className="scroll-text-el absolute font-sans font-black text-[12vw] tracking-tighter uppercase text-white select-none whitespace-nowrap text-center opacity-0 translate-y-16">
            GPU SPEED
          </div>
          <div className="scroll-text-el absolute font-sans font-black text-[12vw] tracking-tighter uppercase text-white select-none whitespace-nowrap text-center opacity-0 translate-y-16">
            READY TO SHIP
          </div>
        </div>

        {/* 3D Exploded Layer Stack - Scaled Dimensions */}
        <div className="flex items-center justify-center [perspective:2000px] w-full h-[60vh] relative z-10 my-auto">
          <div
            ref={stackRef}
            className="relative w-[520px] h-[340px] [transform-style:preserve-3d] select-none"
          >
            {/* Layers - Swapped to Solid Backgrounds and will-change for performance */}
            <div className="layer-el absolute inset-0 flex items-center justify-center will-change-transform">
              <GlowCard className="w-full h-full shadow-2xl" borderWidth={1} baseColor="#09090b" borderRadius="1rem">
                <div className="p-6 flex flex-col justify-between w-full h-full">
                  <GPUWaveCanvas active={gpuActive} />
                  <div className="flex items-center justify-between text-xs font-mono text-zinc-400 relative z-10 border-b border-zinc-800 pb-4">
                    <span>RENDER_MATRIX</span>
                    <span className="text-white font-bold">LAYER_01</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] font-mono text-zinc-600 relative z-10 uppercase">
                    <span>Active Mesh</span>
                    <span>0.12ms</span>
                  </div>
                </div>
              </GlowCard>
            </div>

            <div className="layer-el absolute inset-0 flex items-center justify-center will-change-transform">
              <GlowCard className="w-full h-full shadow-2xl" borderWidth={1} baseColor="#09090b" borderRadius="1rem">
                <div className="p-6 flex flex-col justify-between w-full h-full">
                  <div className="flex items-center justify-between text-xs font-mono text-zinc-400 border-b border-zinc-800 pb-4">
                    <span>TSX_TEMPLATE</span>
                    <span className="text-white font-bold">LAYER_02</span>
                  </div>
                  <div className="flex-grow flex items-center justify-center py-4">
                    <CodePanel />
                  </div>
                </div>
              </GlowCard>
            </div>

            <div className="layer-el absolute inset-0 flex items-center justify-center will-change-transform">
              <GlowCard className="w-full h-full shadow-2xl" borderWidth={1} baseColor="#09090b" borderRadius="1rem">
                <div className="p-6 flex flex-col justify-between w-full h-full">
                  <TSValidationPanel />
                </div>
              </GlowCard>
            </div>

            <div className="layer-el absolute inset-0 flex items-center justify-center will-change-transform">
              <GlowCard className="w-full h-full shadow-2xl" borderWidth={1} baseColor="#09090b" borderRadius="1rem">
                <div className="p-6 flex flex-col justify-between w-full h-full">
                  <PropsPanel />
                </div>
              </GlowCard>
            </div>

            <div className="layer-el absolute inset-0 flex items-center justify-center will-change-transform">
              <GlowCard className="w-full h-full shadow-2xl" borderWidth={1} baseColor="#09090b" borderRadius="1rem">
                <div className="p-6 flex flex-col justify-between w-full h-full">
                  <CompiledOutput />
                </div>
              </GlowCard>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center text-xs font-mono text-zinc-600 relative z-10 uppercase tracking-widest select-none mb-4">
          <div className="flex items-center gap-2">
            <Tv size={14} />
            <span>Solid State Exploder // Active</span>
          </div>
          <span>V_2.0.0</span>
        </div>
      </div>

      {/* Mobile Flat Layout - Updated for Readability & Solid styling */}
      <div className="flex md:hidden flex-col gap-12 py-12 relative w-full">
        <div className="flex flex-col gap-4 max-w-xl">
          <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest">Architecture Suite</span>
          <h2 className="text-3xl font-black tracking-tight text-white font-sans uppercase">Production Standards</h2>
          <p className="text-sm text-zinc-400 font-sans leading-relaxed">
            Minimalist layout architecture demonstrating standard customization layers and GPU rendering metrics.
          </p>
        </div>

        <div className="flex flex-col gap-10 w-full">
          <div className="flex flex-col gap-4">
            <span className="font-mono text-xs text-white uppercase tracking-widest">01 // Compiled</span>
            <GlowCard className="shadow-2xl h-[320px] w-full" borderWidth={1} baseColor="#09090b" borderRadius="1rem">
              <div className="p-6 flex flex-col justify-between w-full h-full">
                <CompiledOutput />
              </div>
            </GlowCard>
          </div>

          <div className="flex flex-col gap-4">
            <span className="font-mono text-xs text-white uppercase tracking-widest">02 // Props</span>
            <GlowCard className="shadow-2xl h-[320px] w-full" borderWidth={1} baseColor="#09090b" borderRadius="1rem">
              <div className="p-6 flex flex-col justify-between w-full h-full">
                <PropsPanel />
              </div>
            </GlowCard>
          </div>

          <div className="flex flex-col gap-4">
            <span className="font-mono text-xs text-white uppercase tracking-widest">03 // Validation</span>
            <GlowCard className="shadow-2xl h-[320px] w-full" borderWidth={1} baseColor="#09090b" borderRadius="1rem">
              <div className="p-6 flex flex-col justify-between w-full h-full">
                <TSValidationPanel />
              </div>
            </GlowCard>
          </div>

          <div className="flex flex-col gap-4">
            <span className="font-mono text-xs text-white uppercase tracking-widest">04 // Template</span>
            <GlowCard className="shadow-2xl h-[320px] w-full" borderWidth={1} baseColor="#09090b" borderRadius="1rem">
              <div className="p-6 flex flex-col justify-between w-full h-full">
                <CodePanel />
              </div>
            </GlowCard>
          </div>

          <div className="flex flex-col gap-4">
            <span className="font-mono text-xs text-white uppercase tracking-widest">05 // GPU</span>
            <GlowCard className="shadow-2xl h-[320px] w-full relative overflow-hidden" borderWidth={1} baseColor="#09090b" borderRadius="1rem">
              <div className="p-6 flex flex-col justify-between w-full h-full">
                <GPUWaveCanvas active={true} />
                <div className="flex items-center justify-between text-xs font-mono text-zinc-400 relative z-10 border-b border-zinc-800 pb-4">
                  <span>GPU WAVEFORM</span>
                  <span className="text-white font-bold">ACTIVE</span>
                </div>
                <div className="flex justify-between items-center text-[10px] font-mono text-zinc-600 relative z-10 uppercase">
                  <span>Hardware Accelerated</span>
                </div>
              </div>
            </GlowCard>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BentoShowcaseSection;