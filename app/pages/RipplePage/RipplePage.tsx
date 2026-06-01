"use client";

import React, { useState } from "react";
import HeaderText from "../../components/textfields/HeaderText";
import ParagraphText from "../../components/textfields/ParagraphText";
import PreviewTab from "../../components/tabsection/PreviewTab";
import InstallationTabs from "../../components/tabsection/InstallationTabs";
import { PropsTable } from "../../components/table/PropsTable";
import Ripple from "../../meta/background/wave/Ripples/Ripple";
import { loaderProps, componentCode, creditsData } from "./RippleData";
import DiscreteSlider2 from "@/app/components/slider/DiscreteSlider2";
import DefaultComboBox from "@/app/components/combobox/DefaultComboBox";
import ColorPicker from "@/app/components/colorpicker/ColorPicker";
import ToggleComponent from "@/app/components/buttongroup/ToggleComponent";
import { Credits } from "../../components/buttongroup/Credits";
import { RotateCcw } from "lucide-react";

// Convert Hex to RGB vec3 Array
const hexToRgbVec3 = (hex: string): [number, number, number] => {
  const r = parseInt(hex.substring(1, 3), 16) / 255;
  const g = parseInt(hex.substring(3, 5), 16) / 255;
  const b = parseInt(hex.substring(5, 7), 16) / 255;
  return [
    parseFloat(r.toFixed(3)),
    parseFloat(g.toFixed(3)),
    parseFloat(b.toFixed(3))
  ];
};

// Convert RGB vec3 to Hex String
const rgbVec3ToHex = (vec: [number, number, number]): string => {
  const r = Math.round(vec[0] * 255).toString(16).padStart(2, '0');
  const g = Math.round(vec[1] * 255).toString(16).padStart(2, '0');
  const b = Math.round(vec[2] * 255).toString(16).padStart(2, '0');
  return `#${r}${g}${b}`;
};

const presets = [
  {
    id: "cosmic",
    label: "Deep Cosmic",
    config: {
      zoom: 1.4,
      speed: 0.25,
      threadsFreq: 24.0,
      brightness: 1.8,
      mouseInfluence: 0.9,
      clickToSpike: true,
      colorBase: [0.15, 0.45, 1.0] as [number, number, number],
    },
  },
  {
    id: "cyberpunk",
    label: "Cyber Neon",
    config: {
      zoom: 1.8,
      speed: 0.45,
      threadsFreq: 38.0,
      brightness: 2.2,
      mouseInfluence: 1.2,
      clickToSpike: true,
      colorBase: [1.0, 0.1, 0.6] as [number, number, number],
    },
  },
  {
    id: "emerald",
    label: "Emerald Silk",
    config: {
      zoom: 1.1,
      speed: 0.15,
      threadsFreq: 18.0,
      brightness: 1.4,
      mouseInfluence: 0.5,
      clickToSpike: true,
      colorBase: [0.1, 0.9, 0.4] as [number, number, number],
    },
  },
  {
    id: "solar",
    label: "Solar Flare",
    config: {
      zoom: 2.0,
      speed: 0.5,
      threadsFreq: 45.0,
      brightness: 2.5,
      mouseInfluence: 1.5,
      clickToSpike: true,
      colorBase: [1.0, 0.5, 0.0] as [number, number, number],
    },
  },
  {
    id: "monochrome",
    label: "Liquid Platinum",
    config: {
      zoom: 1.5,
      speed: 0.2,
      threadsFreq: 30.0,
      brightness: 1.6,
      mouseInfluence: 0.8,
      clickToSpike: true,
      colorBase: [0.9, 0.95, 1.0] as [number, number, number],
    },
  },
];

export const RipplePage = () => {
  const [zoom, setZoom] = useState(presets[0].config.zoom);
  const [speed, setSpeed] = useState(presets[0].config.speed);
  const [threadsFreq, setThreadsFreq] = useState(presets[0].config.threadsFreq);
  const [brightness, setBrightness] = useState(presets[0].config.brightness);
  const [mouseInfluence, setMouseInfluence] = useState(presets[0].config.mouseInfluence);
  const [clickToSpike, setClickToSpike] = useState(presets[0].config.clickToSpike);
  const [colorBase, setColorBase] = useState<[number, number, number]>(presets[0].config.colorBase);

  const [currentPreset, setCurrentPreset] = useState("cosmic");
  const [key, setKey] = useState(0);

  const applyPreset = (presetId: string) => {
    const preset = presets.find((p) => p.id === presetId);
    if (preset) {
      setCurrentPreset(presetId);
      setZoom(preset.config.zoom);
      setSpeed(preset.config.speed);
      setThreadsFreq(preset.config.threadsFreq);
      setBrightness(preset.config.brightness);
      setMouseInfluence(preset.config.mouseInfluence);
      setClickToSpike(preset.config.clickToSpike);
      setColorBase(preset.config.colorBase);
      setKey((prev) => prev + 1);
    }
  };

  const handleReset = () => {
    applyPreset("cosmic");
  };

  const usageCode = `<Ripple
  zoom={${zoom.toFixed(2)}}
  speed={${speed.toFixed(2)}}
  threadsFreq={${threadsFreq.toFixed(1)}}
  brightness={${brightness.toFixed(1)}}
  mouseInfluence={${mouseInfluence.toFixed(2)}}
  clickToSpike={${clickToSpike}}
  colorBase={[${colorBase.map(c => c.toFixed(2)).join(", ")}]}
/>`;

  return (
    <div className="flex flex-col gap-5">
      <div id="ripple-title">
        <HeaderText text="Interactive Ripple" option={3} />
      </div>
      <ParagraphText
        text="A high-performance WebGL fragment shader background showing fluid liquid ripples and glowing radial threads grid, fully responsive to mouse movements and hover bending forces."
        option={4}
      />

      <div id="preview">
        <PreviewTab
          previewContent={
            <Ripple
              key={key}
              zoom={zoom}
              speed={speed}
              threadsFreq={threadsFreq}
              brightness={brightness}
              mouseInfluence={mouseInfluence}
              clickToSpike={clickToSpike}
              colorBase={colorBase}
              className="w-full h-[500px] cursor-crosshair selection:bg-neutral-800"
            >
              <div className="w-full h-full flex flex-col items-center justify-center pointer-events-none p-6 text-center">
                <h2 className="text-3xl font-extrabold text-white tracking-wider mb-2 drop-shadow-md select-none">
                  INTERACTIVE WAVE SHADER
                </h2>
                <p className="text-sm text-white/65 max-w-md mb-6 drop-shadow select-none">
                  Move your cursor to warp the liquid threads. Click to emit a heavy distortion shockwave.
                </p>
                <button 
                  className="px-6 py-2.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-white font-medium text-xs hover:bg-white/20 transition-all duration-300 pointer-events-auto relative z-20"
                >
                  Explore Component
                </button>
              </div>
            </Ripple>
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
            label="Click To Spike Wave"
            checked={clickToSpike}
            onChange={(val) => {
              setClickToSpike(val);
            }}
          />

          <DiscreteSlider2
            label="Ripple Zoom (Sizing)"
            min={0.5}
            max={4.0}
            step={0.05}
            value={zoom}
            onChange={(val) => {
              setZoom(val);
              setCurrentPreset("custom");
            }}
            maxDecimals={2}
            showTicks={false}
          />

          <DiscreteSlider2
            label="Flow Speed"
            min={0.05}
            max={1.5}
            step={0.01}
            value={speed}
            onChange={(val) => {
              setSpeed(val);
              setCurrentPreset("custom");
            }}
            maxDecimals={2}
            showTicks={false}
          />

          <DiscreteSlider2
            label="Thread Grid Density"
            min={5.0}
            max={60.0}
            step={1.0}
            value={threadsFreq}
            onChange={(val) => {
              setThreadsFreq(val);
              setCurrentPreset("custom");
            }}
            maxDecimals={0}
            showTicks={false}
          />

          <DiscreteSlider2
            label="Mouse Interaction Level"
            min={0.0}
            max={2.5}
            step={0.05}
            value={mouseInfluence}
            onChange={(val) => {
              setMouseInfluence(val);
              setCurrentPreset("custom");
            }}
            maxDecimals={2}
            showTicks={false}
          />

          <DiscreteSlider2
            label="Wave Luminance Brightness"
            min={0.5}
            max={4.0}
            step={0.1}
            value={brightness}
            onChange={(val) => {
              setBrightness(val);
              setCurrentPreset("custom");
            }}
            maxDecimals={1}
            showTicks={false}
          />

          <ColorPicker
            label="Base Accent Tint Color"
            value={rgbVec3ToHex(colorBase)}
            onChange={(val) => {
              setColorBase(hexToRgbVec3(val));
              setCurrentPreset("custom");
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

export default RipplePage;
