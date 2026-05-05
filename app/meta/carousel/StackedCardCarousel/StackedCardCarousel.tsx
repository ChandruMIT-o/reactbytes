import React, { useRef, useState, useMemo } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent, useMotionValue, useSpring, useMotionTemplate, MotionValue } from "framer-motion";
import { Info, X, ChevronRight, ChevronLeft, Mouse } from "lucide-react";

interface CardItem {
    id: string;
    title: string;
    description: string;
    image: string;
    serial: string;
    category: string;
}

// --- Mathematical Interpolation Engine ---
// These functions meticulously replicate the original SCSS @keyframes loop
// by mapping the scroll's relative distance into exact 3D coordinates.

const calculateX = (rel: number) => {
    if (rel === 0) return "0%";
    if (rel > 0 && rel < 1) {
        if (rel <= 0.5) return `${rel * 2 * -116}%`;
        return `${-116 + (rel - 0.5) * 2 * 105}%`;
    }
    if (rel < 0 && rel > -1) {
        if (rel >= -0.5) return `${rel * -2 * 116}%`;
        return `${116 - (-rel - 0.5) * 2 * 105}%`;
    }
    if (rel >= 1) return `${-3 - rel * 8}%`;
    if (rel <= -1) return `${3 + Math.abs(rel) * 8}%`;
    return "0%";
};

const calculateZ = (rel: number) => {
    if (rel === 0) return "0px";
    if (rel > 0 && rel < 1) {
        if (rel <= 0.5) return `${rel * 2 * -156}px`;
        return `${-156 + (rel - 0.5) * 2 * -4}px`;
    }
    if (rel < 0 && rel > -1) {
        if (rel >= -0.5) return `${rel * -2 * -156}px`;
        return `${-156 + (-rel - 0.5) * 2 * -4}px`;
    }
    if (Math.abs(rel) >= 1) return `${-140 - Math.abs(rel) * 20}px`;
    return "0px";
};

const calculateRY = (rel: number) => {
    if (rel === 0) return "0deg";
    if (rel > 0 && rel < 1) {
        if (rel <= 0.5) return `${rel * 2 * -24}deg`;
        return `${-24 + (rel - 0.5) * 2 * 24}deg`;
    }
    if (rel < 0 && rel > -1) {
        if (rel >= -0.5) return `${-rel * 2 * 24}deg`;
        return `${24 - (-rel - 0.5) * 2 * 24}deg`;
    }
    return "0deg";
};

const calculateRZ = (rel: number) => {
    if (rel === 0) return "0deg";
    if (rel > 0 && rel < 1) return `${rel * -6}deg`;
    if (rel < 0 && rel > -1) return `${-rel * 6}deg`;
    if (rel >= 1) return `${-4 + rel * -2}deg`;
    if (rel <= -1) return `${4 + Math.abs(rel) * 2}deg`;
    return "0deg";
};

const calculateRX = (rel: number) => {
    if (rel === 0) return "0deg";
    if (Math.abs(rel) > 0 && Math.abs(rel) < 1) {
        if (Math.abs(rel) <= 0.5) return `${Math.abs(rel) * 2 * 2}deg`;
        return `${2 - (Math.abs(rel) - 0.5) * 2 * 2}deg`;
    }
    return "0deg";
};

const calculateOp = (rel: number) => 1 / Math.pow(3, Math.abs(rel));

// --- Components ---

interface CardProps {
    item: CardItem;
    index: number;
    totalCards: number;
    scrollXProgress: MotionValue<number>;
    bgTransform: MotionValue<string>;
}

const Card = ({ item, index, totalCards, scrollXProgress, bgTransform }: CardProps) => {
    const relTransform = useTransform(scrollXProgress, (p: number) => {
        const maxIndex = Math.max(1, totalCards - 1);
        return p * maxIndex - index;
    });

    const tX = useTransform(relTransform, calculateX);
    const tZ = useTransform(relTransform, calculateZ);
    const rY = useTransform(relTransform, calculateRY);
    const rZ = useTransform(relTransform, calculateRZ);
    const rX = useTransform(relTransform, calculateRX);
    const op = useTransform(relTransform, calculateOp);

    // Map progress for the liquid number (0 to 1 based on how close this card is to being active)
    // We want it to be 1 when relTransform is 0, and 0 when it's >= 1 or <= -1
    const liquidProgress = useTransform(relTransform, [-1, 0, 1], [0, 1, 0]);


    // --- Hover Interaction State ---
    const mouseX = useMotionValue(0.5);
    const mouseY = useMotionValue(0.5);
    const hoverOpacity = useMotionValue(0);

    const smoothMouseX = useSpring(mouseX, { stiffness: 60, damping: 20 });
    const smoothMouseY = useSpring(mouseY, { stiffness: 60, damping: 20 });
    const smoothHoverOpacity = useSpring(hoverOpacity, { stiffness: 100, damping: 20 });

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        mouseX.set((e.clientX - rect.left) / rect.width);
        mouseY.set((e.clientY - rect.top) / rect.height);
    };

    const handleMouseEnter = () => hoverOpacity.set(1);
    const handleMouseLeave = () => {
        hoverOpacity.set(0);
        mouseX.set(0.5);
        mouseY.set(0.5);
    };

    const hoverShine = useMotionTemplate`radial-gradient(
    800px circle at ${useTransform(smoothMouseX, v => v * 100)}% ${useTransform(smoothMouseY, v => v * 100)}%,
    rgba(255,255,255,0.15),
    transparent 50%
  )`;

    // --- Professional Layered Shine (Scroll-based) ---
    // 1. A slower, wider natural glass sweep
    const shineX = useTransform(relTransform, [-1, 0, 1], ["100%", "0%", "-100%"]);
    const shineOpacity = useTransform(relTransform, [-1, -0.5, 0, 0.5, 1], [0, 0.4, 0, 0.4, 0]);

    // 2. Soft ambient core light
    const glareX = useTransform(relTransform, [-1, 0, 1], ["-20%", "0%", "20%"]);
    const glareOpacity = useTransform(relTransform, [-1, 0, 1], [0.2, 0, 0.2]);

    return (
        <motion.div
            style={{
                x: tX,
                z: tZ,
                rotateY: rY,
                rotateZ: rZ,
                rotateX: rX,
                backgroundColor: bgTransform,
                transformStyle: "preserve-3d",
            }}
            className="absolute inset-0 m-auto flex items-center justify-center overflow-hidden rounded-[2rem] shadow-[0_20px_40px_rgba(0,0,0,0.6)] border border-white/[0.08] group"
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <motion.img
                src={item.image}
                alt={item.title || "Card content"}
                style={{ opacity: op }}
                className="absolute inset-0 h-full w-full object-cover z-10 transition-all duration-1000 ease-out group-hover:scale-110 opacity-60 mix-blend-luminosity group-hover:opacity-100 group-hover:mix-blend-normal"
            />
            {/* Subtle overlay gradient for depth */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-black/90 z-20 pointer-events-none" />


            {/* --- HYPERDETAILED SHINE EFFECTS --- */}

            {/* 1. Soft Ambient Glare (Scroll-based) */}
            <motion.div
                style={{ x: glareX, opacity: glareOpacity }}
                className="absolute inset-0 z-30 pointer-events-none mix-blend-soft-light [clip-path:inset(0_round_20px)]"
            >
                <div
                    className="absolute inset-0 w-[150%] -left-[25%] h-full"
                    style={{
                        background: `radial-gradient(circle at center, rgba(255,255,255,0.8) 0%, transparent 60%)`
                    }}
                />
            </motion.div>

            {/* 2. Natural Glass Sweep (Scroll-based) */}
            <motion.div
                style={{ x: shineX, opacity: shineOpacity }}
                className="absolute inset-0 z-40 pointer-events-none mix-blend-overlay [clip-path:inset(0_round_20px)]"
            >
                <div
                    className="absolute inset-0 w-[200%] -left-[50%] h-full -skew-x-[20deg]"
                    style={{
                        background: `linear-gradient(90deg, 
              transparent 0%, 
              transparent 35%, 
              rgba(255,255,255,0.05) 40%, 
              rgba(255,255,255,0.3) 48%, 
              rgba(255,255,255,0.5) 50%, 
              rgba(255,255,255,0.3) 52%, 
              rgba(255,255,255,0.05) 60%, 
              transparent 65%,
              transparent 100%)`
                    }}
                />
            </motion.div>

            {/* 3. Interactive Hover Spotlight */}
            <motion.div
                style={{
                    background: hoverShine,
                    opacity: smoothHoverOpacity
                }}
                className="absolute inset-0 z-50 pointer-events-none mix-blend-screen [clip-path:inset(0_round_20px)]"
            />
            {/* --------------------------------- */}

            {/* Elegant Sliding Number (Optimized for performance) */}
            <motion.div 
                style={{ opacity: op }}
                className="absolute top-6 left-6 w-[120px] h-[100px] pointer-events-none select-none z-30"
            >
                <div className="relative text-[76px] font-black tracking-tighter leading-none text-white/10 overflow-hidden h-[80px]">
                    0{index + 1}
                    <motion.div
                        className="absolute inset-0 text-white/40"
                        style={{
                            clipPath: useTransform(liquidProgress, [0, 1], ["inset(100% 0 0 0)", "inset(0 0 0 0)"]),
                        }}
                    >
                        0{index + 1}
                    </motion.div>
                </div>
            </motion.div>

            {/* Top Metadata Bar */}
            <motion.div
                style={{ opacity: op }}
                className="absolute top-6 right-6 flex flex-col items-end z-30 font-mono text-[10px] tracking-widest uppercase text-white/80 gap-2"
            >
                <span className="bg-black/40 backdrop-blur-md px-2.5 py-1 rounded border border-white/[0.08] shadow-lg">
                    {item.serial}
                </span>
                <span className="flex items-center gap-2 drop-shadow-md text-white/60">
                    <span className="w-1.5 h-1.5 rounded-full bg-white/40 animate-pulse"></span>
                    {item.category}
                </span>
            </motion.div>

            {/* Bottom Info Glass Panel */}
            <motion.div
                style={{ opacity: op }}
                className="absolute bottom-6 left-6 right-6 z-30 p-6 rounded-[1.5rem] bg-black/40 backdrop-blur-xl border border-white/[0.08] shadow-2xl transition-all duration-500 hover:bg-black/50"
            >
                <div className="w-8 h-[2px] bg-white/20 mb-4 rounded-full"></div>
                <h3 className="text-white text-2xl md:text-3xl font-bold tracking-tight mb-2">
                    {item.title}
                </h3>
                <p className="text-zinc-400 text-sm md:text-base leading-relaxed line-clamp-2 max-w-[90%]">
                    {item.description}
                </p>
            </motion.div>
        </motion.div>
    );
};

interface CardStackAppProps {
    items?: CardItem[];
    themeColors?: string[];
    cardWidth?: number;
    cardHeight?: number;
}

export default function CardStackApp({
    items = defaultItems,
    themeColors = defaultThemes,
    cardWidth = 320,
    cardHeight = 440,
}: CardStackAppProps) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [showInfo, setShowInfo] = useState(false);

    const { scrollXProgress } = useScroll({ container: scrollRef });

    useMotionValueEvent(scrollXProgress, "change", (latest) => {
        const maxIndex = Math.max(1, items.length - 1);
        setActiveIndex(Math.round(latest * maxIndex));
    });

    // Map scroll progress to the background theme colors
    const colorBreakpoints = useMemo(() =>
        items.map((_, i) => i / Math.max(1, items.length - 1)),
        [items.length]);

    const bgTransform = useTransform(scrollXProgress, colorBreakpoints, themeColors);

    // Adds a subtle breathing rotation to the entire stack during transitions
    const stackRotateY = useTransform(scrollXProgress, (p) => {
        const maxIndex = Math.max(1, items.length - 1);
        const fraction = (p * maxIndex) % 1;
        return Math.sin(fraction * Math.PI) * -8; // Slight lean during transition
    });

    const scrollNext = () => {
        if (!scrollRef.current) return;
        const clientWidth = scrollRef.current.clientWidth;
        scrollRef.current.scrollBy({ left: clientWidth, behavior: "smooth" });
    };

    const scrollPrev = () => {
        if (!scrollRef.current) return;
        const clientWidth = scrollRef.current.clientWidth;
        scrollRef.current.scrollBy({ left: -clientWidth, behavior: "smooth" });
    };

    return (
        <motion.main
            style={{ backgroundColor: bgTransform }}
            className="relative flex h-screen min-h-[700px] w-full flex-col items-center justify-center overflow-hidden font-sans transition-colors duration-200"
        >
            <style dangerouslySetInnerHTML={{
                __html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />

            {/* Background Ambience */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.05)_0%,transparent_70%)] pointer-events-none" />

            {/* 3D Scene Wrapper */}
            <div className="pointer-events-none relative z-10 w-full max-w-4xl px-4 h-[600px]" style={{ perspective: "1000px" }}>
                <motion.div
                    style={{ rotateY: stackRotateY, transformStyle: "preserve-3d" }}
                    className="absolute inset-0 flex items-center justify-center"
                >
                    {/* Card Dimensions applied to inner wrapper */}
                    <div
                        style={{ width: cardWidth, height: cardHeight, transformStyle: "preserve-3d" }}
                        className="relative"
                    >
                        {items.map((item, i) => (
                            <Card
                                key={item.id}
                                item={item}
                                index={i}
                                totalCards={items.length}
                                scrollXProgress={scrollXProgress}
                                bgTransform={bgTransform}
                            />
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Invisible Scroll Track controlling the animation */}
            <div
                ref={scrollRef}
                className="hide-scrollbar absolute inset-0 z-20 flex snap-x snap-mandatory overflow-x-auto"
                style={{ WebkitOverflowScrolling: "touch" }}
            >
                {items.map((_, i) => (
                    <div key={`scroll-item-${i}`} className="min-w-full h-full snap-start" />
                ))}
            </div>

            {/* User Interface & Controls (z-30 ensures clickable above scroller) */}
            <div className="absolute bottom-12 left-0 right-0 z-30 flex flex-col items-center gap-6 pointer-events-none">
                {/* Navigation Indicators */}
                <div className="flex items-center gap-4 bg-black/30 backdrop-blur-md px-6 py-3 rounded-full border border-white/10 pointer-events-auto">
                    <button
                        onClick={scrollPrev}
                        disabled={activeIndex === 0}
                        className="p-1 text-white/50 hover:text-white disabled:opacity-30 disabled:hover:text-white/50 transition-colors"
                    >
                        <ChevronLeft size={20} />
                    </button>

                    <div className="flex gap-2">
                        {items.map((_, i) => (
                            <div
                                key={i}
                                className={`h-1.5 rounded-full transition-all duration-500 cubic-bezier(0.34, 1.15, 0.64, 1) ${activeIndex === i ? "w-8 bg-zinc-200" : "w-2 bg-zinc-700"
                                    }`}
                            />
                        ))}
                    </div>

                    <button
                        onClick={scrollNext}
                        disabled={activeIndex === items.length - 1}
                        className="p-1 text-white/50 hover:text-white disabled:opacity-30 disabled:hover:text-white/50 transition-colors"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>

                {/* Helper Badge */}
                <div className="flex items-center gap-2 text-white/60 text-xs tracking-wider uppercase font-medium bg-black/20 px-4 py-2 rounded-full pointer-events-none">
                    <Mouse size={14} className="opacity-70" />
                    <span>Swipe or Scroll horizontally</span>
                </div>
            </div>

            {/* Explainer / Info Widget */}
            <div className="absolute right-6 top-6 z-40 pointer-events-auto">
                <div className={`relative overflow-hidden rounded-2xl bg-black/60 backdrop-blur-xl border border-white/10 transition-all duration-500 ease-out flex flex-col items-end ${showInfo ? "w-80 p-6 shadow-2xl" : "w-12 h-12 p-0 cursor-pointer hover:bg-black/80"
                    }`}>
                    <button
                        onClick={() => setShowInfo(!showInfo)}
                        className={`absolute top-0 right-0 h-12 w-12 flex items-center justify-center text-white/70 hover:text-white transition-colors`}
                    >
                        {showInfo ? <X size={20} /> : <Info size={20} />}
                    </button>

                    <div className={`w-full text-white/80 transition-opacity duration-300 ${showInfo ? "opacity-100" : "opacity-0 hidden"}`}>
                        <h4 className="text-white font-medium mb-3 pr-8">React & Framer Motion Port</h4>
                        <p className="text-sm font-mono text-white/60 mb-4 leading-relaxed">
                            This completely bypasses experimental CSS <code className="bg-white/10 px-1 py-0.5 rounded text-white/80">scroll-timeline</code> and <code className="bg-white/10 px-1 py-0.5 rounded text-white/80">scroll-snap</code> limitations.
                        </p>
                        <p className="text-sm font-mono text-white/60 leading-relaxed">
                            It calculates pure 3D space curves based on scroll progression, making it fully cross-browser compatible (Firefox/Safari ready).
                        </p>
                    </div>
                </div>
            </div>
        </motion.main>
    );
}

// --- Default Data Payload ---
const defaultThemes = [
    "#261715", // Deep Rust
    "#141c21", // Obsidian Blue
    "#18241b", // Forest Depths
    "#2a1b2e", // Void Purple
    "#282013", // Burned Amber
];

const defaultItems = [
    {
        id: "c1",
        title: "Silent Horizon",
        description: "An exploration into the quiet expanse.",
        image: "https://images.unsplash.com/photo-1543373014-cfe4f4bc1cdf?q=80&w=1000&auto=format&fit=crop",
        serial: "Nº 001",
        category: "Atmospheric"
    },
    {
        id: "c2",
        title: "Monolith",
        description: "Structures defining the modern atmospheric condition.",
        image: "https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?q=80&w=1000&auto=format&fit=crop",
        serial: "Nº 002",
        category: "Brutalism"
    },
    {
        id: "c3",
        title: "Alpine Echoes",
        description: "Textures harvested from high-altitude environments.",
        image: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?q=80&w=1000&auto=format&fit=crop",
        serial: "Nº 003",
        category: "Terrain"
    },
    {
        id: "c4",
        title: "Luminescent Grid",
        description: "Finding geometry in the organic.",
        image: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?q=80&w=1000&auto=format&fit=crop",
        serial: "Nº 004",
        category: "Geometry"
    },
    {
        id: "c5",
        title: "Void Theory",
        description: "Where light ceases to interact with form.",
        image: "https://images.unsplash.com/photo-1433086966358-54859d0ed716?q=80&w=1000&auto=format&fit=crop",
        serial: "Nº 005",
        category: "Abstract"
    },
];