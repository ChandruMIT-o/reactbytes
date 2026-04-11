"use client";

import React, { useMemo, useEffect, useRef } from "react";
import { motion, useAnimation, useInView } from "framer-motion";

export interface ScrambleRevealProps {
	/** The final text to be revealed */
	text: string;
	/** Characters to use during the scramble phase */
	scrambleChars?: string;
	/** Duration of each animation phase in seconds */
	duration?: number;
	/** Delay increment for the first phase (scramble reveal) */
	scrambleStagger?: number;
	/** Delay increment for the second phase (actual reveal) */
	revealStagger?: number;
	/** Tailwind class for the text color */
	textColorClass?: string;
	/** Additional wrapper CSS classes */
	className?: string;
	/** Additional text container CSS classes */
	textClassName?: string;
	/** Manual letter spacing adjustment */
	letterSpacing?: string;
}

/**
 * A cinematic text entrance component that "pushes" individual characters into view.
 * Each character starts hidden, drops in as a random symbol, and is then 
 * pushed out by the final character.
 */
export const ScrambleReveal: React.FC<ScrambleRevealProps> = ({
	text = "CREATIVE",
	scrambleChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*",
	duration = 0.8,
	scrambleStagger = 0.05,
	revealStagger = 0.1,
	textColorClass = "text-rb-accent-1",
	className = "",
	textClassName = "text-6xl md:text-9xl font-bold font-mono uppercase leading-[0.75]",
	letterSpacing = "0em",
}) => {
	const letters = text.split("");
	const containerRef = useRef<HTMLDivElement>(null);
	const isInView = useInView(containerRef, { once: true, margin: "-100px" });
	const controls = useAnimation();

	// Generate a stable random scramble character for each position
	const randomScrambleChars = useMemo(() => {
		return letters.map(() => scrambleChars[Math.floor(Math.random() * scrambleChars.length)]);
	}, [text, scrambleChars]);

	useEffect(() => {
		if (isInView) {
			const runSequence = async () => {
				// Initial state: Everything hidden above (-100%)
				
				// Phase 1: Reveal the "Scramble" character (Slide to 0%)
				await controls.start((i) => ({
					y: "0%",
					transition: {
						duration: duration,
						delay: i * scrambleStagger,
						ease: [0.19, 1, 0.22, 1], // expoOut
					},
				}));

				// Phase 2: Reveal the "Target" character (Slide to 100%)
				// This pushes the scramble char down and brings the target char from above.
				await controls.start((i) => ({
					y: "100%",
					transition: {
						duration: duration,
						delay: i * revealStagger,
						ease: [0.19, 1, 0.22, 1], // expoOut
					},
				}));
			};
			runSequence();
		}
	}, [isInView, controls, duration, scrambleStagger, revealStagger]);

	return (
		<div
			ref={containerRef}
			className={`relative flex items-center justify-center overflow-hidden select-none px-4 ${className}`}
		>
			<span className="sr-only">{text}</span>
			<div 
				className={`flex items-baseline ${textClassName}`} 
				aria-hidden="true" 
				style={{ letterSpacing }}
			>
				{letters.map((char, i) => (
					<div 
						key={`${char}-${i}`} 
						className="relative overflow-hidden inline-block"
					>
						<motion.div
							custom={i}
							initial={{ y: "-100%" }}
							animate={controls}
							className="relative flex flex-col items-center"
						>
							{/* 
								Layout is stacked vertically:
								[Target Character]  (Visible when y=100%)
								[Scramble Character] (Visible when y=0%)
								
								The target character sits ABOVE the scramble character.
							*/}
							<span 
								className={`absolute bottom-full left-0 w-full text-center ${textColorClass}`}
							>
								{char === " " ? "\u00A0" : char}
							</span>
							
							<span className={`relative block ${textColorClass} opacity-60`}>
								{char === " " ? "\u00A0" : randomScrambleChars[i]}
							</span>
						</motion.div>
					</div>
				))}
			</div>
		</div>
	);
};

export default ScrambleReveal;

