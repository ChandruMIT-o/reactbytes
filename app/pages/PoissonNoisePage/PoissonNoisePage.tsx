"use client";

import React, { useState } from "react";
import HeaderText from "../../components/textfields/HeaderText";
import ParagraphText from "../../components/textfields/ParagraphText";
import PreviewTab from "../../components/tabsection/PreviewTab";
import InstallationTabs from "../../components/tabsection/InstallationTabs";
import { PropsTable } from "../../components/table/PropsTable";
import { PoissonNoise } from "../../meta/background/dotted/PoissonNoise";
import { loaderProps, componentCode, creditsData } from "./PoissonNoiseData";
import { DiscreteSlider2 } from "../../components/slider/DiscreteSlider2";
import { ToggleComponent } from "../../components/buttongroup/ToggleComponent";
import DefaultComboBox from "@/app/components/combobox/DefaultComboBox";
import { Credits } from "../../components/buttongroup/Credits";

const presets = [
  {
    id: "constellation",
    label: "Stellar",
    config: {
      renderMode: "constellation" as const,
      colorTheme: "cyberpunk" as const,
      minRadius: 12,
      maxRadius: 40,
      noiseScale: 0.003,
      noiseStrength: 2.5,
      driftSpeed: 0.02,
      maxParticles: 800,
      mouseInfluence: "attract" as const,
      mouseRadius: 220,
      mouseIntensity: 1.2,
      isPlaying: true,
    }
  },
  {
    id: "cellular",
    label: "Cellular",
    config: {
      renderMode: "circles" as const,
      colorTheme: "nebula" as const,
      minRadius: 5,
      maxRadius: 25,
      noiseScale: 0.003,
      noiseStrength: 1.5,
      driftSpeed: 0.01,
      maxParticles: 800,
      mouseInfluence: "repel" as const,
      mouseRadius: 140,
      mouseIntensity: 1.0,
      isPlaying: true,
    }
  },
  {
    id: "hyperforce",
    label: "Hyper Force",
    config: {
      renderMode: "hybrid" as const,
      colorTheme: "solarized" as const,
      minRadius: 8,
      maxRadius: 35,
      noiseScale: 0.003,
      noiseStrength: 3.0,
      driftSpeed: 0.025,
      maxParticles: 800,
      mouseInfluence: "repel" as const,
      mouseRadius: 250,
      mouseIntensity: 1.8,
      isPlaying: true,
    }
  }
];

const renderModeOptions = [
  { id: "dots", label: "Nodes (Dots)" },
  { id: "circles", label: "Pack Circles" },
  { id: "constellation", label: "Constellation" },
  { id: "hybrid", label: "Hybrid View" }
];

const colorThemeOptions = [
  { id: "monochrome", label: "Pure Monochrome" },
  { id: "solarized", label: "Solar Amber" },
  { id: "nebula", label: "Deep Nebula" },
  { id: "cyberpunk", label: "Cyber Neon" }
];

const mouseInfluenceOptions = [
  { id: "repel", label: "Repel Particles" },
  { id: "attract", label: "Attract Particles" },
  { id: "scaleUp", label: "Scale Up Size" },
  { id: "scaleDown", label: "Scale Down Size" },
  { id: "none", label: "No Influence" }
];

export const PoissonNoisePage = () => {
  const [config, setConfig] = useState(presets[0].config);
  const [nodeCount, setNodeCount] = useState(0);
  const [currentPreset, setCurrentPreset] = useState("constellation");
  const [key, setKey] = useState(0);

  const applyPreset = (presetId: string) => {
    const preset = presets.find((p) => p.id === presetId);
    if (preset) {
      setCurrentPreset(presetId);
      setConfig(preset.config);
    }
  };

  const updateConfig = (keyName: string, value: any) => {
    setCurrentPreset("");
    setConfig((prev) => ({ ...prev, [keyName]: value }));
  };

  const handleReplay = () => {
    setKey((prev) => prev + 1);
  };

  const usageCode = `<PoissonNoise
  renderMode="${config.renderMode}"
  colorTheme="${config.colorTheme}"
  minRadius={${config.minRadius}}
  maxRadius={${config.maxRadius}}
  noiseScale={${config.noiseScale}}
  noiseStrength={${config.noiseStrength}}
  driftSpeed={${config.driftSpeed}}
  maxParticles={${config.maxParticles}}
  mouseInfluence="${config.mouseInfluence}"
  mouseRadius={${config.mouseRadius}}
  mouseIntensity={${config.mouseIntensity}}
  isPlaying={${config.isPlaying}}
/>`;

  return (
    <div className="flex flex-col gap-5">
      <div id="poisson-noise-title">
        <HeaderText text="Poisson Disc Noise" option={3} />
      </div>
      <ParagraphText
        text="A visual noise experiment driven by dynamic Poisson-disc spacing constraints. Distribute nodes using natural gradient frequencies, producing mathematically perfect circular forms regardless of preview shape. Hover/touch to alter spatial forces."
        option={4}
      />

      <div id="preview">
        <PreviewTab
          previewContent={
            <div className="w-full h-[600px] relative overflow-hidden rounded-xl border border-white/5 bg-black">
              <PoissonNoise
                key={key}
                {...config}
                onNodeCountChange={setNodeCount}
                className="absolute inset-0"
              >

              </PoissonNoise>
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
                  Props
                </h3>
              </div>
              <DefaultComboBox
                options={presets}
                value={currentPreset}
                onChange={applyPreset}
                dynamicWidth={true}
                placeholder="Choose Preset..."
                label="PRESETS"
              />
            </div>
          }
        >
          <DefaultComboBox
            label="Render Mode"
            options={renderModeOptions}
            value={config.renderMode}
            onChange={(val) => updateConfig("renderMode", val)}
            dynamicWidth={true}
          />

          <DefaultComboBox
            label="Color Theme"
            options={colorThemeOptions}
            value={config.colorTheme}
            onChange={(val) => updateConfig("colorTheme", val)}
            dynamicWidth={true}
          />

          <DefaultComboBox
            label="Cursor Influence"
            options={mouseInfluenceOptions}
            value={config.mouseInfluence}
            onChange={(val) => updateConfig("mouseInfluence", val)}
            dynamicWidth={true}
          />

          <DiscreteSlider2
            label="Min Radius"
            min={4}
            max={15}
            step={1}
            value={config.minRadius}
            onChange={(val) => updateConfig("minRadius", val)}
            showTicks={true}
          />

          <DiscreteSlider2
            label="Max Radius"
            min={16}
            max={65}
            step={1}
            value={config.maxRadius}
            onChange={(val) => updateConfig("maxRadius", val)}
            showTicks={true}
          />

          <DiscreteSlider2
            label="Max Particles"
            min={200}
            max={1200}
            step={50}
            value={config.maxParticles}
            onChange={(val) => updateConfig("maxParticles", val)}
            showTicks={true}
          />

          <DiscreteSlider2
            label="Noise Scale"
            min={0.001}
            max={0.010}
            step={0.0005}
            value={config.noiseScale}
            onChange={(val) => updateConfig("noiseScale", val)}
            maxDecimals={4}
            showTicks={true}
          />

          <DiscreteSlider2
            label="Noise Strength"
            min={0.5}
            max={5.0}
            step={0.1}
            value={config.noiseStrength}
            onChange={(val) => updateConfig("noiseStrength", val)}
            maxDecimals={1}
            showTicks={true}
          />

          <DiscreteSlider2
            label="Drift Speed"
            min={0.001}
            max={0.050}
            step={0.001}
            value={config.driftSpeed}
            onChange={(val) => updateConfig("driftSpeed", val)}
            maxDecimals={3}
            showTicks={true}
          />

          <DiscreteSlider2
            label="Cursor Radius"
            min={50}
            max={400}
            step={10}
            value={config.mouseRadius}
            onChange={(val) => updateConfig("mouseRadius", val)}
            showTicks={true}
          />

          <DiscreteSlider2
            label="Cursor Intensity"
            min={0.1}
            max={3.0}
            step={0.1}
            value={config.mouseIntensity}
            onChange={(val) => updateConfig("mouseIntensity", val)}
            maxDecimals={1}
            showTicks={true}
          />

          <ToggleComponent
            label="Active Simulation"
            checked={config.isPlaying}
            onChange={(val) => updateConfig("isPlaying", val)}
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

export default PoissonNoisePage;
