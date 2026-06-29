"use client";

import React, { useState, useEffect, useRef } from "react";

export interface RibbonCarouselItem {
  id: number;
  title: string;
  subtitle: string;
  image: string;
}

export interface RibbonCarouselProps {
  /** Carousel items list. */
  items?: RibbonCarouselItem[];
  /** Scrolling sensitivity multiplier. Defaults to 0.003. */
  sensitivity?: number;
  /** Smoothness factor (0.01 to 1). Lower means smoother catch up. Defaults to 0.1. */
  damping?: number;
  /** Callback fired when active slide changes. */
  onChange?: (index: number) => void;
  /** Custom class for the root wrapper. */
  className?: string;
}

const DEFAULT_ITEMS: RibbonCarouselItem[] = [
  {
    id: 0,
    title: "Monolith Structure",
    subtitle: "Brutalist concrete architecture form",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 1,
    title: "Intersecting Planes",
    subtitle: "Minimal light study on neutral facades",
    image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 2,
    title: "Linear Perspective",
    subtitle: "Symmetry and structural rhythm",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 3,
    title: "Silent Horizon",
    subtitle: "Atmospheric geometric boundaries",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop",
  },
];

export const RibbonCarousel: React.FC<RibbonCarouselProps> = ({
  items = DEFAULT_ITEMS,
  sensitivity = 0.003,
  damping = 0.1,
  onChange,
  className = "",
}) => {
  const [progress, setProgress] = useState<number>(0);
  const targetProgress = useRef<number>(0);
  const currentProgress = useRef<number>(0);

  const itemCount = items.length;

  // Calculate looping indices safely
  const normalizedProgress = ((progress % itemCount) + itemCount) % itemCount;
  const activeIndex = Math.round(normalizedProgress) % itemCount;

  // Sync index mutations with parent callback
  const prevIndex = useRef<number>(-1);
  useEffect(() => {
    if (activeIndex !== prevIndex.current) {
      prevIndex.current = activeIndex;
      onChange?.(activeIndex);
    }
  }, [activeIndex, onChange]);

  // Premium inertia loop using requestAnimationFrame
  useEffect(() => {
    let rafId: number;

    const updatePhysics = () => {
      const diff = targetProgress.current - currentProgress.current;
      currentProgress.current += diff * damping;
      setProgress(currentProgress.current);

      rafId = requestAnimationFrame(updatePhysics);
    };

    rafId = requestAnimationFrame(updatePhysics);
    return () => cancelAnimationFrame(rafId);
  }, [damping]);

  const handleWheel = (e: React.WheelEvent) => {
    // Intercept vertical velocity and convert to timeline progression
    targetProgress.current += e.deltaY * sensitivity;
  };

  return (
    <div
      onWheel={handleWheel}
      className={`relative w-full h-[650px] bg-neutral-950 text-neutral-100 flex items-center justify-center overflow-hidden select-none font-sans ${className}`}
    >
      {/* Background Structural Guide Lines */}
      <div className="absolute inset-0 flex justify-between pointer-events-none opacity-5 px-16">
        <div className="w-px h-full bg-white" />
        <div className="w-px h-full bg-white" />
        <div className="w-px h-full bg-white" />
      </div>

      {/* Main Container Layout */}
      <div className="relative w-full max-w-5xl h-[450px] flex items-center justify-between px-12 z-10">

        {/* Left Panel: Project Index Counter */}
        <div className="flex flex-col space-y-2 w-1/4 z-30 pointer-events-none">
          <span className="text-xs tracking-[0.3em] uppercase text-neutral-500 font-medium">
            Project Index
          </span>
          <div className="h-[70px] overflow-hidden relative">
            {items.map((item, idx) => {
              const isSelected = idx === activeIndex;
              return (
                <div
                  key={`idx-${item.id}`}
                  className="absolute inset-0 text-5xl font-light transition-all duration-700 ease-out flex items-center"
                  style={{
                    transform: isSelected ? "translateY(0)" : idx < activeIndex ? "translateY(-100%)" : "translateY(100%)",
                    opacity: isSelected ? 1 : 0,
                  }}
                >
                  0{idx + 1}
                </div>
              );
            })}
          </div>
        </div>

        {/* Center Canvas Viewport: Vertical Sinuous Continuous Image Strip */}
        <div className="absolute inset-0 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[650px] pointer-events-none z-10 flex items-center justify-center">

          {/* Static Center Target Frame Box */}
          <div className="absolute w-[320px] h-[240px] border border-neutral-800 pointer-events-none z-20 mix-blend-difference opacity-30" />

          <div className="relative w-full h-full">
            {items.map((item, idx) => {
              let diff = idx - normalizedProgress;

              // Infinite wrapping calculation for seamless layout cycling
              if (diff > itemCount / 2) diff -= itemCount;
              if (diff < -itemCount / 2) diff += itemCount;

              // 1. Vertical Strip Stack Position (Height of item + margins)
              const itemHeightWithGap = 260;
              const translateY = diff * itemHeightWithGap;

              // 2. Sinuous Horizontal Wave Offset (Directly inspired by CodePen config equations)
              // Frequency: 0.006, Amplitude: 45px. When centered (diff = 0), offset is perfectly 0.
              const translateX = Math.sin(translateY * 0.006) * 45;

              // 3. Focal scaling and opacity attenuation based on distance from center
              const scale = 1 - Math.min(Math.abs(diff) * 0.1, 0.2);
              const opacity = Math.max(0.15, 1 - Math.abs(diff) * 0.7);

              return (
                <div
                  key={item.id}
                  className="absolute top-1/2 left-1/2 w-[300px] h-[220px] will-change-transform"
                  style={{
                    transform: `translate3d(calc(-50% + ${translateX}px), calc(-50% + ${translateY}px), 0) scale(${scale})`,
                    opacity: opacity,
                    zIndex: Math.round(100 - Math.abs(diff) * 10),
                  }}
                >
                  {/* Clean, Full-Coverage Card Frame */}
                  <div className="w-full h-full overflow-hidden relative bg-neutral-900 border border-neutral-800/60 shadow-xl shadow-black/40">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover filter grayscale contrast-[1.08] brightness-90"
                      draggable={false}
                    />
                    {/* Architectural Vignette Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10 pointer-events-none" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Panel: Typography & Structural Details Module */}
        <div className="flex flex-col justify-center w-1/4 h-full pl-6 space-y-3 z-30 pointer-events-none text-right items-end">
          <div className="h-[40px] overflow-hidden relative w-full">
            {items.map((item, idx) => {
              const isSelected = idx === activeIndex;
              return (
                <h3
                  key={`title-${item.id}`}
                  className="absolute inset-0 text-xl font-normal tracking-wide transition-all duration-500 ease-out flex items-center justify-end"
                  style={{
                    transform: isSelected ? "translateY(0)" : "translateY(20px)",
                    opacity: isSelected ? 1 : 0,
                  }}
                >
                  {item.title}
                </h3>
              );
            })}
          </div>

          <div className="h-[50px] overflow-hidden relative w-full">
            {items.map((item, idx) => {
              const isSelected = idx === activeIndex;
              return (
                <p
                  key={`sub-${item.id}`}
                  className="absolute inset-0 text-xs text-neutral-400 font-light leading-relaxed transition-all duration-500 delay-75 ease-out"
                  style={{
                    transform: isSelected ? "translateY(0)" : "translateY(15px)",
                    opacity: isSelected ? 0.8 : 0,
                  }}
                >
                  {item.subtitle}
                </p>
              );
            })}
          </div>
        </div>

      </div>

      {/* Bottom Timeline Progress Bar Indicator */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-[320px] h-px bg-neutral-900">
        <div
          className="h-full bg-neutral-500 transition-transform duration-150 ease-out will-change-transform origin-left"
          style={{
            transform: `scaleX(${(normalizedProgress / (itemCount - 1 || 1)) % 1.001})`,
            width: "100%"
          }}
        />
      </div>

      {/* Navigation Instruction Label */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[9px] tracking-[0.4em] uppercase text-neutral-600">
        Use Mouse Wheel to Explore Track
      </div>
    </div>
  );
};

export default RibbonCarousel;  