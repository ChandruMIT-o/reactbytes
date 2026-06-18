"use client";

import React, { useState } from "react";
import HeaderText from "../../components/textfields/HeaderText";
import ParagraphText from "../../components/textfields/ParagraphText";
import PreviewTab from "../../components/tabsection/PreviewTab";
import InstallationTabs from "../../components/tabsection/InstallationTabs";
import { PropsTable } from "../../components/table/PropsTable";
import { TectonicTrackText } from "../../meta/text/TectonicTrackText/TectonicTrackText";
import { loaderProps, componentCode, creditsData } from "./TectonicTrackTextData";
import DefaultTextInput from "@/app/components/textinput/DefaultTextInput";
import ColorPicker from "@/app/components/colorpicker/ColorPicker";
import DiscreteSlider2 from "@/app/components/slider/DiscreteSlider2";
import DefaultComboBox from "@/app/components/combobox/DefaultComboBox";
import { Credits } from "../../components/buttongroup/Credits";
import { RotateCcw } from "lucide-react";

const presets = [
  {
    id: "standard",
    label: "Standard Elastic (Default)",
    config: {
      text: "TECTONIC",
      fontSize: 75,
      color: "#ffffff",
      lineColor: "rgba(255, 255, 255, 0.15)",
      maxTrackingExpansion: 35,
      maxScaleX: 1.25,
      influenceRadius: 120,
      stiffness: 0.08,
      damping: 0.74,
    },
  },
  {
    id: "accordion",
    label: "Wide Accordion",
    config: {
      text: "ACCORDION",
      fontSize: 65,
      color: "#a78bfa",
      lineColor: "rgba(167, 139, 250, 0.3)",
      maxTrackingExpansion: 60,
      maxScaleX: 1.6,
      influenceRadius: 180,
      stiffness: 0.05,
      damping: 0.82,
    },
  },
  {
    id: "horizon",
    label: "Snappy Horizon",
    config: {
      text: "HORIZON",
      fontSize: 80,
      color: "#38bdf8",
      lineColor: "rgba(56, 189, 248, 0.25)",
      maxTrackingExpansion: 20,
      maxScaleX: 1.1,
      influenceRadius: 90,
      stiffness: 0.18,
      damping: 0.65,
    },
  },
];

export const TectonicTrackTextPage = () => {
  const [text, setText] = useState(presets[0].config.text);
  const [fontSize, setFontSize] = useState(presets[0].config.fontSize);
  const [maxTrackingExpansion, setMaxTrackingExpansion] = useState(presets[0].config.maxTrackingExpansion);
  const [maxScaleX, setMaxScaleX] = useState(presets[0].config.maxScaleX);
  const [influenceRadius, setInfluenceRadius] = useState(presets[0].config.influenceRadius);
  const [stiffness, setStiffness] = useState(presets[0].config.stiffness);
  const [damping, setDamping] = useState(presets[0].config.damping);

  // Themes / Colors
  const [color, setColor] = useState(presets[0].config.color);
  const [lineColor, setLineColor] = useState(presets[0].config.lineColor);

  const [currentPreset, setCurrentPreset] = useState("standard");
  const [key, setKey] = useState(0);

  const applyPreset = (presetId: string) => {
    const preset = presets.find((p) => p.id === presetId);
    if (preset) {
      setCurrentPreset(presetId);
      setText(preset.config.text);
      setFontSize(preset.config.fontSize);
      setMaxTrackingExpansion(preset.config.maxTrackingExpansion);
      setMaxScaleX(preset.config.maxScaleX);
      setInfluenceRadius(preset.config.influenceRadius);
      setStiffness(preset.config.stiffness);
      setDamping(preset.config.damping);
      setColor(preset.config.color);
      setLineColor(preset.config.lineColor);
      setKey((prev) => prev + 1);
    }
  };

  const handleReplay = () => {
    setKey((prev) => prev + 1);
  };

  const handleReset = () => {
    applyPreset("standard");
  };

  const usageCode = `<TectonicTrackText
  text="${text}"
  fontSize={${fontSize}}
  maxTrackingExpansion={${maxTrackingExpansion}}
  maxScaleX={${maxScaleX}}
  influenceRadius={${influenceRadius}}
  stiffness={${stiffness}}
  damping={${damping}}
  color="${color}"
  lineColor="${lineColor}"
/>`;

  return (
    <div className="flex flex-col gap-5">
      <div id="tectonic-track-text-title">
        <HeaderText text="Tectonic Track Text" option={3} />
        <ParagraphText
          text="An interactive canvas-based tracking and scale expansion animation. Sweeping the cursor over the text applies localized horizontal pressure, expanding character tracking and width scales elastically using Hooke's Law spring dynamics and a Gaussian proximity curve, while displaying boundary ruler ticks and baseline rules."
          option={4}
        />
      </div>

      <div id="preview">
        <PreviewTab
          previewContent={
            <div className="w-full h-[400px] relative overflow-hidden flex items-center justify-center bg-[#070709]">
              <TectonicTrackText
                key={key}
                text={text}
                fontSize={fontSize}
                maxTrackingExpansion={maxTrackingExpansion}
                maxScaleX={maxScaleX}
                influenceRadius={influenceRadius}
                stiffness={stiffness}
                damping={damping}
                color={color}
                lineColor={lineColor}
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
            label="Elastic Text"
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
            label="Max Tracking Expansion"
            min={5}
            max={100}
            step={5}
            value={maxTrackingExpansion}
            onChange={setMaxTrackingExpansion}
            maxDecimals={0}
            showTicks={false}
          />

          <DiscreteSlider2
            label="Max Glyph Scale X"
            min={1.0}
            max={2.5}
            step={0.05}
            value={maxScaleX}
            onChange={setMaxScaleX}
            maxDecimals={2}
            showTicks={false}
          />

          <DiscreteSlider2
            label="Influence Radius"
            min={40}
            max={300}
            step={10}
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
            label="Text Color"
            value={color}
            onChange={(val) => {
              setColor(val);
              setKey((prev) => prev + 1);
            }}
          />

          <ColorPicker
            label="Technical Baseline"
            value={lineColor}
            onChange={setLineColor}
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

export default TectonicTrackTextPage;
