"use client";

import React, { useState } from "react";
import HeaderText from "../../components/textfields/HeaderText";
import ParagraphText from "../../components/textfields/ParagraphText";
import PreviewTab from "../../components/tabsection/PreviewTab";
import InstallationTabs from "../../components/tabsection/InstallationTabs";
import { PropsTable } from "../../components/table/PropsTable";
import { Superstructure } from "../../meta/background/space/Superstructure";
import { loaderProps, componentCode, creditsData } from "./SuperstructureData";
import ColorPicker from "@/app/components/colorpicker/ColorPicker";
import DiscreteSlider2 from "@/app/components/slider/DiscreteSlider2";
import DefaultComboBox from "@/app/components/combobox/DefaultComboBox";
import ToggleComponent from "@/app/components/buttongroup/ToggleComponent";
import { Credits } from "../../components/buttongroup/Credits";
import { RotateCcw } from "lucide-react";

const presets = [
  {
    id: "emerald",
    label: "Emerald Lattice (Default)",
    config: {
      startColor: "#ff00ff",
      endColor: "#8080ff",
      bgColor: "#010c05ff",
      radius: 900,
      detail: 20,
      opacity: 0.25,
      speed: 1.0,
      enableControls: true,
      autoRotate: false,
    },
  },
  {
    id: "cyber",
    label: "Cyber Portal",
    config: {
      startColor: "#00ffff",
      endColor: "#ff0055",
      bgColor: "#050508",
      radius: 900,
      detail: 24,
      opacity: 0.35,
      speed: 1.5,
      enableControls: true,
      autoRotate: true,
    },
  },
  {
    id: "void",
    label: "True Void",
    config: {
      startColor: "#ffffff",
      endColor: "#333333",
      bgColor: "#000000",
      radius: 900,
      detail: 12,
      opacity: 0.15,
      speed: 0.5,
      enableControls: true,
      autoRotate: false,
    },
  },
];

export const SuperstructurePage = () => {
  const [startColor, setStartColor] = useState(presets[0].config.startColor);
  const [endColor, setEndColor] = useState(presets[0].config.endColor);
  const [bgColor, setBgColor] = useState(presets[0].config.bgColor);
  const [radius, setRadius] = useState(presets[0].config.radius);
  const [detail, setDetail] = useState(presets[0].config.detail);
  const [opacity, setOpacity] = useState(presets[0].config.opacity);
  const [speed, setSpeed] = useState(presets[0].config.speed);
  const [enableControls, setEnableControls] = useState(presets[0].config.enableControls);
  const [autoRotate, setAutoRotate] = useState(presets[0].config.autoRotate);

  const [currentPreset, setCurrentPreset] = useState("emerald");
  const [key, setKey] = useState(0);

  const applyPreset = (presetId: string) => {
    const preset = presets.find((p) => p.id === presetId);
    if (preset) {
      setCurrentPreset(presetId);
      setStartColor(preset.config.startColor);
      setEndColor(preset.config.endColor);
      setBgColor(preset.config.bgColor);
      setRadius(preset.config.radius);
      setDetail(preset.config.detail);
      setOpacity(preset.config.opacity);
      setSpeed(preset.config.speed);
      setEnableControls(preset.config.enableControls);
      setAutoRotate(preset.config.autoRotate);
      setKey((prev) => prev + 1);
    }
  };

  const handleReplay = () => {
    setKey((prev) => prev + 1);
  };

  const handleReset = () => {
    applyPreset("emerald");
  };

  const usageCode = `<Superstructure
  startColor="${startColor}"
  endColor="${endColor}"
  bgColor="${bgColor}"
  radius={${radius}}
  detail={${detail}}
  opacity={${opacity}}
  speed={${speed}}
  enableControls={${enableControls}}
  autoRotate={${autoRotate}}
/>`;

  return (
    <div className="flex flex-col gap-5">
      <div id="superstructure-title">
        <HeaderText text="Superstructure Mesh" option={3} />
        <ParagraphText
          text="A massive 3D wireframe lattice structure enclosing the viewport, with custom vertex displacement mapping and customizable fragment gradients. Drag to orbit inside the superstructure."
          option={4}
        />
      </div>

      <div id="preview">
        <PreviewTab
          previewContent={
            <div className="w-full h-[400px] relative overflow-hidden">
              <Superstructure
                key={key}
                startColor={startColor}
                endColor={endColor}
                bgColor={bgColor}
                radius={radius}
                detail={detail}
                opacity={opacity}
                speed={speed}
                enableControls={enableControls}
                autoRotate={autoRotate}
              >
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none p-6 text-center select-none">
                  <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white uppercase drop-shadow-md font-mono">
                    Superstructure
                  </h2>
                  <p className="text-xs md:text-sm font-bold text-white/50 tracking-widest mt-2 uppercase font-mono">
                    3D WebGL Wireframe Cage // Drag to Orbit
                  </p>
                </div>
              </Superstructure>
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
                  Lattice Controls
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
            label="Cage Radius"
            min={400}
            max={1500}
            step={50}
            value={radius}
            onChange={(val) => {
              setRadius(val);
              setKey((prev) => prev + 1);
            }}
            maxDecimals={0}
            showTicks={false}
          />

          <DiscreteSlider2
            label="Lattice Detail"
            min={4}
            max={35}
            step={1}
            value={detail}
            onChange={(val) => {
              setDetail(val);
              setKey((prev) => prev + 1);
            }}
            maxDecimals={0}
            showTicks={false}
          />

          <DiscreteSlider2
            label="Line Opacity"
            min={0.05}
            max={1.0}
            step={0.05}
            value={opacity}
            onChange={(val) => {
              setOpacity(val);
              setKey((prev) => prev + 1);
            }}
            maxDecimals={2}
            showTicks={false}
          />

          <DiscreteSlider2
            label="Speed"
            min={0.1}
            max={4.0}
            step={0.1}
            value={speed}
            onChange={setSpeed}
            maxDecimals={1}
            showTicks={false}
          />

          <ToggleComponent
            label="Enable Orbit Controls"
            checked={enableControls}
            onChange={setEnableControls}
          />

          <ToggleComponent
            label="Auto Rotate Camera"
            checked={autoRotate}
            onChange={setAutoRotate}
          />

          <ColorPicker
            label="Gradient Start"
            value={startColor}
            onChange={setStartColor}
          />

          <ColorPicker
            label="Gradient End"
            value={endColor}
            onChange={setEndColor}
          />

          <ColorPicker
            label="Background Color"
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

export default SuperstructurePage;
