"use client";

import React from "react";
import { motion } from "framer-motion";
import { Info, BarChart2 } from "lucide-react";
import AxialShearText from "@/app/meta/text/AxialShearText/AxialShearText";
import BlurIn from "@/app/meta/text/TextEnter/BlurIn";

export const PageSpecs: React.FC = () => {
  const specs = [
    { label: "BUNDLE footprint", value: "< 12KB", status: "OPTIMAL", percentage: 12 },
    { label: "SHADERS compile time", value: "~0.15s", status: "FAST", percentage: 15 },
    { label: "WebGL version", value: "1.0 ES", status: "STABLE", percentage: 100 },
    { label: "FRAME delta rate", value: "< 16.6ms", status: "60 FPS", percentage: 95 },
    { label: "Core dependencies", value: "ZERO", status: "STANDALONE", percentage: 0 },
    { label: "Tailwind engine", value: "V4.0", status: "NATIVE", percentage: 100 },
  ];

  return (
    <section id="specs" className="relative w-full py-24 bg-[#060010] z-20 border-t border-white/5">
      {/* Blueprint layout grids */}
      <div className="absolute inset-y-0 left-10 w-[1px] bg-white/[0.01] pointer-events-none" />
      <div className="absolute inset-y-0 right-10 w-[1px] bg-white/[0.01] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 flex flex-col gap-14">
        
        {/* Header */}
        <div className="text-center flex flex-col items-center gap-4">
          <div className="inline-flex items-center gap-1.5 text-xs uppercase font-mono tracking-widest text-[#c0dedd]">
            <BarChart2 size={13} /> Performance metrics
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
          <BlurIn 
            text="Meticulously scoped calculations. Each metric represents hardware benchmarks designed to keep your load speeds lightning-fast."
            color="rgba(230, 223, 241, 0.5)"
            duration={0.6}
            stagger={0.005}
            initialBlur={8}
            textClassName="text-xs md:text-sm leading-relaxed font-light font-sans text-center"
            containerClassName="flex justify-center"
          />
        </div>

        {/* Specs Technical Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 border border-white/5 rounded-2xl overflow-hidden bg-[#181a1e]/10 backdrop-blur-md">
          {specs.map((item, idx) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="p-6 border-b border-r border-white/5 flex flex-col gap-3 group hover:bg-[#c0dedd]/5 transition-colors duration-300"
            >
              <div className="flex justify-between items-center text-[10px] font-mono tracking-wider">
                <span className="text-[#e6dff1]/30 uppercase">{item.label}</span>
                <span className="text-[#c0dedd] bg-[#c0dedd]/10 px-1.5 py-0.5 rounded text-[8px] font-bold">
                  {item.status}
                </span>
              </div>
              <span className="text-xl font-bold font-mono text-white group-hover:translate-x-1.5 transition-transform duration-300">
                {item.value}
              </span>

              {/* Technical animated bar graph */}
              <div className="mt-2 flex flex-col gap-1 w-full">
                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden relative border border-white/[0.02]">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${item.percentage}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, delay: idx * 0.12 + 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="h-full bg-gradient-to-r from-[#c0dedd]/60 to-[#c0dedd] rounded-full"
                    style={{
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
            </motion.div>
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
