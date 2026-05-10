"use client";

import React, { useState } from "react";
import HeaderText from "../../components/textfields/HeaderText";
import ParagraphText from "../../components/textfields/ParagraphText";
import PreviewTab from "../../components/tabsection/PreviewTab";
import InstallationTabs from "../../components/tabsection/InstallationTabs";
import { PropsTable } from "../../components/table/PropsTable";
import Kaleidoscopic from "../../meta/background/fractal/Kaleidoscopic";
import { loaderProps, componentCode, creditsData } from "./KaleidoscopicData";
import DiscreteSlider2 from "@/app/components/slider/DiscreteSlider2";
import DefaultComboBox from "@/app/components/combobox/DefaultComboBox";
import { Credits } from "../../components/buttongroup/Credits";
import { RotateCcw } from "lucide-react";

const presets = [
  {
    id: "default",
    label: "Default Neon",
    config: {
      iterations: 4,
      scale: 1.3,
      timeMultiplier: 1.0,
      rotationSpeed: 0.05,
      glowIntensity: 0.012,
      waveFrequency: 8.0,
      colorA: [0.5, 0.5, 0.5] as [number, number, number],
      colorB: [0.5, 0.5, 0.5] as [number, number, number],
      colorC: [1.0, 1.0, 1.0] as [number, number, number],
      colorD: [0.263, 0.416, 0.557] as [number, number, number],
    },
  },
  {
    id: "cyberpunk",
    label: "Cyberpunk",
    config: {
      iterations: 5,
      scale: 1.5,
      timeMultiplier: 1.5,
      rotationSpeed: -0.1,
      glowIntensity: 0.02,
      waveFrequency: 12.0,
      colorA: [0.8, 0.5, 0.4] as [number, number, number],
      colorB: [0.2, 0.4, 0.2] as [number, number, number],
      colorC: [2.0, 1.0, 1.0] as [number, number, number],
      colorD: [0.0, 0.25, 0.25] as [number, number, number],
    },
  },
  {
    id: "gold",
    label: "Gold Elegance",
    config: {
      iterations: 3,
      scale: 1.1,
      timeMultiplier: 0.8,
      rotationSpeed: 0.03,
      glowIntensity: 0.008,
      waveFrequency: 5.0,
      colorA: [0.5, 0.5, 0.5] as [number, number, number],
      colorB: [0.5, 0.5, 0.5] as [number, number, number],
      colorC: [1.0, 0.7, 0.4] as [number, number, number],
      colorD: [0.0, 0.15, 0.2] as [number, number, number],
    },
  },
  {
    id: "void",
    label: "Deep Void",
    config: {
      iterations: 6,
      scale: 2.0,
      timeMultiplier: 0.5,
      rotationSpeed: 0.01,
      glowIntensity: 0.005,
      waveFrequency: 2.0,
      colorA: [0.1, 0.1, 0.1] as [number, number, number],
      colorB: [1.0, 1.0, 1.0] as [number, number, number],
      colorC: [0.5, 0.5, 0.5] as [number, number, number],
      colorD: [0.3, 0.2, 0.8] as [number, number, number],
    },
  },
];

export const KaleidoscopicPage = () => {
  const [iterations, setIterations] = useState(presets[0].config.iterations);
  const [scale, setScale] = useState(presets[0].config.scale);
  const [timeMultiplier, setTimeMultiplier] = useState(presets[0].config.timeMultiplier);
  const [rotationSpeed, setRotationSpeed] = useState(presets[0].config.rotationSpeed);
  const [glowIntensity, setGlowIntensity] = useState(presets[0].config.glowIntensity);
  const [waveFrequency, setWaveFrequency] = useState(presets[0].config.waveFrequency);
  const [colorA, setColorA] = useState(presets[0].config.colorA);
  const [colorB, setColorB] = useState(presets[0].config.colorB);
  const [colorC, setColorC] = useState(presets[0].config.colorC);
  const [colorD, setColorD] = useState(presets[0].config.colorD);
  const [currentPreset, setCurrentPreset] = useState("default");
  const [key, setKey] = useState(0);

  const applyPreset = (presetId: string) => {
    const preset = presets.find((p) => p.id === presetId);
    if (preset) {
      setCurrentPreset(presetId);
      setIterations(preset.config.iterations);
      setScale(preset.config.scale);
      setTimeMultiplier(preset.config.timeMultiplier);
      setRotationSpeed(preset.config.rotationSpeed);
      setGlowIntensity(preset.config.glowIntensity);
      setWaveFrequency(preset.config.waveFrequency);
      setColorA(preset.config.colorA);
      setColorB(preset.config.colorB);
      setColorC(preset.config.colorC);
      setColorD(preset.config.colorD);
      setKey((prev) => prev + 1);
    }
  };

  const handleReset = () => {
    applyPreset("default");
  };

  const usageCode = `<Kaleidoscopic
  iterations={${iterations}}
  scale={${scale.toFixed(1)}}
  timeMultiplier={${timeMultiplier.toFixed(1)}}
  rotationSpeed={${rotationSpeed.toFixed(2)}}
  glowIntensity={${glowIntensity.toFixed(3)}}
  waveFrequency={${waveFrequency.toFixed(1)}}
  colorA={[${colorA.join(", ")}]}
  colorB={[${colorB.join(", ")}]}
  colorC={[${colorC.join(", ")}]}
  colorD={[${colorD.join(", ")}]}
/>`;

  return (
    <div className="flex flex-col gap-5">
      <div id="kaleidoscopic-title">
        <HeaderText text="Kaleidoscopic" option={3} />
      </div>
      <ParagraphText
        text="A high-performance WebGL fractal background shader that offers stunning kaleidoscopic visuals through domain folding, configurable via React props."
        option={4}
      />

      <div id="preview">
        <PreviewTab
          previewContent={
            <div className="w-full h-[500px] relative overflow-hidden flex items-center justify-center">
              <Kaleidoscopic
                key={key}
                iterations={iterations}
                scale={scale}
                timeMultiplier={timeMultiplier}
                rotationSpeed={rotationSpeed}
                glowIntensity={glowIntensity}
                waveFrequency={waveFrequency}
                colorA={colorA}
                colorB={colorB}
                colorC={colorC}
                colorD={colorD}
                className="absolute inset-0"
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
            label="Iterations (Detail)"
            min={1}
            max={7}
            step={1}
            value={iterations}
            onChange={setIterations}
            maxDecimals={0}
            showTicks={true}
          />
          <DiscreteSlider2
            label="Scale (Space Fold)"
            min={0.5}
            max={2.5}
            step={0.1}
            value={scale}
            onChange={setScale}
            maxDecimals={1}
            showTicks={false}
          />
          <DiscreteSlider2
            label="Speed"
            min={0.0}
            max={5.0}
            step={0.1}
            value={timeMultiplier}
            onChange={setTimeMultiplier}
            maxDecimals={1}
            showTicks={false}
          />
          <DiscreteSlider2
            label="Rotation Speed"
            min={-0.2}
            max={0.2}
            step={0.01}
            value={rotationSpeed}
            onChange={setRotationSpeed}
            maxDecimals={2}
            showTicks={false}
          />
          <DiscreteSlider2
            label="Glow Intensity"
            min={0.001}
            max={0.05}
            step={0.001}
            value={glowIntensity}
            onChange={setGlowIntensity}
            maxDecimals={3}
            showTicks={false}
          />
          <DiscreteSlider2
            label="Ring Frequency"
            min={1.0}
            max={20.0}
            step={0.5}
            value={waveFrequency}
            onChange={setWaveFrequency}
            maxDecimals={1}
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

export default KaleidoscopicPage;
