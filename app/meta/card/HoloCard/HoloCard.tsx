"use client";

import React, { useRef, useState } from 'react';
import { Hexagon, Fingerprint, Wifi } from 'lucide-react';

interface HoloCardProps {
    image?: string;
    showContent?: boolean;
    tiltSpread?: number;
    hoverScale?: number;
    holoEffect?: 'linear' | 'radial' | 'hexagonal';
    holoIntensity?: number;
    colorShift?: number;
    holoRotation?: number;
    className?: string;
}

export default function HoloCard({
    image = "https://images.unsplash.com/photo-1674849555293-9ef7e42f9048?crop=entropy&cs=tinysrgb&fm=jpg&ixid=MnwzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2Nzc1ODAxODY&ixlib=rb-4.0.3&q=80",
    showContent = true,
    tiltSpread = 15,
    hoverScale = 1.04,
    holoEffect = 'linear',
    holoIntensity = 1,
    colorShift = 0,
    holoRotation = 133,
    className = ""
}: HoloCardProps) {
    const cardRef = useRef<HTMLDivElement>(null);
    const [isHovering, setIsHovering] = useState(false);

    const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;

        const card = cardRef.current;
        const rect = card.getBoundingClientRect();

        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const width = rect.width;
        const height = rect.height;

        const pointerX = (x / width) * 100;
        const pointerY = (y / height) * 100;

        const bx = (x / width) * 10 + 45;
        const by = (y / height) * 10 + 45;

        const centerX = width / 2;
        const centerY = height / 2;
        const deltaX = x - centerX;
        const deltaY = y - centerY;
        const hyp = Math.sqrt(deltaX * deltaX + deltaY * deltaY) / Math.sqrt(centerX * centerX + centerY * centerY);

        const rotateY = (deltaX / centerX) * tiltSpread;
        const rotateX = -(deltaY / centerY) * tiltSpread;

        card.style.setProperty('--mx', `${x}px`);
        card.style.setProperty('--my', `${y}px`);
        card.style.setProperty('--pointer-x', `${pointerX}%`);
        card.style.setProperty('--pointer-y', `${pointerY}%`);
        card.style.setProperty('--posx', `${bx}%`);
        card.style.setProperty('--posy', `${by}%`);
        card.style.setProperty('--hyp', `${hyp}`);

        card.style.setProperty('--rx', `${rotateX}deg`);
        card.style.setProperty('--ry', `${rotateY}deg`);
        card.style.setProperty('--scale', `${hoverScale}`);
    };

    const handlePointerEnter = () => {
        setIsHovering(true);
    };

    const handlePointerLeave = () => {
        setIsHovering(false);
        if (!cardRef.current) return;

        const card = cardRef.current;
        card.style.setProperty('--rx', `0deg`);
        card.style.setProperty('--ry', `0deg`);
        card.style.setProperty('--scale', `1`);
        card.style.setProperty('--posx', `50%`);
        card.style.setProperty('--posy', `50%`);
        card.style.setProperty('--pointer-x', `50%`);
        card.style.setProperty('--pointer-y', `50%`);
        card.style.setProperty('--hyp', `0`);
    };

    return (
        <div 
            className={`relative group w-80 h-[28rem] rounded-2xl cursor-pointer ${className}`} 
            style={{ 
                perspective: '1200px',
                '--holo-intensity': holoIntensity,
                '--color-shift': `${colorShift}deg`,
                '--holo-angle': `${holoRotation}deg`
            } as React.CSSProperties}
        >
            <style>{`
                .holo-card {
                    transform-style: preserve-3d;
                    transform: perspective(1000px) rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg)) scale3d(var(--scale, 1), var(--scale, 1), var(--scale, 1));
                    transition: transform 0.1s ease-out;
                }
                
                .holo-card.resetting {
                    transition: transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);
                }

                .parallax-content {
                    transform: translateZ(50px);
                    transform-style: preserve-3d;
                }

                .shine, .shine::after {
                    position: absolute;
                    inset: 0;
                    --space: 5%;
                    --angle: var(--holo-angle, 133deg);
                    --imgsize: ${holoEffect === 'hexagonal' ? '40px' : '8rem'};
                    z-index: 10;
                    mix-blend-mode: color-dodge;
                    opacity: var(--holo-intensity, 1);
                    background-image: 
                        ${holoEffect === 'hexagonal' ? `url("data:image/svg+xml,%3Csvg width='40' height='69' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M40 17.32V52L20 63.54 0 52V17.32L20 5.77l20 11.55zm-2 3.46l-18-10.4-18 10.4v30.55l18 10.4 18-10.4V20.78z' fill='%23ffffff' fill-opacity='0.15'/%3E%3C/svg%3E"),` : `url(https://res.cloudinary.com/simey/image/upload/Dev/PokemonCards/illusion.webp),`}
                        ${holoEffect === 'radial' ? `repeating-radial-gradient(
                            farthest-corner circle at 50% 50%,
                            rgb(255, 119, 115) calc(var(--space) * 1),
                            rgba(255, 237, 95, 1) calc(var(--space) * 2),
                            rgba(168, 255, 95, 1) calc(var(--space) * 3),
                            rgba(131, 255, 247, 1) calc(var(--space) * 4),
                            rgba(120, 148, 255, 1) calc(var(--space) * 5),
                            rgb(216, 117, 255) calc(var(--space) * 6),
                            rgb(255, 119, 115) calc(var(--space) * 7)
                        ),
                        repeating-radial-gradient(
                            farthest-corner circle at 50% 50%,
                            #0e152e 0%,
                            hsl(180, 10%, 60%) 3.8%,
                            hsl(180, 29%, 66%) 4.5%,
                            hsl(180, 10%, 60%) 5.2%,
                            #0e152e 10%,
                            #0e152e 12%
                        ),` : `repeating-linear-gradient(
                            0deg,
                            rgb(255, 119, 115) calc(var(--space) * 1),
                            rgba(255, 237, 95, 1) calc(var(--space) * 2),
                            rgba(168, 255, 95, 1) calc(var(--space) * 3),
                            rgba(131, 255, 247, 1) calc(var(--space) * 4),
                            rgba(120, 148, 255, 1) calc(var(--space) * 5),
                            rgb(216, 117, 255) calc(var(--space) * 6),
                            rgb(255, 119, 115) calc(var(--space) * 7)
                        ),
                        repeating-linear-gradient(
                            var(--angle),
                            #0e152e 0%,
                            hsl(180, 10%, 60%) 3.8%,
                            hsl(180, 29%, 66%) 4.5%,
                            hsl(180, 10%, 60%) 5.2%,
                            #0e152e 10%,
                            #0e152e 12%
                        ),`}
                        radial-gradient(
                            farthest-corner circle at var(--mx) var(--my),
                            rgba(0, 0, 0, 0.1) 12%,
                            rgba(0, 0, 0, 0.15) 20%,
                            rgba(0, 0, 0, 0.25) 120%
                        );
                    background-blend-mode: exclusion, hue, hard-light;
                    background-size: var(--imgsize), 200% 700%, 300%, 200%;
                    background-position: 
                        center, 
                        var(--posx) var(--posy), 
                        var(--posx) var(--posy),
                        var(--posx) var(--posy);
                    filter: brightness(calc((var(--hyp) * 0.3) + 0.5)) contrast(2) saturate(1.5) hue-rotate(var(--color-shift, 0deg));
                    -webkit-filter: brightness(calc((var(--hyp) * 0.3) + 0.5)) contrast(2) saturate(1.5) hue-rotate(var(--color-shift, 0deg));
                    pointer-events: none;
                }
                
                .shine::after {
                    content: "";
                    background-size: var(--imgsize), 200% 400%, 200%, 200%;
                    background-position: 
                        center, 
                        var(--posx) var(--posy), 
                        calc(100% - var(--posx)) calc(100% - var(--posy)),
                        var(--posx) var(--posy);
                    filter: brightness(calc((var(--hyp) * 0.5) + 0.8)) contrast(1.6) saturate(1.4) hue-rotate(var(--color-shift, 0deg));
                    mix-blend-mode: exclusion;
                }

                .glare {
                    background-image: radial-gradient( farthest-corner circle at var(--pointer-x) var(--pointer-y), hsl(0, 0%, 75%) 5%, hsl(200, 5%, 35%) 60%, hsl(320, 40%, 10%) 150% );
                    background-size: 120% 150%;
                    background-position: center center;
                    mix-blend-mode: overlay;
                    filter: brightness(1) contrast(1.2) saturate(1);
                    opacity: 1;
                    position: absolute;
                    inset: 0;
                    z-index: 11;
                    pointer-events: none;
                }
            `}</style>

            <div
                ref={cardRef}
                onPointerMove={handlePointerMove}
                onPointerEnter={handlePointerEnter}
                onPointerLeave={handlePointerLeave}
                className={`holo-card absolute inset-0 w-full h-full rounded-2xl shadow-2xl bg-black overflow-hidden border border-white/10 ${!isHovering ? 'resetting' : ''}`}
            >
                <img
                    src={image}
                    alt="Card Background"
                    draggable={false}
                    className="absolute inset-0 w-full h-full object-cover z-0 opacity-80"
                />

                {showContent && (
                    <div className="parallax-content absolute inset-0 z-[5] p-6 flex flex-col justify-between text-white/90 pointer-events-none">
                        <div className="flex justify-between items-start w-full">
                            <div className="flex items-center gap-2">
                                <Hexagon className="w-6 h-6 text-emerald-400 opacity-90" />
                                <span className="font-bold tracking-[0.2em] uppercase text-xs text-white/80 mt-0.5">
                                    SPECIAL OPS
                                </span>
                            </div>
                        </div>

                        <div className="w-full mt-auto">
                            <div className="mb-4">
                                <p className="font-mono text-xl tracking-[0.15em] text-white/90 drop-shadow-md">
                                    ID-4892-1024
                                </p>
                            </div>
                            <div className="flex justify-between items-end">
                                <div>
                                    <p className="text-[0.6rem] uppercase tracking-[0.2em] text-white/50 mb-1">
                                        Name
                                    </p>
                                    <p className="text-sm tracking-widest font-medium uppercase drop-shadow-sm">
                                        A. O. VANGUARD
                                    </p>
                                </div>
                                <Fingerprint className="w-8 h-8 text-white/40 mb-1" />
                            </div>
                        </div>
                    </div>
                )}

                <div className="absolute inset-0 z-[6] bg-gradient-to-t from-black/80 via-black/20 to-black/40 pointer-events-none"></div>

                <div className="shine transition-opacity duration-300"></div>
                <div className="glare transition-opacity duration-300"></div>
            </div>

            <div
                className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-[80%] h-6 bg-black/60 blur-xl rounded-full transition-all duration-300 -z-10"
                style={{
                    opacity: isHovering ? 1 : 0.5,
                    transform: isHovering ? 'translate(-50%, 10px) scale(1.1)' : 'translate(-50%, 0) scale(1)'
                }}
            ></div>
        </div>
    );
}