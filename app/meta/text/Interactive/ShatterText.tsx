"use client";

import React, { useState, useMemo } from "react";

export interface ShatterTextProps {
	/** The text to animate */
	text: string;
	/** Tailwind classes for the text */
	textClassName?: string;
	/** Force multiplier for initial scatter spread */
	scatterFactor?: number;
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

export const ShatterText: React.FC<ShatterTextProps> = ({
	text,
	// Swapped from screen breakpoints to dynamic container query tracking
	textClassName = "text-[clamp(1.5rem,8cqw,3.5rem)] font-black",
	scatterFactor = 400,
	color = "#FFFFFF",
	uppercase = false,
}) => {
	const [trigger, setTrigger] = useState(0);

	const displayText = uppercase ? text.toUpperCase() : text;

	// Pre-calculate random entry points based on absolute linear string length
	const charConfigs = useMemo(() => {
		return displayText.split("").map(() => ({
			x: (Math.random() - 0.5) * scatterFactor,
			y: (Math.random() - 0.5) * scatterFactor,
			rot: (Math.random() - 0.5) * 270,
		}));
	}, [displayText, trigger, scatterFactor]);

	// Build word grouping structures while carrying matching index paths for animation configs
	const processedWords = useMemo<ProcessedWord[]>(() => {
		const wordsArray = displayText.split(" ");
		let currentGlobalIndex = 0;

		return wordsArray.map((word) => {
			const letters = word.split("").map((char) => {
				const item = { char, globalIndex: currentGlobalIndex };
				currentGlobalIndex++;
				return item;
			});
			currentGlobalIndex++; // Structural offset accounting for spaces
			return { word, letters };
		});
	}, [displayText]);

	return (
		<div className="w-full @container">
			<style dangerouslySetInnerHTML={{
				__html: `
                @keyframes shatter-in {
                    0% {
                        transform: translate(var(--startX), var(--startY)) rotate(var(--startRot)) scale(1.5);
                        opacity: 0;
                        filter: blur(16px);
                    }
                    100% {
                        transform: translate(0, 0) rotate(0) scale(1);
                        opacity: 1;
                        filter: blur(0);
                    }
                }
                .animate-shatter {
                    animation: shatter-in 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                    opacity: 0; 
                }
            `}} />
			<div
				className={`flex w-full flex-wrap justify-center text-center cursor-pointer overflow-visible items-center ${textClassName}`}
				onClick={() => setTrigger((t) => t + 1)}
				style={{ color }}
			>
				{processedWords.map((wordObj, wordIndex) => {
					const isLast = wordIndex === processedWords.length - 1;
					return (
						<span
							key={wordIndex}
							className="inline-flex whitespace-nowrap"
							style={{ marginRight: isLast ? "0" : "0.25em" }}
						>
							{wordObj.letters.map((letterObj) => {
								const config = charConfigs[letterObj.globalIndex];
								const startX = config ? `${config.x}px` : "0px";
								const startY = config ? `${config.y}px` : "0px";
								const startRot = config ? `${config.rot}deg` : "0deg";

								return (
									<span
										key={`${trigger}-${letterObj.globalIndex}`}
										className="inline-block animate-shatter"
										style={{
											"--startX": startX,
											"--startY": startY,
											"--startRot": startRot,
											animationDelay: `${letterObj.globalIndex * 0.04}s`,
											color: color,
										} as React.CSSProperties}
									>
										{letterObj.char}
									</span>
								);
							})}
						</span>
					);
				})}
			</div>
		</div>
	);
};

export default ShatterText;