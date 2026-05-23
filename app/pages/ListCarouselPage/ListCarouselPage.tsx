"use client";

import React, { useState } from "react";
import HeaderText from "../../components/textfields/HeaderText";
import ParagraphText from "../../components/textfields/ParagraphText";
import PreviewTab from "../../components/tabsection/PreviewTab";
import InstallationTabs from "../../components/tabsection/InstallationTabs";
import { PropsTable } from "../../components/table/PropsTable";
import { ListCarousel } from "../../meta/carousel/ListCarousel/ListCarousel";
import { loaderProps, componentCode, creditsData } from "./ListCarouselData";
import DefaultTextInput from "@/app/components/textinput/DefaultTextInput";
import { RotateCcw } from "lucide-react";
import DefaultComboBox from "@/app/components/combobox/DefaultComboBox";
import { Credits } from "../../components/buttongroup/Credits";

const DEFAULT_BG = "https://assets.codepen.io/7558/bw-blurry-005.webp";

const presets = [
    {
        id: "default",
        label: "Atmospheric Mono",
        config: {
            defaultBg: "https://assets.codepen.io/7558/bw-blurry-005.webp",
        },
    },
    {
        id: "vibrant",
        label: "Vibrant Abstract",
        config: {
            defaultBg: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2070&auto=format&fit=crop",
        },
    },
    {
        id: "dark",
        label: "Deep Midnight",
        config: {
            defaultBg: "https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?q=80&w=2071&auto=format&fit=crop",
        },
    },
];

export const ListCarouselPage = () => {
    const [defaultBg, setDefaultBg] = useState(DEFAULT_BG);
    const [currentPreset, setCurrentPreset] = useState("default");
    const [key, setKey] = useState(0);

    const applyPreset = (presetId: string) => {
        const preset = presets.find((p) => p.id === presetId);
        if (preset) {
            setCurrentPreset(presetId);
            setDefaultBg(preset.config.defaultBg);
            setKey((prev) => prev + 1);
        }
    };

    const handleReplay = () => {
        setKey((prev) => prev + 1);
    };

    const handleReset = () => {
        applyPreset("default");
    };

    const usageCode = `<ListCarousel
  defaultBg="${defaultBg}"
/>`;

    return (
        <div className="flex flex-col gap-5">
            <div id="list-carousel-title">
                <HeaderText text="List Carousel" option={3} />
            </div>
            <ParagraphText
                text="A high-performance, buttery smooth scrolling list with a dynamic cursor preview. Perfect for showcasing projects, portfolios, or galleries with a luxurious feel."
                option={4}
            />

            <div id="preview">
                <PreviewTab
                    previewContent={
                        <div className="w-full h-[600px] relative overflow-hidden rounded-xl border border-rb-neutral-4 shadow-2xl">
                            <ListCarousel
                                key={key}
                                defaultBg={defaultBg}
                            />
                        </div>
                    }
                    onReplay={handleReplay}
                    usageCode={usageCode}
                    codeContent={componentCode}
                    collapsible={true}
                    header={
                        <div className="flex items-center justify-between ">
                            <div className="flex flex-col gap-1">
                                <h3 className="text-xs ml-4 font-bold text-rb-accent-1 uppercase">
                                    Props
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
                    <DefaultTextInput
                        label="Default Background URL"
                        value={defaultBg}
                        onChange={(val) => {
                            setDefaultBg(val);
                            setKey((prev) => prev + 1);
                        }}
                        placeholder="Enter image URL..."
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

export default ListCarouselPage;
