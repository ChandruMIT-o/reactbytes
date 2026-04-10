"use client";

import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";

const colorPresets = [
	"#EF4444",
	"#F97316",
	"#F59E0B",
	"#10B981",
	"#3B82F6",
	"#8B5CF6",
	"#EAB308",
	"#84CC16",
	"#22C55E",
	"#14B8A6",
	"#06B6D4",
	"#0EA5E9",
	"#6366F1",
	"#A855F7",
	"#D946EF",
	"#EC4899",
	"#F43F5E",
	"#64748B",
];

export interface ColorPickerProps {
	value?: string;
	defaultValue?: string;
	onChange?: (value: string) => void;
	className?: string;
	label?: string;
	presets?: string[];
	compact?: boolean;
}

const normalizeHex = (value: string) => {
	const normalized = value.trim();
	return normalized.startsWith("#")
		? normalized.toUpperCase()
		: `#${normalized.toUpperCase()}`;
};

export default function ColorPicker({
	value,
	defaultValue = colorPresets[0],
	onChange,
	className = "",
	label = "Selected",
	presets = colorPresets,
	compact = false,
}: ColorPickerProps) {
	const [selectedColorState, setSelectedColorState] = useState(
		normalizeHex(defaultValue),
	);
	const [isExpanded, setIsExpanded] = useState(false);

	const selectedColor = normalizeHex(value ?? selectedColorState);
	const palette = useMemo(
		() => Array.from(new Set(presets.map(normalizeHex))),
		[presets],
	);

	const springConfig = {
		type: "spring",
		stiffness: 250,
		damping: 30,
	} as const;

	const handleSelectColor = (nextColor: string) => {
		const normalized = normalizeHex(nextColor);
		if (value === undefined) {
			setSelectedColorState(normalized);
		}
		onChange?.(normalized);
	};

	return (
		<div className={`w-fit max-w-full font-sans ${className}`}>
			<div
				className={`bg-rb-neutral-3 p-1.5 rounded-[24px] w-fit max-w-full relative ${
					compact ? "min-w-[220px]" : ""
				}`}
			>
				<div
					className={`bg-rb-neutral-1 rounded-[18px] w-full overflow-hidden border border-rb-neutral-4 flex flex-col ${
						compact ? "p-4 gap-4" : "p-5 gap-5"
					}`}
				>
					<div className="flex items-center gap-4">
						<motion.div
							className={`rounded-[10px] border border-rb-neutral-4 shadow-sm ${
								compact ? "w-10 h-10" : "w-12 h-12"
							}`}
							animate={{ backgroundColor: selectedColor }}
							transition={{ duration: 0.2 }}
						/>
						<div className="flex flex-col gap-1 min-w-0">
							<span className="text-[10px] font-bold uppercase tracking-[0.1em] text-rb-accent-1/50">
								{label}
							</span>
							<code
								className={`text-rb-accent-1 font-mono bg-rb-neutral-4 px-2 py-0.5 rounded-[6px] break-all ${
									compact ? "text-sm" : "text-base"
								}`}
							>
								{selectedColor}
							</code>
						</div>
					</div>

					<div className="flex flex-col gap-2 pt-5 border-t border-rb-neutral-4">
						<div className="flex items-center gap-2">
							<button
								type="button"
								onClick={() => setIsExpanded(!isExpanded)}
								className="flex items-center justify-between flex-1 py-1 text-sm font-medium text-rb-accent-2/80 hover:text-rb-accent-1 transition-colors group outline-none focus-visible:ring-2 focus-visible:ring-rb-neutral-2 rounded-md"
							>
								<span>Color presets</span>
								<motion.div
									animate={{ rotate: isExpanded ? 180 : 0 }}
									transition={springConfig}
								>
									<svg
										width="16"
										height="16"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2.5"
										strokeLinecap="round"
										strokeLinejoin="round"
										className="text-rb-accent-1/40 group-hover:text-rb-accent-1 transition-colors"
									>
										<path d="M6 9l6 6 6-6" />
									</svg>
								</motion.div>
							</button>

							<label className="relative overflow-hidden shrink-0 px-3 py-1.5 rounded-full bg-rb-neutral-3 border border-rb-neutral-4 text-xs font-semibold uppercase tracking-[0.12em] text-rb-accent-2/70 hover:text-rb-accent-1 cursor-pointer transition-colors">
								<span>Pick</span>
								<input
									type="color"
									value={selectedColor}
									onChange={(event) =>
										handleSelectColor(event.target.value)
									}
									className="absolute inset-0 opacity-0 cursor-pointer"
									aria-label={`Pick ${label}`}
								/>
							</label>
						</div>

						<motion.div
							animate={{
								height: isExpanded ? "auto" : 0,
								opacity: isExpanded ? 1 : 0,
							}}
							transition={springConfig}
							className="overflow-hidden"
						>
							<div
								className={`flex gap-2 flex-wrap ${
									compact ? "w-[212px] pt-3 pb-1" : "w-[224px] pt-3 pb-1"
								}`}
							>
								{palette.map((color) => (
									<button
										key={color}
										type="button"
										onClick={() => handleSelectColor(color)}
										className={`rounded-lg border-2 transition-all duration-200 active:scale-90 ${
											compact ? "w-7 h-7" : "w-8 h-8"
										} ${
											selectedColor === color
												? "border-rb-accent-1 shadow-sm"
												: "border-transparent hover:scale-110"
										}`}
										style={{ backgroundColor: color }}
										aria-label={`Select ${color}`}
									/>
								))}
							</div>
						</motion.div>
					</div>
				</div>
			</div>
		</div>
	);
}
