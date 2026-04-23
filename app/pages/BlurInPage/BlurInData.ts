export const loaderProps = [
	{
		title: "Core Props",
		props: [
			{
				name: "text",
				type: "string",
				defaultValue: "'All Hail Rameez'",
				description:
					"The text to be broken down and animated. Handles spaces automatically.",
			},
			{
				name: "duration",
				type: "number",
				defaultValue: "0.6",
				description:
					"How long each character takes to finish its animation (in seconds).",
			},
			{
				name: "stagger",
				type: "number",
				defaultValue: "0.04",
				description: "The delay between each character's animation start.",
			},
			{
				name: "initialBlur",
				type: "number",
				defaultValue: "12",
				description: "The initial blur intensity for the enter effect.",
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
				name: "color",
				type: "string",
				defaultValue: "'#E8EAF0'",
				description: "Hex color for the text.",
			},
			{
				name: "containerClassName",
				type: "string",
				defaultValue: "''",
				description: "Extra utility classes for the outermost wrapper.",
			},
			{
				name: "textClassName",
				type: "string",
				defaultValue: "'font-mono'",
				description: "Extra utility classes for the animated text wrap.",
			},
		],
	},
];

export const componentCode = `"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";

export interface BlurInProps {
	/** The text to display and animate */
	text?: string;
	/** Duration of the animation for each character in seconds */
	duration?: number;
	/** Delay between each character's animation in seconds */
	stagger?: number;
	/** Ease function for the animation */
	easing?: any;
	/** Initial blur amount */
	initialBlur?: number;
	/** Final opacity of the text */
	endOpacity?: number;
	/** Hex color for text */
	color?: string;
	/** Additional wrapper CSS classes */
	containerClassName?: string;
	/** Additional text container CSS classes */
	textClassName?: string;
	/** Whether to force uppercase text */
	uppercase?: boolean;
}

export const BlurIn: React.FC<BlurInProps> = ({
	text = "All Hail Rameez",
	duration = 0.6,
	stagger = 0.04,
	easing = "easeOut",
	initialBlur = 12,
	endOpacity = 1,
	color = "#E8EAF0",
	containerClassName = "",
	textClassName = "font-sans",
	uppercase = false,
}) => {
	const letters = useMemo(() => {
		const finalRef = uppercase ? text.toUpperCase() : text;
		return finalRef.split("");
	}, [text, uppercase]);

	return (
		<div
			className={\`relative w-full flex items-center justify-center \${containerClassName}\`}
		>
			<motion.div
				className={\`flex flex-wrap justify-center \${textClassName}\`}
				initial="hidden"
				animate="visible"
				variants={{
					visible: {
						transition: {
							staggerChildren: stagger,
						},
					},
				}}
			>
				{letters.map((char, index) => (
					<motion.span
						key={\`\${index}-\${char}\`}
						variants={{
							hidden: {
								opacity: 0,
								filter: \`blur(\${initialBlur}px)\`,
							},
							visible: {
								opacity: endOpacity,
								filter: "blur(0px)",
							},
						}}
						transition={{
							duration: duration,
							ease: easing,
						}}
						className="inline-block"
						style={{ whiteSpace: "pre", color }}
					>
						{char === " " ? "\\u00A0" : char}
					</motion.span>
				))}
			</motion.div>
		</div>
	);
};

export default BlurIn;`;

export const creditsData = [
	{
		title: "Component Source",
		items: [
			{
				name: "JP Belley",
				role: "Visual Designer",
				url: "https://jeanphilippebelley.com/",
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
