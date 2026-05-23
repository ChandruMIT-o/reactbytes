"use client";

import React, { useState } from "react";
import HeaderText from "../../components/textfields/HeaderText";
import ParagraphText from "../../components/textfields/ParagraphText";
import PreviewTab from "../../components/tabsection/PreviewTab";
import InstallationTabs from "../../components/tabsection/InstallationTabs";
import { PropsTable } from "../../components/table/PropsTable";
import ConcentricWaves from "../../meta/background/wave/ConcentricWaves/ConcentricWaves";
import { loaderProps, componentCode, creditsData } from "./ConcentricWavesData";
import DiscreteSlider2 from "@/app/components/slider/DiscreteSlider2";
import DefaultComboBox from "@/app/components/combobox/DefaultComboBox";
import { Credits } from "../../components/buttongroup/Credits";
import { RotateCcw } from "lucide-react";

const presets = [
  {
    id: "default",
    label: "Default Cyan-Purple",
    config: {
      layerCount: 16,
      ringSpacing: 45,
      baseRadiusStart: 40,
      pulseSpeedMultiplier: 1.0,
      spinDurationMs: 2500,
      minOpacity: 0.4,
      maxOpacity: 0.9,
      minThickness: 4,
      maxThickness: 16,
      mainGradientColors: ['#5ddcff', '#3c67e3', '#4e00c2'] as [string, string, string],
      midGradientColors: ['#f3f4f6', '#9ca3af', '#374151'] as [string, string, string],
      bgColor: '#05080f',
    },
  },
  {
    id: "sunset",
    label: "Sunset Glow",
    config: {
      layerCount: 12,
      ringSpacing: 50,
      baseRadiusStart: 30,
      pulseSpeedMultiplier: 0.8,
      spinDurationMs: 4000,
      minOpacity: 0.5,
      maxOpacity: 1.0,
      minThickness: 2,
      maxThickness: 20,
      mainGradientColors: ['#ff7b00', '#ff0055', '#7a00ff'] as [string, string, string],
      midGradientColors: ['#ffe4b5', '#ff8c00', '#8b0000'] as [string, string, string],
      bgColor: '#0a0005',
    },
  },
  {
    id: "matrix",
    label: "Digital Matrix",
    config: {
      layerCount: 20,
      ringSpacing: 30,
      baseRadiusStart: 20,
      pulseSpeedMultiplier: 1.5,
      spinDurationMs: 1500,
      minOpacity: 0.2,
      maxOpacity: 0.8,
      minThickness: 1,
      maxThickness: 8,
      mainGradientColors: ['#00ff41', '#008f11', '#003b00'] as [string, string, string],
      midGradientColors: ['#aaffaa', '#00ff41', '#008f11'] as [string, string, string],
      bgColor: '#000500',
    },
  },
  {
    id: "minimalist",
    label: "Minimalist Grayscale",
    config: {
      layerCount: 10,
      ringSpacing: 60,
      baseRadiusStart: 50,
      pulseSpeedMultiplier: 0.5,
      spinDurationMs: 6000,
      minOpacity: 0.1,
      maxOpacity: 0.5,
      minThickness: 1,
      maxThickness: 5,
      mainGradientColors: ['#ffffff', '#888888', '#222222'] as [string, string, string],
      midGradientColors: ['#eeeeee', '#aaaaaa', '#444444'] as [string, string, string],
      bgColor: '#000000',
    },
  },
];

export const ConcentricWavesPage = () => {
  const [layerCount, setLayerCount] = useState(presets[0].config.layerCount);
  const [ringSpacing, setRingSpacing] = useState(presets[0].config.ringSpacing);
  const [baseRadiusStart, setBaseRadiusStart] = useState(presets[0].config.baseRadiusStart);
  const [pulseSpeedMultiplier, setPulseSpeedMultiplier] = useState(presets[0].config.pulseSpeedMultiplier);
  const [spinDurationMs, setSpinDurationMs] = useState(presets[0].config.spinDurationMs);
  const [minOpacity, setMinOpacity] = useState(presets[0].config.minOpacity);
  const [maxOpacity, setMaxOpacity] = useState(presets[0].config.maxOpacity);
  const [minThickness, setMinThickness] = useState(presets[0].config.minThickness);
  const [maxThickness, setMaxThickness] = useState(presets[0].config.maxThickness);
  
  const [mainGradientColors, setMainGradientColors] = useState(presets[0].config.mainGradientColors);
  const [midGradientColors, setMidGradientColors] = useState(presets[0].config.midGradientColors);
  const [bgColor, setBgColor] = useState(presets[0].config.bgColor);

  const [currentPreset, setCurrentPreset] = useState("default");
  const [key, setKey] = useState(0);

  const applyPreset = (presetId: string) => {
    const preset = presets.find((p) => p.id === presetId);
    if (preset) {
      setCurrentPreset(presetId);
      setLayerCount(preset.config.layerCount);
      setRingSpacing(preset.config.ringSpacing);
      setBaseRadiusStart(preset.config.baseRadiusStart);
      setPulseSpeedMultiplier(preset.config.pulseSpeedMultiplier);
      setSpinDurationMs(preset.config.spinDurationMs);
      setMinOpacity(preset.config.minOpacity);
      setMaxOpacity(preset.config.maxOpacity);
      setMinThickness(preset.config.minThickness);
      setMaxThickness(preset.config.maxThickness);
      setMainGradientColors(preset.config.mainGradientColors);
      setMidGradientColors(preset.config.midGradientColors);
      setBgColor(preset.config.bgColor);
      setKey((prev) => prev + 1);
    }
  };

  const handleReset = () => {
    applyPreset("default");
  };

  const usageCode = `<ConcentricWaves
  layerCount={${layerCount}}
  ringSpacing={${ringSpacing}}
  baseRadiusStart={${baseRadiusStart}}
  pulseSpeedMultiplier={${pulseSpeedMultiplier.toFixed(2)}}
  spinDurationMs={${spinDurationMs}}
  minOpacity={${minOpacity.toFixed(2)}}
  maxOpacity={${maxOpacity.toFixed(2)}}
  minThickness={${minThickness}}
  maxThickness={${maxThickness}}
  mainGradientColors={['${mainGradientColors.join("', '")}']}
  midGradientColors={['${midGradientColors.join("', '")}']}
  bgColor="${bgColor}"
/>`;

  return (
    <div className="flex flex-col gap-5">
      <div id="concentric-waves-title">
        <HeaderText text="Concentric Waves" option={3} />
      </div>
      <ParagraphText
        text="A high-performance HTML5 Canvas background animation featuring pulsing, rotating, and color-shifting concentric rings."
        option={4}
      />

      <div id="preview">
        <PreviewTab
          previewContent={
            <div className="w-full h-[500px] relative overflow-hidden flex items-center justify-center">
              <ConcentricWaves
                key={key}
                layerCount={layerCount}
                ringSpacing={ringSpacing}
                baseRadiusStart={baseRadiusStart}
                pulseSpeedMultiplier={pulseSpeedMultiplier}
                spinDurationMs={spinDurationMs}
                minOpacity={minOpacity}
                maxOpacity={maxOpacity}
                minThickness={minThickness}
                maxThickness={maxThickness}
                mainGradientColors={mainGradientColors}
                midGradientColors={midGradientColors}
                bgColor={bgColor}
                className="absolute inset-0 w-full h-full z-0"
              />
            </div>
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
            label="Layer Count"
            min={4}
            max={30}
            step={1}
            value={layerCount}
            onChange={setLayerCount}
            maxDecimals={0}
            showTicks={false}
          />
          <DiscreteSlider2
            label="Ring Spacing"
            min={10}
            max={100}
            step={1}
            value={ringSpacing}
            onChange={setRingSpacing}
            maxDecimals={0}
            showTicks={false}
          />
          <DiscreteSlider2
            label="Base Radius Start"
            min={10}
            max={100}
            step={1}
            value={baseRadiusStart}
            onChange={setBaseRadiusStart}
            maxDecimals={0}
            showTicks={false}
          />
          <DiscreteSlider2
            label="Pulse Speed"
            min={0.1}
            max={5.0}
            step={0.1}
            value={pulseSpeedMultiplier}
            onChange={setPulseSpeedMultiplier}
            maxDecimals={2}
            showTicks={false}
          />
          <DiscreteSlider2
            label="Spin Duration (ms)"
            min={500}
            max={10000}
            step={100}
            value={spinDurationMs}
            onChange={setSpinDurationMs}
            maxDecimals={0}
            showTicks={false}
          />
          <DiscreteSlider2
            label="Min Opacity"
            min={0.0}
            max={1.0}
            step={0.1}
            value={minOpacity}
            onChange={setMinOpacity}
            maxDecimals={2}
            showTicks={false}
          />
          <DiscreteSlider2
            label="Max Opacity"
            min={0.0}
            max={1.0}
            step={0.1}
            value={maxOpacity}
            onChange={setMaxOpacity}
            maxDecimals={2}
            showTicks={false}
          />
          <DiscreteSlider2
            label="Min Thickness"
            min={1}
            max={10}
            step={1}
            value={minThickness}
            onChange={setMinThickness}
            maxDecimals={0}
            showTicks={false}
          />
          <DiscreteSlider2
            label="Max Thickness"
            min={1}
            max={30}
            step={1}
            value={maxThickness}
            onChange={setMaxThickness}
            maxDecimals={0}
            showTicks={false}
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

export default ConcentricWavesPage;
