"use client";

import React, { useState } from "react";
import HeaderText from "../../components/textfields/HeaderText";
import ParagraphText from "../../components/textfields/ParagraphText";
import PreviewTab from "../../components/tabsection/PreviewTab";
import InstallationTabs from "../../components/tabsection/InstallationTabs";
import { PropsTable } from "../../components/table/PropsTable";
import { ScaffoldText } from "../../meta/text/ScaffoldText/ScaffoldText";
import { loaderProps, componentCode, creditsData } from "./ScaffoldTextData";
import DefaultTextInput from "@/app/components/textinput/DefaultTextInput";
import ColorPicker from "@/app/components/colorpicker/ColorPicker";
import DiscreteSlider2 from "@/app/components/slider/DiscreteSlider2";
import DefaultComboBox from "@/app/components/combobox/DefaultComboBox";
import { Credits } from "../../components/buttongroup/Credits";
import { RotateCcw } from "lucide-react";

const presets = [
  {
    id: "cyber",
    label: "Cyber Scaffolding (Default)",
    config: {
      text: "SCAFFOLD",
      animationState: "enter",
      fontSize: 80,
      color: "#ffffff",
      scaffoldColor: "rgba(14, 165, 233, 0.4)",
      transitionSpeed: 0.04,
      influenceRadius: 65,
    },
  },
  {
    id: "fast",
    label: "Fast Assembly",
    config: {
      text: "ASSEMBLE",
      animationState: "enter",
      fontSize: 75,
      color: "#39ff14",
      scaffoldColor: "rgba(57, 255, 20, 0.45)",
      transitionSpeed: 0.09,
      influenceRadius: 50,
    },
  },
  {
    id: "slow",
    label: "Slow Blueprint",
    config: {
      text: "BLUEPRINT",
      animationState: "enter",
      fontSize: 70,
      color: "#fef08a",
      scaffoldColor: "rgba(234, 179, 8, 0.25)",
      transitionSpeed: 0.015,
      influenceRadius: 80,
    },
  },
];

const stateOptions = [
  { id: "enter", label: "Enter (Assembly)" },
  { id: "stable", label: "Stable (Interactive)" },
  { id: "exit", label: "Exit (Collapse)" },
];

export const ScaffoldTextPage = () => {
  const [text, setText] = useState(presets[0].config.text);
  const [animationState, setAnimationState] = useState<any>(presets[0].config.animationState);
  const [fontSize, setFontSize] = useState(presets[0].config.fontSize);
  const [transitionSpeed, setTransitionSpeed] = useState(presets[0].config.transitionSpeed);
  const [influenceRadius, setInfluenceRadius] = useState(presets[0].config.influenceRadius);

  // Themes / Colors
  const [color, setColor] = useState(presets[0].config.color);
  const [scaffoldColor, setScaffoldColor] = useState(presets[0].config.scaffoldColor);

  const [currentPreset, setCurrentPreset] = useState("cyber");
  const [key, setKey] = useState(0);

  const applyPreset = (presetId: string) => {
    const preset = presets.find((p) => p.id === presetId);
    if (preset) {
      setCurrentPreset(presetId);
      setText(preset.config.text);
      setAnimationState(preset.config.animationState);
      setFontSize(preset.config.fontSize);
      setTransitionSpeed(preset.config.transitionSpeed);
      setInfluenceRadius(preset.config.influenceRadius);
      setColor(preset.config.color);
      setScaffoldColor(preset.config.scaffoldColor);
      setKey((prev) => prev + 1);
    }
  };

  const handleReplay = () => {
    setKey((prev) => prev + 1);
  };

  const handleReset = () => {
    applyPreset("cyber");
  };

  const usageCode = `<ScaffoldText
  text="${text}"
  animationState="${animationState}"
  fontSize={${fontSize}}
  transitionSpeed={${transitionSpeed}}
  influenceRadius={${influenceRadius}}
  color="${color}"
  scaffoldColor="${scaffoldColor}"
/>`;

  return (
    <div className="flex flex-col gap-5">
      <div id="scaffold-text-title">
        <HeaderText text="Scaffold Text" option={3} />
        <ParagraphText
          text="An interactive layout assembly canvas effect. Characters step through staggered entrance guides and wireframes, assembling themselves dynamically. Once fully stable, they react magnetically to pointer movements and snap back."
          option={4}
        />
      </div>

      <div id="preview">
        <PreviewTab
          previewContent={
            <div className="w-full h-[400px] relative overflow-hidden flex items-center justify-center bg-[#070709]">
              <ScaffoldText
                key={key}
                text={text}
                animationState={animationState}
                fontSize={fontSize}
                transitionSpeed={transitionSpeed}
                influenceRadius={influenceRadius}
                color={color}
                scaffoldColor={scaffoldColor}
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

          <DefaultComboBox
            label="Animation Lifecycle State"
            options={stateOptions}
            value={animationState}
            onChange={(val) => {
              setAnimationState(val);
              setKey((prev) => prev + 1);
            }}
            dynamicWidth={true}
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
            label="Transition Speed"
            min={0.005}
            max={0.15}
            step={0.005}
            value={transitionSpeed}
            onChange={setTransitionSpeed}
            maxDecimals={3}
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
            label="Text Color"
            value={color}
            onChange={(val) => {
              setColor(val);
              setKey((prev) => prev + 1);
            }}
          />

          <ColorPicker
            label="Scaffold Accent"
            value={scaffoldColor}
            onChange={setScaffoldColor}
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

export default ScaffoldTextPage;
