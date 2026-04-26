"use client";
import React, { useState } from "react";
import { RotateCcw } from "lucide-react";
import HeaderText from "../../components/textfields/HeaderText";
import ParagraphText from "../../components/textfields/ParagraphText";
import PreviewTab from "../../components/tabsection/PreviewTab";
import InstallationTabs from "../../components/tabsection/InstallationTabs";
import { PropsTable } from "../../components/table/PropsTable";
import { VerticalMenu } from "@/app/meta/menu/VerticalMenu/VerticalMenu";
import { VerticalMenuProps, componentCode, creditsData } from "./VerticalMenuData";
import { Credits } from "../../components/buttongroup/Credits";
import ColorPicker from "@/app/components/colorpicker/ColorPicker";
import DefaultComboBox from "@/app/components/combobox/DefaultComboBox";
import { DiscreteSlider2 } from "../../components/slider/DiscreteSlider2";

const VerticalMenuPage = () => {
  const defaultItems = [
    { id: "home", label: "Home" },
    { id: "about", label: "About Us" },
    { id: "office", label: "Office Bearers" },
    { id: "activities", label: "ITA Activities" },
    { id: "gallery", label: "Gallery" },
    { id: "contact", label: "Contact" },
  ];

  const [activeColor, setActiveColor] = useState("#121AFF");
  const [hoverColor, setHoverColor] = useState("#4753BF");
  const [stiffness, setStiffness] = useState(300);
  const [damping, setDamping] = useState(30);
  const [selectedId, setSelectedId] = useState("home");
  const [currentPreset, setCurrentPreset] = useState("classic");

  const presets = [
    {
      id: "classic",
      label: "Classic Blue",
      config: {
        activeColor: "#121AFF",
        hoverColor: "#4753BF",
        stiffness: 300,
        damping: 30,
      }
    },
    {
      id: "slow-liquid",
      label: "Slow Liquid",
      config: {
        activeColor: "#10b981",
        hoverColor: "#059669",
        stiffness: 80,
        damping: 20,
      }
    },
    {
      id: "bouncy",
      label: "Bouncy Rose",
      config: {
        activeColor: "#f43f5e",
        hoverColor: "#e11d48",
        stiffness: 500,
        damping: 15,
      }
    },
    {
      id: "minimal-snap",
      label: "Minimal Snap",
      config: {
        activeColor: "#f59e0b",
        hoverColor: "#d97706",
        stiffness: 1000,
        damping: 50,
      }
    },
    {
      id: "electric",
      label: "Electric",
      config: {
        activeColor: "#8b5cf6",
        hoverColor: "#7c3aed",
        stiffness: 400,
        damping: 25,
      }
    },
  ];

  const applyPreset = (presetId: string) => {
    const preset = presets.find((p) => p.id === presetId);
    if (preset) {
      setCurrentPreset(presetId);
      setActiveColor(preset.config.activeColor);
      setHoverColor(preset.config.hoverColor);
      setStiffness(preset.config.stiffness);
      setDamping(preset.config.damping);
    }
  };

  const handleReset = () => {
    applyPreset("classic");
  };

  const usageCode = `<VerticalMenu
  items={[
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About Us' },
    // ...
  ]}
  activeColor="${activeColor}"
  hoverColor="${hoverColor}"
  stiffness={${stiffness}}
  damping={${damping}}
  onSelect={(id) => console.log(id)}
/>`;

  return (
    <div className="flex flex-col gap-5">
      <div id="vertical-menu-title">
        <HeaderText text="Vertical Menu" option={3} />
      </div>
      <ParagraphText text="A premium, animated vertical menu component featuring liquid hover and active selection transitions. Perfect for sidebars and navigation drawers." option={4} />

      <div id="preview">
        <PreviewTab
          previewContent={
            <div className="w-full h-[450px] relative overflow-hidden flex items-center justify-end pr-12 group bg-rb-neutral-2/30 rounded-[18px]">
               <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-50 transition-opacity duration-500" />
               <VerticalMenu
                  items={defaultItems}
                  defaultSelected={selectedId}
                  onSelect={(id) => setSelectedId(id)}
                  activeColor={activeColor}
                  hoverColor={hoverColor}
                  stiffness={stiffness}
                  damping={damping}
               />
               <div className="absolute bottom-8 left-8 p-4 bg-rb-neutral-3/80 backdrop-blur-md rounded-2xl border border-white/5 shadow-2xl">
                  <p className="text-rb-accent-2/60 text-[10px] uppercase tracking-[0.2em] mb-1 font-bold">Selected Item</p>
                  <strong style={{ color: activeColor }} className="text-xl font-bold tracking-tight transition-colors duration-300">
                      {defaultItems.find(item => item.id === selectedId)?.label}
                  </strong>
               </div>
            </div>
          }
          usageCode={usageCode}
          codeContent={componentCode}
          collapsible={true}
          header={
            <div className="flex items-center justify-between gap-3">
              <div className="hidden sm:block">
                <h3 className="text-xs ml-4 font-bold text-rb-accent-1 uppercase">
                  Configuration
                </h3>
              </div>
              <DefaultComboBox
                options={presets}
                value={currentPreset}
                onChange={applyPreset}
                dynamicWidth={true}
              />
              <div className="flex items-center gap-3 flex-1 sm:flex-none justify-start sm:justify-end">
                <button
                  onClick={handleReset}
                  className="group p-2.5 rounded-full bg-rb-neutral-3 text-rb-accent-1/40 border border-rb-neutral-4 hover:text-rb-accent-3 transition-all duration-300 shrink-0"
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
          <ColorPicker
            label="Active Text Color"
            value={activeColor}
            onChange={setActiveColor}
          />

          <ColorPicker
            label="Hover Text Color"
            value={hoverColor}
            onChange={setHoverColor}
          />

          <DiscreteSlider2
            label="Spring Stiffness"
            min={10}
            max={1000}
            step={10}
            value={stiffness}
            onChange={setStiffness}
            showTicks={true}
          />

          <DiscreteSlider2
            label="Spring Damping"
            min={1}
            max={100}
            step={1}
            value={damping}
            onChange={setDamping}
            showTicks={true}
          />


        </PreviewTab>
      </div>

      <div id="installation-tabs">
        <InstallationTabs />
      </div>

      <div id="api-reference" className="flex flex-col gap-5 mt-4">
        <HeaderText text="API Reference" option={6} />
        <PropsTable categories={[{ title: "Vertical Menu Props", props: VerticalMenuProps }]} />
      </div>

      <div id="credits" className="w-full max-w-5xl mx-auto py-10">
        <Credits data={creditsData} />
      </div>
    </div>
  );
};

export default VerticalMenuPage;
