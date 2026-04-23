"use client";

import React, { useRef, useEffect } from "react";

export interface WaveTextProps {
	/** The text to animate */
	text: string;
	/** Tailwind classes for the text */
	textClassName?: string;
	/** Maximum distance of effect from cursor (px) */
	maxDistance?: number;
	/** Hex color for the letter when hovered */
	hoverColor?: string;
	/** Base color for the text */
	color?: string;
	/** Whether to force uppercase text */
	uppercase?: boolean;
}

export const WaveText: React.FC<WaveTextProps> = ({
	text,
	textClassName = "text-4xl md:text-5xl font-bold",
	maxDistance = 120,
	hoverColor = "#34d399",
	color = "#FFFFFF",
	uppercase = false,
}) => {
	const containerRef = useRef<HTMLDivElement>(null);
	const lettersRef = useRef<(HTMLSpanElement | null)[]>([]);

	const displayText = uppercase ? text.toUpperCase() : text;

	const handleMove = (clientX: number) => {
		if (!containerRef.current) return;
		const rect = containerRef.current.getBoundingClientRect();
		const mouseX = clientX - rect.left;

		lettersRef.current.forEach((letter) => {
			if (!letter) return;
			const letterRect = letter.getBoundingClientRect();
			const letterCenterX =
				letterRect.left - rect.left + letterRect.width / 2;
			const dist = Math.abs(mouseX - letterCenterX);

			if (dist < maxDistance) {
				const force = Math.max(0, 1 - dist / maxDistance);
				const scale = 1 + Math.pow(force, 2) * 0.6;
				const y = -Math.pow(force, 2) * 20;
				const rot =
					(mouseX > letterCenterX ? -1 : 1) *
					Math.pow(force, 2) *
					15;

				letter.style.transform = `translateY(${y}px) scale(${scale}) rotate(${rot}deg)`;
				letter.style.color = hoverColor;
				letter.style.zIndex = "10";
			} else {
				resetLetter(letter);
			}
		});
	};

	const resetLetter = (letter: HTMLSpanElement) => {
		letter.style.transform = `translateY(0) scale(1) rotate(0deg)`;
		letter.style.color = color;
		letter.style.zIndex = "1";
	};

	const handleMouseLeave = () => {
		lettersRef.current.forEach(
			(letter) => letter && resetLetter(letter),
		);
	};

	// Clean up on unmount
	useEffect(() => {
		return () => {
			lettersRef.current.forEach(
				(letter) => letter && resetLetter(letter),
			);
		};
	}, []);

	return (
		<div
			ref={containerRef}
			onMouseMove={(e) => handleMove(e.clientX)}
			onTouchMove={(e) => handleMove(e.touches[0].clientX)}
			onMouseLeave={handleMouseLeave}
			onTouchEnd={handleMouseLeave}
			style={{ color }}
			className={`flex flex-wrap cursor-default touch-none ${textClassName}`}
		>
			{displayText.split("").map((char, i) => (
				<span
					key={i}
					ref={(el) => {
						lettersRef.current[i] = el;
					}}
					style={{ color }}
					className="inline-block transition-all duration-200 ease-out origin-bottom"
				>
					{char === " " ? "\u00A0" : char}
				</span>
			))}
		</div>
	);
};

export default WaveText;
