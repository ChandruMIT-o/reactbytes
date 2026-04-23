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
			{
				name: "uppercase",
				type: "boolean",
				defaultValue: "false",
				description: "Whether to force the text to uppercase.",
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
				name: "color",
				type: "string",
				defaultValue: "'#E8EAF0'",
				description: "Hex color for the text.",
			},
		],
	},
];

export const componentCode = `"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";

export interface VariableWeightTextProps {
	/** The text to display and animate */
	text?: string;
	/** Starting font weight (100-900) */
	initialWeight?: number;
	/** Target font weight (100-900) */
	targetWeight?: number;
	/** Duration of the weight transition in seconds */
	duration?: number;
	/** Delay multiplier between each letter's animation start */
	stagger?: number;
	/** Ease function for the weight transition */
	easing?: any;
	/** Whether the weight should pulse (infinite loop) */
	pulse?: boolean;
	/** Hex color for text */
	color?: string;
	/** Additional wrapper CSS classes */
	containerClassName?: string;
	/** Additional text container CSS classes */
	textClassName?: string;
	/** Whether to force text to uppercase */
	uppercase?: boolean;
}

export const VariableWeightText: React.FC<VariableWeightTextProps> = ({
	text = "REACT BYTES",
	initialWeight = 100,
	targetWeight = 900,
	duration = 0.8,
	stagger = 0.1,
	easing = "easeInOut",
	pulse = false,
	color = "#E8EAF0",
	containerClassName = "",
	textClassName = "",
	uppercase = false,
}) => {
	const letters = useMemo(() => {
		const finalRef = uppercase ? text.toUpperCase() : text;
		return finalRef.split("");
	}, [text, uppercase]);

	const variants = {
		initial: {
			fontWeight: initialWeight,
			opacity: 0,
		},
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
		<div
			className={\`relative w-full flex items-center justify-center \${containerClassName}\`}
		>
			<div
				className={\`flex flex-wrap justify-center overflow-hidden \${textClassName}\`}
			>
				{letters.map((char, index) => (
					<motion.span
						key={\`\${index}-\${char}\`}
						custom={index}
						variants={variants}
						initial="initial"
						animate="animate"
						className="inline-block"
						style={{
							fontFamily: "var(--font-outfit)",
							color,
						}}
					>
						{char === " " ? "\\u00A0" : char}
					</motion.span>
				))}
			</div>
		</div>
	);
};

export default VariableWeightText;`;

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
