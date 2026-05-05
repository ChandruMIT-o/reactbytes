"use client";

import React, { useState } from "react";
import { RotateCcw } from "lucide-react";
import HeaderText from "../../components/textfields/HeaderText";
import ParagraphText from "../../components/textfields/ParagraphText";
import PreviewTab from "../../components/tabsection/PreviewTab";
import InstallationTabs from "../../components/tabsection/InstallationTabs";
import { PropsTable } from "../../components/table/PropsTable";
import SplitCarousel from "@/app/meta/carousel/SplitCarousel/SplitCarousel";
import { splitCarouselProps, componentCode, creditsData } from "./SplitCarouselData";
import { DiscreteSlider2 } from "../../components/slider/DiscreteSlider2";
import { Credits } from "../../components/buttongroup/Credits";
import DefaultComboBox from "@/app/components/combobox/DefaultComboBox";
import ColorPicker from "../../components/colorpicker/ColorPicker";

const presets = [
    {
        id: "standard",
        label: "Standard",
        config: { sensitivity: 0.5, backgroundColor: "#000000", borderRadius: 1.5 }
    },
    {
        id: "fast",
        label: "High Speed",
        config: { sensitivity: 1.5, backgroundColor: "#050505", borderRadius: 0 }
    },
    {
        id: "precise",
        label: "Precise",
        config: { sensitivity: 0.2, backgroundColor: "#111111", borderRadius: 3 }
    },
    {
        id: "vibrant",
        label: "Vibrant",
        config: { sensitivity: 0.8, backgroundColor: "#1a0b2e", borderRadius: 2 }
    },
    {
        id: "minimal",
        label: "Minimal",
        config: { sensitivity: 0.6, backgroundColor: "#000000", borderRadius: 0.5 }
    }
];

export const SplitCarouselPage: React.FC = () => {
    const defaultPreset = presets[0];

    // State for controls
    const [currentPreset, setCurrentPreset] = useState(defaultPreset.id);
    const [sensitivity, setSensitivity] = useState(defaultPreset.config.sensitivity);
    const [backgroundColor, setBackgroundColor] = useState(defaultPreset.config.backgroundColor);
    const [borderRadius, setBorderRadius] = useState(defaultPreset.config.borderRadius);

    const applyPreset = (presetId: string) => {
        const preset = presets.find((p) => p.id === presetId);
        if (!preset) return;
        setCurrentPreset(presetId);
        setSensitivity(preset.config.sensitivity);
        setBackgroundColor(preset.config.backgroundColor);
        setBorderRadius(preset.config.borderRadius);
    };

    const handleReset = () => {
        applyPreset(defaultPreset.id);
    };

    const usageCode = `<SplitCarousel
  sensitivity={${sensitivity}}
  backgroundColor="${backgroundColor}"
  borderRadius="${borderRadius}rem"
/>`;

    return (
        <div className="flex flex-col gap-5">
            <div id="split-carousel-hero">
                <HeaderText text="Split Carousel" option={3} />
            </div>
            <ParagraphText
                text="A premium image carousel that reacts to mouse wheel events. Perfect for high-impact visual storytelling and collection showcases. Now works independently of page scroll context."
                option={4}
            />

            <div id="preview">
                <PreviewTab
                    usageCode={usageCode}
                    codeContent={componentCode}
                    collapsible={true}
                    header={
                        <div className="flex items-center justify-between">
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
                    previewContent={
                        <div className="w-full overflow-hidden h-[500px] border border-white/5 bg-black shadow-2xl relative flex items-center justify-center">
                            <SplitCarousel
                                sensitivity={sensitivity}
                                backgroundColor={backgroundColor}
                                borderRadius={`${borderRadius}rem`}
                                className="rounded-2xl"
                            />
                        </div>
                    }
                >
                    {/* Column 1: Core Configuration */}
                    <div className="flex flex-col gap-6">
                        <DiscreteSlider2
                            label="Scroll Sensitivity"
                            min={0.1}
                            max={3}
                            step={0.1}
                            value={sensitivity}
                            onChange={setSensitivity}
                            showTicks={true}
                        />
                    </div>

                    {/* Column 2: Visual Style */}
                    <div className="flex flex-col gap-6">
                        <ColorPicker
                            label="Background Color"
                            value={backgroundColor}
                            onChange={setBackgroundColor}
                        />
                        <DiscreteSlider2
                            label="Border Radius (rem)"
                            min={0}
                            max={5}
                            step={0.1}
                            value={borderRadius}
                            onChange={setBorderRadius}
                            showTicks={true}
                        />
                    </div>

                    {/* Column 3: Status Info */}
                    <div className="flex flex-col gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                        <h4 className="text-[10px] uppercase tracking-wider font-bold text-white/40">Component Info</h4>
                        <p className="text-xs text-white/60 leading-relaxed">
                            This component uses a native <code className="text-rb-accent-3">Wheel Event</code> system.
                            The animation is driven by mouse-over scrolling, making it height-agnostic and easier to embed anywhere.
                        </p>
                    </div>
                </PreviewTab>
            </div>

            <div id="installation-tabs">
                <InstallationTabs />
            </div>

            <div id="api-reference" className="flex flex-col gap-5">
                <HeaderText text="API Reference" option={6} />
                <PropsTable categories={[{ title: "SplitCarousel Props", props: splitCarouselProps }]} />
            </div>

            <div id="credits" className="w-full max-w-5xl mx-auto py-10">
                <Credits data={creditsData} />
            </div>
        </div>
    );
};

export default SplitCarouselPage;
