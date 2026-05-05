"use client";

import React, { useState } from "react";
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
	/** Dictates which letter starts the animation: 'left', 'right', 'center', or 'hover' */
	animateFrom?: "left" | "right" | "center" | "hover";
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
	animateFrom = "left",
}) => {
	const [isHovered, setIsHovered] = useState(false);
	const [originIndex, setOriginIndex] = useState<number | null>(null);

	const displayText = uppercase ? text.toUpperCase() : text;
	const letters = displayText.split("");
	const yOffset = direction === "up" ? "-100%" : "100%";

	const containerVariants = {
		initial: {},
		hover: {},
	};

	const letterVariants: Variants = {
		initial: { y: 0 },
		hover: (i: number) => {
			let delay = i * stagger;
			if (animateFrom === "right") {
				delay = (letters.length - 1 - i) * stagger;
			} else if (animateFrom === "center") {
				delay = Math.abs(i - (letters.length - 1) / 2) * stagger;
			} else if (animateFrom === "hover" && originIndex !== null) {
				delay = Math.abs(i - originIndex) * stagger;
			}

			return {
				y: yOffset,
				transition: {
					duration,
					delay,
					ease: [0.215, 0.61, 0.355, 1] as [number, number, number, number],
				},
			};
		},
	};

	const handleMouseEnter = (index: number) => {
		if (animateFrom === "hover" && originIndex === null) {
			setOriginIndex(index);
		}
		setIsHovered(true);
	};

	const handleMouseLeave = () => {
		setIsHovered(false);
		setOriginIndex(null);
	};

	const Content = (
		<motion.div
			initial="initial"
			animate={isHovered ? "hover" : "initial"}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={handleMouseLeave}
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
						onMouseEnter={() => handleMouseEnter(i)}
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
