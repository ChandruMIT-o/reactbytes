"use client";

import React, { useState } from "react";
import HeaderText from "../../components/textfields/HeaderText";
import ParagraphText from "../../components/textfields/ParagraphText";
import PreviewTab from "../../components/tabsection/PreviewTab";
import InstallationTabs from "../../components/tabsection/InstallationTabs";
import { PropsTable } from "../../components/table/PropsTable";
import { WarpSpeed } from "../../meta/background/space/WarpSpeed/WarpSpeed";
import { loaderProps, componentCode, creditsData } from "./WarpSpeedData";
import DefaultTextInput from "@/app/components/textinput/DefaultTextInput";
import DiscreteSlider2 from "@/app/components/slider/DiscreteSlider2";
import ToggleComponent from "@/app/components/buttongroup/ToggleComponent";
import DefaultComboBox from "@/app/components/combobox/DefaultComboBox";
import { Credits } from "../../components/buttongroup/Credits";

const presets = [
  {
    id: "default",
    label: "Classic Warp",
    config: {
      title: "WARP DRIVE ACTIVE",
      starCount: 400,
      sensitivity: 0.8,
      friction: 0.95,
      hueShift: 216,
      trailLength: 1.0,
      minSize: 0.5,
      maxSize: 3.0,
      showShip: true,
      showMouseHint: true,
      preventPageScroll: false,
    },
  },
  {
    id: "hyperdrive",
    label: "Hyperdrive",
    config: {
      title: "HYPERSPACE VELOCITY",
      starCount: 1000,
      sensitivity: 2.0,
      friction: 0.98,
      hueShift: 120,
      trailLength: 0.5,
      minSize: 0.8,
      maxSize: 4.5,
      showShip: true,
      showMouseHint: false,
      preventPageScroll: false,
    },
  },
  {
    id: "solar",
    label: "Solar Nebula",
    config: {
      title: "SOLAR NEBULA GLIDE",
      starCount: 600,
      sensitivity: 0.4,
      friction: 0.90,
      hueShift: 25,
      trailLength: 2.0,
      minSize: 0.3,
      maxSize: 2.5,
      showShip: true,
      showMouseHint: true,
      preventPageScroll: false,
    },
  },
  {
    id: "deepspace",
    label: "Deep Space",
    config: {
      title: "DEEP COSMOS",
      starCount: 300,
      sensitivity: 1.2,
      friction: 0.85,
      hueShift: 0,
      trailLength: 1.0,
      minSize: 0.2,
      maxSize: 1.5,
      showShip: false,
      showMouseHint: false,
      preventPageScroll: false,
    },
  },
];

export const WarpSpeedPage = () => {
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

  const usageCode = `<WarpSpeed
  starCount={${config.starCount}}
  sensitivity={${config.sensitivity}}
  friction={${config.friction}}
  hueShift={${config.hueShift}}
  trailLength={${config.trailLength}}
  minSize={${config.minSize}}
  maxSize={${config.maxSize}}
  showShip={${config.showShip}}
  showMouseHint={${config.showMouseHint}}
  preventPageScroll={${config.preventPageScroll}}
>
  <h1 className="text-white text-6xl font-bold tracking-tighter mix-blend-difference">
    ${config.title}
  </h1>
</WarpSpeed>`;

  return (
    <div className="flex flex-col gap-5">
      <div id="warp-speed-title">
        <HeaderText text="Warp Speed" option={3} />
      </div>
      <ParagraphText
        text="A canvas-based interactive starfield that simulates warp-speed travel. Scroll within the field to fly, steer, and accelerate the spaceship."
        option={4}
      />

      <div id="preview">
        <PreviewTab
          previewContent={
            <WarpSpeed
              key={key}
              starCount={config.starCount}
              sensitivity={config.sensitivity}
              friction={config.friction}
              hueShift={config.hueShift}
              trailLength={config.trailLength}
              minSize={config.minSize}
              maxSize={config.maxSize}
              showShip={config.showShip}
              showMouseHint={config.showMouseHint}
              preventPageScroll={config.preventPageScroll}
              className="w-full h-[550px] border border-white/5 rounded-xl cursor-pointer relative"
            >
              <div className="text-[clamp(1.5rem,6vw,4rem)] font-extrabold tracking-tighter text-white/95 drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] mix-blend-difference select-none text-center p-6 uppercase">
                {config.title}
              </div>
            </WarpSpeed>
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
                value={presets.find((p) => p.config.starCount === config.starCount && p.config.hueShift === config.hueShift && p.config.showShip === config.showShip)?.id || ""}
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
            label="Star Count"
            min={50}
            max={1500}
            step={50}
            value={config.starCount}
            onChange={(val) => updateConfig("starCount", val)}
            showTicks={true}
          />

          <DiscreteSlider2
            label="Scroll Sensitivity"
            min={0.1}
            max={3.0}
            step={0.1}
            value={config.sensitivity}
            onChange={(val) => updateConfig("sensitivity", val)}
            maxDecimals={1}
            showTicks={true}
          />

          <DiscreteSlider2
            label="Inertia Decay"
            min={0.80}
            max={0.99}
            step={0.01}
            value={config.friction}
            onChange={(val) => updateConfig("friction", val)}
            maxDecimals={2}
            showTicks={true}
          />

          <DiscreteSlider2
            label="Energy Hue Color"
            min={0}
            max={360}
            step={1}
            value={config.hueShift}
            onChange={(val) => updateConfig("hueShift", val)}
            showTicks={true}
          />

          <DiscreteSlider2
            label="Motion Trail"
            min={0.2}
            max={3.0}
            step={0.1}
            value={config.trailLength}
            onChange={(val) => updateConfig("trailLength", val)}
            maxDecimals={1}
            showTicks={true}
          />

          <DiscreteSlider2
            label="Min Star Size"
            min={0.1}
            max={3.0}
            step={0.1}
            value={config.minSize}
            onChange={(val) => updateConfig("minSize", Math.min(val, config.maxSize))}
            maxDecimals={1}
            showTicks={true}
          />

          <DiscreteSlider2
            label="Max Star Size"
            min={1.0}
            max={10.0}
            step={0.1}
            value={config.maxSize}
            onChange={(val) => updateConfig("maxSize", Math.max(val, config.minSize))}
            maxDecimals={1}
            showTicks={true}
          />

          <ToggleComponent
            label="Show Spaceship"
            checked={config.showShip}
            onChange={(val) => updateConfig("showShip", val)}
          />

          <ToggleComponent
            label="Show Mouse Hint"
            checked={config.showMouseHint}
            onChange={(val) => updateConfig("showMouseHint", val)}
          />

          <ToggleComponent
            label="Prevent Page Scroll"
            checked={config.preventPageScroll}
            onChange={(val) => updateConfig("preventPageScroll", val)}
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

export default WarpSpeedPage;
