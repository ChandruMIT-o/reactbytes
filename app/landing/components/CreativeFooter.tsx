"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { ArrowUp, ArrowUpRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

// Custom brand SVG Icons for socials
const GithubIcon = ({ size = 18, ...props }: React.SVGProps<SVGSVGElement> & { size?: number | string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const TwitterIcon = ({ size = 18, ...props }: React.SVGProps<SVGSVGElement> & { size?: number | string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
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
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M18 8a3 3 0 0 0-3-3H5a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V8Z" />
    <path d="M10 12h.01M14 12h.01M6 8c2.5 1 5.5 1 8 0" />
  </svg>
);

// Structured Links
const FOOTER_LINKS = [
  {
    title: "Product",
    links: [
      { label: "Technology", href: "#features" },
      { label: "Integrations", href: "#marquee" },
      { label: "Releases", href: "#" },
      { label: "Status", href: "#" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Docs", href: "#" },
      { label: "API Reference", href: "#" },
      { label: "Tutorials", href: "#" },
      { label: "System Guide", href: "#specs" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Team", href: "#" },
      { label: "Culture", href: "#" },
      { label: "Jobs", href: "#" },
      { label: "Press Kit", href: "#" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Imprint", href: "#" },
      { label: "Data Policy", href: "#" },
      { label: "Cookie Policy", href: "#" },
      { label: "Accessibility", href: "#" },
      { label: "Terms of Use", href: "#" },
    ],
  },
];

export const CreativeFooter: React.FC = () => {
  const footerRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [latency, setLatency] = useState(14);
  const [isDiagnosing, setIsDiagnosing] = useState(false);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSubscribed(true);
    setEmail("");
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
    { label: "Discord", icon: <DiscordIcon size={16} strokeWidth={1.5} />, href: "#" },
    { label: "Twitter", icon: <TwitterIcon size={16} strokeWidth={1.5} />, href: "#" },
    { label: "GitHub", icon: <GithubIcon size={16} strokeWidth={1.5} />, href: "https://github.com/ChandruMIT-o/reactbytes" },
    { label: "LinkedIn", icon: <LinkedinIcon size={16} strokeWidth={1.5} />, href: "#" },
  ];

  return (
    <footer
      ref={footerRef}
      className="relative w-full pt-16 pb-10 bg-transparent text-zinc-400 font-sans z-20 overflow-hidden"
    >
      <div ref={containerRef} className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 flex flex-col">

        {/* ====================================================================
            1. TOP HERO CALL TO ACTION (Centered typography + Ambient Glow)
            ==================================================================== */}
        <div className="relative w-full py-20 md:py-28 flex flex-col items-center justify-center text-center overflow-hidden gsap-reveal">

          {/* Spatial blur gradient glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] md:w-[480px] h-[350px] md:h-[480px] pointer-events-none select-none mix-blend-screen opacity-[0.12] filter blur-[90px] bg-gradient-to-tr from-[#c0dedd] via-[#e6dff1] to-white rounded-full z-0" />

          {/* Volumetric Brand Symbol: Sharp Top Half */}
          <div
            className="absolute top-[48%] md:top-[10%] left-1/2 -translate-x-1/2 w-[320px] md:w-[460px] h-[320px] md:h-[460px] pointer-events-none select-none opacity-20 z-0"
            style={{
              WebkitMaskImage: "linear-gradient(to bottom, black 25%, transparent 75%)",
              maskImage: "linear-gradient(to bottom, black 25%, transparent 75%)",
            }}
          >
            <Image
              src="/logo.svg"
              alt="Brand Emblem Sharp Top"
              width={460}
              height={460}
              className="w-full h-full object-contain"
            />
          </div>

          {/* Volumetric Brand Symbol: Blurred Bottom Half */}
          <div
            className="absolute top-[48%] md:top-[52%] left-1/2 -translate-x-1/2 w-[320px] md:w-[460px] h-[320px] md:h-[460px] pointer-events-none select-none opacity-15 filter blur-[15px] z-0"
            style={{
              WebkitMaskImage: "linear-gradient(to bottom, transparent 25%, black 75%)",
              maskImage: "linear-gradient(to bottom, transparent 25%, black 75%)",
            }}
          >
            <Image
              src="/logo.svg"
              alt="Brand Emblem Blurred Bottom"
              width={460}
              height={460}
              className="w-full h-full object-contain"
            />
          </div>

          <h2 className="relative z-10 text-4xl md:text-6xl font-sans font-black tracking-tight text-white max-w-2xl mb-4 select-none uppercase">
            Built for What Comes Next.
          </h2>
          <p className="relative z-10 text-xs md:text-sm font-mono tracking-wider text-zinc-500 max-w-md mb-8 select-none uppercase">
            Future-ready tools for teams moving at the speed of innovation.
          </p>
          <a
            href="/"
            className="relative z-10 px-8 py-3 bg-[#f2eee9] hover:bg-white text-black font-mono font-bold text-xs uppercase tracking-widest rounded-sm transition-all duration-300 hover:scale-105 active:scale-95 shadow-[0_12px_25px_-5px_rgba(255,255,255,0.06)] cursor-pointer"
          >
            Get Started
          </a>
        </div>

        {/* ====================================================================
            2. GRID-DIVIDER SOCIALS ROW (Tabular columns split by vertical lines)
            ==================================================================== */}
        <div className="grid grid-cols-2 md:grid-cols-4 border-t border-b border-white/10 gsap-reveal">
          {socialItems.map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between p-6 border-b border-white/10 md:border-b-0 md:border-r border-white/10 even:border-r-0 md:even:border-r last:border-r-0 hover:bg-white/[0.012] transition-all group font-mono text-xs uppercase tracking-widest text-[#e6dff1] cursor-pointer"
            >
              <div className="flex items-center gap-3">
                {social.icon}
                <span>{social.label}</span>
              </div>
              <ArrowUpRight size={14} className="text-zinc-500 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
            </a>
          ))}
        </div>

        {/* ====================================================================
            3. GRID-DIVIDER DIRECTORIES SECTION (Vertical pane splits)
            ==================================================================== */}
        <div className="grid grid-cols-2 md:grid-cols-4 border-b border-white/10 gsap-reveal">
          {FOOTER_LINKS.map((group) => (
            <div
              key={group.title}
              className="p-8 flex flex-col gap-6 border-b border-white/10 md:border-b-0 md:border-r border-white/10 even:border-r-0 md:even:border-r last:border-r-0 last:border-b-0 [&:nth-last-child(2)]:border-b-0"
            >
              <span className="font-mono text-[10px] tracking-widest uppercase text-zinc-500 font-bold select-none">
                {group.title}
              </span>
              <ul className="flex flex-col gap-3">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-xs md:text-sm text-zinc-400 hover:text-white hover:translate-x-0.5 transition-all duration-300 block w-fit"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ====================================================================
            4. BOTTOM BRANDING & HIGH-CONTRAST NEWSLETTER INPUT
            ==================================================================== */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center py-12 gap-8 border-b border-white/10 gsap-reveal">

          {/* Brand Info */}
          <div className="flex flex-col gap-3.5 max-w-md">
            <div className="flex items-center gap-3 select-none">
              <Image
                src="/logo.svg"
                alt="React Bytes Logo"
                width={16}
                height={16}
                className="w-auto h-5 object-contain"
              />
              <span className="font-sans font-black text-xl tracking-tight text-white uppercase">
                React Bytes.
              </span>
            </div>
            <p className="text-xs leading-relaxed text-zinc-500">
              In the new era of technology we look to the future with hardware-accelerated interfaces, crafting UI modules that render at the speed of light.
            </p>
          </div>

          {/* High-Contrast Input Form */}
          <form onSubmit={handleSubscribe} className="flex gap-2 w-full lg:max-w-md">
            <input
              type="email"
              required
              value={email}
              onChange={handleEmailChange}
              placeholder="NAME@EMAIL.COM"
              className="flex-grow bg-white text-black placeholder-zinc-400 text-xs font-mono py-3.5 px-4 rounded-sm focus:outline-none uppercase tracking-wider"
            />
            <button
              type="submit"
              disabled={isSubscribed}
              className="bg-black hover:bg-zinc-950 border border-white/20 text-white disabled:border-zinc-800 disabled:text-zinc-600 px-6 py-3.5 rounded-sm text-xs font-mono uppercase tracking-widest transition-all duration-300 font-bold active:scale-95 cursor-pointer"
            >
              {isSubscribed ? "CONNECTED" : "SUBSCRIBE"}
            </button>
          </form>
        </div>

        {/* ====================================================================
            5. SUB-FOOTER ROW (Diagnostics, Copyright & Top Scroll)
            ==================================================================== */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-8 text-xs font-mono gsap-reveal">

          <div className="flex flex-col sm:flex-row items-center gap-4 text-zinc-500">
            <span>© {new Date().getFullYear()} React Bytes. All rights reserved.</span>
            <div className="hidden sm:block w-1 h-1 rounded-full bg-zinc-800" />
            <span className="text-zinc-600">STABLE_BUILD_4.02</span>
          </div>

          <div className="flex items-center gap-6">

            {/* Interactive diagnostics indicator */}
            <button
              onClick={runDiagnostics}
              disabled={isDiagnosing}
              className="flex items-center gap-3 bg-zinc-900/40 border border-white/5 rounded-full px-4 py-1.5 hover:border-white/10 transition-all text-[10px] text-[#e6dff1]/90 select-none group active:scale-95 cursor-pointer"
              title="Click to diagnostic latency"
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className={`absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 ${isDiagnosing ? "animate-ping" : ""}`}></span>
                <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${isDiagnosing ? "bg-emerald-400" : "bg-emerald-500"}`}></span>
              </span>
              <span className="flex items-center gap-1.5">
                ALL SYSTEMS OPERATIONAL
                <span className="text-zinc-700">//</span>
                <span className="text-[#c0dedd]">
                  {isDiagnosing ? "Pinging..." : `${latency}ms`}
                </span>
              </span>
            </button>

            {/* Return to top arrow */}
            <button
              onClick={handleScrollTop}
              className="p-3 rounded-full bg-zinc-900 border border-white/5 hover:border-white/20 text-zinc-400 hover:text-white transition-all active:scale-90 cursor-pointer"
              aria-label="Scroll to top"
            >
              <ArrowUp size={14} />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default React.memo(CreativeFooter);