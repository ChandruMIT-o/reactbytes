export const loaderProps = [
    {
        title: "Core Props",
        props: [
            {
                name: "items",
                type: "ListCarouselItem[]",
                defaultValue: "DEFAULT_PROJECTS",
                description: "The array of project objects to display in the list.",
            },
            {
                name: "defaultBg",
                type: "string",
                defaultValue: "'https://assets.codepen.io/7558/bw-blurry-005.webp'",
                description: "The background image displayed when no item is hovered.",
            },
            {
                name: "className",
                type: "string",
                defaultValue: "''",
                description: "Additional CSS classes for the outer container.",
            },
        ],
    },
];

export const componentCode = `"use client";

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
}

const DEFAULT_PROJECTS: ListCarouselItem[] = [
    { id: 1, title: "The Space Between Notes", image: "https://assets.codepen.io/7558/bw-blurry-001.webp" },
    { id: 2, title: "Love as the Fourth Dimension", image: "https://assets.codepen.io/7558/bw-blurry-004.webp" },
    { id: 3, title: "The Art of Letting Go", image: "https://assets.codepen.io/7558/bw-blurry-007.webp" },
    { id: 4, title: "Creativity as Prayer", image: "https://assets.codepen.io/7558/bw-blurry-010.webp" },
    { id: 5, title: "The Universe Conspires", image: "https://assets.codepen.io/7558/bw-blurry-001.webp" },
    { id: 6, title: "Designing from Source", image: "https://assets.codepen.io/7558/bw-blurry-002.webp" },
    { id: 7, title: "The Frequency of Truth", image: "https://assets.codepen.io/7558/bw-blurry-007.webp" },
    { id: 8, title: "Infinite Possibilities", image: "https://assets.codepen.io/7558/bw-blurry-008.webp" },
];

const DEFAULT_BG_IMG = "https://assets.codepen.io/7558/bw-blurry-005.webp";
const EASING = "cubic-bezier(0.19, 1, 0.22, 1)"; // Luxurious, snappy easing

export const ListCarousel: React.FC<ListCarouselProps> = ({
    items = DEFAULT_PROJECTS,
    defaultBg = DEFAULT_BG_IMG,
    className = "",
}) => {
    const mainRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const cursorRef = useRef<HTMLDivElement>(null);

    // State
    const [activeImage, setActiveImage] = useState(defaultBg);
    const [isHovered, setIsHovered] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [cursorRotation, setCursorRotation] = useState(0);

    // Animation values for Lerping
    const scrollTargetY = useRef(0);
    const scrollCurrentY = useRef(0);
    const cursorTarget = useRef({ x: 0, y: 0 });
    const cursorCurrent = useRef({ x: 0, y: 0 });
    const isTouchDevice = useRef(false);

    // Initial Mount Animation
    useEffect(() => {
        setMounted(true);
        isTouchDevice.current = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    }, []);

    // Main RequestAnimationFrame Loop for buttery smooth interactions
    useEffect(() => {
        let rafId: number;

        const renderLoop = () => {
            // 1. Lerp Scroll Container
            scrollCurrentY.current += (scrollTargetY.current - scrollCurrentY.current) * 0.07;
            if (containerRef.current) {
                containerRef.current.style.transform = \`translate3d(0, \${scrollCurrentY.current}px, 0)\`;
            }

            // 2. Lerp Custom Cursor
            if (!isTouchDevice.current && cursorRef.current) {
                cursorCurrent.current.x += (cursorTarget.current.x - cursorCurrent.current.x) * 0.15;
                cursorCurrent.current.y += (cursorTarget.current.y - cursorCurrent.current.y) * 0.15;
                // Center the 320x240 image
                cursorRef.current.style.transform = \`translate3d(\${cursorCurrent.current.x - 160}px, \${cursorCurrent.current.y - 120}px, 0)\`;
            }

            rafId = requestAnimationFrame(renderLoop);
        };

        renderLoop();
        return () => cancelAnimationFrame(rafId);
    }, []);

    // Global Mouse/Touch Event Listener
    useEffect(() => {
        const handleMove = (e: MouseEvent | TouchEvent) => {
            if (!mainRef.current) return;

            const rect = mainRef.current.getBoundingClientRect();
            const clientX = 'touches' in e ? (e as TouchEvent).touches[0].clientX : (e as MouseEvent).clientX;
            const clientY = 'touches' in e ? (e as TouchEvent).touches[0].clientY : (e as MouseEvent).clientY;

            // Calculate position relative to container
            const relX = clientX - rect.left;
            const relY = clientY - rect.top;

            // Update Cursor Target (Relative to container)
            cursorTarget.current = { x: relX, y: relY };

            // Update Scroll Target
            const ch = containerRef.current?.scrollHeight || 0;
            const vh = rect.height;

            if (ch > vh) {
                // Percentage of Y position within the container
                const percentY = Math.max(0, Math.min(1, relY / vh));
                const margin = vh * 0.1; // 10% padding
                const maxScroll = ch - vh + margin * 2;

                // Calculate the target Y position based on vertical mouse percentage
                scrollTargetY.current = margin - (percentY * maxScroll);
            } else {
                scrollTargetY.current = (vh - ch) / 2; // Center if content is smaller than container
            }
        };

        window.addEventListener('mousemove', handleMove);
        window.addEventListener('touchmove', handleMove, { passive: false });

        return () => {
            window.removeEventListener('mousemove', handleMove);
            window.removeEventListener('touchmove', handleMove);
        };
    }, [mounted]); // Re-bind once mounted

    // Hover Handlers
    const handleProjectEnter = (image: string) => {
        setActiveImage(image);
        setIsHovered(true);
        setCursorRotation((Math.random() - 0.5) * 16); // Random rotation between -8 and +8 degrees
    };

    const handleProjectLeave = () => {
        setIsHovered(false);
        // Note: We don't reset activeImage here so the transition out doesn't snap to default
    };

    const handleContainerLeave = () => {
        setActiveImage(defaultBg);
    };

    return (
        <div 
            ref={mainRef}
            className={\`relative h-full min-h-[600px] w-full bg-[#1a1917] overflow-hidden cursor-auto md:cursor-none text-[#f8f5f2] font-sans antialiased selection:bg-[#f8f5f2] selection:text-[#1a1917] \${className}\`}
        >

            {/* Dynamic Styles for SVG Noise Overlay */}
            <style>{\`
        @keyframes noise {
          0%, 100% { transform: translate(0, 0); }
          10% { transform: translate(-2%, -2%); }
          20% { transform: translate(-4%, 2%); }
          30% { transform: translate(2%, -4%); }
          40% { transform: translate(-2%, 6%); }
          50% { transform: translate(-4%, 2%); }
          60% { transform: translate(6%, 0); }
          70% { transform: translate(0, 4%); }
          80% { transform: translate(-6%, 0); }
          90% { transform: translate(4%, 2%); }
        }
        .noise-bg {
          animation: noise 0.2s steps(4) infinite;
        }
        ::-webkit-scrollbar { display: none; }
      \`}</style>

            {/* 1. Noise Overlay Layer */}
            <div
                className="noise-bg pointer-events-none absolute left-[-50%] top-[-50%] z-50 h-[200%] w-[200%] opacity-[0.25] mix-blend-overlay"
                style={{ backgroundImage: \`url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")\` }}
            />

            {/* 2. Fixed Background Image */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                <img
                    src={activeImage}
                    alt="Atmospheric Background"
                    className={\`h-full w-full object-cover transition-all duration-[1200ms] ease-out will-change-transform \${isHovered ? 'scale-100 opacity-60' : 'scale-105 opacity-30 blur-[2px]'
                        }\`}
                />
                {/* Dark overlay to ensure text readability */}
                <div className="absolute inset-0 bg-[#1a1917]/40" />
            </div>

            {/* 3. Gradient Fades (Top & Bottom) */}
            <div className="pointer-events-none absolute inset-x-0 top-0 z-20 h-40 bg-gradient-to-b from-[#1a1917] via-[#1a1917]/80 to-transparent" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-40 bg-gradient-to-t from-[#1a1917] via-[#1a1917]/80 to-transparent" />

            {/* 4. Scrolling Projects Container */}
            <main className="relative z-10 flex h-full w-full justify-start overflow-hidden px-6 md:px-24">
                <div
                    ref={containerRef}
                    className="flex w-full flex-col items-start pb-[20vh] pt-[20vh] will-change-transform"
                    onMouseLeave={handleContainerLeave}
                >
                    {items.map((project, i) => (
                        <div
                            key={project.id}
                            className="group relative flex w-full cursor-pointer items-center py-1 text-left md:py-2"
                            onMouseEnter={() => handleProjectEnter(project.image)}
                            onMouseLeave={handleProjectLeave}
                            onTouchStart={() => handleProjectEnter(project.image)}
                            onTouchEnd={handleProjectLeave}
                        >
                            {/* Project ID (Slides out on hover) */}
                            <span className={\`pointer-events-none absolute -left-8 font-mono text-sm tracking-widest text-[#f8f5f2]/40 opacity-0 transition-all duration-500 ease-[\${EASING}] group-hover:-translate-x-4 group-hover:opacity-100 md:text-lg md:group-hover:-translate-x-12\`}>
                                {project.id.toString().padStart(2, '0')}
                            </span>

                            {/* Project Title (High character, expands tracking and shifts right) */}
                            <h2
                                className={\`relative z-10 m-0 w-full text-xl font-black uppercase tracking-tighter text-[#f8f5f2]/30 transition-all duration-500 ease-[\${EASING}] group-hover:translate-x-8 group-hover:text-[#f8f5f2] group-hover:tracking-[0.05em] md:text-3xl lg:text-6xl md:group-hover:translate-x-16 md:group-hover:tracking-[0.1em] \${mounted ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
                                    }\`}
                                style={{ transitionDelay: \`\${mounted ? 0 : i * 25}ms\` }}
                            >
                                {project.title}
                            </h2>
                        </div>
                    ))}
                </div>
            </main>

            {/* 5. Custom Cursor Image (Hidden on touch devices) */}
            <div
                ref={cursorRef}
                className="pointer-events-none absolute left-0 top-0 z-40 hidden h-[240px] w-[320px] overflow-hidden rounded-sm will-change-transform md:block"
            >
                <div
                    className={\`h-full w-full transition-all duration-500 ease-[\${EASING}] \${isHovered ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
                        }\`}
                    style={{ transform: \`scale(\${isHovered ? 1 : 0.5}) rotate(\${cursorRotation}deg)\` }}
                >
                    <img
                        src={activeImage}
                        className="h-full w-full object-cover"
                        alt="Cursor Preview"
                        crossOrigin="anonymous"
                    />
                </div>
            </div>

        </div>
    );
};

export default ListCarousel;`;

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
