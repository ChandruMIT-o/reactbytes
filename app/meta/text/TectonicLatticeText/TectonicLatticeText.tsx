"use client";

import React, { useEffect, useRef } from "react";

// ==========================================
// 1. TYPES & INTERFACES
// ==========================================

interface TectonicBlock {
  x: number;
  y: number;
  ox: number;
  oy: number;
  size: number;
  railAngle: number;
  offset: number;
  velocity: number;
  letterIndex: number;
  stress: number;
}

interface LetterLayout {
  char: string;
  cx: number;
  cy: number;
}

export interface TectonicLatticeTextProps {
  text?: string;
  blockSize?: number;
  blockPadding?: number;
  influenceRadius?: number;
  pushStrength?: number;
  snapStiffness?: number;
  friction?: number;
  blockMass?: number;
  maxOffset?: number;
  skewIntensity?: number;

  // Theme Styling Matrix
  baseColor?: string;
  wireframeColor?: string;
  stressedBlockColor?: string;
  bgColor?: string;
  wireframeDash?: number[];

  // Typography Matrix
  fontFamily?: string;
  fontWeight?: string | number;
  tracking?: number;

  // Axis Quantization Mode
  railMode?: "diagonal" | "orthogonal" | "axial-x" | "axial-y" | "shattered";
  className?: string;
}

// ==========================================
// 2. CONSTANTS (VIRTUAL RESOLUTION)
// ==========================================
const V_WIDTH = 1200;
const V_HEIGHT = 300;

// ==========================================
// 3. CORE PHYSICS ENGINE COMPONENT
// ==========================================

export const TectonicLatticeText: React.FC<TectonicLatticeTextProps> = ({
  text = "STRUCT",
  blockSize = 8,
  blockPadding = 1.5,
  influenceRadius = 100,
  pushStrength = 9.0,
  snapStiffness = 0.08,
  friction = 0.82,
  blockMass = 1.0,
  maxOffset = 160,
  skewIntensity = 0.15,
  baseColor = "#ffffff",
  wireframeColor = "rgba(168, 85, 247, 0.45)",
  stressedBlockColor = "#c084fc",
  bgColor = "#070709",
  wireframeDash = [],
  fontFamily = "Space Grotesk",
  fontWeight = 900,
  tracking = 20,
  railMode = "diagonal",
  className = "",
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef({ x: -2000, y: -2000, active: false });
  const blocksRef = useRef<TectonicBlock[]>([]);
  const layoutMetaRef = useRef<LetterLayout[]>([]);
  const animationFrameId = useRef<number | null>(null);

  const widthRef = useRef(0);
  const heightRef = useRef(0);

  const settingsRef = useRef({
    influenceRadius, pushStrength, snapStiffness, friction, blockMass,
    maxOffset, skewIntensity, baseColor, wireframeColor, stressedBlockColor,
    bgColor, wireframeDash, blockSize, blockPadding
  });

  useEffect(() => {
    settingsRef.current = {
      influenceRadius, pushStrength, snapStiffness, friction, blockMass,
      maxOffset, skewIntensity, baseColor, wireframeColor, stressedBlockColor,
      bgColor, wireframeDash, blockSize, blockPadding
    };
  }, [
    influenceRadius, pushStrength, snapStiffness, friction, blockMass,
    maxOffset, skewIntensity, baseColor, wireframeColor, stressedBlockColor,
    bgColor, wireframeDash, blockSize, blockPadding
  ]);

  // Generates lattice targeting fixed virtual constraints to prevent text splits
  const generateLattice = (word: string) => {
    const offscreen = document.createElement("canvas");
    offscreen.width = V_WIDTH;
    offscreen.height = V_HEIGHT;
    const oCtx = offscreen.getContext("2d");
    if (!oCtx) return;

    let fontSize = 150; // Crisp base font size for virtual boundaries
    oCtx.font = `${fontWeight} ${fontSize}px "${fontFamily}", -apple-system, sans-serif`;

    const letters = word.split("");

    const computeTotalWidth = (fSize: number) => {
      oCtx.font = `${fontWeight} ${fSize}px "${fontFamily}", -apple-system, sans-serif`;
      let total = 0;
      letters.forEach((char) => {
        total += oCtx.measureText(char).width;
      });
      return total + tracking * (letters.length - 1);
    };

    let totalWidth = computeTotalWidth(fontSize);
    const maxAllowedWidth = V_WIDTH * 0.92; // 8% edge-safety padding

    // Automatic downscaling loop inside the virtual window
    while (totalWidth > maxAllowedWidth && fontSize > 12) {
      fontSize -= 2;
      totalWidth = computeTotalWidth(fontSize);
    }

    oCtx.font = `${fontWeight} ${fontSize}px "${fontFamily}", -apple-system, sans-serif`;
    oCtx.textAlign = "center";
    oCtx.textBaseline = "middle";

    const metrics = letters.map((char) => ({
      char,
      width: oCtx.measureText(char).width,
    }));

    let currentX = V_WIDTH / 2 - totalWidth / 2;
    const centerY = V_HEIGHT / 2;

    const blocks: TectonicBlock[] = [];
    const layoutMeta: LetterLayout[] = [];

    metrics.forEach((m, letterIdx) => {
      const charCenterX = currentX + m.width / 2;
      layoutMeta.push({ char: m.char, cx: charCenterX, cy: centerY });

      oCtx.clearRect(0, 0, V_WIDTH, V_HEIGHT);
      oCtx.fillStyle = "#ffffff";
      oCtx.fillText(m.char, charCenterX, centerY);

      const imgData = oCtx.getImageData(0, 0, V_WIDTH, V_HEIGHT);
      const data = imgData.data;

      for (let y = 0; y < V_HEIGHT; y += blockSize) {
        for (let x = 0; x < V_WIDTH; x += blockSize) {
          const sampleX = Math.floor(x + blockSize / 2);
          const sampleY = Math.floor(y + blockSize / 2);

          if (sampleX >= V_WIDTH || sampleY >= V_HEIGHT) continue;

          const alphaIdx = (sampleY * V_WIDTH + sampleX) * 4 + 3;

          if (data[alphaIdx] > 120) {
            const dx = sampleX - charCenterX;
            const dy = sampleY - centerY;
            let angle = Math.atan2(dy, dx);

            switch (railMode) {
              case "orthogonal":
                angle = Math.round(angle / (Math.PI / 2)) * (Math.PI / 2);
                break;
              case "axial-x":
                angle = Math.abs(Math.cos(angle)) > 0.707 ? (dx > 0 ? 0 : Math.PI) : (dy > 0 ? Math.PI / 2 : -Math.PI / 2);
                angle = (angle === 0 || angle === Math.PI) ? angle : (dx > 0 ? 0 : Math.PI);
                break;
              case "axial-y":
                angle = Math.abs(Math.sin(angle)) > 0.707 ? (dy > 0 ? Math.PI / 2 : -Math.PI / 2) : (dx > 0 ? 0 : Math.PI);
                angle = (angle === Math.PI / 2 || angle === -Math.PI / 2) ? angle : (dy > 0 ? Math.PI / 2 : -Math.PI / 2);
                break;
              case "shattered":
                angle = Math.sin(sampleX * 0.05) * Math.cos(sampleY * 0.05) * Math.PI * 2;
                break;
              case "diagonal":
              default:
                angle = Math.round((angle - Math.PI / 4) / (Math.PI / 2)) * (Math.PI / 2) + Math.PI / 4;
                break;
            }

            blocks.push({
              x: sampleX,
              y: sampleY,
              ox: sampleX,
              oy: sampleY,
              size: Math.max(1, blockSize - blockPadding),
              railAngle: angle,
              offset: 0,
              velocity: 0,
              letterIndex: letterIdx,
              stress: 0,
            });
          }
        }
      }
      currentX += m.width + tracking;
    });

    layoutMetaRef.current = layoutMeta;
    blocksRef.current = blocks;
  };

  // Lifecycle A: Generate lattice structure based strictly on content dependencies
  useEffect(() => {
    generateLattice(text);
  }, [text, blockSize, blockPadding, railMode, fontFamily, fontWeight, tracking]);

  // Lifecycle B: Manage element layout viewport tracking
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const parent = canvas.parentElement;
      if (parent) {
        const width = parent.clientWidth;
        // Lock aspect ratio dimensions context strictly to the virtual setup map
        const height = width * (V_HEIGHT / V_WIDTH);

        widthRef.current = width;
        heightRef.current = height;

        const dpr = window.devicePixelRatio || 1;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
      }
    };

    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  // Lifecycle C: Render Draw Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const loop = () => {
      const width = widthRef.current;
      const height = heightRef.current;

      if (width === 0 || height === 0) {
        animationFrameId.current = requestAnimationFrame(loop);
        return;
      }

      const cfg = settingsRef.current;
      const mouse = mouseRef.current;
      const blocks = blocksRef.current;

      // Clear the canvas draw layers
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.save();
      // Apply uniform scaling translation across High-DPR screens
      const dpr = window.devicePixelRatio || 1;
      ctx.scale((width / V_WIDTH) * dpr, (height / V_HEIGHT) * dpr);

      // Render backgrounds across fixed scaling boxes
      ctx.fillStyle = cfg.bgColor;
      ctx.fillRect(0, 0, V_WIDTH, V_HEIGHT);

      // Compute Physics Matrix (Evaluated natively in virtual space units)
      blocks.forEach((b) => {
        const mdx = b.x - mouse.x;
        const mdy = b.y - mouse.y;
        const mouseDist = Math.sqrt(mdx * mdx + mdy * mdy);

        if (mouse.active && mouseDist < cfg.influenceRadius) {
          const wedgeForce = ((cfg.influenceRadius - mouseDist) / cfg.influenceRadius) * cfg.pushStrength;
          const pushAngle = Math.atan2(mdy, mdx);
          const forceProj = Math.cos(pushAngle - b.railAngle);

          if (forceProj > 0) {
            b.velocity += (wedgeForce * forceProj) / Math.max(0.1, cfg.blockMass);
          }
        }

        const structuralReturn = -b.offset * cfg.snapStiffness;
        b.velocity += structuralReturn;
        b.velocity *= cfg.friction;
        b.offset += b.velocity;

        if (Math.abs(b.offset) > cfg.maxOffset) {
          b.offset = Math.sign(b.offset) * cfg.maxOffset;
          b.velocity = 0;
        }

        if (!mouse.active && Math.abs(b.offset) < 0.2 && Math.abs(b.velocity) < 0.05) {
          b.offset = 0;
          b.velocity = 0;
        }

        b.x = b.ox + Math.cos(b.railAngle) * b.offset;
        b.y = b.oy + Math.sin(b.railAngle) * b.offset;

        b.stress = Math.min(Math.abs(b.offset) / (cfg.maxOffset * 0.4), 1);
      });

      // Graphics Pass A: Wireframe Blueprints
      ctx.save();
      ctx.lineWidth = 0.8;
      ctx.strokeStyle = cfg.wireframeColor;
      if (cfg.wireframeDash.length > 0) {
        ctx.setLineDash(cfg.wireframeDash);
      }

      ctx.beginPath();
      blocks.forEach((b) => {
        if (Math.abs(b.offset) > 2) {
          ctx.moveTo(b.ox, b.oy);
          ctx.lineTo(b.x, b.y);
        }
      });
      ctx.stroke();
      ctx.restore();

      // Graphics Pass B: Matrix Plates
      blocks.forEach((b) => {
        ctx.save();
        ctx.translate(b.x, b.y);

        if (b.stress > 0.02) {
          ctx.fillStyle = cfg.stressedBlockColor;
          ctx.transform(1, b.velocity * cfg.skewIntensity, 0, 1, 0, 0);
        } else {
          ctx.fillStyle = cfg.baseColor;
        }

        ctx.fillRect(-b.size / 2, -b.size / 2, b.size, b.size);
        ctx.restore();
      });

      ctx.restore();
      animationFrameId.current = requestAnimationFrame(loop);
    };

    animationFrameId.current = requestAnimationFrame(loop);
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();

    // Normalization mapping across strict virtual coordinates bounds
    mouseRef.current = {
      x: ((e.clientX - rect.left) / rect.width) * V_WIDTH,
      y: ((e.clientY - rect.top) / rect.height) * V_HEIGHT,
      active: true,
    };
  };

  return (
    <div className="w-full flex justify-center items-center">
      <div className={`relative w-full select-none ${className}`}>
        <canvas
          ref={canvasRef}
          onPointerMove={handlePointerMove}
          onPointerLeave={() => {
            mouseRef.current.active = false;
            mouseRef.current.x = -2000;
            mouseRef.current.y = -2000;
          }}
          style={{
            width: "100%",
            height: "auto",
            aspectRatio: `${V_WIDTH} / ${V_HEIGHT}`,
            display: "block",
          }}
          className="touch-none cursor-crosshair mx-auto"
        />
      </div>
    </div>
  );
};

export default TectonicLatticeText;