"use client";

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
    /** Base text color of the container */
    textColor?: string;
    /** Accent color used for selection */
    accentColor?: string;
    /** Sticky top position for the cards */
    stickyTop?: string;
    /** Height of the cards */
    cardHeight?: string;
    /** Strength of the rotation animation (degrees) */
    rotationStrength?: number;
    /** Scaling factor when cards stack (0 to 1) */
    scaleStrength?: number;
    /** Vertical offset when cards stack */
    yOffset?: string;
    /** Custom scroller container (selector or element) for ScrollTrigger. Defaults to window. */
    scroller?: string | HTMLElement | null;
    /** Border radius for the cards */
    borderRadius?: string;
    /** Custom class name for the main container */
    className?: string;
    /** Optional header text to show before the cards */
    headerText?: string;
    /** Optional footer text to show after the cards */
    footerText?: string;
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
    stickyTop = '40px',
    cardHeight = '360px',
    rotationStrength = 3,
    scaleStrength = 0.9,
    yOffset = '-20px',
    scroller = null,
    borderRadius = '40px',
    className = '',
    headerText = '',
    footerText = '',
}: StackedCardsProps) {
    const [engineLoaded, setEngineLoaded] = useState(false);
    const [containerWidth, setContainerWidth] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const cardsRef = useRef<(HTMLLIElement | null)[]>([]);

    // 1. Monitor real parent element container size limits
    useEffect(() => {
        if (!containerRef.current) return;

        const observer = new ResizeObserver((entries) => {
            if (!entries || entries.length === 0) return;
            setContainerWidth(entries[0].contentRect.width);
        });

        observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, []);

    const isNarrow = containerWidth < 640;

    // 2. Dynamic Script Injection
    useEffect(() => {
        const loadScript = (src: string) => {
            return new Promise((resolve, reject) => {
                if (document.querySelector(`script[src="${src}"]`)) {
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

    // 3. Initialize Animations
    useEffect(() => {
        if (!engineLoaded || !window.gsap || !window.ScrollTrigger) return;

        if (scroller === undefined && scroller !== null) {
            return;
        }

        const gsap = window.gsap;
        const ScrollTrigger = window.ScrollTrigger;
        gsap.registerPlugin(ScrollTrigger);

        let activeScroller: HTMLElement | Window = window;
        if (scroller) {
            if (typeof scroller === 'string') {
                const el = document.querySelector<HTMLElement>(scroller);
                if (el) activeScroller = el;
            } else {
                activeScroller = scroller;
            }
        } else if (containerRef.current) {
            let current = containerRef.current.parentElement;
            while (current) {
                const overflowY = window.getComputedStyle(current).overflowY;
                if (overflowY === 'auto' || overflowY === 'scroll') {
                    activeScroller = current;
                    break;
                }
                current = current.parentElement;
            }
        }

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
                        scroller: activeScroller,
                        start: `top ${stickyTop}`,
                        end: `bottom ${stickyTop}`,
                        scrub: true,
                    },
                });

                if (overlay) {
                    gsap.to(overlay, {
                        opacity: 0.6,
                        ease: 'none',
                        scrollTrigger: {
                            trigger: card,
                            scroller: activeScroller,
                            start: `top ${stickyTop}`,
                            end: `bottom ${stickyTop}`,
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
            className={`font-sans opacity-0 transition-opacity duration-1000 relative selection:bg-current selection:text-black ${className}`}
            style={{
                color: textColor,
                ['--selection-bg' as any]: accentColor,
                ['--selection-text' as any]: '#000000'
            }}
        >
            {/* Header Text */}
            {headerText && (
                <div className="pt-20 pb-10 flex flex-col items-center justify-center w-full text-white/50 select-none">
                    <h1 className="text-[clamp(2rem,5vw,4rem)] font-bold tracking-tighter uppercase opacity-50 text-center">
                        {headerText}
                    </h1>
                    <div className="mt-8 w-px h-24 bg-gradient-to-b from-current to-transparent opacity-20" />
                </div>
            )}

            {/* --- Cards Section --- */}
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
                            height: isNarrow ? '460px' : cardHeight,
                            minHeight: '300px',
                            perspective: '1500px',
                            paddingTop: `${index * 1}rem`,
                        }}
                    >
                        <div
                            className={`card-content w-full h-full flex overflow-hidden shadow-2xl transition-shadow duration-500 ${isNarrow ? "flex-col p-6 gap-2" : "flex-row p-0 gap-0"
                                }`}
                            style={{
                                backgroundColor: card.bg,
                                color: card.text,
                                borderRadius: borderRadius,
                                transformOrigin: '50% 50%',
                                willChange: 'transform',
                            }}
                        >
                            {/* Left Pane: Numbers & Vertical Text */}
                            <div
                                className={`flex justify-between ${isNarrow
                                        ? "w-full flex-row items-center border-b border-black/5 pb-2 shrink-0"
                                        : "w-1/4 p-8 flex-col items-center"
                                    }`}
                            >
                                <span className={`font-black tracking-tighter leading-none opacity-90 ${isNarrow ? "text-3xl" : "text-6xl"}`}>
                                    {card.num}
                                </span>

                                <span className={`tracking-[0.4em] uppercase font-bold opacity-50 ${isNarrow ? "text-[10px]" : "text-sm -rotate-180 [writing-mode:vertical-rl]"}`}>
                                    {card.label}
                                </span>
                            </div>

                            {/* Right Pane: Content */}
                            <div className={`flex flex-col justify-center relative ${isNarrow ? "w-full p-2 pt-4 flex-1" : "w-3/4 p-12 lg:p-16"}`}>
                                <div className="absolute right-0 bottom-0 w-48 h-48 rounded-full mix-blend-overlay opacity-20 pointer-events-none blur-3xl transform translate-x-1/3 translate-y-1/3" style={{ backgroundColor: card.text }} />

                                <h2 className={`font-bold tracking-tight leading-[1.1] relative z-10 ${isNarrow ? "text-xl mb-3" : "text-2xl md:text-4xl lg:text-5xl mb-6"}`}>
                                    {card.title}
                                </h2>
                                <p className={`leading-relaxed opacity-80 font-medium relative z-10 ${isNarrow ? "text-xs line-clamp-4" : "text-sm md:text-lg max-w-xl"}`}>
                                    {card.desc}
                                </p>

                                <div className={`flex items-center gap-3 cursor-pointer group relative z-10 w-max ${isNarrow ? "mt-4" : "mt-8"}`}>
                                    <span className="text-xs font-bold uppercase tracking-widest group-hover:pr-2 transition-all">Explore</span>
                                    <div className="w-6 h-[1.5px] bg-current transform origin-left group-hover:scale-x-150 transition-transform" />
                                </div>
                            </div>

                            <div className="card-overlay absolute inset-0 bg-black pointer-events-none opacity-0 z-50 rounded-[inherit]" />
                        </div>
                    </li>
                ))}
            </ul>

            {/* Footer Text */}
            {footerText && (
                <div className="pt-10 pb-20 flex flex-col items-center text-white/50 select-none">
                    <div className="mb-8 w-px h-24 bg-gradient-to-t from-current to-transparent opacity-20" />
                    <h1 className="text-[clamp(1.5rem,4vw,3rem)] font-bold uppercase tracking-widest opacity-50 text-center">
                        {footerText}
                    </h1>
                </div>
            )}

            <style jsx global>{`
                ::selection {
                    background: var(--selection-bg);
                    color: var(--selection-text);
                }
            `}</style>
        </div>
    );
}