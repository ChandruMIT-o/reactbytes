"use client";

import React from "react";
import HeaderText from "../../components/textfields/HeaderText";
import ParagraphText from "../../components/textfields/ParagraphText";
import PreviewTab from "../../components/tabsection/PreviewTab";
import InstallationTabs from "../../components/tabsection/InstallationTabs";
import { PropsTable } from "../../components/table/PropsTable";
import { PillTabbedSection } from "../../meta/tabbed/PillTabbedSection/PillTabbedSection";
import { loaderProps, tabItemProps, componentCode, creditsData } from "./PillTabbedSectionData";
import { Credits } from "../../components/buttongroup/Credits";
import { Home, ArrowRightLeft, Box, SquareDashed, Command } from 'lucide-react';

const DEFAULT_TABS = [
    {
        id: 'home',
        icon: Home,
        label: 'Dashboard Home',
        title: 'Dashboard Overview',
        content: "Most tabbed panes follow a very predictable rectangular format. While functional, there's plenty of room for creative interpretation. This concept reimagines the traditional approach, using non-standard shapes and fluid transitions to create a more engaging experience."
    },
    {
        id: 'flow',
        icon: ArrowRightLeft,
        label: 'Data Flow',
        title: 'Data Flow Management',
        content: "Visualize and manage the intricate pathways your data takes. Most tabbed panes follow a very predictable rectangular format. While functional, there's plenty of room for creative interpretation. This concept reimagines the traditional approach, using non-standard shapes and fluid transitions to create a more engaging experience."
    },
    {
        id: 'modules',
        icon: Box,
        label: 'Core Modules',
        title: 'Core System Modules',
        content: "Access and configure fundamental system components. Most tabbed panes follow a very predictable rectangular format. While functional, there's plenty of room for creative interpretation. This concept reimagines the traditional approach, using non-standard shapes and fluid transitions to create a more engaging experience."
    },
    {
        id: 'architecture',
        icon: SquareDashed,
        label: 'System Architecture',
        title: 'System Architecture',
        content: "Most tabbed panes follow a very predictable rectangular format. While functional, there's plenty of room for creative interpretation. This concept reimagines the traditional approach, using non-standard shapes and fluid transitions to create a more engaging experience."
    },
    {
        id: 'orchestrations',
        icon: Command,
        label: 'Open Orchestrations',
        title: 'Open Orchestrations',
        content: "Most tabbed panes follow a very predictable rectangular format. While functional, there's plenty of room for creative interpretation. This concept reimagines the traditional approach, using non-standard shapes and fluid transitions to create a more engaging experience."
    }
];

export const PillTabbedSectionPage = () => {
    const usageCode = `<PillTabbedSection
  tabs={[
    {
      id: 'home',
      icon: Home,
      label: 'Home',
      title: 'Home Section',
      content: 'Content goes here...'
    },
    // ... more tabs
  ]}
/>`;

    return (
        <div className="flex flex-col gap-5">
            <div id="pill-tabbed-section-title">
                <HeaderText text="Pill Tabbed Section" option={3} />
            </div>
            <ParagraphText
                text="A modern, fluid tabbed interface with expandable pill-shaped navigation. It features smooth Framer Motion transitions, a textured noise overlay, and a premium dark aesthetic."
                option={4}
            />

            <div id="preview">
                <PreviewTab
                    previewContent={
                        <div className="w-full min-h-[500px] flex items-center justify-center">
                            <PillTabbedSection tabs={DEFAULT_TABS} defaultTab="orchestrations" />
                        </div>
                    }
                    usageCode={usageCode}
                    codeContent={componentCode}
                    collapsible={true}
                >
                    <div className="p-4 bg-rb-neutral-2 rounded-lg border border-rb-neutral-4">
                        <p className="text-xs font-bold text-rb-accent-1 uppercase mb-2">Editor Note</p>
                        <p className="text-sm text-rb-accent-1/60 leading-relaxed">
                            The <code className="text-rb-accent-2">tabs</code> array prop allows for full customization of the navigation. Each item supports a Lucide icon, labels, and rich content.
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
                    <PropsTable categories={tabItemProps} />
                </div>
            </div>

            <div id="credits" className="w-full max-w-5xl mx-auto py-10">
                <Credits data={creditsData} />
            </div>
        </div>
    );
};

export default PillTabbedSectionPage;
