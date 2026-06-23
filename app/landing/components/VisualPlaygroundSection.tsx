"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sliders, Zap, Undo, Eye, MousePointer } from "lucide-react";
import DiscreteSlider2 from "@/app/components/slider/DiscreteSlider2";
import DefaultComboBox from "@/app/components/combobox/DefaultComboBox";

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
        {/* Dark radial and linear gradients to blend the section background with the rest of the page */}
        <div className="absolute inset-0 bg-[#060010]/40 z-10 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#060010] via-transparent to-[#060010] z-20 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,#060010_100%)] z-20 pointer-events-none" />
      </div>
      
      {/* Decorative center grid markers */}
      <div className="absolute inset-y-0 left-1/2 w-[1px] bg-white/[0.02] pointer-events-none z-10" />
      <div className="absolute inset-x-0 top-1/2 h-[1px] bg-white/[0.02] pointer-events-none z-10" />

      {/* Synthesizer Cockpit Panel */}
      <div className="relative z-30 w-full max-w-6xl grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
        
        {/* Left text metrics */}
        <div className="md:col-span-4 flex flex-col gap-6 text-center md:text-left drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
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
          className="md:col-span-8 p-6 md:p-8 rounded-3xl bg-[#060010]/80 border border-white/10 backdrop-blur-xl shadow-2xl flex flex-col gap-6 w-full relative"
        >
          
          {/* Neon grid details background */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#c0dedd]/5 to-transparent pointer-events-none rounded-tr-3xl" />

          <div className="flex items-center justify-between border-b border-white/5 pb-4 z-10">
            <div className="flex items-center gap-2">
              <Sliders size={13} className="text-[#c0dedd]" />
              <span className="text-xs uppercase font-mono tracking-wider font-semibold text-white">
                Control Matrix
              </span>
            </div>
            <button 
              onClick={() => onPresetChange("cyberpunk")} 
              className="flex items-center gap-1.5 text-xs font-mono text-[#c0dedd] hover:text-white transition-colors cursor-pointer"
            >
              <Undo size={12} /> Restore Default
            </button>
          </div>

          {/* Presets Selection */}
          <div className="flex flex-col gap-2 z-10">
            <div className="w-full">
              <DefaultComboBox
                label="Presets"
                options={Object.keys(presets).map((key) => ({
                  id: key,
                  label: presets[key].name,
                }))}
                value={activePreset}
                onChange={onPresetChange}
                dynamicWidth={false}
              />
            </div>
          </div>

          {/* Controls Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 z-10 mt-2">
            {/* Simulation Parameters */}
            <div className="flex flex-col gap-4">
              <span className="text-[10px] font-mono uppercase text-[#e6dff1]/40 tracking-wider">
                Simulation Vectors
              </span>
              <div className="flex flex-col gap-3">
                <DiscreteSlider2
                  label="Speed"
                  min={0.02}
                  max={0.45}
                  step={0.01}
                  value={speed}
                  onChange={onSpeedChange}
                  maxDecimals={2}
                />
                <DiscreteSlider2
                  label="Scale"
                  min={1.0}
                  max={6.0}
                  step={0.1}
                  value={scale}
                  onChange={onScaleChange}
                  maxDecimals={1}
                />
                <DiscreteSlider2
                  label="Luminosity"
                  min={0.40}
                  max={2.00}
                  step={0.05}
                  value={brightness}
                  onChange={onBrightnessChange}
                  maxDecimals={2}
                />
              </div>
            </div>

            {/* Color Channels */}
            <div className="flex flex-col gap-4">
              <span className="text-[10px] font-mono uppercase text-[#e6dff1]/40 tracking-wider">
                RGB Channels
              </span>
              <div className="flex flex-col gap-3">
                <DiscreteSlider2
                  label="Red (R)"
                  min={0.0}
                  max={1.5}
                  step={0.05}
                  value={colorR}
                  onChange={onColorRChange}
                  maxDecimals={2}
                />
                <DiscreteSlider2
                  label="Green (G)"
                  min={0.0}
                  max={1.5}
                  step={0.05}
                  value={colorG}
                  onChange={onColorGChange}
                  maxDecimals={2}
                />
                <DiscreteSlider2
                  label="Blue (B)"
                  min={0.0}
                  max={1.5}
                  step={0.05}
                  value={colorB}
                  onChange={onColorBChange}
                  maxDecimals={2}
                />
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default React.memo(VisualPlaygroundSection);
