"use client";

import React, { useState } from "react";
import HeaderText from "../../components/textfields/HeaderText";
import ParagraphText from "../../components/textfields/ParagraphText";
import PreviewTab from "../../components/tabsection/PreviewTab";
import InstallationTabs from "../../components/tabsection/InstallationTabs";
import { PropsTable } from "../../components/table/PropsTable";
import { PhaseShellText } from "../../meta/text/PhaseShellText/PhaseShellText";
import { loaderProps, componentCode, creditsData } from "./PhaseShellTextData";
import DefaultTextInput from "@/app/components/textinput/DefaultTextInput";
import ColorPicker from "@/app/components/colorpicker/ColorPicker";
import DiscreteSlider2 from "@/app/components/slider/DiscreteSlider2";
import DefaultComboBox from "@/app/components/combobox/DefaultComboBox";
import { Credits } from "../../components/buttongroup/Credits";
import { RotateCcw } from "lucide-react";

const presets = [
  {
    id: "chronographic",
    label: "Chronographic (Default)",
    config: {
      text: "PHASE",
      fontSize: 95,
      coreColor: "#ffffff",
      inertialColor: "rgba(129, 140, 248, 0.5)",
      tensionColor: "rgba(6, 182, 212, 0.4)",
      impactForce: 1.3,
      influenceRadius: 80,
    },
  },
  {
    id: "heavy",
    label: "Heavy Latency",
    config: {
      text: "HEAVY",
      fontSize: 90,
      coreColor: "#f43f5e",
      inertialColor: "rgba(244, 63, 94, 0.6)",
      tensionColor: "rgba(251, 146, 60, 0.45)",
      impactForce: 0.8,
      influenceRadius: 100,
    },
  },
  {
    id: "volatile",
    label: "High Frequency",
    config: {
      text: "VOLATILE",
      fontSize: 80,
      coreColor: "#10b981",
      inertialColor: "rgba(16, 185, 129, 0.4)",
      tensionColor: "#38bdf8",
      impactForce: 2.2,
      influenceRadius: 70,
    },
  },
];

export const PhaseShellTextPage = () => {
  const [text, setText] = useState(presets[0].config.text);
  const [fontSize, setFontSize] = useState(presets[0].config.fontSize);
  const [impactForce, setImpactForce] = useState(presets[0].config.impactForce);
  const [influenceRadius, setInfluenceRadius] = useState(presets[0].config.influenceRadius);

  // Themes / Colors
  const [coreColor, setCoreColor] = useState(presets[0].config.coreColor);
  const [inertialColor, setInertialColor] = useState(presets[0].config.inertialColor);
  const [tensionColor, setTensionColor] = useState(presets[0].config.tensionColor);

  const [currentPreset, setCurrentPreset] = useState("chronographic");
  const [key, setKey] = useState(0);

  const applyPreset = (presetId: string) => {
    const preset = presets.find((p) => p.id === presetId);
    if (preset) {
      setCurrentPreset(presetId);
      setText(preset.config.text);
      setFontSize(preset.config.fontSize);
      setImpactForce(preset.config.impactForce);
      setInfluenceRadius(preset.config.influenceRadius);
      setCoreColor(preset.config.coreColor);
      setInertialColor(preset.config.inertialColor);
      setTensionColor(preset.config.tensionColor);
      setKey((prev) => prev + 1);
    }
  };

  const handleReplay = () => {
    setKey((prev) => prev + 1);
  };

  const handleReset = () => {
    applyPreset("chronographic");
  };

  const usageCode = `<PhaseShellText
  text="${text}"
  fontSize={${fontSize}}
  impactForce={${impactForce}}
  influenceRadius={${influenceRadius}}
  coreColor="${coreColor}"
  inertialColor="${inertialColor}"
  tensionColor="${tensionColor}"
/>`;

  return (
    <div className="flex flex-col gap-5">
      <div id="phase-shell-text-title">
        <HeaderText text="Phase Shell Text" option={3} />
        <ParagraphText
          text="An interactive physics-based multi-layered kinetic text animation. Hovering deflects three decoupled physical layers (Core, Inertial, and Tension) with customized masses, displaying elastic vector connections and micro-telemetry readouts."
          option={4}
        />
      </div>

      <div id="preview">
        <PreviewTab
          previewContent={
            <div className="w-full h-[400px] relative overflow-hidden flex items-center justify-center bg-[#070709]">
              <PhaseShellText
                key={key}
                text={text}
                fontSize={fontSize}
                impactForce={impactForce}
                influenceRadius={influenceRadius}
                coreColor={coreColor}
                inertialColor={inertialColor}
                tensionColor={tensionColor}
              />
            </div>
          }
          onReplay={handleReplay}
          usageCode={usageCode}
          codeContent={componentCode}
          collapsible={true}
          header={
            <div className="flex items-center justify-between w-full">
              <div className="flex flex-col gap-1">
                <h3 className="text-xs ml-4 font-bold text-rb-accent-1 uppercase">
                  Props Matrix
                </h3>
              </div>
              <div className="flex items-center gap-3">
                <DefaultComboBox
                  label="Presets"
                  options={presets}
                  value={currentPreset}
                  onChange={applyPreset}
                  dynamicWidth={true}
                />
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
            label="Display Text"
            value={text}
            onChange={(val) => {
              setText(val.toUpperCase().slice(0, 12));
              setKey((prev) => prev + 1);
            }}
            placeholder="Enter word..."
          />

          <DiscreteSlider2
            label="Font Size"
            min={40}
            max={140}
            step={5}
            value={fontSize}
            onChange={(val) => {
              setFontSize(val);
              setKey((prev) => prev + 1);
            }}
            maxDecimals={0}
            showTicks={false}
          />

          <DiscreteSlider2
            label="Impact Force"
            min={0.1}
            max={4.0}
            step={0.1}
            value={impactForce}
            onChange={setImpactForce}
            maxDecimals={1}
            showTicks={false}
          />

          <DiscreteSlider2
            label="Influence Radius"
            min={30}
            max={200}
            step={5}
            value={influenceRadius}
            onChange={setInfluenceRadius}
            maxDecimals={0}
            showTicks={false}
          />

          <ColorPicker
            label="Core Color"
            value={coreColor}
            onChange={(val) => {
              setCoreColor(val);
              setKey((prev) => prev + 1);
            }}
          />

          <ColorPicker
            label="Inertial Accent"
            value={inertialColor}
            onChange={setInertialColor}
          />

          <ColorPicker
            label="Tension Accent"
            value={tensionColor}
            onChange={setTensionColor}
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

export default PhaseShellTextPage;
