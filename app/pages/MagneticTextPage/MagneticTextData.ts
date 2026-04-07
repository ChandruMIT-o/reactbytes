export const magneticTextProps = [
	{
		title: "Core Props",
		props: [
			{
				name: "text",
				type: "string",
				defaultValue: "''",
				description: "The text to repel away from the cursor.",
			},
			{
				name: "maxDistance",
				type: "number",
				defaultValue: "140",
				description: "The activation distance for the repulsion physics.",
			},
			{
				name: "repelForce",
				type: "number",
				defaultValue: "30",
				description: "The multiplier for the strength of the magnetic push.",
			},
			{
				name: "hoverColor",
				type: "string",
				defaultValue: "'#c084fc'",
				description: "Color to apply when the character is deflected.",
			},
		],
	},
	{
		title: "Styling Props",
		props: [
			{
				name: "textClassName",
				type: "string",
				defaultValue: "'text-4xl md:text-5xl font-bold'",
				description: "CSS classes for text sizing and weight.",
			},
		],
	},
];

export const magneticTextComponentCode = `"use client";

import React, { useRef, useEffect } from "react";

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
}

export const MagneticText: React.FC<MagneticTextProps> = ({
	text,
	textClassName = "text-4xl md:text-5xl font-bold",
	maxDistance = 140,
	repelForce = 30,
	hoverColor = "#c084fc",
}) => {
	const containerRef = useRef<HTMLDivElement>(null);
	const lettersRef = useRef<(HTMLSpanElement | null)[]>([]);

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
				// Calculate repulsion force based on proximity
				const force = Math.pow(
					(maxDistance - distance) / maxDistance,
					1.2,
				);
				const moveX = (distX / distance) * force * -repelForce;
				const moveY = (distY / distance) * force * -repelForce;
				const rotate = (distX / distance) * force * 40;

				letter.style.transform = \`translate(\${moveX}px, \${moveY}px) rotate(\${rotate}deg) scale(\${
					1 + force * 0.4
				})\`;
				letter.style.color = hoverColor;
				letter.style.zIndex = "10";
			} else {
				resetLetter(letter);
			}
		});
	};

	const resetLetter = (letter: HTMLSpanElement) => {
		letter.style.transform = \`translate(0px, 0px) rotate(0deg) scale(1)\`;
		letter.style.color = "inherit";
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
		<div
			ref={containerRef}
			onMouseMove={(e) => handleMove(e.clientX, e.clientY)}
			onTouchMove={(e) =>
				handleMove(e.touches[0].clientX, e.touches[0].clientY)
			}
			onMouseLeave={handleMouseLeave}
			onTouchEnd={handleMouseLeave}
			className={\`flex flex-wrap cursor-default touch-none \${textClassName}\`}
		>
			{text.split("").map((char, i) => (
				<span
					key={i}
					ref={(el) => {
						lettersRef.current[i] = el;
					}}
					className="inline-block transition-all duration-300 ease-out origin-center"
				>
					{char === " " ? "\\u00A0" : char}
				</span>
			))}
		</div>
	);
};

export default MagneticText;`;

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
