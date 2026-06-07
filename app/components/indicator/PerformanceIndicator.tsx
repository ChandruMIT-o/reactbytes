"use client";

import React from "react";
import { motion } from "framer-motion";
import { Activity } from "lucide-react";
import { cn } from "@/lib/utils";

export type PerformanceLevel = "low" | "medium" | "high" | "extreme";

interface PerformanceIndicatorProps {
	level: PerformanceLevel;
	className?: string;
}

const config = {
	low: {
		label: "Low Impact",
		textColor: "text-rb-accent-1",
		semanticText: "text-emerald-400",
		semanticBg: "bg-emerald-400",
		bars: 1,
	},
	medium: {
		label: "Medium Impact",
		textColor: "text-rb-accent-1",
		semanticText: "text-amber-400",
		semanticBg: "bg-amber-400",
		bars: 2,
	},
	high: {
		label: "High Impact",
		textColor: "text-rb-accent-2",
		semanticText: "text-orange-500",
		semanticBg: "bg-orange-500",
		bars: 3,
	},
	extreme: {
		label: "Extreme Impact",
		textColor: "text-rb-accent-3",
		semanticText: "text-rose-500",
		semanticBg: "bg-rose-500",
		bars: 4,
	},
};

export const PerformanceIndicator: React.FC<PerformanceIndicatorProps> = ({
	level,
	className,
}) => {
	const current = config[level];

	return (
		<motion.div
			initial={{ opacity: 0, y: 5, filter: "blur(4px)" }}
			animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
			className={cn(
				"flex items-center gap-3 p-1 bg-rb-neutral-3 rounded-full shadow-lg shadow-black/20 border border-rb-neutral-4/50 backdrop-blur-sm transition-all duration-300 w-fit",
				className
			)}
		>
			{/* Icon Box */}
			<div className="relative flex items-center shrink-0">
				<div
					className={cn(
						"w-8 h-8 flex items-center justify-center transition-colors duration-300 rounded-full border border-white/10 shadow-inner bg-rb-neutral-4/30",
						current.semanticText
					)}
				>
					<Activity size={12} />
				</div>
			</div>

			{/* Label & Info */}
			<div className="flex flex-col flex-1 min-w-0 pr-4 py-1">
				<span className="text-[7px] font-bold uppercase tracking-[0.2em] text-rb-accent-1/40 leading-none">
					Performance
				</span>
				<div className="flex items-center gap-3 mt-0.5 h-4">
					<span className={cn("text-[13px] font-sans font-bold tracking-wide leading-none", current.textColor)}>
						{current.label}
					</span>
					
					{/* Bars */}
					<div className="flex gap-[3px] items-end h-full py-[1px]">
						{[1, 2, 3, 4].map((i) => (
							<motion.div
								key={i}
								className={cn(
									"w-[3px] rounded-full transition-all duration-500",
									i <= current.bars ? current.semanticBg : "bg-rb-neutral-4/30"
								)}
								initial={{ height: 4 }}
								animate={{ height: i <= current.bars ? 10 : 4 }}
								transition={{ delay: i * 0.1, type: "spring", stiffness: 300 }}
							/>
						))}
					</div>
				</div>
			</div>
		</motion.div>
	);
};

export default PerformanceIndicator;
