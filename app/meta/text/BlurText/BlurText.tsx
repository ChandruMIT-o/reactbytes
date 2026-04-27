import React, { useRef, useEffect, useState } from "react";
import { useInView, motion, Variant, Transition } from "framer-motion";

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
}

export const BlurText: React.FC<BlurTextProps> = ({
	text = "",
	delay = 0,
	stagger = 0.05,
	className = "",
	animateBy = "letters",
	direction = "top",
	duration = 0.5,
	threshold = 0.1,
	rootMargin = "0px",
	onAnimationComplete,
	easing = "easeOut",
	loop = false,
	blurAmount = 10,
	uppercase = false,
}) => {
	const displayText = uppercase ? text.toUpperCase() : text;
	const elements = animateBy === "words" ? displayText.split(" ") : displayText.split("");
	const [inView, setInView] = useState(false);
	const ref = useRef<HTMLParagraphElement>(null);
	const animatedCount = useRef(0);

	// Use intersection observer to trigger animation
	useEffect(() => {
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					setInView(true);
					observer.unobserve(ref.current!);
				}
			},
			{ threshold, rootMargin }
		);

		if (ref.current) {
			observer.observe(ref.current);
		}

		return () => observer.disconnect();
	}, [threshold, rootMargin]);

	const getVariants = () => {
		const yOffset = direction === "top" ? -40 : direction === "bottom" ? 40 : 0;

		return {
			hidden: {
				filter: `blur(${blurAmount}px)`,
				opacity: 0,
				y: yOffset,
			},
			visible: {
				filter: "blur(0px)",
				opacity: 1,
				y: 0,
			},
		};
	};

	const variants = getVariants();

	return (
		<p
			ref={ref}
			className={`flex flex-wrap items-center justify-center ${className}`}
		>
			{elements.map((el, i) => (
				<motion.span
					key={i}
					initial="hidden"
					animate={
						inView
							? loop
								? {
										filter: ["blur(0px)", `blur(${blurAmount}px)`, "blur(0px)"],
										opacity: [1, 0.5, 1],
										y: 0,
								  }
								: "visible"
							: "hidden"
					}
					variants={variants}

					transition={
						(loop
							? {
									duration: duration * 2,
									repeat: Infinity,
									delay: delay + i * stagger,
									ease: "easeInOut",
							  }
							: {
									delay: delay + i * stagger,
									duration: duration,
									ease: easing,
									type: "spring",
									damping: 12,
									stiffness: 100,
							  }) as any
					}
					onAnimationComplete={() => {
						if (!loop) {
							animatedCount.current += 1;
							if (animatedCount.current === elements.length && onAnimationComplete) {
								onAnimationComplete();
							}
						}
					}}
					className="inline-block"
					style={{ whiteSpace: "pre" }}
				>
					{el === " " ? "\u00A0" : el}
					{animateBy === "words" && i < elements.length - 1 && "\u00A0"}
				</motion.span>
			))}
		</p>
	);
};



export default BlurText;

