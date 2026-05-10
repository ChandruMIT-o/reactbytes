"use client";

import React, { useState } from "react";
import HeaderText from "../../components/textfields/HeaderText";
import ParagraphText from "../../components/textfields/ParagraphText";
import PreviewTab from "../../components/tabsection/PreviewTab";
import InstallationTabs from "../../components/tabsection/InstallationTabs";
import { PropsTable } from "../../components/table/PropsTable";
import DottedVortex from "../../meta/background/dotted/DottedVortex";
import { loaderProps, componentCode, creditsData } from "./DottedVortexData";
import DiscreteSlider2 from "@/app/components/slider/DiscreteSlider2";
import DefaultComboBox from "@/app/components/combobox/DefaultComboBox";
import ColorPicker from "@/app/components/colorpicker/ColorPicker";
import DefaultTextInput from "@/app/components/textinput/DefaultTextInput";
import ToggleComponent from "@/app/components/buttongroup/ToggleComponent";
import { Credits } from "../../components/buttongroup/Credits";
import { RotateCcw } from "lucide-react";

const presets = [
  {
    id: "default",
    label: "Default Vortex",
    config: {
      bgColor: "#0a0a0a",
      activeDotColor: "#ffffff",
      idleDotColor: "rgba(255, 255, 255, 0.15)",
      gridSpacing: 24,
      baseDotRadius: 1.5,
      cursorFollowSpeed: 0.08,
      revealRadiusScale: 0.2,
      kineticEnergyMultiplier: 0.4,
      rippleSpeed: 10,
      twistAngle: 2.51,
      apertureSize: 0.12,
    },
  },
  {
    id: "matrix",
    label: "Digital Matrix",
    config: {
      bgColor: "#000500",
      activeDotColor: "#00ff41",
      idleDotColor: "rgba(0, 255, 65, 0.1)",
      gridSpacing: 20,
      baseDotRadius: 1.2,
      cursorFollowSpeed: 0.1,
      revealRadiusScale: 0.25,
      kineticEnergyMultiplier: 0.8,
      rippleSpeed: 12,
      twistAngle: 3.14,
      apertureSize: 0.15,
    },
  },
  {
    id: "dense",
    label: "Dense Fabric",
    config: {
      bgColor: "#111111",
      activeDotColor: "#ff0055",
      idleDotColor: "rgba(255, 0, 85, 0.05)",
      gridSpacing: 12,
      baseDotRadius: 1.0,
      cursorFollowSpeed: 0.05,
      revealRadiusScale: 0.15,
      kineticEnergyMultiplier: 0.2,
      rippleSpeed: 5,
      twistAngle: 1.5,
      apertureSize: 0.1,
    },
  },
  {
    id: "fluid",
    label: "Fluid Motion",
    config: {
      bgColor: "#000011",
      activeDotColor: "#00ffff",
      idleDotColor: "rgba(0, 255, 255, 0.2)",
      gridSpacing: 30,
      baseDotRadius: 2.5,
      cursorFollowSpeed: 0.2,
      revealRadiusScale: 0.3,
      kineticEnergyMultiplier: 1.2,
      rippleSpeed: 15,
      twistAngle: 6.28,
      apertureSize: 0.2,
    },
  },
];

export const DottedVortexPage = () => {
  const [isExcited, setIsExcited] = useState(false);
  const [bgColor, setBgColor] = useState(presets[0].config.bgColor);
  const [activeDotColor, setActiveDotColor] = useState(presets[0].config.activeDotColor);
  const [idleDotColor, setIdleDotColor] = useState(presets[0].config.idleDotColor);
  const [gridSpacing, setGridSpacing] = useState(presets[0].config.gridSpacing);
  const [baseDotRadius, setBaseDotRadius] = useState(presets[0].config.baseDotRadius);
  const [cursorFollowSpeed, setCursorFollowSpeed] = useState(presets[0].config.cursorFollowSpeed);
  const [revealRadiusScale, setRevealRadiusScale] = useState(presets[0].config.revealRadiusScale);
  const [kineticEnergyMultiplier, setKineticEnergyMultiplier] = useState(presets[0].config.kineticEnergyMultiplier);
  const [rippleSpeed, setRippleSpeed] = useState(presets[0].config.rippleSpeed);
  const [twistAngle, setTwistAngle] = useState(presets[0].config.twistAngle);
  const [apertureSize, setApertureSize] = useState(presets[0].config.apertureSize);

  const [currentPreset, setCurrentPreset] = useState("default");
  const [key, setKey] = useState(0);

  const applyPreset = (presetId: string) => {
    const preset = presets.find((p) => p.id === presetId);
    if (preset) {
      setCurrentPreset(presetId);
      setBgColor(preset.config.bgColor);
      setActiveDotColor(preset.config.activeDotColor);
      setIdleDotColor(preset.config.idleDotColor);
      setGridSpacing(preset.config.gridSpacing);
      setBaseDotRadius(preset.config.baseDotRadius);
      setCursorFollowSpeed(preset.config.cursorFollowSpeed);
      setRevealRadiusScale(preset.config.revealRadiusScale);
      setKineticEnergyMultiplier(preset.config.kineticEnergyMultiplier);
      setRippleSpeed(preset.config.rippleSpeed);
      setTwistAngle(preset.config.twistAngle);
      setApertureSize(preset.config.apertureSize);
      setKey((prev) => prev + 1);
    }
  };

  const handleReset = () => {
    applyPreset("default");
  };

  const usageCode = `<DottedVortex
  isExcited={${isExcited}}
  bgColor="${bgColor}"
  activeDotColor="${activeDotColor}"
  idleDotColor="${idleDotColor}"
  gridSpacing={${gridSpacing}}
  baseDotRadius={${baseDotRadius.toFixed(1)}}
  cursorFollowSpeed={${cursorFollowSpeed.toFixed(2)}}
  revealRadiusScale={${revealRadiusScale.toFixed(2)}}
  kineticEnergyMultiplier={${kineticEnergyMultiplier.toFixed(1)}}
  rippleSpeed={${rippleSpeed.toFixed(1)}}
  twistAngle={${twistAngle.toFixed(2)}}
  apertureSize={${apertureSize.toFixed(2)}}
/>`;

  return (
    <div className="flex flex-col gap-5">
      <div id="dotted-vortex-title">
        <HeaderText text="Dotted Vortex" option={3} />
      </div>
      <ParagraphText
        text="An interactive background component featuring a responsive dot grid that reveals a vibrant underlying dimension as your cursor moves, complete with fluid physics and twist mechanics."
        option={4}
      />

      <div id="preview">
        <PreviewTab
          previewContent={
            <DottedVortex
              key={key}
              isExcited={isExcited}
              bgColor={bgColor}
              activeDotColor={activeDotColor}
              idleDotColor={idleDotColor}
              gridSpacing={gridSpacing}
              baseDotRadius={baseDotRadius}
              cursorFollowSpeed={cursorFollowSpeed}
              revealRadiusScale={revealRadiusScale}
              kineticEnergyMultiplier={kineticEnergyMultiplier}
              rippleSpeed={rippleSpeed}
              twistAngle={twistAngle}
              apertureSize={apertureSize}
              className="w-full h-[500px] cursor-crosshair selection:bg-neutral-800"
            >
              <div className="w-full h-full flex flex-col items-center justify-center">
                <button 
                  className="px-8 py-3 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-white font-semibold text-sm hover:bg-white/20 hover:scale-105 transition-all duration-300 ease-out shadow-[0_0_20px_rgba(255,255,255,0.1)] pointer-events-auto relative z-20"
                  onMouseEnter={() => setIsExcited(true)}
                  onMouseLeave={() => setIsExcited(false)}
                >
                  Hover to Excite
                </button>
              </div>
            </DottedVortex>
          }
          usageCode={usageCode}
          codeContent={componentCode}
          collapsible={true}
          header={
            <div className="flex items-center justify-between ">
              <div className="flex flex-col gap-1">
                <h3 className="text-xs ml-4 font-bold text-rb-accent-1 uppercase">
                  Controls
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
          <ToggleComponent
            label="Excited State Override"
            checked={isExcited}
            onChange={(val) => {
              setIsExcited(val);
            }}
          />

          <DiscreteSlider2
            label="Grid Spacing"
            min={10}
            max={50}
            step={1}
            value={gridSpacing}
            onChange={setGridSpacing}
            maxDecimals={0}
            showTicks={false}
          />
          <DiscreteSlider2
            label="Base Dot Radius"
            min={0.5}
            max={5.0}
            step={0.1}
            value={baseDotRadius}
            onChange={setBaseDotRadius}
            maxDecimals={1}
            showTicks={false}
          />
          <DiscreteSlider2
            label="Cursor Follow Speed"
            min={0.01}
            max={1.0}
            step={0.01}
            value={cursorFollowSpeed}
            onChange={setCursorFollowSpeed}
            maxDecimals={2}
            showTicks={false}
          />
          <DiscreteSlider2
            label="Reveal Radius Scale"
            min={0.05}
            max={0.5}
            step={0.05}
            value={revealRadiusScale}
            onChange={setRevealRadiusScale}
            maxDecimals={2}
            showTicks={false}
          />
          <DiscreteSlider2
            label="Kinetic Energy"
            min={0.1}
            max={2.0}
            step={0.1}
            value={kineticEnergyMultiplier}
            onChange={setKineticEnergyMultiplier}
            maxDecimals={1}
            showTicks={false}
          />
          <DiscreteSlider2
            label="Ripple Speed"
            min={1}
            max={20}
            step={1}
            value={rippleSpeed}
            onChange={setRippleSpeed}
            maxDecimals={0}
            showTicks={false}
          />
          <DiscreteSlider2
            label="Twist Angle"
            min={0}
            max={6.28}
            step={0.1}
            value={twistAngle}
            onChange={setTwistAngle}
            maxDecimals={2}
            showTicks={false}
          />
          <DiscreteSlider2
            label="Aperture Size"
            min={0.05}
            max={0.5}
            step={0.05}
            value={apertureSize}
            onChange={setApertureSize}
            maxDecimals={2}
            showTicks={false}
          />

          <ColorPicker
            label="Background Color"
            value={bgColor}
            onChange={setBgColor}
          />
          <ColorPicker
            label="Active Dot Color"
            value={activeDotColor}
            onChange={setActiveDotColor}
          />
          <DefaultTextInput
            label="Idle Dot Color (rgba)"
            value={idleDotColor}
            onChange={setIdleDotColor}
            placeholder="rgba(255, 255, 255, 0.15)"
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

export default DottedVortexPage;
