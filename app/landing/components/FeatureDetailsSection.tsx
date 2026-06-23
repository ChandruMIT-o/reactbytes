"use client";

import React, { useRef, useLayoutEffect, useState, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Cpu, Sliders, Layers, Zap, Palette, Code2 } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import StripeFlow from "@/app/meta/background/StripeFlow/StripeFlow";

gsap.registerPlugin(ScrollTrigger);

interface StripeConfig {
  palette: "vapor" | "sunset" | "slate" | "acid" | "cyberpunk" | "abyss" | "aurora";
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
  const [shouldRenderStripeFlow, setShouldRenderStripeFlow] = useState(false);

  useEffect(() => {
    if (hovered) {
      setShouldRenderStripeFlow(true);
    } else {
      const timer = setTimeout(() => {
        setShouldRenderStripeFlow(false);
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [hovered]);

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
    <div className="feature-card w-full h-full">
      <div className={`float-card-${index} w-full h-full`}>
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
          className="relative flex flex-col gap-5 p-8 rounded-3xl bg-[#181a1e]/20 border border-white/5 hover:border-white/12 transition-all duration-500 cursor-pointer select-none group w-full h-full overflow-hidden shadow-2xl backdrop-blur-sm"
        >
          {/* StripeFlow animated background on hover */}
          <div className="absolute inset-0 z-0 opacity-0 group-hover:opacity-25 transition-opacity duration-700 pointer-events-none rounded-3xl overflow-hidden">
            {shouldRenderStripeFlow && (
              <StripeFlow
                palette={stripeConfig.palette}
                isPaused={!hovered}
                speed={stripeConfig.speed}
                distortion={stripeConfig.distortion}
                scale={stripeConfig.scale}
                className="absolute inset-0 w-full h-full bg-transparent border-none scale-105"
              />
            )}
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
      </div>
    </div>
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
      description: "Not all components are WebGL-based, but all are performance tested and optimized to target 60fps.",
      stripeConfig: { palette: "vapor" as const, speed: 1.4, distortion: 45, scale: 0.015 },
      stat: "60",
      statLabel: "FPS TARGET",
    },
    {
      icon: <Sliders size={22} />,
      title: "Declarative Control",
      description: "Fully customize layout variables. Set spring physics constants, uniform arrays, scale multipliers, colors, and motion offsets on the fly.",
      stripeConfig: { palette: "cyberpunk" as const, speed: 1.2, distortion: 60, scale: 0.010 },
      stat: "100%",
      statLabel: "CUSTOMIZABLE",
    },
    {
      icon: <Layers size={22} />,
      title: "Less Overhead",
      description: "Uses only well-known and tested packages like WebGL, Three.js, and framer-motion.",
      stripeConfig: { palette: "abyss" as const, speed: 0.8, distortion: 50, scale: 0.007 },
      stat: "0",
      statLabel: "DEPENDENCIES",
    },
    {
      icon: <Code2 size={22} />,
      title: "Copy & Paste",
      description: "Direct copy-paste is available, along with a CLI, npm packages, and MCP server access for AI-assisted development.",
      stripeConfig: { palette: "slate" as const, speed: 0.8, distortion: 15, scale: 0.008 },
      stat: "1",
      statLabel: "FILE EACH",
    },
    {
      icon: <Palette size={22} />,
      title: "Design System Ready",
      description: "It won't adapt automatically, but you can easily customize styles and colors to match your existing themes.",
      stripeConfig: { palette: "aurora" as const, speed: 1.1, distortion: 65, scale: 0.009 },
      stat: "∞",
      statLabel: "THEMES",
    },
    {
      icon: <Zap size={22} />,
      title: "Fully Documented",
      description: "We provide comprehensive developer documentation and context for writing AI prompts to easily customize and use each component.",
      stripeConfig: { palette: "acid" as const, speed: 1.8, distortion: 60, scale: 0.025 },
      stat: "AI",
      statLabel: "PROMPT READY",
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
      cards.forEach((card, index) => {
        const colIndex = index % 3;
        const rowIndex = Math.floor(index / 3);

        let startX = 0;
        let startY = 0;
        let startRotateX = 0;
        let startRotateY = 0;
        let startRotateZ = 0;

        if (rowIndex === 0) {
          // Row 1: Left from top-left, Middle from bottom, Right from top-right
          if (colIndex === 0) {
            startX = -180;
            startY = -120;
            startRotateZ = -12;
            startRotateY = -20;
          } else if (colIndex === 1) {
            startX = 0;
            startY = 150;
            startRotateX = 15;
          } else if (colIndex === 2) {
            startX = 180;
            startY = -120;
            startRotateZ = 12;
            startRotateY = 20;
          }
        } else {
          // Row 2: Left from bottom-left, Middle from top, Right from bottom-right
          if (colIndex === 0) {
            startX = -180;
            startY = 120;
            startRotateZ = 12;
            startRotateY = -20;
          } else if (colIndex === 1) {
            startX = 0;
            startY = -150;
            startRotateX = -15;
          } else if (colIndex === 2) {
            startX = 180;
            startY = 120;
            startRotateZ = -12;
            startRotateY = 20;
          }
        }

        gsap.fromTo(
          card,
          {
            opacity: 0,
            x: startX,
            y: startY,
            scale: 0.88,
            rotateX: startRotateX,
            rotateY: startRotateY,
            rotateZ: startRotateZ,
          },
          {
            opacity: 1,
            x: 0,
            y: 0,
            scale: 1,
            rotateX: 0,
            rotateY: 0,
            rotateZ: 0,
            duration: 1.0,
            ease: "power4.out",
            scrollTrigger: {
              trigger: gridRef.current,
              start: "top 85%",
              end: "top 45%",
              scrub: 1.2,
            },
          }
        );
      });

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
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes ambientFloat0 {
          0%, 100% { transform: translateY(0px) rotate(0.3deg); }
          50% { transform: translateY(-8px) rotate(-0.3deg); }
        }
        @keyframes ambientFloat1 {
          0%, 100% { transform: translateY(0px) rotate(-0.4deg); }
          50% { transform: translateY(-6px) rotate(0.4deg); }
        }
        @keyframes ambientFloat2 {
          0%, 100% { transform: translateY(0px) rotate(0.2deg); }
          50% { transform: translateY(-10px) rotate(-0.2deg); }
        }
        .float-card-0 { animation: ambientFloat0 6s ease-in-out infinite; }
        .float-card-1 { animation: ambientFloat1 7s ease-in-out infinite; }
        .float-card-2 { animation: ambientFloat2 5.5s ease-in-out infinite; }
        .float-card-3 { animation: ambientFloat1 6.5s ease-in-out infinite; }
        .float-card-4 { animation: ambientFloat2 7.5s ease-in-out infinite; }
        .float-card-5 { animation: ambientFloat0 5s ease-in-out infinite; }
      `}} />
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

        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10" style={{ perspective: "1000px" }}>
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

export default React.memo(FeatureDetailsSection);