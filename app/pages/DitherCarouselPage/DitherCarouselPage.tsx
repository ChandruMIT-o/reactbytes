"use client";

import React, { useState } from "react";
import HeaderText from "../../components/textfields/HeaderText";
import ParagraphText from "../../components/textfields/ParagraphText";
import PreviewTab from "../../components/tabsection/PreviewTab";
import InstallationTabs from "../../components/tabsection/InstallationTabs";
import { PropsTable } from "../../components/table/PropsTable";
import { Credits } from "../../components/buttongroup/Credits";
import DitherCarousel from "../../meta/carousel/DitherCarousel/DitherCarousel";
import { loaderProps, componentCode, creditsData, SLIDES } from "./DitherCarouselData";

import DiscreteSlider2 from "@/app/components/slider/DiscreteSlider2";
import ToggleComponent from "@/app/components/buttongroup/ToggleComponent";
import DefaultComboBox from "@/app/components/combobox/DefaultComboBox";
import { RotateCcw } from "lucide-react";

const resolutionOptions = [
    { id: "retro", label: "Retro (Broad Pixels)" },
    { id: "medium", label: "Medium Pixel Grain" },
    { id: "high", label: "Fine Pixel Detail" },
];

const colorModeOptions = [
    { id: "color", label: "16-Bit Quantized Color" },
    { id: "mono", label: "1-Bit High Contrast Mono" },
    { id: "cyberpunk", label: "Cyberpunk Emerald" },
    { id: "gameboy", label: "Classic Gameboy" },
    { id: "amber", label: "Amber CRT Terminal" },
    { id: "champagne", label: "Noir & Champagne Gold" },
    { id: "nordic", label: "Nordic Mist" },
    { id: "rose", label: "Rose Quartz" },
    { id: "emerald", label: "Midnight Emerald" }
];

const presets = [
    {
        id: "champagne",
        label: "Noir & Champagne Gold",
        config: {
            autoPlay: true,
            autoPlayInterval: 5000,
            ditherResolution: "medium",
            colorMode: "champagne",
            transitionDuration: 3500,
        },
    },
    {
        id: "nordic",
        label: "Nordic Ice Mist",
        config: {
            autoPlay: true,
            autoPlayInterval: 5500,
            ditherResolution: "medium",
            colorMode: "nordic",
            transitionDuration: 4000,
        },
    },
    {
        id: "cyberpunk",
        label: "Cyberpunk Hacker Console",
        config: {
            autoPlay: true,
            autoPlayInterval: 4000,
            ditherResolution: "retro",
            colorMode: "cyberpunk",
            transitionDuration: 2500,
        },
    },
    {
        id: "gameboy",
        label: "Classic retro Gameboy",
        config: {
            autoPlay: true,
            autoPlayInterval: 4500,
            ditherResolution: "retro",
            colorMode: "gameboy",
            transitionDuration: 3000,
        },
    },
    {
        id: "color-hd",
        label: "16-Bit Retro Color",
        config: {
            autoPlay: true,
            autoPlayInterval: 6000,
            ditherResolution: "high",
            colorMode: "color",
            transitionDuration: 5000,
        },
    }
];

export const DitherCarouselPage = () => {
    const [autoPlay, setAutoPlay] = useState(true);
    const [autoPlayInterval, setAutoPlayInterval] = useState(5000);
    const [ditherResolution, setDitherResolution] = useState<any>("medium");
    const [colorMode, setColorMode] = useState<any>("champagne");
    const [transitionDuration, setTransitionDuration] = useState(3500);

    const [activeIndex, setActiveIndex] = useState(0);
    const [currentPreset, setCurrentPreset] = useState("champagne");
    const [key, setKey] = useState(0);

    const applyPreset = (presetId: string) => {
        const preset = presets.find((p) => p.id === presetId);
        if (preset) {
            setCurrentPreset(presetId);
            setAutoPlay(preset.config.autoPlay);
            setAutoPlayInterval(preset.config.autoPlayInterval);
            setDitherResolution(preset.config.ditherResolution);
            setColorMode(preset.config.colorMode);
            setTransitionDuration(preset.config.transitionDuration);
            setKey((prev) => prev + 1);
        }
    };

    const handleReplay = () => {
        setKey((prev) => prev + 1);
    };

    const handleReset = () => {
        applyPreset("champagne");
    };

    const usageCode = `<DitherCarousel
  autoPlay={${autoPlay}}
  autoPlayInterval={${autoPlayInterval}}
  ditherResolution="${ditherResolution}"
  colorMode="${colorMode}"
  transitionDuration={${transitionDuration}}
/>`;

    return (
        <div className="flex flex-col gap-5">
            <div id="dither-carousel-title">
                <HeaderText text="Dither Carousel" option={3} />
            </div>
            <ParagraphText
                text="A gorgeous retro-inspired image carousel utilizing 60fps HTML5 Canvas double-buffered ordered dithering (Bayer matrix) and dynamic radial sweep transition waves."
                option={4}
            />

            <div id="preview">
                <PreviewTab
                    previewContent={
                        <div className="w-full relative overflow-hidden flex flex-col items-center justify-center p-4 md:p-8 min-h-[480px]">
                            <DitherCarousel
                                key={key}
                                autoPlay={autoPlay}
                                autoPlayInterval={autoPlayInterval}
                                ditherResolution={ditherResolution}
                                colorMode={colorMode}
                                transitionDuration={transitionDuration}
                                height="420px"
                                className="w-full max-w-4xl z-10"
                                onActiveIndexChange={setActiveIndex}
                            />
                        </div>
                    }
                    onReplay={handleReplay}
                    usageCode={usageCode}
                    codeContent={componentCode}
                    collapsible={true}
                    header={
                        <div className="flex items-center justify-between">
                            <div className="flex flex-col gap-1">
                                <h3 className="text-xs ml-4 font-bold text-rb-accent-1 uppercase">
                                    Props Controls
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
                        label="Autoplay Enabled"
                        checked={autoPlay}
                        onChange={(val) => {
                            setAutoPlay(val);
                            setKey((prev) => prev + 1);
                        }}
                    />

                    <DiscreteSlider2
                        label="Autoplay Interval (ms)"
                        min={1500}
                        max={10000}
                        step={500}
                        value={autoPlayInterval}
                        onChange={(val) => {
                            setAutoPlayInterval(val);
                            setKey((prev) => prev + 1);
                        }}
                        showTicks={false}
                    />

                    <DiscreteSlider2
                        label="Transition Duration (ms)"
                        min={2000}
                        max={6000}
                        step={250}
                        value={transitionDuration}
                        onChange={(val) => {
                            setTransitionDuration(val);
                            setKey((prev) => prev + 1);
                        }}
                        showTicks={false}
                    />

                    <DefaultComboBox
                        label="Pixel Resolution"
                        options={resolutionOptions}
                        value={ditherResolution}
                        onChange={(val) => {
                            setDitherResolution(val);
                            setKey((prev) => prev + 1);
                        }}
                        dynamicWidth={true}
                    />

                    <DefaultComboBox
                        label="Color Mode / Palette"
                        options={colorModeOptions}
                        value={colorMode}
                        onChange={(val) => {
                            setColorMode(val);
                            setKey((prev) => prev + 1);
                        }}
                        dynamicWidth={true}
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

export default DitherCarouselPage;
