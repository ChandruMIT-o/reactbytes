"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { ArrowUp, ChevronRight, Send } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import GradientText from "@/app/components/textfields/GradientText";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

// Custom brand SVG Icons for socials, simplified to feel more tech-focused
const GithubIcon = ({ size = 18, ...props }: React.SVGProps<SVGSVGElement> & { size?: number | string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const InstagramIcon = ({ size = 18, ...props }: React.SVGProps<SVGSVGElement> & { size?: number | string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const LinkedinIcon = ({ size = 18, ...props }: React.SVGProps<SVGSVGElement> & { size?: number | string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const DiscordIcon = ({ size = 18, ...props }: React.SVGProps<SVGSVGElement> & { size?: number | string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M18 8a3 3 0 0 0-3-3H5a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V8Z" />
    <path d="M10 12h.01M14 12h.01M6 8c2.5 1 5.5 1 8 0" />
  </svg>
);

// Minimalist, visible but subtle tech watermark SVG
const SubtleWatermarkTexture = () => (
  <svg width="100%" height="100%" className="absolute inset-0 z-0 pointer-events-none opacity-10 filter blur-[0.5px]">
    <pattern id="pattern-hex" patternUnits="userSpaceOnUse" width="80" height="80" patternTransform="scale(1) rotate(15)">
      <path d="M0,0 M40,20 L60,40 L40,60 L20,40 Z M0,40 L20,60 L0,80" fill="none" stroke="#2a2a2a" strokeWidth="0.5" />
      <circle cx="40" cy="40" r="1.5" fill="#2a2a2a" />
      <circle cx="80" cy="80" r="1.5" fill="#2a2a2a" />
    </pattern>
    <rect width="100%" height="100%" fill="url(#pattern-hex)" />
  </svg>
);

export const CreativeFooter: React.FC = () => {
  const footerRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [message, setMessage] = useState("");
  const [isSent, setIsSent] = useState(false);
  const [latency, setLatency] = useState(14);
  const [isDiagnosing, setIsDiagnosing] = useState(false);

  const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message) return;
    setIsSent(true);
    setMessage("");

    setTimeout(() => {
      setIsSent(false);
    }, 4000);
  };

  const runDiagnostics = () => {
    if (isDiagnosing) return;
    setIsDiagnosing(true);
    let step = 0;
    const interval = setInterval(() => {
      setLatency(Math.floor(Math.random() * 60) + 10);
      step++;
      if (step > 6) {
        clearInterval(interval);
        setLatency(12);
        setIsDiagnosing(false);
      }
    }, 120);
  };

  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useGSAP(
    () => {
      if (!containerRef.current) return;

      const fadeUpElements = containerRef.current.querySelectorAll(".gsap-reveal");

      gsap.fromTo(
        fadeUpElements,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: {
            trigger: footerRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );
    },
    { scope: footerRef }
  );

  const socialItems = [
    { label: "Discord", icon: <DiscordIcon strokeWidth={1.5} />, href: "#" },
    { label: "Instagram", icon: <InstagramIcon strokeWidth={1.5} />, href: "#" },
    { label: "GitHub", icon: <GithubIcon strokeWidth={1.5} />, href: "https://github.com/ChandruMIT-o/reactbytes" },
    { label: "LinkedIn", icon: <LinkedinIcon strokeWidth={1.5} />, href: "#" },
  ];

  return (
    <footer
      ref={footerRef}
      className="relative w-full pt-16 pb-10 bg-black text-zinc-400 font-sans z-20 overflow-hidden"
    >
      {/* A clean, visible but subtle tech pattern that feels more intentional than 
        a faint logo mask. Look carefully at the background texture in the ref.
      */}
      <SubtleWatermarkTexture />

      <div ref={containerRef} className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 lg:px-16 flex flex-col">

        {/* ====================================================================
            1. TOP HERO CALL TO ACTION (Improved, Inspired by Ref)
            ==================================================================== */}
        <div className="relative w-full py-20 md:py-28 flex flex-col items-center justify-center text-center overflow-hidden gsap-reveal">
          {/* Main Title, Bold like Ref */}
          <h2 className="relative z-10 text-4xl md:text-6xl font-sans font-extrabold tracking-tight text-white max-w-2xl mb-5 uppercase select-none">
            <GradientText
              colors={["#5227FF", "#FF9FFC", "#B497CF"]}
              animationSpeed={2}
              showBorder={false}
              className="font-extrabold tracking-tight"
            >
              The building blocks for remarkable products.
            </GradientText>
          </h2>
          {/* Subtitle, Clean & Centered like Ref */}
          <p className="relative z-10 text-xs md:text-sm font-sans tracking-wide text-zinc-500 max-w-md mb-8 select-none">
            Free access to every component, block, and template. No payment, monthly updates forever.
          </p>

          {/* New Buttons Layout, Inspired by Ref */}
          <div className="flex flex-col sm:flex-row items-center gap-4 mb-8">
            <a
              href="/"
              className="relative group px-8 py-3.5 bg-white text-black font-mono font-extrabold text-xs uppercase tracking-widest rounded-md overflow-hidden flex items-center gap-2"
            >
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />

              <span className="relative z-10">Get Lifetime Access</span>
              <ChevronRight
                size={16}
                className="relative z-10 transition-transform group-hover:translate-x-1"
                strokeWidth={2.5}
              />
            </a>
            <a
              href="/"
              className="relative z-10 group px-8 py-3.5 bg-zinc-900/50 hover:bg-zinc-900 text-white font-mono font-medium text-xs uppercase tracking-widest rounded-md border border-white/5 hover:border-white/10 transition-all duration-300 cursor-pointer flex items-center gap-2"
            >
              Browse Docs
              <ChevronRight size={16} className="transition-transform group-hover:translate-x-1" strokeWidth={2} />
            </a>
          </div>
        </div>

        {/* ====================================================================
            2. GRID-DIVIDER SOCIALS ROW (Cleaned, simplified colors)
            ==================================================================== */}
        <div className="grid grid-cols-2 md:grid-cols-4 border-t border-b border-white/10 gsap-reveal">
          {socialItems.map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between p-6 border-b border-white/10 md:border-b-0 md:border-r border-white/10 even:border-r-0 md:even:border-r last:border-r-0 hover:bg-zinc-900 transition-all group font-mono text-xs uppercase tracking-widest text-zinc-400 cursor-pointer"
            >
              <div className="flex items-center gap-3">
                {social.icon}
                <span className="font-semibold">{social.label}</span>
              </div>
              <ChevronRight size={14} className="text-zinc-600 transition-transform group-hover:translate-x-1" strokeWidth={2.5} />
            </a>
          ))}
        </div>

        {/* ====================================================================
            3. CLEAN ASYMMETRICAL INTERFACE ZONE (More premium, cleaned colors)
            ==================================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 py-16 gap-12 lg:gap-8 border-b border-white/10 items-center gsap-reveal">

          {/* Left Side: Brand Identity block */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <div className="flex items-center gap-3 select-none">
              <Image
                src="/logo.svg"
                alt="React Bytes Logo"
                width={20}
                height={20}
                className="w-auto h-5 object-contain"
              />
              <span className="font-sans font-extrabold text-2xl tracking-tight text-white uppercase">
                React Bytes.
              </span>
            </div>
            <p className="text-xs leading-relaxed text-zinc-500 max-w-sm">
              Crafting premium hardware-accelerated interfaces for next-generation platforms. Performance and elegance by design.
            </p>
          </div>

          {/* Right Side: Reimagined High-End Message Input Form */}
          <form onSubmit={handleSendMessage} className="lg:col-span-8 w-full flex flex-col gap-2">
            <span className="font-mono text-[10px] tracking-widest uppercase text-zinc-600 font-bold select-none mb-1 block">
              // SECURE COMMUNICATION CHANNEL
            </span>
            <div className="relative flex items-center w-full group">
              <input
                type="text"
                required
                value={message}
                onChange={handleMessageChange}
                placeholder="Type your message or optional email terminal..."
                className="w-full bg-zinc-950 border border-white/10 hover:border-white/20 focus:border-white/30 text-white placeholder-zinc-700 text-sm font-mono py-4 pl-5 pr-36 rounded-sm focus:outline-none transition-all duration-300 tracking-wide backdrop-blur-xs"
              />
              <div className="absolute right-2 flex items-center gap-2">
                <button
                  type="submit"
                  disabled={isSent}
                  className="bg-white hover:bg-white text-black disabled:bg-zinc-800 disabled:text-zinc-600 px-5 py-2.5 rounded-xs text-xs font-mono uppercase tracking-wider transition-all duration-300 font-black flex items-center gap-2 active:scale-95 cursor-pointer"
                >
                  {isSent ? (
                    "TRANSMITTED"
                  ) : (
                    <>
                      SEND MAIL
                      <Send size={12} className="stroke-[2.5]" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* ====================================================================
            4. SUB-FOOTER ROW (More minimalist)
            ==================================================================== */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-8 text-xs font-mono gsap-reveal">

          <div className="flex flex-col sm:flex-row items-center gap-4 text-zinc-500">
            <span className="font-bold">© {new Date().getFullYear()} React Bytes Inc.</span>
            <div className="hidden sm:block w-1 h-1 rounded-full bg-zinc-800" />
            <span className="text-zinc-700">STABLE_BUILD_4.02</span>
          </div>

          <div className="flex items-center gap-6">

            {/* Interactive diagnostics indicator */}
            <button
              onClick={runDiagnostics}
              disabled={isDiagnosing}
              className="flex items-center gap-3 bg-zinc-950 border border-white/5 rounded-full px-4 py-1.5 hover:border-white/10 transition-all text-[10px] text-zinc-500 select-none group active:scale-95 cursor-pointer"
              title="Click to diagnostic latency"
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className={`absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 ${isDiagnosing ? "animate-ping" : ""}`}></span>
                <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${isDiagnosing ? "bg-emerald-400" : "bg-emerald-500"}`}></span>
              </span>
              <span className="flex items-center gap-1.5">
                ALL SYSTEMS OPERATIONAL
                <span className="text-zinc-800">//</span>
                <span className="text-zinc-200">
                  {isDiagnosing ? "Pinging..." : `${latency}ms`}
                </span>
              </span>
            </button>

            {/* Return to top arrow */}
            <button
              onClick={handleScrollTop}
              className="p-3 rounded-full bg-zinc-950 border border-white/5 hover:border-white/10 text-zinc-600 hover:text-white transition-all active:scale-90 cursor-pointer"
              aria-label="Scroll to top"
            >
              <ArrowUp size={14} strokeWidth={2.5} />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default React.memo(CreativeFooter);