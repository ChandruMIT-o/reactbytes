"use client";

import React, { useState } from "react";
import HeaderText from "../../components/textfields/HeaderText";
import ParagraphText from "../../components/textfields/ParagraphText";
import PreviewTab from "../../components/tabsection/PreviewTab";
import InstallationTabs from "../../components/tabsection/InstallationTabs";
import { PropsTable } from "../../components/table/PropsTable";
import { LiquidGrid } from "../../meta/background/liquid/LiquidGrid";
import { loaderProps, componentCode, creditsData } from "./LiquidGridData";
import { DiscreteSlider2 } from "../../components/slider/DiscreteSlider2";
import { ToggleComponent } from "../../components/buttongroup/ToggleComponent";
import DefaultComboBox from "@/app/components/combobox/DefaultComboBox";
import ColorPicker from "../../components/colorpicker/ColorPicker";
import { Credits } from "../../components/buttongroup/Credits";

const presets = [
  {
    id: "liquid-mercury",
    label: "🪙 Liquid Mercury",
    config: {
      cols: 9,
      rows: 9,
      spacing: 56,
      baseRadius: 12,
      springK: 0.09,
      damp: 0.78,
      gravityRadius: 210,
      gravityMax: 20,
      rowDelay: 0.055,
      bounceAmp: 12,
      decay: 4.2,
      freq: 13.0,
      colSpread: 0.65,
      blur: 8,
      contrast: 28,
      dotColor: "#ffffff",
      bgColor: "#000000",
      autoDrops: true
    }
  },
  {
    id: "molten-lava",
    label: "🌋 Molten Lava",
    config: {
      cols: 10,
      rows: 10,
      spacing: 50,
      baseRadius: 15,
      springK: 0.05,
      damp: 0.85,
      gravityRadius: 250,
      gravityMax: 35,
      rowDelay: 0.08,
      bounceAmp: 22,
      decay: 2.8,
      freq: 8.5,
      colSpread: 0.45,
      blur: 11,
      contrast: 24,
      dotColor: "#ff3700",
      bgColor: "#0d0200",
      autoDrops: true
    }
  },
  {
    id: "neon-matrix",
    label: "🟢 Neon Matrix",
    config: {
      cols: 13,
      rows: 13,
      spacing: 44,
      baseRadius: 7,
      springK: 0.16,
      damp: 0.70,
      gravityRadius: 140,
      gravityMax: 45,
      rowDelay: 0.035,
      bounceAmp: 8,
      decay: 5.5,
      freq: 22.0,
      colSpread: 1.1,
      blur: 3,
      contrast: 16,
      dotColor: "#39ff14",
      bgColor: "#020702",
      autoDrops: true
    }
  },
  {
    id: "cyber-plastik",
    label: "💖 Cyber Plastik",
    config: {
      cols: 8,
      rows: 8,
      spacing: 68,
      baseRadius: 20,
      springK: 0.07,
      damp: 0.80,
      gravityRadius: 280,
      gravityMax: -30, // Repulsion force!
      rowDelay: 0.06,
      bounceAmp: 28,
      decay: 2.2,
      freq: 7.0,
      colSpread: 0.5,
      blur: 14,
      contrast: 38,
      dotColor: "#e0007b",
      bgColor: "#020005",
      autoDrops: true
    }
  },
  {
    id: "jellyfish-bloom",
    label: "🪼 Jellyfish Bloom",
    config: {
      cols: 8,
      rows: 14,
      spacing: 42,
      baseRadius: 9,
      springK: 0.04,
      damp: 0.92,
      gravityRadius: 190,
      gravityMax: 28,
      rowDelay: 0.14,
      bounceAmp: 16,
      decay: 1.8,
      freq: 5.5,
      colSpread: 0.35,
      blur: 9,
      contrast: 21,
      dotColor: "#00f0ff",
      bgColor: "#020212",
      autoDrops: true
    }
  }
];

export const LiquidGridPage = () => {
  const [config, setConfig] = useState(presets[0].config);
  const [currentPreset, setCurrentPreset] = useState("liquid-mercury");
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

  const usageCode = `<LiquidGrid
  cols={${config.cols}}
  rows={${config.rows}}
  spacing={${config.spacing}}
  baseRadius={${config.baseRadius}}
  springK={${config.springK}}
  damp={${config.damp}}
  gravityRadius={${config.gravityRadius}}
  gravityMax={${config.gravityMax}}
  rowDelay={${config.rowDelay}}
  bounceAmp={${config.bounceAmp}}
  decay={${config.decay}}
  freq={${config.freq}}
  colSpread={${config.colSpread}}
  blur={${config.blur}}
  contrast={${config.contrast}}
  dotColor="${config.dotColor}"
  bgColor="${config.bgColor}"
  autoDrops={${config.autoDrops}}
/>`;

  return (
    <div className="flex flex-col gap-5">
      <div id="liquid-grid-title">
        <HeaderText text="Liquid Grid" option={3} />
      </div>
      <ParagraphText
        text="An interactive physics-based canvas simulation displaying a grid of elastic nodes that respond to cursor displacement and propagates vertical ripple wave cascading. Uses a strong CSS blur and contrast filter pair to achieve organic, gooey liquid fluid dynamics."
        option={4}
      />

      <div id="preview">
        <PreviewTab
          previewContent={
            <div className="w-full h-[600px] relative overflow-hidden rounded-xl border border-white/5 bg-black">
              <LiquidGrid
                key={key}
                {...config}
                className="absolute inset-0"
              />
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
              />
            </div>
          }
        >
          {/* Grid Layout Controls */}
          <DiscreteSlider2
            label="Grid Columns"
            min={3}
            max={22}
            step={1}
            value={config.cols}
            onChange={(val) => updateConfig("cols", val)}
            showTicks={true}
          />

          <DiscreteSlider2
            label="Grid Rows"
            min={3}
            max={22}
            step={1}
            value={config.rows}
            onChange={(val) => updateConfig("rows", val)}
            showTicks={true}
          />

          <DiscreteSlider2
            label="Node Spacing"
            min={20}
            max={110}
            step={1}
            value={config.spacing}
            onChange={(val) => updateConfig("spacing", val)}
            showTicks={true}
          />

          <DiscreteSlider2
            label="Resting Radius"
            min={3}
            max={35}
            step={1}
            value={config.baseRadius}
            onChange={(val) => updateConfig("baseRadius", val)}
            showTicks={true}
          />

          {/* Elasticity & Force Controls */}
          <DiscreteSlider2
            label="Spring Tension (K)"
            min={0.01}
            max={0.45}
            step={0.005}
            value={config.springK}
            onChange={(val) => updateConfig("springK", val)}
            maxDecimals={3}
            showTicks={true}
          />

          <DiscreteSlider2
            label="Motion Friction (Damping)"
            min={0.40}
            max={0.98}
            step={0.01}
            value={config.damp}
            onChange={(val) => updateConfig("damp", val)}
            maxDecimals={2}
            showTicks={true}
          />

          <DiscreteSlider2
            label="Cursor Pull Radius"
            min={50}
            max={500}
            step={5}
            value={config.gravityRadius}
            onChange={(val) => updateConfig("gravityRadius", val)}
            showTicks={true}
          />

          <DiscreteSlider2
            label="Cursor Displacement Force"
            min={-60}
            max={80}
            step={2}
            value={config.gravityMax}
            onChange={(val) => updateConfig("gravityMax", val)}
            showTicks={true}
          />

          {/* Ripple Wave Mechanics Controls */}
          <DiscreteSlider2
            label="Ripple Amplitude"
            min={2}
            max={60}
            step={1}
            value={config.bounceAmp}
            onChange={(val) => updateConfig("bounceAmp", val)}
            showTicks={true}
          />

          <DiscreteSlider2
            label="Wave Row Delay"
            min={0.010}
            max={0.250}
            step={0.005}
            value={config.rowDelay}
            onChange={(val) => updateConfig("rowDelay", val)}
            maxDecimals={3}
            showTicks={true}
          />

          <DiscreteSlider2
            label="Envelope Decay Rate"
            min={0.5}
            max={9.0}
            step={0.1}
            value={config.decay}
            onChange={(val) => updateConfig("decay", val)}
            maxDecimals={1}
            showTicks={true}
          />

          <DiscreteSlider2
            label="Oscillation Frequency"
            min={3.0}
            max={30.0}
            step={0.5}
            value={config.freq}
            onChange={(val) => updateConfig("freq", val)}
            maxDecimals={1}
            showTicks={true}
          />

          <DiscreteSlider2
            label="Lateral Gaussian Dispersion"
            min={0.10}
            max={2.00}
            step={0.05}
            value={config.colSpread}
            onChange={(val) => updateConfig("colSpread", val)}
            maxDecimals={2}
            showTicks={true}
          />

          {/* Aesthetics & Rendering Controls */}
          <DiscreteSlider2
            label="Renderer Blur Radius"
            min={0}
            max={25}
            step={1}
            value={config.blur}
            onChange={(val) => updateConfig("blur", val)}
            showTicks={true}
          />

          <DiscreteSlider2
            label="Meta-threshold Contrast"
            min={1}
            max={50}
            step={1}
            value={config.contrast}
            onChange={(val) => updateConfig("contrast", val)}
            showTicks={true}
          />

          <ColorPicker
            label="Fluid Liquid Color"
            value={config.dotColor}
            onChange={(val) => updateConfig("dotColor", val)}
          />

          <ColorPicker
            label="Substrate Background Color"
            value={config.bgColor}
            onChange={(val) => updateConfig("bgColor", val)}
          />

          <ToggleComponent
            label="Spontaneous Ripples"
            checked={config.autoDrops}
            onChange={(val) => updateConfig("autoDrops", val)}
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

export default LiquidGridPage;
