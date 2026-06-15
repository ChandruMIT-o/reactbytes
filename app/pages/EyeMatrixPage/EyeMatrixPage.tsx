"use client";

import React, { useState } from "react";
import HeaderText from "../../components/textfields/HeaderText";
import ParagraphText from "../../components/textfields/ParagraphText";
import PreviewTab from "../../components/tabsection/PreviewTab";
import InstallationTabs from "../../components/tabsection/InstallationTabs";
import { PropsTable } from "../../components/table/PropsTable";
import { EyeMatrix } from "../../meta/background/dotted/EyeMatrix";
import { loaderProps, componentCode, creditsData } from "./EyeMatrixData";
import { DiscreteSlider2 } from "../../components/slider/DiscreteSlider2";
import { DefaultTextInput } from "../../components/textinput/DefaultTextInput";
import { ToggleComponent } from "../../components/buttongroup/ToggleComponent";
import DefaultComboBox from "@/app/components/combobox/DefaultComboBox";
import { Credits } from "../../components/buttongroup/Credits";
import { RefreshCw, RotateCcw } from "lucide-react";

const presets = [
  {
    id: "monochromeDark",
    label: "Noir Slate (Dark)",
    config: {
      title: "EYE MATRIX LAB",
      eyeCount: 180,
      padding: 4,
      minRadius: 12,
      maxRadius: 65,
      paletteKey: "monochromeDark" as const,
      customBg: "",
      scleraScale: 0.65,
      pupilScale: 0.45,
      pupilStyle: "normal" as const,
      physicsStiffness: 0.12,
      physicsDamping: 0.78,
      blinkingEnabled: true,
      blinkRate: 0.015,
      interactiveMode: "mouse" as const,
      flatBorderEnabled: true,
    },
  },
  {
    id: "monochromeLight",
    label: "Ghostly Silver (Light)",
    config: {
      title: "GHOSTLY SILVER",
      eyeCount: 150,
      padding: 3,
      minRadius: 10,
      maxRadius: 55,
      paletteKey: "monochromeLight" as const,
      customBg: "",
      scleraScale: 0.7,
      pupilScale: 0.5,
      pupilStyle: "cat" as const,
      physicsStiffness: 0.15,
      physicsDamping: 0.82,
      blinkingEnabled: true,
      blinkRate: 0.02,
      interactiveMode: "wander" as const,
      flatBorderEnabled: true,
    },
  },
  {
    id: "monochromeMixed",
    label: "High Contrast Grey",
    config: {
      title: "HIGH CONTRAST GREY",
      eyeCount: 200,
      padding: 5,
      minRadius: 15,
      maxRadius: 70,
      paletteKey: "monochromeMixed" as const,
      customBg: "",
      scleraScale: 0.6,
      pupilScale: 0.4,
      pupilStyle: "sparkle" as const,
      physicsStiffness: 0.1,
      physicsDamping: 0.75,
      blinkingEnabled: true,
      blinkRate: 0.01,
      interactiveMode: "vortex" as const,
      flatBorderEnabled: true,
    },
  },
];

const pupilStyleOptions = [
  { id: "normal", label: "Normal" },
  { id: "cat", label: "Cat Eye" },
  { id: "sparkle", label: "Sparkle" },
  { id: "ring", label: "Ring" },
];

const modeOptions = [
  { id: "mouse", label: "Mouse Tracker" },
  { id: "wander", label: "Organic Wander" },
  { id: "vortex", label: "Vortex Spin" },
];

const paletteOptions = [
  { id: "monochromeDark", label: "Noir Slate" },
  { id: "monochromeLight", label: "Ghostly Silver" },
  { id: "monochromeMixed", label: "High Contrast Grey" },
];

export const EyeMatrixPage = () => {
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

  const handleRandomizePreset = () => {
    updateConfig("eyeCount", Math.floor(Math.random() * 150) + 40);
    updateConfig("padding", Math.floor(Math.random() * 10) + 1);
    updateConfig("minRadius", Math.floor(Math.random() * 15) + 6);
    updateConfig("maxRadius", Math.floor(Math.random() * 80) + 40);
    updateConfig("scleraScale", parseFloat((Math.random() * 0.4 + 0.4).toFixed(2)));
    updateConfig("pupilScale", parseFloat((Math.random() * 0.4 + 0.25).toFixed(2)));
    
    const styles: Array<"normal" | "cat" | "sparkle" | "ring"> = ["normal", "cat", "sparkle", "ring"];
    updateConfig("pupilStyle", styles[Math.floor(Math.random() * styles.length)]);
    setKey((prev) => prev + 1);
  };

  const handleReset = () => {
    applyPreset("monochromeDark");
  };

  const usageCode = `<EyeMatrix
  eyeCount={${config.eyeCount}}
  padding={${config.padding}}
  minRadius={${config.minRadius}}
  maxRadius={${config.maxRadius}}
  paletteKey="${config.paletteKey}"
  customBg="${config.customBg}"
  scleraScale={${config.scleraScale}}
  pupilScale={${config.pupilScale}}
  pupilStyle="${config.pupilStyle}"
  physicsStiffness={${config.physicsStiffness}}
  physicsDamping={${config.physicsDamping}}
  blinkingEnabled={${config.blinkingEnabled}}
  blinkRate={${config.blinkRate}}
  interactiveMode="${config.interactiveMode}"
  flatBorderEnabled={${config.flatBorderEnabled}}
>
  <div className="flex flex-col items-center gap-3 text-center px-6">
    <div className="text-[clamp(1.5rem,5vw,3.5rem)] font-bold tracking-[0.2em] text-white">
      ${config.title}
    </div>
  </div>
</EyeMatrix>`;

  return (
    <div className="flex flex-col gap-5">
      <div id="eye-matrix-title">
        <HeaderText text="Eye Matrix Laboratory" option={3} />
      </div>
      <ParagraphText
        text="An interactive flat-aesthetic grid of packed eye nodes generated in real-time using D3 hierarchy circle-packing. Features spring-physics pupil tracking, custom node scaling, organic wander movements, and random blinking."
        option={4}
      />

      <div id="preview">
        <PreviewTab
          previewContent={
            <EyeMatrix
              key={key}
              eyeCount={config.eyeCount}
              padding={config.padding}
              minRadius={config.minRadius}
              maxRadius={config.maxRadius}
              paletteKey={config.paletteKey}
              customBg={config.customBg}
              scleraScale={config.scleraScale}
              pupilScale={config.pupilScale}
              pupilStyle={config.pupilStyle}
              physicsStiffness={config.physicsStiffness}
              physicsDamping={config.physicsDamping}
              blinkingEnabled={config.blinkingEnabled}
              blinkRate={config.blinkRate}
              interactiveMode={config.interactiveMode}
              flatBorderEnabled={config.flatBorderEnabled}
              className="w-full h-[550px] border border-white/5 rounded-xl cursor-crosshair"
            >
              <div className="flex flex-col items-center gap-3 text-center px-6" style={{ pointerEvents: "none" }}>
                <div className="text-[clamp(2rem,6vw,4.5rem)] font-black tracking-tighter text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)] mix-blend-difference">
                  {config.title}
                </div>
              </div>
            </EyeMatrix>
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
                value={presets.find((p) => p.config.paletteKey === config.paletteKey && p.config.eyeCount === config.eyeCount)?.id || ""}
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

          <DefaultComboBox
            label="Active Palette"
            options={paletteOptions}
            value={config.paletteKey}
            onChange={(val) => updateConfig("paletteKey", val)}
            dynamicWidth={true}
          />

          <DiscreteSlider2
            label="Eye Node Count"
            min={10}
            max={350}
            step={5}
            value={config.eyeCount}
            onChange={(val) => updateConfig("eyeCount", val)}
            maxDecimals={0}
            showTicks={true}
          />

          <DiscreteSlider2
            label="Node Padding"
            min={0}
            max={16}
            step={0.5}
            value={config.padding}
            onChange={(val) => updateConfig("padding", val)}
            maxDecimals={1}
            showTicks={true}
          />

          <DiscreteSlider2
            label="Min Radius"
            min={4}
            max={40}
            step={1}
            value={config.minRadius}
            onChange={(val) => updateConfig("minRadius", val)}
            maxDecimals={0}
            showTicks={true}
          />

          <DiscreteSlider2
            label="Max Radius"
            min={20}
            max={180}
            step={2}
            value={config.maxRadius}
            onChange={(val) => updateConfig("maxRadius", val)}
            maxDecimals={0}
            showTicks={true}
          />

          <DefaultComboBox
            label="Behavior Mode"
            options={modeOptions}
            value={config.interactiveMode}
            onChange={(val) => updateConfig("interactiveMode", val)}
            dynamicWidth={true}
          />

          <DiscreteSlider2
            label="White Globe Size"
            min={0.2}
            max={0.85}
            step={0.01}
            value={config.scleraScale}
            onChange={(val) => updateConfig("scleraScale", val)}
            maxDecimals={2}
            showTicks={true}
          />

          <DiscreteSlider2
            label="Pupil Iris Size"
            min={0.15}
            max={0.8}
            step={0.01}
            value={config.pupilScale}
            onChange={(val) => updateConfig("pupilScale", val)}
            maxDecimals={2}
            showTicks={true}
          />

          <DefaultComboBox
            label="Pupil Shape"
            options={pupilStyleOptions}
            value={config.pupilStyle}
            onChange={(val) => updateConfig("pupilStyle", val)}
            dynamicWidth={true}
          />

          <DiscreteSlider2
            label="Pupil Weight (Stiffness)"
            min={0.01}
            max={0.4}
            step={0.01}
            value={config.physicsStiffness}
            onChange={(val) => updateConfig("physicsStiffness", val)}
            maxDecimals={2}
            showTicks={true}
          />

          <DiscreteSlider2
            label="Bounce Damping"
            min={0.4}
            max={0.95}
            step={0.01}
            value={config.physicsDamping}
            onChange={(val) => updateConfig("physicsDamping", val)}
            maxDecimals={2}
            showTicks={true}
          />

          <ToggleComponent
            label="Natural Eye Blinking"
            checked={config.blinkingEnabled}
            onChange={(val) => updateConfig("blinkingEnabled", val)}
          />

          <DiscreteSlider2
            label="Blink Probability"
            min={0.005}
            max={0.1}
            step={0.005}
            value={config.blinkRate}
            onChange={(val) => updateConfig("blinkRate", val)}
            maxDecimals={3}
            showTicks={true}
          />

          <ToggleComponent
            label="Node borders"
            checked={config.flatBorderEnabled}
            onChange={(val) => updateConfig("flatBorderEnabled", val)}
          />

          <DefaultTextInput
            label="Hex Bg Override"
            value={config.customBg}
            onChange={(val) => updateConfig("customBg", val)}
            placeholder="e.g. #0a0a0c..."
          />

          <div className="flex flex-col gap-1 select-none font-sans w-full">
            <span className="text-[8px] font-bold uppercase tracking-[0.15em] text-rb-accent-2/40 leading-none mb-1">Randomizer</span>
            <button
              type="button"
              onClick={handleRandomizePreset}
              className="w-full py-3.5 px-4 rounded-full bg-rb-neutral-3 hover:bg-rb-neutral-4 text-rb-accent-1 hover:text-white transition-all text-xs font-semibold flex items-center justify-center gap-2 border border-rb-neutral-4 active:scale-95 duration-150"
            >
              <RefreshCw size={14} className="text-indigo-400" />
              <span>Surprise Presets</span>
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

export default EyeMatrixPage;
