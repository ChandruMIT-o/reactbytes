export const loaderProps = [
    {
        title: "Core Props",
        props: [
            {
                name: "tabs",
                type: "TabItem[]",
                defaultValue: "[]",
                description: "An array of tab objects to be displayed in the section.",
            },
            {
                name: "defaultTab",
                type: "string",
                defaultValue: "tabs[0].id",
                description: "The ID of the tab that should be active on initial render.",
            },
        ],
    },
    {
        title: "Styling Props",
        props: [
            {
                name: "containerClassName",
                type: "string",
                defaultValue: "''",
                description: "Additional CSS classes for the outer card container.",
            },
            {
                name: "contentClassName",
                type: "string",
                defaultValue: "''",
                description: "Additional CSS classes for the content area.",
            },
        ],
    },
];

export const tabItemProps = [
    {
        title: "TabItem Object",
        props: [
            {
                name: "id",
                type: "string",
                description: "Unique identifier for the tab.",
            },
            {
                name: "icon",
                type: "React.ElementType",
                description: "Lucide or any React icon component to display in the tab pill.",
            },
            {
                name: "label",
                type: "string",
                description: "Short text label shown when the tab is active.",
            },
            {
                name: "title",
                type: "string",
                description: "Heading displayed in the content area.",
            },
            {
                name: "content",
                type: "string",
                description: "Body text or description displayed in the content area.",
            },
        ],
    },
];

export const componentCode = `"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Types ---
export type TabItem = {
    id: string;
    icon: React.ElementType;
    label: string;
    title: string;
    content: string;
};

export interface PillTabbedSectionProps {
    /** Array of tab items to display */
    tabs: TabItem[];
    /** The ID of the tab to be active by default */
    defaultTab?: string;
    /** Additional CSS classes for the outer container */
    containerClassName?: string;
    /** Additional CSS classes for the content area */
    contentClassName?: string;
}

// --- Sub-components ---

// SVG Noise overlay to match the textured header in the design
const NoiseOverlay = () => (
    <svg
        className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.12] mix-blend-overlay rounded-[2.5rem]"
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
    >
        <filter id="noiseFilter">
            <feTurbulence
                type="fractalNoise"
                baseFrequency="0.85"
                numOctaves="3"
                stitchTiles="stitch"
            />
        </filter>
        <rect width="100%" height="100%" filter="url(#noiseFilter)" />
    </svg>
);

// --- Main Component ---
export const PillTabbedSection: React.FC<PillTabbedSectionProps> = ({
    tabs,
    defaultTab,
    containerClassName = "",
    contentClassName = "",
}) => {
    const [activeTab, setActiveTab] = useState<string>(defaultTab || tabs[0]?.id || "");

    const activeTabData = tabs.find(t => t.id === activeTab) || tabs[0];

    if (!activeTabData) return null;

    return (
        <div className={\`w-full max-w-[640px] bg-[#0b0914] rounded-[2.5rem] p-2 overflow-hidden shadow-2xl shadow-black/50 border border-white/[0.02] \${containerClassName}\`}>

            {/* Header Tab Bar Container */}
            <div className="relative w-full bg-[#1e1b29] rounded-[2.2rem] p-2 flex items-center gap-2 overflow-hidden border border-white/[0.04]">
                <NoiseOverlay />

                {/* Render Tabs */}
                {tabs.map((tab) => {
                    const isActive = activeTab === tab.id;
                    const Icon = tab.icon;

                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={\`
                  relative z-10 flex items-center justify-center h-14 rounded-full 
                  transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] overflow-hidden
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50
                  \${isActive
                                    ? 'bg-[#0b0914] max-w-[280px] px-5 border border-white/5 shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)]'
                                    : 'bg-[#15121e] max-w-[56px] w-[56px] hover:bg-[#1a1724] border border-transparent'
                                }
                \`}
                            aria-selected={isActive}
                            role="tab"
                        >
                            <Icon
                                strokeWidth={2}
                                className={\`
                    shrink-0 w-5 h-5 transition-colors duration-500
                    \${isActive ? 'text-[#9b8bf4]' : 'text-[#6b6680]'}
                  \`}
                            />

                            {/* Expandable Label */}
                            <div
                                className={\`
                    flex flex-col overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]
                    \${isActive ? 'w-auto opacity-100 ml-3' : 'w-0 opacity-0 ml-0'}
                  \`}
                            >
                                <span className="whitespace-nowrap text-[15px] font-medium tracking-wide text-[#d1cae8]">
                                    {tab.label}
                                </span>
                            </div>
                        </button>
                    );
                })}
            </div>

            {/* Content Area */}
            <div className={\`px-6 pb-8 pt-10 relative \${contentClassName}\`}>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                    >
                        <h2 className="text-[26px] font-medium tracking-tight text-[#f0f0f5] mb-6">
                            {activeTabData.title}
                        </h2>
                        <p className="font-mono text-[14.5px] leading-[1.9] text-[#8a85a0] tracking-tight">
                            {activeTabData.content}
                        </p>
                    </motion.div>
                </AnimatePresence>
            </div>

        </div>
    );
};

export default PillTabbedSection;`;

export const creditsData = [
    {
        title: "Component Source",
        items: [
            {
                name: "React Bytes",
                role: "Collection",
                url: "https://reactbytes.dev",
            },
        ],
    },
    {
        title: "Open Source Libraries",
        items: [
            {
                name: "React",
                role: "UI Framework",
                url: "https://react.dev",
            },
            {
                name: "Framer Motion",
                role: "Animations",
                url: "https://www.framer.com/motion/",
            },
            {
                name: "Tailwind CSS",
                role: "Styling",
                url: "https://tailwindcss.com",
            },
            {
                name: "Lucide React",
                role: "Icons",
                url: "https://lucide.dev",
            },
        ],
    },
];
