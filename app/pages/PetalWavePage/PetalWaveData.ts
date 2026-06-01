export const loaderProps = [
	{
		title: "Core Props",
		props: [
			{
				name: "colorStart",
				type: "string",
				defaultValue: "'#18181b'",
				description: "The base background/path color of the grid elements.",
			},
			{
				name: "colorEnd",
				type: "string",
				defaultValue: "'#ef4444'",
				description: "The staggered wave animation fill color.",
			},
			{
				name: "speed",
				type: "number",
				defaultValue: "1.0",
				description: "Animation speed multiplier (GSAP timeScale). Controls loop speed.",
			},
			{
				name: "shape",
				type: "'petal' | 'star' | 'diamond' | 'ribbon'",
				defaultValue: "'petal'",
				description: "The geometry/shape preset used for path elements.",
			},
		],
	},
	{
		title: "Wave & Stagger Props",
		props: [
			{
				name: "staggerFrom",
				type: "'start' | 'end' | 'center' | 'edges' | 'random' | number",
				defaultValue: "'center'",
				description: "Where the wave ripple stagger originates.",
			},
			{
				name: "staggerAmount",
				type: "number",
				defaultValue: "6",
				description: "The total staggered animation spread time in seconds.",
			},
			{
				name: "staggerEase",
				type: "string",
				defaultValue: "'sine.in'",
				description: "The easing function used for distribute staggering.",
			},
			{
				name: "ease",
				type: "string",
				defaultValue: "'expo'",
				description: "The transitioning ease used for individual element morphs.",
			},
		],
	},
	{
		title: "Layout Props",
		props: [
			{
				name: "className",
				type: "string",
				defaultValue: "''",
				description: "Custom classes applied to the root outer wrapper.",
			},
			{
				name: "children",
				type: "React.ReactNode",
				defaultValue: "undefined",
				description: "Optional overlays, cards, text, or landing content layered in front of the animated background.",
			},
		],
	},
];

export const componentCode = `"use client";

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
    star: {
        start: 'M.5,.5 .5,.48 .52,.5 .5,.52 .48,.5 .5,.48',
        end: 'M.5,.5 0,-.5 1,0 .5,1.5 0,.5 -.5,-.5'
    },
    diamond: {
        start: 'M.5,.5 .5,.5 .5,.5 .5,.5 .5,.5 .5,.5',
        end: 'M.5,0 1,.5 .5,1 0,.5 .5,0 .5,0'
    },
    ribbon: {
        start: 'M.5,.5 .5,.5 .5,.5 .5,.5 .5,.5 .5,.5',
        end: 'M.2,0 0.4,.8 .6,-.2 .8,.6 1.0,-.4 1.2,.4'
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
    shape?: 'petal' | 'star' | 'diamond' | 'ribbon';
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

        g.innerHTML = '';
        const paths: SVGPathElement[] = [];
        const svgNS = "http://www.w3.org/2000/svg";

        gsap.set(g, { svgOrigin: '25 25', rotate: 45, scale: 1.4 });

        const fragment = document.createDocumentFragment();

        for (let x = 0; x < 50; x++) {
            for (let y = 0; y < 50; y++) {
                const p = document.createElementNS(svgNS, "path");
                fragment.appendChild(p);
                paths.push(p);

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

        g.appendChild(fragment);
        pathsRef.current = paths;
    }, [gsapLoaded]);

    // 2. High-Performance Update Loop: Rebuild the GSAP timeline without recreating any DOM elements
    useEffect(() => {
        if (!gsapLoaded || !pathsRef.current.length) return;

        const gsap = window.gsap;
        const paths = pathsRef.current;

        if (tlRef.current) {
            tlRef.current.kill();
        }

        const chosenShape = SHAPE_PATHS[shape] || SHAPE_PATHS.petal;

        gsap.set(paths, {
            fill: colorStart,
            scaleX: 1.5,
            scaleY: 1.0,
            rotate: 45,
            attr: { d: chosenShape.start },
        });

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

        tl.play(999);
        tl.timeScale(speed);
        tlRef.current = tl;

        return () => {
            if (tlRef.current) {
                tlRef.current.kill();
            }
        };
    }, [gsapLoaded, colorStart, colorEnd, shape, staggerFrom, staggerAmount, staggerEase, ease]);

    useEffect(() => {
        if (tlRef.current) {
            tlRef.current.timeScale(speed);
        }
    }, [speed]);

    return (
        <div className={\`relative w-full h-full overflow-hidden bg-black select-none \${className}\`}>
            <svg
                viewBox="0 0 50 50"
                preserveAspectRatio="xMidYMid slice"
                className="absolute inset-0 w-full h-full pointer-events-none block z-0"
            >
                <g ref={gRef}></g>
            </svg>

            {children && (
                <div className="relative w-full h-full z-10 pointer-events-auto">
                    {children}
                </div>
            )}
        </div>
    );
}`;

export const creditsData = [
	{
		title: "Component Source",
		items: [
			{
				name: "React Bytes",
				role: "Collection",
				url: "https://reactbytes.dev",
			},
		],
	},
	{
		title: "Libraries Used",
		items: [
			{
				name: "GSAP",
				role: "Animation Engine",
				url: "https://gsap.com",
			},
			{
				name: "React",
				role: "UI Framework",
				url: "https://react.dev",
			},
		],
	},
];
