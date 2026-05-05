"use client"; 
import React, { useState } from "react";
import { RotateCcw } from "lucide-react";
import HeaderText from "../../components/textfields/HeaderText";
import ParagraphText from "../../components/textfields/ParagraphText";
import PreviewTab from "../../components/tabsection/PreviewTab";
import InstallationTabs from "../../components/tabsection/InstallationTabs";
import { PropsTable } from "../../components/table/PropsTable";
import { BrutalZCarousel } from "@/app/meta/carousel/VoidCarousel/VoidCarousel";
import { VoidCarouselProps, componentCode, creditsData, PRESETS, DEFAULT_ITEMS } from "./VoidCarouselData";
import { DiscreteSlider2 } from "../../components/slider/DiscreteSlider2";
import { Credits } from "../../components/buttongroup/Credits";
import DefaultComboBox from "@/app/components/combobox/DefaultComboBox";
import ToggleComponent from "@/app/components/buttongroup/ToggleComponent";

export const VoidCarouselPage = () => {
    const [currentPreset, setCurrentPreset] = useState(PRESETS[0].id);
    const [zGap, setZGap] = useState(PRESETS[0].config.zGap);
    const [speedFactor, setSpeedFactor] = useState(PRESETS[0].config.speedFactor);
    const [lerpFactor, setLerpFactor] = useState(PRESETS[0].config.lerpFactor);
    const [warpFactor, setWarpFactor] = useState(PRESETS[0].config.warpFactor);
    const [basePerspective, setBasePerspective] = useState(PRESETS[0].config.basePerspective);
    const [enableSnap, setEnableSnap] = useState(PRESETS[0].config.enableSnap);
    const [activeZ, setActiveZ] = useState(0);
    const [opacityFade, setOpacityFade] = useState(400);

    const applyPreset = (presetId: string) => {
        const preset = PRESETS.find((p: any) => p.id === presetId) || PRESETS[0];
        setCurrentPreset(presetId);
        setZGap(preset.config.zGap);
        setSpeedFactor(preset.config.speedFactor);
        setLerpFactor(preset.config.lerpFactor);
        setWarpFactor(preset.config.warpFactor);
        setBasePerspective(preset.config.basePerspective);
        setEnableSnap(preset.config.enableSnap);
        setActiveZ(0); // Reset to default for presets
        setOpacityFade(400); // Reset to default for presets
    };

    const reset = () => {
        applyPreset(PRESETS[0].id);
    };

    return (
        <div className="flex flex-col gap-5">
            <div id="void-carousel-title">
                <HeaderText text="Void Carousel" option={3} />
            </div>
            <ParagraphText text="A 3D perspective tunnel carousel with a chaotic brutalist feel. Features dynamic perspective warping, infinite looping, and smooth momentum-based navigation." option={4} />

            <div id="preview">
                <PreviewTab
                    previewContent={
                        <div className="h-[500px] w-full rounded-[18px] border border-rb-neutral-4/50 overflow-hidden relative isolate bg-black flex flex-col">
                            <div className="relative flex-1 overflow-hidden w-full h-full">
                                <BrutalZCarousel
                                    items={DEFAULT_ITEMS}
                                    zGap={zGap}
                                    speedFactor={speedFactor}
                                    lerpFactor={lerpFactor}
                                    warpFactor={warpFactor}
                                    basePerspective={basePerspective}
                                    enableSnap={enableSnap}
                                    activeZ={activeZ}
                                    opacityFade={opacityFade}
                                    enableNoise={false}
                                />
                            </div>
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
                    <DiscreteSlider2
                        label="Z Gap"
                        min={200}
                        max={1500}
                        step={50}
                        value={zGap}
                        onChange={setZGap}
                        showTicks={true}
                    />

                    <DiscreteSlider2
                        label="Speed Factor"
                        min={0.5}
                        max={10.0}
                        step={0.5}
                        value={speedFactor}
                        onChange={setSpeedFactor}
                        showTicks={true}
                    />

                    <DiscreteSlider2
                        label="Warp Factor"
                        min={0}
                        max={5}
                        step={0.5}
                        value={warpFactor}
                        onChange={setWarpFactor}
                        showTicks={true}
                    />

                    <DiscreteSlider2
                        label="Base Perspective"
                        min={300}
                        max={1500}
                        step={100}
                        value={basePerspective}
                        onChange={setBasePerspective}
                        showTicks={true}
                    />

                    <DiscreteSlider2
                        label="Momentum (Lerp)"
                        min={0.01}
                        max={0.3}
                        step={0.01}
                        value={lerpFactor}
                        onChange={setLerpFactor}
                        showTicks={true}
                    />

                    <DiscreteSlider2
                        label="Active Focus Z"
                        min={-500}
                        max={500}
                        step={10}
                        value={activeZ}
                        onChange={setActiveZ}
                        showTicks={true}
                    />

                    <DiscreteSlider2
                        label="Opacity Fade Range"
                        min={100}
                        max={1000}
                        step={50}
                        value={opacityFade}
                        onChange={setOpacityFade}
                        showTicks={true}
                    />

                    <ToggleComponent
                        label="Enable Magnetic Snap"
                        checked={enableSnap}
                        onChange={setEnableSnap}
                    />
                </PreviewTab>
            </div>

            <div id="installation-tabs">
                <InstallationTabs />
            </div>

            <div id="api-reference" className="flex flex-col gap-5 mt-4">
                <HeaderText text="API Reference" option={6} />
                <PropsTable categories={[{ title: "BrutalZCarousel Props", props: VoidCarouselProps }]} />
            </div>

            <div id="credits" className="w-full py-10">
                <Credits data={creditsData} />
            </div>
        </div>
    );
};

