"use client";

import React, { useEffect, useRef, useState } from "react";

interface LetterNode {
	char: string;
	x: number;
	y: number;
	ox: number;
	oy: number;
	vx: number;
	vy: number;
	rotation: number;
	vRotation: number;
	scale: number;
	vScale: number;
	alpha: number;
	width: number;
	entryTime: number;
	hasSpawned: boolean;
}

export interface KineticTextProps {
	/** The word/text to animate */
	text?: string;
	/** Foreground color of the letters */
	color?: string;
	/** Background color of the canvas */
	bgColor?: string;
	/** Color of the ribbon/string when interaction is active (dragging) */
	activeStrokeColor?: string;
	/** Color of the ribbon/string when not active */
	strokeColor?: string;
	/** Color of the resting home-base crosshair indicator */
	activeCrosshairColor?: string;
	/** Stagger delay in milliseconds between character entrances */
	staggerDelay?: number;
	/** Extra CSS class names for the canvas wrapper */
	className?: string;
}

export const KineticText: React.FC<KineticTextProps> = ({
	text = "KINETIC",
	color = "#ffffff",
	bgColor = "#09090b",
	activeStrokeColor = "rgba(0, 245, 255, 0.45)",
	strokeColor = "rgba(255, 255, 255, 0.08)",
	activeCrosshairColor = "rgba(255, 0, 110, 0.25)",
	staggerDelay = 80,
	className = "",
}) => {
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const mouseRef = useRef({ x: -1000, y: -1000, vx: 0, vy: 0, active: false });
	const prevMouseRef = useRef({ x: -1000, y: -1000 });
	const lettersRef = useRef<LetterNode[]>([]);
	const draggedIndexRef = useRef<number | null>(null);
	const animationFrameId = useRef<number | null>(null);

	const [isGrabbing, setIsGrabbing] = useState(false);

	// We store width and height to check for dimension changes in the animation loop
	const widthRef = useRef(0);
	const heightRef = useRef(0);

	const layoutLetters = (
		ctx: CanvasRenderingContext2D,
		width: number,
		height: number,
	): LetterNode[] => {
		const fontSize = width < 640 ? 65 : 125;
		ctx.font = `900 ${fontSize}px "Outfit", -apple-system, sans-serif`;
		ctx.textAlign = "left";
		ctx.textBaseline = "middle";

		const letters = text.split("");
		let totalWidth = 0;
		const metrics = letters.map((char) => {
			const w = ctx.measureText(char).width;
			totalWidth += w;
			return { char, width: w };
		});

		const tracking = width < 640 ? 8 : 16;
		totalWidth += tracking * (letters.length - 1);

		let currentX = width / 2 - totalWidth / 2;
		const centerY = height / 2;

		const now = performance.now();

		return metrics.map((m, index) => {
			const charCenterX = currentX + m.width / 2;
			currentX += m.width + tracking;

			return {
				char: m.char,
				x: charCenterX,
				y: centerY - 160,
				ox: charCenterX,
				oy: centerY,
				vx: 0,
				vy: 0,
				rotation: -0.4,
				vRotation: 0,
				scale: 0,
				vScale: 0,
				alpha: 0,
				width: m.width,
				entryTime: now + index * staggerDelay,
				hasSpawned: false,
			};
		});
	};

	const triggerCinematicEntrance = () => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		const parent = canvas.parentElement;
		if (parent) {
			draggedIndexRef.current = null;
			setIsGrabbing(false);
			lettersRef.current = layoutLetters(
				ctx,
				parent.clientWidth,
				parent.clientHeight,
			);
		}
	};

	// Re-layout when text or staggerDelay changes
	useEffect(() => {
		triggerCinematicEntrance();
	}, [text, staggerDelay]);

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
					lettersRef.current = layoutLetters(ctx, width, height);
				}
			}
		};

		resize();
		window.addEventListener("resize", resize);
		return () => window.removeEventListener("resize", resize);
	}, [text, staggerDelay]);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		const loop = (timestamp: number) => {
			const parent = canvas.parentElement;
			if (!parent) {
				animationFrameId.current = requestAnimationFrame(loop);
				return;
			}

			const width = parent.clientWidth;
			const height = parent.clientHeight;

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
					lettersRef.current = layoutLetters(ctx, width, height);
				}
			}

			if (width === 0 || height === 0) {
				animationFrameId.current = requestAnimationFrame(loop);
				return;
			}

			ctx.fillStyle = bgColor;
			ctx.fillRect(0, 0, width, height);

			const mouse = mouseRef.current;
			const letters = lettersRef.current;
			const draggedIndex = draggedIndexRef.current;

			// Track relative mouse velocity
			if (mouse.active && prevMouseRef.current.x !== -1000) {
				mouse.vx = (mouse.x - prevMouseRef.current.x) * 0.4;
				mouse.vy = (mouse.y - prevMouseRef.current.y) * 0.4;
			} else {
				mouse.vx *= 0.8;
				mouse.vy *= 0.8;
			}
			prevMouseRef.current.x = mouse.x;
			prevMouseRef.current.y = mouse.y;

			const timeSec = timestamp * 0.002;
			const fontSize = width < 640 ? 65 : 125;
			ctx.font = `900 ${fontSize}px "Outfit", -apple-system, sans-serif`;
			ctx.textAlign = "center";
			ctx.textBaseline = "middle";

			// 1. DRAW CUSTOM INDICATOR (The Sticky Elastic Rope System)
			const spawnedLetters = letters.filter((l) => timestamp >= l.entryTime);
			if (spawnedLetters.length > 1) {
				ctx.save();
				ctx.beginPath();
				ctx.moveTo(spawnedLetters[0].x, spawnedLetters[0].y);
				for (let i = 1; i < spawnedLetters.length; i++) {
					ctx.lineTo(spawnedLetters[i].x, spawnedLetters[i].y);
				}
				ctx.lineWidth = draggedIndex !== null ? 2.5 : 1.2;
				ctx.strokeStyle =
					draggedIndex !== null ? activeStrokeColor : strokeColor;
				if (draggedIndex !== null) ctx.setLineDash([4, 4]); // Kinetic tension dash style
				ctx.stroke();
				ctx.restore();
			}

			// Draw anchor target crosshair if pulling a specific node
			if (draggedIndex !== null && letters[draggedIndex]) {
				const targetNode = letters[draggedIndex];
				ctx.save();
				ctx.strokeStyle = activeCrosshairColor;
				ctx.lineWidth = 1;
				ctx.beginPath();
				ctx.arc(targetNode.ox, targetNode.oy, 8, 0, Math.PI * 2);
				ctx.moveTo(targetNode.ox - 15, targetNode.oy);
				ctx.lineTo(targetNode.ox + 15, targetNode.oy);
				ctx.moveTo(targetNode.ox, targetNode.oy - 15);
				ctx.lineTo(targetNode.ox, targetNode.oy + 15);
				ctx.stroke();
				ctx.restore();
			}

			// 2. CORE PHYSICS MASS-SPRING LOOP
			letters.forEach((p, i) => {
				if (timestamp < p.entryTime) return;

				if (!p.hasSpawned) {
					p.hasSpawned = true;
					p.vy = 12;
					p.vRotation = 0.15;
					p.scale = 0.1;
					p.alpha = 1;
				}

				// If this specific letter is captured by user, pin its positions instantly to the trackpad/mouse
				if (i === draggedIndex) {
					p.x = mouse.x;
					p.y = mouse.y;
					p.vx = mouse.vx;
					p.vy = mouse.vy;

					p.rotation = p.rotation * 0.8 + mouse.vx * 0.02 * 0.2;
					p.scale = p.scale * 0.8 + 1.05 * 0.2;
					return;
				}

				const ambientY = Math.sin(timeSec + p.ox * 0.02) * 1.2;

				let fx = (p.ox - p.x) * 0.06;
				let fy = (p.oy + ambientY - p.y) * 0.06;

				const stringStiffness = 0.045;
				if (i > 0) {
					const prev = letters[i - 1];
					const restDist = p.ox - prev.ox;
					fx += (prev.x + restDist - p.x) * stringStiffness;
					fy += (prev.y - p.y) * stringStiffness;
				}
				if (i < letters.length - 1) {
					const next = letters[i + 1];
					const restDist = next.ox - p.ox;
					fx += (next.x - restDist - p.x) * stringStiffness;
					fy += (next.y - p.y) * stringStiffness;
				}

				const drag = 0.82;
				p.vx = (p.vx + fx) * drag;
				p.vy = (p.vy + fy) * drag;

				p.vRotation = (p.vRotation + (0 - p.rotation) * 0.055) * 0.84;
				p.rotation += p.vRotation;

				p.vScale = (p.vScale + (1 - p.scale) * 0.06) * 0.8;
				p.scale += p.vScale;

				if (draggedIndex === null && mouse.active) {
					const mdx = p.x - mouse.x;
					const mdy = p.y - mouse.y;
					const dist = Math.sqrt(mdx * mdx + mdy * mdy);
					const radius = width < 640 ? 60 : 110;

					if (dist < radius) {
						const force = (radius - dist) / radius;
						const angle = Math.atan2(mdy, mdx);

						p.vx += Math.cos(angle) * force * 3.0;
						p.vy += Math.sin(angle) * force * 3.0;
						p.vRotation += Math.sin(angle - Math.PI / 2) * force * 0.2;
					}
				}

				p.x += p.vx;
				p.y += p.vy;
			});

			// 3. RENDER PASS WITH SQUASH AND STRETCH DISTORTION MATRIX
			letters.forEach((p, i) => {
				if (timestamp < p.entryTime) return;

				ctx.save();

				const disX = p.x - p.ox;
				const disY = p.y - p.oy;
				const tension = Math.sqrt(disX * disX + disY * disY);

				ctx.translate(p.x, p.y);

				if (tension > 2) {
					const stretchAngle = Math.atan2(disY, disX);
					const stretchFactor = Math.min(1 + tension * 0.0035, 1.9);
					const squashFactor = 1 / Math.sqrt(stretchFactor);

					ctx.rotate(stretchAngle);
					ctx.scale(stretchFactor, squashFactor);
					ctx.rotate(-stretchAngle);
				}

				ctx.rotate(p.rotation);
				ctx.scale(p.scale, p.scale);

				const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
				const splitIntensity = Math.min(speed * 0.95, i === draggedIndex ? 6 : 22);
				const motionAngle = speed > 0.15 ? Math.atan2(p.vy, p.vx) : 0;

				if (splitIntensity > 0.6) {
					ctx.globalCompositeOperation = "screen";
					const shiftX = Math.cos(motionAngle) * splitIntensity * 0.65;
					const shiftY = Math.sin(motionAngle) * splitIntensity * 0.65;

					ctx.fillStyle = "rgba(0, 245, 255, 0.9)";
					ctx.fillText(p.char, -shiftX, -shiftY);

					ctx.fillStyle = "rgba(255, 0, 110, 0.9)";
					ctx.fillText(p.char, shiftX, shiftY);

					ctx.fillStyle = color;
					ctx.fillText(p.char, 0, 0);
				} else {
					ctx.fillStyle = color;
					ctx.fillText(p.char, 0, 0);
				}

				ctx.restore();
				ctx.globalCompositeOperation = "source-over";
			});

			animationFrameId.current = requestAnimationFrame(loop);
		};

		animationFrameId.current = requestAnimationFrame(loop);
		return () => {
			if (animationFrameId.current) {
				cancelAnimationFrame(animationFrameId.current);
			}
		};
	}, [color, bgColor, activeStrokeColor, strokeColor, activeCrosshairColor]);

	const updateMousePos = (clientX: number, clientY: number) => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const rect = canvas.getBoundingClientRect();
		mouseRef.current.x = clientX - rect.left;
		mouseRef.current.y = clientY - rect.top;
		mouseRef.current.active = true;
	};

	const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		canvas.setPointerCapture(e.pointerId);

		const rect = canvas.getBoundingClientRect();
		const mx = e.clientX - rect.left;
		const my = e.clientY - rect.top;

		mouseRef.current.x = mx;
		mouseRef.current.y = my;
		mouseRef.current.active = true;

		let closestIndex = -1;
		let closestDist = 45;

		lettersRef.current.forEach((p, index) => {
			const dx = p.x - mx;
			const dy = p.y - my;
			const dist = Math.sqrt(dx * dx + dy * dy);
			if (dist < closestDist) {
				closestDist = dist;
				closestIndex = index;
			}
		});

		if (closestIndex !== -1) {
			draggedIndexRef.current = closestIndex;
			setIsGrabbing(true);
		}
	};

	const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
		updateMousePos(e.clientX, e.clientY);
	};

	const handlePointerUp = () => {
		draggedIndexRef.current = null;
		setIsGrabbing(false);
	};

	return (
		<div className={`relative w-full h-full select-none ${className}`}>
			<canvas
				ref={canvasRef}
				onPointerDown={handlePointerDown}
				onPointerMove={handlePointerMove}
				onPointerUp={handlePointerUp}
				onPointerLeave={() => {
					mouseRef.current.active = false;
					prevMouseRef.current = { x: -1000, y: -1000 };
					handlePointerUp();
				}}
				style={{ cursor: isGrabbing ? "grabbing" : "grab" }}
				className="w-full h-full touch-none"
			/>
		</div>
	);
};

export default KineticText;
