"use client";

import React, { useState } from "react";
import HeaderText from "../../components/textfields/HeaderText";
import ParagraphText from "../../components/textfields/ParagraphText";
import PreviewTab from "../../components/tabsection/PreviewTab";
import InstallationTabs from "../../components/tabsection/InstallationTabs";
import { PropsTable } from "../../components/table/PropsTable";
import { HelonBraid } from "../../meta/background/wave/HelonBraid/HelonBraid";
import { loaderProps, componentCode, creditsData } from "./HelonBraidData";
import DefaultTextInput from "@/app/components/textinput/DefaultTextInput";
import ColorPicker from "@/app/components/colorpicker/ColorPicker";
import DiscreteSlider2 from "@/app/components/slider/DiscreteSlider2";
import DefaultComboBox from "@/app/components/combobox/DefaultComboBox";
import { Credits } from "../../components/buttongroup/Credits";

const presets = [
  {
    id: "default",
    label: "Default Preon",
    config: {
      title: "PREON FIELD",
      spacingX: 80,
      baseRadius: 65,
      speed: 0.05,
      excitationMultiplier: 12,
      baseHue: 190,
      backgroundColor: "#070a12",
    },
  },
  {
    id: "cosmic",
    label: "Cosmic Braid",
    config: {
      title: "COSMIC STRANDS",
      spacingX: 120,
      baseRadius: 100,
      speed: 0.02,
      excitationMultiplier: 18,
      baseHue: 280,
      backgroundColor: "#080315",
    },
  },
  {
    id: "hyper",
    label: "Quantum Flare",
    config: {
      title: "QUANTUM FLARE",
      spacingX: 50,
      baseRadius: 40,
      speed: 0.12,
      excitationMultiplier: 25,
      baseHue: 340,
      backgroundColor: "#11020a",
    },
  },
  {
    id: "emerald",
    label: "Bio Synapse",
    config: {
      title: "BIO SYNAPSE",
      spacingX: 95,
      baseRadius: 75,
      speed: 0.04,
      excitationMultiplier: 10,
      baseHue: 140,
      backgroundColor: "#020f08",
    },
  },
];

export const HelonBraidPage = () => {
  const [config, setConfig] = useState(presets[0].config);
  const [key, setKey] = useState(0);

  const applyPreset = (presetId: string) => {
    const preset = presets.find((p) => p.id === presetId);
    if (preset) {
      setConfig(preset.config);
      setKey((prev) => prev + 1);
    }
  };

  const updateConfig = (keyName: string, value: any) => {
    setConfig((prev) => ({ ...prev, [keyName]: value }));
  };

  const handleExcite = () => {
    window.dispatchEvent(new Event("excite-helon"));
  };

  const usageCode = `<HelonBraid
  spacingX={${config.spacingX}}
  baseRadius={${config.baseRadius}}
  speed={${config.speed}}
  excitationMultiplier={${config.excitationMultiplier}}
  baseHue={${config.baseHue}}
  backgroundColor="${config.backgroundColor}"
>
  <h1 className="text-white text-6xl font-bold tracking-tighter mix-blend-difference">
    ${config.title}
  </h1>
</HelonBraid>`;

  return (
    <div className="flex flex-col gap-5">
      <div id="helon-braid-title">
        <HeaderText text="Helon Braid" option={3} />
      </div>
      <ParagraphText
        text="An interactive hexagonal grid background that simulates braided wave flows and preon excitations. Hover to amplify node energy, click to trigger a cascading wave, or press the Excite Field button."
        option={4}
      />

      <div id="preview">
        <PreviewTab
          previewContent={
            <HelonBraid
              key={key}
              spacingX={config.spacingX}
              baseRadius={config.baseRadius}
              speed={config.speed}
              excitationMultiplier={config.excitationMultiplier}
              baseHue={config.baseHue}
              backgroundColor={config.backgroundColor}
              className="w-full h-[550px] border border-white/5 rounded-xl cursor-pointer relative"
            >
            </HelonBraid>
          }
          onReplay={() => setKey((prev) => prev + 1)}
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
                options={presets}
                value={presets.find((p) => p.config.spacingX === config.spacingX && p.config.baseHue === config.baseHue)?.id || ""}
                onChange={applyPreset}
                dynamicWidth={true}
              />
            </div>
          }
        >
          <DefaultTextInput
            label="Hero Text"
            value={config.title}
            onChange={(val) => updateConfig("title", val)}
            placeholder="Enter title..."
          />

          <DiscreteSlider2
            label="Node Spacing"
            min={30}
            max={200}
            step={1}
            value={config.spacingX}
            onChange={(val) => updateConfig("spacingX", val)}
            showTicks={true}
          />

          <DiscreteSlider2
            label="Strand Radius"
            min={20}
            max={200}
            step={1}
            value={config.baseRadius}
            onChange={(val) => updateConfig("baseRadius", val)}
            showTicks={true}
          />

          <DiscreteSlider2
            label="Wave Speed"
            min={0.01}
            max={0.2}
            step={0.01}
            value={config.speed}
            onChange={(val) => updateConfig("speed", val)}
            maxDecimals={2}
            showTicks={true}
          />

          <DiscreteSlider2
            label="Excitation Strength"
            min={1}
            max={30}
            step={1}
            value={config.excitationMultiplier}
            onChange={(val) => updateConfig("excitationMultiplier", val)}
            showTicks={true}
          />

          <DiscreteSlider2
            label="Base Color Hue"
            min={0}
            max={360}
            step={1}
            value={config.baseHue}
            onChange={(val) => updateConfig("baseHue", val)}
            showTicks={true}
          />

          <ColorPicker
            label="Background Color"
            value={config.backgroundColor}
            onChange={(val) => updateConfig("backgroundColor", val)}
            compact={true}
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

export default HelonBraidPage;
