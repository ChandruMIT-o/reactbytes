"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface GlideSectionProps {
  children: React.ReactNode;
  id: string;
  className?: string;
}

export const GlideSection: React.FC<GlideSectionProps> = ({
  children,
  id,
  className = "",
}) => {
  const ref = useRef<HTMLDivElement>(null);

  // Track scroll position of this section relative to the viewport
  // offset: ["start end", "end start"] tracks from when the top of the element enters the bottom of the viewport
  // to when the bottom of the element leaves the top of the viewport.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Scale: starts small (0.9), reaches full scale (1.0) in viewport center, shrinks back on exit (0.9)
  const scale = useTransform(scrollYProgress, [0.1, 0.45, 0.55, 0.9], [0.9, 1.0, 1.0, 0.9]);
  
  // Translation y: slides in from bottom (80px), holds position, slides out to top (-80px)
  const y = useTransform(scrollYProgress, [0.1, 0.45, 0.55, 0.9], [80, 0, 0, -80]);
  
  // Opacity: fades in (0 to 1), remains solid, fades out (1 to 0)
  const opacity = useTransform(scrollYProgress, [0.1, 0.35, 0.65, 0.9], [0, 1, 1, 0]);
  
  return (
    <div
      ref={ref}
      id={id}
      className={`min-h-screen w-full flex items-center justify-center relative overflow-hidden ${className}`}
    >
      <motion.div
        style={{
          scale,
          y,
          opacity,
        }}
        className="w-full flex items-center justify-center py-12"
      >
        {children}
      </motion.div>
    </div>
  );
};

export default GlideSection;
