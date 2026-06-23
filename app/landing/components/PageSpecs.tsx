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
  { label: "Bundle Format", value: "TSX Source", numericValue: 0, suffix: "", prefix: "", status: "RAW", percentage: 100, decimals: 0 },
  { label: "Hours you can save", value: "40+ Hours", numericValue: 40, suffix: "+ Hours", prefix: "", status: "EFFICIENT", percentage: 90, decimals: 0 },
  { label: "Less dependencies", value: "Minimal", numericValue: 0, suffix: "", prefix: "", status: "LIGHTWEIGHT", percentage: 10, decimals: 0 },
  { label: "Component options", value: "25+ Variants", numericValue: 25, suffix: "+ Variants", prefix: "", status: "CREATIVE", percentage: 85, decimals: 0 },
  { label: "Styling freedom", value: "Tailwind / CSS", numericValue: 0, suffix: "", prefix: "", status: "FLEXIBLE", percentage: 100, decimals: 0 },
  { label: "Frame target", value: "60 FPS", numericValue: 60, suffix: " FPS", prefix: "", status: "SMOOTH", percentage: 95, decimals: 0 },
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
                valueEl.textContent = spec.value;
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
            Well planned prop control. All components are performance tested to ensure smoothness.
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
            <span>DEVELOPED WITH HIGH-FIDELITY DESIGN PRINCIPLES // ZERO BUILD OVERHEAD</span>
          </div>
          <span>SPEC_MATRIX_V1</span>
        </div>
      </div>
    </section>
  );
};

export default React.memo(PageSpecs);
