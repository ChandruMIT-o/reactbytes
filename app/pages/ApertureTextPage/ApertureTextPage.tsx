"use client";

import React, { useState } from "react";
import HeaderText from "../../components/textfields/HeaderText";
import ParagraphText from "../../components/textfields/ParagraphText";
import PreviewTab from "../../components/tabsection/PreviewTab";
import InstallationTabs from "../../components/tabsection/InstallationTabs";
import { PropsTable } from "../../components/table/PropsTable";
import { ApertureText } from "../../meta/text/ApertureText/ApertureText";
import { loaderProps, componentCode, creditsData } from "./ApertureTextData";
import DefaultTextInput from "@/app/components/textinput/DefaultTextInput";
import ColorPicker from "@/app/components/colorpicker/ColorPicker";
import DiscreteSlider2 from "@/app/components/slider/DiscreteSlider2";
import DefaultComboBox from "@/app/components/combobox/DefaultComboBox";
import { Credits } from "../../components/buttongroup/Credits";
import { RotateCcw } from "lucide-react";

const presets = [
  {
    id: "destruct",
    label: "Rose Destruct (Default)",
    config: {
      text: "DESTRUCT",
      fontSize: 85,
      color: "#ffffff",
      blueprintColor: "rgba(244, 63, 94, 0.45)",
      expansionForce: 18,
      influenceRadius: 75,
      stiffness: 0.07,
      damping: 0.76,
    },
  },
  {
    id: "cyber",
    label: "Cyber Fracture",
    config: {
      text: "FRACTURE",
      fontSize: 80,
      color: "#00f5ff",
      blueprintColor: "rgba(255, 0, 110, 0.45)",
      expansionForce: 30,
      influenceRadius: 100,
      stiffness: 0.12,
      damping: 0.70,
    },
  },
  {
    id: "bloom",
    label: "Soft Bloom",
    config: {
      text: "BLOOM",
      fontSize: 90,
      color: "#fef08a",
      blueprintColor: "rgba(234, 179, 8, 0.3)",
      expansionForce: 10,
      influenceRadius: 60,
      stiffness: 0.04,
      damping: 0.88,
    },
  },
];

export const ApertureTextPage = () => {
  const [text, setText] = useState(presets[0].config.text);
  const [fontSize, setFontSize] = useState(presets[0].config.fontSize);
  const [expansionForce, setExpansionForce] = useState(presets[0].config.expansionForce);
  const [influenceRadius, setInfluenceRadius] = useState(presets[0].config.influenceRadius);
  const [stiffness, setStiffness] = useState(presets[0].config.stiffness);
  const [damping, setDamping] = useState(presets[0].config.damping);

  // Themes / Colors
  const [color, setColor] = useState(presets[0].config.color);
  const [blueprintColor, setBlueprintColor] = useState(presets[0].config.blueprintColor);

  const [currentPreset, setCurrentPreset] = useState("destruct");
  const [key, setKey] = useState(0);

  const applyPreset = (presetId: string) => {
    const preset = presets.find((p) => p.id === presetId);
    if (preset) {
      setCurrentPreset(presetId);
      setText(preset.config.text);
      setFontSize(preset.config.fontSize);
      setExpansionForce(preset.config.expansionForce);
      setInfluenceRadius(preset.config.influenceRadius);
      setStiffness(preset.config.stiffness);
      setDamping(preset.config.damping);
      setColor(preset.config.color);
      setBlueprintColor(preset.config.blueprintColor);
      setKey((prev) => prev + 1);
    }
  };

  const handleReplay = () => {
    setKey((prev) => prev + 1);
  };

  const handleReset = () => {
    applyPreset("destruct");
  };

  const usageCode = `<ApertureText
  text="${text}"
  fontSize={${fontSize}}
  expansionForce={${expansionForce}}
  influenceRadius={${influenceRadius}}
  stiffness={${stiffness}}
  damping={${damping}}
  color="${color}"
  blueprintColor="${blueprintColor}"
/>`;

  return (
    <div className="flex flex-col gap-5">
      <div id="aperture-text-title">
        <HeaderText text="Aperture Text" option={3} />
        <ParagraphText
          text="An interactive physics-based character fracturing effect. Hovering over the text splits each letter into quadrant shards that fly outwards, revealing a schematic blueprint skeleton underneath, before snapping back with high-fidelity spring relaxation."
          option={4}
        />
      </div>

      <div id="preview">
        <PreviewTab
          previewContent={
            <div className="w-full h-[400px] relative overflow-hidden flex items-center justify-center bg-[#070709]">
              <ApertureText
                key={key}
                text={text}
                fontSize={fontSize}
                expansionForce={expansionForce}
                influenceRadius={influenceRadius}
                stiffness={stiffness}
                damping={damping}
                color={color}
                blueprintColor={blueprintColor}
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
            label="Expansion Force"
            min={5}
            max={50}
            step={1}
            value={expansionForce}
            onChange={setExpansionForce}
            maxDecimals={0}
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
            label="Shard Color"
            value={color}
            onChange={(val) => {
              setColor(val);
              setKey((prev) => prev + 1);
            }}
          />

          <ColorPicker
            label="Blueprint Color"
            value={blueprintColor}
            onChange={setBlueprintColor}
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

export default ApertureTextPage;
