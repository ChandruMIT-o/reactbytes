"use client";

import React, { useState } from "react";
import HeaderText from "../../components/textfields/HeaderText";
import ParagraphText from "../../components/textfields/ParagraphText";
import PreviewTab from "../../components/tabsection/PreviewTab";
import InstallationTabs from "../../components/tabsection/InstallationTabs";
import { PropsTable } from "../../components/table/PropsTable";
import { SlidingMenu } from "../../meta/menu/SlidingMenu/SlidingMenu";
import { loaderProps, interfaceProps, componentCode, creditsData } from "./SlidingMenuData";
import DefaultTextInput from "@/app/components/textinput/DefaultTextInput";
import ColorPicker from "@/app/components/colorpicker/ColorPicker";
import { RotateCcw } from "lucide-react";
import DefaultComboBox from "@/app/components/combobox/DefaultComboBox";
import { Credits } from "../../components/buttongroup/Credits";

const presets = [
  {
    id: "default",
    label: "Default Blue",
    config: {
      logoText: "BRAND",
      primaryColor: "#0055ff",
      secondaryColor: "#f2eee9",
      neutralColor: "#111111",
      accentColor: "#0055ff",
      hoverBgColor: "#222222",
      textColor: "#ffffff",
    },
  },
  {
    id: "cyber",
    label: "Cyber Green",
    config: {
      logoText: "MATRIX",
      primaryColor: "#00ff66",
      secondaryColor: "#0a0a0c",
      neutralColor: "#020202",
      accentColor: "#00ff66",
      hoverBgColor: "#113311",
      textColor: "#00ff66",
    },
  },
  {
    id: "sunset",
    label: "Sunset Rose",
    config: {
      logoText: "HORIZON",
      primaryColor: "#ff5e62",
      secondaryColor: "#ff9966",
      neutralColor: "#1e131d",
      accentColor: "#ff5e62",
      hoverBgColor: "#412a3d",
      textColor: "#f5e8f4",
    },
  },
];

export const SlidingMenuPage = () => {
  const [logoText, setLogoText] = useState(presets[0].config.logoText);
  const [primaryColor, setPrimaryColor] = useState(presets[0].config.primaryColor);
  const [secondaryColor, setSecondaryColor] = useState(presets[0].config.secondaryColor);
  const [neutralColor, setNeutralColor] = useState(presets[0].config.neutralColor);
  const [accentColor, setAccentColor] = useState(presets[0].config.accentColor);
  const [hoverBgColor, setHoverBgColor] = useState(presets[0].config.hoverBgColor);
  const [textColor, setTextColor] = useState(presets[0].config.textColor);
  const [currentPreset, setCurrentPreset] = useState("default");
  const [key, setKey] = useState(0);

  const applyPreset = (presetId: string) => {
    const preset = presets.find((p) => p.id === presetId);
    if (preset) {
      setCurrentPreset(presetId);
      setLogoText(preset.config.logoText);
      setPrimaryColor(preset.config.primaryColor);
      setSecondaryColor(preset.config.secondaryColor);
      setNeutralColor(preset.config.neutralColor);
      setAccentColor(preset.config.accentColor);
      setHoverBgColor(preset.config.hoverBgColor);
      setTextColor(preset.config.textColor);
      setKey((prev) => prev + 1);
    }
  };

  const handleReset = () => {
    applyPreset("default");
  };

  const usageCode = `<SlidingMenu
  logoText="${logoText}"
  primaryColor="${primaryColor}"
  secondaryColor="${secondaryColor}"
  neutralColor="${neutralColor}"
  accentColor="${accentColor}"
  hoverBgColor="${hoverBgColor}"
  textColor="${textColor}"
/>`;

  return (
    <div className="flex flex-col gap-5">
      <div id="sliding-menu-title">
        <HeaderText text="Sliding Menu" option={3} />
      </div>
      <ParagraphText
        text="A modern, high-fidelity slide-out menu bar. Features layered background panels that slide in sequentially on trigger, clean text-reveal offset transforms on link hover, and dynamic color/branding customizability. Built with GSAP."
        option={4}
      />

      <div id="preview">
        <PreviewTab
          previewContent={
            <div className="w-full h-[550px] relative bg-zinc-950 rounded-3xl overflow-hidden border border-white/5 flex flex-col justify-center items-center">
              {/* Decorative clean background mesh text */}
              <div className="absolute opacity-10 pointer-events-none flex flex-col items-center">
                <span className="text-zinc-600 font-mono text-[80px] font-bold tracking-widest select-none uppercase">MENU</span>
              </div>
              
              <SlidingMenu
                key={key}
                logoText={logoText}
                primaryColor={primaryColor}
                secondaryColor={secondaryColor}
                neutralColor={neutralColor}
                accentColor={accentColor}
                hoverBgColor={hoverBgColor}
                textColor={textColor}
                isFixed={false}
              />
            </div>
          }
          usageCode={usageCode}
          codeContent={componentCode}
          collapsible={true}
          header={
            <div className="flex items-center justify-between ">
              <div className="flex flex-col gap-1">
                <h3 className="text-xs ml-4 font-bold text-rb-accent-1 uppercase">
                  Props
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
            label="Logo Text"
            value={logoText}
            onChange={setLogoText}
            placeholder="Logo text..."
          />

          <ColorPicker
            label="Text Color"
            value={textColor}
            onChange={setTextColor}
          />

          <ColorPicker
            label="Accent Color"
            value={accentColor}
            onChange={setAccentColor}
          />

          <ColorPicker
            label="Panel 1 Background"
            value={primaryColor}
            onChange={setPrimaryColor}
          />

          <ColorPicker
            label="Panel 2 Background"
            value={secondaryColor}
            onChange={setSecondaryColor}
          />

          <ColorPicker
            label="Panel 3 Background"
            value={neutralColor}
            onChange={setNeutralColor}
          />

          <ColorPicker
            label="Link Hover Background"
            value={hoverBgColor}
            onChange={setHoverBgColor}
          />
        </PreviewTab>
      </div>

      <div id="installation-tabs">
        <InstallationTabs />
      </div>

      <div id="api-reference" className="flex flex-col gap-5">
        <HeaderText text="API Reference" option={6} />
        <PropsTable categories={loaderProps} />
        <div className="mt-4">
          <PropsTable categories={interfaceProps} />
        </div>
      </div>

      <div id="credits" className="w-full max-w-5xl mx-auto py-10">
        <Credits data={creditsData} />
      </div>
    </div>
  );
};

export default SlidingMenuPage;
