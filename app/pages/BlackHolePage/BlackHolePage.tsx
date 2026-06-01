"use client";

import React, { useState } from "react";
import HeaderText from "../../components/textfields/HeaderText";
import ParagraphText from "../../components/textfields/ParagraphText";
import PreviewTab from "../../components/tabsection/PreviewTab";
import InstallationTabs from "../../components/tabsection/InstallationTabs";
import { PropsTable } from "../../components/table/PropsTable";
import BlackHole from "../../meta/background/space/BlackHole";
import { loaderProps, componentCode, creditsData } from "./BlackHoleData";
import DiscreteSlider2 from "@/app/components/slider/DiscreteSlider2";
import DefaultComboBox from "@/app/components/combobox/DefaultComboBox";
import ToggleComponent from "@/app/components/buttongroup/ToggleComponent";
import { Credits } from "../../components/buttongroup/Credits";
import { RotateCcw } from "lucide-react";

const colorPresetOptions = [
  { id: "original", label: "Wormhole Core (Cyan/Magenta)" },
  { id: "solar", label: "Solar Flare (Amber/Orange)" },
  { id: "matrix", label: "Cyber Lattice (Neon Green)" },
  { id: "quasar", label: "Deep Quasar (Steel Blue)" },
];

const presets = [
  {
    id: "default",
    label: "Wormhole Singularity",
    config: {
      speed: 1.0,
      depth: 1.0,
      gridDensity: 60,
      particleFlux: 150,
      mouseParallax: 1.2,
      colorPreset: "original" as const,
      hyperdriveActive: false,
    },
  },
  {
    id: "solar",
    label: "Amber Flare Core",
    config: {
      speed: 1.8,
      depth: 1.3,
      gridDensity: 85,
      particleFlux: 200,
      mouseParallax: 1.5,
      colorPreset: "solar" as const,
      hyperdriveActive: false,
    },
  },
  {
    id: "cyber",
    label: "Cyber Lattice Grid",
    config: {
      speed: 0.6,
      depth: 0.8,
      gridDensity: 110,
      particleFlux: 100,
      mouseParallax: 2.0,
      colorPreset: "matrix" as const,
      hyperdriveActive: false,
    },
  },
  {
    id: "quasar",
    label: "Deep Blue Quasar",
    config: {
      speed: 2.2,
      depth: 1.6,
      gridDensity: 50,
      particleFlux: 180,
      mouseParallax: 1.0,
      colorPreset: "quasar" as const,
      hyperdriveActive: false,
    },
  },
  {
    id: "warp",
    label: "Hyperdrive Warp Speed",
    config: {
      speed: 2.5,
      depth: 1.1,
      gridDensity: 70,
      particleFlux: 220,
      mouseParallax: 2.5,
      colorPreset: "original" as const,
      hyperdriveActive: true,
    },
  },
];

export const BlackHolePage = () => {
  const [speed, setSpeed] = useState(presets[0].config.speed);
  const [depth, setDepth] = useState(presets[0].config.depth);
  const [gridDensity, setGridDensity] = useState(presets[0].config.gridDensity);
  const [particleFlux, setParticleFlux] = useState(presets[0].config.particleFlux);
  const [mouseParallax, setMouseParallax] = useState(presets[0].config.mouseParallax);
  const [colorPreset, setColorPreset] = useState<"original" | "solar" | "matrix" | "quasar">(
    presets[0].config.colorPreset
  );
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [hyperdriveActive, setHyperdriveActive] = useState(false);
  const [pulseKey, setPulseKey] = useState(0);

  const [currentPreset, setCurrentPreset] = useState("default");
  const [key, setKey] = useState(0);

  const applyPreset = (presetId: string) => {
    const preset = presets.find((p) => p.id === presetId);
    if (preset) {
      setCurrentPreset(presetId);
      setSpeed(preset.config.speed);
      setDepth(preset.config.depth);
      setGridDensity(preset.config.gridDensity);
      setParticleFlux(preset.config.particleFlux);
      setMouseParallax(preset.config.mouseParallax);
      setColorPreset(preset.config.colorPreset);
      setHyperdriveActive(preset.config.hyperdriveActive);
      setKey((prev) => prev + 1);
    }
  };

  const handleReset = () => {
    applyPreset("default");
    setSoundEnabled(false);
    setPulseKey(0);
  };

  const handleGravityPulse = () => {
    setPulseKey((prev) => prev + 1);
  };

  const usageCode = `<BlackHole
  speed={${speed.toFixed(1)}}
  depth={${depth.toFixed(1)}}
  gridDensity={${gridDensity}}
  particleFlux={${particleFlux}}
  mouseParallax={${mouseParallax.toFixed(1)}}
  colorPreset="${colorPreset}"
  soundEnabled={${soundEnabled}}
  hyperdriveActive={${hyperdriveActive}}
  pulseKey={${pulseKey}}
/>`;

  return (
    <div className="flex flex-col gap-5">
      <div id="black-hole-title">
        <HeaderText text="Spacetime Black Hole" option={3} />
      </div>
      <ParagraphText
        text="A gorgeous interactive 2D canvas-based gravitational black hole background simulation. Uses custom coordinate funnel mappings, orbiting plasma accretion particles, realistic frame dragging aesthetics, and Web Audio synth hum."
        option={4}
      />

      <div id="preview">
        <PreviewTab
          previewContent={
            <BlackHole
              key={key}
              speed={speed}
              depth={depth}
              gridDensity={gridDensity}
              particleFlux={particleFlux}
              mouseParallax={mouseParallax}
              colorPreset={colorPreset}
              soundEnabled={soundEnabled}
              hyperdriveActive={hyperdriveActive}
              pulseKey={pulseKey}
              className="w-full h-[500px]"
            >
              <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center pointer-events-none p-6 text-center z-10">
                <h2 className="text-3xl font-extrabold text-white tracking-widest mb-2 drop-shadow-md select-none font-mono">
                  SINGULARITY VOID
                </h2>
                <p className="text-xs text-cyan-400 font-mono tracking-wider mb-6 select-none animate-pulse">
                  STATUS: {hyperdriveActive ? "ACCELERATION ENGAGED" : "STABLE ACCRETION SHIELD"}
                </p>
                <button
                  onClick={handleGravityPulse}
                  className="px-6 py-2.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 backdrop-blur-md text-cyan-300 font-medium text-xs hover:bg-cyan-500/20 transition-all duration-300 pointer-events-auto relative z-20"
                >
                  Trigger Gravity Pulse
                </button>
              </div>
            </BlackHole>
          }
          usageCode={usageCode}
          codeContent={componentCode}
          collapsible={true}
          header={
            <div className="flex items-center justify-between ">
              <div className="flex flex-col gap-1">
                <h3 className="text-xs ml-4 font-bold text-rb-accent-1 uppercase">
                  Controls
                </h3>
              </div>
              <DefaultComboBox
                label="Presets"
                options={presets}
                value={currentPreset}
                onChange={applyPreset}
                dynamicWidth={true}
              />
              <div className="flex items-center gap-3">
                <button
                  onClick={handleReset}
                  className="group p-2.5 rounded-full bg-rb-neutral-3 text-rb-accent-1/40 border border-rb-neutral-4 hover:text-rb-accent-3 transition-all duration-300"
                  title="Reset to Defaults"
                >
                  <RotateCcw
                    size={16}
                    className="group-hover:rotate-[-90deg] transition-transform duration-500"
                  />
                </button>
              </div>
            </div>
          }
        >
          <DiscreteSlider2
            label="Flow Acceleration Speed"
            min={0.1}
            max={3.0}
            step={0.1}
            value={speed}
            onChange={(val) => {
              setSpeed(val);
              setCurrentPreset("custom");
            }}
            maxDecimals={1}
            showTicks={false}
          />

          <DiscreteSlider2
            label="Spacetime Funnel Depth"
            min={0.4}
            max={2.0}
            step={0.1}
            value={depth}
            onChange={(val) => {
              setDepth(val);
              setCurrentPreset("custom");
            }}
            maxDecimals={1}
            showTicks={false}
          />

          <DiscreteSlider2
            label="Funnel Line Grid Density"
            min={20}
            max={140}
            step={5}
            value={gridDensity}
            onChange={(val) => {
              setGridDensity(val);
              setCurrentPreset("custom");
            }}
            maxDecimals={0}
            showTicks={false}
          />

          <DiscreteSlider2
            label="Accretion Particle Flux"
            min={30}
            max={220}
            step={10}
            value={particleFlux}
            onChange={(val) => {
              setParticleFlux(val);
              setCurrentPreset("custom");
            }}
            maxDecimals={0}
            showTicks={false}
          />

          <DiscreteSlider2
            label="Mouse Displacement Parallax"
            min={0.0}
            max={3.0}
            step={0.1}
            value={mouseParallax}
            onChange={(val) => {
              setMouseParallax(val);
              setCurrentPreset("custom");
            }}
            maxDecimals={1}
            showTicks={false}
          />

          <DefaultComboBox
            label="Color Spectrum theme"
            options={colorPresetOptions}
            value={colorPreset}
            onChange={(val: any) => {
              setColorPreset(val);
              setCurrentPreset("custom");
            }}
            dynamicWidth={true}
          />

          <ToggleComponent
            label="Audio Synthesizer Hum"
            checked={soundEnabled}
            onChange={setSoundEnabled}
          />

          <ToggleComponent
            label="Hyperdrive Acceleration"
            checked={hyperdriveActive}
            onChange={(val) => {
              setHyperdriveActive(val);
              setCurrentPreset("custom");
            }}
          />
        </PreviewTab>
      </div>

      <div id="installation-tabs">
        <InstallationTabs />
      </div>

      <div id="api-reference" className="flex flex-col gap-5">
        <HeaderText text="API Reference" option={6} />
        <PropsTable categories={loaderProps} />
      </div>

      <div id="credits" className="w-full max-w-5xl mx-auto py-10">
        <Credits data={creditsData} />
      </div>
    </div>
  );
};

export default BlackHolePage;
