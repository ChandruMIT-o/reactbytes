"use client";

import React, { useEffect, useRef, useMemo } from "react";
import { useInView } from "framer-motion";

export interface ScrambleRevealProps {
	/** The final text to be revealed */
	text: string;
	/** Characters to use during the scramble phase */
	scrambleChars?: string;
	/** Duration of the animation phase in seconds */
	duration?: number;
	/** Delay increment for the scramble start */
	scrambleStagger?: number;
	/** Delay increment for the final character reveal */
	revealStagger?: number;
	/** Hex color for the text color */
	color?: string;
	/** Additional wrapper CSS classes */
	className?: string;
	/** Additional text container CSS classes */
	textClassName?: string;
	/** Manual letter spacing adjustment */
	letterSpacing?: string;
	/** Whether to force uppercase text */
	uppercase?: boolean;
}

interface ProcessedWord {
	letters: {
		char: string;
		globalIndex: number;
	}[];
}

export const ScrambleReveal: React.FC<ScrambleRevealProps> = ({
	text = "CREATIVE",
	scrambleChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*",
	duration = 0.8,
	scrambleStagger = 0.05,
	revealStagger = 0.1,
	color = "#E8EAF0",
	className = "",
	// Swapped screen-size breakpoints for fluid container queries and removed clipping line-heights
	textClassName = "text-[clamp(1.5rem,8cqw,3.5rem)] font-bold font-mono",
	letterSpacing = "0em",
	uppercase = false,
}) => {
	const displayText = uppercase ? text.toUpperCase() : text;
	const containerRef = useRef<HTMLDivElement>(null);
	const isInView = useInView(containerRef, { once: true, margin: "-50px" });

	// Group letters into atomic word blocks while maintaining linear global indices
	const processedWords = useMemo<ProcessedWord[]>(() => {
		const wordsArray = displayText.split(" ");
		let currentGlobalIndex = 0;

		return wordsArray.map((word, wordIdx) => {
			const letters = word.split("").map((char) => {
				const item = { char, globalIndex: currentGlobalIndex };
				currentGlobalIndex++;
				return item;
			});

			// Keep trailing space elements inside the same word tracking boundary
			if (wordIdx < wordsArray.length - 1) {
				letters.push({ char: " ", globalIndex: currentGlobalIndex });
				currentGlobalIndex++;
			}

			return { letters };
		});
	}, [displayText]);

	useEffect(() => {
		if (!isInView || !containerRef.current) return;

		let frameRequest: number;
		let frame = 0;
		const queue: {
			from: string;
			to: string;
			start: number;
			end: number;
			char?: string;
			node?: HTMLElement;
		}[] = [];

		const charNodes = containerRef.current.querySelectorAll(".scramble-char");
		const length = displayText.length;

		for (let i = 0; i < length; i++) {
			const to = displayText[i] || "";
			const startFrame = Math.floor(i * (scrambleStagger * 60) + Math.random() * 20);
			const endFrame = Math.floor(
				startFrame + duration * 60 + i * (revealStagger * 60) + Math.random() * 20
			);

			queue.push({
				from: "",
				to,
				start: startFrame,
				end: endFrame,
				node: charNodes[i] as HTMLElement,
			});
		}

		const update = () => {
			let complete = 0;
			for (let i = 0, n = queue.length; i < n; i++) {
				let { to, start, end, node, char } = queue[i];
				if (!node) continue;

				if (frame >= end) {
					complete++;
					node.innerHTML = to === " " ? "&nbsp;" : to;
					node.style.color = color;
					node.style.opacity = "1";
					node.style.textShadow = `0px 0px 15px ${color}`;
					node.style.transform = "scale(1)";
					node.style.filter = "blur(0px)";
				} else if (frame >= start) {
					if (!char || Math.random() < 0.28) {
						char = scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
						queue[i].char = char;
					}
					node.innerHTML = char === " " ? "&nbsp;" : char;
					node.style.color = color;
					node.style.opacity = "0.7";
					node.style.textShadow = "none";
					node.style.transform = "scale(1.05)";
					node.style.filter = "blur(1px)";
				} else {
					node.innerHTML = "&nbsp;";
					node.style.opacity = "0";
				}
			}

			if (complete === queue.length) {
				setTimeout(() => {
					for (let i = 0; i < queue.length; i++) {
						const node = queue[i].node;
						if (node) {
							node.style.transition = "text-shadow 1s ease-in-out, filter 1s ease-in-out";
							node.style.textShadow = "none";
						}
					}
				}, 200);
			} else {
				frameRequest = requestAnimationFrame(update);
				frame++;
			}
		};

		frameRequest = requestAnimationFrame(update);

		return () => cancelAnimationFrame(frameRequest);
	}, [
		isInView,
		displayText,
		scrambleChars,
		duration,
		scrambleStagger,
		revealStagger,
		color,
	]);

	return (
		<div className="w-full @container">
			<div
				ref={containerRef}
				className={`relative flex w-full items-center justify-center text-center select-none px-4 ${className}`}
			>
				<span className="sr-only">{displayText}</span>
				<div
					className={`flex flex-wrap justify-center text-center items-baseline w-full leading-none ${textClassName}`}
					aria-hidden="true"
					style={{ letterSpacing }}
				>
					{processedWords.map((wordObj, wordIndex) => (
						<span key={wordIndex} className="inline-flex whitespace-nowrap">
							{wordObj.letters.map((letterObj) => (
								<div
									key={letterObj.globalIndex}
									className="inline-grid grid-cols-1 grid-rows-1"
								>
									<span
										className="invisible col-start-1 row-start-1"
										aria-hidden="true"
									>
										{letterObj.char === " " ? "\u00A0" : letterObj.char}
									</span>
									<span
										className="scramble-char col-start-1 row-start-1 opacity-0 block text-center"
										aria-hidden="true"
									>
										{letterObj.char === " " ? "\u00A0" : letterObj.char}
									</span>
								</div>
							))}
						</span>
					))}
				</div>
			</div>
		</div>
	);
};

export default ScrambleReveal;