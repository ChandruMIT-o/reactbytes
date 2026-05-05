export const loaderProps = [
	{
		title: "Core Props",
		props: [
			{
				name: "text",
				type: "string",
				defaultValue: "'REACTBYTES'",
				description: "The text context to animate.",
			},
			{
				name: "duration",
				type: "number",
				defaultValue: "0.6",
				description: "Animation duration for each letter in seconds.",
			},
			{
				name: "stagger",
				type: "number",
				defaultValue: "0.02",
				description: "Delay increment between characters in seconds.",
			},
			{
				name: "direction",
				type: "'up' | 'down'",
				defaultValue: "'up'",
				description: "The direction letters roll towards.",
			},
			{
				name: "baseColor",
				type: "string",
				defaultValue: "'#60a5fa'",
				description: "The initial color of the text.",
			},
			{
				name: "hoverColor",
				type: "string",
				defaultValue: "'#FFFFFF'",
				description: "The color of the text when revealed on hover.",
			},
			{
				name: "uppercase",
				type: "boolean",
				defaultValue: "false",
				description: "Whether to force the text to uppercase.",
			},
			{
				name: "animateFrom",
				type: "'left' | 'right' | 'center' | 'hover'",
				defaultValue: "'left'",
				description: "Determines the origin of the wave animation.",
			},
		],
	},
	{
		title: "Styling Props",
		props: [
			{
				name: "textClassName",
				type: "string",
				defaultValue: "'text-5xl md:text-7xl font-bold font-sans tracking-tighter'",
				description: "Extra classes for font style and size.",
			},
		],
	},
];

export const componentCode = `"use client";

import React, { useState } from "react";
import { motion, Variants } from "framer-motion";

export interface ElasticRevealProps {
	/** The text to display */
	text: string;
	/** Duration of the animation per letter in seconds */
	duration?: number;
	/** Delay between each character's animation in seconds */
	stagger?: number;
	/** Direction of the reveal: 'up' or 'down' */
	direction?: "up" | "down";
	/** Base color for the text (hex) */
	baseColor?: string;
	/** Hover color for the text (hex) */
	hoverColor?: string;
	/** Additional wrapper CSS classes */
	className?: string;
	/** Additional text container CSS classes */
	textClassName?: string;
	/** Link URL if the component should act as a link */
	href?: string;
	/** Whether to force uppercase text */
	uppercase?: boolean;
	/** Dictates which letter starts the animation: 'left', 'right', 'center', or 'hover' */
	animateFrom?: "left" | "right" | "center" | "hover";
}

export const ElasticReveal: React.FC<ElasticRevealProps> = ({
	text = "REACTBYTES",
	duration = 0.6,
	stagger = 0.02,
	direction = "up",
	baseColor = "#60a5fa",
	hoverColor = "#FFFFFF",
	className = "",
	textClassName = "text-5xl md:text-7xl font-bold font-sans tracking-tighter",
	href,
	uppercase = false,
	animateFrom = "left",
}) => {
	const [isHovered, setIsHovered] = useState(false);
	const [originIndex, setOriginIndex] = useState<number | null>(null);

	const displayText = uppercase ? text.toUpperCase() : text;
	const letters = displayText.split("");
	const yOffset = direction === "up" ? "-100%" : "100%";

	const containerVariants = {
		initial: {},
		hover: {},
	};

	const letterVariants: Variants = {
		initial: { y: 0 },
		hover: (i: number) => {
			let delay = i * stagger;
			if (animateFrom === "right") {
				delay = (letters.length - 1 - i) * stagger;
			} else if (animateFrom === "center") {
				delay = Math.abs(i - (letters.length - 1) / 2) * stagger;
			} else if (animateFrom === "hover" && originIndex !== null) {
				delay = Math.abs(i - originIndex) * stagger;
			}

			return {
				y: yOffset,
				transition: {
					duration,
					delay,
					ease: [0.215, 0.61, 0.355, 1] as [number, number, number, number],
				},
			};
		},
	};

	const handleMouseEnter = (index: number) => {
		if (animateFrom === "hover" && originIndex === null) {
			setOriginIndex(index);
		}
		setIsHovered(true);
	};

	const handleMouseLeave = () => {
		setIsHovered(false);
		setOriginIndex(null);
	};

	const Content = (
		<motion.div
			initial="initial"
			animate={isHovered ? "hover" : "initial"}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={handleMouseLeave}
			variants={containerVariants}
			className={\`relative inline-flex overflow-hidden cursor-pointer select-none leading-[0.8] \${className}\`}
		>
			<span className="sr-only">{displayText}</span>
			<div className={\`flex \${textClassName}\`} aria-hidden="true">
				{letters.map((char, i) => (
					<motion.span
						key={i}
						custom={i}
						variants={letterVariants}
						onMouseEnter={() => handleMouseEnter(i)}
						className="relative inline-block whitespace-pre"
					>
						<span style={{ color: baseColor }}>{char}</span>
						<span
							className="absolute top-0 left-0"
							style={{
								color: hoverColor,
								transform: \`translateY(\${direction === "up" ? "100%" : "-100%"})\`
							}}
						>
							{char}
						</span>
					</motion.span>
				))}
			</div>
		</motion.div>
	);

	if (href) {
		return <a href={href} className="no-underline">{Content}</a>;
	}

	return Content;
};

export default ElasticReveal;`;

export const creditsData = [
	{
		title: "Component Source",
		items: [
			{
				name: "Modern Hover Effects",
				role: "Visual Concept",
				url: "https://codepen.io/georgedoescode/pen/MWvbejz",
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
				name: "Framer Motion",
				role: "Animations",
				url: "https://www.framer.com/motion/",
			},
			{
				name: "Tailwind CSS",
				role: "Styling",
				url: "https://tailwindcss.com",
			},
		],
	},
];
