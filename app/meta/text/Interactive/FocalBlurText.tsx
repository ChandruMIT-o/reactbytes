"use client";

import React, { useRef, useEffect, useMemo } from "react";

export interface FocalBlurTextProps {
	/** The text to animate */
	text: string;
	/** Tailwind classes for the text */
	textClassName?: string;
	/** Maximum distance to apply the effect from the cursor (px) */
	maxDistance?: number;
	/** Hex color for the character in focus. Pass "inherit" for no color override. */
	focusColor?: string;
	/** Max blur radius in pixels */
	maxBlur?: number;
	/** Base color for the text */
	color?: string;
	/** Whether to force uppercase text */
	uppercase?: boolean;
}

interface ProcessedWord {
	word: string;
	letters: {
		char: string;
		globalIndex: number;
	}[];
}

export const FocalBlurText: React.FC<FocalBlurTextProps> = ({
	text,
	// Removed structural alignment classes from here so they can't be accidentally overridden
	textClassName = "text-[clamp(1.5rem,8cqw,3.5rem)] font-black",
	maxDistance = 250,
	focusColor = "#60a5fa",
	maxBlur = 12,
	color = "#FFFFFF",
	uppercase = false,
}) => {
	const containerRef = useRef<HTMLDivElement>(null);
	const lettersRef = useRef<(HTMLSpanElement | null)[]>([]);

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
			currentGlobalIndex++;
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

			const blur = Math.min(
				maxBlur,
				Math.max(0, (distance / maxDistance) * maxBlur),
			);
			const opacity = Math.max(
				0.15,
				1 - (distance / maxDistance) * 0.85,
			);
			const scale = Math.max(
				1,
				1.4 - (distance / maxDistance) * 0.4,
			);

			letter.style.filter = `blur(${blur}px)`;
			letter.style.opacity = opacity.toString();
			letter.style.transform = `scale(${scale})`;
			if (focusColor !== "inherit") {
				letter.style.color =
					distance < 60 ? focusColor : color;
			}
		});
	};

	const handleMouseLeave = () => {
		lettersRef.current.forEach((letter) => {
			if (!letter) return;
			letter.style.filter = "blur(0px)";
			letter.style.opacity = "1";
			letter.style.transform = "scale(1)";
			letter.style.color = color;
		});
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
				className={`flex w-full flex-wrap justify-center text-center cursor-crosshair touch-none items-center ${textClassName}`}
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
								<span
									key={letterObj.globalIndex}
									ref={(el) => {
										lettersRef.current[letterObj.globalIndex] = el;
									}}
									style={{ color }}
									className="inline-block transition-all duration-300 ease-out will-change-[filter,transform,opacity]"
								>
									{letterObj.char}
								</span>
							))}
						</span>
					);
				})}
			</div>
		</div>
	);
};

export default FocalBlurText;