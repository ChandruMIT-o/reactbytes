export const focalBlurTextProps = [
	{
		title: "Core Props",
		props: [
			{
				name: "text",
				type: "string",
				defaultValue: "''",
				description: "The text to apply the focal blur effect.",
			},
			{
				name: "maxDistance",
				type: "number",
				defaultValue: "250",
				description: "The radial distance around the cursor where the focus takes effect.",
			},
			{
				name: "focusColor",
				type: "string",
				defaultValue: "'#60a5fa'",
				description: "Hex color for the highlighted text in focus. Pass 'inherit' to disable.",
			},
			{
				name: "maxBlur",
				type: "number",
				defaultValue: "12",
				description: "Maximum blur pixel amount for out of focus elements.",
			},
			{
				name: "color",
				type: "string",
				defaultValue: "'#FFFFFF'",
				description: "The base color of the text letters.",
			},
			{
				name: "uppercase",
				type: "boolean",
				defaultValue: "false",
				description: "Whether to force the text to uppercase.",
			},
		],
	},
	{
		title: "Styling Props",
		props: [
			{
				name: "textClassName",
				type: "string",
				defaultValue: "'text-4xl md:text-5xl font-black'",
				description: "Tailwind sizing/font classes.",
			},
		],
	},
];

export const focalBlurTextComponentCode = `"use client";

import React, { useRef, useEffect } from "react";

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

export const FocalBlurText: React.FC<FocalBlurTextProps> = ({
	text,
	textClassName = "text-4xl md:text-5xl font-black",
	maxDistance = 250,
	focusColor = "#60a5fa",
	maxBlur = 12,
	color = "#FFFFFF",
	uppercase = false,
}) => {
	const containerRef = useRef<HTMLDivElement>(null);
	const lettersRef = useRef<(HTMLSpanElement | null)[]>([]);

	const displayText = uppercase ? text.toUpperCase() : text;

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

			// Calculate blur, opacity, and scale based on distance to cursor
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

			letter.style.filter = \`blur(\${blur}px)\`;
			letter.style.opacity = opacity.toString();
			letter.style.transform = \`scale(\${scale})\`;
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
		return handleMouseLeave; // Clean up on unmount
	}, []);

	return (
		<div
			ref={containerRef}
			onMouseMove={(e) => handleMove(e.clientX, e.clientY)}
			onTouchMove={(e) =>
				handleMove(e.touches[0].clientX, e.touches[0].clientY)
			}
			onMouseLeave={handleMouseLeave}
			onTouchEnd={handleMouseLeave}
			style={{ color }}
			className={\`flex flex-wrap cursor-crosshair touch-none \${textClassName}\`}
		>
			{displayText.split("").map((char, i) => (
				<span
					key={i}
					ref={(el) => {
						lettersRef.current[i] = el;
					}}
					style={{ color }}
					className="inline-block transition-all duration-300 ease-out will-change-[filter,transform,opacity]"
				>
					{char === " " ? "\\u00A0" : char}
				</span>
			))}
		</div>
	);
};

export default FocalBlurText;`;

export const creditsData = [
	{
		title: "Component Source",
		items: [
			{
				name: "React Bytes",
				role: "Collection",
				url: "https://reactbytes.dev",
			},
		],
	},
	{
		title: "Open Source Libraries",
		items: [
			{
				name: "React",
				role: "UI Framework",
				url: "https://react.dev",
			},
			{
				name: "Tailwind CSS",
				role: "Styling",
				url: "https://tailwindcss.com",
			},
		],
	},
];
