"use client";

import React, { useRef, useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";

export interface BlurTextProps {
	/** The text to display and animate */
	text?: string;
	/** Delay before starting the animation in seconds */
	delay?: number;
	/** Stagger delay between each element in seconds */
	stagger?: number;
	/** Additional wrapper CSS classes */
	className?: string;
	/** Whether to animate by words or letters */
	animateBy?: "words" | "letters";
	/** Direction from which the text appears */
	direction?: "top" | "bottom" | "none";
	/** Duration of the animation per element */
	duration?: number;
	/** Threshold for intersection observer (0 to 1) */
	threshold?: number;
	/** Root margin for intersection observer */
	rootMargin?: string;
	/** Callback when animation is complete */
	onAnimationComplete?: () => void;
	/** Easing function for the animation */
	easing?: any;
	/** Whether the animation should loop continuously */
	loop?: boolean;
	/** Peak blur amount in pixels */
	blurAmount?: number;
	/** Whether to force text to uppercase */
	uppercase?: boolean;
	/** Initial blur amount */
	initialBlur?: number;
	/** Final opacity */
	endOpacity?: number;
	/** Text color */
	color?: string;
	/** Animate immediately instead of waiting for viewport */
	triggerOnView?: boolean;
	animationStyle?: "blur-text" | "blur-in";
}

interface BlurInRendererProps {
	text: string;
	duration: number;
	stagger: number;
	easing: any;
	initialBlur: number;
	endOpacity: number;
	color: string;
	uppercase: boolean;
	className?: string;
}

interface WordLetter {
	char: string;
	index: number;
}

interface WordGroup {
	word: string;
	letters: WordLetter[];
}

interface WordElement {
	text: string;
	index: number;
}

interface LetterElement {
	letters: { char: string; index: number }[];
}

const BlurInRenderer = ({
	text,
	duration,
	stagger,
	easing,
	initialBlur,
	endOpacity,
	color,
	uppercase,
	className,
}: BlurInRendererProps) => {
	const words = useMemo<WordGroup[]>(() => {
		const displayText = uppercase ? text.toUpperCase() : text;
		const wordsArray = displayText.split(" ");
		let globalIndex = 0;

		return wordsArray.map((word: string) => {
			const letters = word.split("").map((char) => {
				const charObj = { char, index: globalIndex };
				globalIndex++;
				return charObj;
			});
			globalIndex++;
			return { word, letters };
		});
	}, [text, uppercase]);

	return (
		<div className="w-full @container">
			<motion.div
				className={`flex flex-wrap justify-center items-center ${className ?? ""}`}
				initial="hidden"
				animate="visible"
			>
				{words.map((wordObj, wordIndex) => (
					<span
						key={wordIndex}
						className="inline-flex whitespace-nowrap"
						style={{ marginRight: wordIndex < words.length - 1 ? "0.25em" : "0" }}
					>
						{wordObj.letters.map((letter) => (
							<motion.span
								key={`${wordIndex}-${letter.index}`}
								variants={{
									hidden: {
										opacity: 0,
										filter: `blur(${initialBlur}px)`,
									},
									visible: {
										opacity: endOpacity,
										filter: "blur(0px)",
										transition: {
											duration,
											ease: easing,
											delay: letter.index * stagger,
										},
									},
								}}
								className="inline-block"
								style={{ color }}
							>
								{letter.char}
							</motion.span>
						))}
					</span>
				))}
			</motion.div>
		</div>
	);
};

export const BlurText: React.FC<BlurTextProps> = ({
	text = "",
	delay = 0,
	stagger = 0.05,
	// Removed @container from here so it doesn't self-conflict
	className = "text-[clamp(1.5rem,8cqw,4rem)] text-center",
	animateBy = "letters",
	direction = "top",
	duration = 0.5,
	threshold = 0.1,
	rootMargin = "0px",
	onAnimationComplete,
	easing = "easeOut",
	loop = false,
	blurAmount = 10,
	initialBlur,
	endOpacity = 1,
	color = "#FFFFFF",
	triggerOnView = true,
	animationStyle = "blur-in",
	uppercase = false,
}) => {
	const [inView, setInView] = useState(false);
	const ref = useRef<HTMLParagraphElement>(null);
	const animatedCount = useRef(0);
	const blurValue = initialBlur ?? blurAmount;
	const shouldAnimate = triggerOnView ? inView : true;

	const parsedElements = useMemo<(WordElement | LetterElement)[]>(() => {
		const displayText = uppercase ? text.toUpperCase() : text;
		const wordsArray = displayText.split(" ");
		let globalIndex = 0;

		return wordsArray.map((word) => {
			if (animateBy === "words") {
				const wordObj: WordElement = { text: word, index: globalIndex };
				globalIndex++;
				return wordObj;
			} else {
				const letters = word.split("").map((char) => {
					const charObj = { char, index: globalIndex };
					globalIndex++;
					return charObj;
				});
				globalIndex++;
				const letterObj: LetterElement = { letters };
				return letterObj;
			}
		});
	}, [text, uppercase, animateBy]);

	const totalAnimatedElements = useMemo(() => {
		if (animateBy === "words") return parsedElements.length;
		return parsedElements.reduce((acc, curr) => {
			if ("letters" in curr) {
				return acc + curr.letters.length;
			}
			return acc;
		}, 0);
	}, [parsedElements, animateBy]);

	useEffect(() => {
		if (!triggerOnView) {
			setInView(true);
			return;
		}

		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					setInView(true);
					if (ref.current) {
						observer.unobserve(ref.current);
					}
				}
			},
			{ threshold, rootMargin }
		);

		if (ref.current) {
			observer.observe(ref.current);
		}

		return () => observer.disconnect();
	}, [threshold, rootMargin, triggerOnView]);

	const getVariants = () => {
		const yOffset = direction === "top" ? -40 : direction === "bottom" ? 40 : 0;
		return {
			hidden: {
				filter: `blur(${blurValue}px)`,
				opacity: 0,
				y: yOffset,
			},
			visible: {
				filter: "blur(0px)",
				opacity: endOpacity,
				y: 0,
			},
		};
	};

	const variants = getVariants();

	if (animationStyle === "blur-in") {
		return (
			<BlurInRenderer
				text={text}
				duration={duration}
				stagger={stagger}
				easing={easing}
				initialBlur={blurValue}
				endOpacity={endOpacity}
				color={color}
				uppercase={uppercase}
				className={className}
			/>
		);
	}

	const handleAnimationComplete = () => {
		if (!loop) {
			animatedCount.current += 1;
			if (animatedCount.current === totalAnimatedElements && onAnimationComplete) {
				onAnimationComplete();
			}
		}
	};

	return (
		<div className="w-full @container">
			<p
				ref={ref}
				className={`flex flex-wrap items-center justify-center ${className}`}
			>
				{parsedElements.map((item, i) => {
					const isLast = i === parsedElements.length - 1;

					if ("text" in item) {
						return (
							<motion.span
								key={i}
								initial="hidden"
								animate={
									shouldAnimate
										? loop
											? {
												filter: ["blur(0px)", `blur(${blurValue}px)`, "blur(0px)"],
												opacity: [1, 0.5, 1],
												y: 0,
											}
											: "visible"
										: "hidden"
								}
								variants={variants}
								transition={(loop ? {
									duration: duration * 2,
									repeat: Infinity,
									delay: delay + item.index * stagger,
									ease: "easeInOut",
								} : {
									delay: delay + item.index * stagger,
									duration: duration,
									ease: easing,
									type: "spring",
									damping: 12,
									stiffness: 100,
								}) as any}
								onAnimationComplete={handleAnimationComplete}
								className="inline-block whitespace-nowrap"
								style={{ color, marginRight: isLast ? "0" : "0.25em" }}
							>
								{item.text}
							</motion.span>
						);
					} else {
						return (
							<span
								key={i}
								className="inline-flex whitespace-nowrap"
								style={{ marginRight: isLast ? "0" : "0.25em" }}
							>
								{item.letters.map((letter) => (
									<motion.span
										key={letter.index}
										initial="hidden"
										animate={
											shouldAnimate
												? loop
													? {
														filter: ["blur(0px)", `blur(${blurValue}px)`, "blur(0px)"],
														opacity: [1, 0.5, 1],
														y: 0,
													}
													: "visible"
												: "hidden"
										}
										variants={variants}
										transition={(loop ? {
											duration: duration * 2,
											repeat: Infinity,
											delay: delay + letter.index * stagger,
											ease: "easeInOut",
										} : {
											delay: delay + letter.index * stagger,
											duration: duration,
											ease: easing,
											type: "spring",
											damping: 12,
											stiffness: 100,
										}) as any}
										onAnimationComplete={handleAnimationComplete}
										className="inline-block"
										style={{ color }}
									>
										{letter.char}
									</motion.span>
								))}
							</span>
						);
					}
				})}
			</p>
		</div>
	);
};

export default BlurText;