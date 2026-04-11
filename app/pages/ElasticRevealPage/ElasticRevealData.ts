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
		],
	},
	{
		title: "Styling Props",
		props: [
			{
				name: "baseColorClass",
				type: "string",
				defaultValue: "'text-rb-accent-2'",
				description: "Tailwind class for the initial text color.",
			},
			{
				name: "hoverColorClass",
				type: "string",
				defaultValue: "'text-rb-accent-1'",
				description: "Tailwind class for the revealed text color.",
			},
			{
				name: "textClassName",
				type: "string",
				defaultValue: "'text-5xl md:text-7xl font-bold font-sans uppercase tracking-tighter'",
				description: "Extra classes for font style and size.",
			},
		],
	},
];

export const componentCode = `"use client";

import React from "react";
import { motion } from "framer-motion";

export interface ElasticRevealProps {
	/** The text to display */
	text: string;
	/** Duration of the animation per letter in seconds */
	duration?: number;
	/** Delay between each character's animation in seconds */
	stagger?: number;
	/** Direction of the reveal: 'up' or 'down' */
	direction?: "up" | "down";
	/** Tailwind class for the hover/reveal color */
	hoverColorClass?: string;
	/** Tailwind class for the base text color */
	baseColorClass?: string;
	/** Additional wrapper CSS classes */
	className?: string;
	/** Additional text container CSS classes */
	textClassName?: string;
	/** Link URL if the component should act as a link */
	href?: string;
}

export const ElasticReveal: React.FC<ElasticRevealProps> = ({
	text = "REACTBYTES",
	duration = 0.6,
	stagger = 0.02,
	direction = "up",
	hoverColorClass = "text-rb-accent-1",
	baseColorClass = "text-rb-accent-2",
	className = "",
	textClassName = "text-5xl md:text-7xl font-bold font-sans uppercase tracking-tighter",
	href,
}) => {
	const letters = text.split("");
	const yOffset = direction === "up" ? "-100%" : "100%";

	const containerVariants = {
		initial: {},
		hover: {},
	};

	const letterVariants = {
		initial: { y: 0 },
		hover: (i: number) => ({
			y: yOffset,
			transition: {
				duration,
				delay: i * stagger,
				ease: [0.215, 0.61, 0.355, 1],
			},
		}),
	};

	const Content = (
		<motion.div
			initial="initial"
			whileHover="hover"
			variants={containerVariants}
			className={\`relative inline-flex overflow-hidden cursor-pointer select-none leading-[0.8] \${className}\`}
		>
			<span className="sr-only">{text}</span>
			<div className={\`flex \${textClassName}\`} aria-hidden="true">
				{letters.map((char, i) => (
					<motion.span
						key={i}
						custom={i}
						variants={letterVariants}
						className={\`relative inline-block whitespace-pre \${baseColorClass}\`}
					>
						{char}
						<span 
							className={\`absolute top-0 left-0 \${hoverColorClass}\`}
							style={{ transform: \`translateY(\${direction === "up" ? "100%" : "-100%"})\` }}
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
