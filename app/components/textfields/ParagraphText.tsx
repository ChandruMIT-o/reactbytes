"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type HeaderOption = 1 | 2 | 3 | 4 | 5;

interface ParagraphTextProps extends React.HTMLAttributes<HTMLParagraphElement> {
	text: string;
	option?: HeaderOption;
	textColor?: string;
}

const paragraphStyles: Record<HeaderOption, string> = {
	1: "text-2xl md:text-3xl font-light leading-relaxed",
	2: "text-xl md:text-2xl font-light leading-relaxed",
	3: "text-lg md:text-xl font-light leading-relaxed",
	4: "text-base md:text-lg font-light leading-relaxed",
	5: "text-sm md:text-base font-light leading-relaxed",
};

/**
 * ParagraphText component with sizing options 1 to 5.
 * Features a textColor prop and an arrow icon that appears on hover
 * to scroll the page to the top.
 */
export default function ParagraphText({
	text,
	option = 3,
	textColor,
	className,
	...props
}: ParagraphTextProps) {
	return (
		<div className="group py-4 max-w-prose">
			<p
				className={cn(
					paragraphStyles[option],
					"select-text transition-all duration-300 ease-in-out cursor-text text-foreground/80",
					className
				)}
				style={{ color: textColor }}
				{...props}
			>
				{text}
			</p>
		</div>
	);
}
