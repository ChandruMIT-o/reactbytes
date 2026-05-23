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
  /** Tuple of 3 colors for the main thick rings */
  mainGradientColors?: [string, string, string];
  /** Tuple of 3 colors for the intermediate thin grayscale rings */
  midGradientColors?: [string, string, string];
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
  mainGradientColors = ['#5ddcff', '#3c67e3', '#4e00c2'],
  midGradientColors = ['#f3f4f6', '#9ca3af', '#374151'],
  minOpacity = 0.4,
  maxOpacity = 0.9,
  minThickness = 4,
  maxThickness = 16,
  bgColor = '#05080f',
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Use a ref to keep track of the latest props without restarting the animation loop
  const propsRef = useRef({
    layerCount, ringSpacing, baseRadiusStart, pulseSpeedMultiplier,
    spinDurationMs, mainGradientColors, midGradientColors, minOpacity,
    maxOpacity, minThickness, maxThickness, bgColor
  });

  // Update the ref whenever props change
  useEffect(() => {
    propsRef.current = {
      layerCount, ringSpacing, baseRadiusStart, pulseSpeedMultiplier,
      spinDurationMs, mainGradientColors, midGradientColors, minOpacity,
      maxOpacity, minThickness, maxThickness, bgColor
    };
  }, [
    layerCount, ringSpacing, baseRadiusStart, pulseSpeedMultiplier,
    spinDurationMs, mainGradientColors, midGradientColors, minOpacity,
    maxOpacity, minThickness, maxThickness, bgColor
  ]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let W: number;
    let H: number;

    const resize = () => {
      if (!canvas.parentElement) return;
      const dpr = window.devicePixelRatio || 1;
      W = canvas.parentElement.clientWidth;
      H = canvas.parentElement.clientHeight;
      
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
      
      ctx.scale(dpr, dpr);
    };

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
      // Destructure current props for this frame
      const { 
        layerCount: layers, 
        ringSpacing, 
        baseRadiusStart, 
        pulseSpeedMultiplier,
        spinDurationMs,
        mainGradientColors,
        midGradientColors,
        minOpacity,
        maxOpacity,
        minThickness,
        maxThickness,
        bgColor
      } = propsRef.current;

      // Draw background
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, W, H);
      
      // We apply a slight fade for motion blur effect by using rgba version of bgColor if possible,
      // but standard is just opaque clear. The original code used rgba(5, 8, 15, 0.3) for trail effect.
      // To keep it simple and configurable, we'll parse the hex and add alpha.
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

      // Central background pulse
      const t = now * 0.0015 * pulseSpeedMultiplier;
      
      // Spin cycle matching the configured duration
      const spinAngle = ((now % spinDurationMs) / spinDurationMs) * Math.PI * 2;

      for (let i = 0; i < layers; i++) {
        // --- MAIN THICK RINGS ---
        const baseR = baseRadiusStart + i * ringSpacing;
        const r = baseR + Math.sin(t + i * 0.4) * 20;
        
        // Dynamic opacity pulsing within configured bounds
        const pulseWave = Math.sin(t * 2 - i * 0.2) * 0.5 + 0.5;
        const alpha = minOpacity + (pulseWave * (maxOpacity - minOpacity)); 
        
        // Scaling width exactly from minThickness to maxThickness
        const lineWidth = minThickness + (i / Math.max(1, layers - 1)) * (maxThickness - minThickness); 
        
        // Rotating linear gradient mapped to each circle's bounds
        const x0 = W / 2 - Math.cos(spinAngle) * r;
        const y0 = H / 2 - Math.sin(spinAngle) * r;
        const x1 = W / 2 + Math.cos(spinAngle) * r;
        const y1 = H / 2 + Math.sin(spinAngle) * r;
        
        const gradient = ctx.createLinearGradient(x0, y0, x1, y1);
        gradient.addColorStop(0, mainGradientColors[0]);
        gradient.addColorStop(0.43, mainGradientColors[1]);
        gradient.addColorStop(1, mainGradientColors[2]);
        
        drawCircle(W / 2, H / 2, r, gradient, lineWidth, alpha);

        // --- INTERMEDIATE THIN RINGS ---
        if (i < layers - 1) { // Draw between this ring and the next one
          const midBaseR = baseR + (ringSpacing / 2); // Exactly halfway between rings
          const midR = midBaseR + Math.sin(t + (i + 0.5) * 0.4) * 20;
          
          // Pulsing opacity exactly from 0 to 1 (slightly faster pulse for variance)
          const midPulseWave = Math.sin(t * 2.5 - (i + 0.5) * 0.2) * 0.5 + 0.5;
          const midAlpha = midPulseWave; 
          
          const midLineWidth = 1.5; // Thinner lines stay constant
          
          const midX0 = W / 2 - Math.cos(spinAngle) * midR;
          const midY0 = H / 2 - Math.sin(spinAngle) * midR;
          const midX1 = W / 2 + Math.cos(spinAngle) * midR;
          const midY1 = H / 2 + Math.sin(spinAngle) * midR;
          
          const midGradient = ctx.createLinearGradient(midX0, midY0, midX1, midY1);
          // Tones for the intermediate rings based on props
          midGradient.addColorStop(0, midGradientColors[0]);   
          midGradient.addColorStop(0.43, midGradientColors[1]); 
          midGradient.addColorStop(1, midGradientColors[2]);    
          
          drawCircle(W / 2, H / 2, midR, midGradient, midLineWidth, midAlpha);
        }
      }

      animationFrameId = requestAnimationFrame(loop);
    };

    window.addEventListener('resize', resize);
    
    // Initial setup
    resize();
    animationFrameId = requestAnimationFrame(loop);

    // Cleanup
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`} style={{ backgroundColor: bgColor }}>
      <canvas 
        ref={canvasRef} 
        className="block absolute inset-0 w-full h-full"
      />
    </div>
  );
};

export default ConcentricWaves;
