export const loaderProps = [
	{
		title: "Core Props",
		props: [
			{
				name: "count",
				type: "number",
				defaultValue: "3000",
				description: "The total number of particles on screen.",
			},
			{
				name: "noiseScale",
				type: "number",
				defaultValue: "650",
				description: "Zoom level of the noise field. Lower is more chaotic.",
			},
			{
				name: "noiseSpeed",
				type: "number",
				defaultValue: "0.005",
				description: "Speed at which the flow field evolves over time.",
			},
			{
				name: "velocity",
				type: "number",
				defaultValue: "5",
				description: "Movement speed of the particles.",
			},
		],
	},
	{
		title: "Visual Props",
		props: [
			{
				name: "color1",
				type: "string",
				defaultValue: "'#4b97a2'",
				description: "Primary particle color (hex/rgb).",
			},
			{
				name: "color2",
				type: "string",
				defaultValue: "'#e94b3c'",
				description: "Secondary particle color (hex/rgb).",
			},
			{
				name: "backgroundColor",
				type: "string",
				defaultValue: "'#000000'",
				description: "Canvas background color.",
			},
			{
				name: "opacity",
				type: "number",
				defaultValue: "0.05",
				description: "Trailing effect intensity. Lower is longer trails.",
			},
			{
				name: "radius",
				type: "number",
				defaultValue: "2",
				description: "Base size multiplier for the particles.",
			},
		],
	},
];

export const componentCode = `"use client";

import React, { useEffect, useRef, useMemo } from "react";

// Simple Simplex Noise implementation for portability
const createNoise2D = () => {
    const p = new Uint8Array(256);
    for (let i = 0; i < 256; i++) p[i] = i;
    for (let i = 255; i > 0; i--) {
        const r = Math.floor(Math.random() * (i + 1));
        [p[i], p[r]] = [p[r], p[i]];
    }
    const perm = new Uint8Array(512);
    for (let i = 0; i < 512; i++) perm[i] = p[i & 255];

    const grads = [
        [1, 1], [-1, 1], [1, -1], [-1, -1],
        [1, 0], [-1, 0], [1, 0], [-1, 0],
        [0, 1], [0, -1], [0, 1], [0, -1]
    ];

    const dot = (g: number[], x: number, y: number) => g[0] * x + g[1] * y;

    return (x: number, y: number) => {
        let n0 = 0, n1 = 0, n2 = 0;
        const F2 = 0.5 * (Math.sqrt(3.0) - 1.0);
        const s = (x + y) * F2;
        let i = Math.floor(x + s);
        let j = Math.floor(y + s);
        const G2 = (3.0 - Math.sqrt(3.0)) / 6.0;
        const t = (i + j) * G2;
        const X0 = i - t;
        const Y0 = j - t;
        const x0 = x - X0;
        const y0 = y - Y0;

        let i1, j1;
        if (x0 > y0) { i1 = 1; j1 = 0; }
        else { i1 = 0; j1 = 1; }

        const x1 = x0 - i1 + G2;
        const y1 = y0 - j1 + G2;
        const x2 = x0 - 1.0 + 2.0 * G2;
        const y2 = y0 - 1.0 + 2.0 * G2;

        const ii = i & 255;
        const jj = j & 255;

        let t0 = 0.5 - x0 * x0 - y0 * y0;
        if (t0 < 0) n0 = 0.0;
        else {
            t0 *= t0;
            const gi0 = perm[ii + perm[jj]] % 12;
            n0 = t0 * t0 * dot(grads[gi0], x0, y0);
        }

        let t1 = 0.5 - x1 * x1 - y1 * y1;
        if (t1 < 0) n1 = 0.0;
        else {
            t1 *= t1;
            const gi1 = perm[ii + i1 + perm[jj + j1]] % 12;
            n1 = t1 * t1 * dot(grads[gi1], x1, y1);
        }

        let t2 = 0.5 - x2 * x2 - y2 * y2;
        if (t2 < 0) n2 = 0.0;
        else {
            t2 *= t2;
            const gi2 = perm[ii + 1 + perm[jj + 1]] % 12;
            n2 = t2 * t2 * dot(grads[gi2], x2, y2);
        }

        return 70.0 * (n0 + n1 + n2);
    };
};

export interface HiveMindProps {
    count?: number;
    noiseScale?: number;
    noiseSpeed?: number;
    velocity?: number;
    opacity?: number;
    radius?: number;
    color1?: string;
    color2?: string;
    backgroundColor?: string;
    highRes?: boolean;
    className?: string;
}

export const HiveMind: React.FC<HiveMindProps> = ({
    count = 3000,
    noiseScale = 650,
    noiseSpeed = 0.005,
    velocity = 5,
    opacity = 0.05,
    radius = 2,
    color1 = "#4b97a2",
    color2 = "#e94b3c",
    backgroundColor = "#000000",
    highRes = true,
    className = "",
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const particlesRef = useRef<any[]>([]);
    const noiseRef = useRef<any>(null);
    const noiseTimeRef = useRef(Math.random() * 100);
    const animationFrameRef = useRef<number>(0);

    const dpr = highRes ? (typeof window !== "undefined" ? window.devicePixelRatio : 1) : 1;

    class Particle {
        x: number;
        y: number;
        size: number;
        isColor1: boolean;
        w: number;
        h: number;

        constructor(w: number, h: number) {
            this.w = w;
            this.h = h;
            const spawnRange = Math.max(w, h);
            this.x = w / 2 + (Math.random() * spawnRange - Math.random() * spawnRange);
            this.y = h / 2 + (Math.random() * spawnRange - Math.random() * spawnRange);
            
            const random = Math.random();
            this.size = random > 0.8 ? Math.random() * 2 : (random > 0.2 ? Math.random() * 1 : Math.random() * 3);
            this.isColor1 = Math.random() > 0.5;
        }

        move(noise: any, noiseTime: number, vel: number, nScale: number) {
            this.x += noise(this.y / nScale, noiseTime) * vel;
            this.y += noise(this.x / nScale, noiseTime) * vel;

            if (this.x < 0 || this.x > this.w || this.y < 0 || this.y > this.h) {
                const spawnRange = Math.max(this.w, this.h);
                this.x = this.w / 2 + (Math.random() * spawnRange - Math.random() * spawnRange);
                this.y = this.h / 2 + (Math.random() * spawnRange - Math.random() * spawnRange);
                return;
            }
        }

        render(ctx: CanvasRenderingContext2D, rMult: number, c1: string, c2: string) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size * rMult, 0, 2 * Math.PI);
            ctx.fillStyle = this.isColor1 ? c1 : c2;
            ctx.fill();
        }
    }

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        noiseRef.current = createNoise2D();

        const resize = () => {
            const width = canvas.clientWidth;
            const height = canvas.clientHeight;
            canvas.width = width * dpr;
            canvas.height = height * dpr;
            ctx.scale(dpr, dpr);
            particlesRef.current = Array.from({ length: count }, () => new Particle(width, height));
            ctx.fillStyle = backgroundColor;
            ctx.fillRect(0, 0, width, height);
        };

        resize();
        window.addEventListener("resize", resize);

        const update = () => {
            noiseTimeRef.current += noiseSpeed;
            const w = canvas.width / dpr;
            const h = canvas.height / dpr;

            ctx.globalAlpha = opacity;
            ctx.fillStyle = backgroundColor;
            ctx.fillRect(0, 0, w, h);
            ctx.globalAlpha = 1;

            ctx.globalCompositeOperation = "lighter";
            particlesRef.current.forEach(p => {
                p.move(noiseRef.current, noiseTimeRef.current, velocity, noiseScale);
                p.render(ctx, radius, color1, color2);
            });
            ctx.globalCompositeOperation = "source-over";

            animationFrameRef.current = requestAnimationFrame(update);
        };

        update();

        return () => {
            window.removeEventListener("resize", resize);
            cancelAnimationFrame(animationFrameRef.current);
        };
    }, [count, noiseScale, noiseSpeed, velocity, opacity, radius, color1, color2, backgroundColor, dpr]);

    return (
        <canvas
            ref={canvasRef}
            className={\`w-full h-full block \${className}\`}
            style={{ backgroundColor }}
        />
    );
};

export default HiveMind;`;

export const creditsData = [
	{
		title: "Component Source",
		items: [
			{
				name: "Neo Hive Mind",
				role: "Visual Designer",
				url: "https://codepen.io/iam-noob/pen/zYrjXzY",
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
				name: "Canvas API",
				role: "Graphics",
				url: "https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API",
			},
		],
	},
];
