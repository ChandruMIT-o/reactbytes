import { PropDefinition } from "../../components/table/PropsTable";

export const defaultCards = [
    {
        id: '1',
        num: '01',
        label: 'Architecture',
        title: 'Sticky Flow',
        desc: 'Leaving behind complex math for native CSS sticky positioning. The cards flow and lock into place organically.',
        bg: '#C0DEDD',
        text: '#060010',
        border: 'rgba(6, 0, 16, 0.2)',
    },
    {
        id: '2',
        num: '02',
        label: 'Animation',
        title: 'Interpolation',
        desc: 'Powered by GSAP, translating vertical scroll momentum into perfectly eased, 60fps hardware-accelerated transforms.',
        bg: '#E6DFF1',
        text: '#1D1C21',
        border: 'rgba(29, 28, 33, 0.2)',
    },
    {
        id: '3',
        num: '03',
        label: 'Dimension',
        title: 'Z-Space Depth',
        desc: 'Cards don’t just scale; they rotate on multiple axes. Alternating Z-rotations create a beautifully imperfect physical stack.',
        bg: '#181A1E',
        text: '#F2EEE9',
        border: 'rgba(242, 238, 233, 0.1)',
    },
    {
        id: '4',
        num: '04',
        label: 'Performance',
        title: 'Composite Layer',
        desc: 'By only animating transforms and filters, we bypass main-thread layout thrashing for a buttery, immersive experience.',
        bg: '#F2EEE9',
        text: '#000000',
        border: 'rgba(0, 0, 0, 0.2)',
    },
];

export const loaderProps = [
    {
        title: "StackedCards Props",
        props: [
            { name: "items", type: "StackedCardItem[]", defaultValue: "[]", description: "Array of card objects to display." },
            { name: "textColor", type: "string", defaultValue: "'#F2EEE9'", description: "Base text color for navigation elements." },
            { name: "accentColor", type: "string", defaultValue: "'#C0DEDD'", description: "Color for text selection and highlights." },
            { name: "stickyTop", type: "string", defaultValue: "'10vh'", description: "CSS top value where cards become sticky." },
            { name: "cardHeight", type: "string", defaultValue: "'60vh'", description: "Fixed height for each card." },
            { name: "rotationStrength", type: "number", defaultValue: "3", description: "Max rotation degrees for the stack effect." },
            { name: "scaleStrength", type: "number", defaultValue: "0.9", description: "Final scaling factor for stacked cards." },
            { name: "yOffset", type: "string", defaultValue: "'-3vh'", description: "Vertical translation when cards stack." },
            { name: "scroller", type: "string | HTMLElement", defaultValue: "null", description: "Custom scroller for ScrollTrigger (defaults to window)." },
            { name: "borderRadius", type: "string", defaultValue: "'0 80px 0 80px'", description: "Border radius for the cards." },
        ],
    },
];

export const creditsData = [
    {
        title: "Inspiration & Tech",
        items: [
            { name: "GSAP", role: "Animation Engine", url: "https://greensock.com/gsap/" },
            { name: "ScrollTrigger", role: "Scroll Plugin", url: "https://greensock.com/scrolltrigger/" },
            { name: "Unsplash", role: "Assets", url: "https://unsplash.com" },
        ],
    },
];

export const componentCode = `"use client";

import React, { useEffect, useRef, useState } from 'react';

export interface StackedCardItem {
    id: string | number;
    num: string;
    label: string;
    title: string;
    desc: string;
    bg: string;
    text: string;
    border: string;
}

interface StackedCardsProps {
    items: StackedCardItem[];
    textColor?: string;
    accentColor?: string;
    stickyTop?: string;
    cardHeight?: string;
    rotationStrength?: number;
    scaleStrength?: number;
    yOffset?: string;
    scroller?: string | HTMLElement | null;
    borderRadius?: string;
    className?: string;
}

declare global {
    interface Window {
        gsap: any;
        ScrollTrigger: any;
    }
}

export default function StackedCards({
    items,
    textColor = '#F2EEE9',
    accentColor = '#C0DEDD',
    stickyTop = '10vh',
    cardHeight = '60vh',
    rotationStrength = 3,
    scaleStrength = 0.9,
    yOffset = '-3vh',
    scroller = null,
    borderRadius = '0 80px 0 80px',
    className = '',
}: StackedCardsProps) {
    const [engineLoaded, setEngineLoaded] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const cardsRef = useRef<(HTMLLIElement | null)[]>([]);

    useEffect(() => {
        const loadScript = (src: string) => {
            return new Promise((resolve, reject) => {
                if (document.querySelector(\`script[src="\${src}"]\`)) {
                    resolve(true);
                    return;
                }
                const script = document.createElement('script');
                script.src = src;
                script.async = true;
                script.onload = resolve;
                script.onerror = reject;
                document.head.appendChild(script);
            });
        };

        const initEngine = async () => {
            try {
                await loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js');
                await loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js');
                setEngineLoaded(true);
            } catch (error) {
                console.error('Failed to load animation engine', error);
            }
        };

        initEngine();
    }, []);

    useEffect(() => {
        if (!engineLoaded || !window.gsap || !window.ScrollTrigger) return;

        if (scroller === undefined && scroller !== null) return;

        const gsap = window.gsap;
        const ScrollTrigger = window.ScrollTrigger;
        gsap.registerPlugin(ScrollTrigger);

        const ctx = gsap.context(() => {
            gsap.to(containerRef.current, { opacity: 1, duration: 1.2, ease: 'power3.out' });

            cardsRef.current.forEach((card, i) => {
                if (!card) return;
                const content = card.querySelector('.card-content');
                const overlay = card.querySelector('.card-overlay');

                if (i === cardsRef.current.length - 1) return;

                const rotateDir = i % 2 === 0 ? rotationStrength : -rotationStrength;

                gsap.to(content, {
                    scale: scaleStrength,
                    y: yOffset,
                    rotationZ: rotateDir,
                    rotationX: 5,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: card,
                        scroller: scroller || window,
                        start: \`top \${stickyTop}\`,
                        end: \`bottom \${stickyTop}\`,
                        scrub: true,
                    },
                });

                if (overlay) {
                    gsap.to(overlay, {
                        opacity: 0.6,
                        ease: 'none',
                        scrollTrigger: {
                            trigger: card,
                            scroller: scroller || window,
                            start: \`top \${stickyTop}\`,
                            end: \`bottom \${stickyTop}\`,
                            scrub: true,
                        },
                    });
                }
            });
        }, containerRef);

        setTimeout(() => ScrollTrigger.refresh(), 100);

        return () => ctx.revert();
    }, [engineLoaded, items, rotationStrength, scaleStrength, yOffset, stickyTop, scroller]);

    return (
        <div
            ref={containerRef}
            className={\`font-sans opacity-0 transition-opacity duration-1000 relative selection:bg-current selection:text-black \${className}\`}
            style={{ 
                color: textColor,
                ['--selection-bg' as any]: accentColor,
                ['--selection-text' as any]: '#000000'
            }}
        >
            <ul className="flex flex-col gap-[3vh] pb-[10vh]">
                {items.map((card, index) => (
                    <li
                        key={card.id || index}
                        ref={(el) => {
                            cardsRef.current[index] = el;
                        }}
                        className="sticky w-full"
                        style={{
                            top: stickyTop,
                            height: cardHeight,
                            minHeight: '300px',
                            perspective: '1500px',
                            paddingTop: \`\${index * 1}rem\`,
                        }}
                    >
                        <div
                            className="card-content w-full h-full flex flex-col md:flex-row overflow-hidden shadow-2xl transition-shadow duration-500"
                            style={{
                                backgroundColor: card.bg,
                                color: card.text,
                                borderRadius: borderRadius,
                                transformOrigin: '50% 50%',
                                willChange: 'transform',
                            }}
                        >
                            <div
                                className="w-full md:w-1/4 p-6 md:p-8 flex flex-row md:flex-col justify-between items-start md:items-center"
                            >
                                <span className="text-4xl md:text-6xl font-black tracking-tighter leading-none opacity-90">
                                    {card.num}
                                </span>

                                <span className="text-xs md:text-sm tracking-[0.4em] uppercase font-bold md:-rotate-180 md:[writing-mode:vertical-rl] opacity-50">
                                    {card.label}
                                </span>
                            </div>

                            <div className="w-full md:w-3/4 p-6 md:p-12 lg:p-16 flex flex-col justify-center relative">
                                <div className="absolute right-0 bottom-0 w-48 h-48 rounded-full mix-blend-overlay opacity-20 pointer-events-none blur-3xl transform translate-x-1/3 translate-y-1/3" style={{ backgroundColor: card.text }} />

                                <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 tracking-tight leading-[1.1] relative z-10">
                                    {card.title}
                                </h2>
                                <p className="text-sm md:text-lg max-w-xl leading-relaxed opacity-80 font-medium relative z-10">
                                    {card.desc}
                                </p>

                                <div className="mt-8 flex items-center gap-3 cursor-pointer group relative z-10 w-max">
                                    <span className="text-xs font-bold uppercase tracking-widest group-hover:pr-2 transition-all">Explore</span>
                                    <div className="w-6 h-[1.5px] bg-current transform origin-left group-hover:scale-x-150 transition-transform" />
                                </div>
                            </div>

                            <div className="card-overlay absolute inset-0 bg-black pointer-events-none opacity-0 z-50 rounded-[inherit]" />
                        </div>
                    </li>
                ))}
            </ul>

            <style jsx global>{\`
                ::selection {
                    background: var(--selection-bg);
                    color: var(--selection-text);
                }
            \`}</style>
        </div>
    );
}
`;
