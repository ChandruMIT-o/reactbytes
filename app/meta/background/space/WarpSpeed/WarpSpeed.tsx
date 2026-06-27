"use client";

import React, { useEffect, useRef } from "react";

export interface WarpSpeedProps {
  /** Number of stars in the field. Defaults to 400. */
  starCount?: number;
  /** Scroll velocity multiplier. Defaults to 0.8. */
  sensitivity?: number;
  /** Friction/decay coefficient. Defaults to 0.95. */
  friction?: number;
  /** Energy/trail color HSL hue shift (0-360). Defaults to 216. */
  hueShift?: number;
  /** Trail blur/length multiplier. Defaults to 1.0. */
  trailLength?: number;
  /** Minimum star size in pixels. Defaults to 0.5. */
  minSize?: number;
  /** Maximum star size in pixels. Defaults to 3.0. */
  maxSize?: number;
  /** Whether to draw the ship in the center. Defaults to true. */
  showShip?: boolean;
  /** Whether to display the pulsing scroll mouse helper hint. Defaults to true. */
  showMouseHint?: boolean;
  /** Whether scroll wheel events prevent parent page scrolling. Defaults to false. */
  preventPageScroll?: boolean;
  /** Optional custom styling classes for wrapper div. */
  className?: string;
  /** Overlay children content. */
  children?: React.ReactNode;
}

interface Vector2D {
  x: number;
  y: number;
}

interface Star {
  pos: Vector2D;
  vel: Vector2D;
  acc: Vector2D;
  size: number;
  alpha: number;
}

const constrain = (n: number, low: number, high: number) => Math.max(Math.min(n, high), low);

export const WarpSpeed: React.FC<WarpSpeedProps> = ({
  starCount = 400,
  sensitivity = 0.8,
  friction = 0.95,
  hueShift = 216,
  trailLength = 1.0,
  minSize = 0.5,
  maxSize = 3.0,
  showShip = true,
  preventPageScroll = false,
  className = "",
  children,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Mutable refs to prevent animation loops restarting on prop updates
  const configRef = useRef({ starCount, sensitivity, friction, hueShift, trailLength, minSize, maxSize });
  useEffect(() => {
    configRef.current = { starCount, sensitivity, friction, hueShift, trailLength, minSize, maxSize };
  }, [starCount, sensitivity, friction, hueShift, trailLength, minSize, maxSize]);

  const starsRef = useRef<Star[]>([]);
  const scrollStateRef = useRef({
    vel: { x: 0, y: 0 },
    target: { x: 0, y: 0 }
  });
  const dimRef = useRef({ w: 700, h: 400 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let lastTime = performance.now();
    let vibratingAngle = 0;

    const initStars = (count: number): Star[] => {
      const cw = dimRef.current.w;
      const ch = dimRef.current.h;
      const { minSize: currentMin, maxSize: currentMax } = configRef.current;
      return Array.from({ length: count }).map(() => ({
        pos: {
          x: (Math.random() * 3 - 1) * cw,
          y: (Math.random() * 3 - 1) * ch
        },
        vel: { x: 0, y: 0 },
        acc: { x: 0, y: 0 },
        size: Math.random() * (currentMax - currentMin) + currentMin,
        alpha: Math.random() * 0.8 + 0.2
      }));
    };

    starsRef.current = initStars(configRef.current.starCount);

    const render = (time: number) => {
      const deltaTime = time - lastTime;
      lastTime = time;

      const cw = canvas.width;
      const ch = canvas.height;
      const cx = cw / 2;
      const cy = ch / 2;

      // Handle on-the-fly resizing/visibility changes
      const dpr = window.devicePixelRatio || 1;
      const expectedWidth = Math.floor(canvas.clientWidth * dpr);
      const expectedHeight = Math.floor(canvas.clientHeight * dpr);
      if (canvas.width !== expectedWidth || canvas.height !== expectedHeight) {
        canvas.width = expectedWidth;
        canvas.height = expectedHeight;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        dimRef.current = { w: canvas.clientWidth, h: canvas.clientHeight };
        // Respawn/refresh stars to match new aspect ratios
        starsRef.current = initStars(configRef.current.starCount);
      }

      const { vel, target } = scrollStateRef.current;
      const currentConfig = configRef.current;

      // Sync star count dynamically
      if (starsRef.current.length < currentConfig.starCount) {
        starsRef.current.push(...initStars(currentConfig.starCount - starsRef.current.length));
      } else if (starsRef.current.length > currentConfig.starCount) {
        starsRef.current.length = currentConfig.starCount;
      }

      // Smooth scroll interpolation
      vel.x += (target.x - vel.x) * 0.1;
      vel.y += (target.y - vel.y) * 0.1;

      // Apply friction
      target.x *= currentConfig.friction;
      target.y *= currentConfig.friction;

      // Cap target magnitude
      const targetMag = Math.sqrt(target.x ** 2 + target.y ** 2);
      if (targetMag > 400) {
        target.x = (target.x / targetMag) * 400;
        target.y = (target.y / targetMag) * 400;
      }

      const cdx = vel.x;
      const cdy = vel.y;
      const mag = Math.sqrt(cdx * cdx + cdy * cdy);
      const heading = Math.atan2(cdy, cdx);

      const nx = mag === 0 ? 0 : cdx / mag;
      const ny = mag === 0 ? 0 : cdy / mag;

      const w = constrain(0.309 * mag + 1, 3, 100);
      const baseOpacity = constrain(-2.214 * (mag - 185) + 30, 30, 120);
      const trailOpacity = constrain(baseOpacity / currentConfig.trailLength, 10, 255);

      // Motion blur trail background
      ctx.fillStyle = `rgba(0, 0, 0, ${trailOpacity / 255})`;
      ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);

      const forceX = (cdx * 10 * deltaTime) / 1000;
      const forceY = (cdy * 10 * deltaTime) / 1000;

      const vibratingShip = constrain(0.03225 * (mag - 185) + 5, 0, 3);
      const shipColor = `hsl(${currentConfig.hueShift}, 90%, 80%)`;

      // Draw stars
      starsRef.current.forEach(star => {
        const depthFactor = star.size / currentConfig.maxSize;
        star.acc.x = forceX * (0.5 + 0.5 * depthFactor);
        star.acc.y = forceY * (0.5 + 0.5 * depthFactor);

        star.vel.x += star.acc.x;
        star.vel.y += star.acc.y;
        star.pos.x += star.vel.x;
        star.pos.y += star.vel.y;

        star.vel.x /= 3;
        star.vel.y /= 3;

        ctx.save();
        ctx.translate(star.pos.x + w / 2, star.pos.y + (star.size / 2));
        ctx.rotate(heading);
        ctx.fillStyle = `hsla(${currentConfig.hueShift}, 100%, 60%, ${star.alpha})`;

        const starLength = Math.max(w * depthFactor, star.size);
        ctx.fillRect(-(starLength / 2), -(star.size / 2), starLength, star.size);
        ctx.restore();

        // Wrap around boundaries
        const renderWidth = canvas.clientWidth;
        const renderHeight = canvas.clientHeight;
        if (star.pos.x < -renderWidth || star.pos.x > renderWidth * 2 || star.pos.y < -renderHeight || star.pos.y > renderHeight * 2) {
          star.pos.x = (Math.random() * (renderWidth * 1.5)) - (renderWidth * 1.5 * nx);
          star.pos.y = (Math.random() * (renderHeight * 1.5)) - (renderHeight * 1.5 * ny);
          star.size = Math.random() * (currentConfig.maxSize - currentConfig.minSize) + currentConfig.minSize;
          star.alpha = Math.random() * 0.8 + 0.2;
        }
      });

      // Draw Ship
      if (showShip) {
        vibratingAngle += 0.2;
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(heading);

        const vibRes = Math.sin(vibratingAngle) * vibratingShip;

        ctx.fillStyle = shipColor;
        ctx.beginPath();
        ctx.moveTo(-15 + vibRes, 0);
        ctx.lineTo(15 + vibRes, -9);
        ctx.lineTo(15 + vibRes, 9);
        ctx.closePath();
        ctx.fill();

        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationFrameId);
  }, [showShip]);

  // Handle Wheel Scroll Event
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (preventPageScroll) {
        e.preventDefault();
      }
      const sense = configRef.current.sensitivity;
      scrollStateRef.current.target.x -= e.deltaX * sense;
      scrollStateRef.current.target.y -= e.deltaY * sense;
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("wheel", handleWheel, { passive: !preventPageScroll });
    }
    return () => container?.removeEventListener("wheel", handleWheel);
  }, [preventPageScroll]);

  // Handle Resize Event for Aspect Ratio Dim Synchronization
  useEffect(() => {
    const handleResize = () => {
      if (!containerRef.current || !canvasRef.current) return;
      const { clientWidth, clientHeight } = containerRef.current;
      canvasRef.current.width = clientWidth;
      canvasRef.current.height = clientHeight;
      dimRef.current = { w: clientWidth, h: clientHeight };
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const hasHeight = className.includes("h-") || className.includes("min-h-");

  return (
    <div
      ref={containerRef}
      className={`relative isolate w-full overflow-hidden select-none bg-black text-white ${hasHeight ? "" : "h-full"} ${className}`}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 block w-full h-full pointer-events-none"
      />

      {children && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none">
          {children}
        </div>
      )}
    </div>
  );
};

export default WarpSpeed;
