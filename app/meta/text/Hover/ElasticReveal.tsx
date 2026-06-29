"use client";

import React, { useState, useMemo } from "react";
import { motion, Variants } from "framer-motion";

export interface ElasticRevealProps {
	text: string;
	duration?: number;
	stagger?: number;
	direction?: "up" | "down";
	baseColor?: string;
	hoverColor?: string;
	className?: string;
	textClassName?: string;
	href?: string;
	uppercase?: boolean;
	animateFrom?: "left" | "right" | "center" | "hover";
}

export const ElasticReveal: React.FC<ElasticRevealProps> = ({
	text = "REACT BYTES",
	duration = 0.6,
	stagger = 0.02,
	direction = "up",
	baseColor = "#60a5fa",
	hoverColor = "#FFFFFF",
	className = "",
	// Swapped from 8vw to 8cqw for bulletproof container scaling
	textClassName = "text-[clamp(1.5rem,8cqw,5rem)] font-bold font-sans tracking-tighter text-center",
	href,
	uppercase = false,
	animateFrom = "left",
}) => {
	const [isHovered, setIsHovered] = useState(false);
	const [originIndex, setOriginIndex] = useState<number | null>(null);

	const words = useMemo(() => {
		const finalRef = uppercase ? text.toUpperCase() : text;
		const wordsArray = finalRef.split(" ");
		let globalIndex = 0;

		return wordsArray.map((word) => {
			const letters = word.split("").map((char) => {
				const charObj = { char, index: globalIndex };
				globalIndex++;
				return charObj;
			});
			globalIndex++;
			return { word, letters };
		});
	}, [text, uppercase]);

	const totalChars = text.length;
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
				delay = (totalChars - 1 - i) * stagger;
			} else if (animateFrom === "center") {
				delay = Math.abs(i - (totalChars - 1) / 2) * stagger;
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
			// Replaced inline-flex with flex w-full to prevent compressed boundaries
			className={`relative flex w-full flex-col items-center justify-center cursor-pointer select-none leading-none ${className}`}
		>
			<span className="sr-only">{text}</span>
			<div className={`flex flex-wrap justify-center w-full gap-y-2 ${textClassName}`} aria-hidden="true">
				{words.map((wordObj, wordIndex) => {
					const isLast = wordIndex === words.length - 1;
					return (
						<span
							key={wordIndex}
							className="inline-flex whitespace-nowrap"
							style={{ marginRight: isLast ? "0" : "0.25em" }}
						>
							{wordObj.letters.map((letter) => (
								<span
									key={letter.index}
									className="relative inline-block overflow-hidden align-bottom"
								>
									<motion.span
										custom={letter.index}
										variants={letterVariants}
										onMouseEnter={() => handleMouseEnter(letter.index)}
										className="relative inline-block whitespace-pre"
									>
										<span style={{ color: baseColor }}>{letter.char}</span>
										<span
											className="absolute top-0 left-0"
											style={{
												color: hoverColor,
												transform: `translateY(${direction === "up" ? "100%" : "-100%"})`
											}}
										>
											{letter.char}
										</span>
									</motion.span>
								</span>
							))}
						</span>
					);
				})}
			</div>
		</motion.div>
	);

	if (href) {
		return (
			<div className="w-full @container">
				<a href={href} className="no-underline block w-full">
					{Content}
				</a>
			</div>
		);
	}

	return <div className="w-full @container">{Content}</div>;
};

export default ElasticReveal;