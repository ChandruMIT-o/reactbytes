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
    tabs?: TabItem[];
    /** The ID of the tab to be active by default */
    defaultTab?: string;
    /** The transition animation style when changing tabs */
    animationType?: 'kinetic' | 'smooth' | 'bounce' | 'fade';
    /** Border radius style of the tabs and layout container */
    tabShape?: 'pill' | 'rounded' | 'square';
    /** Active color for icons, text, and active highlight background */
    activeColor?: string;
    /** Inactive color for icons and text */
    inactiveColor?: string;
    /** First gradient color for the animated glowing borders */
    glowColor1?: string;
    /** Second gradient color for the animated glowing borders */
    glowColor2?: string;
    /** Speed of the glowing border spin in seconds */
    glowSpeed?: number;
    /** Whether the tabs should automatically rotate */
    autoRotate?: boolean;
    /** Time in milliseconds between tab rotations */
    autoRotateInterval?: number;
    /** Whether to pause auto rotation when hovering over the component */
    pauseOnHover?: boolean;
    /** Toggle the shimmering noise texture overlay */
    showNoise?: boolean;
    /** Additional CSS classes for the outer container */
    containerClassName?: string;
    /** Additional CSS classes for the content area */
    contentClassName?: string;
}

// --- Sub-components ---
const AnimatedContent: React.FC<{ 
    title: string; 
    content: string;
    animationType?: 'kinetic' | 'smooth' | 'bounce' | 'fade';
}> = ({ title, content, animationType = 'kinetic' }) => {
    const containerRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        if (!containerRef.current) return;

        const tl = anime.timeline({
            easing: animationType === 'fade' ? 'linear' : 'easeOutExpo',
        });

        let titleConfig = {};
        let bodyConfig = {};

        switch (animationType) {
            case 'fade':
                titleConfig = {
                    opacity: [0, 1],
                    duration: 600,
                    delay: anime.stagger(30)
                };
                bodyConfig = {
                    opacity: [0, 1],
                    duration: 500,
                    delay: anime.stagger(80)
                };
                break;
            case 'smooth':
                titleConfig = {
                    opacity: [0, 1],
                    translateY: [20, 0],
                    duration: 800,
                    delay: anime.stagger(30)
                };
                bodyConfig = {
                    opacity: [0, 1],
                    translateY: [10, 0],
                    duration: 600,
                    delay: anime.stagger(80)
                };
                break;
            case 'bounce':
                titleConfig = {
                    opacity: [0, 1],
                    translateY: [60, 0],
                    rotate: [10, 0],
                    duration: 1200,
                    delay: anime.stagger(50)
                };
                bodyConfig = {
                    opacity: [0, 1],
                    translateY: [30, 0],
                    duration: 900,
                    delay: anime.stagger(120)
                };
                break;
            case 'kinetic':
            default:
                titleConfig = {
                    opacity: [0, 1],
                    translateY: [50, 0],
                    rotate: [5, 0],
                    duration: 1000,
                    delay: anime.stagger(40)
                };
                bodyConfig = {
                    opacity: [0, 1],
                    translateY: [20, 0],
                    duration: 800,
                    delay: anime.stagger(100)
                };
        }

        tl.add({
            targets: containerRef.current.querySelectorAll('.mask-word'),
            ...titleConfig
        })
        .add({
            targets: containerRef.current.querySelectorAll('.content-line'),
            ...bodyConfig
        }, '-=800');
    }, [title, content, animationType]);

    return (
        <div ref={containerRef} style={{ perspective: '1000px' }}>
            <h2 className="text-xl sm:text-[30px] font-medium tracking-tight text-[#f0f0f5] mb-4 sm:mb-6 mt-4 sm:mt-6 flex flex-wrap justify-center gap-x-2">
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
                        <p className="content-line font-mono text-xs sm:text-[15.5px] leading-[1.6] text-[#a09bb8] tracking-tight max-w-[600px] mx-auto text-center opacity-0">
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
    animationType = 'kinetic',
    tabShape = 'pill',
    activeColor = '#9b8bf4',
    inactiveColor = '#6b6680',
    glowColor1 = '#0088ff',
    glowColor2 = '#ff0033',
    glowSpeed = 4,
    autoRotate = false,
    autoRotateInterval = 5000,
    pauseOnHover = true,
    showNoise = true,
    containerClassName = "",
    contentClassName = "",
}) => {
    const [activeTab, setActiveTab] = useState<string>(defaultTab || tabs[0]?.id || "");
    const [isHovered, setIsHovered] = useState(false);
    const headerRef = React.useRef<HTMLDivElement>(null);
    const cardRef = React.useRef<HTMLDivElement>(null);
    const activeTabRef = React.useRef<HTMLButtonElement | null>(null);

    // Auto-rotate effect
    React.useEffect(() => {
        if (!autoRotate || tabs.length <= 1 || (pauseOnHover && isHovered)) return;

        const interval = setInterval(() => {
            setActiveTab(prevTab => {
                const currentIndex = tabs.findIndex(t => t.id === prevTab);
                const nextIndex = (currentIndex + 1) % tabs.length;
                return tabs[nextIndex]?.id || prevTab;
            });
        }, autoRotateInterval);

        return () => clearInterval(interval);
    }, [autoRotate, autoRotateInterval, pauseOnHover, isHovered, tabs]);

    // Scroll active tab button into view on mobile viewport
    React.useEffect(() => {
        if (activeTabRef.current) {
            activeTabRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'center',
            });
        }
    }, [activeTab]);

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

        // Determine Card animation config based on animationType
        let cardAnimConfig = {};
        switch (animationType) {
            case 'smooth':
                cardAnimConfig = {
                    scale: [0.95, 1],
                    translateY: [15, 0],
                    rotateX: [0, 0],
                    opacity: [0, 1],
                    easing: 'easeOutQuart',
                    duration: 800
                };
                break;
            case 'bounce':
                cardAnimConfig = {
                    scale: [0.8, 1],
                    translateY: [50, 0],
                    rotateX: [25, 0],
                    opacity: [0, 1],
                    easing: 'easeOutElastic(1.2, 0.5)',
                    duration: 1500
                };
                break;
            case 'fade':
                cardAnimConfig = {
                    scale: [1, 1],
                    translateY: [0, 0],
                    rotateX: [0, 0],
                    opacity: [0, 1],
                    easing: 'easeOutQuad',
                    duration: 500
                };
                break;
            case 'kinetic':
            default:
                cardAnimConfig = {
                    scale: [0.85, 1],
                    translateY: [40, 0],
                    rotateX: [20, 0],
                    opacity: [0, 1],
                    easing: 'easeOutElastic(1, 0.6)',
                    duration: 1400
                };
        }

        anime({
            targets: cardRef.current,
            ...cardAnimConfig
        });
    }, [activeTab, animationType]);

    const activeTabData = tabs.find(t => t.id === activeTab) || tabs[0];

    if (!activeTabData) return null;

    const shapes = {
        pill: {
            header: 'rounded-full',
            button: 'rounded-full',
            activePill: 'rounded-full',
            inactiveBg: 'rounded-full',
            card: 'rounded-[2rem] sm:rounded-[3.5rem]',
        },
        rounded: {
            header: 'rounded-2xl',
            button: 'rounded-xl',
            activePill: 'rounded-xl',
            inactiveBg: 'rounded-xl',
            card: 'rounded-3xl',
        },
        square: {
            header: 'rounded-none',
            button: 'rounded-none',
            activePill: 'rounded-none',
            inactiveBg: 'rounded-none',
            card: 'rounded-none',
        },
    };
    const currentShape = shapes[tabShape] || shapes.pill;

    return (
        <div 
            className={`relative w-full max-w-[650px] mx-auto flex flex-col items-center animated-border-container ${containerClassName}`} 
            style={{ 
                '--ray-color-1': glowColor1, 
                '--ray-color-2': glowColor2, 
                '--glow-speed': `${glowSpeed}s`,
                '--active-color': activeColor,
                '--inactive-color': inactiveColor,
                perspective: '1200px'
            } as React.CSSProperties}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
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
                    animation: bg-spin var(--glow-speed, 4s) linear infinite;
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
                    --gradient-border: linear-gradient(
                        to right,
                        transparent calc(var(--ray-pos) - 80%),
                        var(--ray-color-1, #0088ff) var(--ray-pos),
                        transparent calc(var(--ray-pos) + 5%)
                    );
                    
                    background: 
                        var(--main-bg) padding-box,
                        var(--gradient-border) border-box,
                        var(--main-bg) border-box;
                    
                    background-position: center center;
                    animation: ray-sweep var(--glow-speed, 4s) linear infinite;
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
                    --gradient-border: conic-gradient(
                        from var(--border-angle),
                        transparent 25%,
                        var(--ray-color-1, #0088ff),
                        var(--ray-color-2, #ff0033) 99%,
                        transparent
                    );
                    
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
                className={`relative z-20 max-w-[calc(100vw-3rem)] sm:max-w-[480px] md:max-w-full w-fit ${currentShape.header} p-1.5 flex items-center justify-between overflow-hidden shadow-inner shadow-black/20 translate-y-1/2 animated-border-header origin-bottom`}
                style={{ '--bg-color': '#121418', transformStyle: 'preserve-3d' } as React.CSSProperties}
            >
                {/* Shimmering sharp noise overlay */}
                {showNoise && (
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
                            <feColorMatrix type="matrix" values="
                                1 0 0 0 0.1 
                                0 1 0 0 0.1 
                                0 0 1 0 0.2 
                                0 0 0 2.2 -0.9"
                            />
                        </filter>
                        <rect width="100%" height="100%" filter="url(#pillNoiseFilter)" />
                    </svg>
                )}

                {/* Horizontal Scroll Container for Mobile View */}
                <div className="flex items-center gap-2 overflow-x-auto scrollbar-none w-full py-0.5 px-1 scroll-smooth z-10">
                    {/* Render Tabs */}
                    {tabs.map((tab) => {
                        const isActive = activeTab === tab.id;
                        const Icon = tab.icon;

                        return (
                            <motion.button
                                whileHover={{ backgroundColor: isActive ? 'transparent' : 'rgba(255,255,255,0.02)' }}
                                whileTap={{ scale: 0.98 }}
                                key={tab.id}
                                ref={isActive ? activeTabRef : null}
                                onClick={() => setActiveTab(tab.id)}
                                className={`
                                  relative z-10 flex items-center justify-center h-14 ${currentShape.button} 
                                  transition-all duration-300 ease-out overflow-hidden
                                  focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50 group shrink-0
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
                                        className={`absolute inset-0 ${currentShape.activePill} z-[-1] overflow-hidden`}
                                        transition={{ type: "spring", bounce: 0.15, duration: 0.6 }}
                                    >
                                        {/* Solid background matching the tab header color to mask the noise overlay from showing through */}
                                        <div 
                                            className="absolute inset-0" 
                                            style={{ backgroundColor: 'var(--bg-color, #121418)' }} 
                                        />
                                        <div 
                                            className="absolute inset-0" 
                                            style={{ 
                                                backgroundColor: activeColor, 
                                                opacity: 0.12 
                                            }} 
                                        />
                                    </motion.div>
                                )}

                                {/* Solid background for inactive buttons */}
                                {!isActive && (
                                    <div className={`absolute inset-0 bg-[#060010] z-[-1] ${currentShape.inactiveBg}`} />
                                )}

                                <motion.div
                                    animate={isActive ? { rotate: [0, -30, 20, -10, 0], scale: [1, 1.3, 0.9, 1.1, 1] } : { rotate: 0, scale: 1 }}
                                    transition={{ duration: 0.8, ease: "easeOut" }}
                                >
                                    <Icon
                                        strokeWidth={2}
                                        className="shrink-0 w-5 h-5 transition-colors duration-300"
                                        style={{
                                            color: isActive ? activeColor : inactiveColor
                                        }}
                                    />
                                </motion.div>

                                {/* Expandable Label */}
                                <div
                                    className={`
                                        flex flex-col overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]
                                        ${isActive ? 'w-auto opacity-100 ml-3 group-hover:text-white' : 'w-0 opacity-0 ml-0'}
                                    `}
                                >
                                    <span 
                                        className="whitespace-nowrap text-[15px] font-medium tracking-wide transition-colors duration-300"
                                        style={{
                                            color: isActive ? activeColor : inactiveColor
                                        }}
                                    >
                                        {tab.label}
                                    </span>
                                </div>
                            </motion.button>
                        );
                    })}
                </div>
            </div>

            {/* Content Area - Glass background with main border */}
            <div
                ref={cardRef}
                className={`w-full backdrop-blur-[24px] ${currentShape.card} shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)] overflow-hidden animated-border-content origin-top ${contentClassName}`}
                style={{ '--bg-color': '#060010', transformStyle: 'preserve-3d' } as React.CSSProperties}
            >
                <div className="px-6 sm:px-12 pb-10 sm:pb-14 pt-12 sm:pt-16 relative text-center">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                        >
                            <AnimatedContent 
                                title={activeTabData.title} 
                                content={activeTabData.content} 
                                animationType={animationType}
                            />
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default PillTabbedSection;
