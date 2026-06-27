"use client";

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
	easing?: any;
	/** Final opacity of the text */
	endOpacity?: number;
	/** Initial Y offset */
	initialY?: number;
	/** Tailwind class for text color */
	textColorClass?: string;
	/** Hex color or any valid CSS color */
	color?: string;
	/** Whether the animation should loop */
	loop?: boolean;
	/** Additional wrapper CSS classes */
	containerClassName?: string;
	/** Additional text container CSS classes */
	textClassName?: string;
	/** Whether to force uppercase text */
	uppercase?: boolean;
}

export const FallDown: React.FC<FallDownProps> = ({
	text = "All Hail Rameez",
	duration = 0.5,
	stagger = 0.045,
	easing = [0.34, 1.56, 0.64, 1],
	endOpacity = 1,
	initialY = -60,
	textColorClass = "text-rb-accent-1",
	color,
	loop = false,
	containerClassName = "@container",
	textClassName = "font-sans text-[clamp(1.5rem,8cqw,4rem)] text-center",
	uppercase = false,
}) => {
	// 1. Group letters by words and calculate a global index for seamless staggering
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
			// Increment index for the space so the stagger timing remains perfectly spaced
			globalIndex++;
			return { word, letters };
		});
	}, [text, uppercase]);

	const totalChars = text.length;

	return (
		<div
			className={`relative w-full flex items-center justify-center ${containerClassName}`}
		>
			<motion.div
				className={`flex flex-wrap justify-center ${textClassName}`}
				initial="hidden"
				animate="visible"
			>
				{words.map((wordObj, wordIndex) => (
					<React.Fragment key={wordIndex}>
						{/* 2. Wrap each word in inline-flex and whitespace-nowrap */}
						<span className="inline-flex whitespace-nowrap">
							{wordObj.letters.map((letter, charIndex) => (
								<motion.span
									key={`${wordIndex}-${charIndex}`}
									variants={{
										hidden: { opacity: 0, y: initialY },
										visible: {
											opacity: endOpacity,
											y: 0,
											transition: loop ? {
												duration: duration,
												ease: easing,
												// 3. Drive the delay manually via the global index
												delay: letter.index * stagger,
												repeat: Infinity,
												repeatType: "reverse",
												repeatDelay: stagger * totalChars
											} : {
												duration: duration,
												ease: easing,
												delay: letter.index * stagger,
											}
										},
									}}
									className={`inline-block ${!color ? textColorClass : ""}`}
									style={{ color: color }}
								>
									{letter.char}
								</motion.span>
							))}
						</span>

						{/* 4. Render a native space between words so flex-wrap works perfectly */}
						{wordIndex < words.length - 1 && (
							<span className="inline-block">&nbsp;</span>
						)}
					</React.Fragment>
				))}
			</motion.div>
		</div>
	);
};

export default FallDown;