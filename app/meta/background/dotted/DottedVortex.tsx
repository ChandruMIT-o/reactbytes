import React, { useEffect, useRef, useState } from 'react';

// --- Math & Easing Utilities ---
const lerp = (start: number, end: number, factor: number) => start + (end - start) * factor;
const clamp = (val: number, min: number, max: number) => Math.min(Math.max(val, min), max);

// --- Types & Interfaces ---
interface Dot {
  x: number;
  y: number;
  r: number;
  baseX: number;
  baseY: number;
  energy: number;
}

interface Ripple {
  x: number;
  y: number;
  radius: number;
  life: number;
  maxLife: number;
}

export interface DottedVortexProps {
  /** The high-resolution image to reveal */
  imageSrc?: string;
  /** Trigger the vortex/aperture focus state (e.g., on button hover) */
  isExcited?: boolean;

  // --- Appearance ---
  /** The solid background color beneath everything */
  bgColor?: string;
  /** The color of the active interactive dots */
  activeDotColor?: string;
  /** The color of the distant, un-scaled dots */
  idleDotColor?: string;

  // --- Grid Config ---
  /** The distance between each dot in the grid */
  gridSpacing?: number;
  /** The base radius of each dot */
  baseDotRadius?: number;

  // --- Interaction Physics ---
  /** How quickly the effect follows the cursor (0.01 to 1) */
  cursorFollowSpeed?: number;
  /** The maximum distance of the reveal effect relative to screen width */
  revealRadiusScale?: number;
  /** How intensely the cursor speed injects kinetic energy into dots */
  kineticEnergyMultiplier?: number;
  /** The radius expansion speed of click ripples */
  rippleSpeed?: number;

  // --- Hover / Excitement Physics ---
  /** The maximum rotation angle when in the excited state */
  twistAngle?: number;
  /** The size of the aperture focal point when excited */
  apertureSize?: number;

  /** Overlay elements to render on top of the background */
  children?: React.ReactNode;
  /** Container class name */
  className?: string;
}

const DottedVortex: React.FC<DottedVortexProps> = ({
  imageSrc = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop',
  isExcited = false,
  bgColor = '#0a0a0a',
  activeDotColor = '#ffffff',
  idleDotColor = 'rgba(255, 255, 255, 0.15)',
  gridSpacing = 24,
  baseDotRadius = 1.5,
  cursorFollowSpeed = 0.08,
  revealRadiusScale = 0.2,
  kineticEnergyMultiplier = 0.4,
  rippleSpeed = 10,
  twistAngle = Math.PI * 0.8,
  apertureSize = 0.12,
  children,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const imageRef = useRef<HTMLImageElement | null>(null);

  // Store props in a ref so the render loop always has the latest values without re-binding
  const configRef = useRef({
    isExcited, bgColor, activeDotColor, idleDotColor,
    cursorFollowSpeed, revealRadiusScale, kineticEnergyMultiplier,
    rippleSpeed, twistAngle, apertureSize
  });

  useEffect(() => {
    configRef.current = {
      isExcited, bgColor, activeDotColor, idleDotColor,
      cursorFollowSpeed, revealRadiusScale, kineticEnergyMultiplier,
      rippleSpeed, twistAngle, apertureSize
    };
  }, [
    isExcited, bgColor, activeDotColor, idleDotColor,
    cursorFollowSpeed, revealRadiusScale, kineticEnergyMultiplier,
    rippleSpeed, twistAngle, apertureSize
  ]);

  // Handle image loading reactively without disrupting the physics canvas loop execution
  useEffect(() => {
    setIsLoaded(false);
    const img = new Image();
    img.src = imageSrc;
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      imageRef.current = img;
      setIsLoaded(true);
    };
  }, [imageSrc]);

  // Mouse / Pointer state tracking
  const m = useRef({
    x: typeof window !== 'undefined' ? window.innerWidth / 2 : 500,
    y: typeof window !== 'undefined' ? window.innerHeight / 2 : 500,
    tx: typeof window !== 'undefined' ? window.innerWidth / 2 : 500,
    ty: typeof window !== 'undefined' ? window.innerHeight / 2 : 500,
    s: 2,
    ts: 2,
  });

  const effectState = useRef({
    ripples: [] as Ripple[],
    lastMouse: { x: 0, y: 0 },
    currentTwist: 0
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let dots: Dot[] = [];
    let cw = 0;
    let ch = 0;

    // Initialization & Element-Driven Resize handler
    const resize = () => {
      cw = Math.floor(container.clientWidth);
      ch = Math.floor(container.clientHeight);

      const dpr = window.devicePixelRatio || 1;
      canvas.width = cw * dpr;
      canvas.height = ch * dpr;
      ctx.scale(dpr, dpr);

      dots = [];
      // Generate grid based on the passed spacing prop
      for (let x = -50; x <= cw + 50; x += gridSpacing) {
        for (let y = -50; y <= ch + 50; y += gridSpacing) {
          dots.push({ x, y, baseX: x, baseY: y, r: baseDotRadius, energy: 0 });
        }
      }
    };

    // Replace the window listener with a ResizeObserver targeting the true parent container boundary
    const resizeObserver = new ResizeObserver(() => {
      resize();
    });
    resizeObserver.observe(container);

    // Set baseline sizes immediately
    resize();

    effectState.current.lastMouse = { x: m.current.tx, y: m.current.ty };

    // The Main Render Loop
    const render = () => {
      const cfg = configRef.current;
      const time = Date.now() * 0.002;

      // Calculate kinetic energy
      const vx = m.current.tx - effectState.current.lastMouse.x;
      const vy = m.current.ty - effectState.current.lastMouse.y;
      effectState.current.lastMouse.x = m.current.tx;
      effectState.current.lastMouse.y = m.current.ty;
      const speed = clamp(Math.hypot(vx, vy), 0, 50);

      // Twist mechanics
      const targetTwist = cfg.isExcited ? cfg.twistAngle + Math.sin(time) * 0.15 : 0;
      effectState.current.currentTwist = lerp(effectState.current.currentTwist, targetTwist, 0.05);

      // Interpolate mouse
      m.current.x = lerp(m.current.x, m.current.tx, cfg.cursorFollowSpeed);
      m.current.y = lerp(m.current.y, m.current.ty, cfg.cursorFollowSpeed);

      // Aperture scaling
      if (cfg.isExcited) {
        const targetRadius = cfg.apertureSize + Math.cos(time * 1.2) * 0.01;
        m.current.ts = lerp(m.current.ts, targetRadius, 0.08);
      } else {
        const dist = Math.hypot(m.current.x - m.current.tx, m.current.y - m.current.ty);
        m.current.ts = cfg.revealRadiusScale + clamp(dist / cw, 0, 1);
      }
      m.current.s = lerp(m.current.s, m.current.ts, 0.05);

      // Update ripples
      effectState.current.ripples.forEach(r => {
        r.radius += cfg.rippleSpeed;
        r.life -= 0.015;
      });
      effectState.current.ripples = effectState.current.ripples.filter(r => r.life > 0);

      // Clear Context
      ctx.clearRect(0, 0, cw, ch);
      ctx.globalCompositeOperation = 'source-over';
      const maxScaleDist = cw * m.current.s;

      // Draw grid mask
      for (let i = 0; i < dots.length; i++) {
        const dot = dots[i];
        const d = Math.hypot(dot.x - m.current.x, dot.y - m.current.y);

        // Fluid energy
        if (d < 120) {
          const influence = 1 - (d / 120);
          dot.energy = lerp(dot.energy, speed * influence * cfg.kineticEnergyMultiplier, 0.1);
        }
        dot.energy *= 0.92;

        // Ripple bonus
        let rippleBonus = 0;
        for (const r of effectState.current.ripples) {
          const distToRipple = Math.abs(Math.hypot(dot.x - r.x, dot.y - r.y) - r.radius);
          if (distToRipple < 100) {
            const ease = Math.pow(1 - (distToRipple / 100), 2);
            rippleBonus += ease * (r.life / r.maxLife) * 20;
          }
        }

        // Hypnotic inward flow
        let pulse = 0;
        if (cfg.isExcited) {
          const maskRadius = maxScaleDist * 2.5;
          const swirlInfluence = Math.pow(Math.max(0, 1 - d / maskRadius), 1.5);
          pulse = Math.max(0, Math.sin(-d * 0.06 + time * 4)) * swirlInfluence * 6;
        }

        const baseScale = (1 - clamp(d / maxScaleDist, 0, 1)) * 25;
        const s = Math.max(0, baseScale + dot.energy + rippleBonus + pulse);

        if (s < 0.2 && !cfg.isExcited && dot.energy < 0.1) {
          ctx.fillStyle = cfg.idleDotColor;
          ctx.beginPath();
          ctx.arc(dot.baseX, dot.baseY, dot.r, 0, Math.PI * 2);
          ctx.fill();
          continue;
        }

        ctx.fillStyle = cfg.activeDotColor;
        ctx.beginPath();

        // Parallax offset
        let px = dot.baseX + lerp(-cw / 20, cw / 20, m.current.x / cw);
        let py = dot.baseY + lerp(-ch / 20, ch / 20, m.current.y / ch);

        // Twist Rotation
        if (effectState.current.currentTwist > 0.001) {
          const maskRadius = maxScaleDist * 2.5;
          const swirlInfluence = Math.pow(Math.max(0, 1 - d / maskRadius), 1.5);
          const currentAngle = effectState.current.currentTwist * swirlInfluence;

          if (currentAngle > 0.001) {
            const dx = px - m.current.x;
            const dy = py - m.current.y;
            const cosA = Math.cos(currentAngle);
            const sinA = Math.sin(currentAngle);
            px = m.current.x + dx * cosA - dy * sinA;
            py = m.current.y + dx * sinA + dy * cosA;
          }
        }

        ctx.arc(px, py, dot.r * Math.max(0.1, s), 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw revealed image
      ctx.globalCompositeOperation = 'source-in';
      if (imageRef.current) {
        const img = imageRef.current;
        const ix = lerp(-cw / 30, cw / 30, m.current.x / cw);
        const iy = lerp(-ch / 30, ch / 30, m.current.y / ch);

        const scale = Math.max(cw / img.width, ch / img.height) * 1.1;
        const drawW = img.width * scale;
        const drawH = img.height * scale;
        const drawX = (cw - drawW) / 2 + ix;
        const drawY = (ch - drawH) / 2 + iy;

        ctx.save();
        if (effectState.current.currentTwist > 0.001) {
          ctx.translate(m.current.x, m.current.y);
          ctx.rotate(effectState.current.currentTwist * 0.8);
          ctx.translate(-m.current.x, -m.current.y);
        }
        ctx.drawImage(img, drawX, drawY, drawW, drawH);
        ctx.restore();
      }

      // Draw dark background layer
      ctx.globalCompositeOperation = 'destination-over';
      ctx.fillStyle = cfg.bgColor;
      ctx.fillRect(0, 0, cw, ch);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      resizeObserver.disconnect();
      cancelAnimationFrame(animationFrameId);
    };
  }, [gridSpacing, baseDotRadius]); // Only recalculate the engine loops if geometry properties change

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    m.current.tx = e.clientX - rect.left;
    m.current.ty = e.clientY - rect.top;
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    effectState.current.ripples.push({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      radius: 0,
      life: 1,
      maxLife: 1
    });
  };

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      onPointerMove={handlePointerMove}
      onPointerDown={handlePointerDown}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 block w-full h-full"
        style={{ opacity: isLoaded ? 1 : 0, transition: 'opacity 0.5s ease-in-out' }}
      />
      {/* Foreground UI wrapper */}
      <div className="relative z-10 w-full h-full">
        {children}
      </div>

      {!isLoaded && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black text-white">
          <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
};

export default DottedVortex;