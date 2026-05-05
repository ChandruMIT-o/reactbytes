"use client";

import React, { useState, useRef, useEffect } from 'react';
import HeaderText from "../../components/textfields/HeaderText";
import ParagraphText from "../../components/textfields/ParagraphText";
import PreviewTab from "../../components/tabsection/PreviewTab";
import InstallationTabs from "../../components/tabsection/InstallationTabs";
import { PropsTable } from "../../components/table/PropsTable";
import { Credits } from "../../components/buttongroup/Credits";
import StackedCards from "../../meta/card/StackedCards/StackedCards";
import { loaderProps, creditsData, componentCode, defaultCards } from "./StackedCardsData";
import { DiscreteSlider2 } from "../../components/slider/DiscreteSlider2";
import ColorPicker from "../../components/colorpicker/ColorPicker";
import DefaultComboBox from "../../components/combobox/DefaultComboBox";
import { RotateCcw } from "lucide-react";

const presets = [
    {
        id: "standard",
        label: "Standard Sequence",
        config: {
            textColor: '#F2EEE9',
            accentColor: '#C0DEDD',
            stickyTop: 10,
            cardHeight: 60,
            rotation: 3,
            scale: 0.9,
            yOffset: -3,
            borderRadius: 40
        }
    },
    {
        id: "minimal",
        label: "Minimal Stack",
        config: {
            textColor: '#1A1A1A',
            accentColor: '#000000',
            stickyTop: 5,
            cardHeight: 80,
            rotation: 0,
            scale: 0.95,
            yOffset: 0,
            borderRadius: 12
        }
    },
    {
        id: "brutalist",
        label: "Brutalist Drift",
        config: {
            textColor: '#FFFFFF',
            accentColor: '#FF3E00',
            stickyTop: 15,
            cardHeight: 50,
            rotation: 8,
            scale: 0.8,
            yOffset: -8,
            borderRadius: 0
        }
    }
];

export default function StackedCardsPage() {
    // --- State Management ---
    const [textColor, setTextColor] = useState(presets[0].config.textColor);
    const [accentColor, setAccentColor] = useState(presets[0].config.accentColor);
    const [stickyTop, setStickyTop] = useState(presets[0].config.stickyTop);
    const [cardHeight, setCardHeight] = useState(presets[0].config.cardHeight);
    const [rotation, setRotation] = useState(presets[0].config.rotation);
    const [scale, setScale] = useState(presets[0].config.scale);
    const [yOffset, setYOffset] = useState(presets[0].config.yOffset);
    const [borderRadius, setBorderRadius] = useState(presets[0].config.borderRadius);

    const [currentPreset, setCurrentPreset] = useState("standard");
    const [key, setKey] = useState(0);
    const [scrollerEl, setScrollerEl] = useState<HTMLElement | null>(null);
    const previewContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (previewContainerRef.current) {
            setScrollerEl(previewContainerRef.current);
        }
    }, []);

    const applyPreset = (presetId: string) => {
        const preset = presets.find(p => p.id === presetId);
        if (preset) {
            setCurrentPreset(presetId);
            setTextColor(preset.config.textColor);
            setAccentColor(preset.config.accentColor);
            setStickyTop(preset.config.stickyTop);
            setCardHeight(preset.config.cardHeight);
            setRotation(preset.config.rotation);
            setScale(preset.config.scale);
            setYOffset(preset.config.yOffset);
            setBorderRadius(preset.config.borderRadius);
            setKey(prev => prev + 1);
        }
    };

    const handleReset = () => applyPreset("standard");

    const usageCode = `<StackedCards 
    items={cards}
    textColor="${textColor}"
    accentColor="${accentColor}"
    stickyTop="${stickyTop}vh"
    cardHeight="${cardHeight}vh"
    rotationStrength={${rotation}}
    scaleStrength={${scale}}
    yOffset="${yOffset}vh"
    borderRadius="${borderRadius}px"
/>`;

    return (
        <div className="flex flex-col gap-10">
            {/* Header Section */}
            <div id="stacked-cards-title">
                <HeaderText text="Stacked Cards" option={3} />
            </div>
            <ParagraphText
                text="A cinematic, GSAP-powered card stacking component that translates vertical scroll momentum into perfectly eased 3D transforms. Built for immersive storytelling and high-impact presentation."
                option={4}
            />

            {/* Interactive Preview Section */}
            <div id="preview">
                <PreviewTab
                    previewContent={
                        <div
                            id="stacked-cards-preview-container"
                            ref={previewContainerRef}
                            className="w-full bg-zinc-950 rounded-3xl overflow-hidden border border-white/5 h-[500px] relative overflow-y-auto custom-scrollbar"
                        >
                            {/* Permanent Preview Hero */}
                            <div className="pt-20 pb-10 flex flex-col items-center justify-center w-full text-white/50">
                                <h1 className="text-[clamp(2rem,5vw,4rem)] font-bold tracking-tighter uppercase opacity-50">
                                    Scroll Below
                                </h1>
                                <div className="mt-8 w-px h-24 bg-gradient-to-b from-current to-transparent opacity-20" />
                            </div>

                            {scrollerEl && (
                                <div className="px-6 md:px-6 lg:px-10">
                                    <StackedCards
                                        key={key}
                                        items={defaultCards}
                                        textColor={textColor}
                                        accentColor={accentColor}
                                        stickyTop={`${stickyTop}vh`}
                                        cardHeight={`${cardHeight}vh`}
                                        rotationStrength={rotation}
                                        scaleStrength={scale}
                                        yOffset={`${yOffset}vh`}
                                        borderRadius={`${borderRadius}px`}
                                        scroller={scrollerEl}
                                    />
                                </div>
                            )}

                            {/* Permanent Preview Footer */}
                            <div className="pt-10 pb-20 flex flex-col items-center text-white/50">
                                <div className="mb-8 w-px h-24 bg-gradient-to-t from-current to-transparent opacity-20" />
                                <h1 className="text-[clamp(1.5rem,4vw,3rem)] font-bold uppercase tracking-widest opacity-50">
                                    End of the sequence.
                                </h1>
                            </div>
                        </div>
                    }
                    usageCode={usageCode}
                    codeContent={componentCode}
                    collapsible={true}
                    header={
                        <div className="flex items-center justify-between w-full">
                            <div className="flex flex-col gap-1">
                                <h3 className="text-xs ml-4 font-bold text-rb-accent-1 uppercase">Configuration</h3>
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
                    {/* Control Props */}
                    <ColorPicker label="Text Color" value={textColor} onChange={setTextColor} />
                    <ColorPicker label="Accent Color" value={accentColor} onChange={setAccentColor} />

                    <DiscreteSlider2 label="Sticky Top (vh)" min={0} max={40} step={1} value={stickyTop} onChange={setStickyTop} />
                    <DiscreteSlider2 label="Card Height (vh)" min={30} max={90} step={1} value={cardHeight} onChange={setCardHeight} />
                    <DiscreteSlider2 label="Y Offset (vh)" min={-20} max={10} step={1} value={yOffset} onChange={setYOffset} />

                    <DiscreteSlider2 label="Rotation" min={0} max={20} step={1} value={rotation} onChange={setRotation} />
                    <DiscreteSlider2 label="Scale" min={0.5} max={1} step={0.01} value={scale} onChange={setScale} />
                    <DiscreteSlider2 label="Border Radius (px)" min={0} max={200} step={1} value={borderRadius} onChange={setBorderRadius} />
                </PreviewTab>
            </div>

            {/* Installation Section */}
            <div id="installation-tabs">
                <InstallationTabs />
            </div>

            {/* API Reference Section */}
            <div id="api-reference" className="flex flex-col gap-5">
                <HeaderText text="API Reference" option={6} />
                <PropsTable categories={loaderProps} />
            </div>

            {/* Credits Section */}
            <div id="credits" className="w-full max-w-5xl mx-auto py-10">
                <Credits data={creditsData} />
            </div>
        </div>
    );
}
