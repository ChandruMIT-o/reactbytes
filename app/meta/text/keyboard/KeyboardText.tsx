"use client";

import React from "react";
import { motion } from "framer-motion";

export interface KeyboardTextProps {
	/** Text to animate */
	text: string;
	/** Distance the keys are pressed down in pixels */
	yBounce?: number;
	/** Additional CSS classes for styling */
	className?: string;
}

export const KeyboardText: React.FC<KeyboardTextProps> = ({
	text = "KEYBOARD",
	yBounce = 10,
	className = "",
}) => {
	const chars = text.split("");

	// Pseudorandom animation timings array mapped to index to mimic the original CSS
	const durations = [2, 3, 4, 2.5, 2.5, 3.5, 2.2, 3.2];
	const peakTimes = [0.35, 0.75, 0.35, 0.45, 0.25, 0.65, 0.15, 0.40];

	return (
		<span className={`inline-flex items-center justify-center font-black ${className}`}>
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
						animate={{ y: [0, 0, yBounce, 0, 0] }}
						transition={{
							duration: duration,
							repeat: Infinity,
							times: times,
							ease: "easeInOut",
						}}
						className="inline-block origin-bottom"
					>
						{char === " " ? "\u00A0" : char}
					</motion.span>
				);
			})}
		</span>
	);
};

export default KeyboardText;
