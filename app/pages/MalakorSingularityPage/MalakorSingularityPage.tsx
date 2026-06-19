"use client";

import React, { useState } from "react";
import HeaderText from "../../components/textfields/HeaderText";
import PreviewTab from "../../components/tabsection/PreviewTab";
import InstallationTabs from "../../components/tabsection/InstallationTabs";
import { PropsTable } from "../../components/table/PropsTable";
import { MalakorSingularity } from "../../meta/misc/MalakorSingularity/MalakorSingularity";
import { loaderProps, componentCode, creditsData } from "./MalakorSingularityData";
import DefaultTextInput from "@/app/components/textinput/DefaultTextInput";
import ColorPicker from "@/app/components/colorpicker/ColorPicker";
import { RotateCcw } from "lucide-react";
import DefaultComboBox from "@/app/components/combobox/DefaultComboBox";
import { Credits } from "../../components/buttongroup/Credits";

const DEFAULT_CORE_NAME = "MALAKOR.SINGULARITY";
const DEFAULT_TYPING_COLOR = "#ff1407";
const DEFAULT_HOVER_COLOR = "#0b52ff";
const DEFAULT_WHISPER = "Hover over the void and type your command...";

const presets = [
  {
    id: "default",
    label: "Malakor (Default)",
    config: {
      coreName: "MALAKOR.SINGULARITY",
      typingColor: "#ff1407",
      hoverColor: "#0b52ff",
      whisper: "Hover over the void and type your command...",
    },
  },
  {
    id: "xenon",
    label: "Xenon Core",
    config: {
      coreName: "XENON.CORE",
      typingColor: "#2dd4bf",
      hoverColor: "#a855f7",
      whisper: "Injecting quantum signals into the Xenon Core...",
    },
  },
  {
    id: "aether",
    label: "Aether Void",
    config: {
      coreName: "AETHER.VOID",
      typingColor: "#e11d48",
      hoverColor: "#10b981",
      whisper: "Whisper into the cosmic aether...",
    },
  },
];

export const MalakorSingularityPage = () => {
  const [coreName, setCoreName] = useState(DEFAULT_CORE_NAME);
  const [typingColor, setTypingColor] = useState(DEFAULT_TYPING_COLOR);
  const [hoverColor, setHoverColor] = useState(DEFAULT_HOVER_COLOR);
  const [whisper, setWhisper] = useState(DEFAULT_WHISPER);
  const [apiKey, setApiKey] = useState("");
  const [currentPreset, setCurrentPreset] = useState("default");
  const [key, setKey] = useState(0);

  const applyPreset = (presetId: string) => {
    const preset = presets.find((p) => p.id === presetId);
    if (preset) {
      setCurrentPreset(presetId);
      setCoreName(preset.config.coreName);
      setTypingColor(preset.config.typingColor);
      setHoverColor(preset.config.hoverColor);
      setWhisper(preset.config.whisper);
      setKey((prev) => prev + 1); // Reset the core animation with new preset values
    }
  };

  const handleReplay = () => {
    setKey((prev) => prev + 1);
  };

  const handleReset = () => {
    applyPreset("default");
    setApiKey("");
  };

  const usageCode = `<MalakorSingularity
  coreName="${coreName}"
  typingColor="${typingColor}"
  hoverColor="${hoverColor}"
  initialWhisper="${whisper}"${apiKey ? `\n  apiKey="${apiKey}"` : ""}
/>`;

  return (
    <div className="flex flex-col gap-5">
      <div id="malakor-singularity-title">
        <HeaderText text="Malakor Singularity" option={3} />
      </div>

      <div id="preview">
        <PreviewTab
          previewContent={
            <div className="w-full h-[600px] relative overflow-hidden flex items-center justify-center p-2">
              <MalakorSingularity
                key={key}
                coreName={coreName}
                typingColor={typingColor}
                hoverColor={hoverColor}
                initialWhisper={whisper}
                apiKey={apiKey}
                showApiKeyButton={false} // Configured via controls instead
                className="relative w-full h-full bg-black overflow-hidden select-none cursor-crosshair text-neutral-200 border border-neutral-800 rounded-xl"
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
                  Configuration
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
            label="Core HUD Label"
            value={coreName}
            onChange={setCoreName}
            placeholder="e.g. MALAKOR.SINGULARITY..."
          />

          <DefaultTextInput
            label="Initial Typewriter Text"
            value={whisper}
            onChange={(val) => {
              setWhisper(val);
              // Trigger typewriter reload
              setKey((prev) => prev + 1);
            }}
            placeholder="Typewriter whisper on load..."
          />

          <DefaultTextInput
            label="Cognitive API Key (Gemini)"
            value={apiKey}
            onChange={setApiKey}
            placeholder="AI response API key..."
          />

          <ColorPicker
            label="Typing Flare Color"
            value={typingColor}
            onChange={setTypingColor}
          />

          <ColorPicker
            label="Hover Flare Color"
            value={hoverColor}
            onChange={setHoverColor}
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

export default MalakorSingularityPage;
