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
				type: "[number, number, number]",
				defaultValue: "[124, 92, 255]",
				description: "Primary color (RGB array) for resting dots.",
			},
		],
	},
];

export const componentCode = `"use client";

import React, { useRef, useEffect, useState } from "react";
import useMeasure from "react-use-measure";

export interface MagneticDotMeshProps {
	gap?: number;
	dotRadius?: number;
	repelRadius?: number;
	repelForce?: number;
	springStiffness?: number;
	damping?: number;
	lineDist?: number;
	shockwaveDist?: number;
	shockwaveForce?: number;
	color1?: [number, number, number];
	color2?: [number, number, number];
	className?: string;
}

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
	color1 = [124, 92, 255],
	color2 = [46, 230, 166],
	className = "",
}) => {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [containerRef, bounds] = useMeasure();
	const dotsRef = useRef<any[]>([]);
	const clicksRef = useRef<any[]>([]);
	const mouseRef = useRef({ x: -9999, y: -9999 });

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
					const d = Math.hypot(a.x - b.x, a.y - b.y);
					if (d > lineDist) continue;
					const alpha = (1 - d / lineDist) * 0.15;
					ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
					ctx.strokeStyle = \`rgba(124, 92, 255, \${alpha})\`;
					ctx.lineWidth = 0.8; ctx.stroke();
				}
			}
			for (const d of dots) {
				ctx.beginPath(); ctx.arc(d.x, d.y, dotRadius, 0, Math.PI * 2);
				ctx.fillStyle = \`rgba(124, 92, 255, 0.4)\`; ctx.fill();
			}
			animationFrameId = requestAnimationFrame(tick);
		};
		tick();
		return () => cancelAnimationFrame(animationFrameId);
	}, [bounds.width, bounds.height, repelRadius, repelForce, shockwaveDist, shockwaveForce, springStiffness, damping, lineDist, dotRadius]);

	return (
		<div ref={containerRef} className={\`w-full h-full bg-background \${className}\`}>
			<canvas
				ref={canvasRef}
				width={bounds.width}
				height={bounds.height}
				onMouseMove={(e) => {
					const r = canvasRef.current.getBoundingClientRect();
					mouseRef.current = { x: e.clientX - r.left, y: e.clientY - r.top };
				}}
				onClick={(e) => {
					const r = canvasRef.current.getBoundingClientRect();
					clicksRef.current.push({ x: e.clientX - r.left, y: e.clientY - r.top, t: 0 });
				}}
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
