import React, { useMemo } from "react";

export interface BlurTextProps {
	/** The text to display and animate */
	text?: string;
	/** Duration of a single animation cycle in seconds */
	animationDuration?: number;
	/** Delay multiplier between each letter's animation start in seconds */
	staggerDelay?: number;
	/** Maximum blur amount (e.g., '4px', '8px', '0.5rem') */
	maxBlur?: string;
	/** Tailwind class for text color */
	textColorClass?: string;
	/** Whether the loader should cover the entire screen (fixed) or fill its parent (relative) */
	isOverlay?: boolean;
	/** Additional wrapper CSS classes */
	containerClassName?: string;
	/** Additional text container CSS classes (useful for font families) */
	textClassName?: string;
}

export const BlurText: React.FC<BlurTextProps> = ({
	text = "LOADING",
	animationDuration = 1.5,
	staggerDelay = 0.2,
	maxBlur = "4px",
	textColorClass = "text-white",
	isOverlay = true,
	containerClassName = "",
	textClassName = "",
}) => {
	// Memoize the array to prevent unnecessary recalculations on re-renders
	const letters = useMemo(() => text.split(""), [text]);

	// Sanitize the blur value to create a valid, unique animation name
	const animationName = `blur-text-${maxBlur.replace(/[^a-zA-Z0-9]/g, "")}`;

	return (
		<>
			<style>{`
        @keyframes ${animationName} {
          0% { filter: blur(0px); }
          100% { filter: blur(${maxBlur}); }
        }
      `}</style>

			<div
				className={`
          ${isOverlay ? "fixed inset-0 z-[9999]" : "relative w-full h-full"}
          ${containerClassName}
        `}
			>
				<div
					className={`
            absolute inset-0 m-auto flex items-center justify-center
            w-full h-24
            ${textClassName}
          `}
				>
					{letters.map((char, index) => (
						<span
							key={`${index}-${char}`}
							className={`inline-block mx-1 sm:mx-1.5 ${textColorClass}`}
							style={{
								animation: `${animationName} ${animationDuration}s ${
									index * staggerDelay
								}s infinite linear alternate`,
							}}
						>
							{/* Preserve spaces in the text prop */}
							{char === " " ? "\u00A0" : char}
						</span>
					))}
				</div>
			</div>
		</>
	);
};

export default BlurText;
