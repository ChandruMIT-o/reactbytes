"use client";

import React, { useState } from "react";
import HeaderText from "../../components/textfields/HeaderText";
import ParagraphText from "../../components/textfields/ParagraphText";
import PreviewTab from "../../components/tabsection/PreviewTab";
import InstallationTabs from "../../components/tabsection/InstallationTabs";
import { PropsTable } from "../../components/table/PropsTable";
import TabbedSection, { TabData } from "../../meta/tabbed/TabbedSection/TabbedSection";
import { loaderProps, tabDataProps, componentCode, creditsData } from "./TabbedSectionData";
import { Credits } from "../../components/buttongroup/Credits";

const DEFAULT_TABS: TabData[] = [
    {
        id: 'ethereal',
        label: 'Ethereal',
        category: 'System 01',
        title: 'Ethereal Space',
        subtitle: 'The void of tranquility.',
        description: 'Dive deep into the tranquil realms of nothingness. Where structure dissolves and pure aesthetic form takes precedence. This dimension utilizes minimal visual noise to maximize cognitive clarity.',
        accentColor: '#F2EEE9',
        hexCode: '0x00A1_E',
    },
    {
        id: 'nebula',
        label: 'Nebula',
        category: 'System 02',
        title: 'Cosmic Dreams',
        subtitle: 'Whispers of the cosmos.',
        description: 'Wander through the cosmic dust and witness the birth of stars. Here, the boundaries of conventional design are pushed, allowing for a fluid, continuous integration of space and light.',
        accentColor: '#E6DFF1',
        hexCode: '0x00B2_N',
    },
    {
        id: 'oceanic',
        label: 'Oceanic',
        category: 'System 03',
        title: 'Abyssal Void',
        subtitle: 'Depths uncharted.',
        description: 'Explore the serene depths where light barely reaches. A structural masterpiece built on the foundations of deep-sea pressure and unyielding elegance, crafted for the ultimate sensory experience.',
        accentColor: '#C0DEDD',
        hexCode: '0x00C3_O',
    },
];

export const TabbedSectionPage = () => {
    const [tabs, setTabs] = useState<TabData[]>(DEFAULT_TABS);

    const usageCode = `<TabbedSection
  tabs={[
    {
      id: 'tab1',
      label: 'Tab 1',
      category: 'Cat 01',
      title: 'Title 1',
      subtitle: 'Subtitle 1',
      description: 'Description 1...',
      accentColor: '#FFFFFF',
      hexCode: '0x0001'
    },
    // ... more tabs
  ]}
/>`;

    return (
        <div className="flex flex-col gap-5">
            <div id="tabbed-section-title">
                <HeaderText text="Tabbed Section" option={3} />
            </div>
            <ParagraphText
                text="A high-end, immersive tabbed interface featuring Anime.js powered transitions, procedural scramble effects, and responsive layout. Ideal for storytelling or deep-dive product explorations."
                option={4}
            />

            <div id="preview">
                <PreviewTab
                    previewContent={
                        <div className="w-full bg-zinc-950 rounded-3xl overflow-y-auto border border-white/5 h-[500px] relative custom-scrollbar">
                            <TabbedSection tabs={tabs} className="!min-h-0" />
                        </div>
                    }
                    usageCode={usageCode}
                    codeContent={componentCode}
                    collapsible={true}
                >
                    <div className="p-4 bg-rb-neutral-2 rounded-lg border border-rb-neutral-4">
                        <p className="text-xs font-bold text-rb-accent-1 uppercase mb-2">Editor Note</p>
                        <p className="text-sm text-rb-accent-1/60 leading-relaxed">
                            This component is highly data-driven. Modify the <code className="text-rb-accent-2">tabs</code> array prop to customize the entire experience including colors, titles, and descriptions.
                        </p>
                    </div>
                </PreviewTab>
            </div>

            <div id="installation-tabs">
                <InstallationTabs />
            </div>

            <div id="api-reference" className="flex flex-col gap-5">
                <HeaderText text="API Reference" option={6} />
                <PropsTable categories={loaderProps} />
                <div className="mt-4">
                    <PropsTable categories={tabDataProps} />
                </div>
            </div>

            <div id="credits" className="w-full max-w-5xl mx-auto py-10">
                <Credits data={creditsData} />
            </div>
        </div>
    );
};

export default TabbedSectionPage;
