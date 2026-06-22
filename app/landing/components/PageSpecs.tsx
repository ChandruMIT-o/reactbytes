"use client";

import React, { useRef, useLayoutEffect } from "react";
import { BarChart2, Info } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import AxialShearText from "@/app/meta/text/AxialShearText/AxialShearText";

gsap.registerPlugin(ScrollTrigger);

interface SpecItem {
  label: string;
  value: string;
  numericValue: number;
  suffix: string;
  prefix: string;
  status: string;
  percentage: number;
  decimals: number;
}

const specs: SpecItem[] = [
  { label: "BUNDLE footprint", value: "< 12KB", numericValue: 12, suffix: "KB", prefix: "< ", status: "OPTIMAL", percentage: 12, decimals: 0 },
  { label: "SHADERS compile time", value: "~0.15s", numericValue: 0.15, suffix: "s", prefix: "~", status: "FAST", percentage: 15, decimals: 2 },
  { label: "WebGL version", value: "1.0 ES", numericValue: 1.0, suffix: " ES", prefix: "", status: "STABLE", percentage: 100, decimals: 1 },
  { label: "FRAME delta rate", value: "< 16.6ms", numericValue: 16.6, suffix: "ms", prefix: "< ", status: "60 FPS", percentage: 95, decimals: 1 },
  { label: "Core dependencies", value: "ZERO", numericValue: 0, suffix: "", prefix: "", status: "STANDALONE", percentage: 0, decimals: 0 },
  { label: "Tailwind engine", value: "V4.0", numericValue: 4.0, suffix: "", prefix: "V", status: "NATIVE", percentage: 100, decimals: 1 },
];

export const PageSpecs: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (!sectionRef.current || !gridRef.current) return;

      // --- Title entrance ---
      if (titleRef.current) {
        gsap.fromTo(
          titleRef.current.children,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: titleRef.current,
              start: "top 85%",
              end: "top 55%",
              scrub: 1,
            },
          }
        );
      }

      // --- Staggered card waterfall ---
      const cards = gridRef.current.querySelectorAll(".spec-card");
      gsap.fromTo(
        cards,
        { opacity: 0, y: 40, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: {
            trigger: gridRef.current,
            start: "top 80%",
            end: "top 40%",
            scrub: 1,
          },
        }
      );

      // --- Scroll-driven number counters ---
      cards.forEach((card, idx) => {
        const spec = specs[idx];
        const valueEl = card.querySelector(".spec-value") as HTMLElement;
        const barEl = card.querySelector(".spec-bar-fill") as HTMLElement;

        if (valueEl && spec) {
          const obj = { val: 0 };
          gsap.to(obj, {
            val: spec.numericValue,
            ease: "power2.out",
            scrollTrigger: {
              trigger: card,
              start: "top 75%",
              end: "top 35%",
              scrub: 1,
            },
            onUpdate: () => {
              if (spec.numericValue === 0) {
                valueEl.textContent = "ZERO";
              } else {
                valueEl.textContent = `${spec.prefix}${obj.val.toFixed(spec.decimals)}${spec.suffix}`;
              }
            },
          });
        }

        // --- Scroll-driven progress bars ---
        if (barEl && spec.percentage > 0) {
          gsap.fromTo(
            barEl,
            { width: "0%" },
            {
              width: `${spec.percentage}%`,
              ease: "power2.out",
              scrollTrigger: {
                trigger: card,
                start: "top 70%",
                end: "top 30%",
                scrub: 1,
              },
            }
          );
        }
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="specs" className="relative w-full py-32 z-20 border-t border-white/5">
      {/* Blueprint layout grids */}
      <div className="absolute inset-y-0 left-10 w-[1px] bg-white/[0.01] pointer-events-none" />
      <div className="absolute inset-y-0 right-10 w-[1px] bg-white/[0.01] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 flex flex-col gap-16">
        {/* Header */}
        <div ref={titleRef} className="text-center flex flex-col items-center gap-4">
          <div className="inline-flex items-center gap-1.5 text-xs uppercase font-mono tracking-widest text-[#c0dedd]">
            <BarChart2 size={13} /> Performance Metrics
          </div>
          <div className="select-none py-2">
            <AxialShearText
              text="TECHNICAL DATA"
              fontSize={50}
              color="#f2eee9"
              shearColor="rgba(192, 222, 221, 0.4)"
              influenceRadius={90}
            />
          </div>
          <p className="text-xs md:text-sm text-[#e6dff1]/50 leading-relaxed font-light font-sans text-center max-w-lg">
            Meticulously scoped calculations. Each metric represents hardware benchmarks designed to keep your load speeds lightning-fast.
          </p>
        </div>

        {/* Specs Technical Grid */}
        <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 border border-white/5 rounded-2xl overflow-hidden bg-[#181a1e]/10 backdrop-blur-md">
          {specs.map((item, idx) => (
            <div
              key={item.label}
              className="spec-card p-6 border-b border-r border-white/5 flex flex-col gap-3 group hover:bg-[#c0dedd]/5 transition-colors duration-300"
            >
              <div className="flex justify-between items-center text-[10px] font-mono tracking-wider">
                <span className="text-[#e6dff1]/30 uppercase">{item.label}</span>
                <span className="text-[#c0dedd] bg-[#c0dedd]/10 px-1.5 py-0.5 rounded text-[8px] font-bold">
                  {item.status}
                </span>
              </div>
              <span className="spec-value text-xl font-bold font-mono text-white group-hover:translate-x-1.5 transition-transform duration-300">
                {item.prefix}0{item.suffix}
              </span>

              {/* Scroll-driven bar graph */}
              <div className="mt-2 flex flex-col gap-1 w-full">
                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden relative border border-white/[0.02]">
                  <div
                    className="spec-bar-fill h-full bg-gradient-to-r from-[#c0dedd]/60 to-[#c0dedd] rounded-full"
                    style={{
                      width: "0%",
                      boxShadow: item.percentage > 0 ? "0 0 6px rgba(192,222,221,0.4)" : "none",
                    }}
                  />
                </div>
                <div className="flex justify-between text-[6px] font-mono text-white/20 px-0.5 mt-0.5 select-none">
                  <span>00</span>
                  <span>50</span>
                  <span>100</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Blueprint footnotes */}
        <div className="flex justify-between items-center text-[8px] font-mono text-[#e6dff1]/15">
          <div className="flex items-center gap-1.5">
            <Info size={10} />
            <span>MEASURED ON AMD RYZEN 9 // RTX 4070 LAB BENCHMARKS</span>
          </div>
          <span>SPEC_MATRIX_V1</span>
        </div>
      </div>
    </section>
  );
};

export default PageSpecs;
