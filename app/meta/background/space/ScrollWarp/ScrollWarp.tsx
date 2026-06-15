"use client";

import React, { useEffect, useRef, useState } from 'react';

export interface ScrollWarpProps {
  /** Number of stars in the scene. Defaults to 1900. */
  numStars?: number;
  /** Base length of the star trails when not in warp. Defaults to 2. */
  baseTrailLength?: number;
  /** Maximum length of the star trails during full warp. Defaults to 30. */
  maxTrailLength?: number;
  /** Color of the stars (hex). Defaults to '#d1ffff'. */
  starColor?: string;
  /** Optional custom styling classes for the container. */
  className?: string;
  /** Overlay children content. */
  children?: React.ReactNode;
}

interface Star {
  x: number;
  y: number;
  z: number;
  o: number;
  trail: { x: number; y: number }[];
}

export const ScrollWarp: React.FC<ScrollWarpProps> = ({
  numStars = 1900,
  baseTrailLength = 2,
  maxTrailLength = 30,
  starColor = '#d1ffff',
  className = "",
  children,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const webglRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const warpSpeedRef = useRef(0);
  const starsRef = useRef<Star[]>([]);
  const animationFrameRef = useRef<number>(0);
  const isAnimatingRef = useRef(true);
  const [isWindow, setIsWindow] = useState(true);

  // --- Utilities ---
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : { r: 209, g: 255, b: 255 };
  };

  // --- Scroll Logic ---
  useEffect(() => {
    const getScrollContainer = () => {
      let parent = containerRef.current?.parentElement;
      while (parent) {
        const overflowY = window.getComputedStyle(parent).overflowY;
        if (overflowY === 'auto' || overflowY === 'scroll') {
          return parent;
        }
        parent = parent.parentElement;
      }
      return window;
    };

    const scrollContainer = getScrollContainer();
    const isWin = scrollContainer === window;
    setIsWindow(isWin);

    const handleScroll = () => {
      if (!containerRef.current || !webglRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const parentRect = isWin ? { top: 0 } : (scrollContainer as HTMLElement).getBoundingClientRect();
      
      const containerHeight = isWin ? window.innerHeight : (scrollContainer as HTMLElement).clientHeight;
      const start = rect.top - parentRect.top;
      const totalScroll = rect.height - containerHeight;
      const scrolled = -start;
      const progress = Math.max(0, Math.min(1, scrolled / totalScroll));

      // Dynamically size sticky viewport to container height to prevent vertical stretching
      if (webglRef.current) {
        webglRef.current.style.height = `${containerHeight}px`;
      }

      // Warp Speed Logic (0 -> 0.6 ramp up, 0.6 -> 0.8 max, 0.8 -> 1.0 ramp down)
      let warp = 0;
      if (progress <= 0.6) warp = progress / 0.6;
      else if (progress <= 0.8) warp = 1;
      else warp = Math.max(0, 1 - (progress - 0.8) / 0.2);
      warpSpeedRef.current = warp;
    };

    scrollContainer.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => scrollContainer.removeEventListener('scroll', handleScroll);
  }, []);

  // --- Canvas Animation Logic ---
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let focalLength = canvas.offsetWidth * 2;
    let centerX = canvas.offsetWidth / 2;
    let centerY = canvas.offsetHeight / 2;

    const initStars = () => {
      starsRef.current = Array.from({ length: numStars }, () => ({
        x: Math.random() * canvas.offsetWidth,
        y: Math.random() * canvas.offsetHeight,
        z: Math.random() * canvas.offsetWidth,
        o: 0.5 + Math.random() * 0.5,
        trail: [],
      }));
    };

    initStars();

    const moveStars = () => {
      const warpSpeed = warpSpeedRef.current;
      const speed = 1 + warpSpeed * 50;

      for (let i = 0; i < starsRef.current.length; i++) {
        const star = starsRef.current[i];
        star.z -= speed;

        if (star.z < 1) {
          star.z = canvas.offsetWidth;
          star.x = Math.random() * canvas.offsetWidth;
          star.y = Math.random() * canvas.offsetHeight;
          star.trail = [];
        }
      }
    };

    const drawStars = () => {
      if (canvas.width !== canvas.offsetWidth || canvas.height !== canvas.offsetHeight) {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        centerX = canvas.width / 2;
        centerY = canvas.height / 2;
        focalLength = canvas.width * 2;
      }

      const warpSpeed = warpSpeedRef.current;
      const trailLength = Math.floor(
        baseTrailLength + warpSpeed * (maxTrailLength - baseTrailLength)
      );
      
      const clearAlpha = 1 - warpSpeed * 0.8;
      ctx.fillStyle = `rgba(17, 17, 17, ${clearAlpha})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const colorRgb = hexToRgb(starColor);

      for (let i = 0; i < starsRef.current.length; i++) {
        const star = starsRef.current[i];
        
        const px = (star.x - centerX) * (focalLength / star.z) + centerX;
        const py = (star.y - centerY) * (focalLength / star.z) + centerY;

        star.trail.push({ x: px, y: py });
        if (star.trail.length > trailLength) {
          star.trail.shift();
        }

        if (star.trail.length > 1) {
          ctx.beginPath();
          ctx.moveTo(star.trail[0].x, star.trail[0].y);
          for (let j = 1; j < star.trail.length; j++) {
            ctx.lineTo(star.trail[j].x, star.trail[j].y);
          }
          ctx.strokeStyle = `rgba(${colorRgb.r}, ${colorRgb.g}, ${colorRgb.b}, ${star.o})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }

        ctx.fillStyle = `rgba(${colorRgb.r}, ${colorRgb.g}, ${colorRgb.b}, ${star.o})`;
        ctx.fillRect(px, py, 1, 1);
      }
    };

    const animate = () => {
      if (isAnimatingRef.current) {
        moveStars();
        drawStars();
      }
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [numStars, baseTrailLength, maxTrailLength, starColor]);

  return (
    <div className={`bg-[#111111] text-white overflow-hidden font-sans relative w-full ${className}`}>
      <style dangerouslySetInnerHTML={{__html: `
        .scroll-warp-dust {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: url("https://img.freepik.com/premium-photo/white-dust-scratches-black-background_279525-2.jpg?w=640");
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          opacity: 0.05;
          mix-blend-mode: screen;
          pointer-events: none;
          z-index: 50;
        }
      `}} />

      {/* Main Container - The height determines the scroll duration */}
      <div 
        ref={containerRef} 
        className="relative w-full m-0 z-10" 
        style={{ height: '500vh' }}
      >
        <div className="scroll-warp-dust"></div>

        {/* Fixed WebGL Background within the sticky container */}
        <div 
          ref={webglRef}
          className="sticky top-0 left-0 w-full z-0 overflow-hidden pointer-events-none"
        >
          <canvas 
            ref={canvasRef} 
            className="absolute top-0 left-0 w-full h-full block"
          />
        </div>
      </div>

      {children && (
        <div className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center">
          {children}
        </div>
      )}

      {/* Extra space at bottom to see the exit animation cleanly */}
      <div className="h-[50vh] flex items-center justify-center bg-transparent z-10 relative pointer-events-none">
        <p className="text-white/40 font-mono text-sm tracking-widest uppercase">End of Sequence</p>
      </div>
    </div>
  );
};

export default ScrollWarp;
