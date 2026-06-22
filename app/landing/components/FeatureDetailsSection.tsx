"use client";

import React, { useRef, useLayoutEffect, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Cpu, Sliders, Layers, Zap, Palette, Code2 } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import StripeFlow from "@/app/meta/background/StripeFlow/StripeFlow";

gsap.registerPlugin(ScrollTrigger);

interface StripeConfig {
  palette: "vapor" | "sunset" | "slate" | "acid";
  speed: number;
  distortion: number;
  scale: number;
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  index: number;
  stripeConfig: StripeConfig;
  stat: string;
  statLabel: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
  index,
  stripeConfig,
  stat,
  statLabel
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 220, mass: 0.6 };
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [10, -10]), springConfig);
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-10, 10]), springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Smooth 3D tilt calculations
    x.set(mouseX / rect.width - 0.5);
    y.set(mouseY / rect.height - 0.5);

    // Update native custom variables for accurate spotlight tracking
    cardRef.current.style.setProperty("--mouse-x", `${(mouseX / rect.width) * 100}%`);
    cardRef.current.style.setProperty("--mouse-y", `${(mouseY / rect.height) * 100}%`);
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
      className="feature-card relative flex flex-col gap-5 p-8 rounded-3xl bg-[#181a1e]/20 border border-white/5 hover:border-white/12 transition-all duration-500 cursor-pointer select-none group w-full overflow-hidden shadow-2xl backdrop-blur-sm"
    >
      {/* StripeFlow animated background on hover */}
      <div className="absolute inset-0 z-0 opacity-0 group-hover:opacity-25 transition-opacity duration-700 pointer-events-none rounded-3xl overflow-hidden">
        <StripeFlow
          palette={stripeConfig.palette}
          isPaused={!hovered}
          speed={stripeConfig.speed}
          distortion={stripeConfig.distortion}
          scale={stripeConfig.scale}
          className="absolute inset-0 w-full h-full bg-transparent border-none scale-105"
        />
      </div>

      {/* Dynamic Glow Highlight tracking the cursor position */}
      <div
        className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0 mix-blend-screen"
        style={{
          background: "radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(192,222,221,0.08) 0%, transparent 55%)",
        }}
      />

      {/* Stat Badge - floating number display */}
      <div className="absolute top-5 right-5 flex flex-col items-end z-10 transition-transform duration-300 group-hover:translate-y-[-2px]">
        <span className="text-2xl font-bold font-mono text-[#c0dedd]/80 leading-none">{stat}</span>
        <span className="text-[8px] font-mono text-white/30 uppercase tracking-widest mt-1">{statLabel}</span>
      </div>

      {/* Icon Wrapper */}
      <div
        style={{ transform: "translateZ(30px)" }}
        className="relative p-4 rounded-2xl bg-white/5 border border-white/5 text-[#c0dedd] w-fit group-hover:bg-[#c0dedd]/15 group-hover:border-[#c0dedd]/40 group-hover:shadow-[0_0_20px_rgba(192,222,221,0.1)] transition-all duration-300 z-10"
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
        className="text-xs md:text-sm text-[#e6dff1]/60 leading-relaxed font-light font-sans z-10 group-hover:text-[#e6dff1]/80 transition-colors duration-300"
      >
        {description}
      </p>

      {/* Bottom tech bar */}
      <div className="mt-auto pt-4 border-t border-white/5 flex items-center gap-2 text-[8px] font-mono text-white/15 z-10 uppercase tracking-widest">
        <span className="h-1 w-1 rounded-full bg-[#c0dedd]/40" />
        <span>MODULE_{String(index + 1).padStart(2, "0")}</span>
      </div>
    </motion.div>
  );
};

export const FeatureDetailsSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<SVGSVGElement>(null);

  const features = [
    {
      icon: <Cpu size={22} />,
      title: "GPU Acceleration",
      description: "Direct rendering via custom fragment shaders inside single-pass WebGL rendering pipelines, yielding smooth 60fps animations with minimal battery drain.",
      stripeConfig: { palette: "vapor" as const, speed: 1.4, distortion: 45, scale: 0.015 },
      stat: "60",
      statLabel: "FPS TARGET",
    },
    {
      icon: <Sliders size={22} />,
      title: "Declarative Control",
      description: "Fully customize layout variables. Set spring physics constants, uniform arrays, scale multipliers, colors, and motion offsets on the fly.",
      stripeConfig: { palette: "sunset" as const, speed: 0.6, distortion: 20, scale: 0.005 },
      stat: "100%",
      statLabel: "CUSTOMIZABLE",
    },
    {
      icon: <Layers size={22} />,
      title: "Zero Overhead",
      description: "No heavy packages. Direct file copy setup. Styles are handled natively via utility stylesheets, keeping your builds exceptionally clean.",
      stripeConfig: { palette: "acid" as const, speed: 1.1, distortion: 55, scale: 0.02 },
      stat: "0",
      statLabel: "DEPENDENCIES",
    },
    {
      icon: <Code2 size={22} />,
      title: "Copy & Paste",
      description: "Every component is a self-contained file. No CLI install, no config. Just copy the source directly into your project and start using it immediately.",
      stripeConfig: { palette: "slate" as const, speed: 0.8, distortion: 15, scale: 0.008 },
      stat: "1",
      statLabel: "FILE EACH",
    },
    {
      icon: <Palette size={22} />,
      title: "Design System Ready",
      description: "Built with CSS custom properties and Tailwind compatibility. Adapts to your theme tokens, dark mode variables, and design system constraints seamlessly.",
      stripeConfig: { palette: "sunset" as const, speed: 1.0, distortion: 30, scale: 0.012 },
      stat: "∞",
      statLabel: "THEMES",
    },
    {
      icon: <Zap size={22} />,
      title: "Server Compatible",
      description: "All components respect the 'use client' boundary. They work with Next.js App Router, Remix, and any React framework supporting client components.",
      stripeConfig: { palette: "acid" as const, speed: 1.8, distortion: 60, scale: 0.025 },
      stat: "RSC",
      statLabel: "COMPATIBLE",
    },
  ];

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (!sectionRef.current || !titleRef.current || !gridRef.current) return;

      const titleChars = titleRef.current.querySelectorAll(".title-char");
      if (titleChars.length > 0) {
        gsap.fromTo(
          titleChars,
          { opacity: 0, y: 30, rotateX: -90 },
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            stagger: 0.03,
            ease: "back.out(1.7)",
            scrollTrigger: {
              trigger: titleRef.current,
              start: "top 85%",
              end: "top 45%",
              scrub: 1,
            },
          }
        );
      }

      const cards = gridRef.current.querySelectorAll(".feature-card");
      gsap.fromTo(
        cards,
        { opacity: 0, y: 60, scale: 0.92, rotateX: 8 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          rotateX: 0,
          stagger: 0.12,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: gridRef.current,
            start: "top 80%",
            end: "top 30%",
            scrub: 1,
          },
        }
      );

      if (lineRef.current) {
        const paths = lineRef.current.querySelectorAll("path");
        paths.forEach((path) => {
          const length = path.getTotalLength();
          gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
          gsap.to(path, {
            strokeDashoffset: 0,
            ease: "none",
            scrollTrigger: {
              trigger: gridRef.current,
              start: "top 75%",
              end: "center center",
              scrub: 1,
            },
          });
        });
      }
    });

    return () => ctx.revert();
  }, []);

  const titleText = "Designed for Aesthetics & Speed";

  return (
    <section ref={sectionRef} id="features" className="w-full px-6 md:px-20 py-32 relative z-20 overflow-hidden">
      <div className="absolute top-0 inset-x-20 h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto flex flex-col gap-20 relative">
        <div ref={titleRef} className="text-center md:text-left flex flex-col gap-4 max-w-2xl">
          <span className="text-[10px] font-mono tracking-widest text-[#e6dff1]/40 uppercase">
            Architecture Details
          </span>
          <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-white font-mono uppercase" style={{ perspective: "600px" }}>
            {titleText.split("").map((char, i) => (
              <span
                key={i}
                className="title-char inline-block"
                style={{ transformOrigin: "bottom center" }}
              >
                {char === " " ? "\u00A0" : char}
              </span>
            ))}
          </h2>
          <div className="w-16 h-[2px] bg-[#c0dedd] mx-auto md:mx-0" />
          <p className="text-xs md:text-sm text-[#e6dff1]/50 leading-relaxed font-light font-sans text-center md:text-left">
            React Bytes is engineered to inject high-fidelity graphics and custom interactions into Web applications while maintaining peak performance.
          </p>
        </div>

        <svg
          ref={lineRef}
          className="absolute top-[180px] left-0 w-full h-[calc(100%-180px)] pointer-events-none z-0 hidden md:block"
          fill="none"
          preserveAspectRatio="none"
        >
          <path d="M 16.66% 0% L 16.66% 50% L 50% 50%" stroke="rgba(192,222,221,0.08)" strokeWidth="1" />
          <path d="M 50% 0% L 50% 50% L 83.33% 50%" stroke="rgba(192,222,221,0.08)" strokeWidth="1" />
          <path d="M 83.33% 0% L 83.33% 50% L 50% 100%" stroke="rgba(192,222,221,0.08)" strokeWidth="1" />
        </svg>

        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
          {features.map((feat, idx) => (
            <FeatureCard
              key={feat.title}
              icon={feat.icon}
              title={feat.title}
              description={feat.description}
              stripeConfig={feat.stripeConfig}
              index={idx}
              stat={feat.stat}
              statLabel={feat.statLabel}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureDetailsSection;