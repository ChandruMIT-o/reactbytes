import React, { useState, useEffect, useRef, useMemo } from 'react';

// --- TYPES ---
export type ItemType = 'text' | 'card' | 'image';

export interface CarouselItem {
    id: string;
    type: ItemType;
    content: string; // Text string or Image URL
    title?: string;
    subtitle?: string;
    coords?: [number, number];
}

export interface BrutalZCarouselProps {
    items: CarouselItem[];
    zGap?: number;
    speedFactor?: number;
    lerpFactor?: number;
    warpFactor?: number;
    basePerspective?: number;
    starCount?: number;
    enableSnap?: boolean;
    enableNoise?: boolean;
    activeZ?: number;
    opacityFade?: number;
    theme?: {
        bg: string;
        cardBg: string;
        text: string;
        accent: string;
        border: string;
    };
}


// --- MOCK DATA ---
const DEFAULT_ITEMS: CarouselItem[] = [
    { id: '1', type: 'text', content: 'SYSTEM' },
    { id: '2', type: 'image', content: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop', title: 'NEURAL NET', subtitle: 'v2.0.4' },
    { id: '3', type: 'card', content: 'BRUTAL', title: 'INTERFACE', coords: [45, 92] },
    { id: '4', type: 'text', content: 'DESIGN' },
    { id: '5', type: 'image', content: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800&auto=format&fit=crop', title: 'CYBER CORE', subtitle: 'Online' },
    { id: '6', type: 'card', content: 'MOTION', title: 'DYNAMICS', coords: [12, 33] },
    { id: '7', type: 'text', content: 'FUTURE' },
    { id: '8', type: 'image', content: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=800&auto=format&fit=crop', title: 'DATA NODE', subtitle: 'Encrypted' },
    { id: '9', type: 'card', content: 'IMPACT', title: 'VELOCITY', coords: [88, 11] },
    { id: '10', type: 'text', content: 'VISION' },
    { id: '11', type: 'image', content: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?q=80&w=800&auto=format&fit=crop', title: 'FLUX COMPENSATOR', subtitle: 'Active' },
    { id: '12', type: 'card', content: 'CRAFT', title: 'STRUCTURE', coords: [76, 44] },
];

const DEFAULT_THEME = {
    bg: '#000000',
    cardBg: 'rgba(10, 10, 10, 0.6)',
    text: '#ffffff',
    accent: '#ff003c',
    border: 'rgba(255, 255, 255, 0.15)',
};

// --- MAIN CAROUSEL COMPONENT ---
export const BrutalZCarousel: React.FC<BrutalZCarouselProps> = ({
    items,
    zGap = 600,
    speedFactor = 2.5,
    lerpFactor = 0.08,
    warpFactor = 2.0,
    basePerspective = 800,
    starCount = 100,
    enableSnap = false,
    enableNoise = true,
    activeZ = 0,
    opacityFade = 400,
    theme = DEFAULT_THEME,
}) => {

    const containerRef = useRef<HTMLDivElement>(null);
    const viewportRef = useRef<HTMLDivElement>(null);
    const worldRef = useRef<HTMLDivElement>(null);
    const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
    const starRefs = useRef<(HTMLDivElement | null)[]>([]);

    // Engine state (not React state, to avoid re-renders during rAF loop)
    const engine = useRef({
        targetScroll: 0,
        currentScroll: 0,
        velocity: 0,
        isInteracting: false,
        interactionTimeout: null as NodeJS.Timeout | null,
    });

    const itemCount = items.length;
    const loopSize = itemCount * zGap;

    // 1. Generate Static Positions for Items and Stars
    const itemData = useMemo(() => {
        return items.map((item, i) => {
            return {
                ...item,
                x: (Math.random() - 0.5) * (typeof window !== 'undefined' ? window.innerWidth : 1000) * 0.7,
                y: (Math.random() - 0.5) * (typeof window !== 'undefined' ? window.innerHeight : 800) * 0.7,
                rotZ: (Math.random() - 0.5) * 25,
                baseZ: -i * zGap,
            };
        });
    }, [items, itemCount, zGap]);

    const starData = useMemo(() => {
        const stars = [];
        for (let i = 0; i < starCount; i++) {
            stars.push({
                x: (Math.random() - 0.5) * 3000,
                y: (Math.random() - 0.5) * 3000,
                baseZ: -(Math.random() * loopSize),
            });
        }
        return stars;
    }, [starCount, loopSize]);

    // 2. Virtual Scroll Handling
    useEffect(() => {
        const handleWheel = (e: WheelEvent) => {
            e.preventDefault();
            engine.current.targetScroll += e.deltaY;
            markInteraction();
        };

        let touchStartY = 0;
        const handleTouchStart = (e: TouchEvent) => {
            touchStartY = e.touches[0].clientY;
            markInteraction();
        };

        const handleTouchMove = (e: TouchEvent) => {
            const touchY = e.touches[0].clientY;
            const deltaY = touchStartY - touchY;
            engine.current.targetScroll += deltaY * 2.5;
            touchStartY = touchY;
            markInteraction();
        };

        const markInteraction = () => {
            engine.current.isInteracting = true;
            if (engine.current.interactionTimeout) clearTimeout(engine.current.interactionTimeout);
            engine.current.interactionTimeout = setTimeout(() => {
                engine.current.isInteracting = false;
            }, 150);
        };

        const container = containerRef.current;
        if (!container) return;

        container.addEventListener('wheel', handleWheel, { passive: false });
        container.addEventListener('touchstart', handleTouchStart, { passive: false });
        container.addEventListener('touchmove', handleTouchMove, { passive: false });

        return () => {
            container.removeEventListener('wheel', handleWheel);
            container.removeEventListener('touchstart', handleTouchStart);
            container.removeEventListener('touchmove', handleTouchMove);
            if (engine.current.interactionTimeout) clearTimeout(engine.current.interactionTimeout);
        };
    }, []);

    // 3. Render Loop (requestAnimationFrame)
    useEffect(() => {
        let animationFrameId: number;

        const renderLoop = () => {
            const state = engine.current;

            const diff = state.targetScroll - state.currentScroll;
            state.currentScroll += diff * lerpFactor;

            const rawVel = diff * lerpFactor;
            state.velocity += (rawVel - state.velocity) * 0.1;

            // --- SNAPPING LOGIC ---
            if (enableSnap && !state.isInteracting && Math.abs(state.velocity) < 2.0 && Math.abs(diff) < 15) {
                const snapInterval = zGap / speedFactor;
                const nearestSnap = Math.round(state.targetScroll / snapInterval) * snapInterval;
                state.targetScroll = nearestSnap;
            }

            // --- APPLY GLOBAL EFFECTS ---
            if (viewportRef.current) {
                const warp = Math.min(Math.abs(state.velocity) * warpFactor, basePerspective - 100);
                viewportRef.current.style.perspective = `${basePerspective - warp}px`;
            }

            if (worldRef.current) {
                const tilt = state.velocity * 0.05;
                worldRef.current.style.transform = `rotateX(${-tilt}deg)`;
            }

            const currentDist = state.currentScroll * speedFactor;

            // --- UPDATE ITEMS ---
            itemData.forEach((item, i) => {
                const el = itemRefs.current[i];
                if (!el) return;

                let z = item.baseZ + currentDist;
                const offset = z % loopSize;
                let vizZ = offset;

                const forwardLimit = activeZ + 500;
                if (vizZ > forwardLimit) vizZ -= loopSize;
                if (vizZ < -loopSize + forwardLimit) vizZ += loopSize;
                while (vizZ > forwardLimit) vizZ -= loopSize;

                let alpha = 1;
                const maxDist = -loopSize * 0.75;

                if (vizZ < maxDist) {
                    alpha = 0;
                } else if (vizZ < maxDist + 1500) {
                    alpha = (vizZ - maxDist) / 1500;
                }

                if (vizZ > activeZ + 100) {
                    alpha = 1 - (vizZ - (activeZ + 100)) / opacityFade;
                }

                alpha = Math.max(0, Math.min(1, alpha));
                el.style.opacity = alpha.toString();

                if (alpha > 0) {
                    const absDist = Math.abs(vizZ - activeZ);
                    let focusFactor = 0;

                    if (enableSnap) {
                        const lockZone = 80;
                        const easeZone = 400;

                        if (absDist < lockZone) {
                            focusFactor = 1;
                        } else if (absDist < easeZone) {
                            const progress = 1 - ((absDist - lockZone) / (easeZone - lockZone));
                            focusFactor = progress * progress * (3 - 2 * progress);
                        }
                    }

                    const floatRot = Math.sin(Date.now() * 0.001 + item.baseZ) * 4;

                    const currentX = item.x * (1 - focusFactor);
                    const currentY = item.y * (1 - focusFactor);
                    const currentRot = (item.rotZ + floatRot) * (1 - focusFactor);

                    el.style.transform = `
            translate3d(${currentX}px, ${currentY}px, ${vizZ}px) 
            rotateZ(${currentRot}deg)
          `;

                    if (enableSnap && absDist < 50 && alpha > 0.8) {
                        el.style.zIndex = '100';
                        el.style.filter = 'brightness(1.2)';
                    } else {
                        el.style.zIndex = '1';
                        el.style.filter = 'brightness(1)';
                    }
                }
            });

            // --- UPDATE STARS ---
            starData.forEach((star, i) => {
                const el = starRefs.current[i];
                if (!el) return;

                let z = star.baseZ + currentDist;
                const offset = z % loopSize;
                let vizZ = offset;

                const forwardLimit = activeZ + 500;
                if (vizZ > forwardLimit) vizZ -= loopSize;
                if (vizZ < -loopSize + forwardLimit) vizZ += loopSize;
                while (vizZ > forwardLimit) vizZ -= loopSize;

                const stretch = Math.max(1, Math.min(1 + Math.abs(state.velocity) * 0.05, 10));

                el.style.transform = `translate3d(${star.x}px, ${star.y}px, ${vizZ}px) scale3d(1, ${stretch}, 1)`;
                el.style.opacity = vizZ > activeZ ? (1 - (vizZ - activeZ) / 500).toString() : '0.6';
            });

            animationFrameId = requestAnimationFrame(renderLoop);
        };

        animationFrameId = requestAnimationFrame(renderLoop);
        return () => cancelAnimationFrame(animationFrameId);
    }, [itemData, starData, zGap, speedFactor, lerpFactor, warpFactor, basePerspective, loopSize, enableSnap, activeZ, opacityFade]);


    // --- RENDERERS ---
    const renderItem = (item: CarouselItem, index: number) => {
        if (item.type === 'text') {
            return (
                <div
                    key={`item-${index}`}
                    ref={(el) => { itemRefs.current[index] = el; }}
                    className="absolute left-0 top-0 flex items-center justify-center pointer-events-none"
                    style={{ transformOrigin: 'center center', backfaceVisibility: 'hidden' }}
                >
                    <div
                        className="text-[12vw] font-black uppercase whitespace-nowrap -translate-x-1/2 -translate-y-1/2"
                        style={{
                            color: 'transparent',
                            WebkitTextStroke: `2px ${theme.border}`,
                            lineHeight: 0.8
                        }}
                    >
                        {item.content}
                    </div>
                </div>
            );
        }

        if (item.type === 'image') {
            return (
                <div
                    key={`item-${index}`}
                    ref={(el) => { itemRefs.current[index] = el; }}
                    className="absolute left-0 top-0 flex items-center justify-center transition-colors duration-300"
                    style={{ transformOrigin: 'center center', backfaceVisibility: 'hidden' }}
                >
                    <div
                        className="w-[320px] h-[460px] overflow-hidden -translate-x-1/2 -translate-y-1/2 flex flex-col relative group cursor-pointer"
                        style={{
                            background: theme.cardBg,
                            border: `1px solid ${theme.border}`,
                            boxShadow: '0 0 40px rgba(0,0,0,0.9)'
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.borderColor = theme.accent)}
                        onMouseLeave={(e) => (e.currentTarget.style.borderColor = theme.border)}
                    >
                        <div className="absolute inset-0 z-0">
                            <img src={item.content} alt={item.title} className="w-full h-full object-cover opacity-60 group-hover:opacity-90 group-hover:scale-105 transition-all duration-700" />
                        </div>
                        <div className="relative z-10 p-6 flex flex-col h-full bg-gradient-to-t from-black/80 via-transparent to-black/40">
                            <div className="font-mono text-xs inline-block px-2 py-1 self-start mb-4 bg-black/50 backdrop-blur-sm" style={{ color: theme.accent, border: `1px solid ${theme.accent}` }}>
                                IMG_{index.toString().padStart(3, '0')}
                            </div>
                            <div className="mt-auto">
                                <h2 className="text-3xl font-black uppercase tracking-tighter leading-none m-0" style={{ color: theme.text }}>
                                    {item.title}
                                </h2>
                                {item.subtitle && <p className="mt-2 text-sm text-gray-400 font-mono">{item.subtitle}</p>}
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div
                key={`item-${index}`}
                ref={(el) => { itemRefs.current[index] = el; }}
                className="absolute left-0 top-0 flex items-center justify-center transition-colors duration-300"
                style={{ transformOrigin: 'center center', backfaceVisibility: 'hidden' }}
            >
                <div
                    className="w-[300px] h-[420px] p-8 flex flex-col justify-between -translate-x-1/2 -translate-y-1/2 backdrop-blur-md cursor-pointer hover:scale-105 transition-transform"
                    style={{
                        background: theme.cardBg,
                        border: `1px solid ${theme.border}`,
                        boxShadow: '0 0 30px rgba(0,0,0,0.8)'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.borderColor = theme.accent)}
                    onMouseLeave={(e) => (e.currentTarget.style.borderColor = theme.border)}
                >
                    <div className="font-mono text-[0.8rem] inline-block px-2 py-1 self-start mb-5" style={{ color: theme.accent, border: `1px solid ${theme.accent}` }}>
                        0{index}
                    </div>
                    <h2 className="text-[3rem] leading-[0.85] m-0 uppercase font-black tracking-tight" style={{ color: theme.text }}>
                        {item.content}
                    </h2>
                    <p className="font-mono text-xs mt-auto" style={{ color: theme.border }}>
                        COORD: [{item.coords?.[0] || '00'}, {item.coords?.[1] || '00'}]<br />
                        SYS.OP.READY
                    </p>
                </div>
            </div>
        );
    };

    return (
        <div ref={containerRef} className="w-full h-full overflow-hidden relative font-sans select-none" style={{ background: theme.bg, color: theme.text }}>

            <div className="absolute inset-0 z-10 pointer-events-none" style={{ background: 'radial-gradient(circle at center, transparent 0%, #000 90%)' }} />

            {enableNoise && (
                <div
                    className="absolute inset-0 z-20 pointer-events-none opacity-30 mix-blend-overlay"
                    style={{ backgroundImage: `url('data:image/svg+xml;utf8,%3Csvg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noiseFilter"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch"/%3E%3C/filter%3E%3Crect width="100%25" height="100%25" filter="url(%23noiseFilter)"/%3E%3C/svg%3E')` }}
                />
            )}

            <div
                ref={viewportRef}
                className="absolute inset-0 z-0 overflow-hidden"
                style={{ perspective: `${basePerspective}px` }}
            >
                <div
                    ref={worldRef}
                    className="absolute top-1/2 left-1/2 w-full h-full"
                    style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}
                >
                    {itemData.map((item, i) => renderItem(item, i))}

                    {starData.map((_, i) => (
                        <div
                            key={`star-${i}`}
                            ref={(el) => { starRefs.current[i] = el; }}
                            className="absolute w-[3px] h-[3px] rounded-full bg-white top-0 left-0 -translate-x-1/2 -translate-y-1/2"
                            style={{ boxShadow: '0 0 8px rgba(255,255,255,0.8)' }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

// --- IMMERSIVE APP LAYER ---
export default function App() {
    return (
        <div className="relative w-full h-screen bg-black">
            <BrutalZCarousel
                items={DEFAULT_ITEMS}
                zGap={800}
                speedFactor={3.0}
                warpFactor={2.0}
                basePerspective={800}
                lerpFactor={0.1}
                activeZ={0}
                opacityFade={400}
                enableSnap={true}
            />
        </div>
    );
}