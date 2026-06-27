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
	// 1. Added @container to establish parent bounds
	containerClassName = "@container",
	// 2. Added fluid clamp typography
	textClassName = "text-[clamp(1.5rem,8cqw,4rem)] text-center",
	uppercase = false,
}) => {
	// 3. Group by words and calculate global index for seamless staggering
	const words = useMemo(() => {
		const finalRef = uppercase ? text.toUpperCase() : text;
		const wordsArray = finalRef.split(" ");
		let globalIndex = 0;

		return wordsArray.map((word) => {
			const letters = word.split("").map((char) => {
				const charObj = { char, index: globalIndex };
				globalIndex++;
				return charObj;
			});
			// Increment index for the space so stagger timing remains perfectly spaced
			globalIndex++;
			return { word, letters };
		});
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
				delay: i * stagger, // Relies on the global index we calculate
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
				{words.map((wordObj, wordIndex) => (
					<React.Fragment key={wordIndex}>
						{/* 4. Wrap each word in inline-flex and whitespace-nowrap */}
						<span className="inline-flex whitespace-nowrap">
							{wordObj.letters.map((letter, charIndex) => (
								<motion.span
									key={`${wordIndex}-${charIndex}`}
									// Pass the global index to the variants via 'custom'
									custom={letter.index}
									variants={variants}
									initial="initial"
									animate="animate"
									className="inline-block"
									style={{
										fontFamily: "var(--font-outfit)",
										color,
									}}
								>
									{letter.char}
								</motion.span>
							))}
						</span>

						{/* 5. Render a native space between words so flex-wrap works perfectly */}
						{wordIndex < words.length - 1 && (
							<span className="inline-block">&nbsp;</span>
						)}
					</React.Fragment>
				))}
			</div>
		</div>
	);
};

export default VariableWeightText;