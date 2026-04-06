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
				defaultValue: "0.5",
				description:
					"How long each character takes to finish its animation (in seconds).",
			},
			{
				name: "stagger",
				type: "number",
				defaultValue: "0.045",
				description: "The delay between each character's animation start.",
			},
			{
				name: "initialY",
				type: "number",
				defaultValue: "-60",
				description: "The initial vertical offset for the fall effect.",
			},
		],
	},
	{
		title: "Styling Props",
		props: [
			{
				name: "textColorClass",
				type: "string",
				defaultValue: "'text-[#E8EAF0]'",
				description: "Tailwind class for the text color.",
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
				defaultValue: "''",
				description: "Extra utility classes for the animated text wrap.",
			},
		],
	},
];

export const componentCode = `"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";

export interface FallDownProps {
	/** The text to display and animate */
	text?: string;
	/** Duration of the animation for each character in seconds */
	duration?: number;
	/** Delay between each character's animation in seconds */
	stagger?: number;
	/** Ease function for the animation */
	easing?: number[] | string;
	/** Final opacity of the text */
	endOpacity?: number;
	/** Initial Y offset */
	initialY?: number;
	/** Tailwind class for text color */
	textColorClass?: string;
	/** Additional wrapper CSS classes */
	containerClassName?: string;
	/** Additional text container CSS classes */
	textClassName?: string;
}

export const FallDown: React.FC<FallDownProps> = ({
	text = "All Hail Rameez",
	duration = 0.5,
	stagger = 0.045,
	easing = [0.34, 1.56, 0.64, 1],
	endOpacity = 1,
	initialY = -60,
	textColorClass = "text-[#E8EAF0]",
	containerClassName = "",
	textClassName = "",
}) => {
	const letters = useMemo(() => text.split(""), [text]);

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
							hidden: { opacity: 0, y: initialY },
							visible: { opacity: endOpacity, y: 0 },
						}}
						transition={{
							duration: duration,
							ease: easing,
						}}
						className={\`inline-block \${textColorClass}\`}
						style={{ whiteSpace: "pre" }}
					>
						{char === " " ? "\\u00A0" : char}
					</motion.span>
				))}
			</motion.div>
		</div>
	);
};

export default FallDown;`;

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
