"use client";

import React, { useState, useEffect, useRef } from 'react';

// --- Types & Data ---
export interface ListCarouselItem {
    id: number;
    title: string;
    image: string;
}

export interface ListCarouselProps {
    items?: ListCarouselItem[];
    defaultBg?: string;
    className?: string;
    // --- Behavior & Performance Props ---
    scrollLerpFactor?: number;      // Speed of scroll smoothing (0.01 - 1)
    cursorLerpFactor?: number;      // Speed of cursor lag smoothing (0.01 - 1)
    maxCursorRotation?: number;     // Max angle variation for image preview on hover
    // --- UI & Style Customization Props ---
    enableNoise?: boolean;          // Toggle SVG noise overlay
    noiseOpacity?: number;          // Opacity of the grain overlay

    // --- Value-based Background Atmosphere Props ---
    idleOpacity?: number;
    idleBlur?: number;              // in pixels
    idleScale?: number;
    idleGrayscale?: boolean;
    hoverOpacity?: number;
    hoverBlur?: number;             // in pixels
    hoverScale?: number;
    hoverGrayscale?: boolean;

    // --- Value-based Font and Style Props ---
    titleSize?: "xs" | "sm" | "md" | "lg" | "xl";
    titleWeight?: "light" | "normal" | "medium" | "semibold" | "bold" | "black";
    titleTracking?: "tighter" | "tight" | "normal" | "wide" | "wider" | "widest";
    titleTransform?: "none" | "uppercase" | "lowercase" | "capitalize";
    titleStyle?: "normal" | "italic";
    titleColor?: string;
    titleHoverColor?: string;

    // --- Value-based Index Props ---
    indexSize?: "xxs" | "xs" | "sm" | "md";
    indexFont?: "mono" | "sans" | "serif";
    indexTracking?: "normal" | "wide" | "wider" | "widest";
    enableIndexBg?: boolean;
    indexOpacity?: number;

    // --- Layout Margin Props ---
    paddingY?: number;              // Vertical padding in vh units
}

const NEW_DEFAULT_PROJECTS: ListCarouselItem[] = [
    { id: 1, title: "Transient Architecture", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80" },
    { id: 2, title: "Echoes of Minimalism", image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80" },
    { id: 3, title: "Monolithic Shadows", image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80" },
    { id: 4, title: "The Brutalist Framework", image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80" },
    { id: 5, title: "Subterranean Geometry", image: "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=800&q=80" },
    { id: 6, title: "Tactile Concrete", image: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=800&q=80" },
    { id: 7, title: "Kinetic Perspectives", image: "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=800&q=80" },
    { id: 8, title: "Silent Textures", image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80" },
];

const NEW_DEFAULT_BG = "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=80";
const EASING = "cubic-bezier(0.16, 1, 0.3, 1)"; // Ultra slick out-quint easing

// --- Typography Option Maps ---
const TITLE_SIZE_MAP = {
    xs: "text-xs sm:text-sm md:text-lg lg:text-2xl",
    sm: "text-sm sm:text-base md:text-xl lg:text-3xl",
    md: "text-base sm:text-lg md:text-2xl lg:text-4xl",
    lg: "text-lg sm:text-xl md:text-3xl lg:text-5xl",
    xl: "text-xl sm:text-2xl md:text-4xl lg:text-6xl",
};

const TITLE_WEIGHT_MAP = {
    light: "font-light",
    normal: "font-normal",
    medium: "font-medium",
    semibold: "font-semibold",
    bold: "font-bold",
    black: "font-black",
};

const TITLE_TRACKING_MAP = {
    tighter: "tracking-tighter",
    tight: "tracking-tight",
    normal: "tracking-normal",
    wide: "tracking-wide",
    wider: "tracking-wider",
    widest: "tracking-[0.18em]",
};

const TITLE_TRANSFORM_MAP = {
    none: "normal-case",
    uppercase: "uppercase",
    lowercase: "lowercase",
    capitalize: "capitalize",
};

const TITLE_STYLE_MAP = {
    normal: "not-italic",
    italic: "italic",
};

const INDEX_SIZE_MAP = {
    xxs: "text-[11px]",
    xs: "text-[10px] md:text-xs",
    sm: "text-xs md:text-sm",
    md: "text-sm md:text-base",
};

const INDEX_FONT_MAP = {
    mono: "font-mono",
    sans: "font-sans",
    serif: "font-serif",
};

const INDEX_TRACKING_MAP = {
    normal: "tracking-normal",
    wide: "tracking-wide",
    wider: "tracking-wider",
    widest: "tracking-widest",
};

export const ListCarousel: React.FC<ListCarouselProps> = ({
    items = NEW_DEFAULT_PROJECTS,
    defaultBg = NEW_DEFAULT_BG,
    className = "",
    scrollLerpFactor = 0.09,
    cursorLerpFactor = 0.12,
    maxCursorRotation = 10,
    enableNoise = true,
    noiseOpacity = 0.18,
    idleOpacity = 0.2,
    idleBlur = 4,
    idleScale = 1.0,
    idleGrayscale = false,
    hoverOpacity = 0.5,
    hoverBlur = 0,
    hoverScale = 1.0,
    hoverGrayscale = false,
    titleSize = "md",
    titleWeight = "bold",
    titleTracking = "tight",
    titleTransform = "none",
    titleStyle = "normal",
    titleColor = "#eaeaea",
    titleHoverColor = "#eaeaea",
    indexSize = "sm",
    indexFont = "mono",
    indexTracking = "wider",
    enableIndexBg = false,
    indexOpacity = 0.4,
    paddingY = 15,
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const cursorRef = useRef<HTMLDivElement>(null);
    const mainRef = useRef<HTMLDivElement>(null);

    // State
    const [activeImage, setActiveImage] = useState(defaultBg);
    const [isHovered, setIsHovered] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [cursorRotation, setCursorRotation] = useState(0);
    const [hoveredImage, setHoveredImage] = useState<string | null>(null);

    // Animation values for Lerping
    const scrollTargetY = useRef(0);
    const scrollCurrentY = useRef(0);
    const cursorTarget = useRef({ x: 0, y: 0 });
    const cursorCurrent = useRef({ x: 0, y: 0 });
    const isTouchDevice = useRef(false);

    // Initial Mount Check
    useEffect(() => {
        setMounted(true);
        isTouchDevice.current = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    }, []);

    // Main RequestAnimationFrame Loop for buttery smooth movement
    useEffect(() => {
        let rafId: number;

        const renderLoop = () => {
            // 1. Smooth Scroll lerping
            scrollCurrentY.current += (scrollTargetY.current - scrollCurrentY.current) * scrollLerpFactor;
            if (containerRef.current) {
                containerRef.current.style.transform = `translate3d(0, ${scrollCurrentY.current}px, 0)`;
            }

            // 2. Custom Cursor lerping (Desktop Only)
            if (!isTouchDevice.current && cursorRef.current) {
                cursorCurrent.current.x += (cursorTarget.current.x - cursorCurrent.current.x) * cursorLerpFactor;
                cursorCurrent.current.y += (cursorTarget.current.y - cursorCurrent.current.y) * cursorLerpFactor;
                // Perfectly centers the 260x180 preview frame
                cursorRef.current.style.transform = `translate3d(${cursorCurrent.current.x - 130}px, ${cursorCurrent.current.y - 90}px, 0)`;
            }

            rafId = requestAnimationFrame(renderLoop);
        };

        renderLoop();
        return () => cancelAnimationFrame(rafId);
    }, [scrollLerpFactor, cursorLerpFactor]);

    // Track input interactions smoothly
    useEffect(() => {
        const handleMove = (e: MouseEvent | TouchEvent) => {
            if (!mainRef.current) return;

            const rect = mainRef.current.getBoundingClientRect();
            const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
            const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

            const relX = clientX - rect.left;
            const relY = clientY - rect.top;

            cursorTarget.current = { x: relX, y: relY };

            const ch = containerRef.current?.scrollHeight || 0;
            const vh = rect.height;

            if (ch > vh) {
                const percentY = Math.max(0, Math.min(1, relY / vh));
                const edgeMargin = vh * 0.08; // Configured margin padding
                const maxScroll = ch - vh + edgeMargin * 2;
                scrollTargetY.current = edgeMargin - (percentY * maxScroll);
            } else {
                scrollTargetY.current = (vh - ch) / 2; // Center elements if view context is shorter
            }
        };

        window.addEventListener('mousemove', handleMove);
        window.addEventListener('touchmove', handleMove, { passive: true });

        return () => {
            window.removeEventListener('mousemove', handleMove);
            window.removeEventListener('touchmove', handleMove);
        };
    }, [mounted]);

    // Hover Handlers
    const handleProjectEnter = (image: string) => {
        setActiveImage(image);
        setIsHovered(true);
        setHoveredImage(image);
        setCursorRotation((Math.random() - 0.5) * maxCursorRotation);
    };

    const handleProjectLeave = () => {
        setIsHovered(false);
        setHoveredImage(null);
    };

    const handleContainerLeave = () => {
        setActiveImage(defaultBg);
    };

    // Calculate background properties
    const bgOpacity = isHovered ? hoverOpacity : idleOpacity;
    const bgBlur = isHovered ? hoverBlur : idleBlur;
    const bgScale = isHovered ? hoverScale : idleScale;
    const bgGrayscale = isHovered ? (hoverGrayscale ? 100 : 0) : (idleGrayscale ? 100 : 0);

    // Map style classes
    const titleSizeClass = TITLE_SIZE_MAP[titleSize] || TITLE_SIZE_MAP.md;
    const titleWeightClass = TITLE_WEIGHT_MAP[titleWeight] || TITLE_WEIGHT_MAP.bold;
    const titleTrackingClass = TITLE_TRACKING_MAP[titleTracking] || TITLE_TRACKING_MAP.tight;
    const titleTransformClass = TITLE_TRANSFORM_MAP[titleTransform] || TITLE_TRANSFORM_MAP.none;
    const titleStyleClass = TITLE_STYLE_MAP[titleStyle] || TITLE_STYLE_MAP.normal;

    const indexSizeClass = INDEX_SIZE_MAP[indexSize] || INDEX_SIZE_MAP.sm;
    const indexFontClass = INDEX_FONT_MAP[indexFont] || INDEX_FONT_MAP.mono;
    const indexTrackingClass = INDEX_TRACKING_MAP[indexTracking] || INDEX_TRACKING_MAP.wider;
    const indexBgClass = enableIndexBg ? "bg-white/10 px-1 py-0.5 rounded-none" : "";

    return (
        <div
            ref={mainRef}
            className={`relative h-screen min-h-[500px] w-full bg-[#121212] overflow-hidden cursor-auto md:cursor-none text-[#eaeaea] font-sans antialiased selection:bg-[#eaeaea] selection:text-[#121212] ${className}`}
        >
            {/* Embedded Micro-Optimized CSS Styles */}
            <style>{`
                @keyframes grainNoise {
                    0%, 100% { transform: translate(0, 0); }
                    10% { transform: translate(-1%, -1%); }
                    30% { transform: translate(-2%, 1%); }
                    50% { transform: translate(1%, -2%); }
                    70% { transform: translate(-1%, 2%); }
                    90% { transform: translate(2%, 1%); }
                }
                .noise-layer {
                    animation: grainNoise 0.15s steps(3) infinite;
                }
                .hide-scrollbar::-webkit-scrollbar { display: none; }
            `}</style>

            {/* 1. Controlled Noise Overlay Layer */}
            {enableNoise && (
                <div
                    className="noise-layer pointer-events-none absolute left-[-50%] top-[-50%] z-50 h-[200%] w-[200%] mix-blend-overlay"
                    style={{
                        opacity: noiseOpacity,
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.95' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
                    }}
                />
            )}

            {/* 2. Fixed Background Layer */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <img
                    src={activeImage}
                    alt="Background Atmosphere"
                    className="h-full w-full object-cover transition-all duration-[1000ms] ease-out will-change-transform"
                    style={{
                        opacity: bgOpacity,
                        filter: `blur(${bgBlur}px) grayscale(${bgGrayscale}%)`,
                        transform: `scale(${bgScale})`,
                    }}
                />
                <div className="absolute inset-0 bg-[#121212]/60 mix-blend-multiply" />
            </div>

            {/* 3. Dynamic Edge Lighting/Shadow Fades */}
            <div className="pointer-events-none absolute inset-x-0 top-0 z-20 h-24 bg-gradient-to-b from-[#121212] via-[#121212]/70 to-transparent" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-24 bg-gradient-to-t from-[#121212] via-[#121212]/70 to-transparent" />

            {/* 4. Scroll Container for Items */}
            <main className="relative z-10 flex h-full w-full justify-start overflow-hidden px-4 sm:px-12 md:px-20">
                <div
                    ref={containerRef}
                    className="flex w-full flex-col items-start hide-scrollbar will-change-transform"
                    onMouseLeave={handleContainerLeave}
                    style={{
                        paddingTop: `${paddingY}vh`,
                        paddingBottom: `${paddingY}vh`
                    }}
                >
                    {items.map((project, i) => {
                        const isCurrentHovered = hoveredImage === project.image;
                        return (
                            <div
                                key={project.id}
                                className="group relative flex w-full cursor-pointer items-center py-2 text-left sm:py-3 border-b border-white/5 last:border-b-0"
                                onMouseEnter={() => handleProjectEnter(project.image)}
                                onMouseLeave={handleProjectLeave}
                                onTouchStart={() => handleProjectEnter(project.image)}
                                onTouchEnd={handleProjectLeave}
                            >
                                {/* Precise Mobile-Optimized ID Tracker */}
                                <span
                                    className={`pointer-events-none absolute left-0 transition-all duration-500 ease-[${EASING}] ${indexSizeClass} ${indexFontClass} ${indexTrackingClass} ${indexBgClass}`}
                                    style={{
                                        color: isCurrentHovered ? titleHoverColor : titleColor,
                                        opacity: isCurrentHovered ? 1.0 : indexOpacity,
                                    }}
                                >
                                    {project.id.toString().padStart(2, '0')}
                                </span>

                                {/* Responsive Scaled Title */}
                                <h2
                                    className={`relative z-10 m-0 w-full pl-8 transition-all duration-500 ease-[${EASING}] group-hover:translate-x-3 sm:group-hover:translate-x-6 ${titleSizeClass} ${titleWeightClass} ${titleTrackingClass} ${titleTransformClass} ${titleStyleClass} ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}
                                    style={{
                                        transitionDelay: `${mounted ? 0 : i * 20}ms`,
                                        color: isCurrentHovered ? titleHoverColor : titleColor,
                                        opacity: isCurrentHovered ? 1.0 : 0.4,
                                    }}
                                >
                                    {project.title}
                                </h2>
                            </div>
                        );
                    })}
                </div>
            </main>

            {/* 5. Custom Hover Cursor Card (Hidden naturally on real mobile devices) */}
            <div
                ref={cursorRef}
                className="pointer-events-none absolute left-0 top-0 z-40 hidden h-[180px] w-[260px] overflow-hidden rounded-md shadow-2xl will-change-transform md:block"
            >
                <div
                    className={`h-full w-full transition-all duration-500 ease-[${EASING}]`}
                    style={{ transform: `scale(${isHovered ? 1 : 0.4}) rotate(${cursorRotation}deg)`, opacity: isHovered ? 1 : 0 }}
                >
                    <img
                        src={activeImage}
                        className="h-full w-full object-cover"
                        alt="Preview Window"
                    />
                </div>
            </div>
        </div>
    );
};

export default ListCarousel;