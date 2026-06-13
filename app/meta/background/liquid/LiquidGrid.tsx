"use client";

import React, { useEffect, useRef } from 'react';

export interface LiquidGridProps {
  cols?: number;
  rows?: number;
  spacing?: number;
  baseRadius?: number;
  springK?: number;
  damp?: number;
  gravityRadius?: number;
  gravityMax?: number;
  
  // Wave mechanics
  rowDelay?: number;
  bounceAmp?: number;
  decay?: number;
  freq?: number;
  colSpread?: number;
  
  // Aesthetics & Visuals
  blur?: number;
  contrast?: number;
  dotColor?: string;
  bgColor?: string;
  
  // Simulation State
  autoDrops?: boolean;
  className?: string;
  children?: React.ReactNode;
}

interface Dot {
  bx: number;
  by: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  col: number;
  row: number;
}

interface Drop {
  col: number;
  time: number;
  amp: number;
}

export const LiquidGrid: React.FC<LiquidGridProps> = ({
  cols = 9,
  rows = 9,
  spacing = 56,
  baseRadius = 12,
  springK = 0.09,
  damp = 0.78,
  gravityRadius = 210,
  gravityMax = 20,
  rowDelay = 0.055,
  bounceAmp = 12,
  decay = 4.2,
  freq = 13.0,
  colSpread = 0.65,
  blur = 8,
  contrast = 28,
  dotColor = '#ffffff',
  bgColor = '#000000',
  autoDrops = true,
  className = '',
  children,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  
  // Keep all configurations in refs for ultra-smooth animation loop access
  const configRef = useRef({
    cols, rows, spacing, baseRadius, springK, damp,
    gravityRadius, gravityMax, rowDelay, bounceAmp,
    decay, freq, colSpread, autoDrops, dotColor, bgColor
  });

  // Sync prop changes to ref
  useEffect(() => {
    configRef.current = {
      cols, rows, spacing, baseRadius, springK, damp,
      gravityRadius, gravityMax, rowDelay, bounceAmp,
      decay, freq, colSpread, autoDrops, dotColor, bgColor
    };
  }, [
    cols, rows, spacing, baseRadius, springK, damp,
    gravityRadius, gravityMax, rowDelay, bounceAmp,
    decay, freq, colSpread, autoDrops, dotColor, bgColor
  ]);

  // State variables needed in the drawing loop managed in a single ref for speed
  const stateRef = useRef<{
    dots: Dot[];
    drops: Drop[];
    mouse: { x: number; y: number; on: boolean };
    t: number;
    nextDropAt: number;
  }>({
    dots: [],
    drops: [],
    mouse: { x: -9999, y: -9999, on: false },
    t: 0,
    nextDropAt: 0.6
  });

  // Build grid coordinates centred inside the container bounds
  const buildGrid = (width: number, height: number) => {
    const { cols: c, rows: r, spacing: s, baseRadius: br } = configRef.current;
    const ox = (width - (c - 1) * s) / 2;
    const oy = (height - (r - 1) * s) / 2;
    
    const newDots: Dot[] = [];
    for (let ri = 0; ri < r; ri++) {
      for (let ci = 0; ci < c; ci++) {
        const bx = ox + ci * s;
        const by = oy + ri * s;
        newDots.push({
          bx,
          by,
          x: bx,
          y: by,
          vx: 0,
          vy: 0,
          r: br,
          col: ci,
          row: ri
        });
      }
    }
    stateRef.current.dots = newDots;
  };

  // Rebuild grid whenever layout parameters alter
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      buildGrid(canvas.width, canvas.height);
    }
  }, [cols, rows, spacing, baseRadius]);

  // Spawn custom drop ripple at a chosen column
  const triggerDrop = (targetCol?: number) => {
    const activeCols = configRef.current.cols;
    const chosenCol = targetCol !== undefined 
      ? Math.max(0, Math.min(activeCols - 1, targetCol))
      : Math.floor(Math.random() * activeCols);
      
    stateRef.current.drops.push({
      col: chosenCol,
      time: stateRef.current.t,
      amp: configRef.current.bounceAmp * (0.75 + Math.random() * 0.5)
    });
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    // Physics ticks and render loop
    const loop = () => {
      const { 
        springK: sk, damp: dm, gravityRadius: gr, gravityMax: gm,
        rowDelay: rd, decay: dy, freq: fr, colSpread: cs, autoDrops: ad,
        dotColor: dc, bgColor: bg
      } = configRef.current;

      const state = stateRef.current;
      state.t += 0.016;

      // Dynamic resize check to prevent zero dimensions at mount
      const container = containerRef.current;
      if (container) {
        const cw = container.clientWidth;
        const ch = container.clientHeight;
        if (canvas.width !== cw || canvas.height !== ch) {
          canvas.width = cw;
          canvas.height = ch;
          buildGrid(cw, ch);
        }
      }

      // Spontaneous raindrops
      if (ad && state.t >= state.nextDropAt) {
        triggerDrop();
        state.nextDropAt = state.t + 1.5 + Math.random() * 2.5;
      }

      // Cleanup finished drops to prevent memory leaks
      state.drops = state.drops.filter(d => (state.t - d.time) < 3.0);

      // Compute Physics
      for (const d of state.dots) {
        let targetX = d.bx;
        let targetY = d.by;
        let targetR = configRef.current.baseRadius;

        // Wave propagation
        for (const drop of state.drops) {
          const localT = (state.t - drop.time) - d.row * rd;
          if (localT <= 0) continue;
          
          const colDist = Math.abs(d.col - drop.col);
          const lateralFalloff = Math.exp(-(colDist ** 2) * cs);
          if (lateralFalloff < 0.01) continue;

          // Sinusoidal bounce envelope
          targetY += drop.amp * Math.exp(-dy * localT) * Math.sin(fr * localT) * lateralFalloff;
        }

        // Gravity pull/repel towards cursor
        if (state.mouse.on) {
          const dx = state.mouse.x - d.bx;
          const dy = state.mouse.y - d.by;
          const distance = Math.hypot(dx, dy);

          if (distance < gr && distance > 1) {
            const pullRatio = (1 - distance / gr) ** 2;
            const displacement = pullRatio * gm;
            
            // Displace rest points
            targetX += (dx / distance) * displacement;
            targetY += (dy / distance) * displacement;
            
            // Dynamically scale radius based on pull closeness
            targetR = configRef.current.baseRadius * (1 + pullRatio * 0.25);
          }
        }

        // Apply spring forces
        d.vx += (targetX - d.x) * sk;
        d.vy += (targetY - d.y) * sk;
        d.vx *= dm;
        d.vy *= dm;
        d.x += d.vx;
        d.y += d.vy;
        
        // Radius interpolation
        d.r += (targetR - d.r) * 0.12;
      }

      // Clear & Draw
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = dc;
      for (const d of state.dots) {
        ctx.beginPath();
        ctx.arc(d.x, d.y, Math.max(0.1, d.r), 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Event handlers
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    stateRef.current.mouse = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      on: true
    };
  };

  const handleMouseLeave = () => {
    stateRef.current.mouse.on = false;
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || e.touches.length === 0) return;
    const rect = canvas.getBoundingClientRect();
    stateRef.current.mouse = {
      x: e.touches[0].clientX - rect.left,
      y: e.touches[0].clientY - rect.top,
      on: true
    };
  };

  const handleTouchEnd = () => {
    stateRef.current.mouse.on = false;
  };

  // Trigger drop wave on canvas click
  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    
    // Determine closest column
    const { cols: c, spacing: s } = configRef.current;
    const ox = (canvas.width - (c - 1) * s) / 2;
    const targetCol = Math.round((clickX - ox) / s);
    
    triggerDrop(targetCol);
  };

  return (
    <div 
      ref={containerRef}
      className={`relative w-full h-full overflow-hidden cursor-crosshair ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onClick={handleCanvasClick}
      style={{
        filter: `blur(${blur}px) contrast(${contrast})`,
        backgroundColor: bgColor,
      }}
    >
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full block"
      />
      {children && (
        <div className="relative z-10 w-full h-full pointer-events-none">
          {children}
        </div>
      )}
    </div>
  );
};

export default LiquidGrid;
