export const loaderProps = [
	{
		title: "Core Props",
		props: [
			{
				name: "words",
				type: "string[]",
				defaultValue: "['CREATE', 'DESIGN', 'DEVELOP']",
				description: "The array of words to rotate through.",
			},
			{
				name: "duration",
				type: "number",
				defaultValue: "3",
				description: "Time spent on each word in seconds.",
			},
			{
				name: "morphSpeed",
				type: "number",
				defaultValue: "1",
				description: "Speed of the morph transition in seconds.",
			},
			{
				name: "yOffset",
				type: "number",
				defaultValue: "20",
				description: "Vertical displacement during the morph.",
			},
		],
	},
	{
		title: "Styling Props",
		props: [
			{
				name: "textColorClass",
				type: "string",
				defaultValue: "'text-rb-accent-1'",
				description: "Tailwind class for the text color.",
			},
			{
				name: "textClassName",
				type: "string",
				defaultValue: "'text-6xl md:text-8xl font-bold font-sans tracking-tighter uppercase'",
				description: "Extra classes for font style and size.",
			},
			{
				name: "className",
				type: "string",
				defaultValue: "''",
				description: "Additional wrapper CSS classes.",
			},
		],
	},
];

export const componentCode = `"use client";

import React, { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface GooeyMorphProps {
	/** Array of words to rotate through */
	words?: string[];
	/** Duration spent on each word in seconds */
	duration?: number;
	/** Morph speed in seconds */
	morphSpeed?: number;
	/** Tailwind class for text color */
	textColorClass?: string;
	/** Additional wrapper CSS classes */
	className?: string;
	/** Additional text container CSS classes */
	textClassName?: string;
	/** Vertical offset for the morph animation */
	yOffset?: number;
}

export const GooeyMorph: React.FC<GooeyMorphProps> = ({
	words = ["CREATE", "DESIGN", "DEVELOP"],
	duration = 3,
	morphSpeed = 1,
	textColorClass = "text-rb-accent-1",
	className = "",
	textClassName = "text-6xl md:text-8xl font-bold font-sans tracking-tighter uppercase",
	yOffset = 20,
}) => {
	const [index, setIndex] = useState(0);

	useEffect(() => {
		const interval = setInterval(() => {
			setIndex((prev) => (prev + 1) % words.length);
		}, duration * 1000);
		return () => clearInterval(interval);
	}, [words.length, duration]);

	// Unique ID for the filter to avoid conflicts
	const filterId = useMemo(() => \`gooey-morph-\${Math.random().toString(36).substr(2, 9)}\`, []);

	return (
		<div className={\`relative flex items-center justify-center \${className}\`}>
			{/* SVG Filter Definition */}
			<svg className="absolute w-0 h-0 invisible pointer-events-none">
				<defs>
					<filter id={filterId}>
						<feColorMatrix
							in="SourceGraphic"
							type="matrix"
							values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 25 -9"
							result="goo"
						/>
						<feComposite in="SourceGraphic" in2="goo" operator="atop" />
					</filter>
				</defs>
			</svg>

			<div 
				style={{ filter: \`url(#\${filterId})\` }}
				className="relative flex items-center justify-center overflow-visible"
			>
				<AnimatePresence initial={false}>
					<motion.span
						key={index}
						initial={{ 
							opacity: 0, 
							scale: 0.8, 
							filter: "blur(20px)",
							y: yOffset,
							letterSpacing: "-0.1em"
						}}
						animate={{ 
							opacity: 1, 
							scale: 1, 
							filter: "blur(0px)",
							y: 0,
							letterSpacing: "0em"
						}}
						exit={{ 
							opacity: 0, 
							scale: 1.2, 
							filter: "blur(20px)",
							y: -yOffset,
							letterSpacing: "0.1em",
							position: "absolute" 
						}}
						transition={{
							duration: morphSpeed,
							ease: [0.34, 1.56, 0.64, 1],
						}}
						className={\`inline-block whitespace-nowrap \${textColorClass} \${textClassName}\`}
					>
						{words[index]}
					</motion.span>
				</AnimatePresence>
			</div>
		</div>
	);
};

export default GooeyMorph;`;

export const creditsData = [
	{
		title: "Component Source",
		items: [
			{
				name: "Creative Designs",
				role: "Visual Designer",
				url: "https://codepen.io/lmgonzalves/pen/XWwjYmO",
			},
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
				name: "Framer Motion",
				role: "Animations",
				url: "https://www.framer.com/motion/",
			},
			{
				name: "Tailwind CSS",
				role: "Styling",
				url: "https://tailwindcss.com",
			},
		],
	},
];
