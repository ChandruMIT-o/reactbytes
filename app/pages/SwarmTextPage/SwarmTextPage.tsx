"use client";

import React, { useState, useMemo } from "react";
import HeaderText from "../../components/textfields/HeaderText";
import ParagraphText from "../../components/textfields/ParagraphText";
import PreviewTab from "../../components/tabsection/PreviewTab";
import InstallationTabs from "../../components/tabsection/InstallationTabs";
import { PropsTable } from "../../components/table/PropsTable";
import { SwarmText } from "../../meta/text/SwarmText/SwarmText";
import { loaderProps, componentCode, creditsData } from "./SwarmTextData";
import DefaultTextInput from "@/app/components/textinput/DefaultTextInput";
import ColorPicker from "@/app/components/colorpicker/ColorPicker";
import DiscreteSlider2 from "@/app/components/slider/DiscreteSlider2";
import ToggleComponent from "@/app/components/buttongroup/ToggleComponent";
import { RotateCcw } from "lucide-react";
import DefaultComboBox from "@/app/components/combobox/DefaultComboBox";
import { Credits } from "../../components/buttongroup/Credits";

const presets = [
  {
    id: "default",
    label: "Default Swarm",
    config: {
      textsRaw: "Developer, Designer, Philosopher, Physicist",
      prefix: "I am a",
      fontSize: 48,
      textColor: "#E8EAF0",
      prefixColor: "#9CA3AF",
      friction: 0.85,
      springStiffness: 0.08,
      particleSize: 1.8,
      repelRadius: 60,
      repelStrength: 4.0,
      mouseRepel: true,
      step: 3,
    },
  },
  {
    id: "cyberpunk",
    label: "Cyberpunk Terminal",
    config: {
      textsRaw: "ONLINE, ENCRYPTED, SECURE, SYSTEM",
      prefix: "Status:",
      fontSize: 40,
      textColor: "#10B981",
      prefixColor: "#6B7280",
      friction: 0.80,
      springStiffness: 0.12,
      particleSize: 2.2,
      repelRadius: 75,
      repelStrength: 6.0,
      mouseRepel: true,
      step: 3,
    },
  },
  {
    id: "sunset",
    label: "Warm Sunset",
    config: {
      textsRaw: "Innovate, Inspire, Create, Connect",
      prefix: "Time to",
      fontSize: 44,
      textColor: "#F59E0B",
      prefixColor: "#EF4444",
      friction: 0.88,
      springStiffness: 0.06,
      particleSize: 1.5,
      repelRadius: 50,
      repelStrength: 3.0,
      mouseRepel: true,
      step: 3,
    },
  },
  {
    id: "fluid-cosmic",
    label: "Cosmic Nebula",
    config: {
      textsRaw: "Space, Time, Quantum, Gravity",
      prefix: "Solving",
      fontSize: 52,
      textColor: "#8B5CF6",
      prefixColor: "#EC4899",
      friction: 0.92,
      springStiffness: 0.04,
      particleSize: 1.2,
      repelRadius: 100,
      repelStrength: 8.0,
      mouseRepel: true,
      step: 2, // high density
    },
  },
];

export const SwarmTextPage = () => {
  const [textsRaw, setTextsRaw] = useState(presets[0].config.textsRaw);
  const [prefix, setPrefix] = useState(presets[0].config.prefix);
  const [fontSize, setFontSize] = useState(presets[0].config.fontSize);
  const [textColor, setTextColor] = useState(presets[0].config.textColor);
  const [prefixColor, setPrefixColor] = useState(presets[0].config.prefixColor);
  const [friction, setFriction] = useState(presets[0].config.friction);
  const [springStiffness, setSpringStiffness] = useState(presets[0].config.springStiffness);
  const [particleSize, setParticleSize] = useState(presets[0].config.particleSize);
  const [repelRadius, setRepelRadius] = useState(presets[0].config.repelRadius);
  const [repelStrength, setRepelStrength] = useState(presets[0].config.repelStrength);
  const [mouseRepel, setMouseRepel] = useState(presets[0].config.mouseRepel);
  const [step, setStep] = useState(presets[0].config.step);

  const [currentPreset, setCurrentPreset] = useState("default");
  const [key, setKey] = useState(0);

  const texts = useMemo(() => {
    return textsRaw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }, [textsRaw]);

  const applyPreset = (presetId: string) => {
    const preset = presets.find((p) => p.id === presetId);
    if (preset) {
      setCurrentPreset(presetId);
      setTextsRaw(preset.config.textsRaw);
      setPrefix(preset.config.prefix);
      setFontSize(preset.config.fontSize);
      setTextColor(preset.config.textColor);
      setPrefixColor(preset.config.prefixColor);
      setFriction(preset.config.friction);
      setSpringStiffness(preset.config.springStiffness);
      setParticleSize(preset.config.particleSize);
      setRepelRadius(preset.config.repelRadius);
      setRepelStrength(preset.config.repelStrength);
      setMouseRepel(preset.config.mouseRepel);
      setStep(preset.config.step);
      setKey((prev) => prev + 1);
    }
  };

  const handleReplay = () => {
    setKey((prev) => prev + 1);
  };

  const handleReset = () => {
    applyPreset("default");
  };

  const usageCode = `<SwarmText
  texts={[${texts.map((t) => `"${t}"`).join(", ")}]}
  prefix="${prefix}"
  fontSize={${fontSize}}
  textColor="${textColor}"
  prefixColor="${prefixColor}"
  friction={${friction}}
  springStiffness={${springStiffness}}
  particleSize={${particleSize}}
  repelRadius={${repelRadius}}
  repelStrength={${repelStrength}}
  mouseRepel={${mouseRepel}}
  step={${step}}
/>`;

  return (
    <div className="flex flex-col gap-5">
      <div id="swarm-text-title">
        <HeaderText text="Swarm Text" option={3} />
      </div>
      <ParagraphText
        text="An interactive text morphing component that renders words as a responsive swarm of particles using HTML5 Canvas. Includes real-time spring physics, additive rendering glow, and particle repulsion fields when hovering."
        option={4}
      />

      <div id="preview">
        <PreviewTab
          previewContent={
            <div className="w-full h-[400px] relative overflow-hidden flex items-center justify-center p-10 bg-black/40 rounded-xl border border-rb-neutral-4">
              <SwarmText
                key={key}
                texts={texts}
                prefix={prefix}
                fontSize={fontSize}
                textColor={textColor}
                prefixColor={prefixColor}
                friction={friction}
                springStiffness={springStiffness}
                particleSize={particleSize}
                repelRadius={repelRadius}
                repelStrength={repelStrength}
                mouseRepel={mouseRepel}
                step={step}
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
          <DefaultTextInput
            label="Prefix Text"
            value={prefix}
            onChange={(val) => {
              setPrefix(val);
              setKey((prev) => prev + 1);
            }}
            placeholder="Static prefix..."
          />

          <DefaultTextInput
            label="Words (comma-separated)"
            value={textsRaw}
            onChange={(val) => {
              setTextsRaw(val);
              setKey((prev) => prev + 1);
            }}
            placeholder="Word 1, Word 2, Word 3..."
          />

          <DiscreteSlider2
            label="Font Size (px)"
            min={24}
            max={72}
            step={2}
            value={fontSize}
            onChange={setFontSize}
            maxDecimals={0}
            showTicks={false}
          />

          <DiscreteSlider2
            label="Friction / Damping"
            min={0.5}
            max={0.98}
            step={0.01}
            value={friction}
            onChange={setFriction}
            maxDecimals={2}
            showTicks={false}
          />

          <DiscreteSlider2
            label="Spring Stiffness"
            min={0.01}
            max={0.3}
            step={0.01}
            value={springStiffness}
            onChange={setSpringStiffness}
            maxDecimals={2}
            showTicks={false}
          />

          <DiscreteSlider2
            label="Particle Size"
            min={0.5}
            max={5}
            step={0.1}
            value={particleSize}
            onChange={setParticleSize}
            maxDecimals={1}
            showTicks={false}
          />

          <DiscreteSlider2
            label="Pixel Sample Step (Density)"
            min={2}
            max={6}
            step={1}
            value={step}
            onChange={setStep}
            maxDecimals={0}
            showTicks={true}
          />

          <ToggleComponent
            label="Cursor Repel"
            checked={mouseRepel}
            onChange={(val) => {
              setMouseRepel(val);
              setKey((prev) => prev + 1);
            }}
          />

          <DiscreteSlider2
            label="Repel Radius (px)"
            min={20}
            max={150}
            step={5}
            value={repelRadius}
            onChange={setRepelRadius}
            maxDecimals={0}
            showTicks={false}
          />

          <DiscreteSlider2
            label="Repel Strength"
            min={0.5}
            max={10.0}
            step={0.5}
            value={repelStrength}
            onChange={setRepelStrength}
            maxDecimals={1}
            showTicks={false}
          />

          <ColorPicker
            label="Particle Color"
            value={textColor}
            onChange={setTextColor}
          />

          <ColorPicker
            label="Prefix Color"
            value={prefixColor}
            onChange={setPrefixColor}
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

export default SwarmTextPage;
