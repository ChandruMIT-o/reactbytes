"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, ArrowRightLeft, Box, SquareDashed, Command } from 'lucide-react';

const DEFAULT_TABS: TabItem[] = [
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
import * as animeModule from 'animejs';

const anime: any = (options: any) => {
	if (options && options.targets) {
		const { targets, ...rest } = options;
		return ((animeModule.animate || (animeModule as any).default || animeModule) as any)(targets, rest);
	}
	return ((animeModule.animate || (animeModule as any).default || animeModule) as any)(options);
};
const animLib = animeModule as any;
if (animLib.stagger) {
	anime.stagger = animLib.stagger;
}
if (animLib.timeline) {
	anime.timeline = animLib.timeline;
} else if (animLib.createTimeline) {
	anime.timeline = animLib.createTimeline;
}

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
const AnimatedContent: React.FC<{ title: string; content: string }> = ({ title, content }) => {
    const containerRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        if (!containerRef.current) return;

        const tl = anime.timeline({
            easing: 'easeOutExpo',
        });

        tl.add({
            targets: containerRef.current.querySelectorAll('.mask-word'),
            opacity: [0, 1],
            translateY: [50, 0],
            rotate: [5, 0],
            duration: 1000,
            delay: anime.stagger(40)
        })
        .add({
            targets: containerRef.current.querySelectorAll('.content-line'),
            opacity: [0, 1],
            translateY: [20, 0],
            duration: 800,
            delay: anime.stagger(100)
        }, '-=800');
    }, [title, content]);

    return (
        <div ref={containerRef} style={{ perspective: '1000px' }}>
            <h2 className="text-[30px] font-medium tracking-tight text-[#f0f0f5] mb-6 mt-6 flex flex-wrap justify-center gap-x-2">
                {title.split(' ').map((word, i) => (
                    <span key={i} className="inline-block overflow-hidden pb-1">
                        <span className="mask-word inline-block opacity-0">
                            {word}
                        </span>
                    </span>
                ))}
            </h2>
            <div className="flex flex-col gap-1">
                {content.split('. ').map((line, i) => (
                    <div key={i} className="overflow-hidden">
                        <p className="content-line font-mono text-[15.5px] leading-[1.6] text-[#a09bb8] tracking-tight max-w-[600px] mx-auto text-center opacity-0">
                            {line}{i < content.split('. ').length - 1 ? '.' : ''}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

// --- Main Component ---
export const PillTabbedSection: React.FC<PillTabbedSectionProps> = ({
    tabs = DEFAULT_TABS,
    defaultTab,
    containerClassName = "",
    contentClassName = "",
}) => {
    const [activeTab, setActiveTab] = useState<string>(defaultTab || tabs[0]?.id || "");
    const headerRef = React.useRef<HTMLDivElement>(null);
    const cardRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        if (!headerRef.current || !cardRef.current) return;

        anime({
            targets: headerRef.current,
            scaleX: [1.08, 1],
            scaleY: [0.9, 1],
            translateY: [-8, 0],
            filter: ['blur(6px)', 'blur(0px)'],
            duration: 900,
            easing: 'easeOutElastic(1, .4)'
        });

        // Kinetic Pop: High-energy elastic transition with 3D perspective
        anime({
            targets: cardRef.current,
            scale: [0.85, 1],
            translateY: [40, 0],
            rotateX: [20, 0],
            opacity: [0, 1],
            easing: 'easeOutElastic(1, .6)',
            duration: 1400
        });
    }, [activeTab]);

    const activeTabData = tabs.find(t => t.id === activeTab) || tabs[0];

    if (!activeTabData) return null;

    return (
        <div className={`relative w-fit mx-auto flex flex-col items-center animated-border-container ${containerClassName}`} style={{ perspective: '1200px' }}>
            <style dangerouslySetInnerHTML={{
                __html: `
                @property --border-angle {
                    syntax: "<angle>";
                    inherits: true;
                    initial-value: 0turn;
                }

                @property --ray-pos {
                    syntax: "<percentage>";
                    inherits: true;
                    initial-value: 0%;
                }

                @keyframes bg-spin {
                    to {
                        --border-angle: 1turn;
                    }
                }

                @keyframes ray-sweep {
                    0% {
                        --ray-pos: -50%;
                    }
                    100% {
                        --ray-pos: 150%;
                    }
                }

                .animated-border-container {
                    --border-angle: 0turn;
                    animation: bg-spin 4s linear infinite;
                }

                .animated-border-header {
                    --main-bg: conic-gradient(
                        from var(--border-angle),
                        var(--bg-color),
                        var(--bg-color) 5%,
                        var(--bg-color) 60%,
                        var(--bg-color) 95%
                    );
                    
                    border: solid 2px transparent;
                    /* A linear gradient sweeping left to right creates two rays on top and bottom borders simultaneously */
                    --gradient-border: linear-gradient(
                        to right,
                        transparent calc(var(--ray-pos) - 80%),
                        #08f var(--ray-pos),
                        transparent calc(var(--ray-pos) + 5%)
                    );
                    
                    background: 
                        var(--main-bg) padding-box,
                        var(--gradient-border) border-box,
                        var(--main-bg) border-box;
                    
                    background-position: center center;
                    animation: ray-sweep 4s linear infinite;
                    animation-delay: 1.5s;
                }

                .animated-border-content {
                    --main-bg: conic-gradient(
                        from var(--border-angle),
                        var(--bg-color),
                        var(--bg-color) 5%,
                        var(--bg-color) 60%,
                        var(--bg-color) 95%
                    );
                    
                    border: solid 2px transparent;
                    --gradient-border: conic-gradient(from var(--border-angle), transparent 25%, #08f, #f03 99%, transparent);
                    
                    background: 
                        var(--main-bg) padding-box,
                        var(--gradient-border) border-box, 
                        var(--main-bg) border-box;
                    
                    background-position: center center;
                }
            `}} />
            {/* Tab Header - 50% inside, 50% outside the content area border */}
            <div
                ref={headerRef}
                className="relative z-20 w-fit rounded-full p-1.5 flex items-center justify-between gap-2 overflow-hidden shadow-inner shadow-black/20 translate-y-1/2 animated-border-header origin-bottom"
                style={{ '--bg-color': '#121418', transformStyle: 'preserve-3d' } as React.CSSProperties}
            >
                {/* Shimmering sharp noise overlay */}
                <svg
                    className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.15] z-0"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <filter id="pillNoiseFilter">
                        <feTurbulence
                            type="fractalNoise"
                            baseFrequency="0.75"
                            numOctaves="4"
                            stitchTiles="stitch"
                        />
                        {/* Higher contrast and slight silver tint for 'shimmering' */}
                        <feColorMatrix type="matrix" values="
                            1 0 0 0 0.1 
                            0 1 0 0 0.1 
                            0 0 1 0 0.2 
                            0 0 0 2.2 -0.9"
                        />
                    </filter>
                    <rect width="100%" height="100%" filter="url(#pillNoiseFilter)" />
                </svg>

                {/* Render Tabs */}
                {tabs.map((tab) => {
                    const isActive = activeTab === tab.id;
                    const Icon = tab.icon;

                    return (
                        <motion.button
                            whileHover={{ backgroundColor: isActive ? '#1a0033' : '#110826' }}
                            whileTap={{ scale: 0.98 }}
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`
                  relative z-10 flex items-center justify-center h-14 rounded-full 
                  transition-all duration-300 ease-out overflow-hidden
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50 group
                  ${isActive
                                    ? 'max-w-[280px] px-5'
                                    : 'max-w-[56px] w-[56px]'
                                }
                `}
                            aria-selected={isActive}
                            role="tab"
                        >
                            {/* Active Tab Background (Sliding Pill) */}
                            {isActive && (
                                <motion.div
                                    layoutId="activePill"
                                    className="absolute inset-0 bg-[#0A001A] z-[-1]"
                                    transition={{ type: "spring", bounce: 0.15, duration: 0.6 }}
                                />
                            )}

                            {/* Solid background for inactive buttons */}
                            {!isActive && (
                                <div className="absolute inset-0 bg-[#060010] z-[-1]" />
                            )}

                            <motion.div
                                animate={isActive ? { rotate: [0, -30, 20, -10, 0], scale: [1, 1.3, 0.9, 1.1, 1] } : { rotate: 0, scale: 1 }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                            >
                                <Icon
                                    strokeWidth={2}
                                    className={`
                        shrink-0 w-5 h-5 transition-colors duration-300
                        ${isActive ? 'text-[#9b8bf4] group-hover:text-[#b3a7ff]' : 'text-[#6b6680] group-hover:text-[#9b8bf4]'}
                      `}
                                />
                            </motion.div>

                            {/* Expandable Label */}
                            <div
                                className={`
                    flex flex-col overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]
                    ${isActive ? 'w-auto opacity-100 ml-3 group-hover:text-white' : 'w-0 opacity-0 ml-0'}
                  `}
                            >
                                <span className="whitespace-nowrap text-[15px] font-medium tracking-wide text-[#d1cae8] transition-colors duration-300 group-hover:text-white">
                                    {tab.label}
                                </span>
                            </div>
                        </motion.button>
                    );
                })}
            </div>

            {/* Content Area - Glass background with main border */}
            <div
                ref={cardRef}
                className={`w-full backdrop-blur-[24px] rounded-[3.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)] overflow-hidden animated-border-content origin-top ${contentClassName}`}
                style={{ '--bg-color': '#060010', transformStyle: 'preserve-3d' } as React.CSSProperties}
            >
                <div className="px-12 pb-14 pt-16 relative text-center">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                        >
                            <AnimatedContent title={activeTabData.title} content={activeTabData.content} />
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default PillTabbedSection;
