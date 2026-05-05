"use client";
import React, { useState } from "react";
import HeaderText from "../../components/textfields/HeaderText";
import ParagraphText from "../../components/textfields/ParagraphText";
import PreviewTab from "../../components/tabsection/PreviewTab";
import InstallationTabs from "../../components/tabsection/InstallationTabs";
import { PropsTable } from "../../components/table/PropsTable";
import NovelMenu from "@/app/meta/menu/NovelMenu/NovelMenu";
import { NovelMenuProps, componentCode, creditsData } from "./NovelMenuData";
import { Credits } from "../../components/buttongroup/Credits";
import DefaultTextInput from "@/app/components/textinput/DefaultTextInput";
import ColorPicker from "@/app/components/colorpicker/ColorPicker";
import DefaultComboBox from "@/app/components/combobox/DefaultComboBox";

export default function NovelMenuPage() {
  const [brandName, setBrandName] = useState("NOVEL");
  const [accentColor, setAccentColor] = useState("#C0DEDD");

  const presets = [
    {
      name: "Default",
      config: { brandName: "NOVEL", accentColor: "#C0DEDD" },
    },
    {
      name: "Cyberpunk",
      config: { brandName: "CYBER", accentColor: "#00ffea" },
    },
    {
      name: "Royal Gold",
      config: { brandName: "PREMIUM", accentColor: "#D4AF37" },
    },
    {
      name: "Minimal Dark",
      config: { brandName: "VOID", accentColor: "#ffffff" },
    },
    {
      name: "Vibrant Pink",
      config: { brandName: "FLARE", accentColor: "#ff0080" },
    },
  ];

  const handlePresetChange = (preset: any) => {
    setBrandName(preset.config.brandName);
    setAccentColor(preset.config.accentColor);
  };

  return (
    <div className="flex flex-col gap-12 p-8">
      <section id="novel-menu-title">
        <HeaderText text="Novel Menu" />
        <ParagraphText text="A high-fidelity, full-screen navigation menu featuring staggered column reveals and elastic hover animations powered by Anime.js." />
      </section>

      <PreviewTab 
        previewContent={
          <div className="lg:col-span-3 h-[600px] relative rounded-xl overflow-hidden border border-white/10 bg-[#1D1C21]">
              <NovelMenu 
                  brandName={brandName}
                  accentColor={accentColor}
              />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <p className="text-white/20 text-sm italic">Click the menu icon in the top right to preview</p>
              </div>
          </div>
        }
        codeContent={componentCode}
        header={
          <div className="flex items-center justify-between w-full">
            <div className="flex flex-col gap-1">
              <h3 className="text-xs ml-4 font-bold text-rb-accent-1 uppercase">Controls</h3>
            </div>
            <div className="flex items-center gap-4">
              <DefaultComboBox
                label="Presets"
                options={presets.map(p => ({ id: p.name, label: p.name }))}
                value={brandName === "NOVEL" ? "Default" : presets.find(p => p.config.brandName === brandName)?.name || "Default"}
                onChange={(val) => {
                  const preset = presets.find(p => p.name === val);
                  if (preset) handlePresetChange(preset);
                }}
                dynamicWidth={true}
              />
            </div>
          </div>
        }
      >
        <DefaultTextInput
          label="Brand Name"
          value={brandName}
          onChange={(v) => setBrandName(v)}
        />
        <ColorPicker
          label="Accent Color"
          value={accentColor}
          onChange={(v) => setAccentColor(v)}
        />
      </PreviewTab>

      <div id="installation-tabs">
        <InstallationTabs />
      </div>

      <section id="api-reference">
        <HeaderText text="API Reference" />
        <PropsTable categories={[{ title: "Props", props: NovelMenuProps }]} />
      </section>

      <section id="credits">
        <HeaderText text="Credits" />
        <Credits data={creditsData} />
      </section>
    </div>
  );
}
