export const loaderProps = [
    {
        title: "Core Props",
        props: [
            {
                name: "tabs",
                type: "TabData[]",
                defaultValue: "[]",
                description: "The list of tabs to display in the section.",
            },
            {
                name: "className",
                type: "string",
                defaultValue: "''",
                description: "Additional CSS classes for the container.",
            },
        ],
    },
];

export const tabDataProps = [
    {
        title: "TabData Interface",
        props: [
            { name: "id", type: "string", description: "Unique identifier for the tab." },
            { name: "label", type: "string", description: "Label shown on the tab button." },
            { name: "category", type: "string", description: "Category label shown above the title." },
            { name: "title", type: "string", description: "Main title for the tab content." },
            { name: "subtitle", type: "string", description: "Italicized subtitle/quote." },
            { name: "description", type: "string", description: "Long description text." },
            { name: "accentColor", type: "string", description: "Hex color for accents and glow." },
            { name: "hexCode", type: "string", description: "A decorative hex string shown on the tab." },
        ],
    },
];

export const componentCode = `"use client";

import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import anime from 'animejs';

export interface TabData {
    id: string;
    label: string;
    category: string;
    title: string;
    subtitle: string;
    description: string;
    accentColor: string;
    hexCode: string;
}

export interface TabbedSectionProps {
    /** The list of tabs to display */
    tabs: TabData[];
    /** Additional CSS classes for the container */
    className?: string;
}

const Crosshair = ({ top, left, right, bottom }: any) => (
    <div className="absolute w-3 h-3 pointer-events-none opacity-50" style={{ top, left, right, bottom }}>
        <div className="absolute top-1/2 left-0 w-full h-[1px] bg-[#1D1C21] -translate-y-1/2" />
        <div className="absolute left-1/2 top-0 w-[1px] h-full bg-[#1D1C21] -translate-x-1/2" />
    </div>
);

export const TabbedSection: React.FC<TabbedSectionProps> = ({ 
    tabs, 
    className = "" 
}) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [displayIndex, setDisplayIndex] = useState(0);
    const [scrambleData, setScrambleData] = useState('00000.00');

    const isAnimatingRef = useRef(false);
    const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
    const indicatorRef = useRef<HTMLDivElement>(null);
    const watermarkRef = useRef<HTMLDivElement>(null);
    const glowRef = useRef<HTMLDivElement>(null);

    const currentTab = tabs[displayIndex] || tabs[0];

    useLayoutEffect(() => {
        const targetTab = tabRefs.current[activeIndex];
        if (targetTab && indicatorRef.current) {
            anime({
                targets: indicatorRef.current,
                left: targetTab.offsetLeft,
                width: targetTab.offsetWidth,
                backgroundColor: tabs[activeIndex]?.accentColor || '#F2EEE9',
                boxShadow: \`0 0 20px \${tabs[activeIndex]?.accentColor || '#F2EEE9'}80\`,
                duration: 1000,
                easing: 'easeOutElastic(1, .6)'
            });

            anime({
                targets: glowRef.current,
                backgroundColor: tabs[activeIndex]?.accentColor || '#F2EEE9',
                duration: 1500,
                easing: 'easeInOutSine'
            });
        }
    }, [activeIndex, tabs]);

    const handleTabChange = (index: number) => {
        if (index === activeIndex || isAnimatingRef.current) return;
        isAnimatingRef.current = true;
        setActiveIndex(index);

        const dummyObj = { value: 0 };
        anime({
            targets: dummyObj,
            value: 100,
            duration: 600,
            easing: 'linear',
            update: () => {
                setScrambleData((Math.random() * 99999).toFixed(2).padStart(8, '0'));
            }
        });

        anime({
            targets: '.anim-element',
            translateY: -20,
            opacity: 0,
            clipPath: 'inset(0 0 100% 0)',
            duration: 400,
            easing: 'easeInExpo',
            delay: anime.stagger(40, { from: 'last' }),
            complete: () => {
                setDisplayIndex(index);
            }
        });

        anime({
            targets: watermarkRef.current,
            opacity: [0.08, 0],
            scale: [1, 0.98],
            duration: 400,
            easing: 'easeInQuad'
        });
    };

    useEffect(() => {
        anime({
            targets: '.anim-element',
            translateY: [20, 0],
            opacity: [0, 1],
            clipPath: ['inset(100% 0 0 0)', 'inset(0% 0 0 0)'],
            duration: 800,
            easing: 'easeOutExpo',
            delay: anime.stagger(60, { start: 100 }),
            complete: () => {
                isAnimatingRef.current = false;
            }
        });

        anime({
            targets: watermarkRef.current,
            opacity: [0, 0.08],
            scale: [0.98, 1],
            duration: 1000,
            easing: 'easeOutExpo',
            delay: 200
        });
    }, [displayIndex]);

    useEffect(() => {
        const dummyObj = { value: 0 };
        anime({
            targets: dummyObj,
            value: 100,
            duration: 1000,
            easing: 'linear',
            update: () => {
                setScrambleData((Math.random() * 99999).toFixed(2).padStart(8, '0'));
            }
        });
    }, []);

    if (!tabs || tabs.length === 0) return null;

    return (
        <div className={\`min-h-screen bg-[#060508] text-[#F2EEE9] font-sans relative overflow-hidden flex flex-col pt-8 sm:pt-16 px-6 sm:px-12 lg:px-24 \${className}\`}>
            <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.2]"
                style={{ backgroundImage: \`linear-gradient(#1D1C21 1px, transparent 1px), linear-gradient(90deg, #1D1C21 1px, transparent 1px)\`, backgroundSize: '80px 80px' }} />

            <Crosshair top="10%" left="5%" />
            <Crosshair bottom="10%" right="5%" />

            <div ref={watermarkRef} className="absolute right-[-2%] top-[-5%] text-[300px] sm:text-[400px] font-bold text-[#060010] z-0 select-none tracking-tighter opacity-0" style={{ WebkitTextStroke: '2px #1D1C21' }}>
                0{displayIndex + 1}
            </div>

            <div ref={glowRef} className="absolute top-1/4 right-1/4 w-[600px] h-[600px] rounded-full blur-[160px] opacity-[0.06] pointer-events-none z-0" />

            <div className="w-full max-w-[1400px] mx-auto relative z-10 flex flex-col flex-1">
                <div className="w-full mb-16 sm:mb-24">
                    <div className="flex justify-between items-end mb-6">
                        <div className="text-[#799996] text-xs font-mono uppercase tracking-[0.3em]">Index // Navigation</div>
                        <div className="hidden sm:block text-[#799996] text-[10px] font-mono tracking-widest opacity-50 w-32 text-right">SYS.COORD_ {scrambleData}</div>
                    </div>
                    <div className="relative border-b border-[#1D1C21]">
                        <div ref={indicatorRef} className="absolute bottom-[-1px] h-[2px] w-0">
                            <div className="absolute left-0 bottom-full w-[1px] h-2 bg-inherit opacity-70" />
                            <div className="absolute right-0 bottom-full w-[1px] h-2 bg-inherit opacity-70" />
                        </div>
                        <div className="flex flex-row overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                            {tabs.map((tab, i) => {
                                const isActive = activeIndex === i;
                                return (
                                    <button
                                        key={tab.id}
                                        ref={(el) => { tabRefs.current[i] = el; }}
                                        onClick={() => handleTabChange(i)}
                                        className="group relative flex-1 min-w-[220px] flex flex-col justify-start px-6 pb-8 pt-4 outline-none text-left border-r border-[#1D1C21]/50 last:border-r-0 hover:bg-[#1D1C21]/30 transition-colors duration-500"
                                    >
                                        <div className="flex items-center justify-between w-full mb-4">
                                            <span className={\`font-mono text-xs tracking-widest transition-colors duration-500 \${isActive ? 'text-[#F2EEE9]' : 'text-[#4A5D5A]'}\`}>[{String(i + 1).padStart(2, '0')}]</span>
                                            <span className={\`text-[10px] uppercase tracking-widest font-mono transition-all duration-500 \${isActive ? 'opacity-100' : 'opacity-0'}\`} style={{ color: tab.accentColor }}>SYS.ACTV</span>
                                        </div>
                                        <span className={\`text-xl sm:text-2xl font-light tracking-wider transition-all duration-500 ease-out origin-left \${isActive ? 'scale-100 opacity-100' : 'scale-95 opacity-40 group-hover:opacity-70 group-hover:scale-100'}\`} style={{ color: isActive ? tab.accentColor : '#F2EEE9' }}>{tab.label}</span>
                                        <div className={\`mt-2 overflow-hidden transition-all duration-500 \${isActive ? 'max-h-10 opacity-100' : 'max-h-0 opacity-0'}\`}><span className="text-[#F2EEE9] text-xs font-mono" style={{ color: tab.accentColor }}>{tab.hexCode}</span></div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <div className="w-full flex-1 flex flex-col justify-start pb-12">
                    <div className="max-w-5xl relative">
                        <div className="flex items-center gap-6 mb-12 border-b border-[#1D1C21] pb-4 overflow-hidden">
                            <div className="anim-element flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: currentTab.accentColor, boxShadow: \`0 0 10px \${currentTab.accentColor}80\` }} />
                                <span className="text-xs font-mono uppercase tracking-[0.4em] text-[#F2EEE9]">{currentTab.category}</span>
                            </div>
                            <div className="anim-element ml-auto text-[#799996] font-mono text-xs sm:hidden">{scrambleData}</div>
                        </div>
                        <div className="overflow-hidden mb-6 py-2"><h2 className="anim-element text-6xl sm:text-7xl lg:text-[6rem] font-light tracking-tighter leading-none will-change-transform">{currentTab.title}</h2></div>
                        <div className="overflow-hidden mb-12 py-2"><p className="anim-element text-2xl sm:text-3xl lg:text-4xl font-light italic will-change-transform" style={{ color: currentTab.accentColor }}>{currentTab.subtitle}</p></div>
                        <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 overflow-hidden relative">
                            <div className="anim-element hidden sm:block sm:col-span-1 border-r border-[#1D1C21] h-full" />
                            <p className="anim-element sm:col-span-11 text-[#799996] leading-relaxed text-lg sm:text-2xl font-light pl-0 sm:pl-6 max-w-3xl will-change-transform">{currentTab.description}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TabbedSection;`;

export const creditsData = [
    {
        title: "Component Source",
        items: [
            {
                name: "JP Belley",
                role: "Visual Designer",
                url: "https://jeanphilippebelley.com/",
            },
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
                name: "Anime.js",
                role: "Animation Engine",
                url: "https://animejs.com/",
            },
            {
                name: "React",
                role: "UI Framework",
                url: "https://react.dev",
            },
            {
                name: "Tailwind CSS",
                role: "Styling",
                url: "https://tailwindcss.com",
            },
        ],
    },
];
