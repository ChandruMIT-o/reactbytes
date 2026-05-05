import React, { useEffect, useRef, useState, useCallback } from 'react';

interface SplitCarouselProps {
    leftImages?: string[];
    rightImages?: string[];
    sensitivity?: number;
    backgroundColor?: string;
    imageWidth?: string;
    imageMinHeight?: string;
    borderRadius?: string;
    className?: string;
}

const DEFAULT_LEFT_IMAGES = [
    'https://www.yudiz.com/codepen/gsap-landing-page/card-3.jpg',
    'https://www.yudiz.com/codepen/gsap-landing-page/card-9.jpg',
    'https://www.yudiz.com/codepen/gsap-landing-page/card-1.jpg',
    'https://www.yudiz.com/codepen/gsap-landing-page/card-5.jpg',
    'https://www.yudiz.com/codepen/gsap-landing-page/card-2.jpg',
];

const DEFAULT_RIGHT_IMAGES = [
    'https://www.yudiz.com/codepen/gsap-landing-page/card-6.jpg',
    'https://www.yudiz.com/codepen/gsap-landing-page/card-7.jpg',
    'https://www.yudiz.com/codepen/gsap-landing-page/card-8.jpg',
    'https://www.yudiz.com/codepen/gsap-landing-page/card-10.jpg',
    'https://www.yudiz.com/codepen/gsap-landing-page/card-4.jpg',
];

const START_TIMES = [180, 360, 540, 720, 800];
const END_TIME = 900;
const FINAL_X_LEFT = [-95, -70, -40, -10, 20];
const FINAL_SCALES = [0.6, 0.7, 0.8, 0.9, 1.0];

export default function SplitCarousel({
    leftImages = DEFAULT_LEFT_IMAGES,
    rightImages = DEFAULT_RIGHT_IMAGES,
    sensitivity = 0.5,
    backgroundColor = '#000',
    imageWidth = '20vw',
    imageMinHeight = '350px',
    borderRadius = '0.75rem',
    className = '',
}: SplitCarouselProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [progress, setProgress] = useState(0);
    const progressRef = useRef(0);

    const handleWheel = useCallback((e: WheelEvent) => {
        if (!containerRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();
        const isHovering = (
            e.clientX >= rect.left &&
            e.clientX <= rect.right &&
            e.clientY >= rect.top &&
            e.clientY <= rect.bottom
        );

        if (!isHovering) return;

        const currentProgress = progressRef.current;
        const delta = e.deltaY * sensitivity;
        const nextProgress = Math.min(1000, Math.max(0, currentProgress + delta));

        let shouldConsume = false;
        if (currentProgress > 0 && currentProgress < 1000) {
            shouldConsume = true;
        } else if (currentProgress === 0 && e.deltaY > 0) {
            shouldConsume = true;
        } else if (currentProgress === 1000 && e.deltaY < 0) {
            shouldConsume = true;
        }

        if (shouldConsume) {
            if (e.cancelable) e.preventDefault();
            progressRef.current = nextProgress;
            setProgress(nextProgress);
        }
    }, [sensitivity]);

    useEffect(() => {
        window.addEventListener('wheel', handleWheel, { passive: false });
        return () => {
            window.removeEventListener('wheel', handleWheel);
        };
    }, [handleWheel]);

    const calculateImageStyle = (idx: number, side: 'left' | 'right') => {
        const startTime = START_TIMES[idx];
        const localProgress = progress > startTime 
            ? Math.min(1, (progress - startTime) / (END_TIME - startTime)) 
            : 0;

        let initialX = side === 'left' ? (idx === 0 ? 50 : 100) : (idx === 0 ? -50 : -100);
        const targetX = side === 'left' ? FINAL_X_LEFT[idx] : -FINAL_X_LEFT[idx];
        const currentX = initialX + (targetX - initialX) * localProgress;
        const currentScale = 1 + (FINAL_SCALES[idx] - 1) * localProgress;

        return {
            transform: `translateX(${currentX}%) scale(${currentScale})`,
            transition: 'transform 0.15s ease-out',
            width: imageWidth,
            minWidth: '200px',
            [side === 'left' ? 'borderTopLeftRadius' : 'borderTopRightRadius']: borderRadius,
            [side === 'left' ? 'borderBottomLeftRadius' : 'borderBottomRightRadius']: borderRadius,
        };
    };

    return (
        <div
            ref={containerRef}
            className={`relative w-full py-20 flex flex-col items-center text-white overflow-hidden ${className}`}
            style={{ backgroundColor }}
        >
            <div className="slider-card-inner w-full relative">
                <div className="slider-box w-[95%] mx-auto flex relative">
                    <div className="slider-left w-1/2 overflow-hidden relative" style={{ height: imageWidth, minHeight: imageMinHeight }}>
                        {leftImages.slice(0, 5).map((src, idx) => (
                            <img key={`left-${idx}`} src={src} className="absolute top-0 right-0 h-full object-cover" style={calculateImageStyle(idx, 'left')} />
                        ))}
                    </div>
                    <div className="slider-right w-1/2 overflow-hidden relative" style={{ height: imageWidth, minHeight: imageMinHeight }}>
                        {rightImages.slice(0, 5).map((src, idx) => (
                            <img key={`right-${idx}`} src={src} className="absolute top-0 left-0 h-full object-cover" style={calculateImageStyle(idx, 'right')} />
                        ))}
                    </div>
                </div>

                {/* Interaction Hint - Nested to avoid pushing height */}
                <div className={`absolute -bottom-10 left-1/2 -translate-x-1/2 transition-opacity duration-500 ${progress > 0 ? 'opacity-0' : 'opacity-100'}`}>
                    <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 animate-pulse whitespace-nowrap">
                        Hover & Scroll
                    </p>
                </div>
            </div>
        </div>
    );
}