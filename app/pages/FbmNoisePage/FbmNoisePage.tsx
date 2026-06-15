"use client";

import React, { useState } from "react";
import HeaderText from "../../components/textfields/HeaderText";
import ParagraphText from "../../components/textfields/ParagraphText";
import PreviewTab from "../../components/tabsection/PreviewTab";
import InstallationTabs from "../../components/tabsection/InstallationTabs";
import { PropsTable } from "../../components/table/PropsTable";
import { FbmNoise } from "../../meta/background/liquid/FbmNoise";
import { loaderProps, componentCode, creditsData } from "./FbmNoiseData";
import { DiscreteSlider2 } from "../../components/slider/DiscreteSlider2";
import { DefaultTextInput } from "../../components/textinput/DefaultTextInput";
import { ToggleComponent } from "../../components/buttongroup/ToggleComponent";
import DefaultComboBox from "@/app/components/combobox/DefaultComboBox";
import { Credits } from "../../components/buttongroup/Credits";
import { Dices, RotateCcw } from "lucide-react";

const presets = [
  {
    id: "nebula",
    label: "Cosmic Aurora",
    config: {
      title: "COSMIC AURORA",
      complex: false,
      scale: 3.5,
      speed: 0.08,
      mouseInfluence: 0.6,
      brightness: 1.0,
      seed: 43758.545,
      colorR: 0.8,
      colorG: 1.2,
      colorB: 1.5,
      paused: false,
    },
  },
  {
    id: "fire",
    label: "Solar Tempest",
    config: {
      title: "SOLAR TEMPEST",
      complex: true,
      scale: 4.8,
      speed: 0.16,
      mouseInfluence: 1.1,
      brightness: 1.3,
      seed: 1294.551,
      colorR: 2.2,
      colorG: 0.45,
      colorB: 0.1,
      paused: false,
    },
  },
  {
    id: "void",
    label: "Ethereal Abyss",
    config: {
      title: "ETHEREAL ABYSS",
      complex: false,
      scale: 1.8,
      speed: 0.04,
      mouseInfluence: 0.3,
      brightness: 0.85,
      seed: 98765.432,
      colorR: 0.4,
      colorG: 0.7,
      colorB: 1.4,
      paused: false,
    },
  },
  {
    id: "matrix",
    label: "Toxic Quasar",
    config: {
      title: "TOXIC QUASAR",
      complex: true,
      scale: 5.0,
      speed: 0.18,
      mouseInfluence: 1.3,
      brightness: 1.15,
      seed: 77777.777,
      colorR: 0.25,
      colorG: 1.8,
      colorB: 0.35,
      paused: false,
    },
  },
  {
    id: "neon",
    label: "Cybernetic Silk",
    config: {
      title: "CYBERNETIC SILK",
      complex: true,
      scale: 2.8,
      speed: 0.06,
      mouseInfluence: 0.8,
      brightness: 1.2,
      seed: 33333.333,
      colorR: 1.6,
      colorG: 0.25,
      colorB: 1.8,
      paused: false,
    },
  },
];

export const FbmNoisePage = () => {
  const [config, setConfig] = useState(presets[0].config);
  const [key, setKey] = useState(0);

  const applyPreset = (presetId: string) => {
    const preset = presets.find((p) => p.id === presetId);
    if (preset) {
      setConfig(preset.config);
      setKey((prev) => prev + 1);
    }
  };

  const updateConfig = (key: string, value: any) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  const randomizeSeed = () => {
    const randomSeed = Math.random() * 90000 + 1000;
    updateConfig("seed", randomSeed);
  };

  const handleReset = () => {
    applyPreset("nebula");
  };

  const usageCode = `<FbmNoise
  complex={${config.complex}}
  scale={${config.scale}}
  speed={${config.speed}}
  mouseInfluence={${config.mouseInfluence}}
  brightness={${config.brightness}}
  seed={${config.seed}}
  colorR={${config.colorR}}
  colorG={${config.colorG}}
  colorB={${config.colorB}}
  paused={${config.paused}}
>
  <div className="flex flex-col items-center gap-3 text-center px-6">
    <div className="text-[clamp(1.5rem,5vw,3.5rem)] font-bold tracking-[0.2em] text-white">
      ${config.title}
    </div>
  </div>
</FbmNoise>`;

  return (
    <div className="flex flex-col gap-5">
      <div id="fbm-noise-title">
        <HeaderText text="FBM Vector Shader" option={3} />
      </div>
      <ParagraphText
        text="A highly interactive, real-time Fractional Brownian Motion (FBM) shader canvas powered by Three.js. Supports custom multi-octave complexity, pointer-warped coordinate distortions, and chromatic bias adjustments."
        option={4}
      />

      <div id="preview">
        <PreviewTab
          previewContent={
            <FbmNoise
              key={key}
              complex={config.complex}
              scale={config.scale}
              speed={config.speed}
              mouseInfluence={config.mouseInfluence}
              brightness={config.brightness}
              seed={config.seed}
              colorR={config.colorR}
              colorG={config.colorG}
              colorB={config.colorB}
              paused={config.paused}
              className="w-full h-[500px] border border-white/5 rounded-xl cursor-pointer"
            >
              <div className="flex flex-col items-center gap-3 text-center px-6" style={{ pointerEvents: "none" }}>
                <div className="text-[clamp(2.5rem,7vw,5rem)] font-extrabold tracking-tighter text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.6)] mix-blend-overlay">
                  {config.title}
                </div>
              </div>
            </FbmNoise>
          }
          onReplay={() => setKey((prev) => prev + 1)}
          usageCode={usageCode}
          codeContent={componentCode}
          collapsible={true}
          header={
            <div className="flex items-center justify-between ">
              <div className="flex flex-col gap-1">
                <h3 className="text-xs ml-4 font-bold text-rb-accent-1 uppercase">
                  Props
                </h3>
              </div>
              <DefaultComboBox
                options={presets}
                value={presets.find((p) => p.config.colorR === config.colorR && p.config.colorG === config.colorG && p.config.scale === config.scale)?.id || ""}
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
          <DefaultTextInput
            label="Hero Text"
            value={config.title}
            onChange={(val) => updateConfig("title", val)}
            placeholder="Enter text..."
          />

          <ToggleComponent
            label="Extended Complexity"
            checked={config.complex}
            onChange={(val) => updateConfig("complex", val)}
          />

          <ToggleComponent
            label="Simulation Paused"
            checked={config.paused}
            onChange={(val) => updateConfig("paused", val)}
          />

          <DiscreteSlider2
            label="Pattern Scale Zoom"
            min={0.5}
            max={10.0}
            step={0.1}
            value={config.scale}
            onChange={(val) => updateConfig("scale", val)}
            maxDecimals={1}
            showTicks={true}
          />

          <DiscreteSlider2
            label="Vector Flow Velocity"
            min={0.0}
            max={0.4}
            step={0.005}
            value={config.speed}
            onChange={(val) => updateConfig("speed", val)}
            maxDecimals={3}
            showTicks={true}
          />

          <DiscreteSlider2
            label="Pointer Warp Strength"
            min={0.0}
            max={3.0}
            step={0.05}
            value={config.mouseInfluence}
            onChange={(val) => updateConfig("mouseInfluence", val)}
            maxDecimals={2}
            showTicks={true}
          />

          <DiscreteSlider2
            label="Brightness Mod"
            min={0.1}
            max={2.5}
            step={0.05}
            value={config.brightness}
            onChange={(val) => updateConfig("brightness", val)}
            maxDecimals={2}
            showTicks={true}
          />

          <DiscreteSlider2
            label="Red Shift Bias"
            min={0.0}
            max={3.0}
            step={0.05}
            value={config.colorR}
            onChange={(val) => updateConfig("colorR", val)}
            maxDecimals={2}
            showTicks={true}
          />

          <DiscreteSlider2
            label="Green Shift Bias"
            min={0.0}
            max={3.0}
            step={0.05}
            value={config.colorG}
            onChange={(val) => updateConfig("colorG", val)}
            maxDecimals={2}
            showTicks={true}
          />

          <DiscreteSlider2
            label="Blue Shift Bias"
            min={0.0}
            max={3.0}
            step={0.05}
            value={config.colorB}
            onChange={(val) => updateConfig("colorB", val)}
            maxDecimals={2}
            showTicks={true}
          />

          <div className="flex flex-col gap-1 select-none font-sans w-full">
            <span className="text-[8px] font-bold uppercase tracking-[0.15em] text-rb-accent-2/40 leading-none mb-1">Seed controls</span>
            <button
              type="button"
              onClick={randomizeSeed}
              className="w-full py-3.5 px-4 rounded-full bg-rb-neutral-3 hover:bg-rb-neutral-4 text-rb-accent-1 hover:text-white transition-all text-xs font-semibold flex items-center justify-center gap-2 border border-rb-neutral-4 active:scale-95 duration-150"
            >
              <Dices size={14} className="text-fuchsia-400" />
              <span>Randomize Space Seed</span>
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

export default FbmNoisePage;
