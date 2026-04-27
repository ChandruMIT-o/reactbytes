import React from 'react';
import { Sparkles, Activity } from 'lucide-react';

export default function Psychedelics() {
    return (
        <div className="min-h-screen bg-[#050505] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))] flex flex-col items-center justify-center p-8 font-sans selection:bg-purple-500/30 selection:text-white">

            <PsychedelicsEffect />

            {/* Global styles for the custom psychedelic animations */}
            <style dangerouslySetInnerHTML={{
                __html: `
        @keyframes float-premium {
          0% { transform: scale(1) rotate(0deg); }
          33% { transform: scale(1.02) rotate(0.5deg); }
          66% { transform: scale(0.99) rotate(-0.5deg); }
          100% { transform: scale(1) rotate(0deg); }
        }
        @keyframes hue-shift-premium {
          0% { filter: hue-rotate(0deg) saturate(1.2) contrast(1.1); }
          50% { filter: hue-rotate(180deg) saturate(2) contrast(1.2); }
          100% { filter: hue-rotate(360deg) saturate(1.2) contrast(1.1); }
        }
        @keyframes liquid-text {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        /* NEW EFFECT DETAILS KEYFRAMES */
        @keyframes plasma-1 {
          0% { transform: translate(0%, 0%) scale(1); }
          50% { transform: translate(20%, 20%) scale(1.5); }
          100% { transform: translate(-10%, -20%) scale(0.8); }
        }
        @keyframes plasma-2 {
          0% { transform: translate(0%, 0%) scale(1); }
          50% { transform: translate(-30%, -10%) scale(0.8); }
          100% { transform: translate(20%, 30%) scale(1.5); }
        }
        @keyframes ripple {
          0% { transform: scale(0.8); opacity: 0; }
          50% { transform: scale(1.2); opacity: 0.4; }
          100% { transform: scale(1.6); opacity: 0; }
        }
        
        .psychedelic-hover:hover {
          animation: float-premium 4s ease-in-out infinite, hue-shift-premium 5s linear infinite;
        }

        /* NEW HOVER CLASSES FOR INNER EFFECTS */
        .group:hover .animate-plasma-1 {
          animation: plasma-1 6s ease-in-out infinite alternate;
        }
        .group:hover .animate-plasma-2 {
          animation: plasma-2 7s ease-in-out infinite alternate;
        }
        .group:hover .animate-ripple-1 {
          animation: ripple 3s linear infinite;
        }
        .group:hover .animate-ripple-2 {
          animation: ripple 3s linear infinite 1.5s;
        }
        
        .text-gradient-animate {
          background-size: 200% auto;
          animation: liquid-text 3s linear infinite;
        }

        .ease-premium {
          transition-timing-function: cubic-bezier(0.23, 1, 0.32, 1);
        }
      `}} />
        </div>
    );
}

const PsychedelicsEffect = () => {
    return (
        <div className="group relative w-[22rem] h-[30rem] flex items-center justify-center cursor-crosshair">

            {/* Background Effects Container (Separated from the text) */}
            <div className="absolute inset-0 bg-[#0a0a0a] rounded-[24px] overflow-hidden transition-all duration-[800ms] ease-premium group-hover:shadow-[0_0_120px_rgba(121,40,202,0.25)] psychedelic-hover z-0 border border-white/5">

                {/* Layer 1: Premium Dark Mesh Gradient (visible always) */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#1a1a24,#000_70%)] z-0" />

                {/* Layer 2: Hypnotic Ripples (Tunnel effect) */}
                <div className="absolute inset-[-50%] bg-[repeating-radial-gradient(circle_at_center,transparent_0,transparent_10px,rgba(255,0,128,0.15)_11px,transparent_12px)] opacity-0 group-hover:opacity-100 animate-ripple-1 transition-opacity duration-[800ms] z-0 mix-blend-color-dodge" />
                <div className="absolute inset-[-50%] bg-[repeating-radial-gradient(circle_at_center,transparent_0,transparent_15px,rgba(0,210,255,0.15)_16px,transparent_17px)] opacity-0 group-hover:opacity-100 animate-ripple-2 transition-opacity duration-[800ms] z-0 mix-blend-color-dodge" />

                {/* Layer 3: Moving Plasma Orbs */}
                <div className="absolute top-[-20%] left-[-20%] w-[140%] h-[140%] bg-[radial-gradient(circle_at_center,rgba(121,40,202,0.6)_0,transparent_40%)] opacity-0 group-hover:opacity-100 animate-plasma-1 mix-blend-screen blur-2xl z-0 transition-opacity duration-[800ms]" />
                <div className="absolute bottom-[-20%] right-[-20%] w-[140%] h-[140%] bg-[radial-gradient(circle_at_center,rgba(0,210,255,0.6)_0,transparent_40%)] opacity-0 group-hover:opacity-100 animate-plasma-2 mix-blend-screen blur-2xl z-0 transition-opacity duration-[800ms]" />

                {/* Layer 4: Trippy Conic Gradient (Clockwise) - High-end colors */}
                <div className="absolute inset-[-100%] bg-[conic-gradient(from_0deg,#ff0080,#7928ca,#00d2ff,#3a7bd5,#ff0080)] opacity-0 group-hover:opacity-100 group-hover:animate-[spin_4s_linear_infinite] transition-opacity duration-[800ms] ease-premium z-0 mix-blend-color-dodge blur-xl" />

                {/* Layer 5: Contrasting Conic Gradient (Counter-Clockwise) */}
                <div className="absolute inset-[-100%] bg-[conic-gradient(from_180deg,#ff0080,#ff8c00,#9d50bb,#ff0080)] opacity-0 group-hover:opacity-60 group-hover:animate-[spin_3s_linear_infinite_reverse] transition-opacity duration-[800ms] ease-premium z-0 mix-blend-screen blur-3xl" />

                {/* Layer 6: Moiré Interference Pattern */}
                <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent_0,transparent_2px,rgba(255,255,255,0.05)_3px,transparent_4px)] opacity-0 group-hover:opacity-100 mix-blend-overlay z-0 transition-opacity duration-[800ms]" />

                {/* Layer 7: Fine noise/grain overlay for texture */}
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz4KPC9zdmc+')] opacity-20 z-0 mix-blend-overlay" />
            </div>

        </div>
    );
};