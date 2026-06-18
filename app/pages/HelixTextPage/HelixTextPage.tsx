"use client";

import React, { useState } from "react";
import HeaderText from "../../components/textfields/HeaderText";
import ParagraphText from "../../components/textfields/ParagraphText";
import PreviewTab from "../../components/tabsection/PreviewTab";
import InstallationTabs from "../../components/tabsection/InstallationTabs";
import { PropsTable } from "../../components/table/PropsTable";
import { HelixText } from "../../meta/text/HelixText/HelixText";
import { loaderProps, componentCode, creditsData } from "./HelixTextData";
import DefaultTextInput from "@/app/components/textinput/DefaultTextInput";
import ColorPicker from "@/app/components/colorpicker/ColorPicker";
import DiscreteSlider2 from "@/app/components/slider/DiscreteSlider2";
import DefaultComboBox from "@/app/components/combobox/DefaultComboBox";
import { Credits } from "../../components/buttongroup/Credits";
import { RotateCcw } from "lucide-react";

const presets = [
  {
    id: "rotor",
    label: "Industrial Rotor (Default)",
    config: {
      text: "ROTOR",
      fontSize: 90,
      color: "#ffffff",
      techColor: "rgba(245, 158, 11, 0.45)",
      torqueForce: 0.55,
      influenceRadius: 70,
      stiffness: 0.05,
      damping: 0.81,
    },
  },
  {
    id: "spin",
    label: "Kinetic Spin",
    config: {
      text: "SPIN",
      fontSize: 100,
      color: "#a855f7",
      techColor: "rgba(168, 85, 247, 0.35)",
      torqueForce: 1.2,
      influenceRadius: 90,
      stiffness: 0.02,
      damping: 0.94,
    },
  },
  {
    id: "return",
    label: "Fast Return",
    config: {
      text: "CYLINDER",
      fontSize: 75,
      color: "#10b981",
      techColor: "rgba(16, 185, 129, 0.5)",
      torqueForce: 0.4,
      influenceRadius: 60,
      stiffness: 0.15,
      damping: 0.70,
    },
  },
];

export const HelixTextPage = () => {
  const [text, setText] = useState(presets[0].config.text);
  const [fontSize, setFontSize] = useState(presets[0].config.fontSize);
  const [torqueForce, setTorqueForce] = useState(presets[0].config.torqueForce);
  const [influenceRadius, setInfluenceRadius] = useState(presets[0].config.influenceRadius);
  const [stiffness, setStiffness] = useState(presets[0].config.stiffness);
  const [damping, setDamping] = useState(presets[0].config.damping);

  // Themes / Colors
  const [color, setColor] = useState(presets[0].config.color);
  const [techColor, setTechColor] = useState(presets[0].config.techColor);

  const [currentPreset, setCurrentPreset] = useState("rotor");
  const [key, setKey] = useState(0);

  const applyPreset = (presetId: string) => {
    const preset = presets.find((p) => p.id === presetId);
    if (preset) {
      setCurrentPreset(presetId);
      setText(preset.config.text);
      setFontSize(preset.config.fontSize);
      setTorqueForce(preset.config.torqueForce);
      setInfluenceRadius(preset.config.influenceRadius);
      setStiffness(preset.config.stiffness);
      setDamping(preset.config.damping);
      setColor(preset.config.color);
      setTechColor(preset.config.techColor);
      setKey((prev) => prev + 1);
    }
  };

  const handleReplay = () => {
    setKey((prev) => prev + 1);
  };

  const handleReset = () => {
    applyPreset("rotor");
  };

  const usageCode = `<HelixText
  text="${text}"
  fontSize={${fontSize}}
  torqueForce={${torqueForce}}
  influenceRadius={${influenceRadius}}
  stiffness={${stiffness}}
  damping={${damping}}
  color="${color}"
  techColor="${techColor}"
/>`;

  return (
    <div className="flex flex-col gap-5">
      <div id="helix-text-title">
        <HeaderText text="Helix Text" option={3} />
        <ParagraphText
          text="An interactive kinetic typography effect displaying 3D cylindrical drum rotors. Sweeping the cursor horizontally applies rotational torque to individual characters, spinning them on technical spindles with automatic back-facing skeletal rendering."
          option={4}
        />
      </div>

      <div id="preview">
        <PreviewTab
          previewContent={
            <div className="w-full h-[400px] relative overflow-hidden flex items-center justify-center bg-[#070709]">
              <HelixText
                key={key}
                text={text}
                fontSize={fontSize}
                torqueForce={torqueForce}
                influenceRadius={influenceRadius}
                stiffness={stiffness}
                damping={damping}
                color={color}
                techColor={techColor}
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
            label="Rotor Text"
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
            label="Torque Force"
            min={0.1}
            max={3.0}
            step={0.05}
            value={torqueForce}
            onChange={setTorqueForce}
            maxDecimals={2}
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

          <DiscreteSlider2
            label="Spring Stiffness"
            min={0.01}
            max={0.30}
            step={0.01}
            value={stiffness}
            onChange={setStiffness}
            maxDecimals={2}
            showTicks={false}
          />

          <DiscreteSlider2
            label="Spring Damping"
            min={0.50}
            max={0.99}
            step={0.01}
            value={damping}
            onChange={setDamping}
            maxDecimals={2}
            showTicks={false}
          />

          <ColorPicker
            label="Front Color"
            value={color}
            onChange={(val) => {
              setColor(val);
              setKey((prev) => prev + 1);
            }}
          />

          <ColorPicker
            label="Technical Accent"
            value={techColor}
            onChange={setTechColor}
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

export default HelixTextPage;
