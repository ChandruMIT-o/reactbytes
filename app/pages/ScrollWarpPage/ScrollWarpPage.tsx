"use client";

import React, { useState } from "react";
import HeaderText from "../../components/textfields/HeaderText";
import ParagraphText from "../../components/textfields/ParagraphText";
import PreviewTab from "../../components/tabsection/PreviewTab";
import InstallationTabs from "../../components/tabsection/InstallationTabs";
import { PropsTable } from "../../components/table/PropsTable";
import { ScrollWarp } from "../../meta/background/space/ScrollWarp/ScrollWarp";
import { loaderProps, componentCode, creditsData } from "./ScrollWarpData";
import DefaultTextInput from "@/app/components/textinput/DefaultTextInput";
import DiscreteSlider2 from "@/app/components/slider/DiscreteSlider2";
import ColorPicker from "@/app/components/colorpicker/ColorPicker";
import DefaultComboBox from "@/app/components/combobox/DefaultComboBox";
import { RotateCcw } from "lucide-react";
import { Credits } from "../../components/buttongroup/Credits";

const presets = [
  {
    id: "default",
    label: "Classic Clarity",
    config: {
      numStars: 1900,
      baseTrailLength: 2,
      maxTrailLength: 30,
      starColor: "#d1ffff",
    },
  },
  {
    id: "hyperdrive",
    label: "Hyperdrive Warp",
    config: {
      numStars: 3000,
      baseTrailLength: 5,
      maxTrailLength: 100,
      starColor: "#a0e0ff",
    },
  },
  {
    id: "nebula",
    label: "Cosmic Nebula",
    config: {
      numStars: 1500,
      baseTrailLength: 1,
      maxTrailLength: 45,
      starColor: "#ff5500",
    },
  },
  {
    id: "void",
    label: "Silent Void",
    config: {
      numStars: 500,
      baseTrailLength: 1,
      maxTrailLength: 20,
      starColor: "#ffffff",
    },
  },
];

export const ScrollWarpPage = () => {
  const [config, setConfig] = useState({
    numStars: 1900,
    baseTrailLength: 2,
    maxTrailLength: 30,
    starColor: "#d1ffff",
  });
  const [currentPreset, setCurrentPreset] = useState("default");
  const [key, setKey] = useState(0);

  const updateConfig = (keyName: string, value: any) => {
    setConfig((prev) => ({ ...prev, [keyName]: value }));
  };

  const applyPreset = (presetId: string) => {
    const preset = presets.find((p) => p.id === presetId);
    if (preset) {
      setCurrentPreset(presetId);
      setConfig(preset.config);
      setKey((prev) => prev + 1);
    }
  };

  const handleReplay = () => {
    setKey((prev) => prev + 1);
  };

  const handleReset = () => {
    applyPreset("default");
  };

  const usageCode = `<ScrollWarp
  numStars={${config.numStars}}
  baseTrailLength={${config.baseTrailLength}}
  maxTrailLength={${config.maxTrailLength}}
  starColor="${config.starColor}"
/>`;

  return (
    <div className="flex flex-col gap-5">
      <div id="scroll-warp-title">
        <HeaderText text="Scroll Warp" option={3} />
      </div>
      <ParagraphText
        text="A WebGL starfield that accelerates into warp speed based on the page scroll, featuring cinematic text reveal and blur."
        option={4}
      />

      <div id="preview">
        <PreviewTab
          previewContent={
            <ScrollWarp
              key={key}
              className="w-full h-[600px] overflow-y-auto border border-white/5 rounded-xl"
              numStars={config.numStars}
              baseTrailLength={config.baseTrailLength}
              maxTrailLength={config.maxTrailLength}
              starColor={config.starColor}
            />
          }
          onReplay={handleReplay}
          usageCode={usageCode}
          codeContent={componentCode}
          collapsible={true}
          header={
            <div className="flex items-center justify-between w-full pr-4">
              <div className="flex flex-col gap-1">
                <h3 className="text-xs ml-4 font-bold text-rb-accent-1 uppercase">
                  Props
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
          <DiscreteSlider2
            label="Star Count"
            min={100}
            max={5000}
            step={100}
            value={config.numStars}
            onChange={(val) => updateConfig("numStars", val)}
            showTicks={true}
          />

          <DiscreteSlider2
            label="Base Trail Length"
            min={0}
            max={10}
            step={1}
            value={config.baseTrailLength}
            onChange={(val) => updateConfig("baseTrailLength", val)}
            showTicks={true}
          />

          <DiscreteSlider2
            label="Max Warp Trail"
            min={10}
            max={150}
            step={5}
            value={config.maxTrailLength}
            onChange={(val) => updateConfig("maxTrailLength", val)}
            showTicks={true}
          />

          <ColorPicker
            label="Star Color"
            value={config.starColor}
            onChange={(val) => updateConfig("starColor", val)}
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

export default ScrollWarpPage;
