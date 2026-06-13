export const loaderProps = [
  {
    title: "Core Props",
    props: [
      {
        name: "items",
        type: "RotaryCarouselItem[]",
        defaultValue: "DEFAULT_ITEMS",
        description: "Array of items. Each item must have id, title, and image url.",
      },
      {
        name: "springTension",
        type: "number",
        defaultValue: "0.24",
        description: "Snappy mechanical spring tension coefficient (0.05 to 0.50).",
      },
      {
        name: "springDamping",
        type: "number",
        defaultValue: "0.38",
        description: "Snap settlement dampening friction coefficient (0.10 to 0.70).",
      },
      {
        name: "ringDiameter",
        type: "number",
        defaultValue: "360",
        description: "Diameter of the carousel dial inside the visualizer ring.",
      },
    ],
  },
  {
    title: "Visualizer Props",
    props: [
      {
        name: "visualizerLines",
        type: "number",
        defaultValue: "240",
        description: "Density of visualizer radial line bars (number of bars plotted).",
      },
      {
        name: "visualizerAmp",
        type: "number",
        defaultValue: "1.2",
        description: "Amplitude multiplier of the visualizer bars.",
      },
      {
        name: "visualizerSpread",
        type: "number",
        defaultValue: "1.5",
        description: "Angular glow flare spread of visualizer bars around tracker handle.",
      },
      {
        name: "waveMode",
        type: "'surge' | 'ambient' | 'silent'",
        defaultValue: "'surge'",
        description: "Visualizer logic mode that drives the heights calculation formula.",
      },
      {
        name: "secondaryColor",
        type: "string",
        defaultValue: "'#3b82f6'",
        description: "Primary visualizer HSL/RGB glow color.",
      },
      {
        name: "bgSolidColor",
        type: "string",
        defaultValue: "'#05020a'",
        description: "Dial core solid background mask color.",
      },
    ],
  },
  {
    title: "Behavioral Props",
    props: [
      {
        name: "autoPlaySpeed",
        type: "number",
        defaultValue: "12",
        description: "Progression rotation ticks per frame during idle autoplay.",
      },
      {
        name: "isPlaying",
        type: "boolean",
        defaultValue: "false",
        description: "Whether the dial carousel autoplays when idle.",
      },
      {
        name: "enableSynth",
        type: "boolean",
        defaultValue: "false",
        description: "Whether the interactive FM tone synthesizer is enabled on dial jog.",
      },
      {
        name: "onChange",
        type: "(index: number) => void",
        defaultValue: "undefined",
        description: "Callback function fired whenever the dial snaps to a new active index.",
      },
    ],
  },
];

export const componentCode = `"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { Volume2, VolumeX } from "lucide-react";

export interface RotaryCarouselItem {
  id: number;
  title: string;
  image: string;
}

export interface RotaryCarouselProps {
  /** Carousel items list. */
  items?: RotaryCarouselItem[];
  /** Spring physics tension/snappiness (0.05 - 0.5). Defaults to 0.24. */
  springTension?: number;
  /** Spring physics dampening (0.1 - 0.7). Defaults to 0.38. */
  springDamping?: number;
  /** Diameter of the circular dial in pixels. Defaults to 360. */
  ringDiameter?: number;
  /** Number of radial lines in visualizer. Defaults to 240. */
  visualizerLines?: number;
  /** Visualizer amplitude multiplier. Defaults to 1.2. */
  visualizerAmp?: number;
  /** Visualizer spread factor. Defaults to 1.5. */
  visualizerSpread?: number;
  /** Idle autoplay speed (ticks per frame). Defaults to 12. */
  autoPlaySpeed?: number;
  /** Whether the carousel is actively autoplaying. Defaults to false. */
  isPlaying?: boolean;
  /** Visualizer height formula mode. Defaults to 'surge'. */
  waveMode?: "surge" | "ambient" | "silent";
  /** Primary glow/visualizer color (hex/hsl). Defaults to "#3b82f6". */
  secondaryColor?: string;
  /** Dial core bezel background solid color. Defaults to "#05020a". */
  bgSolidColor?: string;
  /** Whether to enable sound synthesizer on rotational velocity. Defaults to false. */
  enableSynth?: boolean;
  /** Callback fired when the active item index snaps or changes. */
  onChange?: (index: number) => void;
  /** Optional custom CSS classes for the container. */
  className?: string;
}

const DEFAULT_ITEMS: RotaryCarouselItem[] = [
  {
    id: 0,
    title: "Automated Assembly Bay",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 1,
    title: "Liquid Cryo Server Cluster",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 2,
    title: "Magnetic Power Containment",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 3,
    title: "Redundant Archive Hub",
    image: "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?q=80&w=800&auto=format&fit=crop",
  }
];

export const RotaryCarousel: React.FC<RotaryCarouselProps> = ({
  items = DEFAULT_ITEMS,
  springTension = 0.24,
  springDamping = 0.38,
  ringDiameter = 360,
  visualizerLines = 240,
  visualizerAmp = 1.2,
  visualizerSpread = 1.5,
  autoPlaySpeed = 12,
  isPlaying = false,
  waveMode = "surge",
  secondaryColor = "#3b82f6",
  bgSolidColor = "#05020a",
  enableSynth = false,
  onChange,
  className = "",
}) => {
  const [audioEnabled, setAudioEnabled] = useState(false);

  // Carousel physics calculations
  const [progress, setProgress] = useState<number>(0);
  const targetProgress = useRef<number>(0);
  const [dragActive, setDragActive] = useState(false);
  const [velocity, setVelocity] = useState<number>(0);

  // References for rotational tracking
  const centralDialRef = useRef<HTMLDivElement>(null);
  const dragStartAngle = useRef<number>(0);
  const dragStartProgress = useRef<number>(0);
  const lastAngle = useRef<number>(0);

  // Sound Synthesizer Node Configuration
  const audioCtxRef = useRef<AudioContext | null>(null);
  const synthNodes = useRef<{
    osc: OscillatorNode | null;
    filter: BiquadFilterNode | null;
    gain: GainNode | null;
  }>({ osc: null, filter: null, gain: null });

  const itemCount = items.length;
  const activeIndex = Math.round(progress) % itemCount;
  const normalizedIndex = ((progress % itemCount) + itemCount) % itemCount;

  // Fire onChange on snapping
  const prevActiveIndex = useRef<number>(-1);
  useEffect(() => {
    const rounded = ((activeIndex % itemCount) + itemCount) % itemCount;
    if (rounded !== prevActiveIndex.current) {
      prevActiveIndex.current = rounded;
      onChange?.(rounded);
    }
  }, [activeIndex, itemCount, onChange]);

  const initAudio = () => {
    if (!enableSynth || audioCtxRef.current) return;
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextClass();
      audioCtxRef.current = ctx;

      const osc = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();

      osc.type = "triangle";
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(320, ctx.currentTime);
      filter.Q.setValueAtTime(2.5, ctx.currentTime);

      gain.gain.setValueAtTime(0.0, ctx.currentTime);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start();

      synthNodes.current = { osc, filter, gain };
      setAudioEnabled(true);
    } catch (e) {
      console.warn("Could not load Audio Context:", e);
    }
  };

  const toggleAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!audioCtxRef.current) {
      initAudio();
    } else {
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") {
        ctx.resume();
        setAudioEnabled(true);
      } else if (ctx.state === "running") {
        ctx.suspend();
        setAudioEnabled(false);
      }
    }
  };

  // Sync synthesizer state with rotation velocity
  useEffect(() => {
    if (!audioCtxRef.current || !audioEnabled) return;
    const ctx = audioCtxRef.current;
    const { osc, filter, gain } = synthNodes.current;
    if (!osc || !filter || !gain) return;

    const absVel = Math.abs(velocity);
    const baseFreq = 120 + (normalizedIndex * 40);
    const sweep = absVel * 2200;

    osc.frequency.setTargetAtTime(baseFreq, ctx.currentTime, 0.12);
    filter.frequency.setTargetAtTime(
      Math.max(140, Math.min(2800, 320 + sweep)),
      ctx.currentTime,
      0.06
    );

    const targetVol = isPlaying ? 0.03 : Math.min(0.08, 0.002 + absVel * 0.55);
    gain.gain.setTargetAtTime(targetVol, ctx.currentTime, 0.08);
  }, [velocity, normalizedIndex, audioEnabled, isPlaying]);

  // Physics loop
  useEffect(() => {
    let animationFrameId: number;
    let currentVelocity = 0;

    const tick = () => {
      // Autoplay progression incremental offset
      if (isPlaying && !dragActive) {
        targetProgress.current += (autoPlaySpeed / 1200);
      }

      // Snappy spring force calculation
      const displacement = targetProgress.current - progress;
      const springForce = displacement * springTension;

      // Update velocity with the dynamic spring dampener physics
      currentVelocity = (currentVelocity + springForce) * (1 - springDamping);

      const nextProgress = progress + currentVelocity;

      setVelocity(currentVelocity);
      setProgress(nextProgress);

      animationFrameId = requestAnimationFrame(tick);
    };

    animationFrameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animationFrameId);
  }, [progress, dragActive, isPlaying, autoPlaySpeed, springTension, springDamping]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!centralDialRef.current) return;
    if (enableSynth) initAudio();

    const rect = centralDialRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX);

    setDragActive(true);
    dragStartAngle.current = angle;
    lastAngle.current = angle;
    dragStartProgress.current = targetProgress.current;
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!dragActive || !centralDialRef.current) return;

    const rect = centralDialRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const currentAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX);

    let angleDelta = currentAngle - lastAngle.current;
    if (angleDelta > Math.PI) angleDelta -= 2 * Math.PI;
    if (angleDelta < -Math.PI) angleDelta += 2 * Math.PI;

    // Map circular travel delta straight to progress nodes indices
    const segmentRatio = (2 * Math.PI) / itemCount;
    const progressionDelta = angleDelta / segmentRatio;

    targetProgress.current = targetProgress.current + progressionDelta;
    lastAngle.current = currentAngle;
  };

  const handleMouseUp = () => setDragActive(false);

  useEffect(() => {
    if (dragActive) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragActive]);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!centralDialRef.current || e.touches.length === 0) return;
    if (enableSynth) initAudio();

    const rect = centralDialRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const touch = e.touches[0];
    const angle = Math.atan2(touch.clientY - centerY, touch.clientX - centerX);

    setDragActive(true);
    dragStartAngle.current = angle;
    lastAngle.current = angle;
    dragStartProgress.current = targetProgress.current;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!dragActive || !centralDialRef.current || e.touches.length === 0) return;

    const rect = centralDialRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const touch = e.touches[0];
    const currentAngle = Math.atan2(touch.clientY - centerY, touch.clientX - centerX);

    let angleDelta = currentAngle - lastAngle.current;
    if (angleDelta > Math.PI) angleDelta -= 2 * Math.PI;
    if (angleDelta < -Math.PI) angleDelta += 2 * Math.PI;

    const segmentRatio = (2 * Math.PI) / itemCount;
    const progressionDelta = angleDelta / segmentRatio;

    targetProgress.current = targetProgress.current + progressionDelta;
    lastAngle.current = currentAngle;
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (enableSynth) initAudio();
    const sensitivity = 0.0022;
    targetProgress.current += e.deltaY * sensitivity;
  };

  const visualizerBars = useMemo(() => {
    const bars = [];
    const radius = ringDiameter / 2;
    const center = 250;

    // The tracker starts at -90 degrees (12 o'clock top position)
    const activeTrackerAngleRad = (normalizedIndex / itemCount) * Math.PI * 2 - Math.PI / 2;

    for (let i = 0; i < visualizerLines; i++) {
      const barAngle = (i / visualizerLines) * Math.PI * 2 - Math.PI / 2;

      let angleDist = Math.abs(barAngle - activeTrackerAngleRad);
      if (angleDist > Math.PI) {
        angleDist = Math.PI * 2 - angleDist;
      }

      const proximityGlow = Math.max(0, 1 - angleDist / (Math.PI * 0.65));
      const ambientPulse = Math.sin(Date.now() * 0.0035 + i * 0.08) * 4;
      const kineticSurge = Math.abs(velocity) * 165;

      let height = 3;
      if (waveMode === "surge") {
        height = 3 + (ambientPulse * 0.4) + (kineticSurge * (1 + Math.sin(i * 0.3))) + (proximityGlow * 24 * visualizerSpread);
      } else if (waveMode === "ambient") {
        height = 5 + (ambientPulse * 1.8) + (kineticSurge * 2.5);
      }

      height *= visualizerAmp;
      height = Math.max(0.5, Math.min(90, height));

      const cos = Math.cos(barAngle);
      const sin = Math.sin(barAngle);

      const x1 = center + (radius + 8) * cos;
      const y1 = center + (radius + 8) * sin;
      const x2 = center + (radius + 8 + height) * cos;
      const y2 = center + (radius + 8 + height) * sin;

      const opacity = 0.12 + (proximityGlow * 0.68) + (Math.abs(velocity) * 0.35);

      bars.push({ x1, y1, x2, y2, opacity });
    }
    return bars;
  }, [visualizerLines, ringDiameter, normalizedIndex, velocity, visualizerAmp, visualizerSpread, waveMode, itemCount]);

  const designNodes = useMemo(() => {
    const radius = ringDiameter / 2;
    const count = 5;
    const nodes = [];
    for (let i = 0; i < count; i++) {
      const angleDeg = -90 + (360 / count) * i;
      const rad = (angleDeg * Math.PI) / 180;
      nodes.push({
        id: i,
        x: 250 + radius * Math.cos(rad),
        y: 250 + radius * Math.sin(rad)
      });
    }
    return nodes;
  }, [ringDiameter]);

  const trackerPos = useMemo(() => {
    const radius = ringDiameter / 2;
    const angleRad = (normalizedIndex / itemCount) * Math.PI * 2 - Math.PI / 2;
    return {
      x: 250 + radius * Math.cos(angleRad),
      y: 250 + radius * Math.sin(angleRad),
      angleRad
    };
  }, [normalizedIndex, ringDiameter, itemCount]);

  return (
    <div className={\`relative flex items-center justify-center select-none \${className}\`}>
      <div 
        className="relative flex items-center justify-center select-none"
        style={{ width: "500px", height: "500px" }}
      >
        <svg 
          className="absolute inset-0 w-full h-full pointer-events-none z-20" 
          viewBox="0 0 500 500"
          style={{ overflow: "visible" }}
        >
          <defs>
            <linearGradient id="rotary-visualizer-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor={secondaryColor} />
            </linearGradient>
          </defs>

          <circle cx="250" cy="250" r={ringDiameter / 2} fill="none" stroke="rgba(255, 255, 255, 0.02)" strokeWidth="15" className="blur-md" />

          {visualizerBars.map((bar, i) => (
            <line
              key={i}
              x1={bar.x1}
              y1={bar.y1}
              x2={bar.x2}
              y2={bar.y2}
              stroke="url(#rotary-visualizer-grad)"
              strokeWidth="0.85"
              strokeLinecap="round"
              opacity={bar.opacity}
              className="transition-all duration-100"
            />
          ))}

          <circle
            cx="250"
            cy="250"
            r={ringDiameter / 2}
            fill="none"
            stroke="rgba(255, 255, 255, 0.15)"
            strokeWidth="1"
          />

          <circle
            cx="250"
            cy="250"
            r={ringDiameter / 2}
            fill="none"
            stroke="rgba(255, 255, 255, 0.55)"
            strokeWidth="1.5"
          />

          {designNodes.map((node, i) => (
            <g key={i}>
              <circle
                cx={node.x}
                cy={node.y}
                r="4.5"
                fill={bgSolidColor}
                stroke="#ffffff"
                strokeWidth="1.5"
              />
              <circle
                cx={node.x}
                cy={node.y}
                r="1.5"
                fill="#ffffff"
              />
            </g>
          ))}

          <g transform={\`translate(\${trackerPos.x}, \${trackerPos.y}) rotate(\${(trackerPos.angleRad * 180) / Math.PI + 90})\`}>
            <line x1="0" y1="-8" x2="0" y2="-18" stroke="#ffffff" strokeWidth="1.2" />
            <polygon
              points="-8,-4.5 -8,4.5 0,9.5 8,4.5 8,-4.5 0,-9.5"
              fill={bgSolidColor}
              stroke="#ffffff"
              strokeWidth="1.8"
            />
            <circle cx="0" cy="0" r="2.5" fill="#ffffff" />
            <circle cx="0" cy="0" r="10" fill="none" stroke="#ffffff" strokeWidth="1" opacity="0.15" className="animate-ping" />
          </g>
        </svg>

        <div
          ref={centralDialRef}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          className={\`absolute rounded-full flex items-center justify-center cursor-grab active:cursor-grabbing transition-transform duration-300 z-10 \${dragActive ? "scale-[0.98]" : "hover:scale-[1.01]"}\`}
          style={{
            width: \`\${ringDiameter - 18}px\`,
            height: \`\${ringDiameter - 18}px\`,
          }}
        >
          <div 
            className="relative w-full h-full rounded-full overflow-hidden border border-white/10 flex items-center justify-center"
            style={{ backgroundColor: bgSolidColor }}
          >
            {items.map((item, idx) => {
              let diff = idx - normalizedIndex;
              if (diff > itemCount / 2) diff -= itemCount;
              if (diff < -itemCount / 2) diff += itemCount;

              const isActive = Math.abs(diff) < 0.5;
              const scale = isActive ? 1 : 0.85;

              return (
                <div
                  key={item.id}
                  className="absolute inset-0 transition-all duration-700 ease-out flex items-center justify-center"
                  style={{
                    opacity: isActive ? 1 : 0,
                    transform: \`scale(\${scale})\`,
                    zIndex: isActive ? 5 : 1
                  }}
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover select-none pointer-events-none"
                  />
                </div>
              );
            })}

            {/* HUD center removed */}

            {enableSynth && (
              <button
                onClick={toggleAudio}
                className={\`absolute bottom-3 z-30 p-1.5 rounded-full border border-white/10 bg-black/60 hover:bg-black/80 hover:border-white/20 text-white transition-all pointer-events-auto\`}
                title={audioEnabled ? "Disable Sound Synthesizer" : "Enable Sound Synthesizer"}
              >
                {audioEnabled ? <Volume2 className="w-3.5 h-3.5 text-white" /> : <VolumeX className="w-3.5 h-3.5 text-slate-500" />}
              </button>
            )}

            <div className="absolute inset-4 rounded-full border border-dashed border-white/5 pointer-events-none opacity-40 animate-spin-slow"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RotaryCarousel;`;

export const creditsData = [
  {
    title: "Component Source",
    items: [
      {
        name: "Rotary Dial visualizer",
        role: "Creative Developer",
        url: "https://reactbytes.dev",
      },
    ],
  },
  {
    title: "Open Source Libraries",
    items: [
      {
        name: "React",
        role: "UI Library",
        url: "https://react.dev",
      },
      {
        name: "Lucide React",
        role: "Icons",
        url: "https://lucide.dev",
      },
    ],
  },
];
