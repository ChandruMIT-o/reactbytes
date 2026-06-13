"use client";

import React, { useState } from "react";
import HeaderText from "../../components/textfields/HeaderText";
import ParagraphText from "../../components/textfields/ParagraphText";
import PreviewTab from "../../components/tabsection/PreviewTab";
import InstallationTabs from "../../components/tabsection/InstallationTabs";
import { PropsTable } from "../../components/table/PropsTable";
import { RotaryCarousel } from "../../meta/carousel/RotaryCarousel/RotaryCarousel";
import { loaderProps, componentCode, creditsData } from "./RotaryCarouselData";
import ColorPicker from "@/app/components/colorpicker/ColorPicker";
import DiscreteSlider2 from "@/app/components/slider/DiscreteSlider2";
import ToggleComponent from "@/app/components/buttongroup/ToggleComponent";
import DefaultComboBox from "@/app/components/combobox/DefaultComboBox";
import { Credits } from "../../components/buttongroup/Credits";

const presets = [
  {
    id: "default",
    label: "Default Obsidian",
    config: {
      springTension: 0.24,
      springDamping: 0.38,
      ringDiameter: 360,
      visualizerLines: 240,
      visualizerAmp: 1.2,
      visualizerSpread: 1.5,
      autoPlaySpeed: 12,
      isPlaying: false,
      waveMode: "surge",
      secondaryColor: "#3b82f6",
      bgSolidColor: "#05020a",
      enableSynth: true,
    },
  },
  {
    id: "cyan",
    label: "Quantum Cyan",
    config: {
      springTension: 0.30,
      springDamping: 0.45,
      ringDiameter: 380,
      visualizerLines: 300,
      visualizerAmp: 1.5,
      visualizerSpread: 1.2,
      autoPlaySpeed: 18,
      isPlaying: true,
      waveMode: "surge",
      secondaryColor: "#06b6d4",
      bgSolidColor: "#02050c",
      enableSynth: true,
    },
  },
  {
    id: "amethyst",
    label: "Deep Amethyst",
    config: {
      springTension: 0.18,
      springDamping: 0.30,
      ringDiameter: 340,
      visualizerLines: 180,
      visualizerAmp: 0.9,
      visualizerSpread: 1.8,
      autoPlaySpeed: 8,
      isPlaying: false,
      waveMode: "ambient",
      secondaryColor: "#a855f7",
      bgSolidColor: "#040108",
      enableSynth: false,
    },
  },
];

const waveModeOptions = [
  { id: "surge", label: "Surge" },
  { id: "ambient", label: "Ambient" },
  { id: "silent", label: "Silent" },
];

export const RotaryCarouselPage = () => {
  const [config, setConfig] = useState(presets[0].config);
  const [key, setKey] = useState(0);

  const applyPreset = (presetId: string) => {
    const preset = presets.find((p) => p.id === presetId);
    if (preset) {
      setConfig(preset.config);
      setKey((prev) => prev + 1);
    }
  };

  const updateConfig = (keyName: string, value: any) => {
    setConfig((prev) => ({ ...prev, [keyName]: value }));
  };

  const usageCode = `<RotaryCarousel
  springTension={${config.springTension}}
  springDamping={${config.springDamping}}
  ringDiameter={${config.ringDiameter}}
  visualizerLines={${config.visualizerLines}}
  visualizerAmp={${config.visualizerAmp}}
  visualizerSpread={${config.visualizerSpread}}
  autoPlaySpeed={${config.autoPlaySpeed}}
  isPlaying={${config.isPlaying}}
  waveMode="${config.waveMode}"
  secondaryColor="${config.secondaryColor}"
  bgSolidColor="${config.bgSolidColor}"
  enableSynth={${config.enableSynth}}
/>`;

  return (
    <div className="flex flex-col gap-5">
      <div id="rotary-carousel-title">
        <HeaderText text="Rotary Dial Carousel" option={3} />
      </div>
      <ParagraphText
        text="A high-fidelity circular dial image carousel utilizing snappy spring-damper rotational physics. Features dynamic radial lines visualization, scroll wheel/drag steering, and localized cyber-HUD telemetry."
        option={4}
      />

      <div id="preview">
        <PreviewTab
          previewContent={
            <div className="w-full min-h-[520px] flex items-center justify-center relative bg-black/80 border border-white/5 rounded-2xl overflow-hidden p-6">
              <RotaryCarousel
                key={key}
                springTension={config.springTension}
                springDamping={config.springDamping}
                ringDiameter={config.ringDiameter}
                visualizerLines={config.visualizerLines}
                visualizerAmp={config.visualizerAmp}
                visualizerSpread={config.visualizerSpread}
                autoPlaySpeed={config.autoPlaySpeed}
                isPlaying={config.isPlaying}
                waveMode={config.waveMode as any}
                secondaryColor={config.secondaryColor}
                bgSolidColor={config.bgSolidColor}
                enableSynth={config.enableSynth}
              />
            </div>
          }
          onReplay={() => setKey((prev) => prev + 1)}
          usageCode={usageCode}
          codeContent={componentCode}
          collapsible={true}
          header={
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <h3 className="text-xs ml-4 font-bold text-rb-accent-1 uppercase">
                  Props
                </h3>
              </div>
              <DefaultComboBox
                options={presets}
                value={presets.find((p) => p.config.secondaryColor === config.secondaryColor && p.config.visualizerLines === config.visualizerLines)?.id || ""}
                onChange={applyPreset}
                dynamicWidth={true}
              />
            </div>
          }
        >
          <DiscreteSlider2
            label="Ring Diameter"
            min={280}
            max={440}
            step={10}
            value={config.ringDiameter}
            onChange={(val) => updateConfig("ringDiameter", val)}
            showTicks={true}
          />

          <DiscreteSlider2
            label="Spring Tension"
            min={0.08}
            max={0.45}
            step={0.02}
            value={config.springTension}
            onChange={(val) => updateConfig("springTension", val)}
            maxDecimals={2}
            showTicks={true}
          />

          <DiscreteSlider2
            label="Spring Damping"
            min={0.15}
            max={0.65}
            step={0.02}
            value={config.springDamping}
            onChange={(val) => updateConfig("springDamping", val)}
            maxDecimals={2}
            showTicks={true}
          />

          <DiscreteSlider2
            label="Visualizer Line Density"
            min={60}
            max={360}
            step={10}
            value={config.visualizerLines}
            onChange={(val) => updateConfig("visualizerLines", val)}
            showTicks={true}
          />

          <DiscreteSlider2
            label="Visualizer Amplitude"
            min={0.4}
            max={2.5}
            step={0.1}
            value={config.visualizerAmp}
            onChange={(val) => updateConfig("visualizerAmp", val)}
            maxDecimals={1}
            showTicks={true}
          />

          <DiscreteSlider2
            label="Visualizer Spread"
            min={0.5}
            max={3.0}
            step={0.1}
            value={config.visualizerSpread}
            onChange={(val) => updateConfig("visualizerSpread", val)}
            maxDecimals={1}
            showTicks={true}
          />

          <DiscreteSlider2
            label="Autoplay Speed"
            min={4}
            max={35}
            step={1}
            value={config.autoPlaySpeed}
            onChange={(val) => updateConfig("autoPlaySpeed", val)}
            showTicks={true}
          />

          <DefaultComboBox
            label="Visualizer Mode"
            options={waveModeOptions}
            value={config.waveMode}
            onChange={(val) => updateConfig("waveMode", val)}
            dynamicWidth={true}
          />

          <ColorPicker
            label="Glow Color"
            value={config.secondaryColor}
            onChange={(val) => updateConfig("secondaryColor", val)}
            compact={true}
          />

          <ColorPicker
            label="Solid Bezel Color"
            value={config.bgSolidColor}
            onChange={(val) => updateConfig("bgSolidColor", val)}
            compact={true}
          />

          <ToggleComponent
            label="Autoplay Active"
            checked={config.isPlaying}
            onChange={(val) => updateConfig("isPlaying", val)}
          />

          <ToggleComponent
            label="Synthesizer Active"
            checked={config.enableSynth}
            onChange={(val) => updateConfig("enableSynth", val)}
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

export default RotaryCarouselPage;
