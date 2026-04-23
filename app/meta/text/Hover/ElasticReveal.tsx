"use client";

import React from "react";
import { motion, Variants } from "framer-motion";

export interface ElasticRevealProps {
	/** The text to display */
	text: string;
	/** Duration of the animation per letter in seconds */
	duration?: number;
	/** Delay between each character's animation in seconds */
	stagger?: number;
	/** Direction of the reveal: 'up' or 'down' */
	direction?: "up" | "down";
	/** Base color for the text (hex) */
	baseColor?: string;
	/** Hover color for the text (hex) */
	hoverColor?: string;
	/** Additional wrapper CSS classes */
	className?: string;
	/** Additional text container CSS classes */
	textClassName?: string;
	/** Link URL if the component should act as a link */
	href?: string;
	/** Whether to force uppercase text */
	uppercase?: boolean;
}

export const ElasticReveal: React.FC<ElasticRevealProps> = ({
	text = "REACTBYTES",
	duration = 0.6,
	stagger = 0.02,
	direction = "up",
	baseColor = "#60a5fa",
	hoverColor = "#FFFFFF",
	className = "",
	textClassName = "text-5xl md:text-7xl font-bold font-sans tracking-tighter",
	href,
	uppercase = false,
}) => {
	const displayText = uppercase ? text.toUpperCase() : text;
	const letters = displayText.split("");
	const yOffset = direction === "up" ? "-100%" : "100%";

	const containerVariants = {
		initial: {},
		hover: {},
	};

	const letterVariants: Variants = {
		initial: { y: 0 },
		hover: (i: number) => ({
			y: yOffset,
			transition: {
				duration,
				delay: i * stagger,
				ease: [0.215, 0.61, 0.355, 1] as [number, number, number, number],
			},
		}),
	};

	const Content = (
		<motion.div
			initial="initial"
			whileHover="hover"
			variants={containerVariants}
			className={`relative inline-flex overflow-hidden cursor-pointer select-none leading-[0.8] ${className}`}
		>
			<span className="sr-only">{displayText}</span>
			<div className={`flex ${textClassName}`} aria-hidden="true">
				{letters.map((char, i) => (
					<motion.span
						key={i}
						custom={i}
						variants={letterVariants}
						className="relative inline-block whitespace-pre"
					>
						<span style={{ color: baseColor }}>{char}</span>
						<span
							className="absolute top-0 left-0"
							style={{
								color: hoverColor,
								transform: `translateY(${direction === "up" ? "100%" : "-100%"})`
							}}
						>
							{char}
						</span>
					</motion.span>
				))}
			</div>
		</motion.div>
	);

	if (href) {
		return <a href={href} className="no-underline">{Content}</a>;
	}

	return Content;
};

export default ElasticReveal;
