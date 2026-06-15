"use client";

import React, { useState, useEffect, useRef } from "react";

// Declaration for D3 script injection
declare global {
  interface Window {
    d3: any;
  }
}

// Constants & Theme Presets (Flat monochrome palettes)
export const COLOR_PALETTES = {
  monochromeDark: {
    name: "Noir Slate",
    faces: ["#0f172a", "#1e293b", "#334155", "#475569", "#64748b", "#020617"],
    sclera: "#ffffff",
    pupil: "#09090b",
    bg: "#020205",
    accent: "#ffffff",
  },
  monochromeLight: {
    name: "Ghostly Silver",
    faces: ["#f8fafc", "#f1f5f9", "#e2e8f0", "#cbd5e1", "#94a3b8", "#cccccc"],
    sclera: "#0f172a",
    pupil: "#ffffff",
    bg: "#f8fafc",
    accent: "#000000",
  },
  monochromeMixed: {
    name: "High Contrast Grey",
    faces: ["#111111", "#444444", "#777777", "#aaaaaa", "#dddddd", "#ffffff"],
    sclera: "#fcfcfc",
    pupil: "#000000",
    bg: "#18181b",
    accent: "#a1a1aa",
  },
};

interface EyeNode {
  x: number;
  y: number;
  r: number;
  origR: number;
  faceColor: string;
  scleraColor: string;
  pupilColor: string;
  
  // Spring Pupil variables
  px: number;      // pupil relative X
  py: number;      // pupil relative Y
  pvx: number;     // pupil velocity X
  pvy: number;     // pupil velocity Y
  
  // Blink states
  blinkFactor: number; // 0 = closed, 1 = open
  blinkState: "open" | "closing" | "closed" | "opening";
  blinkTimer: number;
  nextBlinkTime: number;
}

export interface EyeMatrixProps {
  eyeCount?: number;
  padding?: number;
  minRadius?: number;
  maxRadius?: number;
  paletteKey?: keyof typeof COLOR_PALETTES;
  customBg?: string;
  scleraScale?: number;
  pupilScale?: number;
  pupilStyle?: "normal" | "cat" | "sparkle" | "ring";
  physicsStiffness?: number;
  physicsDamping?: number;
  blinkingEnabled?: boolean;
  blinkRate?: number;
  interactiveMode?: "mouse" | "wander" | "vortex";
  flatBorderEnabled?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export const EyeMatrix: React.FC<EyeMatrixProps> = ({
  eyeCount = 180,
  padding = 4,
  minRadius = 12,
  maxRadius = 65,
  paletteKey = "monochromeDark",
  customBg = "",
  scleraScale = 0.65,
  pupilScale = 0.45,
  pupilStyle = "normal",
  physicsStiffness = 0.12,
  physicsDamping = 0.78,
  blinkingEnabled = true,
  blinkRate = 0.015,
  interactiveMode = "mouse",
  flatBorderEnabled = true,
  className = "",
  children,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [d3Loaded, setD3Loaded] = useState<boolean>(false);

  // Internals
  const mouseRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const wanderAngleRef = useRef<number>(0);
  const wanderTargetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const eyesRef = useRef<EyeNode[]>([]);
  const requestRef = useRef<number>(0);

  // Sync params in ref to avoid re-triggering packers/Three set ups on state change
  const paramsRef = useRef({
    scleraScale,
    pupilScale,
    pupilStyle,
    physicsStiffness,
    physicsDamping,
    blinkingEnabled,
    blinkRate,
    interactiveMode,
    flatBorderEnabled,
    paletteKey,
    customBg,
  });

  useEffect(() => {
    paramsRef.current = {
      scleraScale,
      pupilScale,
      pupilStyle,
      physicsStiffness,
      physicsDamping,
      blinkingEnabled,
      blinkRate,
      interactiveMode,
      flatBorderEnabled,
      paletteKey,
      customBg,
    };
  }, [
    scleraScale,
    pupilScale,
    pupilStyle,
    physicsStiffness,
    physicsDamping,
    blinkingEnabled,
    blinkRate,
    interactiveMode,
    flatBorderEnabled,
    paletteKey,
    customBg,
  ]);

  // Dynamically inject D3 safely
  useEffect(() => {
    if (window.d3) {
      setD3Loaded(true);
      return;
    }
    let script = document.querySelector('script[src="https://d3js.org/d3.v6.min.js"]') as HTMLScriptElement;
    if (!script) {
      script = document.createElement("script");
      script.src = "https://d3js.org/d3.v6.min.js";
      script.async = true;
      script.onload = () => setD3Loaded(true);
      document.body.appendChild(script);
    } else {
      if (window.d3) {
        setD3Loaded(true);
      } else {
        const handleLoad = () => setD3Loaded(true);
        script.addEventListener("load", handleLoad);
        return () => script.removeEventListener("load", handleLoad);
      }
    }
  }, []);

  // Pack circles when layout parameters change
  useEffect(() => {
    if (!d3Loaded) return;
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;
    const d3 = window.d3;
    if (!d3) return;

    const currentPalette = COLOR_PALETTES[paletteKey];

    // D3 packing setup
    const random = d3.randomUniform(minRadius + padding, maxRadius + padding);
    const radii = d3.range(eyeCount).map(random);
    
    const packedCircles = d3.packSiblings(radii.map((r: number) => ({ r })));
    
    // Shift packing center coordinates to middle of viewport
    const newEyes: EyeNode[] = packedCircles.map((circle: any, index: number) => {
      const radius = circle.r - padding;
      return {
        x: circle.x + width / 2,
        y: circle.y + height / 2,
        r: radius,
        origR: radius,
        faceColor: currentPalette.faces[index % currentPalette.faces.length],
        scleraColor: currentPalette.sclera,
        pupilColor: currentPalette.pupil,
        px: 0,
        py: 0,
        pvx: 0,
        pvy: 0,
        blinkFactor: 1.0,
        blinkState: "open",
        blinkTimer: 0,
        nextBlinkTime: Math.random() * 500 + 100,
      };
    });

    eyesRef.current = newEyes;
  }, [d3Loaded, eyeCount, padding, minRadius, maxRadius, paletteKey]);

  // Handle window and container resizing
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas || !container) return;
      
      const prevWidth = canvas.width;
      const prevHeight = canvas.height;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      
      if (newWidth === 0 || newHeight === 0) return;
      
      canvas.width = newWidth;
      canvas.height = newHeight;

      // Translate existing eye circles relative to the new center
      const dx = (newWidth - prevWidth) / 2;
      const dy = (newHeight - prevHeight) / 2;
      
      if (eyesRef.current.length > 0 && prevWidth > 0 && prevHeight > 0) {
        eyesRef.current.forEach((eye) => {
          eye.x += dx;
          eye.y += dy;
        });
      }
    };

    const resizeObserver = new ResizeObserver(() => handleResize());
    resizeObserver.observe(container);
    handleResize();

    // Set initial mouse at center
    mouseRef.current = { x: container.clientWidth / 2, y: container.clientHeight / 2 };
    wanderTargetRef.current = { x: container.clientWidth / 2, y: container.clientHeight / 2 };

    return () => {
      resizeObserver.disconnect();
    };
  }, [d3Loaded]);

  // Physics, wander simulation & render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let frameCount = 0;

    const renderLoop = () => {
      frameCount++;
      const currentPalette = COLOR_PALETTES[paramsRef.current.paletteKey];
      const bgToUse = paramsRef.current.customBg || currentPalette.bg;

      // 1. Clear background
      ctx.fillStyle = bgToUse;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Determine active target coordinates
      let targetX = mouseRef.current.x;
      let targetY = mouseRef.current.y;

      if (paramsRef.current.interactiveMode === "wander") {
        // Organic wander target movement
        wanderAngleRef.current += 0.02;
        wanderTargetRef.current.x =
          canvas.width / 2 +
          Math.sin(wanderAngleRef.current * 1.3) * (canvas.width * 0.3) +
          Math.cos(wanderAngleRef.current * 0.4) * 80;
        wanderTargetRef.current.y =
          canvas.height / 2 +
          Math.cos(wanderAngleRef.current * 0.9) * (canvas.height * 0.35) +
          Math.sin(wanderAngleRef.current * 0.5) * 80;
        targetX = wanderTargetRef.current.x;
        targetY = wanderTargetRef.current.y;

        // Draw guide indicator
        ctx.beginPath();
        ctx.arc(targetX, targetY, 4, 0, Math.PI * 2);
        ctx.fillStyle = currentPalette.accent;
        ctx.fill();
      } else if (paramsRef.current.interactiveMode === "vortex") {
        // Rotating swirl target tracker
        const angle = frameCount * 0.015;
        targetX = canvas.width / 2 + Math.cos(angle) * (canvas.height * 0.25);
        targetY = canvas.height / 2 + Math.sin(angle) * (canvas.height * 0.25);
      }

      // Update and draw each eye
      eyesRef.current.forEach((eye) => {
        // A. Blinking Logic
        if (paramsRef.current.blinkingEnabled) {
          if (eye.blinkState === "open") {
            if (Math.random() < paramsRef.current.blinkRate) {
              eye.blinkState = "closing";
            }
          } else if (eye.blinkState === "closing") {
            eye.blinkFactor -= 0.15;
            if (eye.blinkFactor <= 0) {
              eye.blinkFactor = 0;
              eye.blinkState = "closed";
              eye.blinkTimer = Math.floor(Math.random() * 15 + 5);
            }
          } else if (eye.blinkState === "closed") {
            eye.blinkTimer--;
            if (eye.blinkTimer <= 0) {
              eye.blinkState = "opening";
            }
          } else if (eye.blinkState === "opening") {
            eye.blinkFactor += 0.15;
            if (eye.blinkFactor >= 1.0) {
              eye.blinkFactor = 1.0;
              eye.blinkState = "open";
            }
          }
        } else {
          eye.blinkFactor = 1.0;
          eye.blinkState = "open";
        }

        // B. Target pupil calculation
        const dx = targetX - eye.x;
        const dy = targetY - eye.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Pupil travel limit
        const outerScleraR = eye.r * paramsRef.current.scleraScale;
        const activePupilR = outerScleraR * paramsRef.current.pupilScale;
        const maxPupilOffset = Math.max(0, outerScleraR - activePupilR - 1);

        let targetPx = 0;
        let targetPy = 0;

        if (distance > 0.1) {
          const lookRatio = Math.min(distance / (eye.r * 2), 1.0);
          const offsetDist = lookRatio * maxPupilOffset;
          targetPx = (dx / distance) * offsetDist;
          targetPy = (dy / distance) * offsetDist;
        }

        // C. Spring Physics integration
        const forceX = (targetPx - eye.px) * paramsRef.current.physicsStiffness;
        const forceY = (targetPy - eye.py) * paramsRef.current.physicsStiffness;
        
        eye.pvx = (eye.pvx + forceX) * paramsRef.current.physicsDamping;
        eye.pvy = (eye.pvy + forceY) * paramsRef.current.physicsDamping;
        
        eye.px += eye.pvx;
        eye.py += eye.pvy;

        // D. Canvas Rendering
        ctx.save();
        ctx.translate(eye.x, eye.y);

        // 1. Face body
        ctx.beginPath();
        ctx.arc(0, 0, eye.r, 0, Math.PI * 2);
        ctx.fillStyle = eye.faceColor;
        ctx.fill();

        if (paramsRef.current.flatBorderEnabled) {
          ctx.strokeStyle =
            paramsRef.current.paletteKey === "monochromeLight"
              ? "rgba(0, 0, 0, 0.15)"
              : "rgba(255, 255, 255, 0.08)";
          ctx.lineWidth = 1;
          ctx.stroke();
        }

        // 2. Sclera
        if (eye.blinkFactor > 0.05) {
          ctx.save();
          
          ctx.beginPath();
          ctx.ellipse(0, 0, outerScleraR, outerScleraR * eye.blinkFactor, 0, 0, Math.PI * 2);
          ctx.fillStyle = eye.scleraColor;
          ctx.fill();
          
          ctx.strokeStyle =
            paramsRef.current.paletteKey === "monochromeLight"
              ? "rgba(0, 0, 0, 0.2)"
              : "rgba(255, 255, 255, 0.15)";
          ctx.lineWidth = 1.2;
          ctx.stroke();

          ctx.clip();

          // 3. Pupil
          ctx.beginPath();
          const pX = eye.px;
          const pY = eye.py * eye.blinkFactor;

          if (paramsRef.current.pupilStyle === "cat") {
            ctx.ellipse(pX, pY, activePupilR * 0.4, activePupilR * eye.blinkFactor, 0, 0, Math.PI * 2);
          } else if (paramsRef.current.pupilStyle === "ring") {
            ctx.arc(pX, pY, activePupilR, 0, Math.PI * 2);
            ctx.lineWidth = activePupilR * 0.4;
            ctx.strokeStyle = eye.pupilColor;
            ctx.stroke();
          } else if (paramsRef.current.pupilStyle === "sparkle") {
            ctx.moveTo(pX, pY - activePupilR);
            ctx.quadraticCurveTo(pX, pY, pX + activePupilR, pY);
            ctx.quadraticCurveTo(pX, pY, pX, pY + activePupilR);
            ctx.quadraticCurveTo(pX, pY, pX - activePupilR, pY);
            ctx.quadraticCurveTo(pX, pY, pX, pY - activePupilR);
            ctx.closePath();
          } else {
            ctx.arc(pX, pY, activePupilR, 0, Math.PI * 2);
          }

          if (paramsRef.current.pupilStyle !== "ring") {
            ctx.fillStyle = eye.pupilColor;
            ctx.fill();
          }

          // 4. Highlight reflection
          if (paramsRef.current.pupilStyle !== "ring") {
            ctx.beginPath();
            ctx.arc(pX - activePupilR * 0.35, pY - activePupilR * 0.35, activePupilR * 0.25, 0, Math.PI * 2);
            ctx.fillStyle =
              paramsRef.current.paletteKey === "monochromeLight"
                ? "rgba(0, 0, 0, 0.4)"
                : "rgba(255, 255, 255, 0.9)";
            ctx.fill();
          }

          ctx.restore();
        } else {
          // Closed eyelid crease
          ctx.beginPath();
          ctx.moveTo(-outerScleraR, 0);
          ctx.quadraticCurveTo(0, outerScleraR * 0.25, outerScleraR, 0);
          ctx.strokeStyle =
            paramsRef.current.paletteKey === "monochromeLight"
              ? "rgba(0, 0, 0, 0.6)"
              : "rgba(255, 255, 255, 0.4)";
          ctx.lineWidth = 2;
          ctx.stroke();
        }

        ctx.restore();
      });

      requestRef.current = requestAnimationFrame(renderLoop);
    };

    renderLoop();

    return () => {
      cancelAnimationFrame(requestRef.current);
    };
  }, []);

  // Pointer movement capture
  const handlePointerMove = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    mouseRef.current = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  };

  const hasHeight = className.includes("h-") || className.includes("height-");

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden w-full ${hasHeight ? "" : "h-full"} ${className}`}
    >
      <canvas
        ref={canvasRef}
        onPointerMove={handlePointerMove}
        className="absolute inset-0 block w-full h-full touch-none"
      />

      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none">
        {children}
      </div>
    </div>
  );
};

export default EyeMatrix;
