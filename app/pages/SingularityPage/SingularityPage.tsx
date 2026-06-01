"use client";

import React, { useState } from "react";
import HeaderText from "../../components/textfields/HeaderText";
import ParagraphText from "../../components/textfields/ParagraphText";
import PreviewTab from "../../components/tabsection/PreviewTab";
import InstallationTabs from "../../components/tabsection/InstallationTabs";
import { PropsTable } from "../../components/table/PropsTable";
import Singularity from "../../meta/background/space/Singularity";
import { loaderProps, componentCode, creditsData } from "./SingularityData";
import DiscreteSlider2 from "@/app/components/slider/DiscreteSlider2";
import DefaultComboBox from "@/app/components/combobox/DefaultComboBox";
import ColorPicker from "@/app/components/colorpicker/ColorPicker";
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
    id: "stable",
    label: "Stable Singularity",
    config: {
      morph: 0.1,
      compress: 1.0,
      intensity: 1.0,
      orbitScale: 1.0,
      rotateSpeed: 0.4,
      colorBase: [0.0, 0.95, 1.0] as [number, number, number],
      camDist: 80,
      camPhi: 1.2,
    },
  },
  {
    id: "turbulence",
    label: "Accretion Turbulence",
    config: {
      morph: 4.5,
      compress: 1.15,
      intensity: 1.4,
      orbitScale: 1.8,
      rotateSpeed: 1.5,
      colorBase: [1.0, 0.6, 0.0] as [number, number, number],
      camDist: 95,
      camPhi: 1.35,
    },
  },
  {
    id: "collapse",
    label: "Relativistic Collapse",
    config: {
      morph: 0.8,
      compress: 0.38,
      intensity: 3.5,
      orbitScale: 4.5,
      rotateSpeed: 4.0,
      colorBase: [1.0, 0.0, 0.25] as [number, number, number],
      camDist: 55,
      camPhi: 1.5,
    },
  },
];

export const SingularityPage = () => {
  const [morph, setMorph] = useState(presets[0].config.morph);
  const [compress, setCompress] = useState(presets[0].config.compress);
  const [intensity, setIntensity] = useState(presets[0].config.intensity);
  const [orbitScale, setOrbitScale] = useState(presets[0].config.orbitScale);
  const [rotateSpeed, setRotateSpeed] = useState(presets[0].config.rotateSpeed);
  const [colorBase, setColorBase] = useState<[number, number, number]>(presets[0].config.colorBase);
  const [camDist, setCamDist] = useState(presets[0].config.camDist);
  const [camPhi, setCamPhi] = useState(presets[0].config.camPhi);

  const [currentPreset, setCurrentPreset] = useState("stable");
  const [key, setKey] = useState(0);

  const applyPreset = (presetId: string) => {
    const preset = presets.find((p) => p.id === presetId);
    if (preset) {
      setCurrentPreset(presetId);
      setMorph(preset.config.morph);
      setCompress(preset.config.compress);
      setIntensity(preset.config.intensity);
      setOrbitScale(preset.config.orbitScale);
      setRotateSpeed(preset.config.rotateSpeed);
      setColorBase(preset.config.colorBase);
      setCamDist(preset.config.camDist);
      setCamPhi(preset.config.camPhi);
      setKey((prev) => prev + 1);
    }
  };

  const handleReset = () => {
    applyPreset("stable");
  };

  const usageCode = `<Singularity
  morph={${morph.toFixed(2)}}
  compress={${compress.toFixed(2)}}
  intensity={${intensity.toFixed(2)}}
  orbitScale={${orbitScale.toFixed(2)}}
  rotateSpeed={${rotateSpeed.toFixed(2)}}
  colorBase={[${colorBase.map(c => c.toFixed(2)).join(", ")}]}
  camDist={${camDist}}
  camPhi={${camPhi.toFixed(2)}}
/>`;

  return (
    <div className="flex flex-col gap-5">
      <div id="singularity-title">
        <HeaderText text="Schwarzschild Singularity" option={3} />
      </div>
      <ParagraphText
        text="An interactive, ultra-premium 3D background component showing a Schwarzschild gravitational singularity core with Schwarzschild accretion disk streams, realistic Doppler color shifts, and dynamic custom orbital camera control."
        option={4}
      />

      <div id="preview">
        <PreviewTab
          previewContent={
            <Singularity
              key={key}
              morph={morph}
              compress={compress}
              intensity={intensity}
              orbitScale={orbitScale}
              rotateSpeed={rotateSpeed}
              colorBase={colorBase}
              camDist={camDist}
              camPhi={camPhi}
              className="w-full h-[500px] cursor-grab active:cursor-grabbing selection:bg-neutral-800"
            >
              <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center pointer-events-none p-6 text-center z-10">
                <h2 className="text-3xl font-extrabold text-white tracking-widest mb-2 drop-shadow-md select-none font-mono">
                  SINGULARITY CORE
                </h2>
                <p className="text-xs text-cyan-400 font-mono tracking-wider mb-6 select-none animate-pulse">
                  STATUS: NOMINAL ACCRETION FLOW
                </p>
                <button
                  className="px-6 py-2.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 backdrop-blur-md text-cyan-300 font-medium text-xs hover:bg-cyan-500/20 transition-all duration-300 pointer-events-auto relative z-20"
                >
                  Initiate Scan
                </button>
              </div>
            </Singularity>
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
          <DiscreteSlider2
            label="Disk Compression (Radius)"
            min={0.2}
            max={2.5}
            step={0.05}
            value={compress}
            onChange={(val) => {
              setCompress(val);
              setCurrentPreset("custom");
            }}
            maxDecimals={2}
            showTicks={false}
          />

          <DiscreteSlider2
            label="Accretion Turbulence (uMorph)"
            min={0.0}
            max={10.0}
            step={0.1}
            value={morph}
            onChange={(val) => {
              setMorph(val);
              setCurrentPreset("custom");
            }}
            maxDecimals={1}
            showTicks={false}
          />

          <DiscreteSlider2
            label="Radiation Luminosity"
            min={0.1}
            max={5.0}
            step={0.1}
            value={intensity}
            onChange={(val) => {
              setIntensity(val);
              setCurrentPreset("custom");
            }}
            maxDecimals={1}
            showTicks={false}
          />

          <DiscreteSlider2
            label="Orbital Speed"
            min={0.1}
            max={6.0}
            step={0.1}
            value={orbitScale}
            onChange={(val) => {
              setOrbitScale(val);
              setCurrentPreset("custom");
            }}
            maxDecimals={2}
            showTicks={false}
          />

          <DiscreteSlider2
            label="System Orbit Auto-Rotation"
            min={0.0}
            max={5.0}
            step={0.1}
            value={rotateSpeed}
            onChange={(val) => {
              setRotateSpeed(val);
              setCurrentPreset("custom");
            }}
            maxDecimals={1}
            showTicks={false}
          />

          <DiscreteSlider2
            label="Orbit Zoom Distance (Radius)"
            min={25}
            max={180}
            step={1}
            value={camDist}
            onChange={(val) => {
              setCamDist(val);
              setCurrentPreset("custom");
            }}
            maxDecimals={0}
            showTicks={false}
          />

          <DiscreteSlider2
            label="Inclination Tilt Angle (Latitude)"
            min={0.15}
            max={1.52}
            step={0.05}
            value={camPhi}
            onChange={(val) => {
              setCamPhi(val);
              setCurrentPreset("custom");
            }}
            maxDecimals={2}
            showTicks={false}
          />

          <ColorPicker
            label="System Gravity Lens Tint"
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

export default SingularityPage;
