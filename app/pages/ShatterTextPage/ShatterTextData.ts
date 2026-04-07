export const shatterTextProps = [
	{
		title: "Core Props",
		props: [
			{
				name: "text",
				type: "string",
				defaultValue: "''",
				description: "The text to assemble dynamically.",
			},
			{
				name: "scatterFactor",
				type: "number",
				defaultValue: "400",
				description: "Maximum distance for initial chaos scatter on both X and Y axis.",
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
				description: "CSS classes for text sizing and weight.",
			},
		],
	},
];

export const shatterTextComponentCode = `"use client";

import React, { useState, useMemo } from "react";

export interface ShatterTextProps {
	/** The text to animate */
	text: string;
	/** Tailwind classes for the text */
	textClassName?: string;
	/** Force multiplier for initial scatter spread */
	scatterFactor?: number;
}

export const ShatterText: React.FC<ShatterTextProps> = ({
	text,
	textClassName = "text-4xl md:text-5xl font-black",
	scatterFactor = 400,
}) => {
	const [trigger, setTrigger] = useState(0);

	// Pre-calculate random entry points for each character
	const charConfigs = useMemo(() => {
		return text.split("").map(() => ({
			x: (Math.random() - 0.5) * scatterFactor,
			y: (Math.random() - 0.5) * scatterFactor,
			rot: (Math.random() - 0.5) * 270,
		}));
	}, [text, trigger, scatterFactor]);

	return (
		<>
			<style dangerouslySetInnerHTML={{
				__html: \`
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
					animation: shatter-in 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
					opacity: 0; 
				}
			\`}} />
			<div
				className={\`flex flex-wrap cursor-pointer overflow-visible \${textClassName}\`}
				onClick={() => setTrigger((t) => t + 1)}
			>
				{text.split("").map((char, i) => (
					<span
						key={\`\${trigger}-\${i}\`}
						className="inline-block animate-shatter"
						style={{
							"--startX": \`\${charConfigs[i].x}px\`,
							"--startY": \`\${charConfigs[i].y}px\`,
							"--startRot": \`\${charConfigs[i].rot}deg\`,
							animationDelay: \`\${i * 0.04}s\`,
						} as React.CSSProperties}
					>
						{char === " " ? "\\u00A0" : char}
					</span>
				))}
			</div>
		</>
	);
};

export default ShatterText;`;

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
