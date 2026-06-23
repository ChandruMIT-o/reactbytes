"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

interface CreativeNavbarProps {
  activeSection: string;
}

export const CreativeNavbar: React.FC<CreativeNavbarProps> = ({ activeSection }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleLogoClick = () => {
    const el = document.getElementById("hero");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const navItems = [
    { id: "features", label: "Core" },
    { id: "marquee", label: "Showcase" },
    { id: "shader-playground", label: "Shader Deck" },
    { id: "specs", label: "Specs" },
    { id: "production-ready", label: "Ready" },
  ];

  return (
    <motion.header
      layout
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{
        layout: { type: "spring", stiffness: 180, damping: 25 },
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={`fixed left-0 right-0 mx-auto z-50 flex items-center justify-between transition-[background-color,border-color,backdrop-filter,box-shadow] duration-500 ease-in-out ${isScrolled
        ? "top-4 w-[92%] md:w-[80%] max-w-5xl px-6 py-2.5 border border-white/10 bg-[#060010]/70 backdrop-blur-md rounded-full shadow-[0_12px_40px_0_rgba(0,0,0,0.5)]"
        : "top-0 w-full px-6 md:px-12 py-2 border border-transparent bg-transparent bg-[#060010]/40 backdrop-blur-lg rounded-none shadow-none"
        }`}
    >
      {/* Brand logo container */}
      <div
        onClick={handleLogoClick}
        className="flex items-center gap-3 cursor-pointer group select-none"
      >
        <div className="relative">
          <div className="absolute inset-0 bg-[#c0dedd]/20 blur-md rounded-full group-hover:bg-[#c0dedd]/40 transition-all duration-300" />
          <Image
            src="/logo.svg"
            alt="Logo"
            width={14}
            height={25}
            className="relative z-10 h-6 w-auto"
            style={{ width: "auto", height: "auto" }}
          />
        </div>
        <span className="font-mono text-sm tracking-widest uppercase font-semibold text-[#f2eee9] group-hover:text-[#c0dedd] transition-colors duration-300">
          React Bytes
        </span>
      </div>

      {/* Interactive Navigation menu */}
      <nav className="hidden md:flex items-center gap-8 text-xs font-mono tracking-widest text-[#e6dff1]/50 uppercase">
        {navItems.map((item) => {
          const isActive = activeSection === item.id;

          return (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={`relative py-1 transition-colors duration-300 ${isActive ? "text-[#e6dff1]" : "hover:text-white"
                }`}
            >
              {item.label}
              {isActive && (
                <motion.span
                  layoutId="activeNavIndicator"
                  className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#e6dff1]"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </a>
          );
        })}
      </nav>

      {/* Action triggers */}
      <div className="flex items-center gap-4">
        <Link
          href="/"
          className="relative group overflow-hidden px-4 py-2 text-xs font-mono uppercase tracking-widest rounded-md border border-white/10 bg-[#181a1e]/40 hover:border-[#c0dedd]/40 transition-all text-[#e6dff1] cursor-pointer"
        >
          <span className="relative z-10">Documentation</span>
          <span className="absolute inset-0 bg-[#c0dedd]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </Link>

        <a
          href="https://github.com/ChandruMIT-o/reactbytes"
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-md hover:bg-white/5 transition-colors text-[#e6dff1] cursor-pointer"
          aria-label="GitHub Repository"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-github"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path><path d="M9 18c-4.51 2-5-2-7-2"></path></svg>
        </a>
      </div>
    </motion.header>
  );
};

export default React.memo(CreativeNavbar);
