import React, { useEffect, useRef } from 'react';

export interface ConcentricWavesProps {
  /** Number of concentric ring layers */
  layerCount?: number;
  /** Distance between each main ring */
  ringSpacing?: number;
  /** Starting radius of the innermost ring */
  baseRadiusStart?: number;
  /** Multiplier for how fast the rings pulse inwards/outwards */
  pulseSpeedMultiplier?: number;
  /** How long it takes for the gradient to complete a 360 rotation (in ms) */
  spinDurationMs?: number;

  // --- Individual Main Gradient Colors ---
  /** First color for the main thick rings gradient (Start) */
  mainColor1?: string;
  /** Second color for the main thick rings gradient (Middle) */
  mainColor2?: string;
  /** Third color for the main thick rings gradient (End) */
  mainColor3?: string;

  // --- Individual Intermediate Gradient Colors ---
  /** First color for the intermediate thin rings gradient (Start) */
  midColor1?: string;
  /** Second color for the intermediate thin rings gradient (Middle) */
  midColor2?: string;
  /** Third color for the intermediate thin rings gradient (End) */
  midColor3?: string;

  /** Minimum opacity for the main rings during their pulse */
  minOpacity?: number;
  /** Maximum opacity for the main rings during their pulse */
  maxOpacity?: number;
  /** Thickness of the innermost main ring */
  minThickness?: number;
  /** Thickness of the outermost main ring */
  maxThickness?: number;
  /** Background color of the canvas */
  bgColor?: string;
  /** Container class name */
  className?: string;
}

export const ConcentricWaves: React.FC<ConcentricWavesProps> = ({
  layerCount = 16,
  ringSpacing = 45,
  baseRadiusStart = 40,
  pulseSpeedMultiplier = 1,
  spinDurationMs = 2500,
  mainColor1 = '#5ddcff',
  mainColor2 = '#3c67e3',
  mainColor3 = '#4e00c2',
  midColor1 = '#f3f4f6',
  midColor2 = '#9ca3af',
  midColor3 = '#374151',
  minOpacity = 0.4,
  maxOpacity = 0.9,
  minThickness = 4,
  maxThickness = 16,
  bgColor = '#05080f',
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Track layout boundaries safely across frames
  const dimensionsRef = useRef({ width: 0, height: 0 });

  // Use a ref to keep track of the latest props without restarting the animation loop
  const propsRef = useRef({
    layerCount, ringSpacing, baseRadiusStart, pulseSpeedMultiplier,
    spinDurationMs, mainColor1, mainColor2, mainColor3,
    midColor1, midColor2, midColor3, minOpacity, maxOpacity,
    minThickness, maxThickness, bgColor
  });

  // Update the ref whenever props change
  useEffect(() => {
    propsRef.current = {
      layerCount, ringSpacing, baseRadiusStart, pulseSpeedMultiplier,
      spinDurationMs, mainColor1, mainColor2, mainColor3,
      midColor1, midColor2, midColor3, minOpacity, maxOpacity,
      minThickness, maxThickness, bgColor
    };
  }, [
    layerCount, ringSpacing, baseRadiusStart, pulseSpeedMultiplier,
    spinDurationMs, mainColor1, mainColor2, mainColor3,
    midColor1, midColor2, midColor3, minOpacity, maxOpacity,
    minThickness, maxThickness, bgColor
  ]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const w = Math.floor(container.clientWidth);
      const h = Math.floor(container.clientHeight);

      dimensionsRef.current = { width: w, height: h };

      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;

      ctx.scale(dpr, dpr);
    };

    // Track parent size modifications reactively
    const resizeObserver = new ResizeObserver(() => {
      resize();
    });
    resizeObserver.observe(container);
    resize();

    // Helper to draw clean rings
    const drawCircle = (x: number, y: number, r: number, style: string | CanvasGradient, width = 1.5, alpha = 1) => {
      ctx.save();
      ctx.beginPath();
      ctx.arc(x, y, Math.max(0.1, r), 0, Math.PI * 2);
      ctx.strokeStyle = style;
      ctx.lineWidth = width;
      ctx.globalAlpha = alpha;
      ctx.stroke();
      ctx.restore();
    };

    const loop = (now: number) => {
      const { width: W, height: H } = dimensionsRef.current;

      // Skip framing if container is currently un-rendered or flat
      if (W === 0 || H === 0) {
        animationFrameId = requestAnimationFrame(loop);
        return;
      }

      const {
        layerCount: layers,
        ringSpacing,
        baseRadiusStart,
        pulseSpeedMultiplier,
        spinDurationMs,
        mainColor1,
        mainColor2,
        mainColor3,
        midColor1,
        midColor2,
        midColor3,
        minOpacity,
        maxOpacity,
        minThickness,
        maxThickness,
        bgColor
      } = propsRef.current;

      // Safe Hex / Named color parser helper for trail alpha
      const hexToRgb = (hex: string) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
        } : { r: 5, g: 8, b: 15 };
      };

      const rgb = hexToRgb(bgColor);
      ctx.fillStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.3)`;
      ctx.fillRect(0, 0, W, H);

      const t = now * 0.0015 * pulseSpeedMultiplier;
      const spinAngle = ((now % spinDurationMs) / spinDurationMs) * Math.PI * 2;

      for (let i = 0; i < layers; i++) {
        // --- MAIN THICK RINGS ---
        const baseR = baseRadiusStart + i * ringSpacing;
        const r = baseR + Math.sin(t + i * 0.4) * 20;

        const pulseWave = Math.sin(t * 2 - i * 0.2) * 0.5 + 0.5;
        const alpha = minOpacity + (pulseWave * (maxOpacity - minOpacity));
        const lineWidth = minThickness + (i / Math.max(1, layers - 1)) * (maxThickness - minThickness);

        const x0 = W / 2 - Math.cos(spinAngle) * r;
        const y0 = H / 2 - Math.sin(spinAngle) * r;
        const x1 = W / 2 + Math.cos(spinAngle) * r;
        const y1 = H / 2 + Math.sin(spinAngle) * r;

        const gradient = ctx.createLinearGradient(x0, y0, x1, y1);
        gradient.addColorStop(0, mainColor1);
        gradient.addColorStop(0.43, mainColor2);
        gradient.addColorStop(1, mainColor3);

        drawCircle(W / 2, H / 2, r, gradient, lineWidth, alpha);

        // --- INTERMEDIATE THIN RINGS ---
        if (i < layers - 1) {
          const midBaseR = baseR + (ringSpacing / 2);
          const midR = midBaseR + Math.sin(t + (i + 0.5) * 0.4) * 20;

          const midPulseWave = Math.sin(t * 2.5 - (i + 0.5) * 0.2) * 0.5 + 0.5;
          const midAlpha = midPulseWave;
          const midLineWidth = 1.5;

          const midX0 = W / 2 - Math.cos(spinAngle) * midR;
          const midY0 = H / 2 - Math.sin(spinAngle) * midR;
          const midX1 = W / 2 + Math.cos(spinAngle) * midR;
          const midY1 = H / 2 + Math.sin(spinAngle) * midR;

          const midGradient = ctx.createLinearGradient(midX0, midY0, midX1, midY1);
          midGradient.addColorStop(0, midColor1);
          midGradient.addColorStop(0.43, midColor2);
          midGradient.addColorStop(1, midColor3);

          drawCircle(W / 2, H / 2, midR, midGradient, midLineWidth, midAlpha);
        }
      }

      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);

    return () => {
      resizeObserver.disconnect();
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full overflow-hidden ${className}`}
      style={{ backgroundColor: bgColor }}
    >
      <canvas
        ref={canvasRef}
        className="block absolute inset-0 w-full h-full"
      />
    </div>
  );
};

export default ConcentricWaves;