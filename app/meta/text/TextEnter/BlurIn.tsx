"use client";

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
	/** Tailwind class for text color */
	textColorClass?: string;
	/** Additional wrapper CSS classes */
	containerClassName?: string;
	/** Additional text container CSS classes */
	textClassName?: string;
}

export const BlurIn: React.FC<BlurInProps> = ({
	text = "All Hail Rameez",
	duration = 0.6,
	stagger = 0.04,
	easing = "easeOut",
	initialBlur = 12,
	endOpacity = 1,
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
							hidden: { opacity: 0, filter: `blur(${initialBlur}px)` },
							visible: { opacity: endOpacity, filter: "blur(0px)" },
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

export default BlurIn;
