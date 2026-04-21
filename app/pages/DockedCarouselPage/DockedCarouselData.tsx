import { creditsData as generalCredits } from "../InstallationPage/InstallationData";

export const carouselProps = [
    {
        title: "Carousel Props",
        props: [
            {
                name: "images",
                type: "string[]",
                default: "DEFAULT_IMAGES",
                description: "Array of image URLs to display in the carousel."
            },
            {
                name: "equalSize",
                type: "boolean",
                default: "false",
                description: "If true, all thumbnails will Have the same width instead of the dynamic dock effect."
            },
            {
                name: "shape",
                type: "'square' | 'circle' | 'rectangle'",
                default: "'circle'",
                description: "The border-radius style of the thumbnails."
            },
            {
                name: "animationType",
                type: "'slide' | 'pop' | 'expand'",
                default: "'expand'",
                description: "The transition effect when changing images."
            },
            {
                name: "autoSlide",
                type: "boolean",
                default: "true",
                description: "Whether the carousel should automatically cycle through images."
            },
            {
                name: "autoSlideInterval",
                type: "number",
                default: "5000",
                description: "Time in milliseconds between auto-slides."
            },
            {
                name: "transitionDuration",
                type: "number",
                default: "1.2",
                description: "Duration of the slide animation in seconds."
            },
            {
                name: "stiffness",
                type: "number",
                default: "200",
                description: "Spring stiffness for pop and expand animations."
            },
            {
                name: "damping",
                type: "number",
                default: "25",
                description: "Spring damping for pop and expand animations."
            },
            {
                name: "showArrows",
                type: "boolean",
                default: "true",
                description: "Toggle visibility of navigation arrows."
            },
            {
                name: "showTooltip",
                type: "boolean",
                default: "false",
                description: "Show a tooltip with the item index on hover."
            },
            {
                name: "showTimer",
                type: "boolean",
                default: "true",
                description: "Show the progress border on the active thumbnail."
            },
            {
                name: "height",
                type: "string | number",
                default: "'450px'",
                description: "The height of the carousel container."
            }
        ]
    }
];

export const creditsData = [
    {
        title: "Libraries",
        items: [
            {
                name: "Framer Motion",
                url: "https://www.framer.com/motion/",
                role: "Animation Engine"
            },
            {
                name: "Lucide React",
                url: "https://lucide.dev/",
                role: "Icon System"
            }
        ]
    },
    ...generalCredits
];

export const componentCode = `import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const DEFAULT_IMAGES = [
    "https://cdn.prod.website-files.com/69158db916f2854de7fae735/69158e74238022f91976b241_green-headphone-close-up.avif",
    "https://cdn.prod.website-files.com/69158db916f2854de7fae735/69158e74238022f91976b278_orange-leather-case.avif",
    "https://cdn.prod.website-files.com/69158db916f2854de7fae735/69158e74238022f91976b258_modern-device-close-up.avif",
    "https://cdn.prod.website-files.com/69158db916f2854de7fae735/69158e74238022f91976b287_sleek-device-close-up.avif",
    "https://cdn.prod.website-files.com/69158db916f2854de7fae735/69158e74238022f91976b268_minimalist-teal-design.avif",
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=1000",
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=1000",
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=1000",
    "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=1000"
];

const wipeEase = [0.625, 0.05, 0, 1] as const;

// SLIDE ANIMATION VARIANTS
const slideVariants = {
    enter: (direction: number) => ({
        x: direction > 0 ? '100%' : '-100%',
        rotateY: direction > 0 ? 45 : -45,
        opacity: 0,
        scale: 0.9,
        borderRadius: '2rem'
    }),
    center: {
        x: '0%',
        rotateY: 0,
        opacity: 1,
        scale: 1,
        zIndex: 1,
        borderRadius: '2rem'
    },
    exit: (direction: number) => ({
        x: direction > 0 ? '-100%' : '100%',
        rotateY: direction > 0 ? -45 : 45,
        opacity: 0,
        scale: 0.9,
        zIndex: 0,
        borderRadius: '2rem'
    })
};

const slideImageVariants = {
    enter: (direction: number) => ({
        x: direction > 0 ? '-50%' : '50%',
        scale: 1.5,
        filter: 'brightness(0.5) blur(10px)',
    }),
    center: {
        x: '0%',
        scale: 1.1,
        filter: 'brightness(1) blur(0px)',
    },
    exit: (direction: number) => ({
        x: direction > 0 ? '50%' : '-50%',
        scale: 1.5,
        filter: 'brightness(0.5) blur(10px)',
    })
};

// POP ANIMATION VARIANTS (Fades and grows)
const popVariants = {
    enter: ({ page, shape }: { page: number; shape: string }) => ({
        scale: 0,
        y: 200,
        opacity: 0,
        filter: 'blur(10px)',
        borderRadius: shape === 'circle' ? '500px' : (shape === 'square' ? '0px' : '12px'),
        x: (page - 4) * 40,
    }),
    center: {
        scale: 1,
        y: 0,
        x: 0,
        opacity: 1,
        filter: 'blur(0px)',
        borderRadius: '2rem',
        zIndex: 1,
    },
    exit: {
        scale: 0.5,
        y: 100,
        opacity: 0,
        filter: 'blur(10px)',
        zIndex: 0,
    }
};

// EXACT EXPAND ANIMATION VARIANTS
const expandVariants = {
    enter: ({ originRect, shape, containerSize }: any) => {
        if (!originRect || !containerSize) {
            return {
                clipPath: \\\`inset(50% 50% 50% 50% round 32px)\\\`,
                opacity: 0,
                zIndex: 2
            };
        }
        const top = (originRect.top / containerSize.h) * 100;
        const left = (originRect.left / containerSize.w) * 100;
        const bottom = ((containerSize.h - originRect.top - originRect.h) / containerSize.h) * 100;
        const right = ((containerSize.w - originRect.left - originRect.w) / containerSize.w) * 100;
        const radius = shape === 'circle' ? '500px' : (shape === 'square' ? '0px' : '8px');
        return {
            clipPath: \\\`inset(\\\${top}% \\\${right}% \\\${bottom}% \\\${left}% round \\\${radius})\\\`,
            opacity: 1,
            zIndex: 2,
        };
    },
    center: {
        clipPath: \\\`inset(0% 0% 0% 0% round 32px)\\\`,
        opacity: 1,
        zIndex: 2,
    },
    exit: {
        clipPath: \\\`inset(0% 0% 0% 0% round 32px)\\\`,
        opacity: 0.5,
        zIndex: 0,
    }
};

interface DockedCarousalProps {
    images?: string[];
    equalSize?: boolean;
    shape?: 'square' | 'circle' | 'rectangle';
    showArrows?: boolean;
    showTooltip?: boolean;
    showTimer?: boolean;
    animationType?: 'slide' | 'pop' | 'expand';
    autoSlide?: boolean;
    autoSlideInterval?: number;
    transitionDuration?: number;
    stiffness?: number;
    damping?: number;
    autoSlidePauseOnHover?: boolean;
    height?: string | number;
}

export default function DockedCarousal({
    images = DEFAULT_IMAGES,
    equalSize = false,
    shape = 'circle',
    showArrows = true,
    showTooltip = false,
    showTimer = true,
    animationType = 'expand',
    autoSlide = true,
    autoSlideInterval = 5000,
    transitionDuration = 1.2,
    stiffness = 200,
    damping = 25,
    autoSlidePauseOnHover = true,
    height = '450px'
}: DockedCarousalProps) {
    const [page, setPage] = useState(0);
    const [direction, setDirection] = useState(0); 
    const [isAppLoading, setIsAppLoading] = useState(true);
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const [timerKey, setTimerKey] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    const containerRef = useRef<HTMLElement>(null);
    const dockRefs = useRef<(HTMLDivElement | null)[]>([]);
    const [originRect, setOriginRect] = useState<{ top: number, left: number, w: number, h: number } | null>(null);
    const [containerSize, setContainerSize] = useState<{ w: number, h: number } | null>(null);

    useEffect(() => {
        const timer = setTimeout(() => setIsAppLoading(false), 1200);
        return () => clearTimeout(timer);
    }, []);

    const updateOriginRects = useCallback((index: number) => {
        if (animationType === 'expand' && containerRef.current && dockRefs.current[index]) {
            const cRect = containerRef.current.getBoundingClientRect();
            const bRect = dockRefs.current[index]!.getBoundingClientRect();
            setOriginRect({
                top: bRect.top - cRect.top,
                left: bRect.left - cRect.left,
                w: bRect.width,
                h: bRect.height
            });
            setContainerSize({ w: cRect.width, h: cRect.height });
        }
    }, [animationType]);

    const paginate = useCallback((newIndex: number) => {
        if (newIndex === page) return;
        const boundedIndex = (newIndex + images.length) % images.length;
        updateOriginRects(boundedIndex);
        setPage(boundedIndex);
        setTimerKey(prev => prev + 1);
    }, [page, images.length, updateOriginRects]);

    useEffect(() => {
        if (!isAppLoading && animationType === 'expand') updateOriginRects(page);
    }, [isAppLoading, animationType, page, updateOriginRects]);

    useEffect(() => {
        if (!autoSlide || isAppLoading || (autoSlidePauseOnHover && isHovered)) return;
        const interval = setInterval(() => paginate(page + 1), autoSlideInterval);
        return () => clearInterval(interval);
    }, [page, autoSlide, autoSlideInterval, isAppLoading, paginate, autoSlidePauseOnHover, isHovered]);

    const handleInteraction = () => { if (autoSlide) setTimerKey(prev => prev + 1); };

    const getThumbnailWidth = (index: number) => {
        if (equalSize) return '4em';
        let width = '3.5em';
        if (hoveredIndex !== null) {
            const distance = Math.abs(index - hoveredIndex);
            if (distance === 0) width = '5.5em';
            else if (distance === 1) width = '4.5em';
            else if (distance === 2) width = '4em';
        }
        return width;
    };

    const getShapeClass = () => {
        switch (shape) {
            case 'circle': return 'rounded-full aspect-square';
            case 'square': return 'rounded-none aspect-square';
            default: return 'rounded-[0.4em] aspect-video sm:aspect-square';
        }
    };

    const getSvgRadius = () => {
        switch (shape) {
            case 'circle': return '50%';
            case 'square': return '0%';
            default: return '0.4em';
        }
    };

    const isSlide = animationType === 'slide';
    const isExpand = animationType === 'expand';
    const activeVariants = isExpand ? expandVariants : (isSlide ? slideVariants : popVariants);
    const customProps = isExpand ? { originRect, containerSize, shape } : (isSlide ? 0 : { page, shape });

    return (
        <div className="w-full flex justify-center py-10 px-4">
            <main
                ref={containerRef}
                className="relative w-full max-w-5xl overflow-hidden bg-black flex flex-col items-center justify-center rounded-[2rem] shadow-xl"
                style={{ height }}
                onMouseEnter={() => { handleInteraction(); setIsHovered(true); }}
                onMouseLeave={() => setIsHovered(false)}
            >
                <div className="absolute inset-0 z-0">
                    <AnimatePresence initial={false} custom={customProps}>
                        <motion.div
                            key={page}
                            custom={customProps}
                            variants={activeVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={isSlide ? { duration: transitionDuration, ease: wipeEase } : { type: "spring", damping, stiffness }}
                            className="absolute inset-0 w-full h-full overflow-hidden"
                        >
                            <motion.img
                                src={images[page]}
                                alt="Slide"
                                className="absolute inset-0 w-full h-full object-cover"
                                style={{ scale: isSlide ? undefined : 1.1 }}
                            />
                        </motion.div>
                    </AnimatePresence>
                </div>

                {showArrows && (
                    <div className="absolute inset-0 z-20 flex items-center justify-between px-6 pointer-events-none">
                        <button onClick={() => paginate(page - 1)} className="p-3 rounded-full bg-white/10 backdrop-blur-md pointer-events-auto text-white">
                           <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                        </button>
                        <button onClick={() => paginate(page + 1)} className="p-3 rounded-full bg-white/10 backdrop-blur-md pointer-events-auto text-white">
                           <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                        </button>
                    </div>
                )}

                <div className="relative z-10 w-full h-full flex flex-col justify-end pointer-events-none pb-8">
                    <div className="flex flex-row justify-center items-end gap-2 pointer-events-auto" onMouseLeave={() => setHoveredIndex(null)}>
                        {images.map((src, index) => (
                            <motion.div
                                key={index}
                                ref={(el: any) => { dockRefs.current[index] = el; }}
                                onMouseEnter={() => setHoveredIndex(index)}
                                onClick={() => paginate(index)}
                                className="relative flex justify-center items-center cursor-pointer"
                                animate={{ width: getThumbnailWidth(index), opacity: hoveredIndex !== null && Math.abs(index - hoveredIndex) > 2 ? 0.6 : 1 }}
                                transition={{ type: "spring", stiffness: 400, damping: 40 }}
                            >
                                <div className="relative w-full h-full p-1 pointer-events-none">
                                    {autoSlide && showTimer && page === index && (
                                        <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 10, transform: "scale(1.05)" }}>
                                            <motion.rect x="2" y="2" width="calc(100% - 4px)" height="calc(100% - 4px)" rx={getSvgRadius()} fill="none" stroke="white" strokeWidth="3.5" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: autoSlideInterval / 1000, ease: "linear" }} key={timerKey} />
                                        </svg>
                                    )}
                                    <motion.img src={src} animate={{ scale: hoveredIndex === index ? 1.05 : 1 }} className={getShapeClass() + " w-full h-full object-cover"} />
                                </div>
                                <AnimatePresence>
                                    {showTooltip && hoveredIndex === index && (
                                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: -50 }} exit={{ opacity: 0, y: 10 }} className="absolute bg-white text-black px-2 py-1 rounded text-xs font-bold shadow-xl">Item {index + 1}</motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}`;
