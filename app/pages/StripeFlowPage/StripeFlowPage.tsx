"use client";

import React, { useState } from "react";
import HeaderText from "../../components/textfields/HeaderText";
import PreviewTab from "../../components/tabsection/PreviewTab";
import InstallationTabs from "../../components/tabsection/InstallationTabs";
import { PropsTable } from "../../components/table/PropsTable";
import { StripeFlow } from "../../meta/background/StripeFlow/StripeFlow";
import { loaderProps, componentCode, creditsData } from "./StripeFlowData";
import ToggleComponent from "@/app/components/buttongroup/ToggleComponent";
import { RotateCcw, RotateCw, Play, Pause, SlidersHorizontal } from "lucide-react";
import DefaultComboBox from "@/app/components/combobox/DefaultComboBox";
import { Credits } from "../../components/buttongroup/Credits";
import DiscreteSlider2 from "@/app/components/slider/DiscreteSlider2";

const paletteOptions = [
  { id: "vapor", label: "Neo-Mint" },
  { id: "sunset", label: "Copper Glow" },
  { id: "slate", label: "Brutalist Gray" },
  { id: "acid", label: "Indigo Acid" }
];

const pagePresets = [
  {
    id: "default",
    label: "Neo-Mint Wave (Default)",
    config: {
      seed: 422,
      distortion: 45.0,
      scale: 0.008,
      radius: 0.8,
      speed: 1.0,
      palette: "vapor"
    }
  },
  {
    id: "sunset",
    label: "Sunset Glow",
    config: {
      seed: 125,
      distortion: 75.0,
      scale: 0.012,
      radius: 1.1,
      speed: 1.2,
      palette: "sunset"
    }
  },
  {
    id: "brutalist",
    label: "Brutalist Monochrome",
    config: {
      seed: 888,
      distortion: 30.0,
      scale: 0.005,
      radius: 0.6,
      speed: 0.5,
      palette: "slate"
    }
  },
  {
    id: "acid",
    label: "Acid Flow",
    config: {
      seed: 941,
      distortion: 90.0,
      scale: 0.018,
      radius: 1.3,
      speed: 1.6,
      palette: "acid"
    }
  }
];

export const StripeFlowPage = () => {
  const [seed, setSeed] = useState(422);
  const [distortion, setDistortion] = useState(45.0);
  const [scale, setScale] = useState(0.008);
  const [radius, setRadius] = useState(0.8);
  const [speed, setSpeed] = useState(1.0);
  const [palette, setPalette] = useState<any>("vapor");
  const [isPaused, setIsPaused] = useState(false);

  const [currentPreset, setCurrentPreset] = useState("default");
  const [key, setKey] = useState(0);

  const applyPreset = (presetId: string) => {
    const p = pagePresets.find((x) => x.id === presetId);
    if (p) {
      setCurrentPreset(presetId);
      setSeed(p.config.seed);
      setDistortion(p.config.distortion);
      setScale(p.config.scale);
      setRadius(p.config.radius);
      setSpeed(p.config.speed);
      setPalette(p.config.palette);
      setKey((prev) => prev + 1);
    }
  };

  const handleReplay = () => {
    setKey((prev) => prev + 1);
  };

  const handleReset = () => {
    applyPreset("default");
  };

  const randomizeSeed = () => {
    setSeed(Math.floor(Math.random() * 1000));
  };

  const usageCode = `<StripeFlow
  seed={${seed}}
  distortion={${distortion}}
  scale={${scale}}
  radius={${radius}}
  speed={${speed}}
  palette="${palette}"
  isPaused={${isPaused}}
>
  <div className="flex items-center justify-center p-12">
    <div className="bg-slate-950/40 backdrop-blur-md p-6 rounded-2xl">
      <h2>Stripe Flow Field</h2>
      <p>Custom WebGL topological stripe wave background.</p>
    </div>
  </div>
</StripeFlow>`;

  return (
    <div className="flex flex-col gap-5 text-neutral-200">
      <div id="stripe-flow-title">
        <HeaderText text="Stripe Flow" option={3} />
      </div>

      <div id="preview">
        <PreviewTab
          previewContent={
            <div className="w-full h-[600px] relative overflow-hidden flex items-center justify-center p-2 rounded-xl">
              <StripeFlow
                key={key}
                seed={seed}
                distortion={distortion}
                scale={scale}
                radius={radius}
                speed={speed}
                palette={palette}
                isPaused={isPaused}
                className="relative w-full h-full bg-zinc-950 overflow-hidden font-sans select-none text-white rounded-xl border border-neutral-800"
              >
              </StripeFlow>
            </div>
          }
          onReplay={handleReplay}
          usageCode={usageCode}
          codeContent={componentCode}
          collapsible={true}
          header={
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <h3 className="text-xs ml-4 font-bold text-rb-accent-1 uppercase">
                  Configuration
                </h3>
              </div>
              <DefaultComboBox
                label="Presets"
                options={pagePresets}
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
          <DefaultComboBox
            label="Color Palette"
            options={paletteOptions}
            value={palette}
            onChange={setPalette}
            dynamicWidth={true}
          />

          {/* Seed Input Controller */}
          <div className="flex items-center justify-between bg-rb-neutral-3 border border-rb-neutral-4/40 rounded-full px-4 py-2 mt-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-rb-accent-2/40 leading-none">
              Global Seed
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold bg-black/30 text-rb-accent-1 px-2.5 py-1 rounded-full border border-white/5">
                #{seed}
              </span>
              <button
                onClick={randomizeSeed}
                className="p-1 rounded-full hover:bg-white/10 text-white/50 hover:text-white transition-colors"
                title="Roll New Seed"
              >
                <RotateCw size={14} />
              </button>
            </div>
          </div>

          <DiscreteSlider2
            label="Distortion"
            min={10}
            max={120}
            step={1}
            value={distortion}
            onChange={setDistortion}
            maxDecimals={0}
          />

          <DiscreteSlider2
            label="Noise Density (Scale)"
            min={0.002}
            max={0.025}
            step={0.001}
            value={scale}
            onChange={setScale}
            maxDecimals={4}
          />

          <DiscreteSlider2
            label="Vignette Radius"
            min={0.3}
            max={1.5}
            step={0.1}
            value={radius}
            onChange={setRadius}
            maxDecimals={1}
          />

          <DiscreteSlider2
            label="Flow Speed"
            min={0.0}
            max={2.0}
            step={0.1}
            value={speed}
            onChange={setSpeed}
            maxDecimals={1}
          />

          {/* Play/Pause control */}
          <div className="flex justify-end pt-2 border-t border-white/5 mt-2">
            <button
              onClick={() => setIsPaused(!isPaused)}
              className={`px-4 py-2 text-xs font-semibold rounded-full border transition-all flex items-center gap-1.5 ${isPaused
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20"
                : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white"
                }`}
            >
              {isPaused ? <Play size={12} /> : <Pause size={12} />}
              <span>{isPaused ? "Resume Waves" : "Pause Waves"}</span>
            </button>
          </div>
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

export default StripeFlowPage;
