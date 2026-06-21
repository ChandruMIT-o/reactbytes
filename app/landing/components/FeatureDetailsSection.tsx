"use client";

import React, { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Cpu, Sliders, Layers } from "lucide-react";
import StripeFlow from "@/app/meta/background/StripeFlow/StripeFlow";
import BlurIn from "@/app/meta/text/TextEnter/BlurIn";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  index: number;
  palette: "vapor" | "sunset" | "slate" | "acid";
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, index, palette }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  // Motion values to track mouse coordinate offsets inside the card
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth spring physics for fluid tilt animations
  const springConfig = { damping: 25, stiffness: 220, mass: 0.6 };
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [10, -10]), springConfig);
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-10, 10]), springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    
    // Calculate normalized coordinates (-0.5 to 0.5)
    const relativeX = (e.clientX - rect.left) / rect.width - 0.5;
    const relativeY = (e.clientY - rect.top) / rect.height - 0.5;
    
    x.set(relativeX);
    y.set(relativeY);
  };

  const handleMouseLeave = () => {
    setHovered(false);
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
      className="relative flex flex-col gap-5 p-8 rounded-3xl bg-[#181a1e]/20 border border-white/5 hover:border-white/10 transition-colors duration-500 cursor-pointer select-none group w-full overflow-hidden"
    >
      
      {/* StripeFlow animated background on hover */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none rounded-3xl overflow-hidden">
        <StripeFlow 
          palette={palette}
          isPaused={!hovered}
          speed={0.9}
          distortion={35}
          scale={0.01}
          className="absolute inset-0 w-full h-full bg-transparent border-none"
        />
      </div>

      {/* Glow highlight reflecting card angle */}
      <div 
        className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0"
        style={{
          background: "radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(192,222,221,0.06) 0%, transparent 60%)",
        }}
      />

      {/* Decorative Blueprint Corner Lines */}
      {hovered && (
        <>
          <div className="absolute top-2 left-2 w-3 h-3 border-t border-l border-[#c0dedd]/40 z-10" />
          <div className="absolute top-2 right-2 w-3 h-3 border-t border-r border-[#c0dedd]/40 z-10" />
          <div className="absolute bottom-2 left-2 w-3 h-3 border-b border-l border-[#c0dedd]/40 z-10" />
          <div className="absolute bottom-2 right-2 w-3 h-3 border-b border-r border-[#c0dedd]/40 z-10" />
        </>
      )}

      {/* Icon Wrapper (rotates in 3D space) */}
      <div 
        style={{ transform: "translateZ(30px)" }}
        className="relative p-4 rounded-2xl bg-white/5 border border-white/5 text-[#c0dedd] w-fit group-hover:bg-[#c0dedd]/15 group-hover:border-[#c0dedd]/30 transition-all duration-300 z-10"
      >
        {icon}
      </div>

      {/* Title */}
      <h3 
        style={{ transform: "translateZ(20px)" }}
        className="text-lg font-bold font-mono text-white tracking-tight uppercase group-hover:text-[#c0dedd] transition-colors duration-300 z-10"
      >
        {title}
      </h3>

      {/* Description */}
      <p 
        style={{ transform: "translateZ(10px)" }}
        className="text-xs md:text-sm text-[#e6dff1]/60 leading-relaxed font-light font-sans z-10"
      >
        {description}
      </p>
      
    </motion.div>
  );
};

export const FeatureDetailsSection: React.FC = () => {
  const features = [
    {
      icon: <Cpu size={22} />,
      title: "GPU Acceleration",
      description: "Direct rendering via custom fragment shaders inside single-pass WebGL rendering pipelines, yielding smooth 60fps animations with minimal battery drain.",
      palette: "vapor" as const,
    },
    {
      icon: <Sliders size={22} />,
      title: "Declarative Control",
      description: "Fully customize layout variables. Set spring physics constants, uniform arrays, scale multipliers, colors, and motion offsets on the fly.",
      palette: "sunset" as const,
    },
    {
      icon: <Layers size={22} />,
      title: "Zero Overhead",
      description: "No heavy packages. Direct file copy setup. Styles are handled natively via utility stylesheets, keeping your builds exceptionally clean.",
      palette: "acid" as const,
    },
  ];

  return (
    <section id="features" className="w-full px-6 md:px-20 py-24 bg-[#060010] relative z-20">
      
      {/* Blueprint background details */}
      <div className="absolute top-0 inset-x-20 h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none" />

      <div className="max-w-6xl mx-auto flex flex-col gap-16 relative">
        
        {/* Title details */}
        <div className="text-center md:text-left flex flex-col gap-4 max-w-xl">
          <span className="text-[10px] font-mono tracking-widest text-[#e6dff1]/40 uppercase">Architecture Details</span>
          <h2 className="text-2xl md:text-3.5xl font-bold tracking-tight text-white font-mono uppercase">
            Designed for Aesthetics & speed
          </h2>
          <div className="w-16 h-[2px] bg-[#c0dedd] mx-auto md:mx-0" />
          <BlurIn 
            text="React Bytes is engineered to inject high-fidelity graphics and custom interactions into Web applications while maintaining peak performance."
            color="rgba(230, 223, 241, 0.5)"
            duration={0.6}
            stagger={0.005}
            initialBlur={8}
            textClassName="text-xs md:text-sm leading-relaxed font-light font-sans text-center md:text-left"
            containerClassName="flex justify-start"
          />
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feat, idx) => (
            <FeatureCard 
              key={feat.title}
              icon={feat.icon}
              title={feat.title}
              description={feat.description}
              palette={feat.palette}
              index={idx}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureDetailsSection;
