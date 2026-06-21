"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowUp } from "lucide-react";

export const CreativeFooter: React.FC = () => {
  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer id="footer" className="relative w-full bg-[#0d091a] border-t border-white/5 z-20 flex flex-col items-center">
      
      {/* Scroll to Top Trigger */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30">
        <button
          onClick={handleScrollTop}
          className="p-3.5 rounded-full bg-[#181a1e] border border-white/10 text-white hover:border-[#c0dedd] hover:text-[#c0dedd] hover:scale-110 transition-all duration-300 shadow-xl cursor-pointer"
          title="Scroll back to top"
        >
          <ArrowUp size={16} />
        </button>
      </div>

      {/* Decorative branding scrolling marquee */}
      <div className="w-full py-5 border-b border-white/5 bg-[#060010]/60 overflow-hidden select-none pointer-events-none">
        <div className="flex gap-10 text-[10px] font-mono tracking-[0.4em] text-white/5 uppercase w-max animate-[marquee_30s_linear_infinite]">
          <span>BUILD WITH REACT BYTES // 60FPS GRAPHICS // HARDWARE ACCELERATED // DEEP WEBGL ENGINE //</span>
          <span>BUILD WITH REACT BYTES // 60FPS GRAPHICS // HARDWARE ACCELERATED // DEEP WEBGL ENGINE //</span>
        </div>
      </div>

      {/* Footer Main Content */}
      <div className="w-full max-w-6xl px-6 md:px-12 py-12 flex flex-col md:flex-row items-center justify-between gap-8 relative z-10 font-sans">
        
        {/* Left trademark details */}
        <div className="flex flex-col items-center md:items-start gap-3">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-6 text-[#c0dedd]" viewBox="0 0 17 28" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12.443 3.006c1.566 0 2.842 8.714 2.842 19.478H17c0-11.588-2.308-20.968-5.136-20.968-1.615 0-3.042 2.81-3.985 7.227-0.941-4.416-2.368-7.227-3.971-7.227C1.101 1.516-1.2 10.888-1.2 22.476h2.288c0-10.763 1.258-19.47 2.825-19.47 1.566 0 2.84 8.05 2.84 17.98H8.97c0-9.93 1.28-17.98 2.844-17.98Z" fill="currentColor"/>
            </svg>
            <span className="font-mono text-sm tracking-wider font-semibold text-white">
              REACT BYTES
            </span>
          </div>
          <span className="text-[10px] font-mono text-[#e6dff1]/30 uppercase tracking-widest text-center md:text-left mt-1">
            © {new Date().getFullYear()} React Bytes. MIT License.
          </span>
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
            <svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-github inline-block"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path><path d="M9 18c-4.51 2-5-2-7-2"></path></svg> Repository source
          </a>
        </div>

      </div>

      {/* Embedded CSS for custom marquee loop animation */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </footer>
  );
};

export default CreativeFooter;
