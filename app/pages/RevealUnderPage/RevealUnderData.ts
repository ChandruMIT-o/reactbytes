export const loaderProps = [
	{
		title: "Core Props",
		props: [
			{
				name: "firstWord",
				type: "string",
				defaultValue: "'Hello'",
				description: "The primary word that covers the reveal.",
			},
			{
				name: "secondWord",
				type: "string",
				defaultValue: "'World'",
				description: "The secondary word revealed from behind.",
			},
			{
				name: "direction",
				type: "'right' | 'left' | 'top' | 'bottom'",
				defaultValue: "'right'",
				description: "The direction in which the second word appears.",
			},
			{
				name: "duration",
				type: "number",
				defaultValue: "1.5",
				description: "Total animation time in seconds.",
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
				name: "textClassName",
				type: "string",
				defaultValue: "'font-mono font-bold text-5xl'",
				description: "Extra classes for the font style and size.",
			},
		],
	},
];

export const componentCode = `"use client";

import React from "react";
import { motion } from "framer-motion";

export interface RevealUnderProps {
	/** The first word that acts as a cover */
	firstWord?: string;
	/** The second word that is revealed from under */
	secondWord?: string;
	/** Direction of the reveal */
	direction?: "right" | "left" | "top" | "bottom";
	/** Duration of the animation in seconds */
	duration?: number;
	/** Delay before starting the animation in seconds */
	delay?: number;
	/** Ease function for the animation */
	easing?: any;
	/** Hex color for text */
	color?: string;
	/** Additional wrapper CSS classes */
	containerClassName?: string;
	/** Additional text container CSS classes */
	textClassName?: string;
	/** Whether to force text to uppercase */
	uppercase?: boolean;
}

export const RevealUnder: React.FC<RevealUnderProps> = ({
	firstWord = "Hello",
	secondWord = "World",
	direction = "right",
	duration = 1.5,
	delay = 0,
	easing = [0.785, 0.135, 0.15, 0.86],
	color = "#E8EAF0",
	containerClassName = "",
	textClassName = "font-sans font-bold text-5xl",
	uppercase = false,
}) => {
	const finalFirst = uppercase ? firstWord.toUpperCase() : firstWord;
	const finalSecond = uppercase ? secondWord.toUpperCase() : secondWord;
	const isHorizontal = direction === "right" || direction === "left";

	const getFirstPos = () => {
		if (direction === "right") return ["50%", "50%", "0%"];
		if (direction === "left") return ["-50%", "-50%", "0%"];
		return ["0%", "0%", "0%"];
	};

	const getFirstYPos = () => {
		if (direction === "top") return ["50%", "50%", "0%"];
		if (direction === "bottom") return ["-50%", "-50%", "0%"];
		return ["0%", "0%", "0%"];
	};

	const getSecondPos = () => {
		if (direction === "right") return ["-100%", "-100%", "0%"];
		if (direction === "left") return ["100%", "100%", "0%"];
		return ["0%", "0%", "0%"];
	};

	const getSecondYPos = () => {
		if (direction === "top") return ["100%", "100%", "0%"];
		if (direction === "bottom") return ["-100%", "-100%", "0%"];
		return ["0%", "0%", "0%"];
	};

	const firstVariants = {
		hidden: {
			x: direction === "right" ? "50%" : direction === "left" ? "-50%" : 0,
			y: direction === "top" ? "50%" : direction === "bottom" ? "-50%" : 0,
		},
		visible: {
			x: getFirstPos(),
			y: getFirstYPos(),
			transition: {
				duration,
				delay,
				times: [0, 0.6, 1],
				ease: easing,
			},
		},
	};

	const secondVariants = {
		hidden: {
			x: direction === "right" ? "-100%" : direction === "left" ? "100%" : 0,
			y: direction === "top" ? "100%" : direction === "bottom" ? "-100%" : 0,
		},
		visible: {
			x: getSecondPos(),
			y: getSecondYPos(),
			transition: {
				duration,
				delay,
				times: [0, 0.6, 1],
				ease: easing,
			},
		},
	};

	const showSecondFirst = direction === "left" || direction === "top";

	return (
		<div
			className={\`relative w-full flex items-center justify-center \${containerClassName}\`}
		>
			<motion.div
				className={\`flex \${
					isHorizontal ? "flex-row" : "flex-col"
				} items-center justify-center \${textClassName} tracking-wider\`}
				initial="hidden"
				animate="visible"
				variants={{
					hidden: { opacity: 0, scale: 1 },
					visible: {
						opacity: 1,
						scale: [1, 1.1, 1],
						transition: { duration, delay, ease: "easeInOut" },
					},
				}}
			>
				{showSecondFirst && (
					<div className="inline-flex overflow-hidden">
						<motion.span
							variants={secondVariants}
							className="relative z-0 px-2 font-light"
							style={{ color }}
						>
							{finalSecond}
						</motion.span>
					</div>
				)}

				<motion.span
					variants={firstVariants}
					className="relative z-10 bg-background px-2"
					style={{ color }}
				>
					{finalFirst}
				</motion.span>

				{!showSecondFirst && (
					<div className="inline-flex overflow-hidden">
						<motion.span
							variants={secondVariants}
							className="relative z-0 px-2 font-light"
							style={{ color }}
						>
							{finalSecond}
						</motion.span>
					</div>
				)}
			</motion.div>
		</div>
	);
};

export default RevealUnder;`;

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
