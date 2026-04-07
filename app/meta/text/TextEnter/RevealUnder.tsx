"use client";

import React from "react";
import { motion } from "framer-motion";

export interface RevealUnderProps {
	/** The first word that acts as a cover */
	firstWord?: string;
	/** The second word that is revealed from under */
	secondWord?: string;
	/** Direction of the reveal */
	direction?: "right" | "left" | "top" | "bottom";
	/** Duration of the animation in seconds */
	duration?: number;
	/** Delay before starting the animation in seconds */
	delay?: number;
	/** Ease function for the animation */
	easing?: any;
	/** Tailwind class for text color */
	textColorClass?: string;
	/** Additional wrapper CSS classes */
	containerClassName?: string;
	/** Additional text container CSS classes */
	textClassName?: string;
}

export const RevealUnder: React.FC<RevealUnderProps> = ({
	firstWord = "Hello",
	secondWord = "World",
	direction = "right",
	duration = 1.5,
	delay = 0,
	easing = [0.785, 0.135, 0.15, 0.86],
	textColorClass = "text-rb-accent-1",
	containerClassName = "",
	textClassName = "font-sans font-bold text-5xl",
}) => {
	const isHorizontal = direction === "right" || direction === "left";

	// Initial positions for the reveal logic
	const initialPositions = {
		right: { first: "50%", second: "-100%" },
		left: { first: "-50%", second: "100%" },
		top: { first: "50%", second: "100%" },
		bottom: { first: "-50%", second: "-100%" },
	};

	const getFirstPos = () => {
		if (direction === "right") return ["50%", "50%", "0%"];
		if (direction === "left") return ["-50%", "-50%", "0%"];
		if (direction === "top") return ["0%", "0%", "0%"];
		if (direction === "bottom") return ["0%", "0%", "0%"];
		return ["0%", "0%", "0%"];
	};

	const getFirstYPos = () => {
		if (direction === "top") return ["50%", "50%", "0%"];
		if (direction === "bottom") return ["-50%", "-50%", "0%"];
		return ["0%", "0%", "0%"];
	};

	const getSecondPos = () => {
		if (direction === "right") return ["-100%", "-100%", "0%"];
		if (direction === "left") return ["100%", "100%", "0%"];
		return ["0%", "0%", "0%"];
	};

	const getSecondYPos = () => {
		if (direction === "top") return ["100%", "100%", "0%"];
		if (direction === "bottom") return ["-100%", "-100%", "0%"];
		return ["0%", "0%", "0%"];
	};

	const firstVariants = {
		hidden: {
			x: direction === "right" ? "50%" : direction === "left" ? "-50%" : 0,
			y: direction === "top" ? "50%" : direction === "bottom" ? "-50%" : 0,
		},
		visible: {
			x: getFirstPos(),
			y: getFirstYPos(),
			transition: {
				duration,
				delay,
				times: [0, 0.6, 1],
				ease: easing,
			},
		},
	};

	const secondVariants = {
		hidden: {
			x: direction === "right" ? "-100%" : direction === "left" ? "100%" : 0,
			y: direction === "top" ? "100%" : direction === "bottom" ? "-100%" : 0,
		},
		visible: {
			x: getSecondPos(),
			y: getSecondYPos(),
			transition: {
				duration,
				delay,
				times: [0, 0.6, 1],
				ease: easing,
			},
		},
	};

	const showSecondFirst = direction === "left" || direction === "top";

	return (
		<div
			className={`relative w-full flex items-center justify-center ${containerClassName}`}
		>
			<motion.div
				className={`flex ${
					isHorizontal ? "flex-row" : "flex-col"
				} items-center justify-center ${textClassName} uppercase tracking-wider`}
				initial="hidden"
				animate="visible"
				variants={{
					hidden: { opacity: 0, scale: 1 },
					visible: {
						opacity: 1,
						scale: [1, 1.1, 1],
						transition: { duration, delay, ease: "easeInOut" },
					},
				}}
			>
				{showSecondFirst && (
					<div className="inline-flex overflow-hidden">
						<motion.span
							variants={secondVariants}
							className={`relative z-0 px-2 ${textColorClass} font-light`}
						>
							{secondWord}
						</motion.span>
					</div>
				)}

				<motion.span
					variants={firstVariants}
					className={`relative z-10 bg-background px-2 ${textColorClass}`}
				>
					{firstWord}
				</motion.span>

				{!showSecondFirst && (
					<div className="inline-flex overflow-hidden">
						<motion.span
							variants={secondVariants}
							className={`relative z-0 px-2 ${textColorClass} font-light`}
						>
							{secondWord}
						</motion.span>
					</div>
				)}
			</motion.div>
		</div>
	);
};

export default RevealUnder;
