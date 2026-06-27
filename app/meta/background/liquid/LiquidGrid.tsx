"use client";

import React, { useEffect, useRef } from 'react';

export interface LiquidGridProps {
  cols?: number; // Optional override
  rows?: number; // Optional override
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
  cols,
  rows,
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
    cols: cols || 0,
    rows: rows || 0,
    spacing, baseRadius, springK, damp,
    gravityRadius, gravityMax, rowDelay, bounceAmp,
    decay, freq, colSpread, autoDrops, dotColor, bgColor
  });

  // Sync prop changes to ref
  useEffect(() => {
    configRef.current = {
      cols: cols || configRef.current.cols,
      rows: rows || configRef.current.rows,
      spacing, baseRadius, springK, damp,
      gravityRadius, gravityMax, rowDelay, bounceAmp,
      decay, freq, colSpread, autoDrops, dotColor, bgColor
    };
  }, [
    cols, rows, spacing, baseRadius, springK, damp,
    gravityRadius, gravityMax, rowDelay, bounceAmp,
    decay, freq, colSpread, autoDrops, dotColor, bgColor
  ]);

  // State variables managed in a single ref for speed
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

  // Build grid coordinates dynamically to fill the container bounds
  const buildGrid = (width: number, height: number) => {
    const { spacing: s, baseRadius: br } = configRef.current;

    // Dynamically calculate column and row counts if not explicitly overridden by props
    const calculatedCols = cols || Math.floor(width / s) + 2;
    const calculatedRows = rows || Math.floor(height / s) + 2;

    // Keep the loop config up-to-date with dynamic calculations
    configRef.current.cols = calculatedCols;
    configRef.current.rows = calculatedRows;

    // Evenly distribute spacing offsets across the container
    const ox = (width - (calculatedCols - 1) * s) / 2;
    const oy = (height - (calculatedRows - 1) * s) / 2;

    const newDots: Dot[] = [];
    for (let ri = 0; ri < calculatedRows; ri++) {
      for (let ci = 0; ci < calculatedCols; ci++) {
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

  // Rebuild grid whenever dynamic layout parameters change
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      buildGrid(canvas.width, canvas.height);
    }
  }, [cols, rows, spacing, baseRadius]);

  // Spawn custom drop ripple at a chosen column
  const triggerDrop = (targetCol?: number) => {
    const activeCols = configRef.current.cols;
    if (activeCols <= 0) return;

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

    const loop = () => {
      const {
        springK: sk, damp: dm, gravityRadius: gr, gravityMax: gm,
        rowDelay: rd, decay: dy, freq: fr, colSpread: cs, autoDrops: ad,
        dotColor: dc, bgColor: bg
      } = configRef.current;

      const state = stateRef.current;
      state.t += 0.016;

      // Dynamic resize check
      const container = containerRef.current;
      if (container) {
        const cw = container.clientWidth;
        const ch = container.clientHeight;
        if (canvas.width !== cw || canvas.height !== ch) {
          canvas.width = cw;
          canvas.height = ch;
          buildGrid(cw, ch); // Triggers re-calculation of columns and rows automatically!
        }
      }

      // Spontaneous raindrops
      if (ad && state.t >= state.nextDropAt) {
        triggerDrop();
        state.nextDropAt = state.t + 1.5 + Math.random() * 2.5;
      }

      // Cleanup finished drops
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

          targetY += drop.amp * Math.exp(-dy * localT) * Math.sin(fr * localT) * lateralFalloff;
        }

        // Gravity interaction
        if (state.mouse.on) {
          const dx = state.mouse.x - d.bx;
          const dy = state.mouse.y - d.by;
          const distance = Math.hypot(dx, dy);

          if (distance < gr && distance > 1) {
            const pullRatio = (1 - distance / gr) ** 2;
            const displacement = pullRatio * gm;

            targetX += (dx / distance) * displacement;
            targetY += (dy / distance) * displacement;
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

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;

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