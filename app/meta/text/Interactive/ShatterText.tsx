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

export const ShatterText: React.FC<ShatterTextProps> = ({
	text,
	textClassName = "text-4xl md:text-5xl font-black",
	scatterFactor = 400,
	color = "#FFFFFF",
	uppercase = false,
}) => {
	const [trigger, setTrigger] = useState(0);

	const displayText = uppercase ? text.toUpperCase() : text;

	// Pre-calculate random entry points for each character
	const charConfigs = useMemo(() => {
		return displayText.split("").map(() => ({
			x: (Math.random() - 0.5) * scatterFactor,
			y: (Math.random() - 0.5) * scatterFactor,
			rot: (Math.random() - 0.5) * 270,
		}));
	}, [displayText, trigger, scatterFactor]);

	return (
		<>
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
				className={`flex flex-wrap cursor-pointer overflow-visible ${textClassName}`}
				onClick={() => setTrigger((t) => t + 1)}
				style={{ color }}
			>
				{displayText.split("").map((char, i) => (
					<span
						key={`${trigger}-${i}`}
						className="inline-block animate-shatter"
						style={{
							"--startX": `${charConfigs[i].x}px`,
							"--startY": `${charConfigs[i].y}px`,
							"--startRot": `${charConfigs[i].rot}deg`,
							animationDelay: `${i * 0.04}s`,
							color: color,
						} as React.CSSProperties}
					>
						{char === " " ? "\u00A0" : char}
					</span>
				))}
			</div>
		</>
	);
};

export default ShatterText;
