"use client";

import React, { useState } from "react";
import HeaderText from "../../components/textfields/HeaderText";
import ParagraphText from "../../components/textfields/ParagraphText";
import PreviewTab from "../../components/tabsection/PreviewTab";
import InstallationTabs from "../../components/tabsection/InstallationTabs";
import { PropsTable } from "../../components/table/PropsTable";
import { AxialShearText } from "../../meta/text/AxialShearText/AxialShearText";
import { loaderProps, componentCode, creditsData } from "./AxialShearTextData";
import DefaultTextInput from "@/app/components/textinput/DefaultTextInput";
import ColorPicker from "@/app/components/colorpicker/ColorPicker";
import DiscreteSlider2 from "@/app/components/slider/DiscreteSlider2";
import DefaultComboBox from "@/app/components/combobox/DefaultComboBox";
import { Credits } from "../../components/buttongroup/Credits";
import { RotateCcw } from "lucide-react";

const presets = [
  {
    id: "precision",
    label: "Precision Shear (Default)",
    config: {
      text: "SHEAR",
      fontSize: 80,
      color: "#ffffff",
      shearColor: "rgba(14, 165, 233, 0.5)",
      maxShearOffset: 24,
      influenceRadius: 75,
      stiffness: 0.07,
      damping: 0.75,
    },
  },
  {
    id: "deep",
    label: "Deep Fracture",
    config: {
      text: "FRACTURE",
      fontSize: 75,
      color: "#f43f5e",
      shearColor: "rgba(244, 63, 94, 0.6)",
      maxShearOffset: 45,
      influenceRadius: 100,
      stiffness: 0.05,
      damping: 0.82,
    },
  },
  {
    id: "rapid",
    label: "Rapid Divide",
    config: {
      text: "DIVIDE",
      fontSize: 85,
      color: "#10b981",
      shearColor: "rgba(16, 185, 129, 0.45)",
      maxShearOffset: 15,
      influenceRadius: 60,
      stiffness: 0.16,
      damping: 0.68,
    },
  },
];

export const AxialShearTextPage = () => {
  const [text, setText] = useState(presets[0].config.text);
  const [fontSize, setFontSize] = useState(presets[0].config.fontSize);
  const [maxShearOffset, setMaxShearOffset] = useState(presets[0].config.maxShearOffset);
  const [influenceRadius, setInfluenceRadius] = useState(presets[0].config.influenceRadius);
  const [stiffness, setStiffness] = useState(presets[0].config.stiffness);
  const [damping, setDamping] = useState(presets[0].config.damping);

  // Themes / Colors
  const [color, setColor] = useState(presets[0].config.color);
  const [shearColor, setShearColor] = useState(presets[0].config.shearColor);

  const [currentPreset, setCurrentPreset] = useState("precision");
  const [key, setKey] = useState(0);

  const applyPreset = (presetId: string) => {
    const preset = presets.find((p) => p.id === presetId);
    if (preset) {
      setCurrentPreset(presetId);
      setText(preset.config.text);
      setFontSize(preset.config.fontSize);
      setMaxShearOffset(preset.config.maxShearOffset);
      setInfluenceRadius(preset.config.influenceRadius);
      setStiffness(preset.config.stiffness);
      setDamping(preset.config.damping);
      setColor(preset.config.color);
      setShearColor(preset.config.shearColor);
      setKey((prev) => prev + 1);
    }
  };

  const handleReplay = () => {
    setKey((prev) => prev + 1);
  };

  const handleReset = () => {
    applyPreset("precision");
  };

  const usageCode = `<AxialShearText
  text="${text}"
  fontSize={${fontSize}}
  maxShearOffset={${maxShearOffset}}
  influenceRadius={${influenceRadius}}
  stiffness={${stiffness}}
  damping={${damping}}
  color="${color}"
  shearColor="${shearColor}"
/>`;

  return (
    <div className="flex flex-col gap-5">
      <div id="axial-shear-text-title">
        <HeaderText text="Axial Shear Text" option={3} />
        <ParagraphText
          text="An interactive canvas-based axial splitting and shearing text animation. Sweeping the cursor divides each letter vertically into left and right halves which slide apart vertically, displaying technical alignment guidelines and real-time split offset metrics, before elastically snapping back using spring mechanics."
          option={4}
        />
      </div>

      <div id="preview">
        <PreviewTab
          previewContent={
            <div className="w-full h-[400px] relative overflow-hidden flex items-center justify-center bg-[#070709]">
              <AxialShearText
                key={key}
                text={text}
                fontSize={fontSize}
                maxShearOffset={maxShearOffset}
                influenceRadius={influenceRadius}
                stiffness={stiffness}
                damping={damping}
                color={color}
                shearColor={shearColor}
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
            label="Glyphs Text"
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
            label="Max Shear Offset"
            min={5}
            max={60}
            step={1}
            value={maxShearOffset}
            onChange={setMaxShearOffset}
            maxDecimals={0}
            showTicks={false}
          />

          <DiscreteSlider2
            label="Influence Radius"
            min={40}
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
            label="Glyph Color"
            value={color}
            onChange={(val) => {
              setColor(val);
              setKey((prev) => prev + 1);
            }}
          />

          <ColorPicker
            label="Technical Guide Line"
            value={shearColor}
            onChange={setShearColor}
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

export default AxialShearTextPage;
