"use client";

import React, { useState } from "react";
import { RotateCcw } from "lucide-react";
import HeaderText from "../../components/textfields/HeaderText";
import ParagraphText from "../../components/textfields/ParagraphText";
import PreviewTab from "../../components/tabsection/PreviewTab";
import InstallationTabs from "../../components/tabsection/InstallationTabs";
import { PropsTable } from "../../components/table/PropsTable";
import DockedCarousal from "@/app/meta/carousal/DockedCarousal/DockedCarousal";
import { carouselProps, componentCode, creditsData } from "./DockedCarouselData";
import { DiscreteSlider } from "../../components/slider/DiscreteSlider";
import { Credits } from "../../components/buttongroup/Credits";
import DefaultComboBox from "@/app/components/combobox/DefaultComboBox";
import Toggle from "@/app/components/buttongroup/Toggle";

const presets = [
    {
        id: "interactive-expansion",
        label: "Interactive Expansion",
        config: {
            animationType: 'expand' as const,
            shape: 'circle' as const,
            stiffness: 200,
            damping: 25,
            autoSlide: true,
            equalSize: false,
            showArrows: true,
            showTimer: true,
            autoSlideInterval: 5000,
        },
    },
    {
        id: "cinematic-glide",
        label: "Cinematic Glide",
        config: {
            animationType: 'slide' as const,
            shape: 'rectangle' as const,
            transitionDuration: 1.5,
            equalSize: true,
            autoSlide: false,
            stiffness: 200,
            damping: 25,
            showArrows: true,
            showTimer: false,
            autoSlideInterval: 5000,
        },
    },
    {
        id: "pop-minimalist",
        label: "Pop Minimalist",
        config: {
            animationType: 'pop' as const,
            shape: 'circle' as const,
            stiffness: 400,
            damping: 30,
            autoSlide: true,
            autoSlideInterval: 3000,
            equalSize: false,
            showArrows: true,
            showTimer: true,
        },
    },
    {
        id: "static-grid",
        label: "Static Grid",
        config: {
            animationType: 'expand' as const,
            shape: 'square' as const,
            equalSize: true,
            showArrows: false,
            showTimer: false,
            autoSlide: false,
            stiffness: 200,
            damping: 25,
            autoSlideInterval: 5000,
        },
    },
    {
        id: "fast-tempo",
        label: "Fast Tempo",
        config: {
            animationType: 'pop' as const,
            shape: 'circle' as const,
            autoSlideInterval: 2000,
            stiffness: 500,
            damping: 20,
            autoSlide: true,
            equalSize: false,
            showArrows: true,
            showTimer: true,
        },
    },
];

export const DockedCarouselPage = () => {
    const defaultPreset = presets[0];

    const [currentPreset, setCurrentPreset] = useState(defaultPreset.id);
    const [animationType, setAnimationType] = useState(defaultPreset.config.animationType);
    const [shape, setShape] = useState(defaultPreset.config.shape);
    const [stiffness, setStiffness] = useState(defaultPreset.config.stiffness);
    const [damping, setDamping] = useState(defaultPreset.config.damping);
    const [autoSlide, setAutoSlide] = useState(defaultPreset.config.autoSlide);
    const [autoSlideInterval, setAutoSlideInterval] = useState(defaultPreset.config.autoSlideInterval);
    const [equalSize, setEqualSize] = useState(defaultPreset.config.equalSize);
    const [showArrows, setShowArrows] = useState(defaultPreset.config.showArrows);
    const [showTimer, setShowTimer] = useState(defaultPreset.config.showTimer);
    const [transitionDuration, setTransitionDuration] = useState(1.2);

    const applyPreset = (presetId: string) => {
        const preset = presets.find((p) => p.id === presetId);
        if (!preset) return;
        setCurrentPreset(presetId);
        setAnimationType(preset.config.animationType);
        setShape(preset.config.shape);
        setStiffness(preset.config.stiffness);
        setDamping(preset.config.damping);
        setAutoSlide(preset.config.autoSlide);
        setAutoSlideInterval(preset.config.autoSlideInterval);
        setEqualSize(preset.config.equalSize);
        setShowArrows(preset.config.showArrows);
        setShowTimer(preset.config.showTimer);
        if (preset.config.transitionDuration) setTransitionDuration(preset.config.transitionDuration);
    };

    const handleReset = () => applyPreset(defaultPreset.id);

    const usageCode = `<DockedCarousal
  animationType="${animationType}"
  shape="${shape}"
  autoSlide={${autoSlide}}
  autoSlideInterval={${autoSlideInterval}}
  equalSize={${equalSize}}
  showArrows={${showArrows}}
  showTimer={${showTimer}}
  stiffness={${stiffness}}
  damping={${damping}}
  transitionDuration={${transitionDuration}}
/>`;

    return (
        <div className="flex flex-col gap-5">
            <div id="docked-carousel-title">
                <HeaderText text="Docked Carousel" option={3} />
            </div>
            <ParagraphText
                text="A high-fidelity carousel featuring an interactive 'Apple Dock' thumbnail navigation. Supports multiple transition modes including a seamless expansion effect where the main image emerges directly from the clicked thumbnail."
                option={4}
            />

            <div id="preview">
                <PreviewTab
                    previewContent={
                        <div className="w-full rounded-[28px] overflow-hidden border border-white/10 bg-black shadow-2xl relative min-h-[500px] flex items-center justify-center">
                            <DockedCarousal
                                animationType={animationType}
                                shape={shape}
                                autoSlide={autoSlide}
                                autoSlideInterval={autoSlideInterval}
                                equalSize={equalSize}
                                showArrows={showArrows}
                                showTimer={showTimer}
                                stiffness={stiffness}
                                damping={damping}
                                transitionDuration={transitionDuration}
                            />
                        </div>
                    }
                    usageCode={usageCode}
                    codeContent={componentCode}
                    collapsible={true}
                    header={
                        <div className="flex items-center justify-between border-b border-rb-neutral-4/50">
                            <h3 className="text-xs ml-4 font-bold text-rb-accent-1 uppercase tracking-[0.1em]">Carousel Config</h3>
                            <DefaultComboBox
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
                    {/* Column 1: Core Configuration */}
                    <div className="space-y-6">
                        <DefaultComboBox
                            label="Animation Type"
                            options={[
                                { id: 'expand', label: 'Expand' },
                                { id: 'slide', label: 'Slide' },
                                { id: 'pop', label: 'Pop' }
                            ]}
                            value={animationType}
                            onChange={(val) => setAnimationType(val as any)}
                        />

                        <DefaultComboBox
                            label="Thumbnail Shape"
                            options={[
                                { id: 'circle', label: 'Circle' },
                                { id: 'square', label: 'Square' },
                                { id: 'rectangle', label: 'Rectangle' }
                            ]}
                            value={shape}
                            onChange={(val) => setShape(val as any)}
                        />

                        <DiscreteSlider
                            label="Auto Slide Interval (ms)"
                            min={1000}
                            max={10000}
                            step={500}
                            value={autoSlideInterval}
                            onChange={setAutoSlideInterval}
                        />
                    </div>

                    {/* Column 2: Toggles & Visuals */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 rounded-xl bg-rb-neutral-3 border border-rb-neutral-4">
                            <span className="text-sm font-medium text-rb-accent-1">Auto Slide</span>
                            <Toggle checked={autoSlide} onChange={setAutoSlide} />
                        </div>

                        <div className="flex items-center justify-between p-3 rounded-xl bg-rb-neutral-3 border border-rb-neutral-4">
                            <span className="text-sm font-medium text-rb-accent-1">Equal Sized Dock</span>
                            <Toggle checked={equalSize} onChange={setEqualSize} />
                        </div>

                        <div className="flex items-center justify-between p-3 rounded-xl bg-rb-neutral-3 border border-rb-neutral-4">
                            <span className="text-sm font-medium text-rb-accent-1">Show Arrows</span>
                            <Toggle checked={showArrows} onChange={setShowArrows} />
                        </div>

                        <div className="flex items-center justify-between p-3 rounded-xl bg-rb-neutral-3 border border-rb-neutral-4">
                            <span className="text-sm font-medium text-rb-accent-1">Show Timer</span>
                            <Toggle checked={showTimer} onChange={setShowTimer} />
                        </div>
                    </div>

                    {/* Column 3: Physics & Timing */}
                    <div className="space-y-6">
                        <DiscreteSlider
                            label="Spring Stiffness"
                            min={50}
                            max={1000}
                            step={10}
                            value={stiffness}
                            onChange={setStiffness}
                        />
                        <DiscreteSlider
                            label="Spring Damping"
                            min={10}
                            max={100}
                            step={1}
                            value={damping}
                            onChange={setDamping}
                        />
                        {animationType === 'slide' && (
                            <DiscreteSlider
                                label="Slide Duration (sec)"
                                min={0.5}
                                max={3.0}
                                step={0.1}
                                value={transitionDuration}
                                onChange={setTransitionDuration}
                            />
                        )}
                    </div>
                </PreviewTab>
            </div>

            <div id="installation-tabs">
                <InstallationTabs />
            </div>

            <div id="api-reference" className="flex flex-col gap-5">
                <HeaderText text="API Reference" option={6} />
                <PropsTable categories={carouselProps} />
            </div>

            <div id="credits" className="w-full max-w-5xl mx-auto py-10">
                <Credits data={creditsData} />
            </div>
        </div>
    );
};

export default DockedCarouselPage;
