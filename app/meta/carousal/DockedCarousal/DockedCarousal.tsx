import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Refined Image Set (9 items)
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

// EXACT EXPAND ANIMATION VARIANTS (Using clipPath to perfectly emerge from thumbnail)
const expandVariants = {
    enter: ({ originRect, shape, containerSize }: any) => {
        if (!originRect || !containerSize) {
            return {
                clipPath: `inset(50% 50% 50% 50% round 32px)`,
                opacity: 0,
                zIndex: 2
            };
        }

        // Convert exact px bounds into percentages to animate seamlessly to 0%
        const top = (originRect.top / containerSize.h) * 100;
        const left = (originRect.left / containerSize.w) * 100;
        const bottom = ((containerSize.h - originRect.top - originRect.h) / containerSize.h) * 100;
        const right = ((containerSize.w - originRect.left - originRect.w) / containerSize.w) * 100;

        const radius = shape === 'circle' ? '500px' : (shape === 'square' ? '0px' : '8px');

        return {
            clipPath: `inset(${top}% ${right}% ${bottom}% ${left}% round ${radius})`,
            opacity: 1,
            zIndex: 2,
        };
    },
    center: {
        clipPath: `inset(0% 0% 0% 0% round 32px)`,
        opacity: 1,
        zIndex: 2,
    },
    exit: {
        clipPath: `inset(0% 0% 0% 0% round 32px)`,
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
    // New controlling props
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

    // Tracking exact rect bounds to ensure "expand" originates accurately
    const containerRef = useRef<HTMLElement>(null);
    const dockRefs = useRef<(HTMLDivElement | null)[]>([]);
    const [originRect, setOriginRect] = useState<{ top: number, left: number, w: number, h: number } | null>(null);
    const [containerSize, setContainerSize] = useState<{ w: number, h: number } | null>(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsAppLoading(false);
        }, 1200);
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
            setContainerSize({
                w: cRect.width,
                h: cRect.height
            });
        }
    }, [animationType]);

    const paginate = useCallback((newIndex: number) => {
        if (newIndex === page) return;
        const boundedIndex = (newIndex + images.length) % images.length;

        updateOriginRects(boundedIndex);

        setDirection(boundedIndex > page ? 1 : -1);
        setPage(boundedIndex);
        setTimerKey(prev => prev + 1);
    }, [page, images.length, updateOriginRects]);

    // Setup initial origin bounds based on starting page if expansion is active
    useEffect(() => {
        if (!isAppLoading && animationType === 'expand') {
            updateOriginRects(page);
        }
    }, [isAppLoading, animationType, page, updateOriginRects]);

    // Auto-slide effect
    useEffect(() => {
        if (!autoSlide || isAppLoading || (autoSlidePauseOnHover && isHovered)) return;

        const interval = setInterval(() => {
            paginate(page + 1);
        }, autoSlideInterval);

        return () => clearInterval(interval);
    }, [page, autoSlide, autoSlideInterval, isAppLoading, paginate, autoSlidePauseOnHover, isHovered]);

    // Manual interaction handler to reset timer
    const handleInteraction = () => {
        if (autoSlide) {
            setTimerKey(prev => prev + 1);
        }
    };

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
    const customProps = isExpand ? { originRect, containerSize, shape } : (isSlide ? direction : { page, shape });

    return (
        <div className="w-full flex justify-center py-10 px-4">
            <style>{`
                @font-face {
                    font-family: 'Haffer';
                    src: url('https://cdn.prod.website-files.com/69158db916f2854de7fae735/69158dbc16f2854de7fae7d9_HafferRegular.ttf') format('truetype');
                    font-weight: 400; font-style: normal; font-display: swap;
                }
            `}</style>

            <main
                ref={containerRef}
                className="relative w-full max-w-5xl overflow-hidden bg-black flex flex-col items-center justify-center rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] perspective-[1500px]"
                style={{ height }}
                onMouseEnter={() => {
                    handleInteraction();
                    setIsHovered(true);
                }}
                onMouseLeave={() => setIsHovered(false)}
                onTouchStart={handleInteraction}
            >

                {/* PARALLAX CAROUSEL BACKGROUND */}
                <div className="absolute inset-0 z-0">
                    <AnimatePresence initial={false} custom={customProps}>
                        <motion.div
                            key={page}
                            custom={customProps}
                            variants={activeVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={isSlide
                                ? { duration: transitionDuration, ease: wipeEase }
                                : { type: "spring", damping: damping, stiffness: stiffness }
                            }
                            className={`absolute inset-0 w-full h-full overflow-hidden origin-center ${isExpand ? 'bg-black' : ''}`}
                        >
                            <motion.img
                                src={images[page]}
                                alt={`Slide ${page + 1}`}
                                custom={isSlide ? direction : undefined}
                                variants={isSlide ? slideImageVariants : {}}
                                initial={isSlide ? "enter" : {}}
                                animate={isSlide ? "center" : {}}
                                exit={isSlide ? "exit" : {}}
                                transition={isSlide ? { duration: transitionDuration, ease: wipeEase } : {}}
                                className="absolute inset-0 w-full h-full object-cover"
                                style={{ scale: isSlide ? undefined : 1.1 }}
                                draggable={false}
                            />
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* NAVIGATION ARROWS */}
                {showArrows && (
                    <div className="absolute inset-0 z-20 flex items-center justify-between px-6 pointer-events-none">
                        <button
                            onClick={(e) => { e.stopPropagation(); paginate(page - 1); }}
                            className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white pointer-events-auto hover:bg-white/20 transition-all active:scale-95 group"
                        >
                            <svg className="w-6 h-6 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); paginate(page + 1); }}
                            className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white pointer-events-auto hover:bg-white/20 transition-all active:scale-95 group"
                        >
                            <svg className="w-6 h-6 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                )}

                {/* UI OVERLAY */}
                <div className="relative z-10 w-full h-full flex flex-col justify-end pointer-events-none">

                    {/* BOTTOM NAVIGATION (Apple Dock Thumbnails) */}
                    <div className="flex flex-col items-center pointer-events-auto z-30 pb-8">
                        <motion.div
                            initial={{ y: 100, opacity: 0 }}
                            animate={{ y: isAppLoading ? 100 : 0, opacity: isAppLoading ? 0 : 1 }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                            className="flex flex-row justify-center items-end gap-2"
                            onMouseLeave={() => setHoveredIndex(null)}
                        >
                            {images.map((src, index) => {
                                const width = getThumbnailWidth(index);
                                const isCurrent = page === index;

                                return (
                                    <motion.div
                                        key={index}
                                        ref={(el: HTMLDivElement | null) => { dockRefs.current[index] = el; }} // Save exact DOM element for clipPath metrics
                                        onMouseEnter={() => setHoveredIndex(index)}
                                        onClick={() => paginate(index)}
                                        className="relative flex justify-center items-center cursor-pointer origin-bottom"
                                        animate={{ 
                                            width,
                                            opacity: hoveredIndex !== null && Math.abs(index - hoveredIndex) > 2 ? 0.6 : 1
                                        }}
                                        transition={{ type: "spring", stiffness: 400, damping: 40 }}
                                    >
                                        <div className="relative w-full h-full p-1 pointer-events-none">
                                            {/* Timer Progress Border SVG - Optimized with will-change */}
                                            {autoSlide && showTimer && isCurrent && (
                                                <svg
                                                    className="absolute inset-0 w-full h-full pointer-events-none"
                                                    style={{ zIndex: 10, transform: "scale(1.05)", willChange: 'transform' }}
                                                >
                                                    <motion.rect
                                                        x="2" y="2"
                                                        width="calc(100% - 4px)" height="calc(100% - 4px)"
                                                        rx={getSvgRadius()}
                                                        fill="none"
                                                        stroke="rgba(255, 255, 255, 0.9)"
                                                        strokeWidth="3.5"
                                                        initial={{ pathLength: 0 }}
                                                        animate={{ pathLength: 1 }}
                                                        transition={{ duration: autoSlideInterval / 1000, ease: "linear" }}
                                                        key={`timer-${timerKey}`}
                                                    />
                                                </svg>
                                            )}

                                            <motion.img
                                                src={src}
                                                alt={`Slide ${index + 1}`}
                                                initial={false}
                                                animate={{
                                                    opacity: isCurrent ? 1 : (hoveredIndex === index ? 1 : 0.6),
                                                    scale: hoveredIndex === index ? 1.05 : 1
                                                }}
                                                className={`w-full h-full object-cover rounded-inherit ${getShapeClass()} ${isCurrent ? 'shadow-xl ring-2 ring-white/30' : ''}`}
                                                style={{ transition: 'none' }} // Remove CSS transitions to prevent conflict with Framer Motion
                                            />
                                        </div>

                                        {/* Tooltip */}
                                        <AnimatePresence>
                                            {showTooltip && hoveredIndex === index && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10, scale: 0.8 }}
                                                    animate={{ opacity: 1, y: -50, scale: 1 }}
                                                    exit={{ opacity: 0, y: 10, scale: 0.8 }}
                                                    className="absolute whitespace-nowrap bg-white text-black px-3 py-1 rounded-full text-xs font-bold pointer-events-none z-50 shadow-xl"
                                                >
                                                    Item {index + 1}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>
                                );
                            })}
                        </motion.div>
                    </div>
                </div>

                {/* INITIAL LOADING MASK */}
                <AnimatePresence>
                    {isAppLoading && (
                        <motion.div
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.8, ease: "easeInOut" }}
                            className="absolute inset-0 z-50 bg-black flex items-center justify-center pointer-events-none"
                        >
                            <motion.div
                                animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                                className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin pointer-events-none"
                            />
                        </motion.div>
                    )}
                </AnimatePresence>

            </main>
        </div>
    );
}