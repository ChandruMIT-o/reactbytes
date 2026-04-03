"use client";

import * as React from "react";
import { ArrowUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

type HeaderOption = 1 | 2 | 3 | 4 | 5;

interface HeaderTextProps extends React.HTMLAttributes<HTMLHeadingElement> {
	text: string;
	option?: HeaderOption;
	textColor?: string;
}

const headerStyles: Record<HeaderOption, string> = {
	1: "text-5xl md:text-7xl font-black tracking-tight leading-tight",
	2: "text-4xl md:text-6xl font-extrabold tracking-tight",
	3: "text-3xl md:text-5xl font-bold tracking-tight",
	4: "text-2xl md:text-4xl font-semibold",
	5: "text-xl md:text-3xl font-medium",
};

/**
 * HeaderText component with header options 1 to 5.
 * Features a textColor prop and an arrow icon that appears on hover
 * to scroll the page to the top.
 */
export default function HeaderText({
	text,
	option = 1,
	textColor,
	className,
	...props
}: HeaderTextProps) {
	const [isHovered, setIsHovered] = React.useState(false);
	const Tag = `h${option}` as "h1" | "h2" | "h3" | "h4" | "h5";

	return (
		<div
			className="group flex flex-row items-center gap-4 py-4 w-fit"
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
		>
			<Tag
				className={cn(
					headerStyles[option],
					"select-none transition-all duration-300 ease-in-out cursor-default",
					className
				)}
				style={{ color: textColor }}
				{...props}
			>
				{text}
			</Tag>
			<AnimatePresence>
				{isHovered && (
					<motion.button
						initial={{ opacity: 0, x: -20, scale: 0.5, rotate: -45 }}
						animate={{ opacity: 1, x: 0, scale: 1, rotate: 0 }}
						exit={{ opacity: 0, x: -20, scale: 0.5, rotate: -45 }}
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						className="relative flex items-center justify-center w-[38px] h-[38px] rounded-full bg-[#181A1E] text-[#E6DFF1] hover:text-[#060010] transition-all duration-300 cursor-pointer overflow-hidden group/btn"
					>
						{/* Active Background Layer */}
						<div className="absolute inset-0 bg-gradient-to-tr from-[#F2EEE9] to-[#E5E0D8] opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
						
						<ArrowUp size={20} strokeWidth={2.5} className="relative z-10" />
					</motion.button>
				)}
			</AnimatePresence>
		</div>
	);
}
