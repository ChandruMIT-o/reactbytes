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

import React, { useEffect, useRef } from "react";
import { useInView } from "framer-motion";

export interface ScrambleRevealProps {
	/** The final text to be revealed */
	text: string;
	/** Characters to use during the scramble phase */
	scrambleChars?: string;
	/** Duration of the animation phase in seconds */
	duration?: number;
	/** Delay increment for the scramble start */
	scrambleStagger?: number;
	/** Delay increment for the final character reveal */
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
	const containerRef = useRef<HTMLDivElement>(null);
	const isInView = useInView(containerRef, { once: true, margin: "-50px" });

	useEffect(() => {
		if (!isInView || !containerRef.current) return;

		let frameRequest: number;
		let frame = 0;
		const queue: {
			from: string;
			to: string;
			start: number;
			end: number;
			char?: string;
			node?: HTMLElement;
		}[] = [];

		const charNodes = containerRef.current.querySelectorAll(".scramble-char");
		const length = displayText.length;

		for (let i = 0; i < length; i++) {
			const to = displayText[i] || "";
			const startFrame = Math.floor(i * (scrambleStagger * 60) + Math.random() * 20);
			const endFrame = Math.floor(
				startFrame + duration * 60 + i * (revealStagger * 60) + Math.random() * 20
			);

			queue.push({
				from: "",
				to,
				start: startFrame,
				end: endFrame,
				node: charNodes[i] as HTMLElement,
			});
		}

		const update = () => {
			let complete = 0;
			for (let i = 0, n = queue.length; i < n; i++) {
				let { to, start, end, node, char } = queue[i];
				if (!node) continue;

				if (frame >= end) {
					complete++;
					node.innerHTML = to === " " ? "&nbsp;" : to;
					node.style.color = color;
					node.style.opacity = "1";
					node.style.textShadow = \`0px 0px 15px \${color}\`;
					node.style.transform = "scale(1)";
					node.style.filter = "blur(0px)";
				} else if (frame >= start) {
					if (!char || Math.random() < 0.28) {
						char = scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
						queue[i].char = char;
					}
					node.innerHTML = char === " " ? "&nbsp;" : char;
					node.style.color = color;
					node.style.opacity = "0.7";
					node.style.textShadow = "none";
					node.style.transform = "scale(1.05)";
					node.style.filter = "blur(1px)";
				} else {
					node.innerHTML = "&nbsp;";
					node.style.opacity = "0";
				}
			}

			if (complete === queue.length) {
				setTimeout(() => {
					for (let i = 0; i < queue.length; i++) {
						const node = queue[i].node;
						if (node) {
							node.style.transition = "text-shadow 1s ease-in-out, filter 1s ease-in-out";
							node.style.textShadow = "none";
						}
					}
				}, 200);
			} else {
				frameRequest = requestAnimationFrame(update);
				frame++;
			}
		};

		frameRequest = requestAnimationFrame(update);

		return () => cancelAnimationFrame(frameRequest);
	}, [
		isInView,
		displayText,
		scrambleChars,
		duration,
		scrambleStagger,
		revealStagger,
		color,
	]);

	return (
		<div
			ref={containerRef}
			className={\`relative flex items-center justify-center select-none px-4 \${className}\`}
		>
			<span className="sr-only">{displayText}</span>
			<div
				className={\`flex items-baseline \${textClassName}\`}
				aria-hidden="true"
				style={{ letterSpacing }}
			>
				{displayText.split("").map((char, i) => (
					<div
						key={\`\${char}-\${i}\`}
						className="inline-grid grid-cols-1 grid-rows-1"
					>
						<span
							className="invisible col-start-1 row-start-1"
							aria-hidden="true"
						>
							{char === " " ? "\\u00A0" : char}
						</span>
						<span
							className="scramble-char col-start-1 row-start-1 opacity-0 block text-center"
							aria-hidden="true"
						>
							{char === " " ? "\\u00A0" : char}
						</span>
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

