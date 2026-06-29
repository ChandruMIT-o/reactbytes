"use client";

import React from "react";
import { motion, Variants } from "framer-motion";

export interface KeyboardTextProps {
	/** Text to animate */
	text: string;
	/** Distance the keys are pressed down in pixels */
	yBounce?: number;
	/** Hex color for the text */
	color?: string;
	/** Additional CSS classes for styling */
	className?: string;
	/** Whether to force uppercase text */
	uppercase?: boolean;
}

export const KeyboardText: React.FC<KeyboardTextProps> = ({
	text = "KEYBOARD",
	yBounce = 10,
	color = "#FFFFFF",
	className = "",
	uppercase = false,
}) => {
	const displayText = uppercase ? text.toUpperCase() : text;
	const chars = displayText.split("");

	// Pseudorandom animation timings array mapped to index to mimic mechanical typing variances
	const durations = [2, 3, 4, 2.5, 2.5, 3.5, 2.2, 3.2];
	const peakTimes = [0.35, 0.75, 0.35, 0.45, 0.25, 0.65, 0.15, 0.40];

	// 1. Container Variants: Coordinates a clean, cascading entrance delay
	const containerVariants: Variants = {
		hidden: {},
		visible: {
			transition: {
				staggerChildren: 0.05, // Smooth sequential pop
			},
		},
	};

	// 2. Individual Character Entrance: Mechanical "snapping into place" transition
	const letterEntranceVariants: Variants = {
		hidden: {
			opacity: 0,
			y: 35,
			scale: 0.7
		},
		visible: {
			opacity: 1,
			y: 0,
			scale: 1,
			transition: {
				type: "spring",
				stiffness: 160,
				damping: 14
			}
		},
	};

	return (
		// Outer boundary declares the containment target context for fluid mobile scaling
		<div className="w-full @container flex items-center justify-center py-2">
			<motion.span
				variants={containerVariants}
				initial="hidden"
				animate="visible"
				className={`inline-flex items-center justify-center whitespace-nowrap select-none font-black ${className}`}
				style={{
					color,
					// FOCUS ON SCALING: Calculates font size dynamically based on parent container width.
					// Capped at 5rem maximum, safely downscales on small viewports with a 15% padding margin.
					fontSize: `calc(min(5rem, 115cqw / ${Math.max(chars.length, 4)}))`
				}}
			>
				{chars.map((char, i) => {
					const duration = durations[i % durations.length];
					const peakTime = peakTimes[i % peakTimes.length];

					// Build the timeline for each key press down & release
					const times = [
						0,
						Math.max(0, peakTime - 0.05),
						peakTime,
						Math.min(1, peakTime + 0.05),
						1,
					];

					return (
						<motion.span
							key={i}
							variants={letterEntranceVariants}
							className="inline-block origin-bottom"
						>
							{/* Inner wrapper executes the infinite bouncing loop without interfering with the entrance cascade */}
							<motion.span
								animate={{ y: [0, 0, yBounce, 0, 0] }}
								transition={{
									duration: duration,
									repeat: Infinity,
									times: times,
									ease: "easeInOut",
								}}
								className="inline-block"
							>
								{char === " " ? "\u00A0" : char}
							</motion.span>
						</motion.span>
					);
				})}
			</motion.span>
		</div>
	);
};

export default KeyboardText;