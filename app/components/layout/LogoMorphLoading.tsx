"use client";

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import RevealUnder from '../../meta/text/TextEnter/RevealUnder';

export interface LogoMorphLoadingProps {
  onComplete: () => void;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
}

export default function LogoMorphLoading({ onComplete }: LogoMorphLoadingProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    setIsMounted(true);

    // Create client-safe random particle array for subtle bg atmosphere
    const generated = Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100 - 50,
      y: Math.random() * 100 - 50,
      size: Math.random() * 2 + 1,
      duration: Math.random() * 12 + 12,
      delay: Math.random() * -20,
    }));
    setParticles(generated);

    // Sequence timing:
    // 3.2s: Begin loader screen fade-out (gives ample time for text reveal to sit)
    const fadeTimer = setTimeout(() => {
      setIsFadingOut(true);
    }, 3200);

    // 3.9s: Trigger AppShell dashboard transition
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 3900);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  if (!isMounted) return null;

  return (
    <div
      className={`fixed inset-0 flex flex-col items-center justify-center gap-6 bg-[#060010] select-none overflow-hidden z-[9999] transition-all duration-700 ease-in-out ${
        isFadingOut ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Cosmic background radial gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(25,18,52,0.45)_0%,rgba(6,0,16,1)_85%)]" />

      {/* Floating Particles Field */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-indigo-400/20 blur-[0.5px]"
          style={{
            width: p.size,
            height: p.size,
            left: `calc(50% + ${p.x}vw)`,
            top: `calc(50% + ${p.y}vh)`,
          }}
          animate={{
            x: [0, Math.random() * 30 - 15, 0],
            y: [0, Math.random() * 30 - 15, 0],
            opacity: [0.1, 0.4, 0.1],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Ambient background glowing orbs */}
      <motion.div
        className="absolute w-[320px] h-[320px] rounded-full bg-[#A9B7FB]/10 blur-[80px]"
        animate={{
          scale: [1, 1.25, 1],
          opacity: [0.4, 0.7, 0.4],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="absolute w-[260px] h-[260px] rounded-full bg-[#8b5cf6]/8 blur-[70px]"
        animate={{
          scale: [1.2, 0.9, 1.2],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 0.5,
        }}
      />

      {/* Central SVG Container - Compact height to center the entire group perfectly */}
      <div className="relative flex flex-col items-center justify-center w-32 h-28">
        <svg
          viewBox="0 0 20 23"
          className="w-24 h-auto relative z-10 overflow-visible"
        >
          {/* Path 1: Bottom-Left Lavender Arc (Draw outline -> Rotate & Fade In Fill) */}
          <motion.path
            d="M8.98438 22.9611C8.98438 21.7856 8.75199 20.6217 8.30048 19.5357C7.84897 18.4497 7.18719 17.463 6.35291 16.6318C5.51864 15.8006 4.52821 15.1413 3.43817 14.6915C2.34814 14.2417 1.17984 14.0102 0 14.0102L3.9272e-07 22.9611H8.98438Z"
            fill="#A9B7FB"
            style={{
              transformOrigin: '4.5px 18.5px',
            }}
            initial={{
              pathLength: 0,
              stroke: '#A9B7FB',
              strokeWidth: 0.4,
              strokeOpacity: 0.8,
              fillOpacity: 0,
              rotate: -90,
              scale: 0.8,
            }}
            animate={{
              pathLength: 1,
              fillOpacity: 1,
              strokeOpacity: 0,
              rotate: 0,
              scale: 1,
            }}
            transition={{
              pathLength: { duration: 1.0, ease: 'easeInOut', delay: 0.4 },
              fillOpacity: { duration: 0.6, ease: 'easeOut', delay: 1.0 },
              strokeOpacity: { duration: 0.6, ease: 'easeOut', delay: 1.0 },
              rotate: { type: 'spring', stiffness: 140, damping: 11, delay: 1.0 },
              scale: { type: 'spring', stiffness: 140, damping: 11, delay: 1.0 },
            }}
          />

          {/* Path 2: Bottom-Right Lavender Arc (Draw outline -> Rotate opposite & Fade In Fill) */}
          <motion.path
            d="M20 23C20 21.5946 19.7221 20.2029 19.1823 18.9044C18.6425 17.606 17.8512 16.4262 16.8537 15.4324C15.8562 14.4386 14.672 13.6503 13.3687 13.1125C12.0654 12.5746 10.6685 12.2978 9.25781 12.2978L9.25781 19.3449C9.7396 19.3449 10.2167 19.4395 10.6618 19.6232C11.1069 19.8069 11.5113 20.0761 11.852 20.4155C12.1927 20.7549 12.4629 21.1578 12.6473 21.6013C12.8316 22.0447 12.9265 22.52 12.9265 23H20Z"
            fill="#A9B7FB"
            style={{
              transformOrigin: '15px 18.5px',
            }}
            initial={{
              pathLength: 0,
              stroke: '#A9B7FB',
              strokeWidth: 0.4,
              strokeOpacity: 0.8,
              fillOpacity: 0,
              rotate: 90,
              scale: 0.8,
            }}
            animate={{
              pathLength: 1,
              fillOpacity: 1,
              strokeOpacity: 0,
              rotate: 0,
              scale: 1,
            }}
            transition={{
              pathLength: { duration: 1.0, ease: 'easeInOut', delay: 0.4 },
              fillOpacity: { duration: 0.6, ease: 'easeOut', delay: 1.0 },
              strokeOpacity: { duration: 0.6, ease: 'easeOut', delay: 1.0 },
              rotate: { type: 'spring', stiffness: 140, damping: 11, delay: 1.0 },
              scale: { type: 'spring', stiffness: 140, damping: 11, delay: 1.0 },
            }}
          />

          {/* Path 3: Main Body (Cream/White - Draw outline -> Fade In Fill & Scale Up) */}
          <motion.path
            d="M20 0C20 6.291 15.5925 11.4002 10.1292 11.4796L9.87076 11.4815C4.40747 11.5609 3.9272e-07 16.6701 3.9272e-07 22.9611L0 0H20ZM10 2.7242C8.4467 2.7242 7.1875 3.97871 7.1875 5.52623C7.1875 7.07375 8.4467 8.32826 10 8.32826C11.5533 8.32826 12.8125 7.07375 12.8125 5.52623C12.8125 3.97871 11.5533 2.7242 10 2.7242Z"
            fill="#F2EEE9"
            style={{
              transformOrigin: '10px 11.5px',
            }}
            initial={{
              pathLength: 0,
              stroke: '#F2EEE9',
              strokeWidth: 0.4,
              strokeOpacity: 0.8,
              fillOpacity: 0,
              scale: 0.95,
            }}
            animate={{
              pathLength: 1,
              fillOpacity: 1,
              strokeOpacity: 0,
              scale: 1,
            }}
            transition={{
              pathLength: { duration: 1.1, ease: 'easeInOut', delay: 0.2 },
              fillOpacity: { duration: 0.6, ease: 'easeOut', delay: 0.9 },
              strokeOpacity: { duration: 0.6, ease: 'easeOut', delay: 0.9 },
              scale: { type: 'spring', stiffness: 140, damping: 11, delay: 0.9 },
            }}
          />
        </svg>

        {/* Dynamic drop shadow aura behind the SVG logo */}
        <motion.div
          className="absolute w-24 h-24 rounded-full bg-[#A9B7FB]/25 blur-xl pointer-events-none z-0"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: [0.5, 1.1, 1], opacity: [0, 0.6, 0.4] }}
          transition={{ duration: 1.8, delay: 0.6, ease: 'easeOut' }}
        />
      </div>

      {/* Typography Enter Animation */}
      <div className="w-full flex items-center justify-center pointer-events-none">
        <RevealUnder
          firstWord="React"
          secondWord="Bytes"
          uppercase={true}
          textClassName="font-sans font-bold text-4xl tracking-[0.25em] translate-x-[0.125em]"
          color="#f1f5f9"
          delay={1.2}
          duration={1.2}
        />
      </div>
    </div>
  );
}