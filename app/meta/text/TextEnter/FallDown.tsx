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
	/** Additional wrapper CSS classes */
	containerClassName?: string;
	/** Additional text container CSS classes */
	textClassName?: string;
}

export const FallDown: React.FC<FallDownProps> = ({
	text = "All Hail Rameez",
	duration = 0.5,
	stagger = 0.045,
	easing = [0.34, 1.56, 0.64, 1], // Custom bounce bezier
	endOpacity = 1,
	initialY = -60,
	textColorClass = "text-rb-accent-1",
	containerClassName = "",
	textClassName = "font-mono",
}) => {
	const letters = useMemo(() => text.split(""), [text]);

	return (
		<div
			className={`relative w-full flex items-center justify-center ${containerClassName}`}
		>
			<motion.div
				className={`flex flex-wrap justify-center ${textClassName}`}
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
						key={`${index}-${char}`}
						variants={{
							hidden: { opacity: 0, y: initialY },
							visible: { opacity: endOpacity, y: 0 },
						}}
						transition={{
							duration: duration,
							ease: easing,
						}}
						className={`inline-block ${textColorClass}`}
						style={{ whiteSpace: "pre" }}
					>
						{char === " " ? "\u00A0" : char}
					</motion.span>
				))}
			</motion.div>
		</div>
	);
};

export default FallDown;
