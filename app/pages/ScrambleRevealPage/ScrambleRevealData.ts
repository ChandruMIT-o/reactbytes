export const loaderProps = [
	{
		title: "Core Props",
		props: [
			{
				name: "text",
				type: "string",
				defaultValue: "'CREATIVE'",
				description: "The target text to reveal.",
			},
			{
				name: "scrambleChars",
				type: "string",
				defaultValue: "'ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*'",
				description: "Characters used during the scramble phase.",
			},
			{
				name: "duration",
				type: "number",
				defaultValue: "0.8",
				description: "Duration of each animation phase in seconds.",
			},
			{
				name: "scrambleStagger",
				type: "number",
				defaultValue: "0.05",
				description: "Delay increment for the initial scramble appearance.",
			},
			{
				name: "revealStagger",
				type: "number",
				defaultValue: "0.1",
				description: "Delay increment for the final character reveal.",
			},
			{
				name: "color",
				type: "string",
				defaultValue: "'#E8EAF0'",
				description: "The base color of the text letters.",
			},
			{
				name: "uppercase",
				type: "boolean",
				defaultValue: "false",
				description: "Whether to force the text to uppercase.",
			},
		],
	},
	{
		title: "Styling Props",
		props: [
			{
				name: "textClassName",
				type: "string",
				defaultValue: "'text-6xl md:text-9xl font-bold font-mono leading-[0.75]'",
				description: "Extra classes for font style and size.",
			},
			{
				name: "letterSpacing",
				type: "string",
				defaultValue: "'0em'",
				description: "Manual letter spacing adjustment.",
			},
		],
	},
];

export const componentCode = `"use client";

import React, { useMemo, useEffect, useRef } from "react";
import { motion, useAnimation, useInView } from "framer-motion";

export interface ScrambleRevealProps {
	/** The final text to be revealed */
	text: string;
	/** Characters to use during the scramble phase */
	scrambleChars?: string;
	/** Duration of each animation phase in seconds */
	duration?: number;
	/** Delay increment for the first phase (scramble reveal) */
	scrambleStagger?: number;
	/** Delay increment for the second phase (actual reveal) */
	revealStagger?: number;
	/** Hex color for the text color */
	color?: string;
	/** Additional wrapper CSS classes */
	className?: string;
	/** Additional text container CSS classes */
	textClassName?: string;
	/** Manual letter spacing adjustment */
	letterSpacing?: string;
	/** Whether to force uppercase text */
	uppercase?: boolean;
}

export const ScrambleReveal: React.FC<ScrambleRevealProps> = ({
	text = "CREATIVE",
	scrambleChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*",
	duration = 0.8,
	scrambleStagger = 0.05,
	revealStagger = 0.1,
	color = "#E8EAF0",
	className = "",
	textClassName = "text-6xl md:text-9xl font-bold font-mono leading-[0.75]",
	letterSpacing = "0em",
	uppercase = false,
}) => {
	const displayText = uppercase ? text.toUpperCase() : text;
	const letters = displayText.split("");
	const containerRef = useRef<HTMLDivElement>(null);
	const isInView = useInView(containerRef, { once: true, margin: "-100px" });
	const controls = useAnimation();

	// Generate a stable random scramble character for each position
	const randomScrambleChars = useMemo(() => {
		return letters.map(() => scrambleChars[Math.floor(Math.random() * scrambleChars.length)]);
	}, [displayText, scrambleChars]);

	useEffect(() => {
		if (isInView) {
			const runSequence = async () => {
				// Phase 1: Reveal the "Scramble" character (Slide to 0%)
				await controls.start((i) => ({
					y: "0%",
					transition: {
						duration: duration,
						delay: i * scrambleStagger,
						ease: [0.19, 1, 0.22, 1], // expoOut
					},
				}));

				// Phase 2: Reveal the "Target" character (Slide to 100%)
				await controls.start((i) => ({
					y: "100%",
					transition: {
						duration: duration,
						delay: i * revealStagger,
						ease: [0.19, 1, 0.22, 1], // expoOut
					},
				}));
			};
			runSequence();
		}
	}, [isInView, controls, duration, scrambleStagger, revealStagger]);

	return (
		<div
			ref={containerRef}
			className={\`relative flex items-center justify-center overflow-hidden select-none px-4 \${className}\`}
		>
			<span className="sr-only">{displayText}</span>
			<div
				className={\`flex items-baseline \${textClassName}\`}
				aria-hidden="true"
				style={{ letterSpacing, color }}
			>
				{letters.map((char, i) => (
					<div
						key={\`\${char}-\${i}\`}
						className="relative overflow-hidden inline-block"
					>
						<motion.div
							custom={i}
							initial={{ y: "-100%" }}
							animate={controls}
							className="relative flex flex-col items-center"
						>
							<span
								className="absolute bottom-full left-0 w-full text-center"
								style={{ color }}
							>
								{char === " " ? "\\u00A0" : char}
							</span>

							<span
								className="relative block opacity-60"
								style={{ color }}
							>
								{char === " " ? "\\u00A0" : randomScrambleChars[i]}
							</span>
						</motion.div>
					</div>
				))}
			</div>
		</div>
	);
};

export default ScrambleReveal;`;

export const creditsData = [
	{
		title: "Component Source",
		items: [
			{
				name: "GSAP Scramble CSS",
				role: "Animation Concept",
				url: "https://codepen.io/osublake/pen/XWwjYmO",
			},
			{
				name: "React Bytes",
				role: "Implementation",
				url: "https://reactbytes.dev",
			},
		],
	},
	{
		title: "Open Source Libraries",
		items: [
			{
				name: "Framer Motion",
				role: "Animations",
				url: "https://www.framer.com/motion/",
			},
			{
				name: "React",
				role: "UI Library",
				url: "https://react.dev",
			},
		],
	},
];

