export const loaderProps = [
	{
		title: "Core Props",
		props: [
			{
				name: "text",
				type: "string",
				defaultValue: "'REACT BYTES'",
				description: "The text to animate.",
			},
			{
				name: "initialWeight",
				type: "number",
				defaultValue: "100",
				description: "Starting font weight (100-900).",
			},
			{
				name: "targetWeight",
				type: "number",
				defaultValue: "900",
				description: "Final font weight (100-900).",
			},
			{
				name: "duration",
				type: "number",
				defaultValue: "0.8",
				description: "Animation time for each character (seconds).",
			},
			{
				name: "stagger",
				type: "number",
				defaultValue: "0.1",
				description: "Delay multiplication between characters (seconds).",
			},
		],
	},
	{
		title: "Interactive/Style Props",
		props: [
			{
				name: "pulse",
				type: "boolean",
				defaultValue: "false",
				description: "Whether the weight shift should loop indefinitely.",
			},
			{
				name: "textColorClass",
				type: "string",
				defaultValue: "'text-rb-accent-1'",
				description: "Tailwind class for the text color.",
			},
		],
	},
];

export const componentCode = `"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";

export interface VariableWeightTextProps {
	text?: string;
	initialWeight?: number;
	targetWeight?: number;
	duration?: number;
	stagger?: number;
	easing?: any;
	pulse?: boolean;
	textColorClass?: string;
	containerClassName?: string;
	textClassName?: string;
}

export const VariableWeightText: React.FC<VariableWeightTextProps> = ({
	text = "REACT BYTES",
	initialWeight = 100,
	targetWeight = 900,
	duration = 0.8,
	stagger = 0.1,
	easing = "easeInOut",
	pulse = false,
	textColorClass = "text-rb-accent-1",
	containerClassName = "",
	textClassName = "",
}) => {
	const letters = useMemo(() => text.split(""), [text]);

	const variants = {
		initial: { fontWeight: initialWeight, opacity: 0 },
		animate: (i: number) => ({
			fontWeight: targetWeight,
			opacity: 1,
			transition: {
				duration,
				delay: i * stagger,
				ease: easing,
				repeat: pulse ? Infinity : 0,
				repeatType: "reverse" as const,
			},
		}),
	};

	return (
		<div className={\`relative w-full \${containerClassName}\`}>
			<div className={\`flex flex-wrap justify-center \${textClassName}\`}>
				{letters.map((char, index) => (
					<motion.span
						key={\`\${index}-\${char}\`}
						custom={index}
						variants={variants}
						initial="initial"
						animate="animate"
						className={\`inline-block \${textColorClass}\`}
						style={{ fontFamily: 'var(--font-outfit)' }}
					>
						{char === ' ' ? '\\u00A0' : char}
					</motion.span>
				))}
			</div>
		</div>
	);
};`;

export const creditsData = [
	{
		title: "Novel Concept",
		items: [
			{
				name: "Variable Fonts API",
				role: "Tech Underlying",
				url: "https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Fonts/Variable_fonts_guide",
			},
		],
	},
];
