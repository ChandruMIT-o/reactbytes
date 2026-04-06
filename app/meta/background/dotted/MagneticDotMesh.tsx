"use client";

import React, { useRef, useEffect, useState } from "react";
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
	/** Primary color in RGB [r, g, b] */
	color1?: [number, number, number];
	/** Secondary color in RGB [r, g, b] (interpolated based on displacement) */
	color2?: [number, number, number];
	/** Additional CSS classes for the container */
	className?: string;
}

interface Dot {
	ox: number;
	oy: number;
	x: number;
	y: number;
	vx: number;
	vy: number;
}

interface ClickEvent {
	x: number;
	y: number;
	t: number;
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
	color1 = [124, 92, 255], // Violet
	color2 = [46, 230, 166], // Mint
	className = "",
}) => {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [containerRef, bounds] = useMeasure();
	const dotsRef = useRef<Dot[]>([]);
	const clicksRef = useRef<ClickEvent[]>([]);
	const mouseRef = useRef({ x: -9999, y: -9999 });

	// Helper for color interpolation
	const lerpColor = (a: number[], b: number[], t: number) => {
		return [
			Math.round(a[0] + (b[0] - a[0]) * t),
			Math.round(a[1] + (b[1] - a[1]) * t),
			Math.round(a[2] + (b[2] - a[2]) * t),
		];
	};

	// Build or update the grid
	useEffect(() => {
		if (bounds.width === 0 || bounds.height === 0) return;

		const cols = Math.ceil(bounds.width / gap) + 2;
		const rows = Math.ceil(bounds.height / gap) + 2;
		const offX = (bounds.width % gap) / 2;
		const offY = (bounds.height % gap) / 2;

		const newDots: Dot[] = [];
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

			// Prune old shockwaves
			clicksRef.current = clicksRef.current.filter((s) => s.t < 1);

			// Update particles
			const dots = dotsRef.current;
			const clicks = clicksRef.current;
			const { x: mx, y: my } = mouseRef.current;

			for (const d of dots) {
				// Mouse repulsion
				let dx = d.x - mx;
				let dy = d.y - my;
				let dist = Math.sqrt(dx * dx + dy * dy);
				if (dist < repelRadius && dist > 0.01) {
					const f = (1 - dist / repelRadius) ** 2 * repelForce;
					d.vx += (dx / dist) * f;
					d.vy += (dy / dist) * f;
				}

				// Shockwave repulsion
				for (const s of clicks) {
					dx = d.ox - s.x;
					dy = d.oy - s.y;
					dist = Math.sqrt(dx * dx + dy * dy);
					const ring = s.t * shockwaveDist;
					const delta = Math.abs(dist - ring);
					if (delta < 40 && dist > 0.01) {
						const f = (1 - delta / 40) * shockwaveForce * (1 - s.t);
						d.vx += (dx / dist) * f;
						d.vy += (dy / dist) * f;
					}
				}

				// Spring back
				d.vx += (d.ox - d.x) * springStiffness;
				d.vy += (d.oy - d.y) * springStiffness;
				d.vx *= damping;
				d.vy *= damping;
				d.x += d.vx;
				d.y += d.vy;
			}

			// Advance shockwaves
			for (const s of clicks) s.t += 0.018;

			// Draw Connections (Mesh)
			for (let i = 0; i < dots.length; i++) {
				const a = dots[i];
				for (let j = i + 1; j < dots.length; j++) {
					const b = dots[j];
					const dx = a.x - b.x;
					const dy = a.y - b.y;
					const d = Math.sqrt(dx * dx + dy * dy);
					if (d > lineDist) continue;

					const dispA = Math.hypot(a.x - a.ox, a.y - a.oy);
					const dispB = Math.hypot(b.x - b.ox, b.y - b.oy);
					const t = Math.min((dispA + dispB) / 2 / (repelRadius * 0.6), 1);
					const alpha = (1 - d / lineDist) * (0.06 + t * 0.25);
					const [r, g, bColor] = lerpColor(color1, color2, t);

					ctx.beginPath();
					ctx.moveTo(a.x, a.y);
					ctx.lineTo(b.x, b.y);
					ctx.strokeStyle = `rgba(${r},${g},${bColor},${alpha})`;
					ctx.lineWidth = 0.8;
					ctx.stroke();
				}
			}

			// Draw Dots
			for (const d of dots) {
				const disp = Math.hypot(d.x - d.ox, d.y - d.oy);
				const t = Math.min(disp / (repelRadius * 0.5), 1);
				const [r, g, bColor] = lerpColor(color1, color2, t);
				const alpha = 0.2 + t * 0.8;
				const radius = dotRadius + t * 2.5;

				ctx.beginPath();
				ctx.arc(d.x, d.y, radius, 0, Math.PI * 2);
				ctx.fillStyle = `rgba(${r},${g},${bColor},${alpha})`;
				ctx.fill();
			}

			animationFrameId = requestAnimationFrame(tick);
		};

		tick();

		return () => cancelAnimationFrame(animationFrameId);
	}, [
		bounds.width,
		bounds.height,
		repelRadius,
		repelForce,
		shockwaveDist,
		shockwaveForce,
		springStiffness,
		damping,
		lineDist,
		dotRadius,
		color1,
		color2,
	]);

	const handleMouseMove = (e: React.MouseEvent) => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const rect = canvas.getBoundingClientRect();
		mouseRef.current = {
			x: e.clientX - rect.left,
			y: e.clientY - rect.top,
		};
	};

	const handleMouseLeave = () => {
		mouseRef.current = { x: -9999, y: -9999 };
	};

	const handleClick = (e: React.MouseEvent) => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const rect = canvas.getBoundingClientRect();
		clicksRef.current.push({
			x: e.clientX - rect.left,
			y: e.clientY - rect.top,
			t: 0,
		});
	};

	return (
		<div
			ref={containerRef}
			className={`w-full h-full min-h-[300px] bg-background overflow-hidden ${className}`}
		>
			<canvas
				ref={canvasRef}
				width={bounds.width}
				height={bounds.height}
				onMouseMove={handleMouseMove}
				onMouseLeave={handleMouseLeave}
				onClick={handleClick}
				className="block cursor-crosshair"
			/>
		</div>
	);
};

export default MagneticDotMesh;
