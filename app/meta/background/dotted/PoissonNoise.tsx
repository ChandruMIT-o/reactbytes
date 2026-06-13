"use client";

import React, { useEffect, useRef, useCallback } from 'react';

// ==========================================
// 1. SELF-CONTAINED GRADIENT NOISE ENGINE
// ==========================================
class SimpleNoise2D {
  private p: Uint8Array;

  constructor() {
    this.p = new Uint8Array(512);
    const permutation = new Uint8Array(256);
    for (let i = 0; i < 256; i++) {
      permutation[i] = Math.floor(Math.random() * 256);
    }
    for (let i = 0; i < 512; i++) {
      this.p[i] = permutation[i & 255];
    }
  }

  private fade(t: number) {
    return t * t * t * (t * (t * 6 - 15) + 10);
  }

  private lerp(t: number, a: number, b: number) {
    return a + t * (b - a);
  }

  private grad(hash: number, x: number, y: number) {
    const h = hash & 7;
    const u = h < 4 ? x : y;
    const v = h < 4 ? y : x;
    return ((h & 1) ? -u : u) + ((h & 2) ? -2.0 * v : 2.0 * v);
  }

  public noise(x: number, y: number): number {
    const X = Math.floor(x) & 255;
    const Y = Math.floor(y) & 255;
    x -= Math.floor(x);
    y -= Math.floor(y);
    const u = this.fade(x);
    const v = this.fade(y);
    const A = this.p[X] + Y;
    const B = this.p[X + 1] + Y;

    return this.lerp(
      v,
      this.lerp(u, this.grad(this.p[A], x, y), this.grad(this.p[B], x - 1, y)),
      this.lerp(u, this.grad(this.p[A + 1], x, y - 1), this.grad(this.p[B + 1], x - 1, y - 1))
    );
  }
}

const noiseGen = new SimpleNoise2D();

// Math helpers
const clamp = (val: number, min: number, max: number) => Math.min(max, Math.max(min, val));
const smoothstep = (edge0: number, edge1: number, x: number) => {
  const t = clamp((x - edge0) / (edge1 - edge0), 0.0, 1.0);
  return t * t * (3.0 - 2.0 * t);
};

// ==========================================
// 2. INTERACTIVE POISSON PARTICLE DEFINITION
// ==========================================
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  targetRadius: number;
  hue: number;
}

export interface PoissonNoiseProps {
  /** Aesthetic render style */
  renderMode?: 'dots' | 'circles' | 'constellation' | 'hybrid';
  /** Color theme palette */
  colorTheme?: 'monochrome' | 'solarized' | 'nebula' | 'cyberpunk';
  /** Minimum radius of particles */
  minRadius?: number;
  /** Maximum radius of particles */
  maxRadius?: number;
  /** Scale / Zoom frequency of the noise field */
  noiseScale?: number;
  /** Velocity influence of the noise field */
  noiseStrength?: number;
  /** Progression speed of the noise field */
  driftSpeed?: number;
  /** Maximum particle cap */
  maxParticles?: number;
  /** How the mouse influences particle scaling / movement */
  mouseInfluence?: 'repel' | 'attract' | 'scaleUp' | 'scaleDown' | 'none';
  /** Radius of cursor influence */
  mouseRadius?: number;
  /** Intensity/Force multiplier of the cursor */
  mouseIntensity?: number;
  /** Play/pause state of the simulation */
  isPlaying?: boolean;
  /** Callback triggered when the total node count changes */
  onNodeCountChange?: (count: number) => void;
  /** Additional CSS wrapper classes */
  className?: string;
  /** React children rendered on top of background */
  children?: React.ReactNode;
}

export const PoissonNoise: React.FC<PoissonNoiseProps> = ({
  renderMode = 'dots',
  colorTheme = 'monochrome',
  minRadius = 6,
  maxRadius = 35,
  noiseScale = 0.003,
  noiseStrength = 1.8,
  driftSpeed = 0.015,
  maxParticles = 800,
  mouseInfluence = 'repel',
  mouseRadius = 180,
  mouseIntensity = 1.0,
  isPlaying = true,
  onNodeCountChange,
  className = '',
  children,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Background Ref-based states to bypass React's schedule latency in animation loop
  const stateRef = useRef({
    time: 0,
    particles: [] as Particle[],
    mouse: { x: -1000, y: -1000, active: false, clickTrigger: false },
    dimensions: { width: 1000, height: 600 }
  });

  const lastCountRef = useRef<number>(-1);

  const onNodeCountChangeRef = useRef(onNodeCountChange);
  useEffect(() => {
    onNodeCountChangeRef.current = onNodeCountChange;
  }, [onNodeCountChange]);

  // Store dynamic props in a mutable ref to access them inside loop without rebuilding it
  const propsRef = useRef({
    renderMode,
    colorTheme,
    minRadius,
    maxRadius,
    noiseScale,
    noiseStrength,
    driftSpeed,
    maxParticles,
    mouseInfluence,
    mouseRadius,
    mouseIntensity,
    isPlaying
  });

  useEffect(() => {
    propsRef.current = {
      renderMode,
      colorTheme,
      minRadius,
      maxRadius,
      noiseScale,
      noiseStrength,
      driftSpeed,
      maxParticles,
      mouseInfluence,
      mouseRadius,
      mouseIntensity,
      isPlaying
    };
  }, [
    renderMode,
    colorTheme,
    minRadius,
    maxRadius,
    noiseScale,
    noiseStrength,
    driftSpeed,
    maxParticles,
    mouseInfluence,
    mouseRadius,
    mouseIntensity,
    isPlaying
  ]);

  // Helper to determine the target radius from current fields
  const getRadiusField = useCallback((x: number, y: number, time: number) => {
    const { mouse } = stateRef.current;
    const { minRadius: minR, maxRadius: maxR, noiseScale: nScale, mouseInfluence: mInf, mouseRadius: mRad, mouseIntensity: mInt } = propsRef.current;
    
    // Simplex Noise value
    let field = noiseGen.noise(x * nScale, y * nScale) * 0.6;
    // Add wave distortion over time
    field += Math.cos(Math.hypot(x - stateRef.current.dimensions.width / 2, y - stateRef.current.dimensions.height / 2) * 0.008 + time);
    field += Math.cos((x + y) * 0.0025 + time * 0.5);

    const val = clamp(0, 1, smoothstep(-1.2, 1.2, field));
    let baseRadius = minR + val * (maxR - minR);

    // Mouse influence
    if (mouse.active && mInf !== 'none') {
      const d = Math.hypot(x - mouse.x, y - mouse.y);
      if (d < mRad) {
        const influenceFactor = 1.0 - d / mRad; // 1 at mouse, 0 at edge
        if (mInf === 'scaleUp') {
          baseRadius *= (1.0 + influenceFactor * 0.6 * mInt);
        } else if (mInf === 'scaleDown') {
          baseRadius *= Math.max(0.4, 1.0 - influenceFactor * 0.4 * mInt);
        }
      }
    }

    return baseRadius;
  }, []);

  // Action: Clear & Seed initial points
  const triggerRegen = useCallback(() => {
    const { dimensions } = stateRef.current;
    const w = dimensions.width;
    const h = dimensions.height;
    const { maxParticles: maxP, minRadius: minR } = propsRef.current;

    // Create random distribution that will instantly relax into perfect Poisson layout
    const count = Math.min(maxP, 450);
    const newParticles: Particle[] = [];
    for (let i = 0; i < count; i++) {
      newParticles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: 0,
        vy: 0,
        radius: minR,
        targetRadius: minR,
        hue: Math.random() * 360
      });
    }
    stateRef.current.particles = newParticles;
  }, []);

  // Handle canvas scaling
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleResize = () => {
      const width = canvas.clientWidth || 1000;
      const height = canvas.clientHeight || 600;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      stateRef.current.dimensions = { width, height };
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    triggerRegen();

    return () => window.removeEventListener('resize', handleResize);
  }, [triggerRegen]);

  // Continuous animation engine (Flow Dynamics)
  useEffect(() => {
    let animFrameId: number;

    const loop = () => {
      const canvas = canvasRef.current;
      if (!canvas) {
        animFrameId = requestAnimationFrame(loop);
        return;
      }
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        animFrameId = requestAnimationFrame(loop);
        return;
      }

      const { isPlaying: playing, renderMode: rMode, colorTheme: theme, maxParticles: maxP, driftSpeed: dSpeed, noiseStrength: nStr, minRadius: minR, maxRadius: maxR, mouseInfluence: mInf, mouseRadius: mRad, mouseIntensity: mInt } = propsRef.current;

      if (!playing) {
        animFrameId = requestAnimationFrame(loop);
        return;
      }

      const { time, particles, mouse } = stateRef.current;
      
      const dpr = typeof window !== "undefined" ? window.devicePixelRatio : 1;
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;
      stateRef.current.dimensions = { width: w, height: h };
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Increment clock for noise drift
      stateRef.current.time += dSpeed;

      // Draw background
      ctx.fillStyle = '#050505';
      ctx.fillRect(0, 0, w, h);

      // Subtle dynamic grid layout in the backdrop
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.015)';
      ctx.lineWidth = 1;
      const step = 50;
      for (let x = 0; x < w; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      const currentCount = particles.length;
      if (onNodeCountChangeRef.current && currentCount !== lastCountRef.current) {
        lastCountRef.current = currentCount;
        onNodeCountChangeRef.current(currentCount);
      }

      // 1. Density Adjuster - Dynamically insert or prune particles
      if (particles.length < maxP && Math.random() < 0.3) {
        const source = particles.length > 0 ? particles[Math.floor(Math.random() * particles.length)] : { x: Math.random() * w, y: Math.random() * h };
        const angle = Math.random() * Math.PI * 2;
        const dist = (minR + maxR) * 0.75;
        const rx = source.x + Math.cos(angle) * dist;
        const ry = source.y + Math.sin(angle) * dist;
        if (rx > 10 && rx < w - 10 && ry > 10 && ry < h - 10) {
          particles.push({
            x: rx,
            y: ry,
            vx: 0,
            vy: 0,
            radius: minR,
            targetRadius: minR,
            hue: Math.random() * 360
          });
        }
      }
      if (particles.length > maxP) {
        particles.splice(0, particles.length - maxP);
      }

      // 2. Spatial Hash Grid for O(N) neighbor lookup
      const cellW = maxR;
      const cols = Math.ceil(w / cellW);
      const rows = Math.ceil(h / cellW);
      const grid: Particle[][] = Array.from({ length: cols * rows }, () => []);

      // Fill Spatial grid
      for (const p of particles) {
        const cx = Math.floor(p.x / cellW);
        const cy = Math.floor(p.y / cellW);
        if (cx >= 0 && cx < cols && cy >= 0 && cy < rows) {
          grid[cx + cy * cols].push(p);
        }
      }

      // 3. Update physics, target sizes, and resolve forces
      for (const p of particles) {
        p.targetRadius = getRadiusField(p.x, p.y, time);
        p.radius += (p.targetRadius - p.radius) * 0.1;

        const angle = noiseGen.noise(p.x * 0.002, p.y * 0.002 + time * 0.05) * Math.PI * 4;
        p.vx += Math.cos(angle) * nStr * 0.08;
        p.vy += Math.sin(angle) * nStr * 0.08;

        p.vx *= 0.88;
        p.vy *= 0.88;

        // Apply Mouse Attraction / Repulsion Force
        if (mouse.active && mInf !== 'none') {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const d = Math.hypot(dx, dy);
          if (d < mRad && d > 1) {
            const force = (1.0 - d / mRad) * 0.25 * mInt;
            if (mInf === 'repel') {
              p.vx += (dx / d) * force * 1.5;
              p.vy += (dy / d) * force * 1.5;
            } else if (mInf === 'attract') {
              p.vx -= (dx / d) * force * 1.5;
              p.vy -= (dy / d) * force * 1.5;
            }
          }
        }

        // Apply mutual Poisson disk spacing constraints
        const cx = Math.floor(p.x / cellW);
        const cy = Math.floor(p.y / cellW);

        for (let dx = -1; dx <= 1; dx++) {
          for (let dy = -1; dy <= 1; dy++) {
            const nx = cx + dx;
            const ny = cy + dy;
            if (nx >= 0 && nx < cols && ny >= 0 && ny < rows) {
              const neighbors = grid[nx + ny * cols];
              for (const other of neighbors) {
                if (other === p) continue;
                const dist = Math.hypot(p.x - other.x, p.y - other.y);
                const minGap = (p.radius + other.radius) * 0.45;
                if (dist < minGap && dist > 0.1) {
                  const overlap = minGap - dist;
                  const forceX = ((p.x - other.x) / dist) * overlap * 0.35;
                  const forceY = ((p.y - other.y) / dist) * overlap * 0.35;
                  p.vx += forceX;
                  p.vy += forceY;
                  other.vx -= forceX;
                  other.vy -= forceY;
                }
              }
            }
          }
        }
      }

      // 4. Update coordinates & apply boundaries
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;

        const pad = p.radius + 10;
        if (p.x < pad) { p.x = pad; p.vx *= -0.5; }
        if (p.x > w - pad) { p.x = w - pad; p.vx *= -0.5; }
        if (p.y < pad) { p.y = pad; p.vy *= -0.5; }
        if (p.y > h - pad) { p.y = h - pad; p.vy *= -0.5; }
      }

      // ==========================================
      // RENDER LOGIC FOR DYNAMIC FLOW MODE
      // ==========================================
      const getStrokeStyle = (p: Particle, alpha = 1.0) => {
        if (theme === 'monochrome') return `rgba(220, 220, 220, ${alpha})`;
        if (theme === 'solarized') return `hsla(${30 + (p.radius * 2)}, 90%, 65%, ${alpha})`;
        if (theme === 'nebula') return `hsla(${240 + (p.radius * 3)}, 85%, 60%, ${alpha})`;
        return `hsla(${p.hue}, 90%, 65%, ${alpha})`; // Cyberpunk
      };

      if (rMode === 'dots') {
        for (const p of particles) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, clamp(2.5, 8, p.radius * 0.25), 0, Math.PI * 2);
          ctx.fillStyle = getStrokeStyle(p);
          ctx.fill();
        }
      } else if (rMode === 'circles') {
        for (const p of particles) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius * 0.45, 0, Math.PI * 2);
          ctx.strokeStyle = getStrokeStyle(p, 0.4);
          ctx.lineWidth = 1.5;
          ctx.stroke();

          ctx.beginPath();
          ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
          ctx.fillStyle = getStrokeStyle(p, 0.9);
          ctx.fill();
        }
      } else if (rMode === 'constellation') {
        ctx.lineWidth = 0.8;
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          const maxConnections = 3;
          let connections = 0;

          const cx = Math.floor(p.x / cellW);
          const cy = Math.floor(p.y / cellW);
          for (let dx = -1; dx <= 1 && connections < maxConnections; dx++) {
            for (let dy = -1; dy <= 1 && connections < maxConnections; dy++) {
              const nx = cx + dx;
              const ny = cy + dy;
              if (nx >= 0 && nx < cols && ny >= 0 && ny < rows) {
                for (const other of grid[nx + ny * cols]) {
                  if (other === p) continue;
                  const d = Math.hypot(p.x - other.x, p.y - other.y);
                  const linkLimit = (p.radius + other.radius) * 0.95;
                  if (d < linkLimit) {
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(other.x, other.y);
                    ctx.strokeStyle = getStrokeStyle(p, 1.0 - (d / linkLimit));
                    ctx.stroke();
                    connections++;
                  }
                }
              }
            }
          }
        }
        for (const p of particles) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
          ctx.fillStyle = getStrokeStyle(p, 1.0);
          ctx.fill();
        }
      } else if (rMode === 'hybrid') {
        for (const p of particles) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius * 0.35, 0, Math.PI * 2);
          ctx.strokeStyle = getStrokeStyle(p, 0.15);
          ctx.stroke();

          ctx.beginPath();
          ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
          ctx.fillStyle = getStrokeStyle(p, 0.85);
          ctx.fill();
        }
      }

      // Render Interactive Cursor Highlight Zone
      if (mouse.active && mInf !== 'none') {
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, mRad, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 6]);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      animFrameId = requestAnimationFrame(loop);
    };

    loop();

    return () => cancelAnimationFrame(animFrameId);
  }, []);

  // Handle pointer tracking
  const handlePointer = (e: any, end = false) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();

    if (end) {
      stateRef.current.mouse.active = false;
      return;
    }

    let clientX = 0;
    let clientY = 0;

    if (e.touches && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else if (e.clientX !== undefined) {
      clientX = e.clientX;
      clientY = e.clientY;
    } else {
      return;
    }

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    stateRef.current.mouse.x = x;
    stateRef.current.mouse.y = y;
    stateRef.current.mouse.active = true;
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    handlePointer(e);
    stateRef.current.mouse.clickTrigger = true;
  };

  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full block cursor-crosshair"
        onMouseMove={handlePointer}
        onMouseDown={handleMouseDown}
        onMouseUp={() => { stateRef.current.mouse.clickTrigger = false; }}
        onMouseLeave={() => handlePointer({} as any, true)}
        onTouchMove={handlePointer}
        onTouchStart={(e) => { handlePointer(e); stateRef.current.mouse.clickTrigger = true; }}
        onTouchEnd={() => handlePointer({} as any, true)}
      />
      {children && (
        <div className="relative z-10 w-full h-full pointer-events-none">
          {children}
        </div>
      )}
    </div>
  );
};

export default PoissonNoise;
