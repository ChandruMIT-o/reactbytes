import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";

export interface StackedCarouselCard {
    id: number;
    title: string;
    image: string;
    content: string;
}

interface StackedCarouselProps {
    items?: StackedCarouselCard[];
    autoRotateInterval?: number;
    showPagination?: boolean;
    className?: string;
}

const defaultCards: StackedCarouselCard[] = [
    {
        id: 1,
        title: "Production-ready",
        image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop",
        content: "Typed, accessible, dark mode and reduced-motion ready. Paste and ship.",
    },
    {
        id: 2,
        title: "Beautifully Crafted",
        image: "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=2670&auto=format&fit=crop",
        content: "Carefully designed with attention to every pixel. Built for modern interfaces.",
    },
    {
        id: 3,
        title: "Highly Performant",
        image: "https://images.unsplash.com/photo-1635776062127-d379bfcba9f8?q=80&w=2532&auto=format&fit=crop",
        content: "Optimized for speed and fluid interactions. 60fps animations out of the box.",
    },
];

export default function StackedCarousel({
    items = defaultCards,
    autoRotateInterval = 5000,
    showPagination = true,
    className = "",
}: StackedCarouselProps) {
    const [active, setActive] = useState(0);
    const [progress, setProgress] = useState(0);
    const rafRef = useRef<number | null>(null);

    // Generate random configuration for the gooey blobs only once on mount
    // so the animations don't reset or jitter during the 60fps re-renders.
    const randomBlobs = useMemo(() => {
        return items.map(() =>
            Array.from({ length: 4 }).map((_, i) => {
                const baseCx = i * 28 + 8; // Spread out across the ~100px width
                const r = 12 + Math.random() * 8; // Random radius between 12 and 20
                const moveX = 10 + Math.random() * 10;
                const moveY = 6 + Math.random() * 8;
                return {
                    id: i,
                    r,
                    baseCx,
                    durX: `${(2.5 + Math.random() * 2).toFixed(2)}s`, // Random speed 2.5s - 4.5s
                    durY: `${(2 + Math.random() * 2).toFixed(2)}s`,   // Random speed 2s - 4s
                    valX: `${baseCx}; ${baseCx + moveX}; ${baseCx - moveX / 2}; ${baseCx}`, // Random horizontal wandering
                    valY: `0; -${moveY}; ${moveY / 3}; 0`, // Random vertical splashing
                };
            })
        );
    }, [items]);

    const rotate = useCallback(() => {
        setActive((prev) => (prev + 1) % items.length);
    }, [items.length]);

    useEffect(() => {
        let startTime = performance.now();

        const tick = (now: DOMHighResTimeStamp) => {
            const elapsed = now - startTime;
            const percent = (elapsed / autoRotateInterval) * 100;

            if (percent >= 100) {
                rotate();
            } else {
                setProgress(percent);
                rafRef.current = requestAnimationFrame(tick);
            }
        };

        rafRef.current = requestAnimationFrame(tick);

        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, [active, autoRotateInterval, rotate]);

    return (
        <div className={`flex flex-col items-center justify-center w-full h-full font-sans ${className}`}>

            {/* Main Stack Container */}
            <div
                onClick={rotate}
                className="relative w-full max-w-[800px] h-[480px] md:h-[400px] cursor-pointer group perspective-1000"
            >
                {items.map((card, i) => {
                    // Circular offset calculation for a "centered" stack
                    let offset = i - active;
                    if (offset > items.length / 2) offset -= items.length;
                    if (offset < -items.length / 2) offset += items.length;

                    const absOffset = Math.abs(offset);
                    const isActive = offset === 0;

                    return (
                        <div
                            key={card.id}
                            className="absolute inset-0 w-full h-full rounded-[2rem] overflow-hidden shadow-2xl border border-white/[0.08] bg-[#121214] select-none flex flex-col md:flex-row p-8 md:p-10 gap-8 md:gap-12"
                            style={{
                                transform: `translateY(${offset * -24}px) scale(${1 - absOffset * 0.04})`,
                                opacity: 1 - absOffset * 0.35,
                                zIndex: 10 - absOffset + (offset > 0 ? 0.1 : 0), // Subtle bias for stable stacking
                                transition: "all 600ms cubic-bezier(0.34, 1.15, 0.64, 1)",
                            }}
                        >
                            {/* SVG Wavy, Gooey Random Liquid Number */}
                            <div className="absolute top-6 left-8 md:top-8 md:left-10 w-[100px] h-[80px] md:w-[130px] md:h-[100px] pointer-events-none select-none">
                                <svg viewBox="0 0 100 80" className="w-full h-full overflow-visible font-sans">
                                    <defs>
                                        <clipPath id={`clip-${card.id}`}>
                                            <text x="0" y="72" fontSize="76" fontWeight="900" letterSpacing="-0.05em">0{i + 1}</text>
                                        </clipPath>

                                        <filter id={`goo-${card.id}`}>
                                            <feGaussianBlur in="SourceGraphic" stdDeviation="3.5" result="blur" />
                                            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 15 -5" result="goo" />
                                        </filter>

                                        <filter id={`soften-${card.id}`}>
                                            <feGaussianBlur stdDeviation="1.5" />
                                        </filter>

                                        <mask id={`liquid-mask-${card.id}`}>
                                            <g filter={`url(#goo-${card.id})`}>
                                                <g style={{ transform: `translateY(${100 - (isActive ? progress : 0) * 1.1}px)` }}>
                                                    <rect x="-20" y="0" width="140" height="120" fill="white" />
                                                    {randomBlobs[i]?.map((blob) => (
                                                        <circle key={blob.id} cx={blob.baseCx} cy="0" r={blob.r} fill="white">
                                                            <animate attributeName="cy" values={blob.valY} dur={blob.durY} repeatCount="indefinite" />
                                                            <animate attributeName="cx" values={blob.valX} dur={blob.durX} repeatCount="indefinite" />
                                                        </circle>
                                                    ))}
                                                </g>
                                            </g>
                                        </mask>
                                    </defs>

                                    <text x="0" y="72" fontSize="76" fontWeight="900" letterSpacing="-0.05em" fill="rgba(255,255,255,0.04)">
                                        0{i + 1}
                                    </text>

                                    <g clipPath={`url(#clip-${card.id})`} filter={`url(#soften-${card.id})`}>
                                        <rect
                                            x="-10"
                                            y="-20"
                                            width="120"
                                            height="120"
                                            fill="rgba(255, 255, 255, 0.25)"
                                            mask={`url(#liquid-mask-${card.id})`}
                                        />
                                    </g>
                                </svg>
                            </div>

                            <div className="flex-1 flex flex-col justify-end relative z-10 mt-16 md:mt-0">
                                <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white mb-3">
                                    {card.title}
                                </h2>
                                <p className="text-sm md:text-base text-zinc-400 leading-relaxed max-w-[280px]">
                                    {card.content}
                                </p>
                            </div>

                            <div className="flex-[1.2] relative w-full h-full min-h-[180px] bg-[#1a1a1c] rounded-2xl border border-white/[0.05] p-2 flex items-center justify-center overflow-hidden shadow-inner">
                                <div className="absolute inset-0 bg-gradient-to-br from-zinc-800/10 to-transparent pointer-events-none z-10" />
                                <img
                                    src={card.image}
                                    alt={card.title}
                                    className="w-full h-full object-cover rounded-xl opacity-50 mix-blend-luminosity transition-all duration-700 group-hover:opacity-80 group-hover:mix-blend-normal group-hover:scale-105"
                                />
                            </div>
                        </div>
                    );
                })}
            </div>

            {showPagination && (
                <div className="flex items-center gap-2 mt-12 md:mt-16">
                    {items.map((_, i) => (
                        <div
                            key={i}
                            className={`h-1.5 rounded-full transition-all duration-500 cubic-bezier(0.34, 1.15, 0.64, 1) ${i === active ? "w-8 bg-zinc-200" : "w-2 bg-zinc-700"
                                }`}
                        />
                    ))}
                </div>
            )}

        </div>
    );
}