"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sliders, Zap, Undo, Eye, MousePointer } from "lucide-react";
import FbmNoise from "@/app/meta/background/liquid/FbmNoise";

interface DialKnobProps {
  label: string;
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange: (val: number) => void;
  color?: string;
}

export const DialKnob: React.FC<DialKnobProps> = ({
  label,
  min,
  max,
  step = 0.01,
  value,
  onChange,
  color = "#c0dedd",
}) => {
  const knobRef = React.useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const startYRef = React.useRef(0);
  const startValueRef = React.useRef(0);

  // Map value to rotation angle (from -135deg to 135deg)
  const angle = ((value - min) / (max - min)) * 270 - 135;

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
    startYRef.current = e.clientY;
    startValueRef.current = value;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const deltaY = startYRef.current - e.clientY; // Drag UP to increase
    const range = max - min;
    const speed = 0.003; // Drag sensitivity
    let newValue = startValueRef.current + deltaY * range * speed;
    newValue = Math.max(min, Math.min(max, newValue));
    
    // Round to step
    const stepsCount = Math.round((newValue - min) / step);
    const steppedValue = min + stepsCount * step;
    onChange(parseFloat(steppedValue.toFixed(4)));
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  // Generate SVG path details
  const radius = 24;
  const strokeWidth = 3;
  const circumference = 2 * Math.PI * radius;
  const arcLength = circumference * 0.75;
  const progressRatio = (value - min) / (max - min);
  const strokeDashoffset = arcLength - progressRatio * arcLength;

  return (
    <div className="flex flex-col items-center gap-2 select-none group w-20">
      <span className="text-[8px] font-mono tracking-wider text-white/40 uppercase text-center truncate w-full">
        {label}
      </span>

      <div
        ref={knobRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        className={`relative w-16 h-16 rounded-full bg-[#181a1e]/80 border border-white/5 flex items-center justify-center cursor-ns-resize shadow-lg transition-all ${
          isDragging ? "border-[#c0dedd]/45 shadow-[0_0_15px_rgba(192,222,221,0.15)]" : "hover:border-white/20"
        }`}
        style={{ touchAction: "none" }}
      >
        {/* Glowing Arc Track */}
        <svg className="absolute inset-0 w-full h-full -rotate-225" viewBox="0 0 64 64">
          <circle
            cx="32"
            cy="32"
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.03)"
            strokeWidth={strokeWidth}
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeLinecap="round"
          />
          <motion.circle
            cx="32"
            cy="32"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={`${arcLength} ${circumference}`}
            style={{ strokeDashoffset }}
            strokeLinecap="round"
            animate={{ strokeDashoffset }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        </svg>

        {/* Rotating Dial Core */}
        <div
          className="relative w-10 h-10 rounded-full bg-[#060010] border border-white/10 flex items-center justify-center transition-transform duration-75"
          style={{ transform: `rotate(${angle}deg)` }}
        >
          {/* Notch line indicator */}
          <div className="absolute top-1 w-0.5 h-2 bg-[#c0dedd] rounded-full shadow-[0_0_6px_#c0dedd]" />
        </div>
      </div>

      {/* Value Readout */}
      <span className="text-[10px] font-mono font-semibold tracking-wider text-[#c0dedd] bg-[#c0dedd]/5 px-2 py-0.5 rounded border border-[#c0dedd]/10 min-w-[42px] text-center">
        {value.toFixed(2)}
      </span>
    </div>
  );
};

interface NeonFaderProps {
  label: string;
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange: (val: number) => void;
  color?: string;
}

export const NeonFader: React.FC<NeonFaderProps> = ({
  label,
  min,
  max,
  step = 0.01,
  value,
  onChange,
  color = "#c0dedd",
}) => {
  const trackRef = React.useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = React.useState(false);

  const calculateValue = (clientX: number) => {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const rawVal = min + ratio * (max - min);
    const stepsCount = Math.round((rawVal - min) / step);
    const steppedVal = min + stepsCount * step;
    onChange(parseFloat(steppedVal.toFixed(4)));
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
    calculateValue(e.clientX);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    calculateValue(e.clientX);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="flex flex-col gap-1 w-full select-none">
      <div className="flex justify-between text-[10px] font-mono">
        <span className="text-[#e6dff1]/60 uppercase tracking-wide">{label}</span>
        <span className="font-semibold" style={{ color }}>{value.toFixed(2)}</span>
      </div>

      <div
        ref={trackRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        className="h-6 w-full flex items-center cursor-ew-resize relative group"
        style={{ touchAction: "none" }}
      >
        <div className="h-1 w-full bg-white/5 rounded-full border border-white/[0.02] overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-75 animate-pulse"
            style={{
              width: `${percentage}%`,
              background: `linear-gradient(90deg, ${color}33, ${color})`,
              boxShadow: `0 0 6px ${color}80`,
            }}
          />
        </div>

        <div
          className={`absolute h-3 w-1.5 rounded-sm bg-white border border-white/10 shadow-lg -translate-x-1/2 flex items-center justify-center transition-all ${
            isDragging ? "scale-y-125 border-white shadow-[0_0_8px_rgba(255,255,255,0.4)]" : "group-hover:scale-y-110"
          }`}
          style={{ left: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

interface Preset {
  name: string;
  speed: number;
  scale: number;
  colorR: number;
  colorG: number;
  colorB: number;
  brightness: number;
}

interface VisualPlaygroundSectionProps {
  presets: Record<string, Preset>;
  activePreset: string;
  speed: number;
  scale: number;
  colorR: number;
  colorG: number;
  colorB: number;
  brightness: number;
  onPresetChange: (key: string) => void;
  onSpeedChange: (val: number) => void;
  onScaleChange: (val: number) => void;
  onColorRChange: (val: number) => void;
  onColorGChange: (val: number) => void;
  onColorBChange: (val: number) => void;
  onBrightnessChange: (val: number) => void;
}

export const VisualPlaygroundSection: React.FC<VisualPlaygroundSectionProps> = ({
  presets,
  activePreset,
  speed,
  scale,
  colorR,
  colorG,
  colorB,
  brightness,
  onPresetChange,
  onSpeedChange,
  onScaleChange,
  onColorRChange,
  onColorGChange,
  onColorBChange,
  onBrightnessChange,
}) => {
  return (
    <section 
      id="shader-playground" 
      className="relative w-full min-h-screen flex items-center justify-center py-24 px-6 md:px-12 z-20 overflow-hidden"
    >
      
      {/* Immersive FbmNoise Background for the Section */}
      <div className="absolute inset-0 z-0">
        <FbmNoise 
          complex={false} 
          speed={speed} 
          scale={scale} 
          brightness={brightness} 
          colorR={colorR} 
          colorG={colorG} 
          colorB={colorB} 
          mouseInfluence={0.8}
          paused={false}
          observeVisibility={true}
          className="w-full h-full"
        />
        {/* Dark radial and linear gradients to blend the section background with the rest of the page */}
        <div className="absolute inset-0 bg-[#060010]/40 z-10 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#060010] via-transparent to-[#060010] z-20 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,#060010_100%)] z-20 pointer-events-none" />
      </div>
      
      {/* Decorative center grid markers */}
      <div className="absolute inset-y-0 left-1/2 w-[1px] bg-white/[0.02] pointer-events-none z-10" />
      <div className="absolute inset-x-0 top-1/2 h-[1px] bg-white/[0.02] pointer-events-none z-10" />

      {/* Synthesizer Cockpit Panel */}
      <div className="relative z-30 w-full max-w-4xl grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
        
        {/* Left text metrics */}
        <div className="md:col-span-5 flex flex-col gap-6 text-center md:text-left drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
          <div className="flex items-center gap-2.5 mx-auto md:mx-0 px-3 py-1 rounded-full bg-white/5 border border-white/10 w-fit backdrop-blur-md">
            <Zap size={12} className="text-[#c0dedd]" />
            <span className="text-[9px] font-mono uppercase tracking-widest text-[#e6dff1]/70">Simulation cockpit</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white font-mono uppercase">
            Fluid Console
          </h2>
          
          <p className="text-sm text-[#e6dff1]/70 max-w-md leading-relaxed font-light font-sans">
            Tune the parameters of the WebGL fluid noise simulation. This dashboard overrides active color multipliers, scales, and speeds in real-time.
          </p>
          
          <div className="flex flex-col gap-3 text-xs text-[#e6dff1]/50 font-mono">
            <div className="flex items-center gap-3 justify-center md:justify-start">
              <MousePointer size={14} className="text-[#c0dedd]" />
              <span>Mouse coordinates warp the fluid wave vectors.</span>
            </div>
            <div className="flex items-center gap-3 justify-center md:justify-start">
              <Eye size={14} className="text-[#e6dff1]" />
              <span>Calculated directly on fragment shaders.</span>
            </div>
          </div>
        </div>

        {/* Right controller cockpit */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="md:col-span-7 p-6 md:p-8 rounded-3xl bg-[#060010]/80 border border-white/10 backdrop-blur-xl shadow-2xl flex flex-col gap-6 w-full relative overflow-hidden"
        >
          
          {/* Neon grid details background */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#c0dedd]/5 to-transparent pointer-events-none" />

          <div className="flex items-center justify-between border-b border-white/5 pb-4 z-10">
            <div className="flex items-center gap-2">
              <Sliders size={13} className="text-[#c0dedd]" />
              <span className="text-xs uppercase font-mono tracking-wider font-semibold text-white">
                Control Matrix
              </span>
            </div>
            <button 
              onClick={() => onPresetChange("cyberpunk")} 
              className="flex items-center gap-1.5 text-[9px] font-mono text-[#c0dedd] hover:text-white transition-colors cursor-pointer"
            >
              <Undo size={10} /> Restore Default
            </button>
          </div>

          {/* Presets Grid */}
          <div className="flex flex-col gap-2 z-10">
            <span className="text-[9px] font-mono uppercase text-[#e6dff1]/40">Active presets</span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {Object.keys(presets).map((key) => (
                <button
                  key={key}
                  onClick={() => onPresetChange(key)}
                  className={`px-2 py-2 text-center text-[10px] font-semibold font-mono rounded-lg border transition-all cursor-pointer ${
                    activePreset === key 
                      ? "bg-[#c0dedd]/15 border-[#c0dedd] text-[#c0dedd]" 
                      : "bg-[#181a1e]/40 border-white/5 text-[#e6dff1]/50 hover:border-white/10 hover:text-white"
                  }`}
                >
                  {presets[key].name.split(" ")[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Draggable Dial Tuning knobs */}
          <div className="flex justify-around items-center border-b border-white/5 pb-6 pt-2">
            <DialKnob 
              label="Speed Vector"
              min={0.02}
              max={0.45}
              step={0.01}
              value={speed}
              onChange={onSpeedChange}
            />
            <DialKnob 
              label="Zoom Scale"
              min={1.0}
              max={6.0}
              step={0.1}
              value={scale}
              onChange={onScaleChange}
            />
            <DialKnob 
              label="Luminosity"
              min={0.40}
              max={2.00}
              step={0.05}
              value={brightness}
              onChange={onBrightnessChange}
            />
          </div>

          {/* RGB Channel Neon Faders */}
          <div className="flex flex-col gap-4 border-t border-white/5 pt-4">
            <span className="text-[9px] font-mono uppercase text-[#e6dff1]/40 tracking-wider">
              Color Channel Multipliers (RGB Matrix)
            </span>
            
            <NeonFader 
              label="Red Channel (R)"
              min={0.0}
              max={1.5}
              step={0.05}
              value={colorR}
              onChange={onColorRChange}
              color="#f87171"
            />

            <NeonFader 
              label="Green Channel (G)"
              min={0.0}
              max={1.5}
              step={0.05}
              value={colorG}
              onChange={onColorGChange}
              color="#4ade80"
            />

            <NeonFader 
              label="Blue Channel (B)"
              min={0.0}
              max={1.5}
              step={0.05}
              value={colorB}
              onChange={onColorBChange}
              color="#60a5fa"
            />
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default VisualPlaygroundSection;
