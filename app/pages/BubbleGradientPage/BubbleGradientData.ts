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
		],
	},
];

export const componentCode = `"use client";

import React, { CSSProperties, useEffect, useId, useMemo, useRef } from "react";

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
	className?: string;
	children?: React.ReactNode;
}

export const BubbleGradient: React.FC<BubbleGradientProps> = ({
	backgroundStart = "#050608",
	backgroundEnd = "#171B21",
	bubbleColors = ["#F6F7F8", "#CDD2D8", "#9AA2AD", "#5B6470", "#262C33"],
	interactiveColor = "#FFFFFF",
	circleSize = 78,
	blurStrength = 40,
	gooBlur = 10,
	gooStrength = 18,
	gooOffset = -8,
	speedMultiplier = 1,
	blendMode = "screen",
	children,
}) => {
	const filterId = useId().replace(/:/g, "");
	const containerRef = useRef<HTMLDivElement>(null);
	const interactiveRef = useRef<HTMLDivElement>(null);
	const targetRef = useRef({ x: 0, y: 0 });
	const currentRef = useRef({ x: 0, y: 0 });

	useEffect(() => {
		let frame = 0;

		const tick = () => {
			currentRef.current.x += (targetRef.current.x - currentRef.current.x) * 0.12;
			currentRef.current.y += (targetRef.current.y - currentRef.current.y) * 0.12;

			if (interactiveRef.current) {
				interactiveRef.current.style.transform = \`translate(\${currentRef.current.x - 280}px, \${currentRef.current.y - 280}px)\`;
			}

			frame = window.requestAnimationFrame(tick);
		};

		frame = window.requestAnimationFrame(tick);
		return () => window.cancelAnimationFrame(frame);
	}, []);

	return (
		<div ref={containerRef} className="relative w-full h-full overflow-hidden">
			<svg className="absolute w-0 h-0" aria-hidden="true">
				<defs>
					<filter id={filterId}>
						<feGaussianBlur in="SourceGraphic" stdDeviation={gooBlur} result="blur" />
						<feColorMatrix
							in="blur"
							mode="matrix"
							values={\`1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 \${gooStrength} \${gooOffset}\`}
							result="goo"
						/>
						<feBlend in="SourceGraphic" in2="goo" />
					</filter>
				</defs>
			</svg>

			<div
				className="absolute inset-0"
				style={{
					background: \`linear-gradient(32deg, \${backgroundStart}, \${backgroundEnd})\`,
				}}
			/>

			<div
				className="absolute inset-0"
				style={{
					filter: \`url(#\${filterId}) blur(\${blurStrength}px)\`,
				}}
			>
				{bubbleColors.map((color, index) => (
					<div
						key={index}
						className="absolute"
						style={{
							width: \`\${circleSize}%\`,
							height: \`\${circleSize}%\`,
							mixBlendMode: blendMode,
							background: \`radial-gradient(circle at center, \${color} 0%, transparent 62%)\`,
						}}
					/>
				))}

				<div
					ref={interactiveRef}
					className="absolute pointer-events-none"
					style={{
						width: 560,
						height: 560,
						mixBlendMode: blendMode,
						background: \`radial-gradient(circle at center, \${interactiveColor} 0%, transparent 68%)\`,
					}}
				/>
			</div>

			{children ? (
				<div className="absolute inset-0 flex items-center justify-center pointer-events-none">
					{children}
				</div>
			) : null}
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
