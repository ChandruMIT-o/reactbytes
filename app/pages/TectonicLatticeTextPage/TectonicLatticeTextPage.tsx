"use client";

import React, { useState } from "react";
import HeaderText from "../../components/textfields/HeaderText";
import ParagraphText from "../../components/textfields/ParagraphText";
import PreviewTab from "../../components/tabsection/PreviewTab";
import InstallationTabs from "../../components/tabsection/InstallationTabs";
import { PropsTable } from "../../components/table/PropsTable";
import { TectonicLatticeText } from "../../meta/text/TectonicLatticeText/TectonicLatticeText";
import { loaderProps, componentCode, creditsData } from "./TectonicLatticeTextData";
import DefaultTextInput from "@/app/components/textinput/DefaultTextInput";
import ColorPicker from "@/app/components/colorpicker/ColorPicker";
import DiscreteSlider2 from "@/app/components/slider/DiscreteSlider2";
import DefaultComboBox from "@/app/components/combobox/DefaultComboBox";
import { Credits } from "../../components/buttongroup/Credits";
import { RotateCcw } from "lucide-react";

const presets = [
  {
    id: "matrix",
    label: "Ametrine (Default)",
    config: {
      text: "STRUCT",
      railMode: "diagonal",
      blockSize: 8,
      blockPadding: 1.5,
      influenceRadius: 100,
      pushStrength: 9.0,
      blockMass: 1.0,
      snapStiffness: 0.08,
      friction: 0.82,
      maxOffset: 160,
      skewIntensity: 0.15,
      baseColor: "#ffffff",
      wireframeColor: "rgba(168, 85, 247, 0.45)",
      stressedBlockColor: "#c084fc",
      bgColor: "#070709",
    },
  },
  {
    id: "cyber",
    label: "Cyberpunk",
    config: {
      text: "FRACTURE",
      railMode: "diagonal",
      blockSize: 8,
      blockPadding: 1.5,
      influenceRadius: 100,
      pushStrength: 9.0,
      blockMass: 1.0,
      snapStiffness: 0.08,
      friction: 0.82,
      maxOffset: 160,
      skewIntensity: 0.15,
      baseColor: "#00f5ff",
      wireframeColor: "rgba(255, 0, 110, 0.35)",
      stressedBlockColor: "#ff006e",
      bgColor: "#050508",
    },
  },
  {
    id: "mono",
    label: "Industrial",
    config: {
      text: "MATRIX",
      railMode: "orthogonal",
      blockSize: 8,
      blockPadding: 1.5,
      influenceRadius: 100,
      pushStrength: 9.0,
      blockMass: 1.0,
      snapStiffness: 0.08,
      friction: 0.82,
      maxOffset: 160,
      skewIntensity: 0.15,
      baseColor: "#f3f4f6",
      wireframeColor: "rgba(156, 163, 175, 0.4)",
      stressedBlockColor: "#374151",
      bgColor: "#111827",
    },
  },
];

const railModeOptions = [
  { id: "diagonal", label: "Diagonal" },
  { id: "orthogonal", label: "Orthogonal" },
  { id: "axial-x", label: "Axial X" },
  { id: "axial-y", label: "Axial Y" },
  { id: "shattered", label: "Shattered" },
];

export const TectonicLatticeTextPage = () => {
  const [text, setText] = useState(presets[0].config.text);
  const [railMode, setRailMode] = useState<any>(presets[0].config.railMode);
  const [blockSize, setBlockSize] = useState(presets[0].config.blockSize);
  const [blockPadding, setBlockPadding] = useState(presets[0].config.blockPadding);
  const [influenceRadius, setInfluenceRadius] = useState(presets[0].config.influenceRadius);
  const [pushStrength, setPushStrength] = useState(presets[0].config.pushStrength);
  const [blockMass, setBlockMass] = useState(presets[0].config.blockMass);
  const [snapStiffness, setSnapStiffness] = useState(presets[0].config.snapStiffness);
  const [friction, setFriction] = useState(presets[0].config.friction);
  const [maxOffset, setMaxOffset] = useState(presets[0].config.maxOffset);
  const [skewIntensity, setSkewIntensity] = useState(presets[0].config.skewIntensity);

  // Themes / Colors
  const [baseColor, setBaseColor] = useState(presets[0].config.baseColor);
  const [wireframeColor, setWireframeColor] = useState(presets[0].config.wireframeColor);
  const [stressedBlockColor, setStressedBlockColor] = useState(presets[0].config.stressedBlockColor);
  const [bgColor, setBgColor] = useState(presets[0].config.bgColor);

  const [currentPreset, setCurrentPreset] = useState("matrix");
  const [key, setKey] = useState(0);

  const applyPreset = (presetId: string) => {
    const preset = presets.find((p) => p.id === presetId);
    if (preset) {
      setCurrentPreset(presetId);
      setText(preset.config.text);
      setRailMode(preset.config.railMode as any);
      setBlockSize(preset.config.blockSize);
      setBlockPadding(preset.config.blockPadding);
      setInfluenceRadius(preset.config.influenceRadius);
      setPushStrength(preset.config.pushStrength);
      setBlockMass(preset.config.blockMass);
      setSnapStiffness(preset.config.snapStiffness);
      setFriction(preset.config.friction);
      setMaxOffset(preset.config.maxOffset);
      setSkewIntensity(preset.config.skewIntensity);
      setBaseColor(preset.config.baseColor);
      setWireframeColor(preset.config.wireframeColor);
      setStressedBlockColor(preset.config.stressedBlockColor);
      setBgColor(preset.config.bgColor);
      setKey((prev) => prev + 1);
    }
  };

  const handleReplay = () => {
    setKey((prev) => prev + 1);
  };

  const handleReset = () => {
    applyPreset("matrix");
  };

  const usageCode = `<TectonicLatticeText
  text="${text}"
  railMode="${railMode}"
  blockSize={${blockSize}}
  blockPadding={${blockPadding}}
  influenceRadius={${influenceRadius}}
  pushStrength={${pushStrength}}
  blockMass={${blockMass}}
  snapStiffness={${snapStiffness}}
  friction={${friction}}
  maxOffset={${maxOffset}}
  skewIntensity={${skewIntensity}}
  baseColor="${baseColor}"
  wireframeColor="${wireframeColor}"
  stressedBlockColor="${stressedBlockColor}"
  bgColor="${bgColor}"
/>`;

  return (
    <div className="flex flex-col gap-5">
      <div id="tectonic-lattice-title">
        <HeaderText text="Tectonic Lattice" option={3} />
        <ParagraphText
          text="An interactive physics-based text rasterization effect where individual letter blocks are connected by elastic lattice wireframes. Hovering pulls and shears blocks along custom rail quantization modes, snapping back elastically."
          option={4}
        />
      </div>

      <div id="preview">
        <PreviewTab
          previewContent={
            <div className="w-full h-[400px] relative overflow-hidden">
              <TectonicLatticeText
                key={key}
                text={text}
                railMode={railMode}
                blockSize={blockSize}
                blockPadding={blockPadding}
                influenceRadius={influenceRadius}
                pushStrength={pushStrength}
                blockMass={blockMass}
                snapStiffness={snapStiffness}
                friction={friction}
                maxOffset={maxOffset}
                skewIntensity={skewIntensity}
                baseColor={baseColor}
                wireframeColor={wireframeColor}
                stressedBlockColor={stressedBlockColor}
                bgColor={bgColor}
              />
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
                  Props Matrix
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
          <DefaultTextInput
            label="Glyphs Text"
            value={text}
            onChange={(val) => {
              setText(val.toUpperCase().slice(0, 12));
              setKey((prev) => prev + 1);
            }}
            placeholder="Enter word..."
          />

          <DefaultComboBox
            label="Rail Mode"
            options={railModeOptions}
            value={railMode}
            onChange={(val) => {
              setRailMode(val);
              setKey((prev) => prev + 1);
            }}
            dynamicWidth={true}
          />

          <DiscreteSlider2
            label="Block Size"
            min={4}
            max={16}
            step={1}
            value={blockSize}
            onChange={setBlockSize}
            maxDecimals={0}
            showTicks={false}
          />

          <DiscreteSlider2
            label="Block Padding"
            min={0}
            max={5}
            step={0.5}
            value={blockPadding}
            onChange={setBlockPadding}
            maxDecimals={1}
            showTicks={false}
          />

          <DiscreteSlider2
            label="Influence Radius"
            min={40}
            max={200}
            step={5}
            value={influenceRadius}
            onChange={setInfluenceRadius}
            maxDecimals={0}
            showTicks={false}
          />

          <DiscreteSlider2
            label="Push Strength"
            min={2}
            max={20}
            step={0.5}
            value={pushStrength}
            onChange={setPushStrength}
            maxDecimals={1}
            showTicks={false}
          />

          <DiscreteSlider2
            label="Block Mass"
            min={0.2}
            max={4.0}
            step={0.1}
            value={blockMass}
            onChange={setBlockMass}
            maxDecimals={1}
            showTicks={false}
          />

          <DiscreteSlider2
            label="Snap Stiffness"
            min={0.01}
            max={0.30}
            step={0.01}
            value={snapStiffness}
            onChange={setSnapStiffness}
            maxDecimals={2}
            showTicks={false}
          />

          <DiscreteSlider2
            label="Friction"
            min={0.5}
            max={0.99}
            step={0.01}
            value={friction}
            onChange={setFriction}
            maxDecimals={2}
            showTicks={false}
          />

          <DiscreteSlider2
            label="Max Offset"
            min={40}
            max={300}
            step={10}
            value={maxOffset}
            onChange={setMaxOffset}
            maxDecimals={0}
            showTicks={false}
          />

          <DiscreteSlider2
            label="Skew Intensity"
            min={0.0}
            max={1.0}
            step={0.05}
            value={skewIntensity}
            onChange={setSkewIntensity}
            maxDecimals={2}
            showTicks={false}
          />

          <ColorPicker
            label="Base Color"
            value={baseColor}
            onChange={setBaseColor}
          />

          <ColorPicker
            label="Stressed Color"
            value={stressedBlockColor}
            onChange={setStressedBlockColor}
          />

          <ColorPicker
            label="Wireframe Color"
            value={wireframeColor}
            onChange={setWireframeColor}
          />

          <ColorPicker
            label="Background"
            value={bgColor}
            onChange={setBgColor}
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

export default TectonicLatticeTextPage;
