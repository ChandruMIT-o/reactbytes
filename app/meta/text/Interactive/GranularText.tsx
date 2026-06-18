"use client";

import React, { useEffect, useRef } from "react";

interface SandParticle {
	x: number;
	y: number;
	ox: number;
	oy: number;
	vx: number;
	vy: number;
	status: "crystalline" | "sand";
	cooldown: number;
	colorHex: string;
	letterIndex: number;
}

interface LetterMeta {
	char: string;
	x: number;
	y: number;
}

export interface GranularTextProps {
	/** The word/text to display and animate */
	text?: string;
	/** Radius around mouse where particles are affected */
	radius?: number;
	/** Strength of dispersion force */
	force?: number;
	/** Gravity/downward acceleration on particles */
	gravity?: number;
	/** Cooldown time in frames before recall starts */
	cooldown?: number;
	/** Speed of snap-back recall */
	recallSpeed?: number;
	/** Foreground color of the stable vector text */
	color?: string;
	/** Particle dispersion active color (hex) */
	activeColorHex?: string;
	/** Particle recall color (hex) */
	recallColorHex?: string;
	/** Background color of the canvas */
	bgColor?: string;
	/** Extra CSS classes for container */
	className?: string;
	/** Callback when structural coherence percentage changes */
	onCoherenceChange?: (coherence: number) => void;
}

export const GranularText: React.FC<GranularTextProps> = ({
	text = "MORPH",
	radius = 65,
	force = 7,
	gravity = 0.35,
	cooldown = 100,
	recallSpeed = 0.14,
	color = "#ffffff",
	activeColorHex = "#f59e0b",
	recallColorHex = "#3b82f6",
	bgColor = "#0a0a0c",
	className = "",
	onCoherenceChange,
}) => {
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const mouseRef = useRef({
		x: -1000,
		y: -1000,
		vx: 0,
		vy: 0,
		lastX: 0,
		lastY: 0,
		active: false,
	});
	const particlesRef = useRef<SandParticle[]>([]);
	const lettersMetaRef = useRef<LetterMeta[]>([]);
	const letterFadesRef = useRef<number[]>([]); // Tracks smooth opacity transition (0 to 1) per letter
	const animationFrameId = useRef<number | null>(null);

	const settingsRef = useRef({
		radius,
		force,
		gravity,
		cooldown,
		recallSpeed,
		color,
		activeColorHex,
		recallColorHex,
		bgColor,
		text,
	});

	useEffect(() => {
		settingsRef.current = {
			radius,
			force,
			gravity,
			cooldown,
			recallSpeed,
			color,
			activeColorHex,
			recallColorHex,
			bgColor,
			text,
		};
	}, [
		radius,
		force,
		gravity,
		cooldown,
		recallSpeed,
		color,
		activeColorHex,
		recallColorHex,
		bgColor,
		text,
	]);

	const widthRef = useRef(0);
	const heightRef = useRef(0);

	const generateSandFromText = (
		width: number,
		height: number,
		targetWord: string,
	) => {
		if (width <= 0 || height <= 0) return;
		const offscreen = document.createElement("canvas");
		offscreen.width = width;
		offscreen.height = height;
		const oCtx = offscreen.getContext("2d");
		if (!oCtx) return;

		const fontSize = width < 640 ? 60 : 130;
		oCtx.font = `900 ${fontSize}px "Space Grotesk", -apple-system, sans-serif`;
		oCtx.textAlign = "center";
		oCtx.textBaseline = "middle";

		const letters = targetWord.split("");
		let totalWidth = 0;

		const metrics = letters.map((char) => {
			const w = oCtx.measureText(char).width;
			totalWidth += w;
			return { char, width: w };
		});

		const tracking = width < 640 ? 12 : 24;
		totalWidth += tracking * (letters.length - 1);

		let currentX = width / 2 - totalWidth / 2;
		const centerY = height / 2;

		const particles: SandParticle[] = [];
		const meta: LetterMeta[] = [];
		const step = width < 640 ? 3 : 4;

		metrics.forEach((m, letterIdx) => {
			const charCenterX = currentX + m.width / 2;
			meta.push({ char: m.char, x: charCenterX, y: centerY });

			oCtx.clearRect(0, 0, width, height);
			oCtx.fillStyle = "#ffffff";
			oCtx.fillText(m.char, charCenterX, centerY);

			const imgData = oCtx.getImageData(0, 0, width, height);
			const data = imgData.data;

			for (let y = 0; y < height; y += step) {
				for (let x = 0; x < width; x += step) {
					const alphaIndex = (y * width + x) * 4 + 3;
					if (data[alphaIndex] > 140) {
						particles.push({
							x,
							y,
							ox: x,
							oy: y,
							vx: 0,
							vy: 0,
							status: "crystalline",
							cooldown: 0,
							colorHex: "#ffffff",
							letterIndex: letterIdx,
						});
					}
				}
			}
			currentX += m.width + tracking;
		});

		lettersMetaRef.current = meta;
		particlesRef.current = particles;
		letterFadesRef.current = new Array(meta.length).fill(1);
	};

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const parent = canvas.parentElement;
		if (parent) {
			generateSandFromText(parent.clientWidth, parent.clientHeight, text);
		}
	}, [text]);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const resize = () => {
			const parent = canvas.parentElement;
			if (parent) {
				const width = parent.clientWidth;
				const height = parent.clientHeight;
				widthRef.current = width;
				heightRef.current = height;

				const dpr = window.devicePixelRatio || 1;
				canvas.width = width * dpr;
				canvas.height = height * dpr;
				canvas.style.width = `${width}px`;
				canvas.style.height = `${height}px`;

				const ctx = canvas.getContext("2d");
				if (ctx) {
					ctx.scale(dpr, dpr);
					generateSandFromText(width, height, text);
				}
			}
		};

		resize();
		window.addEventListener("resize", resize);
		return () => window.removeEventListener("resize", resize);
	}, [text]);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		const loop = () => {
			const parent = canvas.parentElement;
			if (!parent) {
				animationFrameId.current = requestAnimationFrame(loop);
				return;
			}

			const width = parent.clientWidth;
			const height = parent.clientHeight;
			const mouse = mouseRef.current;
			const cfg = settingsRef.current;

			// Handle dynamic resize if parent dimensions change (e.g. from 0 to real size)
			if (width !== widthRef.current || height !== heightRef.current) {
				widthRef.current = width;
				heightRef.current = height;

				const dpr = window.devicePixelRatio || 1;
				canvas.width = width * dpr;
				canvas.height = height * dpr;
				canvas.style.width = `${width}px`;
				canvas.style.height = `${height}px`;

				ctx.scale(dpr, dpr);
				if (width > 0 && height > 0) {
					generateSandFromText(width, height, cfg.text);
				}
			}

			if (width === 0 || height === 0) {
				animationFrameId.current = requestAnimationFrame(loop);
				return;
			}

			ctx.fillStyle = cfg.bgColor;
			ctx.fillRect(0, 0, width, height);

			if (mouse.active) {
				mouse.vx = mouse.x - mouse.lastX;
				mouse.vy = mouse.y - mouse.lastY;
			} else {
				mouse.vx *= 0.85;
				mouse.vy *= 0.85;
			}
			mouse.lastX = mouse.x;
			mouse.lastY = mouse.y;

			const particles = particlesRef.current;
			const lettersMeta = lettersMetaRef.current;
			const floorLine = height - 25;

			const totalCounts = new Array(lettersMeta.length).fill(0);
			const crystallineCounts = new Array(lettersMeta.length).fill(0);
			let stableCount = 0;

			particles.forEach((p) => {
				totalCounts[p.letterIndex]++;

				const dx = p.x - mouse.x;
				const dy = p.y - mouse.y;
				const dist = Math.sqrt(dx * dx + dy * dy);

				if (mouse.active && dist < cfg.radius) {
					p.status = "sand";
					p.cooldown = cfg.cooldown;

					const forceEnvelope = (cfg.radius - dist) / cfg.radius;
					const angle = Math.atan2(dy, dx);

					p.vx += Math.cos(angle) * forceEnvelope * cfg.force + mouse.vx * 0.25;
					p.vy += Math.sin(angle) * forceEnvelope * cfg.force + mouse.vy * 0.25;
					p.colorHex = cfg.activeColorHex;
				}

				if (p.status === "sand") {
					if (p.cooldown > 0) {
						p.cooldown--;
						p.vy += cfg.gravity;
						p.vx *= 0.96;
						p.vy *= 0.96;
						p.x += p.vx;
						p.y += p.vy;

						if (p.y >= floorLine) {
							p.y = floorLine;
							p.vy = -p.vy * 0.3;
							p.vx *= 0.7;
						}
					} else {
						const hdx = p.ox - p.x;
						const hdy = p.oy - p.y;
						const homeDist = Math.sqrt(hdx * hdx + hdy * hdy);

						if (homeDist < 0.6) {
							p.x = p.ox;
							p.y = p.oy;
							p.vx = 0;
							p.vy = 0;
							p.status = "crystalline";
							p.colorHex = cfg.color;
						} else {
							p.vx = hdx * cfg.recallSpeed;
							p.vy = hdy * cfg.recallSpeed;
							p.x += p.vx;
							p.y += p.vy;
							p.colorHex = cfg.recallColorHex;
						}
					}
				}

				if (p.status === "crystalline") {
					stableCount++;
					crystallineCounts[p.letterIndex]++;
				}
			});

			lettersMeta.forEach((_, idx) => {
				const isFullyAssembled =
					crystallineCounts[idx] === totalCounts[idx] && totalCounts[idx] > 0;

				if (isFullyAssembled) {
					letterFadesRef.current[idx] +=
						(1 - letterFadesRef.current[idx]) * 0.07;
				} else {
					letterFadesRef.current[idx] = 0;
				}
			});

			// Render Floor Guard
			ctx.strokeStyle = "rgba(239, 68, 68, 0.1)";
			ctx.lineWidth = 1;
			ctx.beginPath();
			ctx.moveTo(10, floorLine);
			ctx.lineTo(width - 10, floorLine);
			ctx.stroke();

			const fontSize = width < 640 ? 60 : 130;
			ctx.font = `900 ${fontSize}px "Space Grotesk", -apple-system, sans-serif`;
			ctx.textAlign = "center";
			ctx.textBaseline = "middle";

			lettersMeta.forEach((l, idx) => {
				const currentAlpha = letterFadesRef.current[idx];
				if (currentAlpha > 0.01) {
					ctx.save();
					ctx.globalAlpha = currentAlpha;
					ctx.fillStyle = cfg.color;
					ctx.shadowColor = "rgba(255, 255, 255, 0.15)";
					ctx.shadowBlur = 15 * currentAlpha;
					ctx.fillText(l.char, l.x, l.y);
					ctx.restore();
				}
			});

			particles.forEach((p) => {
				const associatedFade = letterFadesRef.current[p.letterIndex];
				if (associatedFade < 0.99) {
					ctx.save();
					ctx.globalAlpha = 1 - associatedFade;
					ctx.fillStyle = p.status === "crystalline" ? cfg.color : p.colorHex;
					const size = width < 640 ? 2 : 2.5;
					ctx.fillRect(p.x - size / 2, p.y - size / 2, size, size);
					ctx.restore();
				}
			});

			if (particles.length > 0 && onCoherenceChange) {
				const currentCoherence = Math.round(
					(stableCount / particles.length) * 100,
				);
				onCoherenceChange(currentCoherence);
			}

			animationFrameId.current = requestAnimationFrame(loop);
		};

		animationFrameId.current = requestAnimationFrame(loop);
		return () => {
			if (animationFrameId.current) {
				cancelAnimationFrame(animationFrameId.current);
			}
		};
	}, [onCoherenceChange]);

	const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const rect = canvas.getBoundingClientRect();
		mouseRef.current.x = e.clientX - rect.left;
		mouseRef.current.y = e.clientY - rect.top;
		mouseRef.current.active = true;
	};

	return (
		<div className={`relative w-full h-full select-none ${className}`}>
			<canvas
				ref={canvasRef}
				onPointerMove={handlePointerMove}
				onPointerLeave={() => {
					mouseRef.current.active = false;
				}}
				className="w-full h-full touch-none cursor-crosshair"
			/>
		</div>
	);
};

export default GranularText;
