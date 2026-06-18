"use client";

import React, { useState } from "react";
import HeaderText from "../../components/textfields/HeaderText";
import ParagraphText from "../../components/textfields/ParagraphText";
import PreviewTab from "../../components/tabsection/PreviewTab";
import InstallationTabs from "../../components/tabsection/InstallationTabs";
import { PropsTable } from "../../components/table/PropsTable";
import { StratumText } from "../../meta/text/StratumText/StratumText";
import { loaderProps, componentCode, creditsData } from "./StratumTextData";
import DefaultTextInput from "@/app/components/textinput/DefaultTextInput";
import ColorPicker from "@/app/components/colorpicker/ColorPicker";
import DiscreteSlider2 from "@/app/components/slider/DiscreteSlider2";
import DefaultComboBox from "@/app/components/combobox/DefaultComboBox";
import { Credits } from "../../components/buttongroup/Credits";
import { RotateCcw } from "lucide-react";

const presets = [
  {
    id: "tectonic",
    label: "Tectonic Strata (Default)",
    config: {
      text: "STRATA",
      sliceCount: 32,
      stiffness: 0.045,
      damping: 0.82,
      cutForce: 0.45,
      influenceRadius: 90,
      color: "#ffffff",
      bgColor: "#08080a",
      wireframeColor: "rgba(14, 165, 233, 0.35)",
    },
  },
  {
    id: "glitch",
    label: "Cyber Glitch",
    config: {
      text: "GLITCH",
      sliceCount: 64,
      stiffness: 0.09,
      damping: 0.75,
      cutForce: 0.8,
      influenceRadius: 120,
      color: "#39ff14",
      bgColor: "#050505",
      wireframeColor: "rgba(255, 0, 128, 0.6)",
    },
  },
  {
    id: "liquid",
    label: "Slow Liquid",
    config: {
      text: "LIQUID",
      sliceCount: 16,
      stiffness: 0.015,
      damping: 0.95,
      cutForce: 0.2,
      influenceRadius: 150,
      color: "#00f0ff",
      bgColor: "#000814",
      wireframeColor: "rgba(0, 240, 255, 0.2)",
    },
  },
];

export const StratumTextPage = () => {
  const [text, setText] = useState(presets[0].config.text);
  const [sliceCount, setSliceCount] = useState(presets[0].config.sliceCount);
  const [stiffness, setStiffness] = useState(presets[0].config.stiffness);
  const [damping, setDamping] = useState(presets[0].config.damping);
  const [cutForce, setCutForce] = useState(presets[0].config.cutForce);
  const [influenceRadius, setInfluenceRadius] = useState(presets[0].config.influenceRadius);

  // Themes / Colors
  const [color, setColor] = useState(presets[0].config.color);
  const [bgColor, setBgColor] = useState(presets[0].config.bgColor);
  const [wireframeColor, setWireframeColor] = useState(presets[0].config.wireframeColor);

  const [currentPreset, setCurrentPreset] = useState("tectonic");
  const [key, setKey] = useState(0);

  const applyPreset = (presetId: string) => {
    const preset = presets.find((p) => p.id === presetId);
    if (preset) {
      setCurrentPreset(presetId);
      setText(preset.config.text);
      setSliceCount(preset.config.sliceCount);
      setStiffness(preset.config.stiffness);
      setDamping(preset.config.damping);
      setCutForce(preset.config.cutForce);
      setInfluenceRadius(preset.config.influenceRadius);
      setColor(preset.config.color);
      setBgColor(preset.config.bgColor);
      setWireframeColor(preset.config.wireframeColor);
      setKey((prev) => prev + 1);
    }
  };

  const handleReplay = () => {
    setKey((prev) => prev + 1);
  };

  const handleReset = () => {
    applyPreset("tectonic");
  };

  const usageCode = `<StratumText
  text="${text}"
  sliceCount={${sliceCount}}
  stiffness={${stiffness}}
  damping={${damping}}
  cutForce={${cutForce}}
  influenceRadius={${influenceRadius}}
  color="${color}"
  bgColor="${bgColor}"
  wireframeColor="${wireframeColor}"
/>`;

  return (
    <div className="flex flex-col gap-5">
      <div id="stratum-text-title">
        <HeaderText text="Stratum Text" option={3} />
        <ParagraphText
          text="An interactive physics-based typography effect. The text is divided into custom stratigraphic slices that react kinetically to cursor speed and direction, shearing and shifting before snapping back via a Hooke's Law spring simulation."
          option={4}
        />
      </div>

      <div id="preview">
        <PreviewTab
          previewContent={
            <div className="w-full h-[400px] relative overflow-hidden" style={{ backgroundColor: bgColor }}>
              <StratumText
                key={key}
                text={text}
                sliceCount={sliceCount}
                stiffness={stiffness}
                damping={damping}
                cutForce={cutForce}
                influenceRadius={influenceRadius}
                color={color}
                bgColor={bgColor}
                wireframeColor={wireframeColor}
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
            label="Slice Count"
            min={4}
            max={128}
            step={2}
            value={sliceCount}
            onChange={(val) => {
              setSliceCount(val);
              setKey((prev) => prev + 1);
            }}
            maxDecimals={0}
            showTicks={false}
          />

          <DiscreteSlider2
            label="Spring Stiffness"
            min={0.005}
            max={0.20}
            step={0.005}
            value={stiffness}
            onChange={setStiffness}
            maxDecimals={3}
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

          <DiscreteSlider2
            label="Cut Force Factor"
            min={0.05}
            max={2.0}
            step={0.05}
            value={cutForce}
            onChange={setCutForce}
            maxDecimals={2}
            showTicks={false}
          />

          <DiscreteSlider2
            label="Influence Radius"
            min={10}
            max={300}
            step={5}
            value={influenceRadius}
            onChange={setInfluenceRadius}
            maxDecimals={0}
            showTicks={false}
          />

          <ColorPicker
            label="Text Color"
            value={color}
            onChange={(val) => {
              setColor(val);
              setKey((prev) => prev + 1);
            }}
          />

          <ColorPicker
            label="Wireframe Color"
            value={wireframeColor}
            onChange={setWireframeColor}
          />

          <ColorPicker
            label="Canvas Background"
            value={bgColor}
            onChange={(val) => {
              setBgColor(val);
              setKey((prev) => prev + 1);
            }}
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

export default StratumTextPage;
