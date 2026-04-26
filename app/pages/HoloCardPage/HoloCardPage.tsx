"use client";
import React, { useState } from "react";
import { RotateCcw } from "lucide-react";
import HeaderText from "../../components/textfields/HeaderText";
import ParagraphText from "../../components/textfields/ParagraphText";
import PreviewTab from "../../components/tabsection/PreviewTab";
import InstallationTabs from "../../components/tabsection/InstallationTabs";
import { PropsTable } from "../../components/table/PropsTable";
import HoloCard from "@/app/meta/card/HoloCard/HoloCard";
import { HoloCardProps, componentCode, creditsData } from "./HoloCardData";
import { Credits } from "../../components/buttongroup/Credits";
import ToggleComponent from "@/app/components/buttongroup/ToggleComponent";
import DefaultTextInput from "@/app/components/textinput/DefaultTextInput";
import { PRESETS } from "./HoloCardData";
import DefaultComboBox from "@/app/components/combobox/DefaultComboBox";
import { DiscreteSlider2 } from "../../components/slider/DiscreteSlider2";

export default function HoloCardPage() {
  const [currentPreset, setCurrentPreset] = useState(PRESETS[0].id);
  const [image, setImage] = useState(PRESETS[0].config.image);
  const [showContent, setShowContent] = useState(PRESETS[0].config.showContent);
  const [tiltSpread, setTiltSpread] = useState(PRESETS[0].config.tiltSpread);
  const [hoverScale, setHoverScale] = useState(PRESETS[0].config.hoverScale);
  const [holoEffect, setHoloEffect] = useState(PRESETS[0].config.holoEffect);
  const [holoIntensity, setHoloIntensity] = useState(PRESETS[0].config.holoIntensity);
  const [colorShift, setColorShift] = useState(PRESETS[0].config.colorShift);
  const [holoRotation, setHoloRotation] = useState(PRESETS[0].config.holoRotation);

  const applyPreset = (presetId: string) => {
    const preset = PRESETS.find(p => p.id === presetId) || PRESETS[0];
    setCurrentPreset(presetId);
    setImage(preset.config.image);
    setShowContent(preset.config.showContent);
    setTiltSpread(preset.config.tiltSpread);
    setHoverScale(preset.config.hoverScale);
    setHoloEffect(preset.config.holoEffect);
    setHoloIntensity(preset.config.holoIntensity);
    setColorShift(preset.config.colorShift);
    setHoloRotation(preset.config.holoRotation);
  };

  const reset = () => {
    applyPreset(PRESETS[0].id);
  };

  return (
    <div className="flex flex-col gap-5">
      <div id="holo-card-title">
        <HeaderText text="HoloCard" option={3} />
      </div>
      <ParagraphText text="A premium holographic card component with 3D tilt effects and dynamic light reflection. Perfect for high-end dashboards, payment interfaces, or collectibles." option={4} />

      <div id="preview">
        <PreviewTab
          previewContent={
            <div className="w-full flex items-center justify-center bg-rb-neutral-2/30 rounded-[18px] p-12 min-h-[500px]">
              <HoloCard
                image={image}
                showContent={showContent}
                tiltSpread={tiltSpread}
                hoverScale={hoverScale}
                holoEffect={holoEffect}
                holoIntensity={holoIntensity}
                colorShift={colorShift}
                holoRotation={holoRotation}
              />
            </div>
          }
          codeContent={componentCode}
          header={
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-xs ml-4 font-bold text-rb-accent-1 uppercase tracking-[0.1em]">
                Presets
              </h3>
              <DefaultComboBox
                options={PRESETS}
                value={currentPreset}
                onChange={applyPreset}
                dynamicWidth={true}
              />
              <div className="flex items-center gap-3">
                <button
                  onClick={reset}
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
          <DefaultTextInput
            label="Background Image URL"
            value={image}
            onChange={(val) => setImage(val)}
          />

          <DefaultComboBox
            label="Holo Effect Pattern"
            options={[
              { id: 'linear', label: 'Linear Rainbow' },
              { id: 'radial', label: 'Radial Rainbow' },
              { id: 'hexagonal', label: 'Hexagonal Grid' },
            ]}
            value={holoEffect}
            onChange={(val) => setHoloEffect(val as any)}
          />

          <ToggleComponent
            label="Show Card Content"
            checked={showContent}
            onChange={(val) => setShowContent(val)}
          />

          <DiscreteSlider2
            label="Holo Intensity"
            min={0}
            max={2.5}
            step={0.1}
            value={holoIntensity}
            onChange={setHoloIntensity}
            showTicks={false}
          />

          <DiscreteSlider2
            label="Color Shift (Hue)"
            min={0}
            max={360}
            step={1}
            value={colorShift}
            onChange={setColorShift}
            showTicks={false}
          />

          <DiscreteSlider2
            label="Holo Rotation (Degrees)"
            min={0}
            max={360}
            step={1}
            value={holoRotation}
            onChange={setHoloRotation}
            showTicks={false}
          />

          <DiscreteSlider2
            label="Tilt Spread"
            min={0}
            max={40}
            step={1}
            value={tiltSpread}
            onChange={setTiltSpread}
            showTicks={false}
          />

          <DiscreteSlider2
            label="Hover Scale"
            min={1.0}
            max={1.2}
            step={0.01}
            value={hoverScale}
            onChange={setHoverScale}
            showTicks={false}
          />
        </PreviewTab>
      </div>

      <div id="installation-tabs">
        <InstallationTabs />
      </div>

      <div id="api-reference" className="flex flex-col gap-5 mt-4">
        <HeaderText text="API Reference" option={6} />
        <PropsTable categories={[{ title: "Card Props", props: HoloCardProps }]} />
      </div>

      <div id="credits" className="w-full py-10">
        <Credits data={creditsData} />
      </div>
    </div>
  );
}

