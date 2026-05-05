"use client";

import React, { useState } from "react";
import { RotateCcw } from "lucide-react";
import HeaderText from "../../components/textfields/HeaderText";
import ParagraphText from "../../components/textfields/ParagraphText";
import PreviewTab from "../../components/tabsection/PreviewTab";
import InstallationTabs from "../../components/tabsection/InstallationTabs";
import { PropsTable } from "../../components/table/PropsTable";
import CardStackApp from "../../meta/carousel/StackedCardCarousel/StackedCardCarousel";
import { StackedCardCarouselProps, componentCode, creditsData } from "./StackedCardCarouselData";
import { DiscreteSlider2 } from "../../components/slider/DiscreteSlider2";
import { Credits } from "../../components/buttongroup/Credits";
import DefaultComboBox from "@/app/components/combobox/DefaultComboBox";
import ToggleComponent from "@/app/components/buttongroup/ToggleComponent";

export default function StackedCardCarouselPage() {
    // --- State Management ---
    const [cardWidth, setCardWidth] = useState(320);
    const [cardHeight, setCardHeight] = useState(440);
    const [activePreset, setActivePreset] = useState("classic");

    // --- Presets ---
    const presets = [
        { id: "classic", label: "Classic" },
        { id: "compact", label: "Compact" },
        { id: "tall", label: "Tall & Elegant" },
        { id: "wide", label: "Large Display" },
        { id: "dramatic", label: "Dramatic Scale" },
    ];

    const applyPreset = (presetId: string) => {
        setActivePreset(presetId);
        switch (presetId) {
            case "classic":
                setCardWidth(320);
                setCardHeight(440);
                break;
            case "compact":
                setCardWidth(280);
                setCardHeight(380);
                break;
            case "tall":
                setCardWidth(300);
                setCardHeight(500);
                break;
            case "wide":
                setCardWidth(400);
                setCardHeight(400);
                break;
            case "dramatic":
                setCardWidth(450);
                setCardHeight(600);
                break;
        }
    };

    const resetToDefault = () => {
        applyPreset("classic");
    };

    return (
        <div className="flex flex-col gap-12 w-full max-w-7xl mx-auto pb-24">
            {/* Header Section */}
            <div className="flex flex-col gap-4 mt-8">
                <HeaderText text="Stacked Card Carousel" option={3} />
                <ParagraphText text="A high-performance 3D scroll-driven carousel. It maps horizontal scroll progression to precise 3D transformations, including rotation, depth, and glass-morphism shine effects. Completely cross-browser compatible using pure Framer Motion math." option={4} />
            </div>

            {/* Interactive Preview Section */}
            <div id="stacked-card-carousel-title">
                <PreviewTab
                    previewContent={
                        <div className="w-full flex items-center justify-center bg-zinc-950 rounded-3xl overflow-hidden border border-white/5 h-[700px] relative">
                            <CardStackApp
                                cardWidth={cardWidth}
                                cardHeight={cardHeight}
                            />
                        </div>
                    }
                    codeContent={componentCode}
                    collapsible={true}
                    header={
                        <div className="flex items-center justify-between w-full">
                            <div className="flex flex-col gap-1">
                                <h3 className="text-xs ml-4 font-bold text-rb-accent-1 uppercase">Controls</h3>
                            </div>
                            <DefaultComboBox
                                label="Presets"
                                options={presets}
                                value={activePreset}
                                onChange={(val) => applyPreset(val)}
                                dynamicWidth={true}
                            />
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={resetToDefault}
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
                    {/* Controls */}
                    <DiscreteSlider2
                        label="Card Width"
                        min={200}
                        max={600}
                        step={10}
                        value={cardWidth}
                        onChange={setCardWidth}
                        showTicks={true}
                    />

                    <DiscreteSlider2
                        label="Card Height"
                        min={300}
                        max={800}
                        step={10}
                        value={cardHeight}
                        onChange={setCardHeight}
                        showTicks={true}
                    />
                </PreviewTab>
            </div>

            {/* Installation Section */}
            <div id="installation-tabs">
                <InstallationTabs />
            </div>

            {/* API Reference Section */}
            <div id="api-reference">
                <PropsTable categories={[{ title: "StackedCardCarousel Props", props: StackedCardCarouselProps }]} />
            </div>

            {/* Credits Section */}
            <div id="credits">
                <Credits data={creditsData} />
            </div>
        </div>
    );
}
