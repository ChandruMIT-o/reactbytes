export const loaderProps = [
  {
    title: "Core Props",
    props: [
      {
        name: "texts",
        type: "string[]",
        defaultValue: "['Developer', 'Designer', 'Philosopher', 'Physicist']",
        description: "Array of words to rotate/morph through.",
      },
      {
        name: "prefix",
        type: "string",
        defaultValue: "'I am a'",
        description: "Static prefix text displayed in front of the dynamic words.",
      },
      {
        name: "delay",
        type: "number",
        defaultValue: "3000",
        description: "Duration in milliseconds to display each word before swapping.",
      },
      {
        name: "fontSize",
        type: "number",
        defaultValue: "48",
        description: "Font size of the dynamic text on the canvas (pixels).",
      },
      {
        name: "fontFamily",
        type: "string",
        defaultValue: "'system-ui, -apple-system, sans-serif'",
        description: "Font family for the dynamic text canvas render.",
      },
    ],
  },
  {
    title: "Simulation & Physics Props",
    props: [
      {
        name: "friction",
        type: "number",
        defaultValue: "0.85",
        description: "Friction / damping coefficient for the particle movements. Range: 0.5 to 0.99.",
      },
      {
        name: "springStiffness",
        type: "number",
        defaultValue: "0.08",
        description: "Spring stiffness factor pulling particles back to text target points.",
      },
      {
        name: "particleSize",
        type: "number",
        defaultValue: "1.8",
        description: "Base radius of the rendered particles.",
      },
      {
        name: "step",
        type: "number",
        defaultValue: "3",
        description: "Grid pixel sampling step. Lower values increase particle density but decrease performance.",
      },
      {
        name: "morphSpeed",
        type: "number",
        defaultValue: "0.8",
        description: "Morphing speed coefficient (e.g. 0.8 matches WebGL shader).",
      },
      {
        name: "breatheIntensity",
        type: "number",
        defaultValue: "0.35",
        description: "Scale of the outward morph breathing explosion push.",
      },
    ],
  },
  {
    title: "Interaction Props",
    props: [
      {
        name: "mouseRepel",
        type: "boolean",
        defaultValue: "true",
        description: "Enables particle repulsion when hovering with the cursor or dragging.",
      },
      {
        name: "repelRadius",
        type: "number",
        defaultValue: "60",
        description: "Radius of influence around the mouse in pixels.",
      },
      {
        name: "repelStrength",
        type: "number",
        defaultValue: "4.0",
        description: "Repelling force factor pushing particles away from the mouse.",
      },
    ],
  },
  {
    title: "Styling & Custom Class Props",
    props: [
      {
        name: "textColor",
        type: "string",
        defaultValue: "'#E8EAF0'",
        description: "Hex or CSS color for the text particles.",
      },
      {
        name: "prefixColor",
        type: "string",
        defaultValue: "'#9CA3AF'",
        description: "Hex or CSS color for the prefix text.",
      },
      {
        name: "containerClassName",
        type: "string",
        defaultValue: "''",
        description: "Tailwind or CSS classes for the outer wrapper container.",
      },
      {
        name: "prefixClassName",
        type: "string",
        defaultValue: "'text-xl font-medium md:text-2xl'",
        description: "Tailwind or CSS classes specifically for the prefix static text.",
      },
      {
        name: "canvasClassName",
        type: "string",
        defaultValue: "''",
        description: "Tailwind or CSS classes for the interactive canvas.",
      },
    ],
  },
];

export const creditsData = [
  {
    title: "Component Source",
    items: [
      {
        name: "React Bytes",
        role: "Collection",
        url: "https://reactbytes.dev",
      },
    ],
  },
  {
    title: "Open Source Techs",
    items: [
      {
        name: "React",
        role: "UI Library",
        url: "https://react.dev",
      },
      {
        name: "HTML5 Canvas",
        role: "Rendering API",
        url: "https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API",
      },
      {
        name: "Tailwind CSS",
        role: "Styling",
        url: "https://tailwindcss.com",
      },
    ],
  },
];

export const componentCode = `"use client";

import React, { useEffect, useRef, useState } from "react";

export interface SwarmTextProps {
  /** Array of words to rotate through */
  texts?: string[];
  /** Static prefix text that sits in front of the animated words */
  prefix?: string;
  /** Delay in milliseconds between text switches */
  delay?: number;
  /** Font size in pixels */
  fontSize?: number;
  /** Font family (e.g. 'Inter', 'monospace', 'Segoe UI') */
  fontFamily?: string;
  /** Color of the particles */
  textColor?: string;
  /** Color of the static prefix text */
  prefixColor?: string;
  /** Damping/friction for spring physics (0.5 to 0.99) */
  friction?: number;
  /** Spring stiffness/strength (0.01 to 0.5) */
  springStiffness?: number;
  /** Maximum particle size/radius */
  particleSize?: number;
  /** Mouse hover repel radius */
  repelRadius?: number;
  /** Mouse hover repel strength */
  repelStrength?: number;
  /** Enable mouse hover interaction */
  mouseRepel?: boolean;
  /** Additional container CSS class names */
  containerClassName?: string;
  /** Additional prefix text CSS class names */
  prefixClassName?: string;
  /** Additional canvas CSS class names */
  canvasClassName?: string;
  /** Particle density step size (lower = more particles, e.g. 2, 3, 4) */
  step?: number;
  /** Coordinated morph transition speed (e.g. 0.8 matches shader) */
  morphSpeed?: number;
  /** Coordinated morph explosion/breathe strength multiplier */
  breatheIntensity?: number;
}

class Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  tx: number; // target x
  ty: number; // target y
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  color: string;
  size: number;
  alpha: number;
  targetAlpha: number;
  active: boolean;
  randomOffset: number;
  id: number;

  constructor(x: number, y: number, color: string, size: number, id: number) {
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.tx = x;
    this.ty = y;
    this.startX = x;
    this.startY = y;
    this.endX = x;
    this.endY = y;
    this.color = color;
    this.size = size;
    this.alpha = 0;
    this.targetAlpha = 0;
    this.active = false;
    this.randomOffset = Math.random() * 100;
    this.id = id;
  }

  update(
    spring: number,
    friction: number,
    mouseX: number,
    mouseY: number,
    repelRadius: number,
    repelStrength: number,
    mouseActive: boolean,
    textColor: string,
    time: number
  ) {
    let ax = (this.tx - this.x) * spring;
    let ay = (this.ty - this.y) * spring;

    // Fluid wave flow noise
    const flowX = Math.sin(this.y * 0.04 + time * 1.5) * 0.15;
    const flowY = Math.cos(this.x * 0.04 + time * 1.5) * 0.15;
    ax += flowX;
    ay += flowY;

    // Mouse Repel Force
    if (mouseActive) {
      const dx = this.x - mouseX;
      const dy = this.y - mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < repelRadius) {
        const force = (repelRadius - dist) / repelRadius;
        const dirX = dist > 0 ? dx / dist : 0;
        const dirY = dist > 0 ? dy / dist : 0;
        
        ax += dirX * force * repelStrength;
        ay += dirY * force * repelStrength;
      }
    }

    // Physics integration
    this.vx = (this.vx + ax) * friction;
    this.vy = (this.vy + ay) * friction;
    this.x += this.vx;
    this.y += this.vy;

    // Shimmer/twinkle alpha. Active particles remain mostly visible (twinkle between 0.65 and 1.0)
    // while idle particles shimmer deeper (twinkle between 0.25 and 0.8) to look like background nebula dust.
    const baseAlpha = this.active ? 0.95 : 0.25;
    const minTwinkle = this.active ? 0.65 : 0.25;
    const twinkleRange = this.active ? 0.35 : 0.55;
    const twinkle = minTwinkle + twinkleRange * Math.sin(time * 5.0 + this.id * Math.PI * 20.0);
    this.alpha += (twinkle * baseAlpha - this.alpha) * 0.1;

    // Procedural color shimmer (iridescence) derived from base color
    const match = textColor.replace(\\"#\\", \\"\\").match(/.{1,2}/g);
    if (match) {
      const rBase = parseInt(match[0], 16);
      const gBase = parseInt(match[1], 16);
      const bBase = parseInt(match[2], 16);
      
      const wave = Math.sin(time * 3.0 + this.id * Math.PI * 4.0);
      const r = Math.min(255, Math.max(0, rBase + wave * 25));
      const g = Math.min(255, Math.max(0, gBase + wave * 15));
      const b = Math.min(255, Math.max(0, bBase + wave * 30));
      this.color = \`rgb(\${r}, \${g}, \${b})\`;
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.color;
    ctx.globalAlpha = Math.max(0, Math.min(1, this.alpha));
    ctx.beginPath();
    
    // Calculate distance to current target to determine bloom size scaling
    const dx = this.tx - this.x;
    const dy = this.ty - this.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    
    // Bloom up to 1.7x when settled close to target, keeping it small and sharp when in flight
    const bloom = this.active ? 1.0 + 0.7 * Math.max(0, 1.0 - dist / 20.0) : 1.0;
    const renderSize = this.size * bloom;

    ctx.arc(this.x, this.y, renderSize, 0, Math.PI * 2);
    ctx.fill();
  }
}

// Cubic ease-in-out helper
const cubicInOut = (t: number) => {
  return t < 0.5 ? 4.0 * t * t * t : 1.0 - Math.pow(-2.0 * t + 2.0, 3.0) / 2.0;
};

export const SwarmText: React.FC<SwarmTextProps> = ({
  texts = [\\"Developer\\", \\"Designer\\", \\"Philosopher\\", \\"Physicist\\"],
  prefix = \\"I am a\\",
  delay = 3000,
  fontSize = 48,
  fontFamily = \\"system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif\\",
  textColor = \\"#E8EAF0\\",
  prefixColor = \\"#9CA3AF\\",
  friction = 0.85,
  springStiffness = 0.08,
  particleSize = 1.8,
  repelRadius = 60,
  repelStrength = 4.0,
  mouseRepel = true,
  containerClassName = \\"\\",
  prefixClassName = \\"text-xl font-medium md:text-2xl\\",
  canvasClassName = \\"\\",
  step = 3,
  morphSpeed = 0.8,
  breatheIntensity = 0.35,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [dims, setDims] = useState({ width: 300, height: 80 });
  const [currentTextIdx, setCurrentTextIdx] = useState(0);

  // References to keep animation loop stable and prevent effect restarts on word swaps
  const currentTextIdxRef = useRef(currentTextIdx);
  const textsRef = useRef(texts);
  const mouseRef = useRef({ x: 0, y: 0, active: false });

  // Update refs on changes
  useEffect(() => {
    currentTextIdxRef.current = currentTextIdx;
  }, [currentTextIdx]);

  useEffect(() => {
    textsRef.current = texts;
  }, [texts]);

  // Update canvas dimensions based on dynamic texts
  useEffect(() => {
    if (typeof window === \\"undefined\\" || !texts.length) return;

    const fontStr = \`bold \${fontSize}px \${fontFamily}\`;
    const tempCanvas = document.createElement(\\"canvas\\");
    const tempCtx = tempCanvas.getContext(\\"2d\\");
    if (!tempCtx) return;
    
    tempCtx.font = fontStr;
    
    let maxWidth = 100;
    texts.forEach((text) => {
      const width = tempCtx.measureText(text).width;
      if (width > maxWidth) {
        maxWidth = width;
      }
    });

    setDims({
      width: Math.ceil(maxWidth + 60),
      height: Math.ceil(fontSize * 1.6),
    });
  }, [texts, fontSize, fontFamily]);

  // Word swapping loop
  useEffect(() => {
    if (texts.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentTextIdx((prev) => (prev + 1) % texts.length);
    }, delay);

    return () => clearInterval(interval);
  }, [texts, delay]);

  // Stable Core Particle System Hook
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext(\\"2d\\");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const { width, height } = dims;

    // Apply high-DPI scaling
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    const particles: Particle[] = [];

    // Offscreen canvas to render text and scan pixels
    const offscreenCanvas = document.createElement(\\"canvas\\");
    const offscreenCtx = offscreenCanvas.getContext(\\"2d\\");
    if (!offscreenCtx) return;

    offscreenCanvas.width = width;
    offscreenCanvas.height = height;

    const getTargetsForText = (text: string) => {
      offscreenCtx.clearRect(0, 0, width, height);
      offscreenCtx.fillStyle = \\"#ffffff\\";
      offscreenCtx.font = \`bold \${fontSize}px \${fontFamily}\`;
      offscreenCtx.textAlign = \\"left\\";
      offscreenCtx.textBaseline = \\"middle\\";
      
      // Draw text horizontally centered with padding
      offscreenCtx.fillText(text, 20, height / 2);

      const imgData = offscreenCtx.getImageData(0, 0, width, height);
      const data = imgData.data;
      const targets: { x: number; y: number }[] = [];

      for (let y = 0; y < height; y += step) {
        for (let x = 0; x < width; x += step) {
          const index = (y * width + x) * 4;
          const alpha = data[index + 3];
          if (alpha > 128) {
            targets.push({ x, y });
          }
        }
      }
      return targets;
    };

    // Transition tracking states inside the single stable loop
    let activeTextIdx = -1;
    let morphProgress = 1.0;
    let isTransitioning = false;
    
    const cx = width / 2;
    const cy = height / 2;

    let animationId = 0;
    let lastTime = performance.now();
    let time = 0;

    // Animation Loop
    const tick = (now: number) => {
      const deltaTime = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;
      time += deltaTime;

      const currentIdx = currentTextIdxRef.current;
      const currentTexts = textsRef.current;

      // Word change detection inside render tick
      if (currentIdx !== activeTextIdx && currentTexts.length > 0) {
        activeTextIdx = currentIdx;
        const newTargets = getTargetsForText(currentTexts[activeTextIdx] || \\"\\");

        // Make sure we have enough particles
        while (particles.length < newTargets.length) {
          const rx = Math.random() * width;
          const ry = Math.random() * height;
          const size = (0.7 + Math.random() * 0.6) * particleSize;
          particles.push(new Particle(rx, ry, textColor, size, particles.length / 500));
        }

        const targetIndices = Array.from({ length: newTargets.length }, (_, i) => i);
        for (let i = targetIndices.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [targetIndices[i], targetIndices[j]] = [targetIndices[j], targetIndices[i]];
        }

        particles.forEach((p, idx) => {
          p.startX = p.x;
          p.startY = p.y;
          p.id = idx / Math.max(1, newTargets.length);

          if (idx < newTargets.length) {
            const targetIdx = targetIndices[idx];
            p.endX = newTargets[targetIdx].x;
            p.endY = newTargets[targetIdx].y;
            p.active = true;
            p.targetAlpha = 0.8 + Math.random() * 0.2;
          } else {
            p.active = false;
            p.targetAlpha = 0.15;
            const angle = p.randomOffset + Math.random() * Math.PI * 2;
            const radius = (width * 0.3) + p.randomOffset * 0.5;
            p.endX = cx + Math.cos(angle) * radius;
            p.endY = cy + Math.sin(angle) * (height * 0.4);
          }
        });

        morphProgress = 0;
        isTransitioning = true;
      }

      if (isTransitioning) {
        morphProgress += deltaTime * morphSpeed;
        if (morphProgress >= 1.0) {
          morphProgress = 1.0;
          isTransitioning = false;
        }
      }

      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = \\"lighter\\";

      const mouse = mouseRef.current;
      const eased = cubicInOut(morphProgress);
      
      const breatheStrength = Math.sin(morphProgress * Math.PI) * (fontSize * breatheIntensity);
      const autoRock = Math.sin(time * 0.7) * 0.03;

      const mouseTiltX = mouse.active ? (mouse.x - cx) / cx : 0;
      const mouseTiltY = mouse.active ? (mouse.y - cy) / cy : 0;

      const rotAngle = autoRock + mouseTiltX * 0.12;
      const cosA = Math.cos(rotAngle);
      const sinA = Math.sin(rotAngle);

      particles.forEach((p) => {
        const baseTx = p.startX + (p.endX - p.startX) * eased;
        const baseTy = p.startY + (p.endY - p.startY) * eased;

        const rx = baseTx - cx;
        const ry = baseTy - cy;
        let tx = cx + (rx * cosA - ry * sinA);
        let ty = cy + (rx * sinA + ry * cosA);

        ty = cy + (ty - cy) * (1.0 - Math.abs(mouseTiltY) * 0.15) + mouseTiltY * 8;

        if (p.active) {
          const dx = tx - cx;
          const dy = ty - cy;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          tx += (dx / dist) * breatheStrength;
          ty += (dy / dist) * breatheStrength;
        }

        p.tx = tx;
        p.ty = ty;

        p.update(
          springStiffness,
          friction,
          mouse.x,
          mouse.y,
          repelRadius,
          repelStrength,
          mouse.active && mouseRepel,
          textColor,
          time
        );
        
        p.draw(ctx);
      });

      animationId = requestAnimationFrame(tick);
    };

    animationId = requestAnimationFrame(tick);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        active: true,
      };
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const rect = canvas.getBoundingClientRect();
        mouseRef.current = {
          x: e.touches[0].clientX - rect.left,
          y: e.touches[0].clientY - rect.top,
          active: true,
        };
      }
    };

    const handleTouchEnd = () => {
      mouseRef.current.active = false;
    };

    canvas.addEventListener(\\"mousemove\\", handleMouseMove);
    canvas.addEventListener(\\"mouseleave\\", handleMouseLeave);
    canvas.addEventListener(\\"touchmove\\", handleTouchMove, { passive: true });
    canvas.addEventListener(\\"touchend\\", handleTouchEnd, { passive: true });

    return () => {
      cancelAnimationFrame(animationId);
      canvas.removeEventListener(\\"mousemove\\", handleMouseMove);
      canvas.removeEventListener(\\"mouseleave\\", handleMouseLeave);
      canvas.removeEventListener(\\"touchmove\\", handleTouchMove);
      canvas.removeEventListener(\\"touchend\\", handleTouchEnd);
    };
  }, [dims, fontSize, fontFamily, textColor, friction, springStiffness, particleSize, repelRadius, repelStrength, mouseRepel, step, morphSpeed, breatheIntensity]);

  return (
    <div
      className={\`flex flex-wrap items-center justify-center gap-x-2 gap-y-1 select-none \${containerClassName}\`}
    >
      {prefix && (
        <span
          className={\`\${prefixClassName} whitespace-nowrap\`}
          style={{ color: prefixColor }}
        >
          {prefix}
        </span>
      )}
      <canvas
        ref={canvasRef}
        style={{
          width: \`\${dims.width}px\`,
          height: \`\${dims.height}px\`,
        }}
        className={\`block cursor-default \${canvasClassName}\`}
      />
    </div>
  );
};

export default SwarmText;`;
