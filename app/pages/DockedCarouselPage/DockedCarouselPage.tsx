"use client";

import React, { useState } from "react";
import { RotateCcw } from "lucide-react";
import HeaderText from "../../components/textfields/HeaderText";
import ParagraphText from "../../components/textfields/ParagraphText";
import PreviewTab from "../../components/tabsection/PreviewTab";
import InstallationTabs from "../../components/tabsection/InstallationTabs";
import { PropsTable } from "../../components/table/PropsTable";
import DockedCarousel from "@/app/meta/carousel/DockedCarousel/DockedCarousel";
import { carouselProps, componentCode, creditsData } from "./DockedCarouselData";
import { DiscreteSlider2 } from "../../components/slider/DiscreteSlider2";
import { Credits } from "../../components/buttongroup/Credits";
import DefaultComboBox from "@/app/components/combobox/DefaultComboBox";
import { ToggleComponent } from "../../components/buttongroup/ToggleComponent";
import ColorPicker from "../../components/colorpicker/ColorPicker";

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
            color: "#FFFFFF",
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
            color: "#60a5fa",
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
            color: "#f472b6",
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
            color: "#fbbf24",
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
            color: "#4ade80",
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
    const [color, setColor] = useState(defaultPreset.config.color);

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
        setColor(preset.config.color);
        if (preset.config.transitionDuration) setTransitionDuration(preset.config.transitionDuration);
    };

    const handleReset = () => applyPreset(defaultPreset.id);

    const usageCode = `<DockedCarousel
  animationType="${animationType}"
  shape="${shape}"
  color="${color}"
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
                        <div className="w-full rounded-[32px] overflow-hidden border border-white/5 bg-black shadow-2xl relative min-h-[500px] flex items-center justify-center">
                            <DockedCarousel
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
                                color={color}
                            />
                        </div>
                    }
                    usageCode={usageCode}
                    codeContent={componentCode}
                    collapsible={true}
                    header={
                        <div className="flex items-center justify-between ">
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
                    <div className="flex flex-col gap-6">
                        <DefaultComboBox
                            label="Animation Style"
                            options={[
                                { id: 'expand', label: 'Expansion' },
                                { id: 'slide', label: 'Cinematic Slide' },
                                { id: 'pop', label: 'Elastic Pop' }
                            ]}
                            value={animationType}
                            onChange={(val) => setAnimationType(val as any)}
                        />

                        <DefaultComboBox
                            label="Thumbnail Mask"
                            options={[
                                { id: 'circle', label: 'Circular' },
                                { id: 'square', label: 'Sharp Square' },
                                { id: 'rectangle', label: 'Rounded Rect' }
                            ]}
                            value={shape}
                            onChange={(val) => setShape(val as any)}
                        />

                        <DiscreteSlider2
                            label="Slide Interval"
                            min={1000}
                            max={10000}
                            step={500}
                            value={autoSlideInterval}
                            onChange={setAutoSlideInterval}
                            showTicks={true}
                        />
                    </div>

                    {/* Column 2: Toggles & Visuals */}
                    <div className="flex flex-col gap-3">
                        <ToggleComponent 
                            label="Auto-Rotation" 
                            checked={autoSlide} 
                            onChange={setAutoSlide} 
                        />
                        <ToggleComponent 
                            label="Uniform Dock" 
                            checked={equalSize} 
                            onChange={setEqualSize} 
                        />
                        <ToggleComponent 
                            label="Navigation Arrows" 
                            checked={showArrows} 
                            onChange={setShowArrows} 
                        />
                        <ToggleComponent 
                            label="Progress Timer" 
                            checked={showTimer} 
                            onChange={setShowTimer} 
                        />
                        <ColorPicker
                            label="Accent Color"
                            value={color}
                            onChange={setColor}
                        />
                    </div>

                    {/* Column 3: Physics & Timing */}
                    <div className="flex flex-col gap-6">
                        <DiscreteSlider2
                            label="Motion Stiffness"
                            min={50}
                            max={1000}
                            step={10}
                            value={stiffness}
                            onChange={setStiffness}
                            showTicks={true}
                        />
                        <DiscreteSlider2
                            label="Motion Damping"
                            min={10}
                            max={100}
                            step={1}
                            value={damping}
                            onChange={setDamping}
                            showTicks={true}
                        />
                        {animationType === 'slide' && (
                            <DiscreteSlider2
                                label="Slide Duration"
                                min={0.5}
                                max={3.0}
                                step={0.1}
                                value={transitionDuration}
                                onChange={setTransitionDuration}
                                showTicks={true}
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
