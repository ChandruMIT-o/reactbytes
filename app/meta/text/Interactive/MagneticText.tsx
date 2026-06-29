"use client";

import React, { useRef, useEffect, useMemo } from "react";
import { motion } from "framer-motion";

export interface MagneticTextProps {
	/** The text to animate */
	text: string;
	/** Tailwind classes for the text */
	textClassName?: string;
	/** Maximum distance to trigger the repel effect (px) */
	maxDistance?: number;
	/** Force intensity multiplier */
	repelForce?: number;
	/** Hover text color */
	hoverColor?: string;
	/** Base color for the text */
	color?: string;
	/** Whether to force uppercase text */
	uppercase?: boolean;
	/** Enable initial enter animation */
	enterAnimation?: boolean;
	/** Initial blur amount */
	initialBlur?: number;
	/** Enter animation duration */
	enterDuration?: number;
	/** Delay between letters */
	enterStagger?: number;
}

interface ProcessedWord {
	word: string;
	letters: {
		char: string;
		globalIndex: number;
	}[];
}

export const MagneticText: React.FC<MagneticTextProps> = ({
	text,
	// Shifted to a fluid, responsive clamp calculation using parent widths
	textClassName = "text-[clamp(1.5rem,8cqw,3.5rem)] font-bold",
	maxDistance = 140,
	repelForce = 30,
	hoverColor = "#c084fc",
	color = "#FFFFFF",
	uppercase = false,
	enterAnimation = true,
	initialBlur = 12,
	enterDuration = 0.5,
	enterStagger = 0.04,
}) => {
	const containerRef = useRef<HTMLDivElement>(null);
	const lettersRef = useRef<(HTMLSpanElement | null)[]>([]);

	// Process characters into grouped words to preserve perfect line-breaking behavior
	const processedWords = useMemo<ProcessedWord[]>(() => {
		const displayText = uppercase ? text.toUpperCase() : text;
		const wordsArray = displayText.split(" ");
		let currentGlobalIndex = 0;

		return wordsArray.map((word) => {
			const letters = word.split("").map((char) => {
				const item = { char, globalIndex: currentGlobalIndex };
				currentGlobalIndex++;
				return item;
			});
			currentGlobalIndex++; // Space separation offset
			return { word, letters };
		});
	}, [text, uppercase]);

	const handleMove = (clientX: number, clientY: number) => {
		if (!containerRef.current) return;

		lettersRef.current.forEach((letter) => {
			if (!letter) return;
			const rect = letter.getBoundingClientRect();
			const centerX = rect.left + rect.width / 2;
			const centerY = rect.top + rect.height / 2;

			const distX = clientX - centerX;
			const distY = clientY - centerY;
			const distance = Math.sqrt(distX * distX + distY * distY);

			if (distance < maxDistance) {
				const force = Math.pow(
					(maxDistance - distance) / maxDistance,
					1.2,
				);
				const moveX = (distX / distance) * force * -repelForce;
				const moveY = (distY / distance) * force * -repelForce;
				const rotate = (distX / distance) * force * 40;

				letter.style.transform = `translate(${moveX}px, ${moveY}px) rotate(${rotate}deg) scale(${1 + force * 0.4
					})`;
				letter.style.color = hoverColor;
				letter.style.zIndex = "10";
			} else {
				resetLetter(letter);
			}
		});
	};

	const resetLetter = (letter: HTMLSpanElement) => {
		letter.style.transform = `translate(0px, 0px) rotate(0deg) scale(1)`;
		letter.style.color = color;
		letter.style.zIndex = "1";
	};

	const handleMouseLeave = () => {
		lettersRef.current.forEach(
			(letter) => letter && resetLetter(letter),
		);
	};

	useEffect(() => {
		return handleMouseLeave;
	}, []);

	return (
		<div className="w-full @container">
			<div
				ref={containerRef}
				onMouseMove={(e) => handleMove(e.clientX, e.clientY)}
				onTouchMove={(e) =>
					handleMove(e.touches[0].clientX, e.touches[0].clientY)
				}
				onMouseLeave={handleMouseLeave}
				onTouchEnd={handleMouseLeave}
				style={{ color }}
				className={`flex w-full flex-wrap justify-center text-center cursor-default touch-none items-center ${textClassName}`}
			>
				{processedWords.map((wordObj, wordIndex) => {
					const isLast = wordIndex === processedWords.length - 1;
					return (
						<span
							key={wordIndex}
							className="inline-flex whitespace-nowrap"
							style={{ marginRight: isLast ? "0" : "0.25em" }}
						>
							{wordObj.letters.map((letterObj) => (
								<motion.span
									key={letterObj.globalIndex}
									ref={(el) => {
										lettersRef.current[letterObj.globalIndex] = el;
									}}
									style={{ color }}
									className="inline-block transition-all duration-300 ease-out origin-center"
									initial={enterAnimation ? {
										opacity: 0,
										x: Math.random() * 40 - 20,
										y: Math.random() * 40 - 20,
										scale: 0.7,
										rotate: Math.random() * 30 - 15,
									} : false}
									animate={enterAnimation ? {
										opacity: 1,
										x: 0,
										y: 0,
										scale: 1,
										rotate: 0,
									} : false}
									transition={{
										duration: enterDuration,
										delay: letterObj.globalIndex * enterStagger,
										type: "spring",
										stiffness: 180,
										damping: 15,
									}}
								>
									{letterObj.char}
								</motion.span>
							))}
						</span>
					);
				})}
			</div>
		</div>
	);
};

export default MagneticText;