"use client";

import React, { useState } from "react";
import HeaderText from "../../components/textfields/HeaderText";
import ParagraphText from "../../components/textfields/ParagraphText";
import PreviewTab from "../../components/tabsection/PreviewTab";
import InstallationTabs from "../../components/tabsection/InstallationTabs";
import { PropsTable } from "../../components/table/PropsTable";
import { VelvetNoise } from "../../meta/background/liquid/VelvetNoise";
import { loaderProps, componentCode, creditsData } from "./VelvetNoiseData";
import { DiscreteSlider2 } from "../../components/slider/DiscreteSlider2";
import { DefaultTextInput } from "../../components/textinput/DefaultTextInput";
import ColorPicker from "../../components/colorpicker/ColorPicker";
import { ToggleComponent } from "../../components/buttongroup/ToggleComponent";
import DefaultComboBox from "@/app/components/combobox/DefaultComboBox";
import { Credits } from "../../components/buttongroup/Credits";

const presets = [
  {
    id: "darkGreyVelvet",
    label: "Dark Velvet (Default)",
    config: {
      title: "DARK VELVET",
      cells: 4.0,
      stripes: 40.0,
      speed: 0.5,
      chromatic: 0.1,
      colorBg: "#121212",
      colorFg: "#000000",
      isPlaying: true,
      dpr: 1.5,
    },
  },
  {
    id: "obsidianChroma",
    label: "Obsidian Aberration",
    config: {
      title: "OBSIDIAN CHROMA",
      cells: 8.0,
      stripes: 85.0,
      speed: 1.1,
      chromatic: 0.35,
      colorBg: "#0a0a0a",
      colorFg: "#1e1e1e",
      isPlaying: true,
      dpr: 1.5,
    },
  },
  {
    id: "charcoalStatic",
    label: "Charcoal Ripples",
    config: {
      title: "CHARCOAL RIPPLES",
      cells: 2.0,
      stripes: 15.0,
      speed: 0.25,
      chromatic: 0.05,
      colorBg: "#1c1c1c",
      colorFg: "#050505",
      isPlaying: true,
      dpr: 1.5,
    },
  },
  {
    id: "abyssQuantum",
    label: "Extreme Horizon",
    config: {
      title: "EXTREME HORIZON",
      cells: 14.0,
      stripes: 130.0,
      speed: 2.0,
      chromatic: 0.6,
      colorBg: "#151516",
      colorFg: "#000000",
      isPlaying: true,
      dpr: 1.5,
    },
  },
  {
    id: "amethystHaze",
    label: "Amethyst Haze",
    config: {
      title: "AMETHYST HAZE",
      cells: 6.0,
      stripes: 60.0,
      speed: 0.8,
      chromatic: 0.25,
      colorBg: "#0f051d",
      colorFg: "#2a0f4e",
      isPlaying: true,
      dpr: 1.5,
    },
  },
  {
    id: "emeraldAurora",
    label: "Emerald Aurora",
    config: {
      title: "EMERALD AURORA",
      cells: 5.0,
      stripes: 50.0,
      speed: 0.6,
      chromatic: 0.15,
      colorBg: "#061310",
      colorFg: "#0d3c33",
      isPlaying: true,
      dpr: 1.5,
    },
  },
  {
    id: "oceanicAbyss",
    label: "Oceanic Abyss",
    config: {
      title: "OCEANIC ABYSS",
      cells: 4.5,
      stripes: 45.0,
      speed: 0.7,
      chromatic: 0.3,
      colorBg: "#020b14",
      colorFg: "#0b2545",
      isPlaying: true,
      dpr: 1.5,
    },
  },
  {
    id: "solarEclipse",
    label: "Solar Crimson",
    config: {
      title: "SOLAR CRIMSON",
      cells: 3.5,
      stripes: 35.0,
      speed: 0.4,
      chromatic: 0.12,
      colorBg: "#1a0404",
      colorFg: "#3d0a0a",
      isPlaying: true,
      dpr: 1.5,
    },
  },
];

const dprOptions = [
  { id: "1.0", label: "1.0x" },
  { id: "1.5", label: "1.5x" },
  { id: "2.0", label: "2.0x" },
];

export const VelvetNoisePage = () => {
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

  const usageCode = `<VelvetNoise
  cells={${config.cells}}
  stripes={${config.stripes}}
  speed={${config.speed}}
  chromatic={${config.chromatic}}
  colorBg="${config.colorBg}"
  colorFg="${config.colorFg}"
  isPlaying={${config.isPlaying}}
  dpr={${config.dpr}}
>
  <div className="flex flex-col items-center gap-3 text-center px-6">
    <div className="text-[clamp(1.5rem,5vw,3.5rem)] font-bold tracking-[0.2em] text-white">
      ${config.title}
    </div>
  </div>
</VelvetNoise>`;

  return (
    <div className="flex flex-col gap-5">
      <div id="velvet-noise-title">
        <HeaderText text="Velvet Noise" option={3} />
      </div>
      <ParagraphText
        text="A luxurious, organic simplex-noise background component using customized GLSL fragment shaders. Allows smooth chromatic aberration (RGB shifting), grid segmentation, and multi-layered speed distortion for premium dark-themed UI overlays."
        option={4}
      />

      <div id="preview">
        <PreviewTab
          previewContent={
            <VelvetNoise
              key={key}
              cells={config.cells}
              stripes={config.stripes}
              speed={config.speed}
              chromatic={config.chromatic}
              colorBg={config.colorBg}
              colorFg={config.colorFg}
              isPlaying={config.isPlaying}
              dpr={config.dpr}
              className="w-full h-[500px] border border-white/5 rounded-xl cursor-pointer"
            >
              <div className="flex flex-col items-center gap-3 text-center px-6" style={{ pointerEvents: "none" }}>
                <div className="text-[clamp(2.5rem,7vw,5rem)] font-extrabold tracking-tighter text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.5)] mix-blend-overlay">
                  {config.title}
                </div>
              </div>
            </VelvetNoise>
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
                value={presets.find((p) => p.config.colorBg === config.colorBg && p.config.colorFg === config.colorFg && p.config.cells === config.cells)?.id || ""}
                onChange={applyPreset}
                dynamicWidth={true}
              />
              <div className="flex items-center gap-3" />
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
            label="Playback Enabled"
            checked={config.isPlaying}
            onChange={(val) => updateConfig("isPlaying", val)}
          />

          <DiscreteSlider2
            label="Grid Cells"
            min={1.0}
            max={20.0}
            step={0.5}
            value={config.cells}
            onChange={(val) => updateConfig("cells", val)}
            maxDecimals={1}
            showTicks={true}
          />

          <DiscreteSlider2
            label="Stripe Density"
            min={5.0}
            max={150.0}
            step={1.0}
            value={config.stripes}
            onChange={(val) => updateConfig("stripes", val)}
            maxDecimals={0}
            showTicks={true}
          />

          <DiscreteSlider2
            label="Flow Speed"
            min={0.0}
            max={3.0}
            step={0.05}
            value={config.speed}
            onChange={(val) => updateConfig("speed", val)}
            maxDecimals={2}
            showTicks={true}
          />

          <DiscreteSlider2
            label="RGB Chromatic Shift"
            min={0.0}
            max={1.0}
            step={0.01}
            value={config.chromatic}
            onChange={(val) => updateConfig("chromatic", val)}
            maxDecimals={2}
            showTicks={true}
          />

          <DefaultComboBox
            label="Resolution Scale"
            options={dprOptions}
            value={String(config.dpr)}
            onChange={(val) => updateConfig("dpr", parseFloat(val))}
            dynamicWidth={true}
          />

          <ColorPicker
            label="Deep Base Shade"
            value={config.colorBg}
            onChange={(val) => updateConfig("colorBg", val)}
            compact={true}
          />

          <ColorPicker
            label="Accent Ripple Shade"
            value={config.colorFg}
            onChange={(val) => updateConfig("colorFg", val)}
            compact={true}
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

export default VelvetNoisePage;
