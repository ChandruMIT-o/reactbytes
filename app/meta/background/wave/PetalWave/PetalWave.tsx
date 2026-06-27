"use client";

import React, { useEffect, useRef, useState } from 'react';

// Declare global GSAP interface for TypeScript
declare global {
    interface Window {
        gsap: any;
    }
}

// 6-vertex polygon path configurations for fluid morphing transitions
const SHAPE_PATHS = {
    petal: {
        start: 'M.5,.5 .2,.4 1.3,.4 1.5,.5 1.3,.6 .2,.6',
        end: 'M-.5,.5 .5,-.2 1,-.2 1.5,.5 1,1.2 .5,1.2'
    },

    diamond: {
        start: 'M.5,.5 .5,.5 .5,.5 .5,.5 .5,.5 .5,.5',
        end: 'M.5,0 1,.5 .5,1 0,.5 .5,0 .5,0'
    },

    hexagon: {
        start: 'M.5,.5 .5,.5 .5,.5 .5,.5 .5,.5 .5,.5',
        end: 'M.25,.1 .75,.1 1,.5 .75,.9 .25,.9 0,.5'
    },

    droplet: {
        start: 'M.5,.5 .5,.5 .5,.5 .5,.5 .5,.5 .5,.5',
        end: 'M.5,0 .95,.45 .75,1 .5,.85 .25,1 .05,.45'
    },

    kite: {
        start: 'M.5,.5 .5,.5 .5,.5 .5,.5 .5,.5 .5,.5',
        end: 'M.5,0 .95,.45 .65,1 .35,1 .05,.45 .5,0'
    }
};

export interface PetalWaveProps {
    /** The base background/path color of the grid */
    colorStart?: string;
    /** The staggered wave animation fill color */
    colorEnd?: string;
    /** Animation speed multiplier (timeScale) */
    speed?: number;
    /** Dynamic shape variant for the paths */
    shape?: 'petal' | 'diamond' | 'hexagon' | 'droplet' | 'kite';
    /** Where the stagger animation originates */
    staggerFrom?: 'start' | 'end' | 'center' | 'edges' | 'random' | number;
    /** The total staggered animation spread time in seconds */
    staggerAmount?: number;
    /** The ease used for the staggering distribution */
    staggerEase?: string;
    /** The ease used for the individual path transition */
    ease?: string;
    /** Custom CSS classes for container wrapper */
    className?: string;
    /** Optional overlay or centered content inside the background wrapper */
    children?: React.ReactNode;
}

export default function PetalWave({
    colorStart = '#18181b',
    colorEnd = '#ef4444',
    speed = 1.0,
    shape = 'petal',
    staggerFrom = 'center',
    staggerAmount = 6,
    staggerEase = 'sine.in',
    ease = 'expo',
    className = '',
    children,
}: PetalWaveProps) {
    const gRef = useRef<SVGGElement>(null);
    const tlRef = useRef<any>(null);
    const pathsRef = useRef<SVGPathElement[]>([]);
    const [gsapLoaded, setGsapLoaded] = useState(false);

    // Highly robust dynamic GSAP loader with double-tag injection prevention
    useEffect(() => {
        if (window.gsap) {
            setGsapLoaded(true);
            return;
        }

        const existingScript = document.querySelector('script[src*="gsap.min.js"]');
        if (existingScript) {
            const handleLoad = () => setGsapLoaded(true);
            existingScript.addEventListener('load', handleLoad);
            return () => {
                existingScript.removeEventListener('load', handleLoad);
            };
        }

        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js';
        script.onload = () => setGsapLoaded(true);
        document.head.appendChild(script);
    }, []);

    // 1. DOM Instantiation: Build the 50x50 path grid ONCE on mount/GSAP load
    useEffect(() => {
        if (!gsapLoaded || !gRef.current) return;

        const gsap = window.gsap;
        const g = gRef.current;

        // Clear any existing paths (safeguard for React StrictMode double invocation)
        g.innerHTML = '';
        const paths: SVGPathElement[] = [];
        const svgNS = "http://www.w3.org/2000/svg";

        // Set initial state on the <g> container
        gsap.set(g, { svgOrigin: '25 25', rotate: 45, scale: 1.4 });

        // Use a DocumentFragment to batch DOM insertions for maximum performance
        const fragment = document.createDocumentFragment();

        // Generate the 50x50 grid of paths (2500 total elements)
        for (let x = 0; x < 50; x++) {
            for (let y = 0; y < 50; y++) {
                const p = document.createElementNS(svgNS, "path");
                fragment.appendChild(p);
                paths.push(p);

                // Apply initial positioning and styling to each path
                gsap.set(p, {
                    x: x - 0.2,
                    y: y - 0.2,
                    transformOrigin: '0.5 0.5',
                    rotate: 45,
                    scaleX: 1.5,
                    fill: colorStart,
                    attr: { d: SHAPE_PATHS.petal.start },
                });
            }
        }

        // Append all paths to the <g> element in a single DOM operation
        g.appendChild(fragment);
        pathsRef.current = paths;
    }, [gsapLoaded]);

    // 2. High-Performance Update Loop: Rebuild the GSAP timeline without recreating any DOM elements
    useEffect(() => {
        if (!gsapLoaded || !pathsRef.current.length) return;

        const gsap = window.gsap;
        const paths = pathsRef.current;

        // Kill active timeline before binding a new one
        if (tlRef.current) {
            tlRef.current.kill();
        }

        // Resolve paths safely
        const chosenShape = SHAPE_PATHS[shape] || SHAPE_PATHS.petal;

        // Instantly reset properties in-place using batch set
        gsap.set(paths, {
            fill: colorStart,
            scaleX: 1.5,
            scaleY: 1.0,
            rotate: 45,
            attr: { d: chosenShape.start },
        });

        // Create the timeline with dynamic stagger settings
        const tl = gsap.to(paths, {
            duration: 3,
            ease: ease,
            yoyoEase: 'sine.inOut',
            fill: colorEnd,
            attr: { d: chosenShape.end },
            stagger: {
                amount: staggerAmount,
                from: staggerFrom,
                grid: [50, 50],
                repeat: -1,
                yoyo: true,
                ease: staggerEase
            }
        });

        // Fast-forward timeline to skip build-up phase and set dynamic timescale
        tl.play(999);
        tl.timeScale(speed);
        tlRef.current = tl;

        return () => {
            if (tlRef.current) {
                tlRef.current.kill();
            }
        };
    }, [gsapLoaded, colorStart, colorEnd, shape, staggerFrom, staggerAmount, staggerEase, ease]);

    // 3. Keep timescale updated dynamically when speed changes
    useEffect(() => {
        if (tlRef.current) {
            tlRef.current.timeScale(speed);
        }
    }, [speed]);

    return (
        <div className={`relative w-full h-full overflow-hidden bg-black select-none ${className}`}>
            <svg
                viewBox="0 0 50 50"
                preserveAspectRatio="xMidYMid slice"
                className="absolute inset-0 w-full h-full pointer-events-none block z-0"
            >
                <g ref={gRef}></g>
            </svg>

            {/* Content overlay container */}
            {children && (
                <div className="relative w-full h-full z-10 pointer-events-auto">
                    {children}
                </div>
            )}
        </div>
    );
}