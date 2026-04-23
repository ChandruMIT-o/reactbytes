export const loaderProps = [
	{
		title: "Core Mesh Props",
		props: [
			{
				name: "gap",
				type: "number",
				defaultValue: "48",
				description: "The distance between dots in the resting grid.",
			},
			{
				name: "dotRadius",
				type: "number",
				defaultValue: "2",
				description: "The resting size of each dot.",
			},
			{
				name: "lineDist",
				type: "number",
				defaultValue: "70",
				description:
					"Maximum distance for creating connection lines between dots.",
			},
		],
	},
	{
		title: "Physics Props",
		props: [
			{
				name: "repelRadius",
				type: "number",
				defaultValue: "140",
				description: "Radius of mouse influence on dots.",
			},
			{
				name: "repelForce",
				type: "number",
				defaultValue: "14",
				description: "How strongly the mouse pushes dots away.",
			},
			{
				name: "springStiffness",
				type: "number",
				defaultValue: "0.055",
				description: "Force pulling dots back to their original position.",
			},
			{
				name: "damping",
				type: "number",
				defaultValue: "0.82",
				description: "Friction factor for the dots' velocity.",
			},
		],
	},
	{
		title: "Interactive/Style Props",
		props: [
			{
				name: "shockwaveDist",
				type: "number",
				defaultValue: "220",
				description: "Maximum reach of the click ripple effect.",
			},
			{
				name: "shockwaveForce",
				type: "number",
				defaultValue: "22",
				description: "Intensity of the click push.",
			},
			{
				name: "color1",
				type: "string",
				defaultValue: "'#7c5cff'",
				description: "Primary color (hex) for resting dots.",
			},
			{
				name: "color2",
				type: "string",
				defaultValue: "'#2ee6a6'",
				description: "Secondary color (hex) for displaced dots.",
			},
		],
	},
];

export const componentCode = `"use client";

import React, { useRef, useEffect, useMemo } from "react";
import useMeasure from "react-use-measure";

export interface MagneticDotMeshProps {
	/** Grid spacing between dots */
	gap?: number;
	/** Resting radius of the dots */
	dotRadius?: number;
	/** Radius of mouse repulsion influence */
	repelRadius?: number;
	/** Strength of the mouse repulsion push */
	repelForce?: number;
	/** Stiffness of the spring pulling dots back to home positions */
	springStiffness?: number;
	/** Velocity decay factor */
	damping?: number;
	/** Max distance for connecting dots with mesh lines */
	lineDist?: number;
	/** Reach of the shockwave after a click */
	shockwaveDist?: number;
	/** Strength of the shockwave push */
	shockwaveForce?: number;
	/** Primary color in hex */
	color1?: string;
	/** Secondary color in hex */
	color2?: string;
	/** Additional CSS classes for the container */
	className?: string;
}

const hexToRgb = (hex: string): [number, number, number] => {
	const result = /^#?([a-f\\d]{2})([a-f\\d]{2})([a-f\\d]{2})$/i.exec(hex);
	return result
		? [
			parseInt(result[1], 16),
			parseInt(result[2], 16),
			parseInt(result[3], 16),
		]
		: [255, 255, 255];
};

export const MagneticDotMesh: React.FC<MagneticDotMeshProps> = ({
	gap = 48,
	dotRadius = 2,
	repelRadius = 140,
	repelForce = 14,
	springStiffness = 0.055,
	damping = 0.82,
	lineDist = 70,
	shockwaveDist = 220,
	shockwaveForce = 22,
	color1 = "#7c5cff",
	color2 = "#2ee6a6",
	className = "",
}) => {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [containerRef, bounds] = useMeasure();
	const dotsRef = useRef<any[]>([]);
	const clicksRef = useRef<any[]>([]);
	const mouseRef = useRef({ x: -9999, y: -9999 });

	const rgb1 = useMemo(() => hexToRgb(color1), [color1]);
	const rgb2 = useMemo(() => hexToRgb(color2), [color2]);

	const lerpColor = (a: number[], b: number[], t: number) => {
		return [
			Math.round(a[0] + (b[0] - a[0]) * t),
			Math.round(a[1] + (b[1] - a[1]) * t),
			Math.round(a[2] + (b[2] - a[2]) * t),
		];
	};

	useEffect(() => {
		if (bounds.width === 0 || bounds.height === 0) return;
		const cols = Math.ceil(bounds.width / gap) + 2;
		const rows = Math.ceil(bounds.height / gap) + 2;
		const offX = (bounds.width % gap) / 2;
		const offY = (bounds.height % gap) / 2;
		const newDots = [];
		for (let r = 0; r < rows; r++) {
			for (let c = 0; c < cols; c++) {
				const ox = offX + c * gap;
				const oy = offY + r * gap;
				newDots.push({ ox, oy, x: ox, y: oy, vx: 0, vy: 0 });
			}
		}
		dotsRef.current = newDots;
	}, [bounds.width, bounds.height, gap]);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;
		let animationFrameId: number;

		const tick = () => {
			ctx.clearRect(0, 0, bounds.width, bounds.height);
			clicksRef.current = clicksRef.current.filter((s) => s.t < 1);
			const dots = dotsRef.current;
			const clicks = clicksRef.current;
			const { x: mx, y: my } = mouseRef.current;

			for (const d of dots) {
				let dx = d.x - mx, dy = d.y - my;
				let dist = Math.sqrt(dx * dx + dy * dy);
				if (dist < repelRadius && dist > 0.01) {
					const f = (1 - dist / repelRadius) ** 2 * repelForce;
					d.vx += (dx / dist) * f; d.vy += (dy / dist) * f;
				}
				for (const s of clicks) {
					dx = d.ox - s.x; dy = d.oy - s.y;
					dist = Math.sqrt(dx * dx + dy * dy);
					const ring = s.t * shockwaveDist, delta = Math.abs(dist - ring);
					if (delta < 40 && dist > 0.01) {
						const f = (1 - delta / 40) * shockwaveForce * (1 - s.t);
						d.vx += (dx / dist) * f; d.vy += (dy / dist) * f;
					}
				}
				d.vx += (d.ox - d.x) * springStiffness;
				d.vy += (d.oy - d.y) * springStiffness;
				d.vx *= damping; d.vy *= damping;
				d.x += d.vx; d.y += d.vy;
			}
			for (const s of clicks) s.t += 0.018;

			for (let i = 0; i < dots.length; i++) {
				const a = dots[i];
				for (let j = i + 1; j < dots.length; j++) {
					const b = dots[j];
					const dx = a.x - b.x, dy = a.y - b.y;
					const d = Math.sqrt(dx * dx + dy * dy);
					if (d > lineDist) continue;

					const dispA = Math.hypot(a.x - a.ox, a.y - a.oy);
					const dispB = Math.hypot(b.x - b.ox, b.y - b.oy);
					const t = Math.min((dispA + dispB) / 2 / (repelRadius * 0.6), 1);
					const alpha = (1 - d / lineDist) * (0.06 + t * 0.25);
					const [r, g, bColor] = lerpColor(rgb1, rgb2, t);

					ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
					ctx.strokeStyle = \\\`rgba(\${r},\${g},\${bColor},\${alpha})\\\`;
					ctx.lineWidth = 0.8; ctx.stroke();
				}
			}
			for (const d of dots) {
				const disp = Math.hypot(d.x - d.ox, d.y - d.oy);
				const t = Math.min(disp / (repelRadius * 0.5), 1);
				const [r, g, bColor] = lerpColor(rgb1, rgb2, t);
				const alpha = 0.2 + t * 0.8;
				const radius = dotRadius + t * 2.5;

				ctx.beginPath(); ctx.arc(d.x, d.y, radius, 0, Math.PI * 2);
				ctx.fillStyle = \\\`rgba(\${r},\${g},\${bColor},\${alpha})\\\`; ctx.fill();
			}
			animationFrameId = requestAnimationFrame(tick);
		};
		tick();
		return () => cancelAnimationFrame(animationFrameId);
	}, [bounds.width, bounds.height, repelRadius, repelForce, shockwaveDist, shockwaveForce, springStiffness, damping, lineDist, dotRadius, rgb1, rgb2]);

	return (
		<div ref={containerRef} className=\\\`w-full h-full min-h-[300px] bg-background overflow-hidden \\\${className}\\\`>
			<canvas
				ref={canvasRef}
				width={bounds.width}
				height={bounds.height}
				onMouseMove={(e) => {
					const r = canvasRef.current.getBoundingClientRect();
					mouseRef.current = { x: e.clientX - r.left, y: e.clientY - r.top };
				}}
				onMouseLeave={() => { mouseRef.current = { x: -9999, y: -9999 }; }}
				onClick={(e) => {
					const r = canvasRef.current.getBoundingClientRect();
					clicksRef.current.push({ x: e.clientX - r.left, y: e.clientY - r.top, t: 0 });
				}}
				className="block cursor-crosshair"
			/>
		</div>
	);
};

export default MagneticDotMesh;`;

export const creditsData = [
	{
		title: "Visual Reference",
		items: [
			{
				name: "JP Belley",
				role: "Designer",
				url: "https://jeanphilippebelley.com/",
			},
		],
	},
];
