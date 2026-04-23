export const loaderProps = [
	{
		title: "Color Props",
		props: [
			{
				name: "backgroundStart",
				type: "string",
				defaultValue: "'#050608'",
				description: "Starting color for the dark background gradient.",
			},
			{
				name: "backgroundEnd",
				type: "string",
				defaultValue: "'#171B21'",
				description: "Ending color for the dark background gradient.",
			},
			{
				name: "bubbleColors",
				type: "string[]",
				defaultValue:
					"['#F6F7F8', '#CDD2D8', '#9AA2AD', '#5B6470', '#262C33']",
				description:
					"Five layered bubble colors. By default the palette stays grayscale for dark UI.",
			},
			{
				name: "interactiveColor",
				type: "string",
				defaultValue: "'#FFFFFF'",
				description:
					"Highlight color for the cursor-following glow bubble.",
			},
		],
	},
	{
		title: "Motion and Goo Props",
		props: [
			{
				name: "circleSize",
				type: "number",
				defaultValue: "78",
				description:
					"Base bubble size as a percentage of the container.",
			},
			{
				name: "speedMultiplier",
				type: "number",
				defaultValue: "1",
				description:
					"Scales the animation speed for all background bubbles.",
			},
			{
				name: "blurStrength",
				type: "number",
				defaultValue: "40",
				description:
					"Additional blur applied after the goo filter for a softer cloud effect.",
			},
			{
				name: "gooBlur",
				type: "number",
				defaultValue: "10",
				description:
					"Blur amount inside the SVG goo filter before the bubbles merge.",
			},
			{
				name: "gooStrength",
				type: "number",
				defaultValue: "18",
				description:
					"Controls how aggressively overlapping bubbles fuse together.",
			},
			{
				name: "gooOffset",
				type: "number",
				defaultValue: "-8",
				description:
					"Threshold offset for the goo filter. Lower values create denser merging.",
			},
		],
	},
	{
		title: "Finishing and Interaction Props",
		props: [
			{
				name: "blendMode",
				type: "CSSProperties['mixBlendMode']",
				defaultValue: "'screen'",
				description:
					"Blend mode used for all bubble layers. Great for tuning dark-theme mood.",
			},
			{
				name: "interactiveRadius",
				type: "number",
				defaultValue: "280",
				description:
					"Radius of the cursor-following highlight bubble in pixels.",
			},
			{
				name: "interactiveFollow",
				type: "number",
				defaultValue: "0.12",
				description:
					"Follow smoothing for the interactive bubble. Lower feels floatier.",
			},
			{
				name: "bubbleOpacity",
				type: "number",
				defaultValue: "0.84",
				description: "Master opacity multiplier for the animated layers.",
			},
			{
				name: "interactiveOpacity",
				type: "number",
				defaultValue: "0.7",
				description:
					"Opacity of the interactive cursor glow bubble.",
			},
			{
				name: "contrast",
				type: "number",
				defaultValue: "118",
				description:
					"Final contrast applied to the merged bubble stack.",
			},
			{
				name: "brightness",
				type: "number",
				defaultValue: "94",
				description:
					"Final brightness applied to the merged bubble stack.",
			},
			{
				name: "saturation",
				type: "number",
				defaultValue: "72",
				description:
					"Final saturation applied to the merged bubble stack.",
			},
			{
				name: "noiseOpacity",
				type: "number",
				defaultValue: "0.08",
				description:
					"Opacity of the subtle texture overlay used to stop the background from feeling flat.",
			},
			{
				name: "vignetteOpacity",
				type: "number",
				defaultValue: "0.26",
				description:
					"Strength of the outer vignette used to frame the composition.",
			},
			{
				name: "uppercase",
				type: "boolean",
				defaultValue: "false",
				description: "Whether to force overlay text to uppercase.",
			},
		],
	},
];

export const componentCode = `"use client";

import React, { CSSProperties, useEffect, useId, useMemo, useRef } from "react";

const clamp = (value: number, min: number, max: number) =>
	Math.min(max, Math.max(min, value));

const toRgb = (color: string) => {
	const normalized = color.replace("#", "").trim();
	if (normalized.length === 3) {
		return normalized.split("").map((part) => parseInt(\\\`\\\${part}\\\${part}\\\`, 16)) as [number, number, number];
	}
	if (normalized.length === 6) {
		return [
			parseInt(normalized.slice(0, 2), 16),
			parseInt(normalized.slice(2, 4), 16),
			parseInt(normalized.slice(4, 6), 16),
		] as [number, number, number];
	}
	return [255, 255, 255] as [number, number, number];
};

const withAlpha = (color: string, alpha: number) => {
	const [r, g, b] = toRgb(color);
	return \\\`rgba(\\\${r}, \\\${g}, \\\${b}, \\\${alpha})\\\`;
};

const baseLayerConfigs: any[] = [
	{ key: "g1", top: "calc(50% - var(--bubble-size) / 2)", left: "calc(50% - var(--bubble-size) / 2)", origin: "center center", animation: "vertical", duration: 30, easing: "ease-in-out", scale: 1, opacity: 1 },
	{ key: "g2", top: "calc(50% - var(--bubble-size) / 2)", left: "calc(50% - var(--bubble-size) / 2)", origin: "calc(50% - 420px)", animation: "circleReverse", duration: 20, easing: "linear", scale: 1, opacity: 0.92 },
	{ key: "g3", top: "calc(50% - var(--bubble-size) / 2 + 18%)", left: "calc(50% - var(--bubble-size) / 2 - 38%)", origin: "calc(50% + 380px)", animation: "circle", duration: 42, easing: "linear", scale: 1, opacity: 0.88 },
	{ key: "g4", top: "calc(50% - var(--bubble-size) / 2 - 2%)", left: "calc(50% - var(--bubble-size) / 2)", origin: "calc(50% - 220px)", animation: "horizontal", duration: 38, easing: "ease-in-out", scale: 1, opacity: 0.7 },
	{ key: "g5", top: "calc(50% - var(--bubble-size))", left: "calc(50% - var(--bubble-size))", origin: "calc(50% - 760px) calc(50% + 180px)", animation: "circle", duration: 24, easing: "ease-in-out", scale: 1.9, opacity: 0.82 },
];

export interface BubbleGradientProps {
	backgroundStart?: string;
	backgroundEnd?: string;
	backgroundAngle?: number;
	bubbleColors?: string[];
	interactiveColor?: string;
	circleSize?: number;
	blurStrength?: number;
	gooBlur?: number;
	gooStrength?: number;
	gooOffset?: number;
	bubbleOpacity?: number;
	interactiveOpacity?: number;
	interactiveRadius?: number;
	interactiveFollow?: number;
	speedMultiplier?: number;
	blendMode?: CSSProperties["mixBlendMode"];
	contrast?: number;
	brightness?: number;
	saturation?: number;
	noiseOpacity?: number;
	vignetteOpacity?: number;
	uppercase?: boolean;
	className?: string;
	children?: React.ReactNode;
}

export const BubbleGradient: React.FC<BubbleGradientProps> = ({
	backgroundStart = "#050608",
	backgroundEnd = "#171B21",
	backgroundAngle = 32,
	bubbleColors = ["#F6F7F8", "#CDD2D8", "#9AA2AD", "#5B6470", "#262C33"],
	interactiveColor = "#FFFFFF",
	circleSize = 78,
	blurStrength = 40,
	gooBlur = 10,
	gooStrength = 18,
	gooOffset = -8,
	bubbleOpacity = 0.84,
	interactiveOpacity = 0.7,
	interactiveRadius = 280,
	interactiveFollow = 0.12,
	speedMultiplier = 1,
	blendMode = "screen",
	contrast = 118,
	brightness = 94,
	saturation = 72,
	noiseOpacity = 0.08,
	vignetteOpacity = 0.26,
	uppercase = false,
	className = "",
	children,
}) => {
	const filterId = useId().replace(/:/g, "");
	const containerRef = useRef<HTMLDivElement>(null);
	const interactiveRef = useRef<HTMLDivElement>(null);
	const targetRef = useRef({ x: 0, y: 0 });
	const currentRef = useRef({ x: 0, y: 0 });
	const rafRef = useRef<number | null>(null);

	const layers = useMemo(() => {
		return baseLayerConfigs.map((layer, index) => ({
			...layer,
			color: bubbleColors[index] ?? bubbleColors[bubbleColors.length - 1] ?? "#FFFFFF",
			duration: layer.duration / clamp(speedMultiplier, 0.2, 3),
			opacity: layer.opacity * bubbleOpacity,
		}));
	}, [bubbleColors, bubbleOpacity, speedMultiplier]);

	useEffect(() => {
		const setCenter = () => {
			const container = containerRef.current;
			if (!container) return;
			const rect = container.getBoundingClientRect();
			const center = { x: rect.width / 2, y: rect.height / 2 };
			targetRef.current = center;
			if (currentRef.current.x === 0 && currentRef.current.y === 0) currentRef.current = center;
		};

		const tick = () => {
			const interactive = interactiveRef.current;
			if (interactive) {
				currentRef.current.x += (targetRef.current.x - currentRef.current.x) * clamp(interactiveFollow, 0.02, 0.3);
				currentRef.current.y += (targetRef.current.y - currentRef.current.y) * clamp(interactiveFollow, 0.02, 0.3);
				interactive.style.transform = \\\`translate(\\\${currentRef.current.x - interactiveRadius}px, \\\${currentRef.current.y - interactiveRadius}px)\\\`;
			}
			rafRef.current = window.requestAnimationFrame(tick);
		};

		setCenter();
		rafRef.current = window.requestAnimationFrame(tick);
		window.addEventListener("resize", setCenter);
		return () => {
			window.removeEventListener("resize", setCenter);
			if (rafRef.current !== null) window.cancelAnimationFrame(rafRef.current);
		};
	}, [interactiveFollow, interactiveRadius]);

	return (
		<div
			ref={containerRef}
			onPointerMove={(e) => {
				const r = containerRef.current?.getBoundingClientRect();
				if (r) targetRef.current = { x: e.clientX - r.left, y: e.clientY - r.top };
			}}
			onPointerLeave={() => {
				const r = containerRef.current?.getBoundingClientRect();
				if (r) targetRef.current = { x: r.width / 2, y: r.height / 2 };
			}}
			className=\\\`relative isolate w-full h-full overflow-hidden bg-black \\\${className}\\\`
			style={{ "--bubble-size": \\\`\\\${circleSize}%\\\` } as any}
		>
			<svg className="absolute w-0 h-0" aria-hidden="true">
				<defs>
					<filter id={filterId}>
						<feGaussianBlur in="SourceGraphic" stdDeviation={gooBlur} result="blur" />
						<feColorMatrix in="blur" mode="matrix" values=\\\`1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 \\\${gooStrength} \\\${gooOffset}\\\` result="goo" />
						<feBlend in="SourceGraphic" in2="goo" />
					</filter>
				</defs>
			</svg>
			<div className="absolute inset-0" style={{ background: \\\`linear-gradient(\\\${backgroundAngle}deg, \\\${backgroundStart}, \\\${backgroundEnd})\\\` }} />
			<div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.12), transparent 28%), linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)", backgroundSize: "auto, auto, 24px 24px, 24px 24px", opacity: noiseOpacity }} />
			<div className="absolute inset-0" style={{ filter: \\\`url(#\\\${filterId}) blur(\\\${blurStrength}px) saturate(\\\${saturation}%) contrast(\\\${contrast}%) brightness(\\\${brightness}%)\\\` }}>
				{layers.map((layer) => (
					<div key={layer.key} className=\\\`absolute bubble-layer \\\${layer.animation}\\\` style={{ width: \\\`calc(var(--bubble-size) * \\\${layer.scale})\\\`, height: \\\`calc(var(--bubble-size) * \\\${layer.scale})\\\`, top: layer.top, left: layer.left, transformOrigin: layer.origin, opacity: layer.opacity, mixBlendMode: blendMode, animationDuration: \\\`\\\${layer.duration}s\\\`, animationTimingFunction: layer.easing, background: \\\`radial-gradient(circle at center, \\\${withAlpha(layer.color, 0.92)} 0%, \\\${withAlpha(layer.color, 0.48)} 22%, \\\${withAlpha(layer.color, 0)} 62%)\\\` }} />
				))}
				<div ref={interactiveRef} className="absolute pointer-events-none" style={{ width: interactiveRadius * 2, height: interactiveRadius * 2, opacity: interactiveOpacity, mixBlendMode: blendMode, background: \\\`radial-gradient(circle at center, \\\${withAlpha(interactiveColor, 0.88)} 0%, \\\${withAlpha(interactiveColor, 0.4)} 26%, \\\${withAlpha(interactiveColor, 0)} 68%)\\\` }} />
			</div>
			{children ? <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">{children}</div> : null}
			<style jsx>{\\\`
				.bubble-layer { background-repeat: no-repeat; animation-iteration-count: infinite; will-change: transform; }
				.vertical { animation-name: moveVertical; }
				.horizontal { animation-name: moveHorizontal; }
				.circle { animation-name: moveInCircle; }
				.circleReverse { animation-name: moveInCircleReverse; }
				@keyframes moveInCircle { 0% { transform: rotate(0deg); } 50% { transform: rotate(180deg); } 100% { transform: rotate(360deg); } }
				@keyframes moveInCircleReverse { 0% { transform: rotate(360deg); } 50% { transform: rotate(180deg); } 100% { transform: rotate(0deg); } }
				@keyframes moveVertical { 0% { transform: translateY(-48%); } 50% { transform: translateY(48%); } 100% { transform: translateY(-48%); } }
				@keyframes moveHorizontal { 0% { transform: translateX(-52%) translateY(-10%); } 50% { transform: translateX(48%) translateY(12%); } 100% { transform: translateX(-52%) translateY(-10%); } }
			\\\`}</style>
		</div>
	);
};

export default BubbleGradient;`;

export const creditsData = [
	{
		title: "Visual Direction",
		items: [
			{
				name: "Gooey Bubble Gradient",
				role: "Reference Style",
				url: "https://css-tricks.com/gooey-effect/",
			},
		],
	},
	{
		title: "Project",
		items: [
			{
				name: "React Bytes",
				role: "Component Collection",
				url: "https://reactbytes.dev",
			},
		],
	},
];
