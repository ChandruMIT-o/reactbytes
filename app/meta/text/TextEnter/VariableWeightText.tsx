"use client";

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
}) => {
	const letters = useMemo(() => text.split(""), [text]);

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
			className={`relative w-full flex items-center justify-center ${containerClassName}`}
		>
			<div className={`flex flex-wrap justify-center overflow-hidden ${textClassName}`}>
				{letters.map((char, index) => (
					<motion.span
						key={`${index}-${char}`}
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
						{char === " " ? "\u00A0" : char}
					</motion.span>
				))}
			</div>
		</div>
	);
};

export default VariableWeightText;
