"use client";

import React, { useRef, useLayoutEffect } from "react";
import { ArrowUp } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

export const CreativeFooter: React.FC = () => {
  const footerRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);

  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (!footerRef.current || !contentRef.current) return;

      // --- Footer content slides up as it enters viewport ---
      gsap.fromTo(
        contentRef.current.children,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: footerRef.current,
            start: "top 90%",
            end: "top 50%",
            scrub: 1,
          },
        }
      );

      // --- Parallax marquee speed linked to scroll ---
      if (marqueeRef.current) {
        gsap.to(marqueeRef.current, {
          xPercent: -20,
          ease: "none",
          scrollTrigger: {
            trigger: footerRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.3,
          },
        });
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <footer ref={footerRef} id="footer" className="relative w-full bg-[#0d091a] border-t border-white/5 z-20 flex flex-col items-center overflow-hidden">
      {/* Scroll to Top Trigger */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-300">
        <button
          onClick={handleScrollTop}
          className="p-3.5 rounded-full bg-[#181a1e] border border-white/10 text-white hover:border-[#c0dedd] hover:text-[#c0dedd] hover:scale-110 transition-all duration-300 shadow-xl cursor-pointer group"
          title="Scroll back to top"
        >
          <ArrowUp size={16} className="group-hover:-translate-y-0.5 transition-transform duration-300" />
        </button>
      </div>

      {/* Scrolling marquee with parallax */}
      <div className="w-full py-5 border-b border-white/5 bg-[#060010]/60 overflow-hidden select-none pointer-events-none">
        <div
          ref={marqueeRef}
          className="flex gap-10 text-[10px] font-mono tracking-[0.4em] text-white/5 uppercase w-max will-change-transform"
          style={{ animation: "marquee 30s linear infinite" }}
        >
          <span>BUILD WITH REACT BYTES // 60FPS GRAPHICS // HARDWARE ACCELERATED // DEEP WEBGL ENGINE // ZERO DEPENDENCIES // COPY & PASTE //</span>
          <span>BUILD WITH REACT BYTES // 60FPS GRAPHICS // HARDWARE ACCELERATED // DEEP WEBGL ENGINE // ZERO DEPENDENCIES // COPY & PASTE //</span>
          <span>BUILD WITH REACT BYTES // 60FPS GRAPHICS // HARDWARE ACCELERATED // DEEP WEBGL ENGINE // ZERO DEPENDENCIES // COPY & PASTE //</span>
        </div>
      </div>

      {/* Footer Main Content */}
      <div ref={contentRef} className="w-full max-w-6xl px-6 md:px-12 py-16 flex flex-col md:flex-row items-center justify-between gap-8 relative z-10 font-sans">
        {/* Left trademark details */}
        <div className="flex flex-col items-center md:items-start gap-3">
          <div className="flex items-center gap-2">
            <Image
              src="/logo.svg"
              alt="Logo"
              width={17}
              height={28}
              className="relative z-10"
              style={{ width: "auto", height: "auto" }}
            />
            <span className="font-mono text-sm tracking-wider font-semibold text-white">
              REACT BYTES
            </span>
          </div>
          <span className="text-[10px] font-mono text-[#e6dff1]/30 uppercase tracking-widest text-center md:text-left mt-1">
            © {new Date().getFullYear()} React Bytes. MIT License.
          </span>
        </div>

        {/* Center - social links */}
        <div className="flex items-center gap-6">
          <a
            href="https://github.com/ChandruMIT-o/reactbytes"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 rounded-full border border-white/5 hover:border-[#c0dedd]/30 bg-white/5 text-[#e6dff1]/50 hover:text-[#c0dedd] transition-all duration-300"
            aria-label="GitHub Repository"
          >
            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path><path d="M9 18c-4.51 2-5-2-7-2"></path></svg>
          </a>
        </div>

        {/* Right creators details */}
        <div className="flex flex-col items-center md:items-end gap-3 font-mono text-xs text-[#e6dff1]/40">
          <div className="flex items-center gap-2">
            <span>Author:</span>
            <a
              href="https://github.com/ChandruMIT-o"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-[#c0dedd] transition-colors"
            >
              @ChandruMIT-o
            </a>
          </div>
          <a
            href="https://github.com/ChandruMIT-o/reactbytes"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-[10px] text-[#e6dff1]/40 hover:text-white transition-colors uppercase tracking-widest"
          >
            Repository source
          </a>
        </div>
      </div>

      {/* Embedded CSS for custom marquee loop animation */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }
      `}</style>
    </footer>
  );
};

export default CreativeFooter;
