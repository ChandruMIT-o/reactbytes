"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";

interface CreativeNavbarProps {
  activeSection: string;
}

export const CreativeNavbar: React.FC<CreativeNavbarProps> = ({ activeSection }) => {
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
  ];

  return (
    <motion.header 
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 w-full px-6 md:px-12 py-4 z-50 flex items-center justify-between border-b border-white/5 bg-[#060010]/40 backdrop-blur-md"
    >
      {/* Brand logo container */}
      <div 
        onClick={handleLogoClick}
        className="flex items-center gap-3 cursor-pointer group select-none"
      >
        <div className="relative">
          <div className="absolute inset-0 bg-[#c0dedd]/20 blur-md rounded-full group-hover:bg-[#c0dedd]/40 transition-all duration-300" />
          <svg className="w-4 h-7 text-[#c0dedd] relative z-10 transition-transform duration-500 group-hover:rotate-[360deg]" viewBox="0 0 17 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12.443 3.006c1.566 0 2.842 8.714 2.842 19.478H17c0-11.588-2.308-20.968-5.136-20.968-1.615 0-3.042 2.81-3.985 7.227-0.941-4.416-2.368-7.227-3.971-7.227C1.101 1.516-1.2 10.888-1.2 22.476h2.288c0-10.763 1.258-19.47 2.825-19.47 1.566 0 2.84 8.05 2.84 17.98H8.97c0-9.93 1.28-17.98 2.844-17.98Z" fill="currentColor"/>
          </svg>
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
              className={`relative py-1 transition-colors duration-300 ${
                isActive ? "text-[#c0dedd]" : "hover:text-white"
              }`}
            >
              {item.label}
              {isActive && (
                <motion.span 
                  layoutId="activeNavIndicator"
                  className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#c0dedd]"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </a>
          );
        })}
      </nav>

      {/* Action triggers */}
      <div className="flex items-center gap-4">
        {/* Core build stats indicator */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full border border-white/5 bg-white/5 font-mono text-[9px] text-[#e6dff1]/30">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>V1.0.BUILD_OK</span>
        </div>

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

export default CreativeNavbar;
